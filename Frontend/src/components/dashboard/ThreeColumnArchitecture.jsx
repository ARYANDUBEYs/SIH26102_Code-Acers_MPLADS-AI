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
        {/* COLUMN 1: Automated Evidence & Fraud Checks                      */}
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
                    1. Automated Evidence & Fraud Checks
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500">
                  Scans project photos, contractor bids, and terrain benchmarks automatically
                </p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded">
                Pillar 1
              </span>
            </div>

            {/* Feature 1: Duplicate Image Detection */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-3.5 h-3.5 text-blue-700" />
                  <span className="text-xs font-bold text-slate-900">
                    Duplicate Photo Detection
                  </span>
                </div>
                <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 border border-blue-200 rounded font-semibold">
                  Photo Fingerprint
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Compares progress photos against all past projects across India to immediately catch and block reused pictures from older or other works.
              </p>
              <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-500">
                <span>Check: Instant Digital Signature</span>
                <span className="text-emerald-700 font-semibold">Active Across India</span>
              </div>
            </div>

            {/* Feature 2: Contractor Cartel Analyzer */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Network className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-xs font-bold text-slate-900">
                    Contractor Syndicate & Cartel Monitor
                  </span>
                </div>
                <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 border border-amber-200 rounded font-semibold">
                  Bid Monopolies
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Tracks procurement patterns to uncover contractor groups that collude and secretly divide local tenders among themselves to avoid fair bidding.
              </p>
              <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-500">
                <span>Rule: Fair Tender Distribution</span>
                <span className="text-rose-700 font-semibold">Syndicate Alert</span>
              </div>
            </div>

            {/* Feature 3: Terrain & Climate Normalization */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mountain className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-xs font-bold text-slate-900">
                    Fair Mountain & Forest Pricing
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200 rounded font-semibold">
                  Fairness Rules
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Automatically adjusts cost and timeline expectations for hilly, remote, or monsoon-affected areas so honest projects are not wrongly flagged.
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
        {/* COLUMN 2: AI Risk Scoring Models                                 */}
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
                    2. AI Risk Scoring Models
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500">
                  Learns spending patterns and ranks works by risk from 0 to 100
                </p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded">
                Pillar 2
              </span>
            </div>

            {/* Feature 1: Isolation Forest */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Binary className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-900">
                    Isolation Forest (Anomaly Finder)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 border border-indigo-200 rounded font-bold">
                  Pattern AI
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Learns standard spending timelines across normal works and flags unusual money release patterns without needing past examples of fraud.
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 font-mono text-[10px] text-slate-500">
                <span>Detection: Self-Learning Trees</span>
                <span className="text-indigo-700 font-semibold">Continuous Audit</span>
              </div>
            </div>

            {/* Feature 2: XGBoost Classifier */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-xs font-bold text-slate-900">
                    XGBoost Classifier (Risk Ranking)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 border border-amber-200 rounded font-bold">
                  0–100 Score
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Combines 24 factors including project delays, photo verification, and contractor history to output a single, easy-to-understand risk score.
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 font-mono text-[10px] text-slate-500">
                <span>Output: Explainable Factors</span>
                <span className="text-amber-700 font-semibold">Accuracy: 94.2%</span>
              </div>
            </div>

            {/* Feature 3: Categorized Triage Tiers */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 block">
                  Three Clear Action Categories
                </span>
                <span className="text-[9px] font-mono text-slate-500">Live Status</span>
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
        {/* COLUMN 3: Interactive Dashboards & Voice Intelligence            */}
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
                    3. Interactive Dashboards & Voice AI
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500">
                  Live GIS maps, project drill-down dossiers, and Indian voice access
                </p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                Pillar 3
              </span>
            </div>

            {/* Feature 1: Geospatial District Map */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Map className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-xs font-bold text-slate-900">
                    Interactive Constituency Map
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200 rounded font-semibold">
                  Live Map
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Color-coded nationwide map showing every sanctioned work, disbursed funds, and localized risk alerts with a single click.
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
                    One-Click Project Dossier
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
                Provides a complete overview of budget spent, physical progress photos, delay timeline, and specific reasons for any alert.
              </p>
            </div>

            {/* Feature 3: Sarvam Sovereign Voice AI */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-3.5 h-3.5 text-orange-600" />
                  <span className="text-xs font-bold text-slate-900">
                    Vernacular Voice Assistant
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenVoiceModal && onOpenVoiceModal()}
                  className="text-[10px] font-mono text-orange-900 bg-orange-100 hover:bg-orange-200 px-1.5 py-0.5 border border-orange-300 rounded font-bold transition-colors cursor-pointer"
                >
                  🇮🇳 Listen Audio
                </button>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Spoken audio briefings in 8 Indian languages allowing citizens to listen to project details or record grievances in their native dialect.
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
