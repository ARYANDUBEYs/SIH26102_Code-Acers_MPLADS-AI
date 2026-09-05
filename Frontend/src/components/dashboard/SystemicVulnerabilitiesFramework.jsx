import React, { useState } from 'react';
import {
  Compass,
  Users,
  Eye,
  Mountain,
  FileCheck2,
  Lock,
  ChevronRight,
  ShieldCheck,
  Zap,
  Fingerprint,
  Radio,
  Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SystemicVulnerabilitiesFramework = () => {
  const [activeTab, setActiveTab] = useState(0);

  const pillars = [
    {
      id: 'spatial',
      name: '1. GPS Spoofing & Spatial Attestation',
      shortName: 'GPS Spoofing',
      icon: Compass,
      tag: 'Multi-Source Cell & PostGIS',
      color: 'blue',
      badge: 'border-blue-200 bg-blue-50 text-blue-800',
      vulnerability: 'Contractors tampering with EXIF camera coordinates or running software GPS emulators to upload photos taken miles away from the genuine construction site.',
      solution: 'Cross-verifies raw EXIF metadata against cellular base transceiver station (BTS) tower records, carrier ISP telemetry, and PostGIS boundary polygon containment.',
      mathProof: 'ST_Contains(Constituency_Polygon, ST_SetSRID(ST_MakePoint(Lon, Lat), 4326)) == TRUE && Delta_Dist(BTS, EXIF) <= 500m',
      countermeasures: [
        'Base Station ID (CID/LAC) triangulation independent of device GPS',
        'PostGIS ST_Contains polygon containment check',
        'Velocity plausibility check: Rejects sequential milestone uploads with delta speed > 200 km/h'
      ]
    },
    {
      id: 'human',
      name: '2. Human-in-the-Loop Multi-Sig Consensus',
      shortName: 'Officer Override',
      icon: Users,
      tag: 'Dual-Auditor e-Sign',
      color: 'rose',
      badge: 'border-rose-200 bg-rose-50 text-rose-800',
      vulnerability: 'Local administrative officials colluding with contractors to manually dismiss legitimate high-risk AI alerts as false positives or unavoidable exceptions.',
      solution: 'Dual-Auditor Multi-Signature Consensus Protocol: No critical AI alert can be overridden by a single officer. Requires simultaneous digital signatures from District Magistrate and Executive Engineer.',
      mathProof: 'VerifySignature(PK_DM, Hash) && VerifySignature(PK_EE, Hash) => WriteTo(ImmutableAuditLog)',
      countermeasures: [
        'Dual-Officer Aadhaar e-Sign / cryptographic digital signature required',
        'Immutable cryptographic SHA-256 hash chaining of all inspection overrides',
        'Automated State-level escalation if officer override rate exceeds 2σ from national baseline'
      ]
    },
    {
      id: 'synthetic',
      name: '3. AI-Generated Synthetic Photo Defense',
      shortName: 'Deepfakes & ELA',
      icon: Eye,
      tag: 'FFT & Error Level Analysis',
      color: 'amber',
      badge: 'border-amber-200 bg-amber-900 text-amber-800',
      vulnerability: 'Malicious actors using generative AI (Flux, Midjourney, Stable Diffusion) to render hyper-realistic photos of paved roads and clinics that do not exist.',
      solution: 'Fast Fourier Transform (FFT) high-frequency spectral artifact detection combined with JPEG Error Level Analysis (ELA) and Day-0 satellite terrain matching.',
      mathProof: 'ELA_Variance(Img) > Tau_AI || FFT_HighFreq_Energy(Img) < Threshold_Physics => FLAG_SYNTHETIC',
      countermeasures: [
        'FFT 2D spectral transformation detecting repeating convolutional generator lattices',
        'Quantization table compression inconsistency analysis (Error Level Analysis)',
        'Sentinel-2 multispectral terrain change comparison against baseline coordinates'
      ]
    },
    {
      id: 'terrain',
      name: '4. High-Altitude & Forest Cost Bias Mitigation',
      shortName: 'Hilly Cost Parity',
      icon: Mountain,
      tag: 'SOR Multiplier Matrix',
      color: 'emerald',
      badge: 'border-emerald-200 bg-emerald-50 text-emerald-800',
      vulnerability: 'AI flagging legitimate high costs in Ladakh, Northeast, or Western Ghats as anomalies due to severe topography and heavy transit logistics expenses.',
      solution: 'Dynamic Schedule of Rates (SOR) Elevation Multiplier Matrix calibrated with CPWD hill index coefficients, isolating genuine corruption from geographical hurdles.',
      mathProof: 'ExpectedCost = BaseSOR * (1 + 0.15 * log10(Elevation_m) + TransitDistanceFactor)',
      countermeasures: [
        'Automated elevation extraction via NASA SRTM Digital Elevation Models',
        'Constituency-specific CPWD Schedule of Rates (SOR) baseline calibration',
        'Heavy-rainfall & seasonal construction window variance offsets'
      ]
    },
    {
      id: 'legal',
      name: '5. Pre-Disbursal Prevention vs Post-Mortem Auditing',
      shortName: 'Pre-Disbursal Gates',
      icon: Lock,
      tag: 'PFMS Milestone Gates',
      color: 'purple',
      badge: 'border-purple-200 bg-purple-50 text-purple-800',
      vulnerability: 'Traditional government audits occur 2-3 years after completion, when allocated funds have already leaked and contractors have vanished.',
      solution: 'Real-time programmatic escrow disallowance: High-risk anomaly flags automatically place PFMS/RBI TSA escrow releases on provisional freeze pending clearance.',
      mathProof: 'RiskScore(Work_ID) >= 70 => DisbursalGateway.Lock(Work_ID, Reason=AI_SUSPENSION)',
      countermeasures: [
        'Direct API integration hook into PFMS / SBI Treasury Single Account (TSA)',
        'Pre-disbursal algorithmic verification before milestone tranche release',
        'Automatic statutory escalation dossiers submitted to MoSPI Central Vigilance'
      ]
    }
  ];

  const current = pillars[activeTab];
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">
      {/* Top Header */}
      <div className="p-6 bg-gradient-to-r from-[#0B2545] via-[#0F315E] to-[#133A6B] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-cyan-300 text-xs font-semibold mb-2 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>National Defense & Methodology Protocol</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Systemic Vulnerability Mitigations & Mathematical Proofs
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Addressing real-world deployment challenges: GPS spoofing, officer bribery, AI-generated synthetic evidence, and geographical cost variations.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl border border-white/10 shrink-0">
          <Scale className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-white">CPWD & PFMS Compliant</span>
        </div>
      </div>

      {/* Tab Selector Buttons */}
      <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50 p-2 gap-1.5 scrollbar-thin">
        {pillars.map((p, idx) => {
          const Icon = p.icon;
          const isActive = idx === activeTab;
          return (
            <button
              key={p.id}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-white text-[#0B2545] shadow-sm border border-slate-200 font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-700' : 'text-slate-500'}`} />
              <span>{p.shortName}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div className="p-6 lg:p-8 space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Title & Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center border border-blue-200 shrink-0">
                  <current.icon className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900">{current.name}</h4>
                  <span className="text-xs text-slate-500">Methodology Vector #{activeTab + 1}</span>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold border font-mono self-start sm:self-auto ${current.badge}`}>
                {current.tag}
              </span>
            </div>

            {/* Split: Vulnerability vs Algorithmic Solution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Problem */}
              <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/80 space-y-2">
                <div className="flex items-center gap-2 text-rose-800 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Real-World Vulnerability</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {current.vulnerability}
                </p>
              </div>

              {/* Solution */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Algorithmic Mitigation Solution</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {current.solution}
                </p>
              </div>
            </div>

            {/* Mathematical Proof Formulation Box */}
            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 space-y-2 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  Mathematical / Algorithmic Enforcement Rule
                </span>
                <span className="text-[10px] font-mono text-slate-400">Formal Logic Invariant</span>
              </div>
              <code className="text-xs sm:text-sm font-mono text-cyan-300 block bg-slate-950/80 p-3 rounded border border-slate-800 overflow-x-auto">
                {current.mathProof}
              </code>
            </div>

            {/* Specific Implementation Countermeasures */}
            <div className="space-y-2.5">
              <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Production Implementation Architecture
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {current.countermeasures.map((item, i) => (
                  <div key={i} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <span className="text-xs text-slate-700 font-medium leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
