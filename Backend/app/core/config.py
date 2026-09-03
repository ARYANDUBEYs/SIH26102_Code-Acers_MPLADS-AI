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

    # ML blend: how much weight the trained IsolationForest gets vs the rule-based
    # formula for financial/timeline scores. 0 = pure rules, 1 = pure ML.
    ML_BLEND_WEIGHT: float = 0.5
    DUPLICATE_TITLE_SIMILARITY_CUTOFF: float = 0.65
    OVERRUN_PROBABILITY_ALERT_CUTOFF: float = 0.65
    TAMPER_ELA_SUSPICION_CUTOFF: float = 35.0
    MAX_IMAGE_BYTES: int = 10 * 1024 * 1024

    # MongoDB. If MONGODB_URI is unset/unreachable, the app transparently falls
    # back to the in-memory SAMPLE_PROJECTS_DATABASE so it still runs standalone.
    MONGODB_URI: str = ""
    MONGODB_DB_NAME: str = "mplads_ai"

    # Alerting. If ALERT_WEBHOOK_URL is unset, alerts are just logged to console.
    ALERT_WEBHOOK_URL: str = ""

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = SystemSettings()
