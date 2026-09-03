# MPLADS-AI — AI-Assisted Public Fund Monitoring

MPLADS-AI is a hackathon prototype for continuous monitoring of MPLADS works. It combines rule-based financial/timeline checks with lightweight machine-learning anomaly detection, duplicate-work text matching, contractor concentration analysis, and image-forensics checks.

## Architecture

```text
React + Vite
    │
    │ /api/v1
    ▼
FastAPI
    │
    ├── Project data + CSV import
    ├── Explainable financial/timeline risk scoring
    ├── Isolation Forest anomaly model
    ├── Logistic Regression overrun predictor
    ├── TF-IDF duplicate-work detector
    ├── Contractor network/concentration analysis
    ├── Image dHash + color similarity + EXIF GPS + ELA
    └── Citizen reports / notifications
    │
    ▼
MongoDB (optional; in-memory fallback for zero-setup demo)
```

## Important project claim

The system is **AI-assisted decision support**, not an automated corruption verdict. A high score is an investigation signal that should be reviewed by an authorized officer.

The ML models are bootstrapped with synthetic training data because a verified historical MPLADS outcome dataset is not bundled with this prototype. They are suitable for demonstrating the pipeline, not for claiming production accuracy.

## Run locally

### Backend

```bash
cd Backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
# source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API health check: `/api/v1/health`  
Interactive API documentation: `/docs`

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

The Vite development server proxies `/api/*` to `http://localhost:8000`.

For a different backend URL, create `Frontend/.env`:

```env
VITE_API_BASE_URL=https://your-backend.example.com/api/v1
```

## Docker

From the repository root:

```bash
docker compose up --build
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- MongoDB: internal Docker network

MongoDB is persistent through the `mplads_mongo_data` volume. If MongoDB is unavailable, the backend automatically falls back to its demo in-memory dataset.

## CSV import

The backend exposes:

`POST /api/v1/analytics/projects/import`

The current importer expects these canonical columns:

```text
project_id
title
state
district
constituency
category
sanctioned_amount
funds_released
funds_utilized
physical_progress_pct
sanction_date
expected_completion_date
days_elapsed
allocated_duration_days
contractor_id
contractor_name
latitude
longitude
```

**Do not assume an external MPLADS CSV uses these exact names.** Before importing a real dataset, map its actual headers, units, dates, missing values, and category labels to this canonical schema.

## Risk pipeline

1. Validate project fields and financial consistency.
2. Calculate financial drift, including idle released funds.
3. Calculate schedule/progress mismatch.
4. Score the project with Isolation Forest.
5. Predict schedule-overrun probability with logistic regression.
6. Add stored image-forensics evidence when available.
7. Calculate contractor concentration risk from the project portfolio.
8. Combine factors into a 0–100 composite score.
9. Produce explainable flags and a recommended review action.
10. Generate a critical alert for high-risk cases.

## Image forensics

The evidence endpoint supports:

- perceptual dHash similarity
- RGB histogram similarity
- EXIF GPS extraction
- Haversine distance from sanctioned coordinates
- Error Level Analysis (ELA) tamper-suspicion heuristic

These are forensic indicators, not proof of fraud.

## Frontend/backend integration

The React app no longer uses `mockData.js` for its operational API layer. `Frontend/src/services/api.js` calls the FastAPI backend and adapts canonical backend records into the existing UI model.

The landing page contains static presentation content; operational dashboard/project data is loaded from the backend.

## Project structure

```text
Backend/
  app/
    api/endpoints/
    core/
    db/
    ml/
    models/
    services/

Frontend/
  src/
    components/
    context/
    features/
    pages/
    routes/
    services/
```

## Limitations before real deployment

- Add authenticated JWT/OAuth authorization and derive role/scope from verified identity.
- Replace synthetic ML bootstrap training with verified historical MPLADS outcomes.
- Store citizen reports and audit decisions in a durable database with an audit trail.
- Use a complete image corpus for cross-project duplicate detection rather than only uploaded/reference comparisons.
- Calibrate thresholds against labeled validation data.
- Integrate authoritative financial, procurement, GIS, and inspection systems.
- Treat contractor concentration as a potential collusion indicator, never as proof.
