# 🏛️ MPLADS-AI: Backend Intelligence Engine
### AI-Powered Anomaly, Fraud & Inefficiency Detection for the MPLAD Scheme (SIH 2026 · SIH26102)

---

## 1. What is this project, in plain English?

**MPLADS** (Members of Parliament Local Area Development Scheme) is a real Indian government scheme. Every Member of Parliament gets a yearly budget to sanction local development works — roads, schools, drinking water systems, community halls — in their constituency. Thousands of these projects run at once, across the whole country, each with its own budget, contractor, timeline, and progress reports.

The problem: with that much money and that many projects, it's very hard for humans to manually check every single one for red flags — money released faster than work actually gets done, the same project quietly sanctioned twice under a different name, a contractor who somehow wins every tender in a district, or a "before/after" photo that's actually reused from a different project.

**This project is a backend service that does that checking automatically.** You feed it project data (funds, dates, progress %, contractor, location), and it:
- Gives every project a **risk score from 0–100** with a human-readable explanation of *why* ("this project has had 80% of its funds released but only 20% of the work is actually done").
- Flags **contractors who dominate a district** (monopoly/cartel behavior).
- Flags **duplicate or reused project photos** and checks whether a photo's real location (from its own metadata) matches where the project is supposed to be.
- Flags **project titles that look like the same work sanctioned twice**.
- **Predicts** which in-progress projects are likely to run late, before they're actually late.
- Sends an **alert** the moment a project crosses into "critical" risk.
- Gives four different government roles (MP / District Authority / State Nodal Officer / Ministry) their own scoped dashboard view.

It does **not** yet decide anything on its own or take action — it surfaces problems for a human auditor to review. Think of it as a very fast, very consistent first-pass reviewer, not a judge.

---

## 2. The technology stack — explained for a beginner

| Technology | What it actually is | Why it's used here |
|---|---|---|
| **Python** | A programming language, popular for data/AI work because of its huge ecosystem of ready-made libraries. | The whole backend is written in it. |
| **FastAPI** | A Python framework for building web APIs (the thing your frontend/app talks to over the internet). | Handles all HTTP requests — e.g. "give me the list of projects" or "score this project." Also auto-generates interactive API documentation for free (see `/docs`). |
| **Pydantic** | A data-validation library. You describe what a piece of data *should* look like (e.g. "sanctioned_amount must be a positive number"), and it automatically rejects anything that doesn't match. | Prevents garbage/malformed data from silently entering the system. |
| **Uvicorn** | The actual program that runs your FastAPI app and listens for internet requests. | It's the "engine" underneath FastAPI — FastAPI defines *what* happens, Uvicorn is *what makes it run*. |
| **NumPy** | A library for fast math on large arrays of numbers. | Used under the hood by the ML models for number-crunching. |
| **scikit-learn** | The most widely-used Python library for classic Machine Learning (not deep learning/neural networks — simpler, faster, easier-to-explain models). | Powers the anomaly detector, the duplicate-title detector, and the overrun predictor (details in section 4). |
| **NetworkX** | A library for working with graphs (networks of connected "nodes," like a social network diagram). | Builds the contractor↔project graph to detect monopolies/cartels. |
| **Pillow (PIL)** | A library for opening, editing, and reading metadata out of image files. | Used to compare photos for duplicates and to read GPS location out of a photo's hidden metadata (EXIF). |
| **MongoDB (via Motor)** | A "NoSQL" / document database — instead of spreadsheet-like tables with fixed columns (like MySQL/PostgreSQL), it stores flexible JSON-like documents. | Where real project data lives once you have it. Chosen over a relational DB because project records are self-contained documents with no complex joins needed, and the schema keeps growing new optional fields — a flexible document store fits that better than a rigid table schema. |
| **httpx** | A library for making outgoing web requests from Python. | Used to send alert notifications to a webhook (e.g. Slack) when a project is flagged critical. |
| **Docker** | A tool that packages your app + everything it needs (Python version, libraries, etc.) into one portable "container" that runs identically anywhere. | Used so the backend can be deployed to any cloud host without "works on my machine" problems. |

