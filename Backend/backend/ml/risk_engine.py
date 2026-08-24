"""
ml/risk_engine.py
------------------
Combines the four anomaly signals (financial, timeline, duplicate,
contractor) plus a geographic-cluster signal into a single 0-100 risk
score with a categorical risk level and human-readable reasons.

IMPORTANT: the risk score means "this project may warrant closer
investigation." It is NOT a fraud determination. Language throughout
this module deliberately avoids asserting fraud.

Weights (must sum to 1.0):
    financial   = 0.30
    timeline    = 0.20
    duplicate   = 0.25
    contractor  = 0.15
    geographic  = 0.10
"""

WEIGHTS = {
    "financial": 0.30,
    "timeline": 0.20,
    "duplicate": 0.25,
    "contractor": 0.15,
    "geographic": 0.10,
}

HIGH_RISK_THRESHOLD = 70
MEDIUM_RISK_THRESHOLD = 40

REASON_THRESHOLD = 55  # a component score above this contributes a "reason"


def compute_geographic_score(duplicate_score, has_close_duplicate):
    """
    A simple geographic-cluster signal: if the strongest duplicate match is
    both semantically similar AND geographically close, that in itself is a
    notable geographic signal (separate from the duplicate score itself,
    since real-world reviewers care about "how close" independently of
    "how similar the wording is").
    """
    if has_close_duplicate:
        return min(duplicate_score * 0.9, 100.0)
    return 0.0


def compute_risk(financial_score, timeline_score, duplicate_score,
                  contractor_score, geographic_score,
                  financial_reason, timeline_reason, duplicate_reason,
                  contractor_reason):
    """
    Returns dict:
        {
            "risk_score": float,
            "risk_level": "LOW" | "MEDIUM" | "HIGH",
            "reasons": [str, ...],
            "recommendation": str
        }
    """
    weighted_sum = (
        financial_score * WEIGHTS["financial"]
        + timeline_score * WEIGHTS["timeline"]
        + duplicate_score * WEIGHTS["duplicate"]
        + contractor_score * WEIGHTS["contractor"]
        + geographic_score * WEIGHTS["geographic"]
    )

    # A pure weighted average dilutes a single very strong anomaly (e.g. one
    # component at 95 but everything else quiet still only contributes its
    # own weight's worth). Real investigators care a lot about the single
    # worst signal, not just the blended average, so we add a bonus term
    # proportional to the strongest component. This lets one severe anomaly
    # (or two moderate ones) surface as HIGH risk, matching how a human
    # auditor would triage: "one huge red flag is still a huge red flag."
    max_component = max(financial_score, timeline_score, duplicate_score, contractor_score)
    severity_bonus = 0.35 * max_component

    risk_score = weighted_sum + severity_bonus
    risk_score = round(min(max(risk_score, 0), 100), 1)

    if risk_score >= HIGH_RISK_THRESHOLD:
        risk_level = "HIGH"
    elif risk_score >= MEDIUM_RISK_THRESHOLD:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    reasons = []
    if financial_score >= REASON_THRESHOLD:
        reasons.append(financial_reason)
    if timeline_score >= REASON_THRESHOLD:
        reasons.append(timeline_reason)
    if duplicate_score >= REASON_THRESHOLD:
        reasons.append(duplicate_reason)
    if contractor_score >= REASON_THRESHOLD:
        reasons.append(contractor_reason)

    if not reasons:
        reasons.append("No individual signal crossed the investigation threshold; overall profile appears typical.")

    if risk_level == "HIGH":
        recommendation = ("Recommend priority manual review: verify expenditure records, "
                           "completion documentation, and physical project status on the ground.")
    elif risk_level == "MEDIUM":
        recommendation = ("Recommend routine verification of records for this project during "
                           "the next scheduled audit cycle.")
    else:
        recommendation = "No immediate action required; project appears consistent with normal patterns."

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "reasons": reasons,
        "recommendation": recommendation,
    }
