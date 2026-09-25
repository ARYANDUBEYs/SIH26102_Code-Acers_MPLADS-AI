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
import {
  useSmoothScrollProgress,
  getStageStyle,
  TypewriterHeading
} from '../../hooks/useScrollReveal';

export const SystemicVulnerabilitiesFramework = ({ canAppear = true, onAppeared }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isSafeguardModalOpen, setIsSafeguardModalOpen] = useState(false);
  const [containerRef, progress] = useSmoothScrollProgress(240, 0, {
    maxStep: 0.018,
    enabled: canAppear
  });

  useEffect(() => {
    if (onAppeared) {
      onAppeared(progress >= 0.55);
    }
  }, [progress, onAppeared]);

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
    <div className="relative">
      {/* Stage 1: Container Appears First (0.00 -> 0.20) */}
      <div
        ref={containerRef}
        style={getStageStyle(progress, 0.0, 0.20, 24)}
        className="bg-white/95 border-[3px] border-[#2E1065] rounded-2xl shadow-xl overflow-hidden backdrop-blur-md"
      >
        {/* Top Header with Institutional Deep Gradient */}
        <div className="relative py-10 px-6 sm:px-12 bg-gradient-to-r from-[#1E0A45] via-[#2E1065] to-[#3B1259] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 overflow-hidden shadow-sm">
          {/* Specular aurora highlight sheen */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10">
            {/* Stage 2: Heading Appears by Left-to-Right Typing Transition (0.18 -> 0.44) */}
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-sm">
              <TypewriterHeading
                text="How it Works?"
                progress={progress}
                start={0.18}
                end={0.44}
                cursorClassName="bg-amber-400"
              />
            </h3>
          </div>
        </div>

        {/* Stage 3a: Tab Selector Buttons Appear One by One (0.42 -> 0.62) */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50/70 p-3.5 sm:p-4 gap-2.5 sm:gap-3.5 scrollbar-thin">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            const isActive = idx === activeTab;
            const tabStart = 0.42 + idx * 0.028;
            const tabEnd = tabStart + 0.09;
            return (
              <button
                key={p.id}
                onClick={() => setActiveTab(idx)}
                style={getStageStyle(progress, tabStart, tabEnd, 12)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-b from-white via-white to-purple-50 text-[#2E1065] shadow-md border border-purple-200 font-black scale-[1.02]'
                    : 'text-slate-600 hover:text-purple-900 hover:bg-white/80 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-700' : 'text-slate-500'}`} />
                <span>{p.shortName}</span>
              </button>
            );
          })}
        </div>

        {/* Stage 3b: Active Tab Content Elements Appear One by One (0.58 -> 0.99) */}
        <div className="p-8 lg:p-12 space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Element 1: Title with Glossy Orb and Purple Circular Info Icon (0.58 -> 0.70) */}
              <div
                style={getStageStyle(progress, 0.58, 0.70, 16)}
                className="flex items-center justify-between gap-4 border-b border-slate-100 pb-5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full frutiger-bubble-icon text-purple-800 flex items-center justify-center shrink-0 shadow-sm">
                    <current.icon className="w-6 h-6 text-purple-800" />
                  </div>
                  <div>
                    <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{current.name}</h4>
                  </div>
                </div>

                {/* Info Icon Button (Purple circle with "i" in the middle) */}
                <button
                  type="button"
                  onClick={() => setIsSafeguardModalOpen(true)}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#2E1065] hover:bg-[#1E0A45] active:scale-95 text-white flex items-center justify-center shadow-md hover:shadow-lg ring-2 ring-purple-400/30 hover:ring-4 hover:ring-purple-300/40 transition-all hover:scale-110 cursor-pointer shrink-0"
                  title="View Key Safeguard Measures"
                  aria-label="View Key Safeguard Measures"
                >
                  <span className="font-serif font-black italic text-base leading-none select-none">i</span>
                </button>
              </div>

              {/* Split: Problem vs Solution Cards Appearing One by One */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
                {/* Element 2: Problem Card (0.68 -> 0.80) */}
                <div
                  style={getStageStyle(progress, 0.68, 0.80, 18)}
                  className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-white via-white/95 to-rose-50/40 border border-rose-200/70 shadow-sm space-y-3 hover:shadow-md transition-shadow"
                >
                  <div className="text-rose-700 text-xs font-bold uppercase tracking-wider">
                    The Problem It Solves
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {current.vulnerability}
                  </p>
                </div>

                {/* Element 3: Solution Card (0.78 -> 0.90) */}
                <div
                  style={getStageStyle(progress, 0.78, 0.90, 18)}
                  className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-white via-white/95 to-emerald-50/30 border border-emerald-200/60 shadow-sm space-y-3 hover:shadow-md transition-shadow"
                >
                  <div className="text-emerald-800 text-xs font-bold uppercase tracking-wider">
                    How We Solve It
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {current.solution}
                  </p>
                </div>
              </div>

              {/* Element 4: Enforcement Rule Banner (0.87 -> 0.99) */}
              <div
                style={getStageStyle(progress, 0.87, 0.99, 18)}
                className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#1E0A45] via-[#2E1065] to-[#1E0A45] text-white border border-purple-400/20 space-y-3 shadow-md backdrop-blur-md"
              >
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  High-Assurance Operational Rule
                </div>
                <div className="text-xs sm:text-sm font-medium text-purple-100 bg-white/10 p-4 rounded-xl border border-white/15 leading-relaxed shadow-inner">
                  {current.mathProof}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
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

            {/* White Modal Container - Compact with only heading, close cross, and 3 boxes in purple theme */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-none p-5 sm:p-7 max-w-3xl w-full shadow-2xl border border-purple-200/80 z-10 space-y-5"
            >
              {/* Modal Header: ONLY heading 'Key Safeguard Measures' and close cross */}
              <div className="flex items-center justify-between gap-4 border-b border-purple-100 pb-3.5">
                <h3 className="text-xl sm:text-2xl font-black text-[#2E1065] tracking-tight">
                  Key Safeguard Measures
                </h3>

                <button
                  type="button"
                  onClick={() => setIsSafeguardModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 hover:text-purple-950 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  aria-label="Close Safeguards Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* The three measures pop up (appear by enlarging) one by one side by side in purple theme */}
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.16,
                      delayChildren: 0.1,
                    }
                  }
                }}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
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
                    className="p-4 sm:p-5 rounded-xl bg-gradient-to-b from-white via-white to-purple-50/40 border border-purple-200 hover:border-purple-400 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#581c87] to-[#2E1065] text-white flex items-center justify-center font-black text-xs shadow-sm shadow-purple-950/20">
                        0{i + 1}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 font-mono bg-purple-100/80 px-2 py-0.5 rounded border border-purple-200">
                        Safeguard {i + 1}
                      </span>
                    </div>

                    <p className="text-xs sm:text-[13px] font-semibold text-slate-800 leading-relaxed flex-1">
                      {item}
                    </p>

                    <div className="pt-3 border-t border-purple-100 flex items-center gap-1.5 text-[11px] font-bold text-purple-900">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                      <span>Automated MoSPI Verification</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
