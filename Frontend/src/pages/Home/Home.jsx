import React, { useEffect, useState, useRef } from 'react';
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
  Award,
  LogOut,
  User
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../components/common/Button';
import { TopUtilityBar } from '../../components/layout/TopUtilityBar';
import { GovFooter } from '../../components/layout/GovFooter';
import { CitizenRequestModal } from '../../components/common/CitizenRequestModal';
import { ThreeColumnArchitecture } from '../../components/dashboard/ThreeColumnArchitecture';
import { SystemicVulnerabilitiesFramework } from '../../components/dashboard/SystemicVulnerabilitiesFramework';
import { DrillDownSlideOver } from '../../components/ui/DrillDownSlideOver';
import { SarvamIndicModal } from '../../components/sarvam/SarvamIndicModal';
import { AuthModal } from '../../components/common/AuthModal';
import { TiltQuoteCard } from '../../components/common/TiltQuoteCard';
import { GlowingParticlesBackground } from '../../components/common/GlowingParticlesBackground';
import {
  AeroplaneArrow,
  AeroplaneSend,
  AnimatedEye,
  AnimatedVoice,
  AnimatedAlertTriangle,
  AnimatedFileText
} from '../../components/common/AnimatedIcons';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../context/LanguageContext';
import { ROLES } from '../../utils/constants';

/**
 * Typewriter Heading Component
 * Types the heading character by character upon entering the viewport.
 */
const TypewriterHeading = ({ text, className = '' }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let index = 0;
    const interval = setInterval(() => {
      index++;
      setDisplayedText(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 24);
    return () => clearInterval(interval);
  }, [hasStarted, text]);

  return (
    <h2 ref={containerRef} className={className}>
      {hasStarted ? displayedText : text}
      {hasStarted && displayedText.length < text.length && (
        <span className="inline-block w-1.5 h-6 sm:h-8 bg-blue-600 ml-1 animate-pulse align-middle" />
      )}
    </h2>
  );
};

/**
 * Scroll Scaling Heading Component
 * Grows font size as user scrolls towards it, and reveals an orange underline when in view.
 */
const ScrollScalingHeading = ({ title = "About the MPLAD Scheme" }) => {
  const ref = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalDist = windowHeight * 0.65;
      const current = windowHeight - rect.top;
      const progress = Math.max(0, Math.min(1, current / totalDist));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scale = 0.92 + scrollProgress * 0.16;
  const underlineWidth = `${Math.min(100, Math.round(scrollProgress * 100))}%`;

  return (
    <div ref={ref} className="relative inline-block">
      <h2
        className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B2545] transition-transform duration-75 origin-left"
        style={{ transform: `scale(${scale})` }}
      >
        {title}
      </h2>
      <div
        className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-full mt-2 transition-all duration-150 ease-out"
        style={{
          width: underlineWidth,
          opacity: scrollProgress > 0.1 ? Math.min(1, scrollProgress * 1.2) : 0,
        }}
      />
    </div>
  );
};

