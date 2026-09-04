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
  ChevronDown
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../context/LanguageContext';
import { ROLES } from '../../utils/constants';
import { ThreeColumnArchitecture } from '../../components/dashboard/ThreeColumnArchitecture';
import { DrillDownSlideOver } from '../../components/ui/DrillDownSlideOver';
import { SarvamIndicModal } from '../../components/sarvam/SarvamIndicModal';

export const Home = () => {
  const { switchRole } = useAuth();
  const { currentLanguage, setLanguage, t } = useLanguage();
  const [nationalKpis, setNationalKpis] = useState({ projectsMonitored: 8420, totalFundsCr: '4,210.00', anomaliesDetected: 142, highRiskProjects: 38 });
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  useEffect(() => {
    api.getNationalKPIs()
      .then(res => { if (res.success && res.data) setNationalKpis(res.data); })
      .catch(() => {});
  }, []);
  const navigate = useNavigate();

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

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-600 selection:text-white">
      {/* Top National Tiranga Micro Ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* Official Government Navigation Header (e-SAKSHI Masthead) */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B2545] p-0.5 shadow-sm flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-[#0B2545]">
                  MPLADS <span className="text-blue-700">SENTINEL</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono uppercase bg-blue-50 text-blue-800 border border-blue-200 rounded font-bold">
                  e-SAKSHI AI Layer
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide hidden sm:block">
                भारत सरकार • Government of India | सांख्यिकी मंत्रालय • MoSPI
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-700 transition-colors">
              {t('landing_nav_capabilities', 'Core Capabilities')}
            </a>
            <a href="#how-it-works" className="hover:text-blue-700 transition-colors">
              {t('landing_nav_workflow', 'Audit Workflow')}
            </a>
            <a href="#stats" className="hover:text-blue-700 transition-colors">
              {t('landing_nav_stats', 'National Stats')}
            </a>
            <Link to="/public" className="hover:text-blue-700 transition-colors flex items-center gap-1.5 text-blue-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t('landing_nav_transparency', 'Public Transparency')}</span>
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Indic Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-600 rounded-lg text-xs text-slate-800 transition-all shadow-sm font-semibold cursor-pointer"
                title="Select Indic Language (Translates entire page)"
              >
                <Globe className="w-3.5 h-3.5 text-blue-700" />
                <span className="font-mono text-[11px]">{currentLangObj.flag} {currentLangObj.native}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Sovereign Indic Languages (8)
                  </div>
                  <div className="py-1">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left hover:bg-blue-50 transition-colors cursor-pointer ${
                          currentLanguage === lang.code ? 'font-bold text-blue-700 bg-blue-50/50' : 'text-slate-700'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.native}</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLaunchCitizenPortal}
              className="hidden sm:inline-flex border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
            >
              {t('role_citizen', 'Citizen Portal')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleLaunchAdminDemo}
              icon={ArrowRight}
              iconPosition="right"
              className="bg-[#0B2545] hover:bg-[#081D37] text-white text-xs font-semibold shadow-gov-card"
            >
              {t('landing_login', 'Officer Login')}
            </Button>
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

          {/* Quick Demo scenario callout banner */}
          <div className="mt-8 p-4 bg-rose-50/90 border border-rose-200 rounded-2xl max-w-2xl mx-auto text-left flex items-center justify-between gap-4 shadow-gov-sm">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-rose-900">Active Forensic Flag: </span>
                <span className="text-slate-700">Project MPLAD-2026-00124 (87% Composite Risk, 96% Recycled Image)</span>
              </div>
            </div>
            <Link
              to="/project/MPLAD-2026-00124"
              className="text-xs font-bold text-rose-700 hover:text-rose-800 flex items-center gap-1 shrink-0 hover:underline"
            >
              Audit Dossier →
            </Link>
          </div>
        </div>
      </section>

      {/* THREE-COLUMN AI ARCHITECTURE (Photo 3 & Core Capabilities) */}
      <section id="features" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
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
              {nationalKpis.projectsMonitored.toLocaleString()}
            </span>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Works Monitored</p>
            <p className="text-[11px] text-slate-500">Across 28 States & 8 UTs</p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-gov-card">
            <span className="text-3xl sm:text-4xl font-black font-mono text-blue-700">
              ₹{nationalKpis.totalFundsCr} Cr
            </span>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Sanctioned Value</p>
            <p className="text-[11px] text-slate-500">Tracked in FY 2025-26</p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-gov-card">
            <span className="text-3xl sm:text-4xl font-black font-mono text-amber-700">
              {nationalKpis.anomaliesDetected}
            </span>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Anomalies Detected</p>
            <p className="text-[11px] text-slate-500">Early Detection Rate 94%</p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-gov-card">
            <span className="text-3xl sm:text-4xl font-black font-mono text-rose-700">
              {nationalKpis.highRiskProjects}
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

      {/* Interactive Drill-Down Slide-Over Component */}
      <DrillDownSlideOver
        isOpen={isSlideOverOpen}
        onClose={() => setIsSlideOverOpen(false)}
        project={selectedProject}
      />

      {/* Sarvam Indic Intelligence Modal */}
      <SarvamIndicModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
    </div>
  );
};
