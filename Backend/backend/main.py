"""
main.py
-------
MPLAD Sentinel — hackathon demo backend (SIH26102).

AI-powered system to surface anomalies, potential fraud indicators, and
inefficiencies in MPLADS-style project implementation, using SYNTHETIC
DEMO DATA ONLY.

Run with:
    uvicorn main:app --reload

On first run (empty DB) this will automatically:
    1. Generate synthetic demo data (data/generate_demo_data.py)
    2. Load it into SQLite
    3. Run the full ML pipeline to populate risk scores

See README.md for full setup instructions.
"""

import os
import csv
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, get_db, init_db, Base
from models import Project, ProjectAnalysis
from schemas import (
    ProjectOut, ProjectWithRiskOut, ProjectAnalysisOut, DashboardSummaryOut,
    AnalyzeRequest, AnalyzeResponse, SimilarProjectOut, NearbyProjectOut,
)
from services.project_analysis import run_full_analysis, get_project_analysis
from data.generate_demo_data import generate_projects, DEFAULT_SEED

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "data", "projects.csv")


# ---------------------------------------------------------------------------
# Data loading helpers
# ---------------------------------------------------------------------------
def _load_csv_into_db(db: Session, rows):
    db.query(ProjectAnalysis).delete()
    db.query(Project).delete()
    db.commit()

    for row in rows:
        project = Project(
            project_id=row["project_id"],
            project_name=row["project_name"],
            description=row["description"],
            state=row["state"],
            district=row["district"],
            latitude=float(row["latitude"]),
            longitude=float(row["longitude"]),
            category=row["category"],
            sanctioned_amount=float(row["sanctioned_amount"]),
            actual_expenditure=float(row["actual_expenditure"]),
            start_date=row["start_date"],
            completion_date=row["completion_date"],
            contractor=row["contractor"],
            reported_progress=float(row["reported_progress"]),
            image_path=row.get("image_path"),
            is_synthetic=1,
        )
        db.add(project)
    db.commit()


def ensure_demo_data_and_analysis(force_regenerate=False):
    """
    Idempotent bootstrap: makes sure the DB has synthetic project data and
    a fresh ML analysis. Safe to call on every app startup.
    """
    from database import SessionLocal

    init_db()
    db = SessionLocal()
    try:
        project_count = db.query(Project).count()

        if project_count == 0 or force_regenerate:
            if force_regenerate or not os.path.exists(CSV_PATH):
                rows = generate_projects(n_projects=800, seed=DEFAULT_SEED)
            else:
                with open(CSV_PATH, newline="", encoding="utf-8") as f:
                    rows = list(csv.DictReader(f))
            _load_csv_into_db(db, rows)

        analysis_count = db.query(ProjectAnalysis).count()
        if analysis_count == 0 or force_regenerate:
            run_full_analysis(db)
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    ensure_demo_data_and_analysis()
    yield


app = FastAPI(
    title="MPLAD Sentinel API (Demo)",
    description=(
        "Hackathon prototype (SIH26102) for detecting anomalies and inefficiencies "
        "in MPLADS-style project implementation. All data is SYNTHETIC DEMO DATA."
    ),
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # relaxed for hackathon demo; tighten for real deployments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _project_to_out(p: Project) -> ProjectOut:
    return ProjectOut.model_validate(p)


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "MPLAD Sentinel (Demo)",
        "data_notice": "SYNTHETIC DEMO DATA — for hackathon demonstration only.",
    }


@app.get("/api/projects", response_model=list[ProjectWithRiskOut])
def list_projects(
    db: Session = Depends(get_db),
    state: str | None = None,
    district: str | None = None,
    category: str | None = None,
    contractor: str | None = None,
    risk_level: str | None = Query(None, pattern="^(LOW|MEDIUM|HIGH)$"),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
):
    query = db.query(Project, ProjectAnalysis).outerjoin(
        ProjectAnalysis, Project.project_id == ProjectAnalysis.project_id
    )
    if state:
        query = query.filter(Project.state == state)
    if district:
        query = query.filter(Project.district == district)
    if category:
        query = query.filter(Project.category == category)
    if contractor:
        query = query.filter(Project.contractor == contractor)
    if risk_level:
        query = query.filter(ProjectAnalysis.risk_level == risk_level)

    rows = query.offset(offset).limit(limit).all()

    results = []
    for p, risk in rows:
        risk_score = risk.risk_score if risk else 0.0
        level = risk.risk_level if risk else "LOW"
        out = ProjectWithRiskOut(**_project_to_out(p).model_dump(), risk_score=risk_score, risk_level=level)
        results.append(out)

    return results


@app.get("/api/projects/high-risk", response_model=list[ProjectWithRiskOut])
def high_risk_projects(
    db: Session = Depends(get_db),
    limit: int = Query(50, ge=1, le=500),
):
    analyses = (
        db.query(ProjectAnalysis)
        .filter(ProjectAnalysis.risk_level == "HIGH")
        .order_by(ProjectAnalysis.risk_score.desc())
        .limit(limit)
        .all()
    )
    project_ids = [a.project_id for a in analyses]
    projects = {p.project_id: p for p in db.query(Project).filter(Project.project_id.in_(project_ids)).all()}

    results = []
    for a in analyses:
        p = projects.get(a.project_id)
        if not p:
            continue
        out = ProjectWithRiskOut(**_project_to_out(p).model_dump(), risk_score=a.risk_score, risk_level=a.risk_level)
        results.append(out)
    return results


