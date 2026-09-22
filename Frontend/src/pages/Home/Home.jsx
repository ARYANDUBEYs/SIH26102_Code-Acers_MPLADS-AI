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
import { HeroWavyBackground } from '../../components/common/HeroWavyBackground';
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
        <span className="inline-block w-1.5 h-6 sm:h-8 bg-purple-700 ml-1 animate-pulse align-middle" />
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
        className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#2E1065] transition-transform duration-75 origin-left"
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
  const { user, isAuthenticated, isAdmin, isDistrictOfficer, logout, login } = useAuth();
  const isOfficial = isAdmin || isDistrictOfficer;
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

  const handleLaunchAdminDemo = async () => {
    if (!isAdmin) {
      await login('admin.mospi@gov.in', 'Admin@MPLADS2026', ROLES.MOSPI_ADMIN);
    }
    navigate('/dashboard');
  };

  const handleLaunchCitizenPortal = () => {
    navigate('/public');
  };

  const handleOpenSlideOver = (project = null) => {
    setSelectedProject(project);
    setIsSlideOverOpen(true);
  };

  const isManualScrollRef = useRef(false);
  const manualScrollTimerRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(1);

  // Scroll listener: handle both scroll-spy and header merge / title shrink
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);

      if (isManualScrollRef.current) return;

      const contactElem = document.getElementById('contact');
      const aboutElem = document.getElementById('aboutus');
      const methodologyElem = document.getElementById('methodology');

      // Check if user is scrolled to the bottom of the page or footer is in view
      const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 150);
      const contactTop = contactElem ? contactElem.getBoundingClientRect().top : Infinity;

      if (isAtBottom || contactTop <= window.innerHeight * 0.75) {
        setActiveNav('contact');
      } else if (aboutElem && aboutElem.getBoundingClientRect().top <= 220) {
        setActiveNav('about');
      } else if (methodologyElem && methodologyElem.getBoundingClientRect().top <= 220) {
        setActiveNav('methodology');
      } else {
        setActiveNav('home');
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (manualScrollTimerRef.current) clearTimeout(manualScrollTimerRef.current);
    };
  }, []);

  const scrollToSection = (id, navKey) => {
    setActiveNav(navKey);
    isManualScrollRef.current = true;
    if (manualScrollTimerRef.current) clearTimeout(manualScrollTimerRef.current);
    manualScrollTimerRef.current = setTimeout(() => {
      isManualScrollRef.current = false;
    }, 850);

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
    <div className="min-h-screen relative text-slate-800 selection:bg-blue-600 selection:text-white flex flex-col font-sans overflow-x-clip">
      {/* 1. Animated Moving Diagonal Gradient Background (Frutiger Aero Humanist Palette) */}
      <div className="fixed inset-0 home-moving-gradient pointer-events-none -z-10" />

      {/* 2. Official Government Top Utility Bar */}
      <div className="relative z-50">
        <TopUtilityBar sticky={false} onOpenVoiceModal={() => setIsVoiceModalOpen(true)} />
      </div>

      {/* Hero & Navbar Zone: Animated Parliament Wavy Background touches directly below TopUtilityBar */}
      <div className="relative w-full">
        {/* Animated Parliament Wavy Background - covers from below TopUtilityBar to bottom wave curve */}
        <HeroWavyBackground />

        {/* 3. Official Masthead / Navbar with dynamic glass appearance on scroll - Fixed at top-0 */}
        <div className="w-full h-20">
          <header
            className={`transition-all duration-300 w-full z-40 ${
              isScrolled
                ? 'fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-b border-purple-200/60 shadow-md text-slate-800'
                : 'relative bg-transparent border-transparent shadow-none text-slate-800'
            }`}
          >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Top-Left Brand Slot: Emerges from center-to-top-left morph animation ONLY when scrolled */}
          <div className="flex items-center gap-3.5 relative min-w-[120px] sm:min-w-[260px]">
            <motion.div
              animate={
                isScrolled
                  ? { opacity: 1, scale: 1, x: 0, y: 0 }
                  : { opacity: 0, scale: 1.6, x: 100, y: 50, pointerEvents: 'none' }
              }
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3"
            >
              {/* Ashoka Lion / Shield Emblem */}
              <div className="w-11 h-11 rounded-xl bg-[#2E1065] p-1 flex flex-col items-center justify-center text-white shrink-0 border border-purple-200/40 shadow-md">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span className="text-[7px] font-bold tracking-tighter uppercase font-mono text-white">MoSPI</span>
              </div>

              <div className="leading-tight">
                <div className="flex items-center gap-2">
                  <span className="font-black text-base sm:text-lg tracking-tight text-slate-900 drop-shadow-xs">
                    Scheme Guard
                  </span>
                </div>
                <p className="text-[10px] text-slate-600 font-medium tracking-wide">
                  MoSPI • Govt. of India
                </p>
              </div>
            </motion.div>
          </div>

          {/* Clean Navigation Links with Frosted Glass styling & Scroll-Spy */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-semibold p-1 rounded-full bg-white/70 backdrop-blur-md border border-purple-200/80 shadow-sm text-slate-700">
            {/* 1. Home */}
            <button
              type="button"
              onClick={() => {
                setActiveNav('home');
                isManualScrollRef.current = true;
                if (manualScrollTimerRef.current) clearTimeout(manualScrollTimerRef.current);
                manualScrollTimerRef.current = setTimeout(() => {
                  isManualScrollRef.current = false;
                }, 850);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative px-4 py-1.5 rounded-full flex items-center gap-1.5 font-bold transition-all duration-200 z-10 cursor-pointer ${
                activeNav === 'home'
                  ? 'text-white'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              {activeNav === 'home' && (
                <motion.div
                  layoutId="homeNavIndicator"
                  className="absolute inset-0 bg-[#2E1065] rounded-full -z-10 shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeNav === 'home' ? 'bg-purple-300 scale-100' : 'bg-slate-400 scale-75'
                }`}
              />
              <span>Home</span>
            </button>

            {/* 2. Methodology & Working Principle */}
            <button
              type="button"
              onClick={() => scrollToSection('methodology', 'methodology')}
              className={`relative px-4 py-1.5 rounded-full flex items-center gap-1.5 font-bold transition-all duration-200 z-10 cursor-pointer ${
                activeNav === 'methodology'
                  ? 'text-white'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              {activeNav === 'methodology' && (
                <motion.div
                  layoutId="homeNavIndicator"
                  className="absolute inset-0 bg-[#2E1065] rounded-full -z-10 shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeNav === 'methodology' ? 'bg-purple-300 scale-100' : 'bg-slate-400 scale-75'
                }`}
              />
              <span>Methodology & Working Principle</span>
            </button>

            {/* 3. About the Scheme */}
            <button
              type="button"
              onClick={() => scrollToSection('aboutus', 'about')}
              className={`relative px-4 py-1.5 rounded-full flex items-center gap-1.5 font-bold transition-all duration-200 z-10 cursor-pointer ${
                activeNav === 'about'
                  ? 'text-white'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              {activeNav === 'about' && (
                <motion.div
                  layoutId="homeNavIndicator"
                  className="absolute inset-0 bg-[#2E1065] rounded-full -z-10 shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeNav === 'about' ? 'bg-purple-300 scale-100' : 'bg-slate-400 scale-75'
                }`}
              />
              <span>About the Scheme</span>
            </button>

            {/* 4. Contact */}
            <button
              type="button"
              onClick={() => scrollToSection('contact', 'contact')}
              className={`relative px-4 py-1.5 rounded-full flex items-center gap-1.5 font-bold transition-all duration-200 z-10 cursor-pointer ${
                activeNav === 'contact'
                  ? 'text-white'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              {activeNav === 'contact' && (
                <motion.div
                  layoutId="homeNavIndicator"
                  className="absolute inset-0 bg-[#2E1065] rounded-full -z-10 shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeNav === 'contact' ? 'bg-purple-300 scale-100' : 'bg-slate-400 scale-75'
                }`}
              />
              <span>Contact</span>
            </button>
          </nav>

          {/* Top Right Controls (User Profile / Login) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Profile Avatar with Dropdown OR Login Button */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg bg-white/80 hover:bg-white border border-purple-200/80 text-slate-800 shadow-sm transition-colors cursor-pointer backdrop-blur-md"
                  title="Account Profile"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                    alt={user?.name || 'User'}
                    className="w-7 h-7 rounded-md object-cover border border-purple-200/60"
                  />
                  <span className="hidden sm:inline-block text-xs font-bold truncate max-w-[110px] text-slate-800">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-80 text-slate-600" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-none shadow-2xl z-50 py-2 divide-y divide-white/10 animate-in fade-in zoom-in-95 duration-150 text-white">
                    <div className="px-4 py-2">
                      <p className="text-xs font-bold text-white">{user?.name}</p>
                      <p className="text-[11px] text-slate-300 truncate">{user?.designation || user?.email}</p>
                      <span className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-200 border border-blue-400/30">
                        {user?.badge || 'Authorized'}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-200 hover:bg-white/10 transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Security & Profile</span>
                      </Link>
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-300 hover:bg-rose-500/20 transition-colors text-left font-medium cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-bold rounded-lg bg-white/80 hover:bg-white text-slate-800 border border-purple-200/80 shadow-sm transition inline-flex items-center gap-1.5 cursor-pointer backdrop-blur-md hover:shadow"
              >
                <span>Login</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple-700" />
              </Link>
            )}
          </div>
        </div>
      </header>
    </div>

      {/* 5. Hero Section with Morphing Center Title and Windows 7 Aero Glass styling */}
      <section className="relative pt-8 pb-8 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-5xl mx-auto space-y-6 relative z-10">
            {/* Dynamic Center Title with Indian Tricolor Flow that smoothly morphs toward top-left navbar on scroll */}
            <motion.div
              animate={
                isScrolled
                  ? {
                      opacity: 0,
                      y: -140,
                      x: -240,
                      scale: 0.45,
                      pointerEvents: 'none'
                    }
                  : {
                      opacity: 1,
                      y: 0,
                      x: 0,
                      scale: 1
                    }
              }
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <h1 
                className="text-xl sm:text-3xl lg:text-[2.85rem] font-archivo font-black tracking-normal leading-snug sm:leading-tight lg:leading-[1.18] text-[#2E1065]"
                style={{ fontFamily: "'Archivo', sans-serif" }}
              >
                Scheme Guard: From Local Priorities to <br className="hidden sm:inline" /> National Development
              </h1>
              <p className="text-xs sm:text-sm text-slate-700 font-semibold max-w-2xl mx-auto drop-shadow-xs">
                Algorithmic vigilance, real-time PFMS treasury tracking, and image forensics protecting public development assets across all 543 Lok Sabha Constituencies.
              </p>
            </motion.div>

            {/* Action Buttons in Frutiger Aero Glossy Skeuomorphic Style */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-2"
            >
              <button
                type="button"
                onClick={handleLaunchAdminDemo}
                className="frutiger-gloss-btn-primary px-7 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 active:scale-95 cursor-pointer shadow-lg"
              >
                <span>{isDistrictOfficer ? 'Launch District Command' : 'Launch MoSPI Central Command'}</span>
                <AeroplaneArrow className="w-4 h-4 text-white" />
              </button>

              {!(isAdmin || isDistrictOfficer) && (
                <button
                  type="button"
                  onClick={handleLaunchCitizenPortal}
                  className="frutiger-gloss-btn-glass px-7 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 active:scale-95 cursor-pointer shadow-md"
                >
                  <AnimatedEye className="w-4 h-4 text-sky-700" />
                  <span>Explore Public Portal</span>
                </button>
              )}
            </motion.div>
          </div>
        </section>

        {/* 6. Three Role-Aware Action Boxes in Solid White Theme - Inside Wavy Image Region */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20 pb-20 sm:pb-28">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {/* Box 1: Guidelines & Acts - Always Visible */}
            <motion.a
              href="#aboutus"
              onClick={(e) => {
                e.preventDefault();
                const elem = document.getElementById('aboutus');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
              whileHover={{ y: -5, transition: { duration: 0.25 } }}
              className="frutiger-gloss-card bg-white p-5 flex flex-col items-center text-center group cursor-pointer shadow-sm hover:shadow-lg"
            >
              <div className="w-14 h-14 rounded-full frutiger-bubble-icon text-sky-700 flex items-center justify-center shrink-0 mb-3 group-hover:scale-110 transition-transform">
                <AnimatedFileText className="w-6 h-6 text-sky-700" />
              </div>
              <span className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-sky-700 transition-colors">
                Guidelines & Acts
              </span>
              <span className="text-[11px] text-slate-600 font-medium mt-0.5">2023 Revised Protocol</span>
            </motion.a>

            {/* Box 2: Voice AI Assist - Always Visible */}
            <motion.button
              type="button"
              onClick={() => setIsVoiceModalOpen(true)}
              whileHover={{ y: -5, transition: { duration: 0.25 } }}
              className="frutiger-gloss-card bg-white p-5 flex flex-col items-center text-center group cursor-pointer shadow-sm hover:shadow-lg"
            >
              <div className="w-14 h-14 rounded-full frutiger-bubble-icon text-emerald-700 flex items-center justify-center shrink-0 mb-3 group-hover:scale-110 transition-transform">
                <AnimatedVoice className="w-6 h-6 text-emerald-700" />
              </div>
              <span className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                Voice AI Assist
              </span>
              <span className="text-[11px] text-slate-600 font-medium mt-0.5">8 Indic Languages</span>
            </motion.button>

            {/* Box 3 for Citizens: Citizen Request */}
            {!isOfficial && (
              <motion.button
                type="button"
                onClick={() => setIsCitizenModalOpen(true)}
                whileHover={{ y: -5, transition: { duration: 0.25 } }}
                className="frutiger-gloss-card bg-white p-5 flex flex-col items-center text-center group cursor-pointer shadow-sm hover:shadow-lg"
              >
                <div className="w-14 h-14 rounded-full frutiger-bubble-icon text-amber-700 flex items-center justify-center shrink-0 mb-3 group-hover:scale-110 transition-transform">
                  <AeroplaneSend className="w-6 h-6 text-amber-700" />
                </div>
                <span className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-amber-700 transition-colors">
                  Citizen Request
                </span>
                <span className="text-[11px] text-slate-600 font-medium mt-0.5">Local Area Proposal</span>
              </motion.button>
            )}

            {/* Box 3 for Admin & Officer: AI Audit Dossier */}
            {isOfficial && (
              <motion.div
                whileHover={{ y: -5, transition: { duration: 0.25 } }}
                className="h-full"
              >
                <Link
                  to="/project/MPLAD-2026-00124"
                  className="frutiger-gloss-card bg-white p-5 flex flex-col items-center text-center group h-full block shadow-sm hover:shadow-lg"
                >
                  <div className="w-14 h-14 rounded-full frutiger-bubble-icon text-rose-700 flex items-center justify-center shrink-0 mb-3 group-hover:scale-110 transition-transform">
                    <AnimatedAlertTriangle className="w-6 h-6 text-rose-600" />
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-rose-700 transition-colors">
                    AI Audit Dossier
                  </span>
                  <span className="text-[11px] text-slate-600 font-medium mt-0.5">Flagged NANDURBAR</span>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Main Content Area */}
      <div className="w-full relative z-10">

        {/* Live Institutional Continuous Right-to-Left Marquee Announcement Ticker */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-10">
          <div className="frutiger-gloss-card bg-white rounded-none p-3.5 flex items-center gap-3 overflow-hidden shadow-sm">
            <div className="px-3 py-1 bg-gradient-to-r from-purple-950 to-indigo-950 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl font-mono shrink-0 flex items-center gap-1.5 border border-purple-400/40 shadow-sm">
              <Activity className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
              <span>Live Surveillance</span>
            </div>
            <div className="flex-1 overflow-hidden relative">
              <div className="animate-marquee-smooth text-xs text-slate-800 font-medium">
                <span className="pr-12">
                  🔔 <strong className="text-slate-900 font-bold">MoSPI e-SAKSHI 2.0 Alert:</strong> Surveillance active across 543 Lok Sabha Constituencies • ₹83,336.67 Cr funds continuously monitored • Project MPLAD-2026-00124 (Nandurbar) flagged with 87% composite risk due to duplicate image detection • TSA/Hybrid ‘just-in-time’ fund disbursal protocol integrated with PFMS, RBI and SBI.
                </span>
                <span className="pr-12">
                  🔔 <strong className="text-slate-900 font-bold">MoSPI e-SAKSHI 2.0 Alert:</strong> Surveillance active across 543 Lok Sabha Constituencies • ₹83,336.67 Cr funds continuously monitored • Project MPLAD-2026-00124 (Nandurbar) flagged with 87% composite risk due to duplicate image detection • TSA/Hybrid ‘just-in-time’ fund disbursal protocol integrated with PFMS, RBI and SBI.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dual-Mode 6-Stat KPI Ribbon */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-12">
          <div className="frutiger-gloss-card bg-white rounded-none p-6 shadow-md space-y-5">
            
            {/* Header & Dual-Mode Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-[#2E1065]">
                    National Developmental Indicators & Fund Flow
                  </h2>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Live statistics of works recommended online by Hon'ble Members of Parliament under revised TSA fund procedure
                </p>
              </div>

              {/* Mode Switcher Buttons */}
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 self-stretch sm:self-auto justify-center">
                <button
                  type="button"
                  onClick={() => setKpiMode('statutory')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    kpiMode === 'statutory'
                      ? 'bg-white text-[#2E1065] shadow-sm font-black'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  Statutory e-SAKSHI View
                </button>
                <button
                  type="button"
                  onClick={() => setKpiMode('ai_vigilance')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    kpiMode === 'ai_vigilance'
                      ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-sm font-black'
                      : 'text-rose-700 hover:text-rose-900'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>AI Vigilance Layer</span>
                </button>
              </div>
            </div>

            {/* Sub-Tabs for Lok Sabha vs Rajya Sabha (Active in Statutory Mode) */}
            {kpiMode === 'statutory' && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveSabha('lok')}
                  className={`px-3.5 py-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    activeSabha === 'lok'
                      ? 'bg-gradient-to-b from-purple-900 to-[#2E1065] text-white border-transparent shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Lok Sabha (543 MPs)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSabha('rajya')}
                  className={`px-3.5 py-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    activeSabha === 'rajya'
                      ? 'bg-gradient-to-b from-purple-900 to-[#2E1065] text-white border-transparent shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Rajya Sabha (245 MPs)
                </button>
              </div>
            )}

            {/* KPI Cards Grid in Polished Solid White Cards */}
            {kpiMode === 'statutory' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-xs hover:shadow-md transition-all">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Entitlement (FY)</p>
                  <h3 className="text-xl font-black font-mono text-[#2E1065]">₹5.00 Cr</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Per MP / Year</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-xs hover:shadow-md transition-all">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">TSA Pooled Fund</p>
                  <h3 className="text-xl font-black font-mono text-[#2E1065]">₹{nationalKpis.totalFundsCr || '8,333.67'} Cr</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Active Allocations</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-xs hover:shadow-md transition-all">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Works Recommended</p>
                  <h3 className="text-xl font-black font-mono text-[#2E1065]">
                    {activeSabha === 'lok' ? '33,123' : '8,410'}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium">Digital Submissions</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-xs hover:shadow-md transition-all">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Works Sanctioned</p>
                  <h3 className="text-xl font-black font-mono text-[#2E1065]">
                    {activeSabha === 'lok' ? '28,450' : '6,920'}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium">Feasibility Passed</p>
                </div>
                <div className="p-4 bg-white border border-emerald-200 rounded-2xl space-y-1 shadow-xs hover:shadow-md transition-all">
                  <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Works Completed</p>
                  <h3 className="text-xl font-black font-mono text-emerald-900">
                    {activeSabha === 'lok' ? '21,200' : '5,140'}
                  </h3>
                  <p className="text-[10px] text-emerald-700 font-medium">Assets Built & Verified</p>
                </div>
                <div className="p-4 bg-white border border-blue-200 rounded-2xl space-y-1 shadow-xs hover:shadow-md transition-all">
                  <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Total Expenditure</p>
                  <h3 className="text-xl font-black font-mono text-blue-900">
                    {activeSabha === 'lok' ? '₹46,210 Cr' : '₹9,840 Cr'}
                  </h3>
                  <p className="text-[10px] text-blue-700 font-medium">PFMS Disbursals</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-4 bg-white border border-sky-200 rounded-2xl space-y-1 shadow-xs hover:shadow-md transition-all">
                  <p className="text-[10px] font-bold text-sky-800 uppercase tracking-wider">AI Monitored Works</p>
                  <h3 className="text-xl font-black font-mono text-sky-950">{nationalKpis.projectsMonitored || 8420}</h3>
                  <p className="text-[10px] text-sky-700 font-mono">100% Geotagged MBs</p>
                </div>
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1 shadow-xs hover:shadow-md transition-all">
                  <p className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">Anomalies Flagged</p>
                  <h3 className="text-xl font-black font-mono text-rose-950">{nationalKpis.anomaliesDetected || 142}</h3>
                  <p className="text-[10px] text-rose-700 font-mono">Continuous Watch</p>
                </div>
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1 shadow-xs hover:shadow-md transition-all">
                  <p className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">High-Risk Queue</p>
                  <h3 className="text-xl font-black font-mono text-rose-950">{nationalKpis.highRiskProjects || 38}</h3>
                  <p className="text-[10px] text-rose-700 font-mono">Composite &gt; 70</p>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1 shadow-xs hover:shadow-md transition-all">
                  <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Cartels Detected</p>
                  <h3 className="text-xl font-black font-mono text-amber-950">14 Rings</h3>
                  <p className="text-[10px] text-amber-700 font-mono">HHI Index &gt; 2500</p>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1 shadow-xs hover:shadow-md transition-all">
                  <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Duplicate Intercept</p>
                  <h3 className="text-xl font-black font-mono text-emerald-950">96.4%</h3>
                  <p className="text-[10px] text-emerald-700 font-mono">OpenCV 64-bit dHash</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-1 shadow-xs hover:shadow-md transition-all">
                  <p className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">Disbursals on Hold</p>
                  <h3 className="text-xl font-black font-mono text-purple-950">₹412.5 Cr</h3>
                  <p className="text-[10px] text-purple-700 font-mono">Milestone Holds</p>
                </div>
              </div>
            )}
          </div>
        </section>

      {/* 6. Methodology & Working Principle Section (Systemic Vulnerabilities + Algorithmic Vigilance) */}
      <section id="methodology" className="relative z-20 w-full bg-transparent pb-20 pt-8 mb-0 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-4xl mx-auto">
            <TypewriterHeading
              text="How It Works: Continuous Vigilance & Public Fund Safeguards"
              className="text-lg sm:text-2xl lg:text-[1.85rem] font-extrabold text-[#2E1065] tracking-tight leading-snug"
            />
          </div>

          {/* Part A: Systemic Vulnerabilities & Countermeasures Matrix */}
          <SystemicVulnerabilitiesFramework />

          {/* Part B: Three-Column Core Intelligence Engine */}
          <div className="pt-4">
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
      </div>

      {/* Institutional Boundary Divider Between Methodology and Statutory Overview */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 w-full">
        <div className="h-px bg-gradient-to-r from-transparent via-purple-300/60 to-transparent" />
      </div>

      {/* 7. Statutory "About the Scheme" Section (Verbatim e-SAKSHI Narrative) */}
      <section id="aboutus" className="relative z-20 w-full bg-transparent py-20 px-4 sm:px-6 lg:px-8 scroll-mt-32">
        <div className="max-w-6xl mx-auto space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Statutory Narrative */}
            <div className="lg:col-span-8 space-y-5 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 font-mono">
                  Statutory Overview
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-500">Ministry of Statistics & Programme Implementation</span>
              </div>

              <ScrollScalingHeading title="About Scheme Guard" />

              <p>
                <b>Scheme Guard (MPLADS Vigilance Framework)</b> is the AI-governed integrity and transparency layer for the Members of Parliament Local Area Development Scheme (MPLADS), a Central Sector Scheme fully funded by the Government of India, launched on 23 December 1993. The Scheme enables Members of Parliament (MPs) to recommend developmental works based on the locally felt needs of their constituencies, with a focus on creating durable community assets and improving essential public services such as health, sanitation, education, and drinking water infrastructure.
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

              <div className="p-4 bg-white border border-purple-200 rounded-none flex items-center gap-3.5 shadow-sm">
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