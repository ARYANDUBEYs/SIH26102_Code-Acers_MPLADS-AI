# 🛠️ V-Shield AI: Prototype Roadmap & Implementation Plan
## Problem Statement: `SIH26102` (Voice Cloning Detection)

---

## 🎯 The Prototype Vision
A fully working prototype consisting of:
1. **The Audio Forensics Engine (Python/PyTorch):** Ingests any `.mp3`/`.wav` recording or live mic stream $\rightarrow$ extracts acoustic & neural features $\rightarrow$ outputs a **Synthetic Voice Probability Score (0-100%)**.
2. **The Web Forensic Dashboard (React/Next.js):** 
   * Live audio recording / file upload.
   * Interactive audio waveform & Mel-Spectrogram visualizer (via Wavesurfer.js).
   * Visual indicator: 🟢 **REAL HUMAN VOICE** vs 🔴 **AI SYNTHETIC CLONE DETECTED**.
   * One-click **Forensic Investigation Report (PDF)** export.

---

## 📅 3-Week Prototype Sprint Timeline

```mermaid
gantt
    title SIH Prototype Development Sprint
    dateFormat  YYYY-MM-DD
    section Phase 1: Data & Feature Extraction
    Audio Datasets Setup (ASVspoof & ElevenLabs samples) :2026-08-23, 4d
    Acoustic Feature Extraction (MFCC, Mel-Spec, Pitch)  :2026-08-25, 4d
    section Phase 2: Core AI Model
    Fine-tuning Wav2Vec2 / CNN-LSTM Classifier          :2026-08-28, 5d
    Model Quantization (ONNX for <500ms CPU inference)  :2026-09-02, 3d
    section Phase 3: Backend & API
    FastAPI Real-time WebSocket Audio Stream Server     :2026-09-04, 4d
    section Phase 4: Frontend Dashboard & Demo
    React / Next.js Audio Visualizer Dashboard          :2026-09-07, 5d
    Live Demo Testing & Pitch Deck Finalization         :2026-09-12, 3d
```

---

## 👥 Team Workload Breakdown (6 Members):

* **Member 1 (Rohit - Lead AI & Architecture):** Audio preprocessing, feature extraction pipeline (Librosa / PyTorch), and model inference.
* **Member 2 (ML Engineer):** Dataset curation, model evaluation on diverse Indian accents, and threshold tuning.
* **Member 3 (Full-Stack Frontend):** Next.js dashboard, visual spectrogram heatmaps, and audio recording interface.
* **Member 4 (Backend & API):** FastAPI backend, WebSocket streaming, and PDF report generator.
* **Member 5 (Mobile / App UI):** Mobile prototype screen (Android caller warning overlay concept).
* **Member 6 (UI/UX & Documentation):** Official SIH PPT deck, system flowcharts, and video demonstration.
