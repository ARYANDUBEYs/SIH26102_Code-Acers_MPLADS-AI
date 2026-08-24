"""
ml/contractor.py
-----------------
Contractor anomaly detection.

Builds a bipartite graph of contractor <-> district using NetworkX to
identify contractors with an unusually high concentration of projects
overall, or clustered heavily in a single district (a common real-world
red flag: one contractor being awarded a suspiciously large share of
work in one area).
"""

import numpy as np
import pandas as pd
import networkx as nx


def run_contractor_anomaly_detection(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    total_projects = len(df)
    contractor_counts = df["contractor"].value_counts()
    contractor_share = contractor_counts / total_projects

    # Build bipartite graph: contractor nodes <-> district nodes,
    # edge weight = number of projects that contractor has in that district.
    G = nx.Graph()
    for contractor, group in df.groupby("contractor"):
        G.add_node(("contractor", contractor), bipartite=0)
        for district, dgroup in group.groupby("district"):
            G.add_node(("district", district), bipartite=1)
            G.add_edge(("contractor", contractor), ("district", district), weight=len(dgroup))

    # For each contractor, find their max concentration in any single district
    contractor_district_max = {}
    contractor_district_top = {}
    for contractor in contractor_counts.index:
        node = ("contractor", contractor)
        if node not in G:
            contractor_district_max[contractor] = 0
            contractor_district_top[contractor] = None
            continue
        edges = G[node]
        if not edges:
            contractor_district_max[contractor] = 0
            contractor_district_top[contractor] = None
            continue
        top_district, top_edge = max(edges.items(), key=lambda kv: kv[1]["weight"])
        contractor_district_max[contractor] = top_edge["weight"]
        contractor_district_top[contractor] = top_district[1]

    # Overall project-count z-score across contractors (highlights outlier volume)
    counts = contractor_counts.values.astype(float)
    mean_c, std_c = counts.mean(), counts.std() if counts.std() > 0 else 1.0

    def contractor_score(contractor):
        total_count = contractor_counts.get(contractor, 0)
        district_max = contractor_district_max.get(contractor, 0)
        district_share_in_top = district_max / total_count if total_count else 0

        volume_z = (total_count - mean_c) / std_c
        volume_component = np.clip(volume_z * 20, 0, 60)  # up to 60 pts for sheer volume

        concentration_component = 0
        if total_count >= 8 and district_share_in_top >= 0.6:
            concentration_component = 40  # heavy single-district concentration

        return round(min(volume_component + concentration_component, 100), 1)

    def contractor_explanation(contractor):
        total_count = contractor_counts.get(contractor, 0)
        district_max = contractor_district_max.get(contractor, 0)
        top_district = contractor_district_top.get(contractor)
        share_pct = (district_max / total_count * 100) if total_count else 0

        if total_count >= 8 and (district_max / total_count if total_count else 0) >= 0.6:
            return (f"Contractor has an unusually high concentration of projects "
                    f"({total_count} total, {district_max} of them — {share_pct:.0f}% — "
                    f"in {top_district} district).")
        elif total_count > mean_c + 2 * std_c:
            return f"Contractor has been awarded an unusually high number of projects overall ({total_count})."
        else:
            return "Contractor's project count and distribution appear typical."

    df["contractor_anomaly_score"] = df["contractor"].map(contractor_score)
    df["contractor_explanation"] = df["contractor"].map(contractor_explanation)
    df["contractor_total_projects"] = df["contractor"].map(contractor_counts)

    return df[[
        "project_id",
        "contractor_anomaly_score",
        "contractor_explanation",
        "contractor_total_projects",
    ]]
