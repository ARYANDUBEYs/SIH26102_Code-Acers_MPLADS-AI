"""
ml/financial.py
----------------
Financial anomaly detection using Isolation Forest.

Looks at sanctioned amount, actual expenditure, expenditure ratio,
project duration and category-normalised cost to flag projects whose
spending pattern looks statistically unusual, and compares each
project's expenditure against similar (same-category) projects.
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

RANDOM_STATE = 42


def _duration_days(row):
    """Returns duration in days, clipped to a minimum of 1 for use as a
    numeric feature. Reversed/invalid dates are handled separately by the
    timeline detector, which flags them explicitly rather than silently
    treating them as a 1-day project."""
    try:
        start = pd.to_datetime(row["start_date"])
        end = pd.to_datetime(row["completion_date"])
        days = (end - start).days
        return max(days, 1)
    except Exception:
        return 1


def run_financial_anomaly_detection(df: pd.DataFrame) -> pd.DataFrame:
    """
    Takes the full projects DataFrame and returns a DataFrame indexed the
    same way with two new columns:
        - financial_anomaly_score (0-100, higher = more anomalous)
        - financial_explanation   (human-readable reason string)
    """
    df = df.copy()
    df["duration_days"] = df.apply(_duration_days, axis=1)
    df["expenditure_ratio"] = df["actual_expenditure"] / df["sanctioned_amount"].replace(0, np.nan)
    df["expenditure_ratio"] = df["expenditure_ratio"].fillna(1.0)

    # Category-normalised expected expenditure: median actual/sanctioned per category
    category_median_ratio = df.groupby("category")["expenditure_ratio"].transform("median")
    df["expected_expenditure"] = df["sanctioned_amount"] * category_median_ratio
    df["expenditure_deviation_pct"] = (
        (df["actual_expenditure"] - df["expected_expenditure"]) / df["expected_expenditure"].replace(0, np.nan)
    ).fillna(0) * 100

    feature_cols = [
        "sanctioned_amount",
        "actual_expenditure",
        "expenditure_ratio",
        "duration_days",
    ]
    X = df[feature_cols].values
    X = StandardScaler().fit_transform(X)

    # contamination roughly matches the anomaly injection rate in generate_demo_data.py
    model = IsolationForest(
        n_estimators=200,
        contamination=0.08,
        random_state=RANDOM_STATE,
    )
    model.fit(X)

    # decision_function: higher = more normal. We flip and rescale to 0-100.
    raw_scores = model.decision_function(X)
    # Normalize: more negative raw_score -> more anomalous -> higher output score
    normalized = (raw_scores.max() - raw_scores) / (raw_scores.max() - raw_scores.min() + 1e-9)
    df["financial_anomaly_score"] = (normalized * 100).round(1)

    def explain(row):
        dev = row["expenditure_deviation_pct"]
        ratio = row["expenditure_ratio"]
        if dev > 25:
            return f"Actual expenditure is {dev:.0f}% higher than comparable {row['category']} projects."
        elif dev < -25:
            return f"Actual expenditure is {abs(dev):.0f}% lower than comparable {row['category']} projects despite reported progress of {row['reported_progress']:.0f}%."
        elif ratio > 1.15:
            return "Actual expenditure exceeds the sanctioned amount by a notable margin."
        elif row["financial_anomaly_score"] >= 60:
            return "Spending pattern deviates from typical projects of this category and scale."
        else:
            return "Expenditure is broadly in line with comparable projects."

    df["financial_explanation"] = df.apply(explain, axis=1)

    return df[[
        "project_id",
        "financial_anomaly_score",
        "financial_explanation",
        "expenditure_deviation_pct",
        "duration_days",
    ]]
