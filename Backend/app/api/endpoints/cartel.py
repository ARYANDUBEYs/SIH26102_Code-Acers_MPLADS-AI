"""
Contractor Cartel & Network Analysis Endpoints
"""
from fastapi import APIRouter, Query
from app.models.schemas import CartelMatrixResponse
from app.services.cartel_detector import cartel_detector_service
from app.api.endpoints.analytics import SAMPLE_PROJECTS_DATABASE

router = APIRouter()

@router.get("/matrix", response_model=CartelMatrixResponse, tags=["Cartel & Network Analysis"])
async def get_district_cartel_matrix(district: str = Query("Nandurbar", description="District name to analyze")):
    district_projects = [p for p in SAMPLE_PROJECTS_DATABASE if p["district"].lower() == district.lower()]
    if not district_projects:
        district_projects = SAMPLE_PROJECTS_DATABASE
        
    return cartel_detector_service.analyze_district_cartels(district=district, projects_data=district_projects)
