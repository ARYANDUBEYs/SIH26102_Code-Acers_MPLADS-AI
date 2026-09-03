"""
Alerting Service
------------------
Fires when a project crosses the CRITICAL risk threshold. Always logs to
console/stdout (so it's visible in server logs / demo terminal without any
setup). If ALERT_WEBHOOK_URL is configured, also POSTs a JSON payload there
(e.g. a Slack incoming webhook, MS Teams connector, or your own endpoint) —
that's how this would reach an MP/District office in a real deployment
without this backend needing to know about email/SMS providers directly.

Webhook delivery is fire-and-forget with a short timeout: a slow/broken
webhook must never block or fail a risk-scoring API response.
"""
import logging
from datetime import datetime, timezone
import httpx
from app.core.config import settings

logger = logging.getLogger("mplads.alerts")
logging.basicConfig(level=logging.INFO)


class AlertingService:
    @staticmethod
    def send_alert(record, assessment) -> None:
        message = (
            f"[CRITICAL ALERT] Project {record.project_id} ({record.title}, {record.district}) "
            f"scored {assessment.overall_risk_score}/100 — {assessment.recommended_action}"
        )
        logger.warning(message)

        if not settings.ALERT_WEBHOOK_URL:
            return

        payload = {
            "text": message,
            "project_id": record.project_id,
            "district": record.district,
            "state": record.state,
            "contractor_id": record.contractor_id,
            "overall_risk_score": assessment.overall_risk_score,
            "risk_level": assessment.risk_level,
            "flags": assessment.explainable_flags,
            "recommended_action": assessment.recommended_action,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        try:
            httpx.post(settings.ALERT_WEBHOOK_URL, json=payload, timeout=3.0)
        except httpx.HTTPError as e:
            # Never let a broken webhook take down a scoring request.
            logger.error(f"Alert webhook delivery failed: {e}")


alerting_service = AlertingService()
