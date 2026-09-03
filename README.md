# MPLADS-AI: SIH26102 · Code Acers
### AI-Powered Anomaly, Fraud & Inefficiency Detection for the MPLAD Scheme

A full-stack system that automatically flags risky, fraudulent, or inefficient government infrastructure projects under India's MPLAD Scheme — combining a Python/FastAPI backend (rule-based + machine-learning risk scoring, contractor cartel detection, photo forensics) with a React dashboard for MPs, District Authorities, State Nodal Officers, and the Ministry.

```
├── Backend/    FastAPI + ML service — the actual intelligence engine. Full docs: Backend/README.md
├── Frontend/   React (Vite) dashboard — now wired to the real Backend, not mock data
├── docs/       Supporting documents
└── docker-compose.yml   Runs both together in containers
```

## Quick start (run both locally)

```bash
# Terminal 1 — backend
cd Backend
pip install -r requirements.txt
uvicorn app.main:app --reload
# → http://localhost:8000/docs

# Terminal 2 — frontend
cd Frontend
npm install
npm run dev
# → http://localhost:5173
```

No database setup needed to try it — the backend runs standalone with 3 sample projects baked in, and the frontend talks to it automatically (`http://localhost:8000` is the default).

## Where to look for what

- **How the AI/ML actually works, tech stack explained for beginners, deployment, and loading your real MPLADS CSV data:** see [`Backend/README.md`](Backend/README.md) — this is the detailed doc.
- **What's real vs. still-mocked in the frontend** (SLA alerts, citizen reports, and notifications don't have a backend yet — everything else does): see Section 8 of `Backend/README.md`.
- **Known limitations and prioritized next steps:** Sections 10–11 of `Backend/README.md`.

## Docker

```bash
docker-compose up --build
```

Builds and runs the backend container per `Backend/Dockerfile`. Deploy the frontend separately (Vercel/Netlify) and set `VITE_API_BASE` (see `Frontend/.env.example`) to point at your deployed backend URL.
