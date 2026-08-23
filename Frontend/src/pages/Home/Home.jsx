import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Cpu,
  AlertTriangle,
  FileCheck2,
  Users,
  Search,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Building,
  CheckCircle2,
  Layers,
  ChevronRight,
  Database,
  Eye,
  AlertOctagon
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { NATIONAL_KPIS } from '../../services/mockData';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';

export const Home = () => {
  const { switchRole } = useAuth();
  const navigate = useNavigate();

  const handleLaunchAdminDemo = () => {
    switchRole(ROLES.MOSPI_ADMIN);
    navigate('/dashboard');
  };

  const handleLaunchCitizenPortal = () => {
    switchRole(ROLES.CITIZEN);
    navigate('/public');
  };

  return (
    <div className="min-h-screen bg-gov-darkest text-slate-100 selection:bg-blue-600">
      {/* Top Tiranga Micro Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 p-0.5 shadow-glow-blue flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white">
                MPLADS <span className="text-blue-500">AI MONITOR</span>
              </span>
              <p className="text-[10px] text-slate-400 font-mono">Government of India • MoSPI</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
            <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-blue-400 transition-colors">How AI Works</a>
            <a href="#stats" className="hover:text-blue-400 transition-colors">National Stats</a>
            <Link to="/public" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
              <span>Public Transparency</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLaunchCitizenPortal}
              className="hidden sm:inline-flex"
            >
              Public Portal
            </Button>
            <Link to="/login">
              <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
                Officer Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 sm:w-[600px] h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-blue-500/30 text-blue-400 text-xs font-semibold shadow-inner">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>AI-Powered MPLADS Monitoring & Anomaly Detection</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Detect Fraud. Identify Anomalies.{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300 bg-clip-text text-transparent">
              Prevent Fund Wastage.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            An intelligent command-center platform for monitoring MPLADS projects, identifying suspicious cost baselines, verifying photo evidence via Computer Vision, exposing vendor cartels, and improving public transparency.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button
              variant="glow"
              size="lg"
              onClick={handleLaunchAdminDemo}
              icon={ArrowRight}
              iconPosition="right"
              className="text-sm font-semibold px-6"
            >
              Launch MoSPI Admin Command Center
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleLaunchCitizenPortal}
              icon={Eye}
              className="text-sm font-semibold px-6"
            >
              Explore Public Project Portal
            </Button>
          </div>

          {/* Quick Demo scenario callout banner */}
          <div className="mt-8 p-4 bg-slate-900/80 border border-slate-700/80 rounded-2xl max-w-2xl mx-auto text-left flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-slate-100">Live Demo Scenario: </span>
                <span className="text-slate-300">Project MPLAD-2026-00124 (87% Risk, 96% Duplicate Image)</span>
              </div>
            </div>
            <Link
              to="/project/MPLAD-2026-00124"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 shrink-0"
            >
              Investigate Case →
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Core Feature Pillars */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 font-mono">
            Core AI Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Multi-Layered Algorithmic Oversight
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Anomaly Detection */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 hover:border-slate-700 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Anomaly Detection</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Identify unusual project costs, District Schedule of Rates (DSR) deviations, abnormal timeline inflations, and inconsistent milestone spending patterns.
            </p>
          </div>

          {/* Card 2: Fraud Detection */}
          <div className="p-6 bg-slate-900 border border-rose-900/30 rounded-2xl space-y-4 hover:border-rose-700/50 transition-all group shadow-glow-red/10">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Fraud & Cartel Detection</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Detect cross-district duplicate images via Computer Vision, circular contractor bidding rings, and ghost assets outside sanctioned GPS geo-fences.
            </p>
          </div>

          {/* Card 3: Inefficiency Detection */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 hover:border-slate-700 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Inefficiency & SLA Tracking</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Identify delayed projects, impending SLA breaches, idle unspent funds in escrow accounts, and bottlenecked district administrative approvals.
            </p>
          </div>
        </div>
      </section>

      {/* How AI Works 5-Step Process */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-950/60 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Explainable Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              How AI Assists Government Decisions
            </h2>
            <p className="text-xs text-slate-400">
              Human-in-the-loop governance: AI provides risk scores and forensic evidence, while authorized officers retain final authority.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
            {/* Step 1 */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 relative text-center">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 font-bold font-mono text-xs flex items-center justify-center mx-auto">
                1
              </div>
              <h4 className="text-xs font-bold text-slate-200">Government Data</h4>
              <p className="text-[11px] text-slate-400">Sanctions, PFMS payouts, DSR rates, field MB records, and photos.</p>
            </div>

            {/* Step 2 */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 relative text-center">
              <div className="w-8 h-8 rounded-full bg-cyan-600/20 text-cyan-400 font-bold font-mono text-xs flex items-center justify-center mx-auto">
                2
              </div>
              <h4 className="text-xs font-bold text-slate-200">AI Analysis</h4>
              <p className="text-[11px] text-slate-400">Deep neural vision, cartel graph networks, and cost baseline regression.</p>
            </div>

            {/* Step 3 */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 relative text-center">
              <div className="w-8 h-8 rounded-full bg-amber-600/20 text-amber-400 font-bold font-mono text-xs flex items-center justify-center mx-auto">
                3
              </div>
              <h4 className="text-xs font-bold text-slate-200">Risk Score</h4>
              <p className="text-[11px] text-slate-400">Normalized 0-100 risk score with explainable evidence breakdown.</p>
            </div>

            {/* Step 4 */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 relative text-center">
              <div className="w-8 h-8 rounded-full bg-purple-600/20 text-purple-400 font-bold font-mono text-xs flex items-center justify-center mx-auto">
                4
              </div>
              <h4 className="text-xs font-bold text-slate-200">Human Review</h4>
              <p className="text-[11px] text-slate-400">District Magistrate & Central MoSPI officers examine flags.</p>
            </div>

            {/* Step 5 */}
            <div className="p-4 bg-slate-900 border border-emerald-800/60 rounded-xl space-y-2 relative text-center shadow-glow-green/10">
              <div className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-400 font-bold font-mono text-xs flex items-center justify-center mx-auto">
                5
              </div>
              <h4 className="text-xs font-bold text-emerald-400">Official Action</h4>
              <p className="text-[11px] text-slate-400">Approve funds, order physical audit, freeze escrow, or sanction project.</p>
            </div>
          </div>
        </div>
      </section>

      {/* National Statistics Section */}
      <section id="stats" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-3xl sm:text-4xl font-black font-mono text-blue-400">
              {NATIONAL_KPIS.projectsMonitored.toLocaleString()}
            </span>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Projects Monitored</p>
            <p className="text-[11px] text-slate-500">Across 28 States & 8 UTs</p>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-3xl sm:text-4xl font-black font-mono text-cyan-400">
              ₹{NATIONAL_KPIS.totalFundsCr} Cr
            </span>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Public Funds Tracked</p>
            <p className="text-[11px] text-slate-500">Sanctioned & Released</p>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-3xl sm:text-4xl font-black font-mono text-amber-400">
              {NATIONAL_KPIS.anomaliesDetected}
            </span>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Anomalies Detected</p>
            <p className="text-[11px] text-slate-500">Early Detection Rate 94%</p>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-3xl sm:text-4xl font-black font-mono text-rose-400">
              {NATIONAL_KPIS.highRiskProjects}
            </span>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">High Risk Projects</p>
            <p className="text-[11px] text-slate-500">Under Active Investigation</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-slate-950 border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-400 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span>MPLADS AI MONITOR — Ministry of Statistics and Programme Implementation</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-mono">
            <span>© 2026 Government of India</span>
            <span>•</span>
            <Link to="/public" className="text-blue-400 hover:underline">Public Portal</Link>
            <span>•</span>
            <Link to="/login" className="text-blue-400 hover:underline">Officer Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
