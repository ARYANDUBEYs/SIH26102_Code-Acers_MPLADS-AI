import React, { useState } from 'react';
import {
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Lock,
  Users,
  Eye,
  Mountain,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Compass
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../utils/helpers';

export const JudgeDefensePanel = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);
  const [activeDef, setActiveDef] = useState(0);

  const defenses = [
    {
      id: 'geotag',
      title: t('judge_d1_title', '1. Editable Geotags (GPS Spoofing)'),
      icon: Compass,
      tag: 'Spatial Attestation',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
      vulnerability: 'Contractors easily alter EXIF GPS metadata or use fake location apps to claim progress from another site.',
      solution: t('judge_d1_desc', 'Multi-Source Spatial Attestation cross-verifies EXIF GPS coordinates against cellular tower IDs, ISP telemetry, and PostGIS polygon boundaries, rejecting spoofed uploads.'),
      techSpecs: [
        'Cellular Base Station ID triangulation fallback',
        'PostGIS ST_Contains polygon geofence verification',
        'Temporal-spatial velocity check (Flags impossible 400km/h coordinate jumps)'
      ]
    },
    {
      id: 'bribery',
      title: t('judge_d2_title', '2. Human-in-the-Loop Bribery'),
      icon: Users,
      tag: 'Multi-Sig Consensus',
      badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
      vulnerability: 'A corrupt local officer could be bribed to dismiss high-risk AI alerts as "legitimate exceptions".',
      solution: t('judge_d2_desc', 'Multi-Signature Dual-Auditor Protocol mandates two independent officer digital signatures (e-Sign) to override alerts, writing to an immutable audit trail.'),
      techSpecs: [
        'Requires Dual-Officer (DM + Executive Engineer) digital signature',
        'Immutable cryptographic audit log with SHA-256 hash chains',
        'Automated State-level escalation if officer override rate exceeds 2σ from national baseline'
      ]
    },
    {
      id: 'deepfake',
      title: t('judge_d3_title', '3. AI-Generated Construction Photos'),
      icon: Eye,
      tag: 'FFT & ELA Forensics',
      badgeColor: 'bg-amber-50 text-amber-900 border-amber-200',
      vulnerability: 'Contractors using Midjourney, Flux, or DALL-E to generate synthetic photos of completed roads and schools.',
      solution: t('judge_d3_desc', 'Forensic Frequency Domain Analysis inspects FFT spectral artifacts and Error Level Analysis (ELA) against baseline Day-0 terrain satellite captures.'),
      techSpecs: [
        '2D Fast Fourier Transform (FFT) detects diffusion model frequency grid patterns',
        'Error Level Analysis (ELA) isolates non-uniform JPEG recompression compression artifacts',
        'Structural SSIM cross-checks against Day-0 Sentinel-2 satellite ground topology'
      ]
    },
    {
      id: 'terrain',
      title: t('judge_d4_title', '4. Terrain & Monsoon Regional Bias'),
      icon: Mountain,
      tag: 'Equity Normalization',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      vulnerability: 'Pure statistical outlier detection unfairly flags remote hill/Himalayan districts as "fraud" due to legitimate terrain & weather delays.',
      solution: t('judge_d4_desc', 'Context-Aware Baseline Normalization adjusts delay thresholds via Terrain Difficulty & Monsoon Disruption factors so hill/remote districts are not penalized.'),
      techSpecs: [
        'Dynamic formula: R_adjusted = R / (1 + 0.25*TerrainIndex + 0.20*MonsoonIndex)',
        'Classifies terrain via SRTM Digital Elevation Model slope angles',
        'Real-time IMD rainfall anomaly feed suppresses false alerts during severe monsoon'
      ]
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-gov-card overflow-hidden">
      {/* Header Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-5 py-4 bg-slate-50 hover:bg-slate-100/80 border-b border-slate-200 flex items-center justify-between cursor-pointer transition-colors select-none"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-900 text-blue-200">
            <ShieldAlert className="w-4 h-4 text-blue-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-[#0B2545] tracking-tight">
                {t('judge_title', 'Systemic Vulnerability & Judge Defense Mitigations')}
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded">
                SIH Evaluator Defense
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('judge_sub', 'Engineered solutions to real-world edge cases, location-spoofing, and human biases')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">
            {isOpen ? 'Collapse Defense Matrix' : 'Expand 4 Defense Pillars'}
          </span>
          <div className="p-1 rounded bg-white border border-slate-200 text-slate-600">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isOpen && (
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
            {defenses.map((def, idx) => {
              const Icon = def.icon;
              const isSelected = activeDef === idx;

              return (
                <div
                  key={def.id}
                  onClick={() => setActiveDef(idx)}
                  className={cn(
                    'p-4 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between space-y-3 bg-white',
                    isSelected
                      ? 'border-blue-600 ring-2 ring-blue-100 shadow-gov-card'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  )}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={cn('p-2 rounded-lg border', isSelected ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-700 border-slate-200')}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={cn('px-2 py-0.5 text-[10px] font-mono rounded font-bold border', def.badgeColor)}>
                        {def.tag}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                      {def.title}
                    </h4>

                    <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                      {def.solution}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Pillar {idx + 1} of 4</span>
                    <span className={cn('font-bold', isSelected ? 'text-blue-700' : 'text-slate-500')}>
                      {isSelected ? 'Active Spec' : 'Inspect'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Detailed Defense Dossier */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Detailed Mitigation Architecture: {defenses[activeDef].title}
                </h4>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Protocol Reference: <strong>SEC-DEF-0{activeDef + 1}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-white border border-rose-100 rounded-lg space-y-1.5">
                <div className="flex items-center gap-1.5 text-rose-700 font-bold text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>The Real-World Threat / Vulnerability</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {defenses[activeDef].vulnerability}
                </p>
              </div>

              <div className="p-3 bg-white border border-emerald-100 rounded-lg space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>MPLAD Sentinel Algorithmic Solution</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {defenses[activeDef].solution}
                </p>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Technical Safeguard Specifications:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {defenses[activeDef].techSpecs.map((spec, i) => (
                  <div key={i} className="p-2 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-700 flex items-start gap-1.5">
                    <span className="text-blue-700 font-bold">✓</span>
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
