"""
Duplicate Sanctioned-Work Detector
------------------------------------
Classic MPLADS fraud pattern: the same physical work gets sanctioned twice
under slightly reworded titles (different vendor, sometimes different MP)
to draw funds twice. This module flags near-duplicate project titles within
the same district/category using TF-IDF + cosine similarity.

Note: this uses TF-IDF rather than a heavyweight sentence-transformers model
on purpose — it needs no GPU/torch, installs in seconds, and for short
government-scheme work titles (a handful of domain words: "construction",
"drinking water system", district/village names) TF-IDF cosine similarity
performs comparably to sentence embeddings while keeping the deployment
lightweight. Swap in sentence-transformers later if titles get long/free-form
and semantic (not just lexical) matching becomes necessary.
"""
from typing import List, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class DuplicateWorkDetector:
    @staticmethod
    def find_near_duplicates(projects: List[Dict[str, Any]], similarity_cutoff: float) -> List[Dict[str, Any]]:
        """
        Compares titles pairwise within the same district and returns pairs
        whose TF-IDF cosine similarity exceeds the cutoff.
        """
        if len(projects) < 2:
            return []

        flagged: List[Dict[str, Any]] = []
        by_district: Dict[str, List[Dict[str, Any]]] = {}
        for p in projects:
            by_district.setdefault(p["district"], []).append(p)

        for district, group in by_district.items():
            if len(group) < 2:
                continue
            titles = [p["title"] for p in group]
            try:
                vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
                matrix = vectorizer.fit_transform(titles)
            except ValueError:
                continue  # e.g. all titles were pure stopwords
            sim_matrix = cosine_similarity(matrix)

            for i in range(len(group)):
                for j in range(i + 1, len(group)):
                    score = float(sim_matrix[i, j])
                    if score >= similarity_cutoff:
                        flagged.append({
                            "district": district,
                            "project_id_a": group[i]["project_id"],
                            "title_a": group[i]["title"],
                            "project_id_b": group[j]["project_id"],
                            "title_b": group[j]["title"],
                            "similarity_score": round(score, 3),
                            "alert": (
                                f"Titles are {score*100:.1f}% textually similar within "
                                f"{district} — possible duplicate work sanctioned twice."
                            ),
                        })
        return flagged


duplicate_work_detector = DuplicateWorkDetector()
