"""
models.py
---------
SQLAlchemy ORM models for MPLAD Sentinel.

Two tables:
- Project        : raw MPLADS-style project records (synthetic demo data)
- ProjectAnalysis: cached ML/risk-engine output for each project, so the
                   API doesn't need to re-run detection on every request.
"""

from sqlalchemy import Column, Integer, Float, String, Text, DateTime
from database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String, unique=True, index=True, nullable=False)
    project_name = Column(String, nullable=False)
    description = Column(Text, nullable=False)

    state = Column(String, index=True)
    district = Column(String, index=True)
    latitude = Column(Float)
    longitude = Column(Float)

    category = Column(String, index=True)

    sanctioned_amount = Column(Float)
    actual_expenditure = Column(Float)

    start_date = Column(String)       # stored as ISO date string for demo simplicity
    completion_date = Column(String)

    contractor = Column(String, index=True)
    reported_progress = Column(Float)  # 0-100
    image_path = Column(String, nullable=True)

    is_synthetic = Column(Integer, default=1)  # always 1 for this demo, kept explicit


class ProjectAnalysis(Base):
    """
    Cached output of the ML pipeline for a single project.
    Populated by services/project_analysis.py after running detectors.
    """
    __tablename__ = "project_analysis"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String, unique=True, index=True, nullable=False)

    risk_score = Column(Float, default=0.0)
    risk_level = Column(String, default="LOW")  # LOW / MEDIUM / HIGH

    financial_anomaly_score = Column(Float, default=0.0)
    timeline_anomaly_score = Column(Float, default=0.0)
    duplicate_score = Column(Float, default=0.0)
    contractor_anomaly_score = Column(Float, default=0.0)
    geographic_score = Column(Float, default=0.0)

    financial_explanation = Column(Text, default="")
    timeline_explanation = Column(Text, default="")
    duplicate_explanation = Column(Text, default="")
    contractor_explanation = Column(Text, default="")

    reasons_json = Column(Text, default="[]")          # JSON-encoded list[str]
    similar_projects_json = Column(Text, default="[]")  # JSON-encoded list[dict]
    nearby_projects_json = Column(Text, default="[]")   # JSON-encoded list[dict]

    recommendation = Column(Text, default="")
    updated_at = Column(DateTime, nullable=True)
