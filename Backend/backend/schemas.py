"""
schemas.py
----------
Pydantic models used for API responses/requests.
Kept separate from the SQLAlchemy models (models.py) so DB structure
and API contract can evolve independently.
"""

from pydantic import BaseModel
from typing import List, Optional


class ProjectOut(BaseModel):
    project_id: str
    project_name: str
    description: str
    state: str
    district: str
    latitude: float
    longitude: float
    category: str
    sanctioned_amount: float
    actual_expenditure: float
    start_date: str
    completion_date: str
    contractor: str
    reported_progress: float
    image_path: Optional[str] = None

    class Config:
        from_attributes = True


class ProjectWithRiskOut(ProjectOut):
    risk_score: float
    risk_level: str


class SimilarProjectOut(BaseModel):
    project_id: str
    project_name: str
    similarity: float
    distance_km: Optional[float] = None
    note: str


class NearbyProjectOut(BaseModel):
    project_id: str
    project_name: str
    distance_km: float


class ProjectAnalysisOut(BaseModel):
    project: ProjectOut

    risk_score: float
    risk_level: str

    financial_anomaly_score: float
    financial_explanation: str

    timeline_anomaly_score: float
    timeline_explanation: str

    duplicate_score: float
    duplicate_explanation: str

    contractor_anomaly_score: float
    contractor_explanation: str

    geographic_score: float

    nearby_projects: List[NearbyProjectOut] = []
    similar_projects: List[SimilarProjectOut] = []

    reasons: List[str] = []
    recommendation: str


class DashboardSummaryOut(BaseModel):
    total_projects: int
    high_risk: int
    medium_risk: int
    low_risk: int
    total_sanctioned_amount: float
    total_expenditure: float
    anomalies_detected: int
    data_notice: str = "SYNTHETIC DEMO DATA — for hackathon demonstration only."


class AnalyzeRequest(BaseModel):
    """Optional body for POST /api/analyze. Empty body re-analyzes everything."""
    project_ids: Optional[List[str]] = None
    force_regenerate_data: Optional[bool] = False


class AnalyzeResponse(BaseModel):
    status: str
    projects_analyzed: int
    high_risk: int
    medium_risk: int
    low_risk: int
    message: str
