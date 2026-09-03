# 🏛️ MPLADS-AI: Backend Intelligence Engine
### AI-Powered Anomaly, Fraud & Inefficiency Monitoring System (MoSPI / SIH 2026)

---

## 🚀 Overview
FastAPI service providing automated audit intelligence for government infrastructure projects sanctioned under the **Member of Parliament Local Area Development Scheme (MPLADS)**. Runs standalone out of the box (in-memory data), or with real MongoDB persistence if you set `MONGODB_URI`.

---

## 🧠 Core Intelligence Modules

1. **Computer Vision Image Forensics** (`app/services/image_forensics.py`)
   * Dual-stage image deduplication (perceptual gradient hash + color histogram cosine similarity).
   * **GPS verified from the photo's own EXIF metadata** (`app/services/image_forensics.py::extract_exif_gps`), falling back to form-submitted coordinates only when no EXIF GPS block exists — trusting user-typed coordinates alone is spoofable.
   * **Error Level Analysis (ELA) tamper detection** flags likely digitally-edited photos.

2. **Contractor Cartel & Collusion Analyzer** (`app/services/cartel_detector.py`)
   * Bipartite vendor↔project graph via NetworkX; flags district-level vendor monopolies and cyclic co-bidding.

3. **Multi-Factor Anomaly & Inefficiency Scorer** (`app/services/anomaly_scorer.py`)
   * Blends an interpretable rule-based formula with a **trained IsolationForest** (`app/ml/anomaly_model.py`) that learns what a "normal" fund-release/progress/time relationship looks like and flags statistical outliers the fixed rule would miss.

4. **Predictive Overrun Model** (`app/ml/overrun_predictor.py`)
   * Logistic regression predicting the probability an in-progress project will blow past its allocated schedule — *before* it's already overdue.

5. **Duplicate Sanctioned-Work Detector** (`app/ml/duplicate_detector.py`)
   * TF-IDF + cosine similarity across project titles within a district — catches the classic fraud pattern of the same work sanctioned twice under a reworded title.

6. **Alerting** (`app/services/alerting.py`)
   * Any project scoring CRITICAL fires a console log + optional webhook POST (Slack/Teams/custom — set `ALERT_WEBHOOK_URL`).

7. **Role-Scoped Dashboards** (`app/api/endpoints/dashboard.py`)
   * One endpoint, four views — MP (constituency), District Authority (district), State Nodal (state), Ministry (all-India) — returns risk counts, funds-at-risk, top flagged projects, and duplicate-work alerts scoped to that role.

> **Bootstrapped ML, not black-box:** no historical MPLADS dataset exists yet, so the IsolationForest and logistic regression are trained on a clearly-labeled *synthetic* distribution (see docstrings in `app/ml/`). Both expose a `.retrain(...)` method — feed them real historical outcomes (via Mongo) once available and nothing else in the codebase needs to change.

---

## 🗄️ Data Layer

`app/db/mongo.py` — async (Motor) MongoDB wrapper with **automatic fallback**: if `MONGODB_URI` is unset or unreachable, the app transparently uses the in-memory sample list instead. Same API either way (`project_store.list_projects()`, `.get_project()`, `.insert_projects()`) — nothing else in the codebase needs to know which backend is active.

```bash
# To enable real persistence:
export MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net"
export MONGODB_DB_NAME="mplads_ai"   # optional, defaults to mplads_ai
```

Real data ingestion: `POST /api/v1/analytics/projects/import` accepts a CSV (see required columns in `app/api/endpoints/analytics.py::REQUIRED_CSV_COLUMNS`), validates each row, reports per-row errors, and inserts valid rows into whichever store is active.

---

## 🛠️ Setup & Execution

```bash
cd Backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

* Interactive docs: `http://localhost:8000/docs`
* ReDoc: `http://localhost:8000/redoc`

Optional env vars (all have safe defaults — the app runs with none of these set):

| Var | Purpose | Default |
| :--- | :--- | :--- |
| `MONGODB_URI` | Enable real persistence | unset → in-memory mode |
| `MONGODB_DB_NAME` | Mongo database name | `mplads_ai` |
| `ALERT_WEBHOOK_URL` | Where CRITICAL alerts get POSTed | unset → console log only |
| `ML_BLEND_WEIGHT` | Rule-based vs ML weighting (0–1) | `0.5` |

---

## 🌐 API Endpoint Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | System health probe and active model status |
| `POST` | `/api/v1/forensics/verify-images` | Upload site photos → duplicate check + EXIF GPS check + tamper detection |
| `GET` | `/api/v1/cartel/matrix?district=Nandurbar` | Graph nodes & edges for cartel visualization (404 if district has no data) |
| `GET` | `/api/v1/analytics/projects` | Lists all project records (Mongo or in-memory) |
| `POST` | `/api/v1/analytics/projects/import` | Bulk CSV ingestion of real MPLADS project data |
| `POST` | `/api/v1/analytics/score-project` | Multi-factor + ML risk score for a project payload |
| `GET` | `/api/v1/analytics/score-project/{id}` | Same, by existing project ID |
| `GET` | `/api/v1/dashboard/summary?role=...&scope=...` | Role-scoped summary: MP/DISTRICT_AUTHORITY/STATE_NODAL (need `scope`) or MINISTRY (all-India) |

---

## ⚠️ Known gaps (be upfront about these if asked)

* **No authentication.** `role`/`scope` on the dashboard endpoint are trusted query params, not derived from a verified session — anyone can request any role's view. Put real auth (JWT/OAuth) in front of it before this touches real data.
* **ML models are bootstrapped on synthetic data**, not historical MPLADS outcomes (none was available). They're structurally correct and demonstrably better than a fixed rule at catching joint anomalies, but their specific thresholds should be re-validated once real labeled data exists.
* **In-memory mode has no durability** — restart the process and any CSV-imported data (beyond the 3 seed projects) is lost. Set `MONGODB_URI` for anything beyond a demo.
