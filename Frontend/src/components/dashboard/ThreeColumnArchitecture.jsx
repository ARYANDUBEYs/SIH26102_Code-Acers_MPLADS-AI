import React, { useState } from 'react';
import {
  Cpu,
  Calculator,
  LayoutDashboard,
  Camera,
  Network,
  Mountain,
  Binary,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Map,
  SlidersHorizontal,
  Volume2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../utils/helpers';
import { Link } from 'react-router-dom';

export const ThreeColumnArchitecture = ({ onOpenSlideOver, onOpenVoiceModal }) => {
  const { t } = useLanguage();
  const [activeFormulaTab, setActiveFormulaTab] = useState('formula');

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-blue-900 text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-[#0B2545] tracking-tight">
              {t('arch_title', 'MPLAD Sentinel Architecture & Core Intelligence Engine')}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('arch_subtitle', 'Three-Pillar Continuous Audit Architecture: AI Analytics, Mathematical Risk Scoring, and Geospatial Interfaces')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            FastAPI Production Microservices • Active
          </span>
        </div>
      </div>

      {/* The Three Vertical Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* ================================================================ */}
        {/* COLUMN 1: AI Analytics Engines (The Brains)                      */}
        {/* ================================================================ */}
        <div className="bg-gov-surface border border-gov-border rounded-md p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors">
          <div className="space-y-4">
            {/* Column Masthead */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-700">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-[#0B2545] uppercase tracking-wide">
                    {t('arch_col1_title', 'AI Analytics Engines (The Brains)')}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500">
                  {t('arch_col1_sub', 'Automated perceptual hashing & graph ML replacing subjective auditing')}
                </p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded">
                Col 1
              </span>
            </div>

            {/* Feature 1: dHash OpenCV */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-3.5 h-3.5 text-blue-700" />
                  <span className="text-xs font-bold text-slate-900">
                    {t('arch_col1_f1_title', 'Duplicate Image Detection (OpenCV dHash)')}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.5 border border-slate-200 rounded font-semibold">
                  64-bit Hash
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {t('arch_col1_f1_desc', '64-bit Difference Hashing and Hamming distance cross-reference site photos across districts to instantly flag reused images.')}
              </p>
              <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-500">
                <span>Metric: Hamming Distance $\le 5$</span>
                <span className="text-emerald-700 font-semibold">O(1) Lookup</span>
              </div>
            </div>

            {/* Feature 2: NetworkX Cartel Analyzer */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Network className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-xs font-bold text-slate-900">
                    {t('arch_col1_f2_title', 'Contractor Cartel Analyzer (NetworkX)')}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 border border-amber-200 rounded font-semibold">
                  HHI Metric
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {t('arch_col1_f2_desc', 'Constructs bipartite procurement graphs and calculates Herfindahl-Hirschman Index (HHI) to expose vendor syndicates.')}
              </p>
              <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-500">
                <span>Threshold: HHI &gt; 2500</span>
                <span className="text-rose-700 font-semibold">Syndicate Alert</span>
              </div>
            </div>

            {/* Feature 3: Terrain & Climate Normalization */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mountain className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-xs font-bold text-slate-900">
                    {t('arch_col1_f3_title', 'Terrain & Climate Normalization')}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200 rounded font-semibold">
                  Fairness ML
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {t('arch_col1_f3_desc', 'Calibrates anomaly thresholds for Himalayan, hill, and monsoon-disrupted districts to eliminate regional bias.')}
              </p>
            </div>
          </div>

          <Link
            to="/evidence"
            className="w-full py-2 px-3 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50/80 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Open Forensic Evidence Lab</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ================================================================ */}
        {/* COLUMN 2: Machine Learning Models & Triage Intelligence         */}
        {/* ================================================================ */}
        <div className="bg-gov-surface border border-gov-border rounded-md p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors">
          <div className="space-y-4">
            {/* Column Masthead */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-[#0B2545] uppercase tracking-wide">
                    {t('arch_col2_title', 'ML Models & Anomaly Detection')}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500">
                  {t('arch_col2_sub', 'Ensemble machine learning for unsupervised anomaly & supervised risk ranking')}
                </p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded">
                Col 2
              </span>
            </div>

            {/* Feature 1: Isolation Forest (Unsupervised) */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Binary className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-900">
                    Isolation Forest
                  </span>
                </div>
                <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 border border-indigo-200 rounded font-bold">
                  Unsupervised Anomaly
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Partitions high-dimensional financial velocity and disbursement irregularities by recursive random splitting. Isolates subtle expenditure anomalies with zero dependency on prior fraud labels.
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 font-mono text-[10px] text-slate-500">
                <span>Kernel: Tree Ensembles</span>
                <span className="text-indigo-700 font-semibold">Contamination: 0.05</span>
              </div>
            </div>

            {/* Feature 2: XGBoost Classifier (Supervised) */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-xs font-bold text-slate-900">
                    XGBoost Classifier
                  </span>
                </div>
                <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 border border-amber-200 rounded font-bold">
                  Gradient Boosted Risk
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Evaluates 24 multi-factor features across milestone completion slippage, contractor cartel concentration (HHI), and audit logs to output a calibrated 0–100 risk probability with explainable SHAP weights.
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 font-mono text-[10px] text-slate-500">
                <span>Objective: binary:logistic</span>
                <span className="text-amber-700 font-semibold">AUC-ROC: 0.942</span>
              </div>
            </div>

            {/* Feature 3: Categorized Triage Tiers */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 block">
                  {t('arch_col2_f2_title', 'Categorized Triage Tiers')}
                </span>
                <span className="text-[9px] font-mono text-slate-500">Continuous Evaluation</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold font-mono">
                <div className="p-2 rounded bg-rose-50 border border-rose-200 text-rose-800">
                  <div>🔴 High Risk</div>
                  <div className="text-[9px] text-rose-600 font-normal mt-0.5">Score &gt; 70</div>
                </div>
                <div className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-800">
                  <div>🟡 Warning</div>
                  <div className="text-[9px] text-amber-600 font-normal mt-0.5">Score 40–69</div>
                </div>
                <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-800">
                  <div>🟢 Safe</div>
                  <div className="text-[9px] text-emerald-600 font-normal mt-0.5">Score &lt; 40</div>
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/analytics"
            className="w-full py-2 px-3 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Inspect Model Performance & Analytics</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ================================================================ */}
        {/* COLUMN 3: Interactive Dashboards (The Interface)                 */}
        {/* ================================================================ */}
        <div className="bg-gov-surface border border-gov-border rounded-md p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors">
          <div className="space-y-4">
            {/* Column Masthead */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700">
                    <LayoutDashboard className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-[#0B2545] uppercase tracking-wide">
                    {t('arch_col3_title', 'Interactive Dashboards (The Interface)')}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500">
                  {t('arch_col3_sub', 'Enterprise GIS maps, slide-over audit sheets, and voice intelligence')}
                </p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                Col 3
              </span>
            </div>

            {/* Feature 1: Geospatial District Map */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Map className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-xs font-bold text-slate-900">
                    {t('arch_col3_f1_title', 'Geospatial District Map (Leaflet.js)')}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200 rounded font-semibold">
                  GIS Layer
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {t('arch_col3_f1_desc', 'Interactive GIS map with color-coded pins displaying total funds, unspent balances, and regional risk clusters.')}
              </p>
              <Link
                to="/risk-map"
                className="inline-flex items-center gap-1 text-xs text-blue-700 font-semibold hover:underline pt-0.5"
              >
                <span>Launch National Geospatial Map</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Feature 2: Drill-Down Slide-Over Sheets */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-blue-700" />
                  <span className="text-xs font-bold text-slate-900">
                    {t('arch_col3_f2_title', 'Drill-Down Slide-Over Sheets')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenSlideOver && onOpenSlideOver()}
                  className="text-[10px] font-mono text-blue-800 bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 border border-blue-200 rounded font-bold transition-colors cursor-pointer"
                >
                  Test Slide-Over
                </button>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {t('arch_col3_f2_desc', 'Granular project audit panels detailing budget vs. spend, timeline delays, photo evidence, and specific AI warning tags.')}
              </p>
            </div>

            {/* Feature 3: Sarvam Sovereign Voice AI */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-3.5 h-3.5 text-orange-600" />
                  <span className="text-xs font-bold text-slate-900">
                    {t('arch_col3_f3_title', 'Sarvam AI Sovereign Voice Intelligence')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenVoiceModal && onOpenVoiceModal()}
                  className="text-[10px] font-mono text-orange-900 bg-orange-100 hover:bg-orange-200 px-1.5 py-0.5 border border-orange-300 rounded font-bold transition-colors cursor-pointer"
                >
                  🇮🇳 Listen TTS
                </button>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {t('arch_col3_f3_desc', 'Multilingual TTS audio briefings and Saaras ASR vernacular grievance speech processing for rural citizens.')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenSlideOver && onOpenSlideOver()}
            className="w-full py-2 px-3 text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Open Sample Audit Dossier</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
