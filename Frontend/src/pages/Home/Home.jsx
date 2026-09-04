import React, { useEffect, useState } from 'react';
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
  AlertOctagon,
  Globe,
  ChevronDown,
  Volume2,
  FileText,
  Video,
  Send,
  ExternalLink,
  IndianRupee,
  Activity,
  Award
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { TopUtilityBar } from '../../components/layout/TopUtilityBar';
import { GovFooter } from '../../components/layout/GovFooter';
import { CitizenRequestModal } from '../../components/common/CitizenRequestModal';
import { ThreeColumnArchitecture } from '../../components/dashboard/ThreeColumnArchitecture';
import { DrillDownSlideOver } from '../../components/ui/DrillDownSlideOver';
import { SarvamIndicModal } from '../../components/sarvam/SarvamIndicModal';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../context/LanguageContext';
import { ROLES } from '../../utils/constants';

export const Home = () => {
  const { switchRole } = useAuth();
  const { currentLanguage, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  // Mode toggles
  const [kpiMode, setKpiMode] = useState('statutory'); // 'statutory' | 'ai_vigilance'
  const [activeSabha, setActiveSabha] = useState('lok'); // 'lok' | 'rajya'

  // Modals & Slide-over
  const [isCitizenModalOpen, setIsCitizenModalOpen] = useState(false);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Live national KPIs
  const [nationalKpis, setNationalKpis] = useState({
    projectsMonitored: 8420,
    totalFundsCr: '8,333.67',
    anomaliesDetected: 142,
    highRiskProjects: 38
  });

  useEffect(() => {
    api.getNationalKPIs()
      .then(res => { if (res.success && res.data) setNationalKpis(res.data); })
      .catch(() => {});
  }, []);

  const handleLaunchAdminDemo = () => {
    switchRole(ROLES.MOSPI_ADMIN);
    navigate('/dashboard');
  };

  const handleLaunchCitizenPortal = () => {
    switchRole(ROLES.CITIZEN);
    navigate('/public');
  };

  const handleOpenSlideOver = (project = null) => {
    setSelectedProject(project);
    setIsSlideOverOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-600 selection:text-white flex flex-col font-sans">
      {/* 1. Official Government Top Utility Bar (A-, A, A+, Indic Switcher, Tricolor) */}
      <TopUtilityBar onOpenVoiceModal={() => setIsVoiceModalOpen(true)} />

      {/* 2. Official e-SAKSHI Dual-Tier Masthead */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Official MoSPI & e-SAKSHI Brand Identification */}
          <div className="flex items-center gap-3.5">
            {/* Ashoka Lion Emblem Representation */}
            <div className="w-12 h-12 rounded-xl bg-[#0B2545] p-1 shadow-sm flex flex-col items-center justify-center text-white shrink-0 border border-blue-900">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
              <span className="text-[7px] font-bold tracking-tighter uppercase font-mono text-slate-300">MoSPI</span>
            </div>

            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-[#0B2545]">
                  MPLADS <span className="text-blue-700">e-SAKSHI 2.0</span>
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-mono uppercase bg-emerald-50 text-emerald-800 border border-emerald-300 rounded font-bold">
                  AI Sentinel Layer
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-semibold tracking-wide">
                भारत सरकार • सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय
              </p>
              <p className="text-[10px] text-slate-500 hidden sm:block">
                Ministry of Statistics & Programme Implementation • Govt. of India
              </p>
            </div>
          </div>

          {/* Authentic Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-700">
            <Link to="/" className="text-blue-700 hover:text-blue-800 transition-colors">
              Home / मुख्य पृष्ठ
            </Link>
            <a href="#aboutus" className="hover:text-blue-700 transition-colors">
              About the Scheme
            </a>
            <Link to="/dashboard" className="hover:text-blue-700 transition-colors flex items-center gap-1">
              <span>Command Dashboard</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </Link>
            <Link to="/public" className="hover:text-blue-700 transition-colors">
              Public Portal
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={handleLaunchAdminDemo}
              icon={ArrowRight}
              iconPosition="right"
              className="bg-[#0B2545] hover:bg-[#081D37] text-white text-xs font-semibold shadow-gov-card px-4"
            >
              Officer Login
            </Button>
          </div>
        </div>
      </header>

      {/* 3. Hero Section with Signature e-SAKSHI Carousel Wave Overlay */}
      <section className="relative bg-gradient-to-b from-[#0B2545] via-[#0E2F56] to-[#133A6B] text-white pt-14 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-5xl mx-auto text-center space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-900/60 border border-blue-400/40 text-blue-200 text-xs font-medium backdrop-blur-sm shadow-sm">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Next-Generation AI Forensic Vigilance for MPLADS e-SAKSHI</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            MPLADS: <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-white to-cyan-300">From Local Priorities</span> to National Development
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Ensuring continuous algorithmic vigilance, transparent fund utilization, and high-assurance project verification across all 543 Lok Sabha Constituencies with OpenCV 64-bit dHash, NetworkX Cartel Analyzers, and Sarvam Indic Voice Intelligence.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Button
              variant="primary"
              size="lg"
              onClick={handleLaunchAdminDemo}
              icon={ArrowRight}
              iconPosition="right"
              className="text-xs sm:text-sm font-bold px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg border border-blue-400/30"
            >
              Launch MoSPI Central Command
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleLaunchCitizenPortal}
              icon={Eye}
              className="text-xs sm:text-sm font-bold px-6 border-slate-400/40 text-slate-100 bg-white/10 hover:bg-white/20 backdrop-blur-sm"
            >
              Explore Public Portal
            </Button>
          </div>
        </div>

        {/* The Signature e-SAKSHI Wave Curve with Floating Action Pills */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-20">
          <svg
            className="relative block w-full h-16 sm:h-20 text-slate-50"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C150,90 400,100 600,40 C800,-20 1050,80 1200,30 L1200,120 L0,120 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* Quick Action Navigation Pills (Replicating e-SAKSHI Wave Links) */}
      <div className="max-w-4xl mx-auto px-4 -mt-10 sm:-mt-12 relative z-30 mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <a
            href="#aboutus"
            className="p-3.5 bg-white border border-slate-200 hover:border-blue-500 rounded-xl shadow-gov-card hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs text-slate-800">Guidelines & Acts</span>
            <span className="text-[10px] text-slate-500">2023 Revised Protocol</span>
          </a>

          <button
            type="button"
            onClick={() => setIsVoiceModalOpen(true)}
            className="p-3.5 bg-white border border-slate-200 hover:border-emerald-500 rounded-xl shadow-gov-card hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <Volume2 className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs text-slate-800">Voice AI Assist</span>
            <span className="text-[10px] text-slate-500">8 Indic Languages</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCitizenModalOpen(true)}
            className="p-3.5 bg-white border border-slate-200 hover:border-amber-500 rounded-xl shadow-gov-card hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <Send className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs text-slate-800">Citizen Request</span>
            <span className="text-[10px] text-slate-500">Local Area Proposal</span>
          </button>

          <Link
            to="/project/MPLAD-2026-00124"
            className="p-3.5 bg-white border border-slate-200 hover:border-rose-500 rounded-xl shadow-gov-card hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs text-slate-800">Live AI Audit Dossier</span>
            <span className="text-[10px] text-slate-500">Flagged NANDURBAR</span>
          </Link>
        </div>
      </div>

      {/* 4. Live Institutional Marquee Announcement Ticker */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-8">
        <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center gap-3 overflow-hidden">
          <div className="px-2.5 py-1 bg-[#0B2545] text-white text-[10px] font-bold uppercase tracking-wider rounded font-mono shrink-0 flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>Live Surveillance</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap text-xs text-slate-600 font-medium">
              🔔 <strong className="text-slate-800">MoSPI e-SAKSHI 2.0 Alert: </strong> 
              Surveillance active across 543 Lok Sabha Constituencies • ₹83,336.67 Cr funds continuously monitored • 
              Project MPLAD-2026-00124 (Nandurbar) flagged with 87% composite risk due to duplicate image detection • 
              TSA/Hybrid ‘just-in-time’ fund disbursal protocol integrated with PFMS, RBI and SBI.
            </div>
          </div>
        </div>
      </div>

      {/* 5. Dual-Mode 6-Stat KPI Ribbon (e-SAKSHI Statutory Ledger vs AI Vigilance Layer) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-14">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-gov-card space-y-6">
          
          {/* Header & Dual-Mode Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-[#0B2545]">
                  National Developmental Indicators
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-blue-50 text-blue-800 rounded font-bold border border-blue-200">
                  e-SAKSHI Official Metrics
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Live statistics of works recommended online by Hon'ble Members of Parliament under the revised procedure
              </p>
            </div>

            {/* Mode Switcher Buttons */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 self-stretch sm:self-auto justify-center">
              <button
                type="button"
                onClick={() => setKpiMode('statutory')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  kpiMode === 'statutory'
                    ? 'bg-white text-[#0B2545] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🏛️ Statutory e-SAKSHI View
              </button>
              <button
                type="button"
                onClick={() => setKpiMode('ai_vigilance')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  kpiMode === 'ai_vigilance'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-rose-700 hover:text-rose-800'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>⚡ AI Vigilance Layer</span>
              </button>
            </div>
          </div>

          {/* Sub-Tabs for Lok Sabha vs Rajya Sabha (Active in Statutory Mode) */}
          {kpiMode === 'statutory' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveSabha('lok')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  activeSabha === 'lok'
                    ? 'bg-[#0B2545] text-white border-[#0B2545]'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Lok Sabha (543 MPs)
              </button>
              <button
                type="button"
                onClick={() => setActiveSabha('rajya')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  activeSabha === 'rajya'
                    ? 'bg-[#0B2545] text-white border-[#0B2545]'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Rajya Sabha (245 MPs)
              </button>
            </div>
          )}

          {/* 6 Metric Cards Grid */}
          {kpiMode === 'statutory' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {/* Card 1: Members of Parliament */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Members of Parliament</p>
                <h3 className="text-2xl font-black font-mono text-[#0B2545]">
                  {activeSabha === 'lok' ? '543' : '245'}
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">Total Entitled: 788 MPs</p>
              </div>

              {/* Card 2: Allocated Limit */}
              <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl space-y-1">
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Allocated Limit</p>
                <h3 className="text-2xl font-black font-mono text-blue-900">
                  {activeSabha === 'lok' ? '₹83,336 Cr' : '₹12,250 Cr'}
                </h3>
                <p className="text-[10px] text-blue-600 font-mono">₹5.00 Cr / Year / MP</p>
              </div>

              {/* Card 3: Works Recommended */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Works Recommended</p>
                <h3 className="text-2xl font-black font-mono text-slate-800">
                  {activeSabha === 'lok' ? '33,123' : '8,410'}
                </h3>
                <p className="text-[10px] text-slate-400">Digital Submissions</p>
              </div>

              {/* Card 4: Works Sanctioned */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Works Sanctioned</p>
                <h3 className="text-2xl font-black font-mono text-slate-800">
                  {activeSabha === 'lok' ? '28,450' : '6,920'}
                </h3>
                <p className="text-[10px] text-slate-400">District Feasibility Passed</p>
              </div>

              {/* Card 5: Works Completed */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-1">
                <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Works Completed</p>
                <h3 className="text-2xl font-black font-mono text-emerald-900">
                  {activeSabha === 'lok' ? '21,200' : '5,140'}
                </h3>
                <p className="text-[10px] text-emerald-600">Physical Assets Built</p>
              </div>

              {/* Card 6: Total Expenditure */}
              <div className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-xl space-y-1">
                <p className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider">Total Expenditure</p>
                <h3 className="text-2xl font-black font-mono text-indigo-900">
                  {activeSabha === 'lok' ? '₹46,210 Cr' : '₹9,840 Cr'}
                </h3>
                <p className="text-[10px] text-indigo-600">PFMS Vendor Payouts</p>
              </div>
            </div>
          ) : (
            /* AI Forensic Layer Active */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
              <div className="p-4 bg-white border border-blue-300 rounded-xl space-y-1 shadow-sm">
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">AI Scanned Works</p>
                <h3 className="text-2xl font-black font-mono text-blue-900">8,420</h3>
                <p className="text-[10px] text-blue-600 font-mono">100% Geotagged MBs</p>
              </div>

              <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl space-y-1 shadow-sm">
                <p className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">Anomalies Flagged</p>
                <h3 className="text-2xl font-black font-mono text-rose-900">142</h3>
                <p className="text-[10px] text-rose-600 font-mono">Early Interceptions</p>
              </div>

              <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl space-y-1 shadow-sm">
                <p className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">High-Risk Dossiers</p>
                <h3 className="text-2xl font-black font-mono text-rose-900">38</h3>
                <p className="text-[10px] text-rose-600 font-mono">Composite Score &gt; 80</p>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-1 shadow-sm">
                <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Cartels Unmasked</p>
                <h3 className="text-2xl font-black font-mono text-amber-900">14 Rings</h3>
                <p className="text-[10px] text-amber-600 font-mono">HHI Index &gt; 0.25</p>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-1 shadow-sm">
                <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Duplicate Intercept</p>
                <h3 className="text-2xl font-black font-mono text-emerald-900">96.4%</h3>
                <p className="text-[10px] text-emerald-600 font-mono">OpenCV 64-bit dHash</p>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-300 rounded-xl space-y-1 shadow-sm">
                <p className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">Payouts On Hold</p>
                <h3 className="text-2xl font-black font-mono text-purple-900">₹412.5 Cr</h3>
                <p className="text-[10px] text-purple-600 font-mono">Statutory Stage Freezes</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. The Three-Column AI Analytics Framework (Directly from User Photo 3) */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-16 space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>e-SAKSHI AI Layer — Three-Column Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0B2545]">
            Algorithmic Vigilance Across Every Stage
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            A tripartite architecture grouping Computer Vision, Network Graph Theory, and Composite Risk Formulas into an interactive oversight cockpit.
          </p>
        </div>

        <ThreeColumnArchitecture
          onOpenSlideOver={() => handleOpenSlideOver({
            id: 'MPLAD-2026-00124',
            title: 'Construction of Sub-District Health Center & Oxygen Plant',
            district: 'Nandurbar',
            state: 'Maharashtra',
            sanctionedAmount: 4850000,
            disbursedAmount: 3637500,
            spentAmount: 3880000,
            status: 'IN_PROGRESS',
            riskScore: 87,
            riskLevel: 'HIGH',
            contractor: 'Apex Infra & BuildTech Pvt Ltd',
            flags: ['Duplicate Photo Reused from Solapur', 'Financial Drift +5.0%']
          })}
          onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        />
      </section>

      {/* 7. Statutory "About the Scheme" Section (Verbatim e-SAKSHI Narrative) */}
      <section id="aboutus" className="bg-white border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Statutory Narrative */}
            <div className="lg:col-span-8 space-y-4 text-xs text-slate-600 leading-relaxed">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
                  Statutory Overview
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-500">Ministry of Statistics & Programme Implementation</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545]">
                About the MPLAD Scheme
              </h2>

              <p>
                <b>The Members of Parliament Local Area Development Scheme (MPLADS)</b> is a Central Sector Scheme fully funded by the Government of India, launched on 23 December 1993. The Scheme enables Members of Parliament (MPs) to recommend developmental works based on the locally felt needs of their constituencies, with a focus on creating durable community assets and improving essential public services such as health, sanitation, education, and drinking water infrastructure.
              </p>

              <p>
                At the time of its launch in 1993-94, each Member of Parliament was allocated ₹5 lakh per annum. The annual entitlement was subsequently enhanced to ₹1 crore in 1994-95, ₹2 crore in 1998-99, and <b>₹5 crore per annum</b> from the financial year 2011-12 onwards.
              </p>

              <p>
                In April 2023, MPLADS transitioned from a physical mode to a <b>fully digital end-to-end platform, e-SAKSHI</b>, comprising a web portal and companion mobile application. The platform provides dedicated login access to all stakeholders and facilitates transparent, efficient, and seamless implementation.
              </p>

              <p>
                Since April 2025, the Scheme implemented the <b>TSA / Hybrid fund flow procedure</b>, achieving the goal of ‘just-in-time’ fund release directly to vendors through an integrated network of PFMS, RBI and State Bank of India (Scheduled Commercial Bank).
              </p>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                <Award className="w-6 h-6 text-amber-600 shrink-0" />
                <p className="text-[11px] text-slate-700">
                  <strong>Viksit Bharat @ 2047 Alignment: </strong>
                  The Scheme encourages MPs to prioritize future-ready, green, and sustainable infrastructure that supports grassroots social equity and self-reliance.
                </p>
              </div>
            </div>

            {/* Right: Prime Minister's E-Governance Quote Card */}
            <div className="lg:col-span-4">
              <div className="p-6 bg-gradient-to-br from-[#0B2545] to-[#133A6B] text-white rounded-2xl shadow-gov-card space-y-4 border border-blue-900 relative overflow-hidden">
                <div className="w-20 h-20 bg-blue-500/10 rounded-full absolute -right-6 -bottom-6 blur-xl" />

                <div className="text-amber-400 font-serif text-3xl leading-none">“</div>
                <blockquote className="text-xs font-medium leading-relaxed text-slate-200 italic">
                  E-Governance is an essential part of our dream of Digital India. The more Technology we infuse in Governance, the better it is for India.
                </blockquote>

                <div className="pt-3 border-t border-blue-800/80">
                  <p className="font-bold text-sm text-amber-300">Shri Narendra Modi</p>
                  <p className="text-[11px] text-slate-300">Hon'ble Prime Minister of India</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 8. Institutional Footer */}
      <GovFooter />

      {/* Modals and Overlays */}
      <CitizenRequestModal
        isOpen={isCitizenModalOpen}
        onClose={() => setIsCitizenModalOpen(false)}
      />

      <DrillDownSlideOver
        isOpen={isSlideOverOpen}
        onClose={() => setIsSlideOverOpen(false)}
        project={selectedProject}
      />

      <SarvamIndicModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
    </div>
  );
};