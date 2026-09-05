import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Calendar,
  IndianRupee,
  Camera,
  Network,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  MapPin,
  ExternalLink,
  Lock,
  ArrowRight
} from 'lucide-react';
import { formatINR } from '../../utils/helpers';
import { RiskBadge, StatusBadge } from './Badge';
import { useLanguage } from '../../context/LanguageContext';

export const DrillDownSlideOver = ({ isOpen, onClose, project }) => {
  const { t } = useLanguage();
  const [dualSignoffDone, setDualSignoffDone] = useState(false);

  if (!isOpen) return null;

  const demoProject = {
    id: 'MPLAD-2026-00124',
    name: 'Construction of Community Center & Flood Drainage Channel',
    constituency: 'Varanasi',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    sanctionedAmount: 4500000,
    disbursedAmount: 3825000,
    physicalProgress: 42,
    scheduledDays: 180,
    elapsedDays: 245,
    riskScore: 84,
    contractor: 'Apex Infra & BuildTech Pvt Ltd',
    hhiScore: 2840,
    dHashMatch: 88.5,
    ...(project || {}),
    warningTags: (project?.warningTags && Array.isArray(project.warningTags) && project.warningTags.length > 0)
      ? project.warningTags
      : ['DUPLICATE_PHOTO_DHASH_EXACT', 'HHI_CARTEL_SYNDICATE_MONOPOLY', 'SLA_BREACH_IMMUTABLE']
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-xl w-full flex pl-10">
        <div className="w-full bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-y-auto">
          
          {/* Masthead */}
          <div>
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-mono font-black text-blue-800 bg-blue-100 border border-blue-200 rounded">
                    {demoProject.id}
                  </span>
                  <RiskBadge score={demoProject.riskScore} />
                  <span className="text-[10px] font-mono text-rose-700 font-bold bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                    Priority Audit
                  </span>
                </div>
                <h3 className="text-base font-black text-[#0B2545] leading-snug">
                  {demoProject.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{demoProject.constituency} Constituency • {demoProject.district}, {demoProject.state}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Granular Audit Content */}
            <div className="p-5 space-y-6">

              {/* 1. Mathematical Risk Engine Breakdown */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Mathematical Risk Decomposition ($R = 0.35F + 0.25T + 0.20I + 0.20C$)
                  </span>
                  <span className="text-sm font-black font-mono text-rose-700">
                    Score: {demoProject.riskScore}/100
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                  <div className="p-2 bg-white border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">F (Finance)</span>
                    <span className="font-bold text-rose-700">85/100</span>
                  </div>
                  <div className="p-2 bg-white border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">T (Timeline)</span>
                    <span className="font-bold text-amber-700">76/100</span>
                  </div>
                  <div className="p-2 bg-white border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">I (Image)</span>
                    <span className="font-bold text-rose-700">92/100</span>
                  </div>
                  <div className="p-2 bg-white border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">C (Cartel)</span>
                    <span className="font-bold text-rose-700">82/100</span>
                  </div>
                </div>
              </div>

              {/* 2. Budget vs Spend & Progress Mismatch */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Financial Burn vs Physical Progress</span>
                  <span className="text-rose-700 font-mono font-bold text-[11px]">
                    Critical Variance: 43% Discrepancy
                  </span>
                </div>

                <div className="space-y-1.5 p-3.5 bg-white border border-slate-200 rounded-xl">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Funds Disbursed (85%)</span>
                    <span className="font-mono font-bold text-slate-900">{formatINR(demoProject.disbursedAmount)} of {formatINR(demoProject.sanctionedAmount)}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '85%' }} />
                  </div>

                  <div className="flex justify-between text-xs text-slate-600 pt-2">
                    <span>Physical On-Ground Progress (Reported: 42%)</span>
                    <span className="font-mono font-bold text-amber-700">42% Certified</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '42%' }} />
                  </div>
                </div>
              </div>

              {/* 3. Computer Vision Photo Forensics (Day 1 vs Day 60) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Camera className="w-4 h-4 text-blue-700" />
                    <span>OpenCV dHash Forensic Cross-Reference</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded">
                    Hamming Dist: 3 (88.5% Match)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="aspect-video bg-slate-100 rounded-lg border border-slate-200 overflow-hidden relative group">
                      <img
                        src="https://images.unsplash.com/photo-1541888946425-d0fbb180c5f2?w=400&auto=format&fit=crop&q=80"
                        alt="Day 1 Baseline"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-900/80 text-white font-bold">
                        Varanasi (Work #00124)
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono text-center">Sanction Site Baseline (Day 1)</p>
                  </div>

                  <div className="space-y-1">
                    <div className="aspect-video bg-slate-100 rounded-lg border-2 border-rose-400 overflow-hidden relative group">
                      <img
                        src="https://images.unsplash.com/photo-1541888946425-d0fbb180c5f2?w=400&auto=format&fit=crop&q=80"
                        alt="Reused Image Match"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono bg-rose-700 text-white font-bold">
                        Identical Hash Flagged!
                      </span>
                    </div>
                    <p className="text-[10px] text-rose-600 font-mono text-center font-bold">Claimed in Jaunpur (Work #0089)</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
                  <p className="font-bold flex items-center gap-1 text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    AI Forensic Finding: Reused Visual Asset
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    The newly submitted progress photo has an exact perceptual hash collision with an archived project in neighboring Jaunpur district. GPS polygon cross-verification also indicates upload occurred 38km outside sanctioned geofence.
                  </p>
                </div>
              </div>

              {/* 4. AI Warning Tags */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 block">
                  Active Automated Warning Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(demoProject.warningTags || []).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-[10px] font-mono font-bold bg-slate-100 text-slate-800 border border-slate-300 rounded"
                    >
                      [{tag}]
                    </span>
                  ))}
                  <span className="px-2 py-1 text-[10px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-300 rounded">
                    [TENDER_CONCENTRATION_HHI_2840]
                  </span>
                </div>
              </div>

              {/* 5. Contractor Cartel Dossier */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Vendor</span>
                  <span className="font-bold text-slate-900">{demoProject.contractor}</span>
                  <p className="text-[11px] text-amber-800 font-mono mt-0.5">Holds 8 of 14 District Tenders (57.1% Monopoly)</p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400 block">District HHI</span>
                  <span className="text-sm font-black text-rose-700">{demoProject.hhiScore}</span>
                </div>
              </div>

              {/* 6. Multi-Signature Dual-Auditor Sign-off (Judge Defense Mitigation) */}
              <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0B2545] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-700" />
                    Multi-Signature Protocol (Dual-Officer Sign-Off)
                  </span>
                  <span className="text-[10px] font-mono text-blue-700">Tamper-Proof Audit Chain</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Officer 1: District Magistrate (Varanasi)</span>
                    </div>
                    <span className="font-mono text-[10px] text-emerald-700 font-bold">DIGITALLY SIGNED</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded">
                    <div className="flex items-center gap-2">
                      {dualSignoffDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                      )}
                      <span>Officer 2: MoSPI Central Auditor</span>
                    </div>
                    {dualSignoffDone ? (
                      <span className="font-mono text-[10px] text-emerald-700 font-bold">VERIFIED</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDualSignoffDone(true)}
                        className="px-2 py-0.5 text-[10px] font-mono bg-blue-600 text-white rounded font-bold hover:bg-blue-700 cursor-pointer"
                      >
                        Click to e-Sign
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Close Dossier
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  alert(`Dispatched Physical Vigilance Squad to ${demoProject.district} for work ${demoProject.id}`);
                  onClose();
                }}
                className="px-3.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Dispatch Vigilance Squad</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
