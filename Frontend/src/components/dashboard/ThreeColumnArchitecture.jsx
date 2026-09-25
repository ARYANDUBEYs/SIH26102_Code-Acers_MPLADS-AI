import React from 'react';
import {
  FileText,
  MapPin,
  FileSpreadsheet,
  Mic,
  TrendingUp,
  FileCheck,
  ChevronRight,
  Shield,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  useSmoothScrollProgress,
  getStageStyle,
  TypewriterHeading
} from '../../hooks/useScrollReveal';

export const ThreeColumnArchitecture = ({ onOpenSlideOver, onOpenVoiceModal, canAppear = true }) => {
  const { isAdmin, isDistrictOfficer } = useAuth();
  const [gridRef, progress] = useSmoothScrollProgress(240, 0, {
    maxStep: 0.018,
    enabled: canAppear
  });

  return (
    <div ref={gridRef} className="space-y-6">
      {/* The Three Sentinel Pillars Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* ================================================================ */}
        {/* COLUMN 1: Evidence & Fraud Checks                                */}
        {/* ================================================================ */}
        {/* Stage 1: Container 1 Appears First (0.00 -> 0.17) */}
        <div
          style={getStageStyle(progress, 0.0, 0.17, 24)}
          className="bg-white/95 rounded-2xl border-[3px] border-[#2E1065] shadow-sm p-6 flex flex-col justify-between space-y-5 hover:shadow-md transition-shadow"
        >
          <div className="space-y-4">
            {/* Header: Circle Number 1 & Left-to-Right Typing Heading (0.18 -> 0.42) */}
            <div className="flex items-center gap-3.5 pb-2">
              <div
                style={getStageStyle(progress, 0.16, 0.26, 8)}
                className="w-10 h-10 rounded-full bg-[#2E1065] text-white font-black text-lg flex items-center justify-center shrink-0 shadow-sm"
              >
                1
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
                  <TypewriterHeading
                    text="Evidence & Fraud Checks"
                    progress={progress}
                    start={0.18}
                    end={0.42}
                    cursorClassName="bg-purple-600"
                  />
                </h3>
              </div>
            </div>

            {/* Item 1: Duplicate Photo Detection with Image Thumbnail (0.44 -> 0.58) */}
            <div
              style={getStageStyle(progress, 0.44, 0.58, 16)}
              className="p-3 bg-slate-50/70 hover:bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3.5 transition-colors"
            >
              <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-200">
                <img
                  src="/projects/ruralroad.jpg"
                  alt="Duplicate Photo Scan"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=200&auto=format&fit=crop&q=80";
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  Duplicate Photo Detection
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                  Finds reused or edited images across projects.
                </p>
              </div>
            </div>

            {/* Item 2: Contractor & Cartel Monitor (0.56 -> 0.70) */}
            <div
              style={getStageStyle(progress, 0.56, 0.70, 16)}
              className="p-3 bg-slate-50/70 hover:bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3.5 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50/80 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <FileSpreadsheet className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  Contractor & Cartel Monitor
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                  Flags unusual patterns in bidding and contractors.
                </p>
              </div>
            </div>

            {/* Item 3: Fair Pricing & Location Check (0.68 -> 0.82) */}
            <div
              style={getStageStyle(progress, 0.68, 0.82, 16)}
              className="p-3 bg-slate-50/70 hover:bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3.5 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50/80 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <MapPin className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  Fair Pricing & Location Check
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                  Detects over/under pricing and wrong locations.
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer: Open Forensic Evidence Lab (0.80 -> 0.94) */}
          {(isAdmin || isDistrictOfficer) && (
            <div style={getStageStyle(progress, 0.80, 0.94, 14)} className="pt-2">
              <Link
                to="/evidence"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-50/80 via-blue-50/40 to-indigo-50/80 hover:from-blue-100 hover:to-indigo-100 border border-blue-200/80 flex items-center justify-between text-left group transition-all"
              >
                <div>
                  <span className="text-xs font-bold text-blue-700 flex items-center gap-1 group-hover:text-blue-900">
                    Open Forensic Evidence Lab <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Deeper analysis when you need it.
                  </span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* ================================================================ */}
        {/* COLUMN 2: AI Risk Scoring Models                                 */}
        {/* ================================================================ */}
        {/* Stage 1: Container 2 Appears (0.03 -> 0.20) */}
        <div
          style={getStageStyle(progress, 0.03, 0.20, 24)}
          className="bg-white/95 rounded-2xl border-[3px] border-[#2E1065] shadow-sm p-6 flex flex-col justify-between space-y-5 hover:shadow-md transition-shadow"
        >
          <div className="space-y-4">
            {/* Header: Circle Number 2 & Left-to-Right Typing Heading (0.21 -> 0.45) */}
            <div className="flex items-center gap-3.5 pb-2">
              <div
                style={getStageStyle(progress, 0.19, 0.29, 8)}
                className="w-10 h-10 rounded-full bg-purple-900 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-sm"
              >
                2
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
                  <TypewriterHeading
                    text="AI Risk Scoring Models"
                    progress={progress}
                    start={0.21}
                    end={0.45}
                    cursorClassName="bg-purple-600"
                  />
                </h3>
              </div>
            </div>

            {/* Item 1: Isolation Forest (0.47 -> 0.61) */}
            <div
              style={getStageStyle(progress, 0.47, 0.61, 16)}
              className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl space-y-1.5 border-l-4 border-l-purple-500"
            >
              <h4 className="text-xs font-bold text-slate-900">
                Isolation Forest
              </h4>
              <p className="text-[11px] text-slate-500 leading-snug">
                Finds odd patterns in work, funds and flagged projects.
              </p>
            </div>

            {/* Item 2: XGBoost Classifier (0.59 -> 0.73) */}
            <div
              style={getStageStyle(progress, 0.59, 0.73, 16)}
              className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl space-y-1.5 border-l-4 border-l-blue-500"
            >
              <h4 className="text-xs font-bold text-slate-900">
                XGBoost Classifier
              </h4>
              <p className="text-[11px] text-slate-500 leading-snug">
                Scores each project's risk level using multiple factors.
              </p>
            </div>

            {/* Item 3: Three Clear Risk Levels (0.71 -> 0.85) */}
            <div
              style={getStageStyle(progress, 0.71, 0.85, 16)}
              className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl space-y-2"
            >
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Three Clear Risk Levels
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Quickly shows how serious each case is.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-rose-50/80 border border-rose-200 text-rose-800">
                  <div className="text-[11px] font-bold">High</div>
                  <div className="text-[10px] font-mono text-rose-600 mt-0.5">70+</div>
                </div>
                <div className="p-2 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-800">
                  <div className="text-[11px] font-bold">Warning</div>
                  <div className="text-[10px] font-mono text-amber-600 mt-0.5">40–69</div>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50/80 border border-emerald-200 text-emerald-800">
                  <div className="text-[11px] font-bold">Safe</div>
                  <div className="text-[10px] font-mono text-emerald-600 mt-0.5">&lt; 40</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer: Inspect Model Performance (0.83 -> 0.96) */}
          {isAdmin && (
            <div style={getStageStyle(progress, 0.83, 0.96, 14)} className="pt-2">
              <Link
                to="/analytics"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-50/80 via-purple-50/40 to-indigo-50/80 hover:from-purple-100 hover:to-indigo-100 border border-purple-200/80 flex items-center justify-between text-left group transition-all"
              >
                <div>
                  <span className="text-xs font-bold text-purple-700 flex items-center gap-1 group-hover:text-purple-900">
                    Inspect Model Performance <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    See how accurate and reliable it is.
                  </span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white border border-purple-200 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* ================================================================ */}
        {/* COLUMN 3: Interactive Dashboards & Voice AI                      */}
        {/* ================================================================ */}
        {/* Stage 1: Container 3 Appears (0.06 -> 0.23) */}
        <div
          style={getStageStyle(progress, 0.06, 0.23, 24)}
          className="bg-white/95 rounded-2xl border-[3px] border-[#2E1065] shadow-sm p-6 flex flex-col justify-between space-y-5 hover:shadow-md transition-shadow"
        >
          <div className="space-y-4">
            {/* Header: Circle Number 3 & Left-to-Right Typing Heading (0.24 -> 0.48) */}
            <div className="flex items-center gap-3.5 pb-2">
              <div
                style={getStageStyle(progress, 0.22, 0.32, 8)}
                className="w-10 h-10 rounded-full bg-emerald-800 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-sm"
              >
                3
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
                  <TypewriterHeading
                    text="Interactive Dashboards & Voice AI"
                    progress={progress}
                    start={0.24}
                    end={0.48}
                    cursorClassName="bg-emerald-600"
                  />
                </h3>
              </div>
            </div>

            {/* Item 1: Live Geospatial Map (0.50 -> 0.64) */}
            <Link
              to="/risk-map"
              style={getStageStyle(progress, 0.50, 0.64, 16)}
              className="p-3 bg-slate-50/70 hover:bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3.5 transition-colors block"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50/80 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <Layers className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  Live Geospatial Map
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                  See projects, progress and alerts on the map.
                </p>
              </div>
            </Link>

            {/* Item 2: One-Click Dossier (0.62 -> 0.76) */}
            <div
              onClick={() => onOpenSlideOver && onOpenSlideOver()}
              style={getStageStyle(progress, 0.62, 0.76, 16)}
              className="p-3 bg-slate-50/70 hover:bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3.5 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50/80 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  One-Click Dossier
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                  Full project view with photos, progress and timeline.
                </p>
              </div>
            </div>

            {/* Item 3: Voice Assistant (0.74 -> 0.88) */}
            <div
              onClick={() => onOpenVoiceModal && onOpenVoiceModal()}
              style={getStageStyle(progress, 0.74, 0.88, 16)}
              className="p-3 bg-slate-50/70 hover:bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3.5 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-50/80 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                <Mic className="w-6 h-6 text-purple-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  Voice Assistant
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                  Ask in simple language. Get instant answers.
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer: Open Sample Audit Dossier (0.86 -> 0.99) */}
          {(isAdmin || isDistrictOfficer) && (
            <div style={getStageStyle(progress, 0.86, 0.99, 14)} className="pt-2">
              <button
                type="button"
                onClick={() => onOpenSlideOver && onOpenSlideOver()}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-50/80 via-emerald-50/40 to-teal-50/80 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200/80 flex items-center justify-between text-left group transition-all cursor-pointer"
              >
                <div>
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 group-hover:text-emerald-900">
                    Open Sample Audit Dossier <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    See a real example of how it works.
                  </span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                </div>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
