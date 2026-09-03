"""
Contractor Cartel & Network Analysis Endpoints
"""
from fastapi import APIRouter, Query, HTTPException
from app.models.schemas import CartelMatrixResponse
from app.services.cartel_detector import cartel_detector_service
from app.db.mongo import project_store

router = APIRouter()

@router.get("/matrix", response_model=CartelMatrixResponse, tags=["Cartel & Network Analysis"])
async def get_district_cartel_matrix(district: str = Query("Nandurbar", description="District name to analyze")):
    all_projects = await project_store.list_projects()
    district_projects = [p for p in all_projects if p["district"].lower() == district.lower()]
    if not district_projects:
        raise HTTPException(status_code=404, detail=f"No projects found for district '{district}'.")

    return cartel_detector_service.analyze_district_cartels(district=district, projects_data=district_projects)