**None of the "AI" here is a chatbot or a large language model.** It's classical/statistical machine learning — smaller, faster, and far more explainable, which matters a lot for a government-facing fraud-detection tool where every flag needs a defensible reason.

---

## 3. How it's all connected (architecture)

```
                     ┌───────────────────────┐
   CSV of real       │                       │
   MPLADS project ───▶   FastAPI Backend     │
   data              │   (this codebase)     │
                     │                       │
                     │  ┌─────────────────┐  │
                     │  │ In-memory list   │◀─┼── used automatically if no
                     │  │ (default)        │  │   database is configured
                     │  └─────────────────┘  │
                     │          OR            │
                     │  ┌─────────────────┐  │
                     │  │  MongoDB         │◀─┼── used automatically if you
                     │  │  (if configured) │  │   set MONGODB_URI
                     │  └─────────────────┘  │
                     └───────────┬───────────┘
                                 │  REST API (JSON over HTTP)
                                 ▼
                     ┌───────────────────────┐
                     │   Frontend (React)     │  ⚠️ see Section 8 — this is
                     │   Dashboards, maps,     │  currently NOT wired to this
                     │   charts, forms         │  backend, it shows fake data
                     └───────────────────────┘
```

Inside the backend, a request like *"score project MPLAD-26-1021"* flows through:

```
Request → FastAPI endpoint → Pydantic validates the data →
   → Rule-based formulas (interpretable math)         ─┐
   → Trained ML models (IsolationForest, etc.)         ├─▶ blended into one score
   → Cartel/duplicate checks (NetworkX, TF-IDF)        ┘
→ If risk = CRITICAL → Alert fired (console + optional webhook)
→ JSON response sent back
```

---

## 4. How the "AI" parts actually work (explained simply)

### a) Anomaly Scorer — "does this project's numbers look normal?"
Every project has three key ratios: how much of the sanctioned money has been *released*, how much of the physical *work* is actually done, and how much of the allocated *time* has passed. In a healthy project, these three roughly move together. If money is flying out but the work isn't happening, that's a red flag.

Two things score this, and they're blended together:
- **A simple formula** (interpretable): literally subtracts progress-ratio from money-ratio and scales it. Anyone can check this math by hand.
- **A trained model (Isolation Forest)**: this is a machine learning algorithm that looks at *combinations* of features and learns what a "normal" combination looks like, then measures how far outside that normal cluster a new project falls. It can catch weird combinations the simple formula would miss (e.g. two individually-okay numbers that are unusual *together*).

> ⚠️ **Important honesty note:** there is no real historical MPLADS dataset to train this model on yet, so it was "bootstrapped" — trained on a synthetic (artificially generated) set of realistic-looking healthy vs. unhealthy projects, following domain logic about what healthy/unhealthy patterns look like. It works and demonstrates the real technique correctly, but its exact numbers will get more accurate once you feed it real historical data (see Section 9). This is clearly commented in the code (`app/ml/anomaly_model.py`) — be upfront about this if judges ask.

### b) Overrun Predictor — "is this project going to be late?"
A **logistic regression** model (one of the simplest, most explainable ML techniques — it outputs a probability, not just yes/no) trained to estimate the probability a project will blow past its deadline, based on how its time-used vs. work-done ratio is trending *right now*. This is what makes the system "predictive" rather than just reactive — it can warn you *before* a project is actually late.

Same honesty note as above: bootstrapped on synthetic data, retrains easily on real data later.

### c) Duplicate Work Detector — "was this exact work sanctioned twice?"
A classic fraud pattern: the same physical work (say, a community hall) gets sanctioned twice with a slightly reworded title, sometimes under a different contractor, to draw funds twice. This module compares project titles within the same district using **TF-IDF** (a way of turning text into numbers based on which words matter most) and **cosine similarity** (a way of measuring how "close" two of those number-vectors are). If two titles are suspiciously similar, it's flagged.

### d) Cartel / Monopoly Detector — "does one contractor control this district?"
Builds a graph (using NetworkX) connecting contractors to the projects they've won, then checks what percentage of a district's total project money each contractor controls. Above a threshold (default 35%), that's flagged as a possible monopoly — a common sign of rigged/collusive tendering.

