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
      name: '1. Verified Site Location (Anti-Spoofing)',
      shortName: 'Location Checks',
      icon: Compass,
      tag: 'Cell Tower & Map Matching',
      color: 'blue',
      badge: 'border-blue-200 bg-blue-50 text-blue-800',
      vulnerability: 'Uploading photos taken from an armchair miles away instead of the genuine construction site.',
      solution: 'Cross-verifies camera location against nearby mobile network towers and official constituency boundary maps to guarantee the photo was taken at the actual project site.',
      mathProof: 'Operational Rule: Photo location must be within 500 meters of the sanctioned site and confirmed by local mobile network towers.',
      countermeasures: [
        'Verifies mobile cell tower signals independent of phone GPS',
        'Checks project boundaries on official government district maps',
        'Rejects impossible travel times between consecutive progress uploads'
      ]
    },
    {
      id: 'human',
      name: '2. Two-Officer Digital Sign-Off (Anti-Collusion)',
      shortName: 'Dual Sign-Off',
      icon: Users,
      tag: 'Dual-Officer Approval',
      color: 'rose',
      badge: 'border-rose-200 bg-rose-50 text-rose-800',
      vulnerability: 'A single officer quietly overriding or dismissing legitimate fraud warnings raised by the system.',
      solution: 'Requires two independent senior officials (District Magistrate and Executive Engineer) to digitally sign with their official credentials before any critical alert can be cleared.',
      mathProof: 'Operational Rule: No single person can dismiss a red flag; requires dual digital signatures and permanent audit logging.',
      countermeasures: [
        'Two separate senior officer digital signatures required',
        'Permanent, unalterable digital audit paper trail of all decisions',
        'Automatic alert to state vigilance if override rates exceed normal levels'
      ]
    },
    {
      id: 'synthetic',
      name: '3. Fake Image Detection (Anti-Deepfake)',
      shortName: 'AI Photo Defense',
      icon: Eye,
      tag: 'Image Forensics & Satellite',
      color: 'amber',
      badge: 'border-amber-200 bg-amber-50 text-amber-800',
      vulnerability: 'Using AI image tools or photo editing software to create fake pictures of finished roads or clinics.',
      solution: 'Scans image compression patterns, lighting consistency, and camera sensor fingerprints to detect artificially generated or edited photographs.',
      mathProof: 'Operational Rule: Scans image pixel integrity and verifies physical ground changes against satellite telemetry.',
      countermeasures: [
        'Scans for artificial pixel patterns left by AI image tools',
        'Validates authentic camera sensor and compression data',
        'Cross-checks site progress against recent satellite imaging'
      ]
    },
    {
      id: 'terrain',
      name: '4. Fair Pricing for Remote & Hilly Regions',
      shortName: 'Fair Terrain Pricing',
      icon: Mountain,
      tag: 'CPWD Terrain Index',
      color: 'emerald',
      badge: 'border-emerald-200 bg-emerald-50 text-emerald-800',
      vulnerability: 'Wrongly flagging high construction costs in remote Himalayan or forest districts where material transport is legitimately expensive.',
      solution: 'Automatically applies official CPWD hill and terrain cost indices based on elevation and transport distance, ensuring fair budgeting for remote communities.',
      mathProof: 'Operational Rule: Budget limits automatically include official elevation and terrain transport multipliers.',
      countermeasures: [
        'Altitude data automatically factored into cost baselines',
        'Official CPWD Schedule of Rates terrain adjustments applied',
        'Monsoon and seasonal working windows taken into account'
      ]
    },
    {
      id: 'legal',
      name: '5. Stop Fraud Before Money Leaves the Bank',
      shortName: 'Payment Safeguards',
      icon: Lock,
      tag: 'PFMS Treasury Gate',
      color: 'purple',
      badge: 'border-purple-200 bg-purple-50 text-purple-800',
      vulnerability: 'Traditional audits taking place 2 to 3 years after project completion, when funds are already lost and contractors have vanished.',
      solution: 'Connects directly with the central government payment gateway (PFMS) to pause next-stage milestone payouts the moment high-risk discrepancies are detected.',
      mathProof: 'Operational Rule: Critical fraud flags automatically place milestone payouts on hold until physical verification is completed.',
      countermeasures: [
        'Integrated directly with central PFMS treasury payment rails',
        'Milestone payments verified before public money is released',
        'Instant escalation report generated for central vigilance officers'
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
            <span>Public Fund Integrity Safeguards</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            How the System Protects Public Money
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Clear, transparent rules to prevent fake photos, stop officer collusion, and ensure honest public spending.
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
                  <span className="text-xs text-slate-500">Methodology Pillar #{activeTab + 1}</span>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold border font-mono self-start sm:self-auto ${current.badge}`}>
                {current.tag}
              </span>
            </div>

            {/* Split: Vulnerability vs Solution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Problem */}
              <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/80 space-y-2">
                <div className="flex items-center gap-2 text-rose-800 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>The Problem It Solves</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {current.vulnerability}
                </p>
              </div>

              {/* Solution */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>How We Solve It</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {current.solution}
                </p>
              </div>
            </div>

            {/* Enforcement Rule Box */}
            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 space-y-2 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  Operational Rule
                </span>
                <span className="text-[10px] font-mono text-emerald-400">Strictly Enforced</span>
              </div>
              <div className="text-xs sm:text-sm font-medium text-cyan-200 bg-slate-950/80 p-3 rounded border border-slate-800">
                {current.mathProof}
              </div>
            </div>

            {/* Specific Implementation Countermeasures */}
            <div className="space-y-2.5">
              <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Key Safeguard Measures
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
