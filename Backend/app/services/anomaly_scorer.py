"""
Multi-Factor Project Risk & Inefficiency Scorer
Calculates normalized 0-100 Composite Risk Index with explainable audit factors.
"""
from typing import List
from app.models.schemas import ProjectRecord, ProjectRiskAssessment, RiskBreakdown, RiskLevelEnum
from app.core.config import settings

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
        financial_score = cls.evaluate_financial_drift(record)
        timeline_score = cls.evaluate_timeline_delay(record)
        image_score = image_anomaly_factor
        vendor_score = vendor_historical_risk
        
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
        if financial_score > 40.0:
            flags.append(f"Financial Drift: {(record.funds_released/record.sanctioned_amount*100):.1f}% funds disbursed with only {record.physical_progress_pct}% physical work completed.")
        if timeline_score > 50.0:
            flags.append(f"Timeline Hazard: {record.days_elapsed} days elapsed of {record.allocated_duration_days} sanctioned schedule.")
        if image_score > 60.0:
            flags.append("Visual Evidence Anomaly: Suspected duplicate proof photo flagged.")
        if vendor_score > 50.0:
            flags.append(f"Vendor Monopolization: Contractor {record.contractor_id} exceeds district concentration threshold.")

        return ProjectRiskAssessment(
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
            recommended_action=recommended
        )

anomaly_scorer_service = AnomalyScorerEngine()
