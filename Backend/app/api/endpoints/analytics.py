"""
Project Anomaly & Risk Analytics Endpoints
Pre-seeded with realistic MoSPI DigiGov project records for live demonstration.
Reads/writes go through app.db.mongo.project_store, which transparently uses
MongoDB when configured or an in-memory list otherwise.
"""
import csv
from datetime import datetime
import io
from fastapi import APIRouter, HTTPException, UploadFile, File, Query
from typing import List
from app.models.schemas import ProjectRecord, ProjectRiskAssessment, ImportSummary
from app.services.anomaly_scorer import anomaly_scorer_service
from app.db.mongo import project_store

router = APIRouter()

from app.db.data_generator import COMPREHENSIVE_PROJECTS_DATABASE

# Comprehensive seed data used to bootstrap the store (Mongo, on first connect, or
# in-memory fallback) — 65+ realistic projects covering all 5 sectors & key districts.
SAMPLE_PROJECTS_DATABASE = COMPREHENSIVE_PROJECTS_DATABASE


REQUIRED_CSV_COLUMNS = [
    "project_id", "title", "state", "district", "constituency", "category",
    "sanctioned_amount", "funds_released", "funds_utilized", "physical_progress_pct",
    "sanction_date", "expected_completion_date", "days_elapsed", "allocated_duration_days",
    "contractor_id", "contractor_name", "latitude", "longitude",
]


@router.get("/projects", response_model=List[ProjectRecord], tags=["Projects & Data"])
async def list_projects(
    state: str | None = Query(None),
    district: str | None = Query(None),
    search: str | None = Query(None),
):
    records = await project_store.list_projects()
    if state and state.upper() != "ALL":
        records = [p for p in records if p["state"].lower() == state.lower()]
    if district and district.upper() != "ALL":
        records = [p for p in records if p["district"].lower() == district.lower()]
    if search:
        q = search.lower()
        records = [p for p in records if q in p["project_id"].lower() or q in p["title"].lower() or q in p["contractor_name"].lower() or q in p["district"].lower() or q in p["state"].lower()]
    return [ProjectRecord(**p) for p in records]


@router.post("/score-project", response_model=ProjectRiskAssessment, tags=["Projects & Data"])
async def score_project(project: ProjectRecord):
    records = await project_store.list_projects()
    total_funds = sum(float(p["sanctioned_amount"]) for p in records) or 1.0
    vendor_funds = sum(float(p["sanctioned_amount"]) for p in records if p["contractor_id"] == project.contractor_id)
    vendor_risk = min(100.0, (vendor_funds / total_funds) * 200.0)
    return anomaly_scorer_service.calculate_project_risk(record=project, image_anomaly_factor=0.0, vendor_historical_risk=vendor_risk)


@router.get("/score-project/{project_id}", response_model=ProjectRiskAssessment, tags=["Projects & Data"])
async def score_project_by_id(project_id: str):
    match = await project_store.get_project(project_id)
    if not match:
        raise HTTPException(status_code=404, detail="Project ID not found in database.")

    record = ProjectRecord(**match)
    return await score_project(record)


