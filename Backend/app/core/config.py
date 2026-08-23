"""
Global Configuration & Mathematical Risk Parameters
Designed specifically for the Ministry of Statistics and Programme Implementation (MoSPI) MPLADS Scheme.
"""
from pydantic_settings import BaseSettings
from typing import Dict

class SystemSettings(BaseSettings):
    PROJECT_NAME: str = "MPLADS-AI Core Intelligence Engine"
    API_V1_STR: str = "/api/v1"
    DEBUG_MODE: bool = False
    
    # Mathematical Risk Weights (Sum = 1.0)
    WEIGHT_FINANCIAL_DRIFT: float = 0.35
    WEIGHT_TIMELINE_DELAY: float = 0.25
    WEIGHT_IMAGE_ANOMALY: float = 0.20
    WEIGHT_VENDOR_RISK: float = 0.20
    
    # Critical Operational Thresholds
    CRITICAL_RISK_THRESHOLD: float = 60.0
    MEDIUM_RISK_THRESHOLD: float = 30.0
    MAX_ALLOWED_GPS_DEVIATION_METERS: float = 150.0
    DUPLICATE_IMAGE_SIMILARITY_CUTOFF: float = 0.82
    VENDOR_MONOPOLY_CONCENTRATION_LIMIT: float = 0.35

    class Config:
        case_sensitive = True

settings = SystemSettings()
