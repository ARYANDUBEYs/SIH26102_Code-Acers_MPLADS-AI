"""
System Health & Readiness Probe Endpoint
"""
from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()

@router.get("/health", tags=["System Health"])
async def check_health():
    return {
        "status": "HEALTHY",
        "service": settings.PROJECT_NAME,
        "engine_version": "1.0.0-SIH2026",
        "active_models": [
            "Perceptual Image Forensics Engine",
            "Bipartite Cartel Network Analyzer",
            "Multi-Factor MoSPI Anomaly Scorer"
        ]
    }
