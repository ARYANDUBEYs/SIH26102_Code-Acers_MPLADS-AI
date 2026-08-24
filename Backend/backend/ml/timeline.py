"""
ml/timeline.py
--------------
Timeline anomaly detection.

Flags projects whose duration (completion_date - start_date) is unusually
short or unusually long compared to other projects in the same category.

Uses a statistical (z-score) anomaly detection approach rather than
Isolation Forest here: with only one feature (duration), a z-score against
the category baseline is both more explainable (important for a fraud/
investigation tool where reviewers need to understand *why* something was
flagged) and far more robust when a category has only a handful of
projects — Isolation Forest's isolation-path ranking becomes unstable on
very small samples, whereas a z-score degrades gracefully.
"""

import numpy as np
import pandas as pd

# A category needs at least this many valid-dated projects before we trust
# its own mean/std; smaller categories fall back to the dataset-wide baseline.
MIN_CATEGORY_SAMPLE = 5


def run_timeline_anomaly_detection(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["start_dt"] = pd.to_datetime(df["start_date"], errors="coerce")
    df["completion_dt"] = pd.to_datetime(df["completion_date"], errors="coerce")
    raw_duration = (df["completion_dt"] - df["start_dt"]).dt.days

    # A completion date on/before the start date (or an unparseable date) is
    # itself a strong data-integrity red flag — the kind of record error a
    # reviewer would want surfaced, not silently clipped to "1 day" and
    # treated as a normal short project.
    df["invalid_dates"] = raw_duration.isna() | (raw_duration <= 0)
    df["duration_days"] = raw_duration.clip(lower=1).fillna(1)

    # Baseline stats computed only from valid rows, so a bad record can't
    # distort the "normal" duration for every other project in that category.
    valid = df.loc[~df["invalid_dates"]]
    overall_mean = valid["duration_days"].mean() if len(valid) else 1.0
    overall_std = valid["duration_days"].std() if len(valid) > 1 else 1.0
    if pd.isna(overall_std) or overall_std == 0:
        overall_std = max(overall_mean * 0.2, 1.0)

    cat_counts = valid.groupby("category")["duration_days"].count()
    cat_stats = valid.groupby("category")["duration_days"].agg(["mean", "std"])

    def baseline_for(category):
        if category in cat_counts.index and cat_counts[category] >= MIN_CATEGORY_SAMPLE:
            mean = cat_stats.loc[category, "mean"]
            std = cat_stats.loc[category, "std"]
            if pd.isna(std) or std == 0:
                std = overall_std
            return mean, std
        return overall_mean, overall_std

    baselines = {cat: baseline_for(cat) for cat in df["category"].unique()}

    def zscore_for(row):
        mean, std = baselines[row["category"]]
        return (row["duration_days"] - mean) / std

    df["duration_zscore"] = df.apply(zscore_for, axis=1)
    # Force invalid-date rows to a clearly extreme z-score so downstream
    # scoring treats them as maximally anomalous.
    df.loc[df["invalid_dates"], "duration_zscore"] = 10.0

    # Smooth saturating transform from |z| to a 0-100 score: z=1.5 -> ~63,
    # z=2.5 -> ~82, z=4+ -> ~95+. This avoids a hard cliff at any single
    # threshold while still capturing "how many standard deviations away."
    df["timeline_anomaly_score"] = (
        100 * (1 - np.exp(-df["duration_zscore"].abs() / 1.6))
    ).round(1).clip(0, 100)
    df.loc[df["invalid_dates"], "timeline_anomaly_score"] = 100.0

    def explain(row):
        if row["invalid_dates"]:
            return "Recorded completion date is on or before the start date — likely a data entry error or fabricated record."
        z = row["duration_zscore"]
        if z < -1.5:
            return f"Project duration ({int(row['duration_days'])} days) is significantly shorter than similar {row['category']} projects."
        elif z > 1.5:
            return f"Project duration ({int(row['duration_days'])} days) is significantly longer than similar {row['category']} projects."
        elif row["timeline_anomaly_score"] >= 55:
            return "Project duration deviates moderately from similar projects."
        else:
            return "Project duration is consistent with similar projects."

    df["timeline_explanation"] = df.apply(explain, axis=1)

    return df[["project_id", "timeline_anomaly_score", "timeline_explanation", "duration_days"]]
