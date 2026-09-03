"""
Role-Scoped Dashboard Endpoint
---------------------------------
The problem statement calls out four distinct audiences — MP, State Nodal
Authority, District Authority, Ministry — each needing a view scoped to
their jurisdiction. This endpoint returns one summary payload, filtered by
role + scope, so a single frontend dashboard component can render all four
views by just changing the role/scope query params.

NOTE ON AUTH: this reads the role from a plain query param, not a verified
session/JWT — there's no user/login system in this codebase yet. Anyone
can currently ask for any role's view. That's fine for a hackathon demo but
is the first thing to fix before this touches real data: put a real auth
layer (e.g. OAuth via India Stack / a simple JWT issued after login) in
front of this endpoint and derive `role` + `scope` from the verified token
instead of trusting the query param.
"""
from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
from app.models.schemas import DashboardSummary, RoleEnum, ProjectRecord, DuplicateWorkFlag
from app.services.anomaly_scorer import anomaly_scorer_service
from app.ml.duplicate_detector import duplicate_work_detector
from app.db.mongo import project_store
from app.core.config import settings

router = APIRouter()

SCOPE_FIELD_BY_ROLE = {
    RoleEnum.MP: "constituency",
    RoleEnum.DISTRICT_AUTHORITY: "district",
    RoleEnum.STATE_NODAL: "state",
    RoleEnum.MINISTRY: None,  # unscoped — sees everything
}


@router.get("/summary", response_model=DashboardSummary, tags=["Dashboards"])
async def get_dashboard_summary(
    role: RoleEnum = Query(..., description="Which persona's view to render"),
    scope: Optional[str] = Query(None, description="Constituency (MP), district (District Authority), or state (State Nodal). Ignored/omit for MINISTRY."),
):
    scope_field = SCOPE_FIELD_BY_ROLE[role]
    if scope_field and not scope:
        raise HTTPException(status_code=422, detail=f"role={role} requires a 'scope' value ({scope_field}).")

    all_projects = await project_store.list_projects()
    if scope_field:
        in_scope = [p for p in all_projects if p[scope_field].lower() == scope.lower()]
        if not in_scope:
            raise HTTPException(status_code=404, detail=f"No projects found for {scope_field}='{scope}'.")
    else:
        in_scope = all_projects
        scope = "ALL_INDIA"

    assessments = []
    for p in in_scope:
        record = ProjectRecord(**p)
        vendor_funds = sum(float(x["sanctioned_amount"]) for x in all_projects if x["contractor_id"] == record.contractor_id)
        total_funds = sum(float(x["sanctioned_amount"]) for x in all_projects) or 1.0
        vendor_risk = min(100.0, (vendor_funds / total_funds) * 200.0)
        assessments.append(anomaly_scorer_service.calculate_project_risk(record, 0.0, vendor_risk))

    critical = [a for a in assessments if a.risk_level == "CRITICAL"]
    medium = [a for a in assessments if a.risk_level == "MEDIUM"]
    low = [a for a in assessments if a.risk_level == "LOW"]

    total_sanctioned = sum(p["sanctioned_amount"] for p in in_scope)
    at_risk_ids = {a.project_id for a in critical + medium}
    total_at_risk = sum(p["sanctioned_amount"] for p in in_scope if p["project_id"] in at_risk_ids)

    top_flagged = sorted(assessments, key=lambda a: a.overall_risk_score, reverse=True)[:5]

    dup_flags_raw = duplicate_work_detector.find_near_duplicates(in_scope, settings.DUPLICATE_TITLE_SIMILARITY_CUTOFF)
    dup_flags = [DuplicateWorkFlag(**d) for d in dup_flags_raw]

    return DashboardSummary(
        role=role,
        scope=scope,
        total_projects=len(in_scope),
        critical_count=len(critical),
        medium_count=len(medium),
        low_count=len(low),
        total_sanctioned_inr=total_sanctioned,
        total_funds_at_risk_inr=total_at_risk,
        top_flagged_projects=top_flagged,
        duplicate_work_flags=dup_flags,
    )
