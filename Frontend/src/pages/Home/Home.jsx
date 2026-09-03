import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
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
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';

export const Home = () => {
  const [kpis, setKpis] = useState({ projectsMonitored: 0, totalFundsCr: 0, anomaliesDetected: 0, highRiskProjects: 0 });
  const [topFlagged, setTopFlagged] = useState(null);

  useEffect(() => {
    (async () => {
      const [kpiRes, hrRes] = await Promise.all([api.getNationalKPIs(), api.getHighRiskProjects()]);
      if (kpiRes.success) setKpis(kpiRes.data);
      if (hrRes.success && hrRes.data.length > 0) setTopFlagged(hrRes.data[0]);
    })();
  }, []);
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
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-600 selection:text-white">
      {/* Top National Tiranga Micro Ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* Official Government Navigation Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B2545] p-0.5 shadow-sm flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-[#0B2545]">
                  MPLADS <span className="text-blue-700">INTELLIGENCE</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono uppercase bg-blue-50 text-blue-800 border border-blue-200 rounded font-semibold">
                  MoSPI Continuous Audit
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">
                Ministry of Statistics & Programme Implementation • Govt. of India
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-700 transition-colors">Core Capabilities</a>
            <a href="#how-it-works" className="hover:text-blue-700 transition-colors">Audit Workflow</a>
            <a href="#stats" className="hover:text-blue-700 transition-colors">National Stats</a>
            <Link to="/public" className="hover:text-blue-700 transition-colors flex items-center gap-1.5 text-blue-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Public Transparency</span>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLaunchCitizenPortal}
              className="hidden sm:inline-flex border-slate-200 hover:bg-slate-50 text-slate-700"
            >
              Public Portal
            </Button>
            <Link to="/login">
              <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right" className="bg-blue-700 hover:bg-blue-800 text-white">
                Officer Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Executive Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white border-b border-slate-200 shadow-gov-sm">
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>AI Forensic Audit & Anomaly Detection Layer for e-SAKSHI</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0B2545] leading-tight">
            Continuous Forensic Vigilance.{' '}
            <span className="text-blue-700">
              Zero Public Fund Leakage.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
            An institutional command center for MPs, District Magistrates, and Central MoSPI auditors: verifying photographic progress with OpenCV 64-bit dHash, detecting contractor bidding cartels with NetworkX, and benchmarking DSR rates.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleLaunchAdminDemo}
              icon={ArrowRight}
              iconPosition="right"
              className="text-sm font-semibold px-6 bg-[#0B2545] hover:bg-[#081D37] text-white shadow-gov-card"
            >
              Launch MoSPI Central Command
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleLaunchCitizenPortal}
              icon={Eye}
              className="text-sm font-semibold px-6 border-slate-300 bg-white text-slate-800 hover:bg-slate-50 shadow-sm"
            >
              Explore Public Project Portal
            </Button>
          </div>

          {/* Live top-flagged-project callout banner */}
          {topFlagged && (
            <div className="mt-8 p-4 bg-rose-50/90 border border-rose-200 rounded-2xl max-w-2xl mx-auto text-left flex items-center justify-between gap-4 shadow-gov-sm">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-rose-900">Active Forensic Flag: </span>
                  <span className="text-slate-700">Project {topFlagged.id} ({Math.round(topFlagged.riskScore)}% Composite Risk)</span>
                </div>
              </div>
              <Link
                to={`/project/${topFlagged.id}`}
                className="text-xs font-bold text-rose-700 hover:text-rose-800 flex items-center gap-1 shrink-0 hover:underline"
              >
                Audit Dossier →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 3 Core Feature Pillars */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
            Core AI Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2545]">
            Algorithmic Oversight Framework
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Four specialized machine learning pipelines continuously validating physical and financial progress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Anomaly Detection */}
          <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4 hover:shadow-gov-hover transition-all group shadow-gov-card">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Cost & Rate Anomaly Detection</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Identify abnormal bill inflations by cross-referencing Central PWD and State District Schedule of Rates (DSR) baselines.
            </p>
          </div>

          {/* Card 2: Fraud Detection */}
          <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4 hover:shadow-gov-hover transition-all group shadow-gov-card">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Photo Duplication & Cartels</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              OpenCV 64-bit dHash perceptual hashing flags recycled photos across districts; NetworkX reveals circular tender collusion rings.
            </p>
          </div>

          {/* Card 3: Inefficiency Detection */}
          <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4 hover:shadow-gov-hover transition-all group shadow-gov-card">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">SLA Breach Escalations</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Predictive delay models notify District Magistrates before statutory timelines lapse, preventing idle funds in treasury accounts.
            </p>
          </div>
        </div>
      </section>

      {/* How AI Works 5-Step Process */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
              Statutory Governance
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2545]">
              How AI Supports Administrative Action
            </h2>
            <p className="text-xs text-slate-600">
              Human-in-the-loop governance: AI scores risk vectors and provides audit trails, while designated officers execute statutory powers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
            {/* Step 1 */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 relative text-center shadow-gov-sm">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-bold font-mono text-xs flex items-center justify-center mx-auto border border-blue-200">
                1
              </div>
              <h4 className="text-xs font-bold text-slate-900">e-SAKSHI Ingestion</h4>
              <p className="text-[11px] text-slate-500">Sanction orders, contractor tenders, MB records, and field photos.</p>
            </div>

            {/* Step 2 */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 relative text-center shadow-gov-sm">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-bold font-mono text-xs flex items-center justify-center mx-auto border border-blue-200">
                2
              </div>
              <h4 className="text-xs font-bold text-slate-900">Forensic AI Scan</h4>
              <p className="text-[11px] text-slate-500">Perceptual image hashing, cartel bipartite graphs, and DSR benchmarking.</p>
            </div>

            {/* Step 3 */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 relative text-center shadow-gov-sm">
              <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-800 font-bold font-mono text-xs flex items-center justify-center mx-auto border border-amber-200">
                3
              </div>
              <h4 className="text-xs font-bold text-slate-900">Composite Risk Score</h4>
              <p className="text-[11px] text-slate-500">Formulated risk rating (0-100) with corroborated evidence breakdown.</p>
            </div>

            {/* Step 4 */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 relative text-center shadow-gov-sm">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-bold font-mono text-xs flex items-center justify-center mx-auto border border-blue-200">
                4
              </div>
              <h4 className="text-xs font-bold text-slate-900">Officer Examination</h4>
              <p className="text-[11px] text-slate-500">District Magistrate & Central MoSPI officers review flagged dossiers.</p>
            </div>

            {/* Step 5 */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 relative text-center shadow-gov-sm">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 font-bold font-mono text-xs flex items-center justify-center mx-auto border border-emerald-200">
                5
              </div>
              <h4 className="text-xs font-bold text-emerald-700">Executive Order</h4>
              <p className="text-[11px] text-slate-500">Freeze stage-disbursals, order physical audit, or digitally certify.</p>
            </div>
          </div>
        </div>
      </section>

      {/* National Statistics Section */}
      <section id="stats" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
          <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-gov-card">
            <span className="text-3xl sm:text-4xl font-black font-mono text-[#0B2545]">
              {kpis.projectsMonitored.toLocaleString()}
            </span>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Works Monitored</p>
            <p className="text-[11px] text-slate-500">Across 28 States & 8 UTs</p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-gov-card">
            <span className="text-3xl sm:text-4xl font-black font-mono text-blue-700">
              ₹{kpis.totalFundsCr} Cr
            </span>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Sanctioned Value</p>
            <p className="text-[11px] text-slate-500">Tracked in FY 2025-26</p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-gov-card">
            <span className="text-3xl sm:text-4xl font-black font-mono text-amber-700">
              {kpis.anomaliesDetected}
            </span>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Anomalies Detected</p>
            <p className="text-[11px] text-slate-500">Early Detection Rate 94%</p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-gov-card">
            <span className="text-3xl sm:text-4xl font-black font-mono text-rose-700">
              {kpis.highRiskProjects}
            </span>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">High Risk Dossiers</p>
            <p className="text-[11px] text-slate-500">Under Active Audit Review</p>
          </div>
        </div>
      </section>

      {/* Official Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-600 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>MPLADS INTELLIGENCE — Ministry of Statistics and Programme Implementation</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-mono">
            <span>© 2026 Government of India</span>
            <span>•</span>
            <Link to="/public" className="text-blue-700 hover:underline">Public Portal</Link>
            <span>•</span>
            <Link to="/login" className="text-blue-700 hover:underline">Officer Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