### e) Image Forensics — "is this progress photo real and where it's supposed to be?"
- **Duplicate detection:** computes a "perceptual hash" (a fingerprint based on the image's visual pattern, not its exact bytes — so even a slightly resized/recompressed copy of the same photo still matches) plus a color-histogram comparison, and checks new photos against previously submitted ones.
- **Location check:** reads the GPS coordinates baked directly into the photo's own metadata (EXIF data — the same hidden info your phone stores in every photo it takes) and compares it against where the project is officially supposed to be. This is the honest way to do it — trusting a location typed into a form instead would let anyone just type in the "correct" coordinates regardless of where the photo was actually taken.
- **Tamper check:** uses Error Level Analysis (ELA) — recompresses the image and looks for regions that compress differently than the rest, a well-known cheap signal that part of an image was edited after the fact.

---

## 5. Project structure

```
Backend/
├── app/
│   ├── main.py                     # App entrypoint — wires everything together, starts the DB connection
│   ├── core/config.py              # All tunable settings (thresholds, weights, env vars) in one place
│   ├── models/schemas.py           # Every data shape the API accepts/returns (Pydantic models)
│   ├── db/mongo.py                 # MongoDB-or-in-memory-fallback data layer
│   ├── ml/
│   │   ├── anomaly_model.py        # IsolationForest anomaly detector
│   │   ├── overrun_predictor.py    # Logistic regression overrun predictor
│   │   └── duplicate_detector.py   # TF-IDF duplicate-title detector
│   ├── services/
│   │   ├── anomaly_scorer.py       # Combines rules + ML into the final risk score
│   │   ├── cartel_detector.py      # Contractor monopoly/cartel graph analysis
│   │   ├── image_forensics.py      # Photo duplicate/GPS/tamper checks
│   │   └── alerting.py             # Fires alerts on CRITICAL risk
│   └── api/endpoints/
│       ├── health.py               # GET /health — is the service alive?
│       ├── analytics.py            # Project listing, scoring, CSV import
│       ├── cartel.py               # Cartel network graph endpoint
│       ├── forensics.py            # Photo verification endpoint
│       └── dashboard.py            # Role-scoped dashboard summaries
├── requirements.txt                 # Exact list of Python libraries needed
├── Dockerfile                       # Instructions to package this into a container
└── README.md                        # You are here
```

---

## 6. Running it locally

```bash
cd Backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Then open **http://localhost:8000/docs** — FastAPI auto-generates a full interactive page where you can try every endpoint by clicking buttons, no coding needed. This is the fastest way to see the whole system working.

No database setup is required to try it — it runs immediately with 3 sample projects baked in.

---

## 7. Replacing your existing repo's Backend with this one

Because the current React frontend (`Frontend/src`) talks entirely to mock/fake data and **does not call this backend at all yet** (see Section 8 — important), swapping the `Backend/` folder is very low-risk. Nothing in the frontend references anything inside `Backend/`, so there's nothing there for this change to break.

```bash
# 1. From your repo root, back up the old backend just in case
git checkout -b backend-v2
mv Backend Backend_old_backup

# 2. Unzip this new version in its place
unzip MPLADS_Backend_v2.zip -d .
# (this creates a fresh Backend/ folder)

# 3. Sanity check it runs
cd Backend
pip install -r requirements.txt
uvicorn app.main:app --reload
# visit http://localhost:8000/docs and click through a few endpoints

# 4. Once you're happy, remove the backup and commit
cd ..
rm -rf Backend_old_backup
git add Backend
git commit -m "Upgrade backend: ML scoring, Mongo support, dashboards, alerting, forensics"
git push origin backend-v2
# then open a PR / merge to main as usual
```

### What else to check when you redeploy
- **`docker-compose.yml`** at your repo root already points at `./Backend` and its `Dockerfile` — no changes needed there, it'll just pick up the new code and rebuild.
- **`requirements.txt` changed** — it now includes `scikit-learn` and `motor` (new), which your hosting platform (Render, Railway, etc.) will auto-install on the next deploy since it just runs `pip install -r requirements.txt`. Nothing manual needed, just know the build will take a little longer than before.
- **`Dockerfile` was fixed** — it used to try to copy a `models/` folder that didn't exist, which would break `docker build` entirely. That's fixed now; you shouldn't have been able to build the old Docker image successfully, so this is a pure improvement.
- **No breaking API changes** — every field the old API returned is still there; I only *added* new optional fields (like `overrun_probability`) and new endpoints (`/dashboard/summary`, `/analytics/projects/import`). If anything external was already calling the old endpoints, it keeps working unchanged.
- **One small behavior change:** `GET /cartel/matrix?district=X` used to silently return *all* districts' data mislabeled as district X if X didn't exist — that was a bug (Section from earlier conversation). Now it correctly returns a 404. If any code was relying on that fallback-to-everything behavior, it'll need to handle the 404 instead — but nothing in this codebase relied on that, it was purely a bug.

---

## 8. ✅ Update: the frontend is now wired to this backend

An earlier version of this README flagged that `Frontend/src/services/api.js` was 100% mock data, disconnected from this backend. **That's now fixed.** `api.js` has been rewritten to call the real FastAPI endpoints below, with the same function names and return shapes the pages already expected — so pages didn't need rewrites, just the data source underneath them changed:

| Frontend function | Now calls |
|---|---|
| `getProjects`, `getProjectById`, `getHighRiskProjects`, `getNationalKPIs` | `GET /analytics/projects` + `GET /analytics/score-project/{id}` (fetched and blended client-side) |
| `getCartelNetwork` | `GET /cartel/matrix?district=...` |
| `getStateRiskData`, `getFraudBreakdown` | Computed client-side from real scored projects |
| `verifyEvidence` (new) | `POST /forensics/verify-images` — the Evidence Lab's "Run Live OpenCV Scan" button now calls this for real |
| `importProjectsCSV` (new) | `POST /analytics/projects/import` — wired into a new "Import CSV" button on the Admin Dashboard |
| `getDashboardSummary` (new) | `GET /dashboard/summary?role=...&scope=...` — available for use, not yet wired into a dedicated route |

**Still mock (no backend equivalent exists yet, clearly commented in `api.js`):** `getSLAAlerts`, `getCitizenReports`, `submitCitizenReport`, `getNotifications`. These are their own feature areas the backend doesn't model yet — see Section 11 for what a real version of each would need.

**Also fixed along the way:** the Cartel Matrix page used to be a completely hardcoded static graph (fixed positions, fixed fake entity names) that never actually rendered `networkData` at all — it now renders a real bipartite graph from live `/cartel/matrix` data with a working district selector. The Evidence Lab's forensic comparison used `Math.random()` to fake a similarity score — it now sends real images to the backend's EXIF-GPS + perceptual-hash + ELA tamper detector and displays the real verdict. Several dashboard cards (the "critical alert" banner, the flagged-project count) were hardcoded to a fake demo project ID with fabricated statistics — they now reflect whatever project is actually highest-risk in your real data.

**Verified end-to-end:** every page's data-fetching logic was simulated against a live instance of this backend (loading real projects, scoring them, hitting every cartel/dashboard endpoint for every district and state present in the data) with zero crashes or missing-field errors, then the full frontend was built with `npm run build` with zero errors.

---

## 9. Loading your real MPLADS CSV data

Use the new `POST /api/v1/analytics/projects/import` endpoint — either via the `/docs` page (click the endpoint → "Try it out" → choose your file → Execute) or via curl:

```bash
curl -X POST http://localhost:8000/api/v1/analytics/projects/import \
  -F "file=@your_mplads_data.csv"
```

**Your CSV needs these exact column headers** (order doesn't matter, but the names do):

```
project_id, title, state, district, constituency, category,
sanctioned_amount, funds_released, funds_utilized, physical_progress_pct,
sanction_date, expected_completion_date, days_elapsed, allocated_duration_days,
contractor_id, contractor_name, latitude, longitude
```

If your real CSV export uses different column names (very likely, since government portals rarely match this exactly), the easiest fix is to open it in Excel/Google Sheets and rename the header row to match the list above — no code changes needed. If you'd rather I write a small mapping script that translates your actual column names automatically, share a sample of your CSV's header row (just the header, no need for real data if it's sensitive) and I'll write it.

The endpoint validates every row and reports exactly which rows failed and why (e.g. `"Row 14: invalid literal for float(): 'N/A'"`) instead of silently skipping bad data — check the `errors` field in the response after importing.

**Important:** if you're running without MongoDB configured, imported data only lasts until the server restarts (see Section 10). For real data to persist, set `MONGODB_URI` (a free MongoDB Atlas cluster works fine for this scale).

---

## 10. Known limitations — be upfront about these

- **No authentication.** The dashboard endpoint's `role`/`scope` are trusted query parameters, not derived from a verified login — anyone can currently request any role's view by just changing the URL. Fine for a demo, not for production.
- **ML models are bootstrapped on synthetic data**, not real historical MPLADS outcomes (none existed at build time). The techniques are real and correctly implemented, but exact score thresholds should be re-validated once real labeled data is available — see `.retrain()` methods in `app/ml/`.
- **In-memory mode has zero durability.** Without `MONGODB_URI` set, every restart wipes any CSV-imported data back to the 3 seed projects. Fine for local testing, not for anything you need to survive a redeploy.
- **Four frontend features remain mock-only** because the backend has no matching endpoint yet: SLA compliance alerts, citizen fraud reports, in-app notifications, and persisting an officer's approve/flag decision (that last one updates the UI for the session but isn't saved anywhere real). See Section 11 for what each would need.
- **The ELA tamper-detection score is a heuristic, not proof.** It's a well-known, cheap signal worth a second look, not a courtroom-grade forensic conclusion — the code and API responses are worded that way on purpose; keep that framing if you build UI around it.
- **No rate limiting or request size limits** on the CSV import or image upload endpoints — someone could upload a huge file and tie up the server. Not a concern for a demo, worth adding (`python-multipart` supports max size limits) before any public deployment.
- **The `/analytics/projects` endpoint has no pagination** — fine at a handful of projects, will need it once you're importing thousands of real records, since the frontend currently loads and scores the entire list on every page load.

---

## 11. What to do next (roughly in priority order)

1. **Import your real MPLADS CSV** (Section 9), then call `.retrain()` on the anomaly and overrun models with real feature/outcome data once you have enough history — this turns the honest "synthetic bootstrap" caveat into "trained on real government data," a much stronger claim for judges.
2. **Add basic auth** in front of the dashboard endpoint so role/scope come from a verified login token, not a raw query string — and add a real `POST /analytics/projects/{id}/decision` endpoint so an officer's flag/verify action actually persists instead of only updating the current browser session.
3. **Set up MongoDB Atlas** (free tier) and set `MONGODB_URI` so imported/scored data survives restarts and redeploys.
4. **Build real backends for the still-mock features**, in order of likely judging impact:
   - SLA alerts: a scheduled job (or a computed field on `GET /analytics/projects`) flagging projects within N days of their deadline.
   - Citizen reports: a `POST /citizen/reports` endpoint + a collection to store them, so `CitizenReport.jsx`'s submissions go somewhere real.
   - Notifications: likely derived from the alerting service (`app/services/alerting.py`) already firing on CRITICAL — persist those events instead of only logging/webhooking them.
5. **Add pagination** to `GET /analytics/projects` and adjust `api.js`'s `loadAllScoredProjects()` to fetch pages instead of the whole list.
6. **Add a `/dashboard/summary` cache or background job** — right now every dashboard request re-scores every in-scope project live; fine at small scale, worth precomputing once you have real volume.
7. **Wire `getDashboardSummary` into a real route** — the endpoint and frontend function both exist and work, but there's no dedicated page using it yet (the existing Admin/District dashboards cover similar ground at the Ministry/District level, but true per-MP and per-State-Nodal scoped views aren't built).

If you want help with any of these, just say which one and share what's needed (a sample of your real CSV headers, what a citizen report should capture, etc.) and I'll build it out the same way as this round: written, tested end-to-end, and handed back working.
