# 🏛️ MPLADS-AI: Backend Intelligence Engine
### AI-Powered Anomaly, Fraud & Inefficiency Monitoring System (MoSPI / SIH 2026)

---

## 🚀 Overview
The **MPLADS-AI Backend** is a high-performance Python FastAPI service providing automated audit intelligence for government infrastructure projects sanctioned under the **Member of Parliament Local Area Development Scheme (MPLADS)**.

---

## 🧠 Core Intelligence Modules

1. **Computer Vision Image Forensics (`app/services/image_forensics.py`):**
   * Dual-stage image deduplication (Perceptual Gradients + Cosine Color Vector).
   * EXIF GPS verification against sanctioned project bounds (Haversine Formula).
2. **Contractor Cartel & Collusion Analyzer (`app/services/cartel_detector.py`):**
   * Bipartite graph network analysis using NetworkX.
   * Uncovers local vendor monopolies and cyclic co-bidding rings.
3. **Multi-Factor Anomaly & Inefficiency Scorer (`app/services/anomaly_scorer.py`):**
   * Computes normalized 0-100 Risk Index based on financial drift, timeline delays, and vendor historical flags.

---

## 🛠️ Setup & Execution

```bash
# 1. Navigate to Backend directory
cd Backend

# 2. Install dependencies
pip install -r requirements.txt

# 3. Start the FastAPI Server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

* **Interactive API Documentation:** `http://localhost:8000/docs`
* **Alternative ReDoc:** `http://localhost:8000/redoc`

---

## 🌐 API Endpoint End-to-End Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | System health probe and active model status |
| `POST` | `/api/v1/forensics/verify-images` | Uploads site photos to detect image reuse & GPS distance |
| `GET` | `/api/v1/cartel/matrix?district=Nandurbar` | Generates graph nodes & edges for cartel visualization |
| `GET` | `/api/v1/analytics/projects` | Lists all active DigiGov MPLADS project records |
| `POST` | `/api/v1/analytics/score-project` | Computes multi-factor risk score for any project |
