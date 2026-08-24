"""
ml/similarity.py
-----------------
Duplicate / semantically-similar project detection.

Tries to use Sentence Transformers (all-MiniLM-L6-v2) for high quality
semantic embeddings of project name + description. If the model can't be
downloaded (e.g. no internet access in the environment), it automatically
falls back to a TF-IDF + cosine-similarity approach so the demo still runs
end to end.

Also computes geographic distance (haversine) between similar projects,
since two nearly-identical descriptions far apart are much less suspicious
than two nearly-identical descriptions a few hundred metres apart.
"""

import numpy as np
import pandas as pd
from math import radians, sin, cos, sqrt, atan2
from sklearn.metrics.pairwise import cosine_similarity

_USE_SENTENCE_TRANSFORMERS = True
try:
    from sentence_transformers import SentenceTransformer
except Exception:
    _USE_SENTENCE_TRANSFORMERS = False

_model_cache = {"model": None, "load_failed": False}

CLOSE_DISTANCE_KM = 2.0            # within this distance = "geographically close"
TOP_K_MATCHES = 3

# Similarity thresholds differ by embedding method: true sentence embeddings
# capture synonyms ("Hall" vs "Centre") and cluster near ~0.80+ for genuine
# duplicates, while the TF-IDF fallback is a much stricter bag-of-words
# comparison where the same duplicate pair typically scores ~0.55-0.65.
SIMILARITY_THRESHOLDS = {
    "sentence-transformers": 0.80,
    "tfidf-fallback": 0.55,
}
DEFAULT_SIMILARITY_THRESHOLD = 0.80


def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371.0
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    return R * 2 * atan2(sqrt(a), sqrt(1 - a))


def _get_embeddings(texts):
    """Returns an (n_samples, dim) embedding matrix, using Sentence Transformers
    if available, otherwise TF-IDF as a fallback."""
    global _model_cache

    if _USE_SENTENCE_TRANSFORMERS and not _model_cache["load_failed"]:
        try:
            if _model_cache["model"] is None:
                _model_cache["model"] = SentenceTransformer("all-MiniLM-L6-v2")
            embeddings = _model_cache["model"].encode(texts, show_progress_bar=False)
            return np.array(embeddings), "sentence-transformers"
        except Exception:
            _model_cache["load_failed"] = True  # avoid retrying on every call

    # ---- Fallback: TF-IDF ----
    from sklearn.feature_extraction.text import TfidfVectorizer
    vectorizer = TfidfVectorizer(stop_words="english", max_features=2000)
    matrix = vectorizer.fit_transform(texts)
    return matrix.toarray(), "tfidf-fallback"


def run_duplicate_detection(df: pd.DataFrame):
    """
    Returns:
        result_df: DataFrame with columns
            project_id, duplicate_score (0-100), duplicate_explanation
        similar_map: dict[project_id] -> list of
            {project_id, project_name, similarity, distance_km, note}
        embedding_method: str, which embedding approach was actually used
    """
    df = df.reset_index(drop=True).copy()
    texts = (df["project_name"].fillna("") + ". " + df["description"].fillna("")).tolist()

    embeddings, method = _get_embeddings(texts)
    similarity_threshold = SIMILARITY_THRESHOLDS.get(method, DEFAULT_SIMILARITY_THRESHOLD)
    sim_matrix = cosine_similarity(embeddings)
    np.fill_diagonal(sim_matrix, 0.0)  # ignore self-similarity

    n = len(df)
    duplicate_scores = np.zeros(n)
    explanations = [""] * n
    similar_map = {}

    lats = df["latitude"].values
    lons = df["longitude"].values
    project_ids = df["project_id"].values
    project_names = df["project_name"].values

    for i in range(n):
        sims = sim_matrix[i]
        top_idx = np.argsort(sims)[::-1][:TOP_K_MATCHES]

        matches = []
        best_flagged_score = 0.0
        best_note = "No significant duplicates found."

        for j in top_idx:
            sim_score = float(sims[j])
            if sim_score < similarity_threshold * 0.5:
                continue  # not worth reporting as "similar" at all

            distance_km = haversine_km(lats[i], lons[i], lats[j], lons[j])

            if sim_score >= similarity_threshold and distance_km <= CLOSE_DISTANCE_KM:
                note = "Potential duplicate/overlapping project (similar description, geographically close)."
                # High confidence overlap -> strong contribution to duplicate score
                candidate_score = 70 + sim_score * 30
            elif sim_score >= similarity_threshold:
                note = "Semantically similar project found, but located far away — likely coincidental naming."
                candidate_score = sim_score * 40
            else:
                note = "Related project found nearby."
                candidate_score = sim_score * 30

            candidate_score = min(candidate_score, 100.0)
            if candidate_score > best_flagged_score:
                best_flagged_score = candidate_score
                best_note = note

            matches.append({
                "project_id": project_ids[j],
                "project_name": project_names[j],
                "similarity": round(sim_score, 3),
                "distance_km": round(distance_km, 2),
                "note": note,
            })

        duplicate_scores[i] = round(best_flagged_score, 1)
        explanations[i] = best_note
        similar_map[project_ids[i]] = matches

    result_df = pd.DataFrame({
        "project_id": project_ids,
        "duplicate_score": duplicate_scores,
        "duplicate_explanation": explanations,
    })

    return result_df, similar_map, method
