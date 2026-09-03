"""
Statistical Anomaly Model (Isolation Forest)
---------------------------------------------
Replaces/augments the pure rule-based financial & timeline scoring with a
trained model that learns what a "normal" MPLADS project's fund-release vs
physical-progress vs time-elapsed relationship looks like, then flags
projects that fall outside that learned distribution.

No historical MPLADS dataset was available at build time, so the model is
bootstrapped on a synthetic distribution of "healthy" projects (disbursement
tracking physical progress roughly linearly, with realistic noise). This is
clearly labeled as synthetic below. When real historical project data is
available (via Mongo ingestion), call `retrain(feature_rows)` with real
feature vectors to replace the bootstrap model — no code changes needed
elsewhere, since callers only ever use `.score(...)`.
"""
import numpy as np
from sklearn.ensemble import IsolationForest
from typing import List, Tuple


class ProjectAnomalyModel:
    FEATURE_NAMES = ["disbursement_ratio", "physical_ratio", "time_ratio"]

    def __init__(self, random_state: int = 42):
        self._model = IsolationForest(
            n_estimators=200,
            contamination=0.12,
            random_state=random_state,
        )
        self._fitted = False
        self._bootstrap_train()

    def _bootstrap_train(self) -> None:
        """
        Synthetic bootstrap: simulates ~1500 'normal' projects where
        disbursement_ratio and time_ratio track physical_ratio closely
        (a healthy project releases funds and completes work roughly
        together), plus a small slice of genuinely anomalous ones so the
        forest has both classes to separate against.
        """
        rng = np.random.default_rng(42)
        n_normal = 1400
        physical = rng.uniform(0.0, 1.0, n_normal)
        disbursement = np.clip(physical + rng.normal(0, 0.08, n_normal), 0, 1.3)
        time_ratio = np.clip(physical + rng.normal(0, 0.10, n_normal), 0, 1.5)
        normal_rows = np.column_stack([disbursement, physical, time_ratio])

        n_anom = 150
        physical_a = rng.uniform(0.0, 0.4, n_anom)
        disbursement_a = np.clip(physical_a + rng.uniform(0.4, 0.9, n_anom), 0, 1.3)
        time_ratio_a = np.clip(physical_a + rng.uniform(0.3, 0.8, n_anom), 0, 1.5)
        anom_rows = np.column_stack([disbursement_a, physical_a, time_ratio_a])

        X = np.vstack([normal_rows, anom_rows])
        self._model.fit(X)
        self._fitted = True

    def retrain(self, feature_rows: List[Tuple[float, float, float]]) -> None:
        """Retrain on real (disbursement_ratio, physical_ratio, time_ratio) rows."""
        if len(feature_rows) < 20:
            return  # not enough real data yet, keep the bootstrap model
        X = np.array(feature_rows, dtype=np.float32)
        self._model.fit(X)
        self._fitted = True

    def score(self, disbursement_ratio: float, physical_ratio: float, time_ratio: float) -> float:
        """
        Returns an anomaly score in [0, 100]. Higher = more anomalous.
        Isolation Forest's decision_function returns higher values for
        inliers and lower (often negative) for outliers, so we invert and
        rescale it into an intuitive 0-100 risk range.
        """
        if not self._fitted:
            return 0.0
        X = np.array([[disbursement_ratio, physical_ratio, time_ratio]], dtype=np.float32)
        raw = float(self._model.decision_function(X)[0])  # roughly in [-0.5, 0.5]
        anomaly_pct = float(np.clip((0.25 - raw) / 0.5, 0.0, 1.0) * 100.0)
        return round(anomaly_pct, 1)


project_anomaly_model = ProjectAnomalyModel()
