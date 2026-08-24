"""
services/project_analysis.py
------------------------------
Orchestrates the full MPLAD Sentinel ML pipeline:

    1. Load all projects from the DB into a DataFrame
    2. Run financial, timeline, duplicate, and contractor detectors
    3. Combine into a risk score via ml/risk_engine.py
    4. Persist results into the project_analysis table
    5. Provide a helper to fetch a single project's cached analysis
       (including similar/nearby project lists) for the API layer.

This module is intentionally the only place that "wires together" the
individual ml/ modules, so main.py and the API layer stay thin.
"""

import json
from datetime import datetime, timezone

import pandas as pd
from sqlalchemy.orm import Session

from models import Project, ProjectAnalysis
from ml.financial import run_financial_anomaly_detection
from ml.timeline import run_timeline_anomaly_detection
from ml.similarity import run_duplicate_detection, CLOSE_DISTANCE_KM, SIMILARITY_THRESHOLDS, DEFAULT_SIMILARITY_THRESHOLD, haversine_km
from ml.contractor import run_contractor_anomaly_detection
from ml.risk_engine import compute_risk, compute_geographic_score


def _projects_to_dataframe(db: Session) -> pd.DataFrame:
    projects = db.query(Project).all()
    rows = [{
        "project_id": p.project_id,
        "project_name": p.project_name,
        "description": p.description,
        "state": p.state,
        "district": p.district,
        "latitude": p.latitude,
        "longitude": p.longitude,
        "category": p.category,
        "sanctioned_amount": p.sanctioned_amount,
        "actual_expenditure": p.actual_expenditure,
        "start_date": p.start_date,
        "completion_date": p.completion_date,
        "contractor": p.contractor,
        "reported_progress": p.reported_progress,
        "image_path": p.image_path,
    } for p in projects]
    return pd.DataFrame(rows)


def _nearby_projects(df: pd.DataFrame, top_n_per_project=5, max_distance_km=5.0):
    """Compute geographically nearby projects for every project (brute-force,
    fine for a demo dataset of <1000 rows)."""
    ids = df["project_id"].values
    names = df["project_name"].values
    lats = df["latitude"].values
    lons = df["longitude"].values
    n = len(df)

    nearby_map = {}
    for i in range(n):
        distances = []
        for j in range(n):
            if i == j:
                continue
            d = haversine_km(lats[i], lons[i], lats[j], lons[j])
            if d <= max_distance_km:
                distances.append((d, ids[j], names[j]))
        distances.sort(key=lambda x: x[0])
        nearby_map[ids[i]] = [
            {"project_id": pid, "project_name": pname, "distance_km": round(d, 2)}
            for d, pid, pname in distances[:top_n_per_project]
        ]
    return nearby_map


def run_full_analysis(db: Session) -> dict:
    """
    Runs the entire ML pipeline over all projects currently in the DB and
    (re)writes the project_analysis table. Returns a summary dict.
    """
    df = _projects_to_dataframe(db)
    if df.empty:
        return {"status": "no_data", "projects_analyzed": 0, "high_risk": 0, "medium_risk": 0, "low_risk": 0}

    financial_df = run_financial_anomaly_detection(df)
    timeline_df = run_timeline_anomaly_detection(df)
    duplicate_df, similar_map, embedding_method = run_duplicate_detection(df)
    contractor_df = run_contractor_anomaly_detection(df)
    nearby_map = _nearby_projects(df)

    merged = (
        df[["project_id"]]
        .merge(financial_df, on="project_id", how="left")
        .merge(timeline_df, on="project_id", how="left")
        .merge(duplicate_df, on="project_id", how="left")
        .merge(contractor_df, on="project_id", how="left")
    )

    counts = {"HIGH": 0, "MEDIUM": 0, "LOW": 0}
    now = datetime.now(timezone.utc)

    # Clear old analysis rows so re-running /api/analyze doesn't accumulate stale data
    db.query(ProjectAnalysis).delete()

    for _, row in merged.iterrows():
        pid = row["project_id"]
        similar_matches = similar_map.get(pid, [])
        active_threshold = SIMILARITY_THRESHOLDS.get(embedding_method, DEFAULT_SIMILARITY_THRESHOLD)
        has_close_duplicate = any(
            m["similarity"] >= active_threshold and m["distance_km"] <= CLOSE_DISTANCE_KM
            for m in similar_matches
        )
        geographic_score = compute_geographic_score(row["duplicate_score"], has_close_duplicate)

        result = compute_risk(
            financial_score=row["financial_anomaly_score"],
            timeline_score=row["timeline_anomaly_score"],
            duplicate_score=row["duplicate_score"],
            contractor_score=row["contractor_anomaly_score"],
            geographic_score=geographic_score,
            financial_reason=row["financial_explanation"],
            timeline_reason=row["timeline_explanation"],
            duplicate_reason=row["duplicate_explanation"],
            contractor_reason=row["contractor_explanation"],
        )
        counts[result["risk_level"]] += 1

        analysis = ProjectAnalysis(
            project_id=pid,
            risk_score=result["risk_score"],
            risk_level=result["risk_level"],
            financial_anomaly_score=row["financial_anomaly_score"],
            timeline_anomaly_score=row["timeline_anomaly_score"],
            duplicate_score=row["duplicate_score"],
            contractor_anomaly_score=row["contractor_anomaly_score"],
            geographic_score=geographic_score,
            financial_explanation=row["financial_explanation"],
            timeline_explanation=row["timeline_explanation"],
            duplicate_explanation=row["duplicate_explanation"],
            contractor_explanation=row["contractor_explanation"],
            reasons_json=json.dumps(result["reasons"]),
            similar_projects_json=json.dumps(similar_matches),
            nearby_projects_json=json.dumps(nearby_map.get(pid, [])),
            recommendation=result["recommendation"],
            updated_at=now,
        )
        db.add(analysis)

    db.commit()

    return {
        "status": "completed",
        "projects_analyzed": len(merged),
        "high_risk": counts["HIGH"],
        "medium_risk": counts["MEDIUM"],
        "low_risk": counts["LOW"],
        "embedding_method": embedding_method,
    }


def get_project_analysis(db: Session, project_id: str):
    """Fetch cached analysis for one project as a plain dict, or None."""
    analysis = db.query(ProjectAnalysis).filter(ProjectAnalysis.project_id == project_id).first()
    if not analysis:
        return None
    return {
        "risk_score": analysis.risk_score,
        "risk_level": analysis.risk_level,
        "financial_anomaly_score": analysis.financial_anomaly_score,
        "financial_explanation": analysis.financial_explanation,
        "timeline_anomaly_score": analysis.timeline_anomaly_score,
        "timeline_explanation": analysis.timeline_explanation,
        "duplicate_score": analysis.duplicate_score,
        "duplicate_explanation": analysis.duplicate_explanation,
        "contractor_anomaly_score": analysis.contractor_anomaly_score,
        "contractor_explanation": analysis.contractor_explanation,
        "geographic_score": analysis.geographic_score,
        "nearby_projects": json.loads(analysis.nearby_projects_json or "[]"),
        "similar_projects": json.loads(analysis.similar_projects_json or "[]"),
        "reasons": json.loads(analysis.reasons_json or "[]"),
        "recommendation": analysis.recommendation,
    }