@app.get("/api/projects/{project_id}", response_model=ProjectWithRiskOut)
def get_project(project_id: str, db: Session = Depends(get_db)):
    p = db.query(Project).filter(Project.project_id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail=f"Project '{project_id}' not found.")
    risk = db.query(ProjectAnalysis).filter(ProjectAnalysis.project_id == project_id).first()
    risk_score = risk.risk_score if risk else 0.0
    level = risk.risk_level if risk else "LOW"
    return ProjectWithRiskOut(**_project_to_out(p).model_dump(), risk_score=risk_score, risk_level=level)


@app.get("/api/projects/{project_id}/analysis", response_model=ProjectAnalysisOut)
def get_analysis(project_id: str, db: Session = Depends(get_db)):
    p = db.query(Project).filter(Project.project_id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail=f"Project '{project_id}' not found.")

    analysis = get_project_analysis(db, project_id)
    if not analysis:
        raise HTTPException(
            status_code=404,
            detail=f"No analysis found for '{project_id}'. Try POST /api/analyze first.",
        )

    return ProjectAnalysisOut(
        project=_project_to_out(p),
        risk_score=analysis["risk_score"],
        risk_level=analysis["risk_level"],
        financial_anomaly_score=analysis["financial_anomaly_score"],
        financial_explanation=analysis["financial_explanation"],
        timeline_anomaly_score=analysis["timeline_anomaly_score"],
        timeline_explanation=analysis["timeline_explanation"],
        duplicate_score=analysis["duplicate_score"],
        duplicate_explanation=analysis["duplicate_explanation"],
        contractor_anomaly_score=analysis["contractor_anomaly_score"],
        contractor_explanation=analysis["contractor_explanation"],
        geographic_score=analysis["geographic_score"],
        nearby_projects=[NearbyProjectOut(**n) for n in analysis["nearby_projects"]],
        similar_projects=[SimilarProjectOut(**s) for s in analysis["similar_projects"]],
        reasons=analysis["reasons"],
        recommendation=analysis["recommendation"],
    )


@app.get("/api/projects/{project_id}/similar", response_model=list[SimilarProjectOut])
def get_similar(project_id: str, db: Session = Depends(get_db)):
    p = db.query(Project).filter(Project.project_id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail=f"Project '{project_id}' not found.")

    analysis = get_project_analysis(db, project_id)
    if not analysis:
        raise HTTPException(status_code=404, detail=f"No analysis found for '{project_id}'.")

    return [SimilarProjectOut(**s) for s in analysis["similar_projects"]]


@app.get("/api/dashboard/summary", response_model=DashboardSummaryOut)
def dashboard_summary(db: Session = Depends(get_db)):
    total_projects = db.query(Project).count()

    high_risk = db.query(ProjectAnalysis).filter(ProjectAnalysis.risk_level == "HIGH").count()
    medium_risk = db.query(ProjectAnalysis).filter(ProjectAnalysis.risk_level == "MEDIUM").count()
    low_risk = db.query(ProjectAnalysis).filter(ProjectAnalysis.risk_level == "LOW").count()

    projects = db.query(Project).all()
    total_sanctioned = sum(p.sanctioned_amount for p in projects)
    total_expenditure = sum(p.actual_expenditure for p in projects)

    # "Anomalies detected" = projects where at least one component score is significant
    anomalies_detected = (
        db.query(ProjectAnalysis)
        .filter(
            (ProjectAnalysis.financial_anomaly_score >= 55)
            | (ProjectAnalysis.timeline_anomaly_score >= 55)
            | (ProjectAnalysis.duplicate_score >= 55)
            | (ProjectAnalysis.contractor_anomaly_score >= 55)
        )
        .count()
    )

    return DashboardSummaryOut(
        total_projects=total_projects,
        high_risk=high_risk,
        medium_risk=medium_risk,
        low_risk=low_risk,
        total_sanctioned_amount=round(total_sanctioned, 2),
        total_expenditure=round(total_expenditure, 2),
        anomalies_detected=anomalies_detected,
    )


@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest = AnalyzeRequest(), db: Session = Depends(get_db)):
    """
    Re-runs the full ML pipeline over all projects currently in the DB.

    If force_regenerate_data is true, brand-new synthetic data is generated
    first (still deterministic via the fixed random seed unless the
    generator is called with a different seed directly).

    Note: project_ids filtering is accepted for API completeness, but this
    demo always re-analyzes the full dataset since detectors like duplicate
    detection and contractor concentration are inherently relative to the
    whole dataset, not a single project in isolation.
    """
    if request.force_regenerate_data:
        ensure_demo_data_and_analysis(force_regenerate=True)
    else:
        run_full_analysis(db)

    high = db.query(ProjectAnalysis).filter(ProjectAnalysis.risk_level == "HIGH").count()
    medium = db.query(ProjectAnalysis).filter(ProjectAnalysis.risk_level == "MEDIUM").count()
    low = db.query(ProjectAnalysis).filter(ProjectAnalysis.risk_level == "LOW").count()
    total = db.query(Project).count()

    return AnalyzeResponse(
        status="completed",
        projects_analyzed=total,
        high_risk=high,
        medium_risk=medium,
        low_risk=low,
        message="ML pipeline executed: financial, timeline, duplicate, and contractor detectors "
                "were run on the current SYNTHETIC dataset and risk scores were recalculated.",
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
