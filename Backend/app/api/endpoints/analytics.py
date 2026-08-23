"""
Project Anomaly & Risk Analytics Endpoints
Pre-seeded with realistic MoSPI DigiGov project records for live demonstration.
"""
from fastapi import APIRouter, HTTPException
from typing import List
from app.models.schemas import ProjectRecord, ProjectRiskAssessment
from app.services.anomaly_scorer import anomaly_scorer_service

router = APIRouter()

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

@router.get("/projects", response_model=List[ProjectRecord], tags=["Projects & Data"])
async def list_projects():
    return [ProjectRecord(**p) for p in SAMPLE_PROJECTS_DATABASE]

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
    match = next((p for p in SAMPLE_PROJECTS_DATABASE if p["project_id"] == project_id), None)
    if not match:
        raise HTTPException(status_code=404, detail="Project ID not found in database.")
    
    record = ProjectRecord(**match)
    return await score_project(record)
