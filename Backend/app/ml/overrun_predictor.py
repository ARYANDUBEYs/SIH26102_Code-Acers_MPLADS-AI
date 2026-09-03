"""
Overrun Risk Predictor (Logistic Regression)
-----------------------------------------------
Predicts the probability that an in-progress project will blow past its
allocated_duration_days before reaching 100% physical progress — i.e. it
answers "is this project going to be late?" *before* it's actually overdue,
which is the "predictive insights" capability called for in the problem
statement (as opposed to the anomaly scorer, which mostly reacts to
projects that are already lagging).

Bootstrapped the same way as the anomaly model: no historical MPLADS
completion-time dataset was available, so labels are generated from a
domain rule (time consumed outpacing physical progress by a growing margin
increases overrun probability) with noise added, then a logistic regression
is fit on top so the *decision boundary* is learned rather than hardcoded.
Call `retrain(...)` with real (features, was_overrun) pairs once historical
project outcomes are available in Mongo.
"""
import numpy as np
from sklearn.linear_model import LogisticRegression
from typing import List, Tuple


class OverrunPredictor:
    def __init__(self, random_state: int = 42):
        self._model = LogisticRegression()
        self._fitted = False
        self._bootstrap_train(random_state)

    def _bootstrap_train(self, random_state: int) -> None:
        rng = np.random.default_rng(random_state)
        n = 2000
        time_ratio = rng.uniform(0.0, 1.6, n)
        physical_ratio = np.clip(
            time_ratio + rng.normal(0, 0.18, n) - rng.uniform(0, 0.25, n), 0, 1.2
        )
        financial_drift = np.clip(rng.normal(0.15, 0.20, n), -0.5, 1.0)

        # Domain rule -> probability -> sampled binary label (adds realistic noise)
        gap = time_ratio - physical_ratio
        logit = (gap * 4.0) + (financial_drift * 1.5) - 0.8
        true_prob = 1.0 / (1.0 + np.exp(-logit))
        labels = (rng.uniform(0, 1, n) < true_prob).astype(int)

        X = np.column_stack([time_ratio, physical_ratio, financial_drift])
        self._model.fit(X, labels)
        self._fitted = True

    def retrain(self, feature_rows: List[Tuple[float, float, float]], labels: List[int]) -> None:
        """Retrain on real (time_ratio, physical_ratio, financial_drift, was_overrun) history."""
        if len(feature_rows) < 30 or len(set(labels)) < 2:
            return  # not enough real data / need both classes present
        X = np.array(feature_rows, dtype=np.float32)
        y = np.array(labels, dtype=np.int32)
        self._model.fit(X, y)
        self._fitted = True

    def predict_overrun_probability(self, time_ratio: float, physical_ratio: float, financial_drift: float) -> float:
        """Returns probability in [0, 1] that the project overruns its allocated schedule."""
        if not self._fitted:
            return 0.0
        X = np.array([[time_ratio, physical_ratio, financial_drift]], dtype=np.float32)
        prob = float(self._model.predict_proba(X)[0][1])
        return round(prob, 3)


overrun_predictor_service = OverrunPredictor()