@router.post("/projects/import", response_model=ImportSummary, tags=["Projects & Data"])
async def import_projects_csv(file: UploadFile = File(..., description="CSV of MPLADS project records")):
    """
    Bulk-ingests real project data from a CSV export (e.g. from the MoSPI
    DigiGov portal). Expected columns: see REQUIRED_CSV_COLUMNS. Rows with
    missing/invalid required fields are skipped and reported, not silently
    dropped, so a bad import doesn't look like a successful empty one.
    """
    raw = (await file.read()).decode("utf-8-sig")
    reader = csv.DictReader(io.StringIO(raw))

    missing_cols = [c for c in REQUIRED_CSV_COLUMNS if c not in (reader.fieldnames or [])]
    if missing_cols:
        raise HTTPException(status_code=422, detail=f"CSV missing required columns: {missing_cols}")

    valid_rows = []
    errors = []
    for i, row in enumerate(reader, start=2):  # row 1 is the header
        try:
            record = ProjectRecord(
                project_id=row["project_id"],
                title=row["title"],
                state=row["state"],
                district=row["district"],
                constituency=row["constituency"],
                category=row["category"],
                sanctioned_amount=float(row["sanctioned_amount"]),
                funds_released=float(row["funds_released"]),
                funds_utilized=float(row["funds_utilized"]),
                physical_progress_pct=float(row["physical_progress_pct"]),
                sanction_date=row["sanction_date"],
                expected_completion_date=row["expected_completion_date"],
                days_elapsed=int(row["days_elapsed"]),
                allocated_duration_days=int(row["allocated_duration_days"]),
                contractor_id=row["contractor_id"],
                contractor_name=row["contractor_name"],
                latitude=float(row["latitude"]),
                longitude=float(row["longitude"]),
            )
            valid_rows.append(record.model_dump())
        except Exception as e:
            errors.append(f"Row {i}: {e}")

    inserted = await project_store.insert_projects(valid_rows)
    return ImportSummary(
        inserted_count=inserted,
        skipped_count=len(errors),
        errors=errors[:20],  # cap so one badly-formed file doesn't blow up the response
    )


@router.post("/projects/{project_id}/decision", tags=["Projects & Data"])
async def update_project_decision(project_id: str, decision: str, remarks: str = ""):
    project = await project_store.update_project(project_id, {
        "status": decision,
        "decision_remarks": remarks,
        "last_decision_at": datetime.utcnow().isoformat(),
    })
    if not project:
        raise HTTPException(status_code=404, detail="Project ID not found.")
    return {"success": True, "data": project}


@router.post("/estimate-cost", tags=["Machine Learning"])
async def estimate_project_cost(
    category: str = Query("Roads, Pathways and Bridges"),
    duration_days: int = Query(180),
    target_beneficiaries: int = Query(3500),
    work_scale_units: float = Query(15.0),
    district_tier: int = Query(2),
    sanctioned_amount: float | None = Query(None)
):
    """
    XGBoost Price Estimation & Fair Cost Benchmark Engine.
    Estimates fair market sanctioned value and flags over-invoicing if sanctioned_amount is provided.
    """
    from app.ml.cost_predictor import cost_predictor_service
    if sanctioned_amount is not None:
        return cost_predictor_service.evaluate_project_pricing(
            sanctioned_amount=sanctioned_amount,
            category=category,
            duration_days=duration_days,
            target_beneficiaries=target_beneficiaries,
            work_scale_units=work_scale_units,
            district_tier=district_tier
        )
    return cost_predictor_service.estimate_fair_cost(
        category=category,
        duration_days=duration_days,
        target_beneficiaries=target_beneficiaries,
        work_scale_units=work_scale_units,
        district_tier=district_tier
    )


@router.post("/predict-overrun", tags=["Machine Learning"])
async def predict_project_overrun(
    time_ratio: float = Query(..., description="days_elapsed / allocated_duration_days"),
    physical_ratio: float = Query(..., description="physical_progress_pct / 100.0"),
    financial_drift: float = Query(..., description="disbursement_ratio - physical_ratio")
):
    """
    XGBoost Overrun Risk Predictor.
    Predicts probability of project schedule delay and uncovers pace-lag factors.
    """
    from app.ml.overrun_predictor import overrun_predictor_service
    prob = overrun_predictor_service.predict_overrun_probability(
        time_ratio=time_ratio,
        physical_ratio=physical_ratio,
        financial_drift=financial_drift
    )
    factors = overrun_predictor_service.get_risk_factors(
        time_ratio=time_ratio,
        physical_ratio=physical_ratio,
        financial_drift=financial_drift
    )
    return {
        "overrun_probability": prob,
        "overrun_risk_tier": "CRITICAL_RISK" if prob > 0.70 else "HIGH_RISK" if prob > 0.45 else "MODERATE_RISK" if prob > 0.20 else "LOW_RISK",
        "contributing_factors": factors,
        "model_engine": "XGBoost Classifier (v3.4.1)"
    }

