"""
API Router Aggregator
"""
from fastapi import APIRouter
from app.api.endpoints import health, forensics, cartel, analytics

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(forensics.router, prefix="/forensics")
api_router.include_router(cartel.router, prefix="/cartel")
api_router.include_router(analytics.router, prefix="/analytics")
