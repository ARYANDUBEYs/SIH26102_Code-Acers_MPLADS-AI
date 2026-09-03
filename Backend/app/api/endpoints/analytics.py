"""
Project Anomaly & Risk Analytics Endpoints
Pre-seeded with realistic MoSPI DigiGov project records for live demonstration.
Reads/writes go through app.db.mongo.project_store, which transparently uses
MongoDB when configured or an in-memory list otherwise.
"""
import csv
import io
from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import List
from app.models.schemas import ProjectRecord, ProjectRiskAssessment, ImportSummary
from app.services.anomaly_scorer import anomaly_scorer_service
from app.db.mongo import project_store

router = APIRouter()

# Seed data used to bootstrap the store (Mongo, on first connect, or the
# in-memory fallback) — kept here since this is the canonical sample dataset.
SAMPLE_PROJECTS_DATABASE = [
    {
        "project_id": "MPLAD-26-1021",
        "title": "Rural Road Construction - Phase 2",
        "state": "Maharashtra",
        "district": "Nandurbar",
        "constituency": "Nandurbar (ST)",
        "category": "Roads, Pathways and Bridges",
        "sanctioned_amount": 4800000.0,
        "funds_released": 3850000.0,
        "funds_utilized": 3710000.0,
        "physical_progress_pct": 45.0,
        "sanction_date": "2026-01-15",
        "expected_completion_date": "2026-08-30",
        "days_elapsed": 215,
        "allocated_duration_days": 225,
        "contractor_id": "VEN-8821",
        "contractor_name": "ABC Infra Constructions Pvt Ltd",
        "latitude": 21.3851,
        "longitude": 74.9023
    },
    {
        "project_id": "MPLAD-26-2213",
        "title": "High School Laboratory Block Construction",
        "state": "Bihar",
        "district": "Gaya",
        "constituency": "Gaya (SC)",
        "category": "Education Infrastructure",
        "sanctioned_amount": 3150000.0,
        "funds_released": 1200000.0,
        "funds_utilized": 1150000.0,
        "physical_progress_pct": 38.0,
        "sanction_date": "2026-02-10",
        "expected_completion_date": "2026-10-15",
        "days_elapsed": 120,
        "allocated_duration_days": 240,
        "contractor_id": "VEN-4410",
        "contractor_name": "Magadh Builders & Co",
        "latitude": 24.7914,
        "longitude": 85.0002
    },
    {
        "project_id": "MPLAD-26-3314",
        "title": "Solar Powered Community Drinking Water System",
        "state": "Rajasthan",
        "district": "Barmer",
        "constituency": "Barmer",
        "category": "Drinking Water Facilities",
        "sanctioned_amount": 5120000.0,
        "funds_released": 4900000.0,
        "funds_utilized": 4800000.0,
        "physical_progress_pct": 20.0,
        "sanction_date": "2025-11-01",
        "expected_completion_date": "2026-06-30",
        "days_elapsed": 290,
        "allocated_duration_days": 240,
        "contractor_id": "VEN-8821",
        "contractor_name": "ABC Infra Constructions Pvt Ltd",
        "latitude": 25.7521,
        "longitude": 71.3967
    }
]

REQUIRED_CSV_COLUMNS = [
    "project_id", "title", "state", "district", "constituency", "category",
    "sanctioned_amount", "funds_released", "funds_utilized", "physical_progress_pct",
    "sanction_date", "expected_completion_date", "days_elapsed", "allocated_duration_days",
    "contractor_id", "contractor_name", "latitude", "longitude",
]


@router.get("/projects", response_model=List[ProjectRecord], tags=["Projects & Data"])
async def list_projects():
    records = await project_store.list_projects()
    return [ProjectRecord(**p) for p in records]


@router.post("/score-project", response_model=ProjectRiskAssessment, tags=["Projects & Data"])
async def score_project(project: ProjectRecord):
    # Determine synthetic visual anomaly factor for demo if project is #1021 or #3314
    image_risk = 92.0 if project.project_id == "MPLAD-26-1021" else (85.0 if project.project_id == "MPLAD-26-3314" else 0.0)
    vendor_risk = 80.0 if project.contractor_id == "VEN-8821" else 15.0

    return anomaly_scorer_service.calculate_project_risk(
        record=project,
        image_anomaly_factor=image_risk,
        vendor_historical_risk=vendor_risk
    )


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
