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
  User,
  Clock,
  Camera
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
import { PentagonCard } from '../../components/common/PentagonCard';
import { CurvedSquareCard } from '../../components/common/CurvedSquareCard';
import {
  ConnectorLine1,
  ConnectorLine2,
  ConnectorLine3
} from '../../components/common/ConnectingTrailLine';
import { BidirectionalReveal, useScrollReveal } from '../../hooks/useScrollReveal';
import { AboutBackgroundTransition } from '../../components/common/AboutBackgroundTransition';
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
  const [scrollY, setScrollY] = useState(0);
  const [currentZoom, setCurrentZoom] = useState(1);

  // Sequential pipeline states:
  // 1. Live Surveillance appears first -> then Line 1 originates
  // 2. Pointer reaches destination first -> then next container appears
  const [liveSurveillanceAppeared, setLiveSurveillanceAppeared] = useState(false);
  const [line1Reached, setLine1Reached] = useState(false);
  const [indicatorsAppeared, setIndicatorsAppeared] = useState(false);
  const [line2Reached, setLine2Reached] = useState(false);
  const [howItWorksAppeared, setHowItWorksAppeared] = useState(false);
  const [line3Reached, setLine3Reached] = useState(false);

  // Masthead pin and theme transitions:
  // Pin when utility bar scrolls out; switch to white theme and enlarge divider when screen turns white
  const isPinned = scrollY > 40;
  const isScreenWhite = scrollY > 160;
  const isScrolled = isScreenWhite;

  // Scroll listener: handle both scroll-spy and header merge / title shrink
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

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

  // Dynamic scroll progress for hero white shade expansion:
  const heroScrollProgress = Math.min(1, Math.max(0, scrollY / 440));

  // Base linear gradient stops shift upward as user scrolls, shrinking the dark pitch purple band at the top
  const darkShift = Math.round(-heroScrollProgress * 85);
  const baseLinearBg = `linear-gradient(180deg, #06010F ${darkShift}%, #0D0322 ${darkShift + 25}%, #180538 ${darkShift + 50}%, #290858 ${darkShift + 75}%, #3B0D7D 100%)`;

  // Concentrated radiant glow: lighter shade focused intensely on the middle of the bottom
  // Initial rx is ~48% (focused on the middle, leaving left & right bottom corners dark)
  // During scrolling, it expands upward and outward across the screen
  const yCenter = 100 - heroScrollProgress * 45; // 100% -> 55%
  const rx = 48 + heroScrollProgress * 205;      // 48% -> 253%
  const ry = 56 + heroScrollProgress * 155;      // 56% -> 211%

  const whiteCore = Math.min(100, Math.round(6 + heroScrollProgress * 45));
  const lavenderStop = Math.min(100, Math.round(20 + heroScrollProgress * 46));
  const softPurpleStop = Math.min(100, Math.round(38 + heroScrollProgress * 42));
  const midPurpleStop = Math.min(100, Math.round(60 + heroScrollProgress * 30));
  const outerTransp = Math.min(100, Math.round(80 + heroScrollProgress * 20));

  let expandingGlowBg;
  if (heroScrollProgress >= 1.0) {
    expandingGlowBg = '#ffffff';
  } else if (heroScrollProgress > 0.75) {
    const whiteTakeover = (heroScrollProgress - 0.75) / 0.25;
    const wPercent = Math.round(whiteCore + whiteTakeover * (100 - whiteCore));
    expandingGlowBg = `radial-gradient(ellipse ${rx}% ${ry}% at 50% ${yCenter}%, #ffffff 0%, #ffffff ${wPercent}%, #f3e8ff ${Math.min(100, lavenderStop + 15)}%, rgba(216, 180, 254, ${1 - whiteTakeover}) 100%)`;
  } else {
    expandingGlowBg = `radial-gradient(ellipse ${rx}% ${ry}% at 50% ${yCenter}%, #ffffff 0%, #ffffff ${whiteCore}%, #f3e8ff ${lavenderStop}%, #d8b4fe ${softPurpleStop}%, rgba(147, 51, 234, ${0.45 * (1 - heroScrollProgress * 0.5)}) ${midPurpleStop}%, transparent ${outerTransp}%)`;
  }

  return (
    <div className="min-h-screen relative text-slate-800 selection:bg-purple-600 selection:text-white flex flex-col font-sans overflow-x-clip bg-white">
      {/* Official Government Top Utility Bar */}
      <div className="relative z-50">
        <TopUtilityBar sticky={false} onOpenVoiceModal={() => setIsVoiceModalOpen(true)} />
      </div>

      {/* Hero & Navbar Zone: Dark Pitch Purple with Bottom-Middle Luminous Glow & Capillary Ripples */}
      <div
        className="relative w-full overflow-hidden flex flex-col justify-between"
        style={{
          minHeight: '94vh',
          backgroundColor: heroScrollProgress >= 1.0 ? '#ffffff' : '#070212'
        }}
      >
        {/* Base Atmospheric Linear Gradient: Pitch Dark Purple down to Deep Violet */}
        <div
          className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-150"
          style={{
            background: baseLinearBg,
            opacity: heroScrollProgress >= 1.0 ? 0 : 1
          }}
        />

        {/* Radiant Bottom-Middle Luminous Glow: White shade becomes bigger & moves upward on scroll */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: expandingGlowBg
          }}
        />

        {/* Capillary Waves / Circular Ripples Originating from Bottom-Middle */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-0 h-0 pointer-events-none z-0"
          style={{ opacity: Math.max(0, 1 - heroScrollProgress * 2.5) }}
        >
          {[0, 3.5, 7, 10.5].map((delay, idx) => (
            <div
              key={idx}
              className="capillary-ripple-ring"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>

        {/* Official Masthead / Navbar */}
        <div className="w-full h-20 relative z-40">
          <header
            className={`transition-colors duration-300 w-full z-40 ${
              isPinned
                ? isScreenWhite
                  ? 'fixed top-0 left-0 right-0 bg-white text-slate-800 shadow-none'
                  : 'fixed top-0 left-0 right-0 bg-transparent text-white'
                : 'relative bg-transparent text-white'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
              {/* Top-Left Brand Slot: "Scheme Guard" with logo */}
              <div className="flex items-center gap-3.5 relative min-w-[120px] sm:min-w-[260px]">
                <div className="flex items-center gap-3 transition-colors duration-200">
                  {/* Ashoka Lion / Shield Emblem */}
                  <div className="w-10 h-10 rounded-xl bg-[#2E1065] p-1 flex flex-col items-center justify-center text-white shrink-0 border border-purple-300/30 shadow-xs">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    <span className="text-[7px] font-bold tracking-tighter uppercase font-mono text-white">MoSPI</span>
                  </div>

                  <div className="leading-tight">
                    <div className="flex items-center gap-2">
                      <span className={`font-black text-base sm:text-lg tracking-tight ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                        Scheme Guard
                      </span>
                    </div>
                    <p className={`text-[10px] font-medium tracking-wide ${isScrolled ? 'text-slate-500' : 'text-purple-200/80'}`}>
                      MoSPI • Govt. of India
                    </p>
                  </div>
                </div>
              </div>

              {/* Top-Right Navbar Text Links: "Home", "Methodology", "About", "Contact" */}
              <nav className="hidden lg:flex items-center gap-7 sm:gap-9 text-sm font-medium">
                {[
                  {
                    id: 'home',
                    label: 'Home',
                    action: () => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setActiveNav('home');
                    }
                  },
                  {
                    id: 'methodology',
                    label: 'Methodology',
                    action: () => scrollToSection('methodology', 'methodology')
                  },
                  {
                    id: 'about',
                    label: 'About',
                    action: () => scrollToSection('aboutus', 'about')
                  },
                  {
                    id: 'contact',
                    label: 'Contact',
                    action: () => scrollToSection('contact', 'contact')
                  }
                ].map((item) => {
                  const isActive = activeNav === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={item.action}
                      className={`relative py-1 cursor-pointer transition-all duration-200 select-none ${
                        isActive
                          ? 'scale-105 font-bold'
                          : 'opacity-80 hover:opacity-100 hover:scale-102'
                      } ${
                        isScrolled
                          ? isActive
                            ? 'text-[#2E1065]'
                            : 'text-slate-700 hover:text-slate-950'
                          : isActive
                          ? 'text-white'
                          : 'text-purple-100/80 hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeNavUnderline"
                          className={`absolute -bottom-1.5 left-0 right-0 h-[2.5px] rounded-full ${
                            isScrolled ? 'bg-[#2E1065]' : 'bg-purple-300'
                          }`}
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Top Right Controls (User Profile / Login Button) */}
              <div className="flex items-center gap-2 sm:gap-3">
                {user ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className={`flex items-center gap-2 p-1.5 rounded-xl border transition-colors cursor-pointer backdrop-blur-md ${
                        isScrolled
                          ? 'bg-white/80 hover:bg-white border-purple-200/80 text-slate-800 shadow-sm'
                          : 'bg-white/10 hover:bg-white/20 border-white/25 text-white shadow-sm'
                      }`}
                      title="Account Profile"
                    >
                      <img
                        src={
                          user?.avatar ||
                          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
                        }
                        alt={user?.name || 'User'}
                        className="w-7 h-7 rounded-lg object-cover border border-purple-200/60"
                      />
                      <span className="hidden sm:inline-block text-xs font-bold truncate max-w-[110px]">
                        {user?.name?.split(' ')[0]}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                    </button>

                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50 py-2 divide-y divide-white/10 animate-in fade-in zoom-in-95 duration-150 text-white">
                        <div className="px-4 py-2">
                          <p className="text-xs font-bold text-white">{user?.name}</p>
                          <p className="text-[11px] text-slate-300 truncate">
                            {user?.designation || user?.email}
                          </p>
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
                    className={`px-4 py-2 text-xs font-bold rounded-xl border transition inline-flex items-center gap-1.5 cursor-pointer shadow-sm ${
                      isScrolled
                        ? 'bg-[#2E1065] hover:bg-[#1E1B4B] text-white border-transparent'
                        : 'bg-white/10 hover:bg-white/20 text-white border-white/25 backdrop-blur-md'
                    }`}
                  >
                    <span>Login</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>

            {/* Thin dark purple separation line: ends at points marked with blue marker, enlarges from center as screen becomes white */}
            <div className="w-full absolute bottom-0 left-0 right-0 pointer-events-none flex justify-center">
              <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8">
                <motion.div
                  className="h-[2px] bg-[#2E1065] w-full origin-center rounded-full"
                  style={{ transformOrigin: 'center' }}
                  initial={false}
                  animate={{
                    scaleX: isScreenWhite ? 1 : 0,
                    opacity: isScreenWhite ? 1 : 0
                  }}
                  transition={{
                    scaleX: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.3, ease: 'easeOut' }
                  }}
                />
              </div>
            </div>
          </header>
        </div>

        {/* Main Hero Center Content: Disappears slowly vanishing into the whiteness of the screen on scroll */}
        <div
          className="relative z-20 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 flex flex-col items-center justify-center flex-1 my-auto transition-transform"
          style={{
            opacity: Math.max(0, 1 - heroScrollProgress * 1.55),
            transform: `translateY(-${heroScrollProgress * 36}px)`,
            pointerEvents: heroScrollProgress > 0.65 ? 'none' : 'auto'
          }}
        >
          {/* Centered Main Title */}
          <h1
            className="text-2xl sm:text-4xl lg:text-[3.25rem] font-archivo font-black tracking-normal leading-snug sm:leading-tight lg:leading-[1.18] text-white drop-shadow-md"
            style={{ fontFamily: "'Archivo', sans-serif" }}
          >
            Scheme Guard: From Local Priorities to <br className="hidden sm:inline" /> National Development
          </h1>

          {/* Little Description right below it */}
          <p className="text-xs sm:text-base text-purple-100/90 font-medium max-w-2xl mx-auto mt-4 drop-shadow-xs leading-relaxed">
            Algorithmic vigilance, real-time PFMS treasury tracking, and image forensics protecting public development assets across all 543 Lok Sabha Constituencies.
          </p>

          {/* Role-Aware Command Button right below description */}
          <div className="pt-6">
            <button
              type="button"
              onClick={isOfficial ? handleLaunchAdminDemo : handleLaunchCitizenPortal}
              className="px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-white text-[#2E1065] hover:bg-purple-50 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 mx-auto cursor-pointer"
            >
              <span>
                {isDistrictOfficer
                  ? 'Launch District Command'
                  : isAdmin
                  ? 'Launch MoSPI Central Command'
                  : 'Explore Public Portal'}
              </span>
              <ArrowRight className="w-4 h-4 text-[#2E1065]" />
            </button>
          </div>

          {/* Three Circular Buttons right below command button */}
          <div className="pt-8 flex items-center justify-center gap-5 sm:gap-8">
            {/* Circular Button 1: Guidelines & Acts */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  const elem = document.getElementById('aboutus');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group rounded-full bg-white shadow-lg border border-purple-200/80 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 w-14 h-14 hover:w-36 hover:h-36 hover:shadow-2xl hover:border-purple-300 p-2 z-10 hover:z-30 text-center"
                title="Guidelines & Acts"
              >
                <AnimatedFileText className="w-6 h-6 text-[#2E1065] shrink-0 transition-transform group-hover:scale-110 group-hover:mb-1" />
                <span className="opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-16 transition-all duration-300 font-bold text-xs text-slate-900 leading-tight px-1 line-clamp-2">
                  Guidelines & Acts
                </span>
                <span className="opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-6 transition-all duration-300 text-[10px] text-purple-700 font-semibold">
                  2023 Protocol
                </span>
              </button>
            </div>

            {/* Circular Button 2: Voice AI Assistant */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <button
                type="button"
                onClick={() => setIsVoiceModalOpen(true)}
                className="group rounded-full bg-white shadow-lg border border-purple-200/80 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 w-14 h-14 hover:w-36 hover:h-36 hover:shadow-2xl hover:border-purple-300 p-2 z-10 hover:z-30 text-center"
                title="Voice AI Assistant"
              >
                <AnimatedVoice className="w-6 h-6 text-[#2E1065] shrink-0 transition-transform group-hover:scale-110 group-hover:mb-1" />
                <span className="opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-16 transition-all duration-300 font-bold text-xs text-slate-900 leading-tight px-1 line-clamp-2">
                  Voice AI Assistant
                </span>
                <span className="opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-6 transition-all duration-300 text-[10px] text-purple-700 font-semibold">
                  8 Indic Languages
                </span>
              </button>
            </div>

            {/* Circular Button 3: AI Audit Dossier (officials) or Citizen Request (citizens) */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              {isOfficial ? (
                <Link
                  to="/project/MPLAD-2026-00124"
                  className="group rounded-full bg-white shadow-lg border border-purple-200/80 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 w-14 h-14 hover:w-36 hover:h-36 hover:shadow-2xl hover:border-purple-300 p-2 z-10 hover:z-30 text-center"
                  title="AI Audit Dossier"
                >
                  <AnimatedAlertTriangle className="w-6 h-6 text-[#2E1065] shrink-0 transition-transform group-hover:scale-110 group-hover:mb-1" />
                  <span className="opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-16 transition-all duration-300 font-bold text-xs text-slate-900 leading-tight px-1 line-clamp-2">
                    AI Audit Dossier
                  </span>
                  <span className="opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-6 transition-all duration-300 text-[10px] text-purple-700 font-semibold">
                    Flagged Works
                  </span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsCitizenModalOpen(true)}
                  className="group rounded-full bg-white shadow-lg border border-purple-200/80 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 w-14 h-14 hover:w-36 hover:h-36 hover:shadow-2xl hover:border-purple-300 p-2 z-10 hover:z-30 text-center"
                  title="Citizen Request"
                >
                  <AeroplaneSend className="w-6 h-6 text-[#2E1065] shrink-0 transition-transform group-hover:scale-110 group-hover:mb-1" />
                  <span className="opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-16 transition-all duration-300 font-bold text-xs text-slate-900 leading-tight px-1 line-clamp-2">
                    Citizen Request
                  </span>
                  <span className="opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-6 transition-all duration-300 text-[10px] text-purple-700 font-semibold">
                    Area Proposal
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Main Content Area */}
      <div className="w-full relative z-10 py-6">

        {/* Live Institutional Continuous Right-to-Left Marquee Announcement Ticker */}
        <BidirectionalReveal
          distance={150}
          offset={0}
          enabled={true}
          onAppeared={setLiveSurveillanceAppeared}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-0"
        >
          <div className="relative bg-white/95 backdrop-blur-md rounded-lg border-[3px] border-[#2E1065] p-3 flex items-center gap-3 shadow-md">
            {/* Outward Capillary Ripple Waves */}
            <div className="surveillance-ripple-ring" style={{ animationDelay: '0s' }} />
            <div className="surveillance-ripple-ring" style={{ animationDelay: '1.5s' }} />

            <div className="relative z-10 px-3.5 py-1.5 bg-gradient-to-r from-purple-950 to-indigo-950 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg font-mono shrink-0 flex items-center gap-1.5 border border-purple-400/40 shadow-sm">
              <Activity className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
              <span>Live Surveillance</span>
            </div>
            <div className="relative z-10 flex-1 overflow-hidden">
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
        </BidirectionalReveal>

        {/* Trail Connector 1: Live Surveillance -> National Indicators */}
        <ConnectorLine1
          canStart={liveSurveillanceAppeared}
          onDestinationReached={setLine1Reached}
        />

        {/* Dual-Mode 6-Stat KPI Ribbon & Development Video side-by-side */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column (7 cols / ~58%): National Developmental Indicators & Fund Flow */}
            <BidirectionalReveal
              distance={180}
              offset={0}
              enabled={line1Reached}
              onAppeared={setIndicatorsAppeared}
              className="lg:col-span-7 bg-white/95 rounded-2xl border-[3px] border-[#2E1065] p-4 sm:p-5 shadow-md flex flex-col justify-between space-y-3"
            >
              {/* Header & Dual-Mode Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-100 pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-black text-[#2E1065]">
                      National Developmental Indicators & Fund Flow
                    </h2>
                  </div>
                  <p className="text-[10.5px] text-slate-500 font-medium mt-0.5">
                    Live statistics of works recommended online by Hon'ble MPs under revised TSA fund procedure
                  </p>
                </div>

                {/* Mode Switcher Buttons */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200 self-stretch sm:self-auto justify-center shrink-0">
                  <button
                    type="button"
                    onClick={() => setKpiMode('statutory')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      kpiMode === 'statutory'
                        ? 'bg-white text-[#2E1065] shadow-xs font-black'
                        : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    Statutory View
                  </button>
                  <button
                    type="button"
                    onClick={() => setKpiMode('ai_vigilance')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      kpiMode === 'ai_vigilance'
                        ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-xs font-black'
                        : 'text-rose-700 hover:text-rose-900'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>AI Vigilance</span>
                  </button>
                </div>
              </div>

              {/* Sub-Tabs for Lok Sabha vs Rajya Sabha (Statutory Mode) */}
              {kpiMode === 'statutory' && (
                <div className="flex items-center gap-2 -mt-1">
                  <button
                    type="button"
                    onClick={() => setActiveSabha('lok')}
                    className={`px-3 py-0.5 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${
                      activeSabha === 'lok'
                        ? 'bg-gradient-to-b from-purple-900 to-[#2E1065] text-white border-transparent shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Lok Sabha (543 MPs)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSabha('rajya')}
                    className={`px-3 py-0.5 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${
                      activeSabha === 'rajya'
                        ? 'bg-gradient-to-b from-purple-900 to-[#2E1065] text-white border-transparent shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Rajya Sabha (245 MPs)
                  </button>
                </div>
              )}

              {/* 3 columns × 2 rows of Compact CurvedSquareCard (with upward blur reveal) */}
              <div
                key={kpiMode + (kpiMode === 'statutory' ? activeSabha : '')}
                className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5"
              >
                {kpiMode === 'statutory' ? (
                  <>
                    <CurvedSquareCard
                      index={0}
                      title="Entitlement (FY)"
                      value="₹5.00 Cr"
                      subtitle="Per MP / Year"
                      variant="purple"
                      borderColor="#7e22ce"
                    />
                    <CurvedSquareCard
                      index={1}
                      title="TSA Pooled Fund"
                      value={`₹${nationalKpis.totalFundsCr || '8,333.67'} Cr`}
                      subtitle="Active Allocations"
                      variant="blue"
                      borderColor="#6b21a8"
                    />
                    <CurvedSquareCard
                      index={2}
                      title="Works Recommended"
                      value={activeSabha === 'lok' ? '33,123' : '8,410'}
                      subtitle="Digital Submissions"
                      variant="default"
                      borderColor="#94a3b8"
                    />
                    <CurvedSquareCard
                      index={3}
                      title="Works Sanctioned"
                      value={activeSabha === 'lok' ? '28,450' : '6,920'}
                      subtitle="Feasibility Passed"
                      variant="purple"
                      borderColor="#7e22ce"
                    />
                    <CurvedSquareCard
                      index={4}
                      title="Works Completed"
                      value={activeSabha === 'lok' ? '21,200' : '5,140'}
                      subtitle="Assets Built & Verified"
                      variant="success"
                      borderColor="#059669"
                    />
                    <CurvedSquareCard
                      index={5}
                      title="Total Expenditure"
                      value={activeSabha === 'lok' ? '₹46,210 Cr' : '₹9,840 Cr'}
                      subtitle="PFMS Disbursals"
                      variant="warning"
                      borderColor="#d97706"
                    />
                  </>
                ) : (
                  <>
                    <CurvedSquareCard
                      index={0}
                      title="AI Monitored Works"
                      value={String(nationalKpis.projectsMonitored || 8420)}
                      subtitle="100% Geotagged MBs"
                      variant="blue"
                      borderColor="#0284c7"
                    />
                    <CurvedSquareCard
                      index={1}
                      title="Anomalies Flagged"
                      value={String(nationalKpis.anomaliesDetected || 142)}
                      subtitle="Continuous Watch"
                      variant="danger"
                      borderColor="#e11d48"
                    />
                    <CurvedSquareCard
                      index={2}
                      title="High-Risk Queue"
                      value={String(nationalKpis.highRiskProjects || 38)}
                      subtitle="Composite > 70"
                      variant="danger"
                      borderColor="#dc2626"
                    />
                    <CurvedSquareCard
                      index={3}
                      title="Cartels Detected"
                      value="14 Rings"
                      subtitle="HHI Index > 2500"
                      variant="warning"
                      borderColor="#d97706"
                    />
                    <CurvedSquareCard
                      index={4}
                      title="Duplicate Intercept"
                      value="96.4%"
                      subtitle="OpenCV 64-bit dHash"
                      variant="success"
                      borderColor="#059669"
                    />
                    <CurvedSquareCard
                      index={5}
                      title="Disbursals on Hold"
                      value="₹412.5 Cr"
                      subtitle="Milestone Holds"
                      variant="purple"
                      borderColor="#9333ea"
                    />
                  </>
                )}
              </div>
            </BidirectionalReveal>

            {/* Right Column (5 cols / ~42%): Video in its Original Shape (no border, no container box) */}
            <BidirectionalReveal
              distance={180}
              offset={0}
              delay={0.06}
              enabled={line1Reached}
              className="lg:col-span-5 flex items-center justify-center self-center"
            >
              <video
                ref={(video) => {
                  if (video) {
                    video.defaultMuted = true;
                    video.muted = true;
                    video.play().catch(() => {});
                    const resumeOnAction = () => {
                      if (video.paused) {
                        video.play().catch(() => {});
                      }
                    };
                    window.addEventListener('scroll', resumeOnAction, { once: true, passive: true });
                    window.addEventListener('click', resumeOnAction, { once: true, passive: true });
                    window.addEventListener('touchstart', resumeOnAction, { once: true, passive: true });
                  }
                }}
                src="/Development_illus_video.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-auto max-w-full"
              />
            </BidirectionalReveal>
          </div>
        </section>

        {/* Trail Connector 2: National Indicators bottom-left -> How it Works? top-center */}
        <ConnectorLine2
          canStart={indicatorsAppeared}
          onDestinationReached={setLine2Reached}
        />

        {/* 5. How it Works? Section (Matrix Container) */}
        <section id="methodology" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-24">
          <SystemicVulnerabilitiesFramework
            canAppear={line2Reached}
            onAppeared={setHowItWorksAppeared}
          />
        </section>

        {/* Trail Connector 3: Line starting directly from "How it Works?" and splitting into three to connect to the three boxes */}
        <ConnectorLine3
          canStart={howItWorksAppeared}
          onDestinationReached={setLine3Reached}
        />

        {/* 6. Three-Column Sentinel Pillars */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-12">
          <ThreeColumnArchitecture
            canAppear={line3Reached}
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

      </div>

      {/* Institutional Boundary Divider Between Methodology and Statutory Overview */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16 sm:my-20 w-full">
        <div className="h-px bg-gradient-to-r from-transparent via-purple-300/60 to-transparent" />
      </div>

      {/* 7. Statutory "About the Scheme" Section (Verbatim e-SAKSHI Narrative) */}
      <section id="aboutus" className="relative z-20 w-full bg-transparent py-24 sm:py-32 scroll-mt-32 overflow-hidden">
        {/* Moving Transition Background with 6 Parliament Images & Symmetrical Full-Bleed Coverage */}
        <AboutBackgroundTransition opacity={0.68} interval={5200} />

        <BidirectionalReveal distance={260} offset={0} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left: Statutory Narrative */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-white/85 backdrop-blur-md border border-purple-200/70 shadow-lg flex flex-col justify-between space-y-5 text-xs sm:text-sm text-slate-800 leading-relaxed">
              <div className="space-y-5">
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
              </div>

              <div className="p-4 bg-white border border-purple-200 rounded-xl flex items-center gap-3.5 shadow-sm">
                <Award className="w-7 h-7 text-amber-600 shrink-0" />
                <p className="text-xs text-slate-700">
                  <strong>Viksit Bharat @ 2047 Alignment: </strong>
                  The Scheme encourages MPs to prioritize future-ready, green, and sustainable infrastructure that supports grassroots social equity and self-reliance.
                </p>
              </div>
            </div>

            {/* Right: Symmetrical Column with Prime Minister's E-Governance Quote & Statutory Oversight Pillars */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              <TiltQuoteCard />

              {/* Matching Institutional Architecture Card to Balance Column Symmetry */}
              <div className="flex-1 p-6 sm:p-7 rounded-2xl bg-white/85 backdrop-blur-md border border-purple-200/70 shadow-lg flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-900 font-mono">
                      Statutory Governance Architecture
                    </span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-800 rounded-md font-mono">
                    e-SAKSHI 2.0
                  </span>
                </div>

                <div className="space-y-3.5 text-xs text-slate-700">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p>
                      <strong className="text-slate-900">Direct TSA Fund Routing:</strong> Vendor-level ‘just-in-time’ settlement via PFMS, Reserve Bank of India & SBI network.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p>
                      <strong className="text-slate-900">543 Lok Sabha + 245 Rajya Sabha Seats:</strong> Universal digital recommendation, district sanction & live citizen audit.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p>
                      <strong className="text-slate-900">AI Forensic Verification:</strong> Automated duplicate photo detection, EXIF GPS validation & fund drift monitoring.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-purple-100 flex items-center justify-between text-[11px] font-semibold text-slate-600">
                  <span>Annual Entitlement: <strong className="text-purple-900">₹5.00 Cr / MP</strong></span>
                  <span className="text-emerald-700 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    100% Digital Trail
                  </span>
                </div>
              </div>
            </div>
          </div>

        </BidirectionalReveal>
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