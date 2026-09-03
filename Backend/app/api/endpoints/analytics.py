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

# Seed data used to bootstrap the store (Mongo, on first connect, or the
# in-memory fallback) — kept here since this is the canonical sample dataset.
SAMPLE_PROJECTS_DATABASE = [
    {
        "project_id": "MPLAD-2026-00124",
        "title": "Rural Road Construction & Paver Block Laying",
        "state": "Uttar Pradesh",
        "district": "Varanasi",
        "constituency": "Shri Narendra Modi (Varanasi PC)",
        "category": "Roads, Pathways and Bridges",
        "sanctioned_amount": 4800000.0,
        "funds_released": 3200000.0,
        "funds_utilized": 2100000.0,
        "physical_progress_pct": 45.0,
        "sanction_date": "2025-08-15",
        "expected_completion_date": "2026-03-31",
        "days_elapsed": 337,
        "allocated_duration_days": 228,
        "contractor_id": "VEN-8899",
        "contractor_name": "Apex Infra & BuildTech Pvt Ltd",
        "latitude": 25.3176,
        "longitude": 82.9739,
        "evidence_image_url": "/evidence/MPLAD-2026-00124.svg",
        "image_anomaly_score": 96.0
    },
    {
        "project_id": "MPLAD-2026-00231",
        "title": "Multi-purpose Community Hall Construction",
        "state": "Delhi",
        "district": "North West Delhi",
        "constituency": "Dr. Harsh Vardhan (Chandni Chowk)",
        "category": "Community Assets & Halls",
        "sanctioned_amount": 3200000.0,
        "funds_released": 2800000.0,
        "funds_utilized": 1400000.0,
        "physical_progress_pct": 35.0,
        "sanction_date": "2025-06-10",
        "expected_completion_date": "2026-02-28",
        "days_elapsed": 415,
        "allocated_duration_days": 263,
        "contractor_id": "VEN-4995",
        "contractor_name": "Vanguard Civilcon LLP",
        "latitude": 28.7041,
        "longitude": 77.1025,
        "evidence_image_url": "/evidence/MPLAD-2026-00231.svg",
        "image_anomaly_score": 0
    },
    {
        "project_id": "MPLAD-2026-00451",
        "title": "Solar Drinking Water RO Plant & Borewell",
        "state": "Rajasthan",
        "district": "Banswara",
        "constituency": "Shri Kanakmal Katara",
        "category": "Drinking Water Facilities",
        "sanctioned_amount": 5100000.0,
        "funds_released": 4500000.0,
        "funds_utilized": 4100000.0,
        "physical_progress_pct": 88.0,
        "sanction_date": "2025-04-12",
        "expected_completion_date": "2025-12-31",
        "days_elapsed": 471,
        "allocated_duration_days": 263,
        "contractor_id": "VEN-4676",
        "contractor_name": "SunPower Aqua Solutions",
        "latitude": 23.5461,
        "longitude": 74.4373,
        "evidence_image_url": "/evidence/MPLAD-2026-00451.svg",
        "image_anomaly_score": 98.0
    },
    {
        "project_id": "MPLAD-2026-00089",
        "title": "Digital Smart Classroom Lab & Computer Setup",
        "state": "Bihar",
        "district": "Patna",
        "constituency": "Shri Ravi Shankar Prasad",
        "category": "Education Infrastructure",
        "sanctioned_amount": 1800000.0,
        "funds_released": 1800000.0,
        "funds_utilized": 1750000.0,
        "physical_progress_pct": 100.0,
        "sanction_date": "2025-09-01",
        "expected_completion_date": "2026-01-30",
        "days_elapsed": 151,
        "allocated_duration_days": 151,
        "contractor_id": "VEN-7624",
        "contractor_name": "EdTech Next India Ltd",
        "latitude": 25.5941,
        "longitude": 85.1376,
        "evidence_image_url": "/evidence/MPLAD-2026-00089.svg",
        "image_anomaly_score": 0
    },
    {
        "project_id": "MPLAD-2026-00342",
        "title": "Primary Health Centre (PHC) Medical Oxygen Pipeline",
        "state": "Maharashtra",
        "district": "Pune",
        "constituency": "Smt. Supriya Sule",
        "category": "Health and Family Welfare",
        "sanctioned_amount": 6400000.0,
        "funds_released": 5000000.0,
        "funds_utilized": 4800000.0,
        "physical_progress_pct": 100.0,
        "sanction_date": "2025-03-15",
        "expected_completion_date": "2025-10-30",
        "days_elapsed": 229,
        "allocated_duration_days": 229,
        "contractor_id": "VEN-9306",
        "contractor_name": "Lifecare Gas Grid Corp",
        "latitude": 18.5204,
        "longitude": 73.8567,
        "evidence_image_url": "/evidence/MPLAD-2026-00342.svg",
        "image_anomaly_score": 0
    },
    {
        "project_id": "MPLAD-2026-00518",
        "title": "High-Mast LED Street Lighting (50 Junctions)",
        "state": "Assam",
        "district": "Kamrup Metro",
        "constituency": "Smt. Queen Oja",
        "category": "Other Public Amenities",
        "sanctioned_amount": 2900000.0,
        "funds_released": 2900000.0,
        "funds_utilized": 1200000.0,
        "physical_progress_pct": 40.0,
        "sanction_date": "2025-07-22",
        "expected_completion_date": "2026-04-30",
        "days_elapsed": 367,
        "allocated_duration_days": 282,
        "contractor_id": "VEN-8899",
        "contractor_name": "Apex Infra & BuildTech Pvt Ltd",
        "latitude": 26.1445,
        "longitude": 91.7362,
        "evidence_image_url": "/evidence/MPLAD-2026-00518.svg",
        "image_anomaly_score": 0
    }
]

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