export const Home = () => {
  const { user, isAuthenticated, logout, switchRole } = useAuth();
  const { currentLanguage, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  // Mode toggles
  const [kpiMode, setKpiMode] = useState('statutory'); // 'statutory' | 'ai_vigilance'
  const [activeSabha, setActiveSabha] = useState('lok'); // 'lok' | 'rajya'

  // Active nav section state
  const [activeNav, setActiveNav] = useState('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

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
    navigate('/dashboard');
  };

  const handleLaunchCitizenPortal = () => {
    navigate('/public');
  };

  const handleOpenSlideOver = (project = null) => {
    setSelectedProject(project);
    setIsSlideOverOpen(true);
  };

  // Scroll-spy listener: automatically update activeNav as user scrolls through sections
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      const aboutElem = document.getElementById('aboutus');
      const methodologyElem = document.getElementById('methodology');

      if (aboutElem && scrollPosition >= aboutElem.offsetTop) {
        setActiveNav('about');
      } else if (methodologyElem && scrollPosition >= methodologyElem.offsetTop) {
        setActiveNav('methodology');
      } else {
        setActiveNav('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id, navKey) => {
    setActiveNav(navKey);
    const elem = document.getElementById(id);
    if (elem) {
      const headerOffset = 115;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-600 selection:text-white flex flex-col font-sans">
      {/* 1. Official Government Top Utility Bar (A-, A, A+, Indic Switcher, Tricolor) */}
      <TopUtilityBar onOpenVoiceModal={() => setIsVoiceModalOpen(true)} />

      {/* 2. Official e-SAKSHI Dual-Tier Masthead with Fixed Top Offset to prevent collision */}
      <header className="sticky top-[32px] z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
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

          {/* Authentic Clean Navigation Links with Sliding Cylinder Indicator & Scroll-Spy */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100/90 p-1 rounded-full border border-slate-200 shadow-inner">
            {/* 1. Home */}
            <button
              type="button"
              onClick={() => {
                setActiveNav('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative px-4 py-1.5 rounded-full flex items-center gap-1.5 font-bold transition-colors duration-200 z-10 cursor-pointer ${
                activeNav === 'home' ? 'text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {activeNav === 'home' && (
                <motion.div
                  layoutId="homeNavIndicator"
                  className="absolute inset-0 bg-[#0B2545] rounded-full -z-10 shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeNav === 'home' ? 'bg-emerald-400 scale-100' : 'bg-slate-400 scale-75'
                }`}
              />
              <span>Home</span>
            </button>

            {/* 2. Methodology & Working Principle */}
            <button
              type="button"
              onClick={() => scrollToSection('methodology', 'methodology')}
              className={`relative px-4 py-1.5 rounded-full flex items-center gap-1.5 font-bold transition-colors duration-200 z-10 cursor-pointer ${
                activeNav === 'methodology' ? 'text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {activeNav === 'methodology' && (
                <motion.div
                  layoutId="homeNavIndicator"
                  className="absolute inset-0 bg-[#0B2545] rounded-full -z-10 shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeNav === 'methodology' ? 'bg-cyan-400 scale-100' : 'bg-slate-400 scale-75'
                }`}
              />
              <span>Methodology & Working Principle</span>
            </button>

            {/* 3. About the Scheme */}
            <button
              type="button"
              onClick={() => scrollToSection('aboutus', 'about')}
              className={`relative px-4 py-1.5 rounded-full flex items-center gap-1.5 font-bold transition-colors duration-200 z-10 cursor-pointer ${
                activeNav === 'about' ? 'text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {activeNav === 'about' && (
                <motion.div
                  layoutId="homeNavIndicator"
                  className="absolute inset-0 bg-[#0B2545] rounded-full -z-10 shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeNav === 'about' ? 'bg-emerald-400 scale-100' : 'bg-slate-400 scale-75'
                }`}
              />
              <span>About the Scheme</span>
            </button>
          </nav>

          {/* User Profile Avatar with Dropdown (when authenticated) OR Clean 'Login' Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                  title="Account Profile"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                    alt={user?.name || 'User'}
                    className="w-7 h-7 rounded-md object-cover border border-slate-300"
                  />
                  <span className="hidden sm:inline-block text-xs font-bold text-slate-800 truncate max-w-[110px]">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2">
                      <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.designation || user?.email}</p>
                      <span className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200">
                        {user?.badge || 'Authorized'}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>Security & Profile</span>
                      </Link>
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAuthModalOpen(true)}
                icon={ArrowRight}
                iconPosition="right"
                className="bg-[#0B2545] hover:bg-[#081D37] text-white text-xs font-semibold shadow-gov-card px-4 group"
              >
                <span>Login</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* 3. Hero Section - Deep institutional canvas with dynamic interactive glowing particles & wave cut */}
      <section className="relative bg-[#06182E] text-white pt-16 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Dynamic Interactive Glowing Particles Canvas */}
        <GlowingParticlesBackground />

        {/* Ambient background depth gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-5 relative z-10">
          {/* Reference pill tag */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold backdrop-blur-sm shadow-inner"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Next-Generation AI Forensic Vigilance for MPLADS e-SAKSHI</span>
          </motion.div>

          {/* Reference headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white"
          >
            MPLADS:{' '}
            <span className="text-[#F6C85F]">From Local Priorities</span>{' '}
            to{' '}
            <span className="text-[#6EE7B7]">National Development</span>
          </motion.h1>

          {/* Reference subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs sm:text-sm text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed"
          >
            Ensuring continuous algorithmic vigilance, transparent fund utilization, and high-assurance project verification across all 543 Lok Sabha Constituencies with OpenCV 64-bit dHash, NetworkX Cartel Analyzers, and Sarvam Indic Voice Intelligence.
          </motion.p>

          {/* Call-to-action buttons with animated interactive icons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <button
              type="button"
              onClick={handleLaunchAdminDemo}
              className="group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-blue-500/30 transition-all duration-200 border border-blue-400/40 active:scale-95 cursor-pointer"
            >
              <span>Launch MoSPI Central Command</span>
              <AeroplaneArrow className="w-4 h-4 text-white" />
            </button>

            <button
              type="button"
              onClick={handleLaunchCitizenPortal}
              className="group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-slate-100 hover:text-white text-xs sm:text-sm font-semibold border border-slate-500/50 backdrop-blur-sm transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <AnimatedEye className="w-4 h-4 text-cyan-300" />
              <span>Explore Public Portal</span>
            </button>
          </motion.div>
        </div>

        {/* SVG Curved Wave Transition at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
          <svg
            className="relative block w-full h-12 sm:h-16 text-slate-50"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C150,90 350,-40 500,50 C650,140 900,10 1200,40 L1200,120 L0,120 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* 4 Quick Access Cards floating directly above the wave */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-10 sm:-mt-14 relative z-20 mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.a
            href="#aboutus"
            onClick={(e) => {
              e.preventDefault();
              const elem = document.getElementById('aboutus');
              if (elem) elem.scrollIntoView({ behavior: 'smooth' });
            }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-4 bg-white border border-slate-200 hover:border-blue-500 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100 mb-2 group-hover:scale-105 transition-transform">
              <AnimatedFileText className="w-5 h-5 text-blue-700" />
            </div>
            <span className="font-bold text-xs text-slate-900 group-hover:text-blue-700 transition-colors">
              Guidelines & Acts
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5">2023 Revised Protocol</span>
          </motion.a>

          <motion.button
            type="button"
            onClick={() => setIsVoiceModalOpen(true)}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-4 bg-white border border-slate-200 hover:border-emerald-500 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100 mb-2 group-hover:scale-105 transition-transform">
              <AnimatedVoice className="w-5 h-5 text-emerald-700" />
            </div>
            <span className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors">
              Voice AI Assist
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5">8 Indic Languages</span>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => setIsCitizenModalOpen(true)}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-4 bg-white border border-slate-200 hover:border-amber-500 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100 mb-2 group-hover:scale-105 transition-transform">
              <AeroplaneSend className="w-5 h-5 text-amber-700" />
            </div>
            <span className="font-bold text-xs text-slate-900 group-hover:text-amber-700 transition-colors">
              Citizen Request
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5">Local Area Proposal</span>
          </motion.button>

          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="h-full"
          >
            <Link
              to="/project/MPLAD-2026-00124"
              className="p-4 bg-white border border-rose-200 hover:border-rose-500 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col items-center text-center group h-full block"
            >
              <div className="w-11 h-11 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 border border-rose-100 mb-2 group-hover:scale-105 transition-transform">
                <AnimatedAlertTriangle className="w-5 h-5 text-rose-700" />
              </div>
              <span className="font-bold text-xs text-rose-900 group-hover:text-rose-700 transition-colors">
                Live AI Audit Dossier
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5">Flagged NANDURBAR</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* 4. Live Institutional Continuous Right-to-Left Marquee Announcement Ticker */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-12">
        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center gap-3 overflow-hidden">
          <div className="px-3 py-1 bg-[#0B2545] text-white text-[10px] font-bold uppercase tracking-wider rounded font-mono shrink-0 flex items-center gap-1.5 shadow-sm">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Live Surveillance</span>
          </div>
          <div className="flex-1 overflow-hidden relative">
            {/* Seamless Infinite Marquee with double text for continuous loop */}
            <div className="animate-marquee-smooth text-xs text-slate-600 font-medium">
              <span className="pr-12">
                🔔 <strong className="text-slate-900">MoSPI e-SAKSHI 2.0 Alert:</strong> Surveillance active across 543 Lok Sabha Constituencies • ₹83,336.67 Cr funds continuously monitored • Project MPLAD-2026-00124 (Nandurbar) flagged with 87% composite risk due to duplicate image detection • TSA/Hybrid ‘just-in-time’ fund disbursal protocol integrated with PFMS, RBI and SBI.
              </span>
              <span className="pr-12">
                🔔 <strong className="text-slate-900">MoSPI e-SAKSHI 2.0 Alert:</strong> Surveillance active across 543 Lok Sabha Constituencies • ₹83,336.67 Cr funds continuously monitored • Project MPLAD-2026-00124 (Nandurbar) flagged with 87% composite risk due to duplicate image detection • TSA/Hybrid ‘just-in-time’ fund disbursal protocol integrated with PFMS, RBI and SBI.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Dual-Mode 6-Stat KPI Ribbon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-12">
        <div className="bg-white border border-slate-200 rounded-md p-5 shadow-sm space-y-5">
          
          {/* Header & Dual-Mode Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-3.5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#0B2545]">
                  National Developmental Indicators & Fund Flow
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-blue-50 text-blue-800 rounded font-bold border border-blue-200">
                  e-SAKSHI Official Metrics
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Live statistics of works recommended online by Hon'ble Members of Parliament under revised TSA fund procedure
              </p>
            </div>

            {/* Mode Switcher Buttons */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-md border border-slate-200 self-stretch sm:self-auto justify-center">
              <button
                type="button"
                onClick={() => setKpiMode('statutory')}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
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
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
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
                className={`px-3.5 py-1 rounded text-xs font-bold transition-all border ${
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
                className={`px-3.5 py-1 rounded text-xs font-bold transition-all border ${
                  activeSabha === 'rajya'
                    ? 'bg-[#0B2545] text-white border-[#0B2545]'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Rajya Sabha (245 MPs)
              </button>
            </div>
          )}

          {/* KPI Cards Grid */}
          {kpiMode === 'statutory' ? (
            /* Statutory Physical View */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Card 1: Entitlement */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-md space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Entitlement (FY)</p>
                <h3 className="text-xl font-black font-mono text-slate-800">₹5.00 Cr</h3>
                <p className="text-[10px] text-slate-500">Per MP / Year</p>
              </div>

              {/* Card 2: Total Available */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-md space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">TSA Pooled Fund</p>
                <h3 className="text-xl font-black font-mono text-slate-800">₹8,333.67 Cr</h3>
                <p className="text-[10px] text-slate-500">Active Allocations</p>
              </div>

              {/* Card 3: Works Recommended */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-md space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Works Recommended</p>
                <h3 className="text-xl font-black font-mono text-slate-800">
                  {activeSabha === 'lok' ? '33,123' : '8,410'}
                </h3>
                <p className="text-[10px] text-slate-500">Digital Submissions</p>
              </div>

              {/* Card 4: Works Sanctioned */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-md space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Works Sanctioned</p>
                <h3 className="text-xl font-black font-mono text-slate-800">
                  {activeSabha === 'lok' ? '28,450' : '6,920'}
                </h3>
                <p className="text-[10px] text-slate-500">Feasibility Passed</p>
              </div>

              {/* Card 5: Works Completed */}
              <div className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-md space-y-1">
                <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Works Completed</p>
                <h3 className="text-xl font-black font-mono text-emerald-900">
                  {activeSabha === 'lok' ? '21,200' : '5,140'}
                </h3>
                <p className="text-[10px] text-emerald-700">Assets Built & Verified</p>
              </div>

              {/* Card 6: Total Expenditure */}
              <div className="p-3.5 bg-indigo-50/50 border border-indigo-200 rounded-md space-y-1">
                <p className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider">Total Expenditure</p>
                <h3 className="text-xl font-black font-mono text-indigo-900">
                  {activeSabha === 'lok' ? '₹46,210 Cr' : '₹9,840 Cr'}
                </h3>
                <p className="text-[10px] text-indigo-700">PFMS Disbursals</p>
              </div>
            </div>
          ) : (
            /* AI Forensic Layer Active */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3.5 bg-white border border-blue-300 rounded-md space-y-1 shadow-sm">
                <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">AI Monitored Works</p>
                <h3 className="text-xl font-black font-mono text-blue-900">8,420</h3>
                <p className="text-[10px] text-blue-700 font-mono">100% Geotagged MBs</p>
              </div>

              <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-md space-y-1 shadow-sm">
                <p className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">Anomalies Flagged</p>
                <h3 className="text-xl font-black font-mono text-rose-900">142</h3>
                <p className="text-[10px] text-rose-700 font-mono">Continuous Watch</p>
              </div>

              <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-md space-y-1 shadow-sm">
                <p className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">High-Risk Queue</p>
                <h3 className="text-xl font-black font-mono text-rose-900">38</h3>
                <p className="text-[10px] text-rose-700 font-mono">Composite &gt; 70</p>
              </div>

              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-md space-y-1 shadow-sm">
                <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Cartels Detected</p>
                <h3 className="text-xl font-black font-mono text-amber-900">14 Rings</h3>
                <p className="text-[10px] text-amber-700 font-mono">HHI Index &gt; 2500</p>
              </div>

              <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-md space-y-1 shadow-sm">
                <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Duplicate Intercept</p>
                <h3 className="text-xl font-black font-mono text-emerald-900">96.4%</h3>
                <p className="text-[10px] text-emerald-700 font-mono">OpenCV 64-bit dHash</p>
              </div>

              <div className="p-3.5 bg-purple-50 border border-purple-300 rounded-md space-y-1 shadow-sm">
                <p className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">Disbursals on Hold</p>
                <h3 className="text-xl font-black font-mono text-purple-900">₹412.5 Cr</h3>
                <p className="text-[10px] text-purple-700 font-mono">Milestone Holds</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. Methodology & Working Principle Section (Systemic Vulnerabilities + Algorithmic Vigilance) */}
      <section id="methodology" className="w-full bg-[#F3F6F9] border-t border-b border-slate-300/80 py-16 mb-0 scroll-mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold font-mono shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>e-SAKSHI 2.0 AI Sentinel Layer — Core Methodology & Working Principles</span>
            </div>
            <TypewriterHeading
              text="Algorithmic Vigilance & Systemic Vulnerability Mitigations"
              className="text-2xl sm:text-4xl font-black text-[#0B2545] min-h-[44px]"
            />
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              From mathematical risk formulas and computer vision forensics to rigorous defenses against GPS spoofing, human-in-the-loop bribery, and synthetic image fraud.
            </p>
          </div>

          {/* Part A: Systemic Vulnerabilities & Countermeasures Matrix */}
          <SystemicVulnerabilitiesFramework />

          {/* Part B: Three-Column Core Intelligence Engine */}
          <div className="pt-8">
            <div className="mb-6">
              <h3 className="text-lg font-black text-[#0B2545] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span>Three-Column Continuous Audit Architecture</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Live interactive demonstration of OpenCV 64-bit dHash perceptual hashing, NetworkX cartel analyzers, and composite risk scoring formulas.
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
          </div>
        </div>
      </section>

      {/* Institutional Boundary Divider Between Methodology and Statutory Overview */}
      <div className="w-full bg-slate-200 h-1.5 bg-gradient-to-r from-amber-400/50 via-slate-300 to-emerald-500/50" />

      {/* 7. Statutory "About the Scheme" Section (Verbatim e-SAKSHI Narrative) */}
      <section id="aboutus" className="w-full bg-white border-b border-slate-200 py-24 px-4 sm:px-6 lg:px-8 scroll-mt-32">
        <div className="max-w-6xl mx-auto space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Statutory Narrative */}
            <div className="lg:col-span-8 space-y-5 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
                  Statutory Overview
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-500">Ministry of Statistics & Programme Implementation</span>
              </div>

              <ScrollScalingHeading title="About the MPLAD Scheme" />

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

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3.5">
                <Award className="w-7 h-7 text-amber-600 shrink-0" />
                <p className="text-xs text-slate-700">
                  <strong>Viksit Bharat @ 2047 Alignment: </strong>
                  The Scheme encourages MPs to prioritize future-ready, green, and sustainable infrastructure that supports grassroots social equity and self-reliance.
                </p>
              </div>
            </div>

            {/* Right: Prime Minister's E-Governance Quote Card with Weighted Interactive 3D Tilt */}
            <div className="lg:col-span-4 flex justify-center">
              <TiltQuoteCard />
            </div>
          </div>

        </div>
      </section>

      {/* 8. Institutional Footer */}
      <GovFooter />

      {/* Auth Modal Prompt */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialRole={ROLES.MOSPI_ADMIN}
      />

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