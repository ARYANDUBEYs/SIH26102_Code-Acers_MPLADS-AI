"""
Pydantic Schemas matching the official MoSPI DigiGov MPLADS Portal Data Models.
"""
from pydantic import BaseModel, Field, model_validator
from typing import List, Optional, Dict, Any
from datetime import date
from enum import Enum

class RiskLevelEnum(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    CRITICAL = "CRITICAL"

class ProjectCategoryEnum(str, Enum):
    ROADS_BRIDGES = "Roads, Pathways and Bridges"
    DRINKING_WATER = "Drinking Water Facilities"
    EDUCATION = "Education Infrastructure"
    HEALTH = "Health and Family Welfare"
    COMMUNITY_ASSETS = "Community Assets & Halls"
    OTHER = "Other Public Amenities"

class ProjectRecord(BaseModel):
    project_id: str = Field(..., example="MPLAD-26-1021")
    title: str = Field(..., example="Rural Road Construction - Phase 2")
    state: str = Field(..., example="Maharashtra")
    district: str = Field(..., example="Nandurbar")
    constituency: str = Field(..., example="Nandurbar (ST)")
    category: ProjectCategoryEnum = ProjectCategoryEnum.ROADS_BRIDGES
    sanctioned_amount: float = Field(..., ge=0, description="Amount sanctioned in INR", example=4800000.0)
    funds_released: float = Field(..., ge=0, description="Amount released to implementing agency in INR", example=3850000.0)
    funds_utilized: float = Field(..., ge=0, description="Expenditure incurred so far in INR", example=3710000.0)
    physical_progress_pct: float = Field(..., ge=0.0, le=100.0, example=45.0)
    sanction_date: str = Field(..., example="2026-01-15")
    expected_completion_date: str = Field(..., example="2026-08-30")
    days_elapsed: int = Field(..., ge=0, example=215)
    allocated_duration_days: int = Field(..., gt=0, example=225)
    contractor_id: str = Field(..., example="VEN-8821")
    contractor_name: str = Field(..., example="ABC Infra Constructions Pvt Ltd")
    latitude: float = Field(..., ge=-90, le=90, example=21.3851)
    longitude: float = Field(..., ge=-180, le=180, example=74.9023)
    evidence_image_url: Optional[str] = None
    image_anomaly_score: float = Field(0.0, ge=0.0, le=100.0)

    @model_validator(mode="after")
    def validate_financial_consistency(self):
        if self.funds_released > self.sanctioned_amount + 1e-6:
            raise ValueError("funds_released cannot exceed sanctioned_amount")
        if self.funds_utilized > self.funds_released + 1e-6:
            raise ValueError("funds_utilized cannot exceed funds_released")
        return self

class RiskBreakdown(BaseModel):
    financial_drift_score: float
    timeline_delay_score: float
    image_anomaly_score: float
    vendor_risk_score: float

class ProjectRiskAssessment(BaseModel):
    project_id: str
    overall_risk_score: float = Field(..., ge=0.0, le=100.0, description="Composite Risk Index (0-100)")
    risk_level: RiskLevelEnum
    breakdown: RiskBreakdown
    explainable_flags: List[str]
    requires_manual_audit: bool
    recommended_action: str
    overrun_probability: float = Field(0.0, ge=0.0, le=1.0, description="ML-predicted probability project exceeds its allocated schedule")
    ml_anomaly_score: float = Field(0.0, ge=0.0, le=100.0, description="IsolationForest statistical anomaly score (0-100)")

class ImageAuditResponse(BaseModel):
    is_duplicate: bool
    similarity_score: float = Field(..., ge=0.0, le=1.0)
    gps_distance_meters: float
    is_location_valid: bool
    audit_verdict: str
    details: Dict[str, Any]

class CartelNode(BaseModel):
    id: str
    label: str
    type: str # "vendor" or "project"
    risk_level: str
    total_amount: Optional[float] = None

class CartelEdge(BaseModel):
    source: str
    target: str
    amount: float
    tender_id: str

class CartelMatrixResponse(BaseModel):
    district: str
    nodes: List[CartelNode]
    edges: List[CartelEdge]
    monopoly_vendors: List[Dict[str, Any]]
    flagged_clusters: List[Dict[str, Any]]


class RoleEnum(str, Enum):
    MP = "MP"
    STATE_NODAL = "STATE_NODAL"
    DISTRICT_AUTHORITY = "DISTRICT_AUTHORITY"
    MINISTRY = "MINISTRY"


class DuplicateWorkFlag(BaseModel):
    district: str
    project_id_a: str
    title_a: str
    project_id_b: str
    title_b: str
    similarity_score: float
    alert: str


class DashboardSummary(BaseModel):
    role: RoleEnum
    scope: str = Field(..., description="What this role's view is scoped to, e.g. a district or constituency name")
    total_projects: int
    critical_count: int
    medium_count: int
    low_count: int
    total_sanctioned_inr: float
    total_funds_at_risk_inr: float
    top_flagged_projects: List[ProjectRiskAssessment]
    duplicate_work_flags: List[DuplicateWorkFlag]


class ImportSummary(BaseModel):
    inserted_count: int
    skipped_count: int
    errors: List[str]
