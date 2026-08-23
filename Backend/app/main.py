"""
FastAPI Application Entry Point: MPLADS-AI Intelligence Engine
Serves both REST APIs and the Interactive Frontend Dashboard.
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.api.router import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    description="Automated Anomaly, Fraud and Inefficiency Detection Engine for MoSPI MPLADS Scheme."
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Backend API Routes
app.include_router(api_router, prefix=settings.API_V1_STR)

# Mount Interactive Frontend Dashboard
frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "Frontend"))
if os.path.exists(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
