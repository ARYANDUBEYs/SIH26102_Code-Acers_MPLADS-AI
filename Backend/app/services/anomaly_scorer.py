"""
Multi-Factor Project Risk & Inefficiency Scorer
Calculates normalized 0-100 Composite Risk Index with explainable audit factors.

Financial-drift and timeline-delay each combine two independent signals:
  1. An interpretable rule (the original linear formula) — auditors can see
     exactly why a number came out the way it did.
  2. A trained IsolationForest anomaly score (see app/ml/anomaly_model.py) —
     catches unusual combinations the fixed rule wouldn't, e.g. a project
     that's individually fine on each axis but jointly unusual.
The two are blended via settings.ML_BLEND_WEIGHT (default 50/50).
"""
from typing import List
from app.models.schemas import ProjectRecord, ProjectRiskAssessment, RiskBreakdown, RiskLevelEnum
from app.core.config import settings
from app.ml.anomaly_model import project_anomaly_model
from app.ml.overrun_predictor import overrun_predictor_service
from app.services.alerting import alerting_service

class AnomalyScorerEngine:
    @staticmethod
    def evaluate_financial_drift(record: ProjectRecord) -> float:
        """
        Measures mismatch between funds disbursed vs physical ground progress.
        """
        disbursement_ratio = (record.funds_released / record.sanctioned_amount) if record.sanctioned_amount > 0 else 0.0
        physical_ratio = record.physical_progress_pct / 100.0
        
        drift = disbursement_ratio - physical_ratio
        if drift <= 0:
            return 0.0
        
        # Scale drift linearly up to 100
        return min(100.0, drift * 150.0)

    @staticmethod
    def evaluate_timeline_delay(record: ProjectRecord) -> float:
        """
        Measures progress velocity against elapsed statutory duration.
        """
        time_ratio = (record.days_elapsed / record.allocated_duration_days) if record.allocated_duration_days > 0 else 1.0
        physical_ratio = record.physical_progress_pct / 100.0
        
        if time_ratio > 0.8 and physical_ratio < 0.5:
            # Severely lagging project
            gap = time_ratio - physical_ratio
            return min(100.0, gap * 120.0)
        
        if record.days_elapsed > record.allocated_duration_days and physical_ratio < 1.0:
            # Overdue project
            return min(100.0, 75.0 + (record.days_elapsed - record.allocated_duration_days) * 0.5)
            
        return max(0.0, (time_ratio - physical_ratio) * 50.0)

    @classmethod
    def calculate_project_risk(cls, record: ProjectRecord, image_anomaly_factor: float = 0.0, vendor_historical_risk: float = 0.0) -> ProjectRiskAssessment:
        """
        Computes the weighted composite risk index (0-100) and actionable MoSPI audit flags.
        """
        rule_financial_score = cls.evaluate_financial_drift(record)
        rule_timeline_score = cls.evaluate_timeline_delay(record)

        disbursement_ratio = (record.funds_released / record.sanctioned_amount) if record.sanctioned_amount > 0 else 0.0
        physical_ratio = record.physical_progress_pct / 100.0
        time_ratio = (record.days_elapsed / record.allocated_duration_days) if record.allocated_duration_days > 0 else 1.0

        ml_anomaly_score = project_anomaly_model.score(disbursement_ratio, physical_ratio, time_ratio)
        w = settings.ML_BLEND_WEIGHT
        financial_score = ((1 - w) * rule_financial_score) + (w * ml_anomaly_score)
        timeline_score = ((1 - w) * rule_timeline_score) + (w * ml_anomaly_score)

        image_score = image_anomaly_factor
        vendor_score = vendor_historical_risk

        overrun_probability = overrun_predictor_service.predict_overrun_probability(
            time_ratio=time_ratio,
            physical_ratio=physical_ratio,
            financial_drift=disbursement_ratio - physical_ratio,
        )

        composite_score = (
            (settings.WEIGHT_FINANCIAL_DRIFT * financial_score) +
            (settings.WEIGHT_TIMELINE_DELAY * timeline_score) +
            (settings.WEIGHT_IMAGE_ANOMALY * image_score) +
            (settings.WEIGHT_VENDOR_RISK * vendor_score)
        )
        composite_score = round(float(composite_score), 1)
        
        # Determine Risk Level
        if composite_score >= settings.CRITICAL_RISK_THRESHOLD:
            level = RiskLevelEnum.CRITICAL
            recommended = "IMMEDIATE_HOLD: Freeze next disbursement installment; dispatch District Flying Squad for physical site inspection."
        elif composite_score >= settings.MEDIUM_RISK_THRESHOLD:
            level = RiskLevelEnum.MEDIUM
            recommended = "PRE_SCREEN_REVIEW: Issue 7-day SLA compliance notice to implementing agency."
        else:
            level = RiskLevelEnum.LOW
            recommended = "AUTOMATED_CLEARANCE: Project metrics conform to MoSPI standard implementation parameters."
            
        flags: List[str] = []
        if rule_financial_score > 40.0:
            pct = (record.funds_released / record.sanctioned_amount * 100.0) if record.sanctioned_amount > 0 else 0.0
            flags.append(f"Financial Drift: {pct:.1f}% funds disbursed with only {record.physical_progress_pct}% physical work completed.")
        if rule_timeline_score > 50.0:
            flags.append(f"Timeline Hazard: {record.days_elapsed} days elapsed of {record.allocated_duration_days} sanctioned schedule.")
        if ml_anomaly_score > 65.0:
            flags.append(f"ML Model Alert: IsolationForest flagged this fund/progress/time combination as a statistical outlier ({ml_anomaly_score:.0f}/100).")
        if overrun_probability >= settings.OVERRUN_PROBABILITY_ALERT_CUTOFF:
            flags.append(f"Predictive Overrun Risk: {overrun_probability*100:.0f}% probability this project exceeds its allocated schedule before completion.")
        if image_score > 60.0:
            flags.append("Visual Evidence Anomaly: Suspected duplicate proof photo flagged.")
        if vendor_score > 50.0:
            flags.append(f"Vendor Monopolization: Contractor {record.contractor_id} exceeds district concentration threshold.")

        assessment = ProjectRiskAssessment(
            project_id=record.project_id,
            overall_risk_score=composite_score,
            risk_level=level,
            breakdown=RiskBreakdown(
                financial_drift_score=round(financial_score, 1),
                timeline_delay_score=round(timeline_score, 1),
                image_anomaly_score=round(image_score, 1),
                vendor_risk_score=round(vendor_score, 1)
            ),
            explainable_flags=flags,
            requires_manual_audit=(level != RiskLevelEnum.LOW),
            recommended_action=recommended,
            overrun_probability=overrun_probability,
            ml_anomaly_score=ml_anomaly_score,
        )

        if level == RiskLevelEnum.CRITICAL:
            alerting_service.send_alert(record=record, assessment=assessment)

        return assessment

anomaly_scorer_service = AnomalyScorerEngine()
