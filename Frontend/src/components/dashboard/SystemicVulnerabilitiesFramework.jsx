import React, { useState, useEffect } from 'react';
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
  Info,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SystemicVulnerabilitiesFramework = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isSafeguardModalOpen, setIsSafeguardModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsSafeguardModalOpen(false);
    };
    if (isSafeguardModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isSafeguardModalOpen]);

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
    <div className="bg-white/95 border border-sky-200/80 rounded-2xl shadow-lg overflow-hidden backdrop-blur-md">
      {/* Top Header with Frutiger Aero Glossy Gradient */}
      <div className="relative py-8 px-6 sm:px-10 bg-gradient-to-r from-[#0c4a6e] via-[#0284c7] to-[#0ea5e9] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 overflow-hidden shadow-sm">
        {/* Specular aurora highlight sheen */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10">
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-sm">
            How the System Protects Public Money
          </h3>
        </div>
      </div>

      {/* Frutiger Aero Glossy Tab Selector Buttons */}
      <div className="flex overflow-x-auto border-b border-sky-100 bg-sky-50/50 p-2.5 gap-2 scrollbar-thin">
        {pillars.map((p, idx) => {
          const Icon = p.icon;
          const isActive = idx === activeTab;
          return (
            <button
              key={p.id}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-b from-white via-white to-sky-50 text-[#0c4a6e] shadow-md border border-sky-300 font-black scale-[1.02]'
                  : 'text-slate-600 hover:text-sky-900 hover:bg-white/80 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-600' : 'text-slate-500'}`} />
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
            {/* Title with Glossy Orb and Blue Circular Info Icon */}
            <div className="flex items-center justify-between gap-3 border-b border-sky-100/80 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full frutiger-bubble-icon text-sky-700 flex items-center justify-center shrink-0 shadow-sm">
                  <current.icon className="w-5 h-5 text-sky-700" />
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{current.name}</h4>
                </div>
              </div>

              {/* Info Icon Button (Blue circle with "i" in the middle) */}
              <button
                type="button"
                onClick={() => setIsSafeguardModalOpen(true)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center shadow-md hover:shadow-lg ring-2 ring-blue-400/30 hover:ring-4 hover:ring-blue-300/40 transition-all hover:scale-110 cursor-pointer shrink-0"
                title="View Key Safeguard Measures"
                aria-label="View Key Safeguard Measures"
              >
                <span className="font-serif font-black italic text-base leading-none select-none">i</span>
              </button>
            </div>

            {/* Split: Problem vs Solution in Harmonious Frutiger Aero Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Problem Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-white via-white/95 to-rose-50/40 border border-rose-200/70 shadow-sm space-y-2.5 hover:shadow-md transition-shadow">
                <div className="text-rose-700 text-xs font-bold uppercase tracking-wider">
                  The Problem It Solves
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {current.vulnerability}
                </p>
              </div>

              {/* Solution Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-white via-white/95 to-teal-50/40 border border-teal-200/70 shadow-sm space-y-2.5 hover:shadow-md transition-shadow">
                <div className="text-teal-700 text-xs font-bold uppercase tracking-wider">
                  How We Solve It
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {current.solution}
                </p>
              </div>
            </div>

            {/* Enforcement Rule Banner in Frutiger Aero Glass Security Style */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-950 via-blue-900 to-indigo-950 text-white border border-sky-400/30 space-y-2.5 shadow-md backdrop-blur-md">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                High-Assurance Operational Rule
              </div>
              <div className="text-xs sm:text-sm font-medium text-sky-100 bg-white/10 p-3.5 rounded-xl border border-white/15 leading-relaxed shadow-inner">
                {current.mathProof}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Safeguard Measures Pop-Up Modal */}
      <AnimatePresence>
        {isSafeguardModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSafeguardModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* White Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl border border-slate-200 z-10 space-y-6"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                      {current.shortName}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Institutional Defense System
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Key Safeguard Measures
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Three automated institutional protocols active for <strong className="text-slate-800">{current.name}</strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSafeguardModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  aria-label="Close Safeguards Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* The three measures pop up (appear by enlarging) one by one side by side */}
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.18,
                      delayChildren: 0.12,
                    }
                  }
                }}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5"
              >
                {current.countermeasures.map((item, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: { opacity: 0, scale: 0.5, y: 20 },
                      visible: {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        transition: {
                          type: 'spring',
                          stiffness: 350,
                          damping: 22,
                        }
                      }
                    }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="p-5 rounded-2xl bg-gradient-to-b from-white via-white to-sky-50/40 border-2 border-sky-100 hover:border-sky-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center font-black text-sm shadow-sm shadow-blue-500/30">
                        0{i + 1}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 font-mono bg-sky-100/70 px-2 py-0.5 rounded-md border border-sky-200">
                        Safeguard {i + 1}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed flex-1">
                      {item}
                    </p>

                    <div className="pt-3 border-t border-sky-100 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Automated MoSPI Verification</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Footer Confirmation Bar */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-medium">All 3 measures execute automatically in real-time on every progress upload.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSafeguardModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
