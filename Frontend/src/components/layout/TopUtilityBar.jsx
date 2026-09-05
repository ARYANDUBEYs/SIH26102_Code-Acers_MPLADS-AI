import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Volume2 } from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';

const dropdownVariants = {
  hidden: { opacity: 0, scaleY: 0.85, originY: 0, y: -4 },
  visible: {
    opacity: 1,
    scaleY: 1,
    y: 0,
    transition: {
      duration: 0.18,
      ease: [0.16, 1, 0.3, 1],
      when: 'beforeChildren',
      staggerChildren: 0.03
    }
  },
  exit: {
    opacity: 0,
    scaleY: 0.9,
    y: -4,
    transition: { duration: 0.12, ease: 'easeInOut' }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.15 } },
  exit: { opacity: 0, x: -6 }
};

export const TopUtilityBar = ({ onOpenVoiceModal }) => {
  const { currentLanguage, setLanguage } = useLanguage();
  const { activeGlobalDropdown, toggleDropdown, closeDropdowns } = useApp();
  const location = useLocation();
  const [fontSizeLevel, setFontSizeLevel] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(false);

  // Trigger tricolor loading shimmer on every route change
  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 850);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const handleFontSizeChange = (delta) => {
    let newLevel = delta === 0 ? 0 : Math.max(-1, Math.min(2, fontSizeLevel + delta));
    setFontSizeLevel(newLevel);
    if (newLevel === -1) {
      document.documentElement.style.fontSize = '14px';
    } else if (newLevel === 0) {
      document.documentElement.style.fontSize = '16px';
    } else if (newLevel === 1) {
      document.documentElement.style.fontSize = '18px';
    } else if (newLevel === 2) {
      document.documentElement.style.fontSize = '20px';
    }
  };

  const isLangOpen = activeGlobalDropdown === 'topLang';

  return (
    <div className="w-full bg-[#07172B] text-slate-200 border-b border-slate-800 text-[11px] select-none sticky top-0 z-50">
      {/* National Tricolor Top Strip with Route Loading State */}
      <div
        className={`h-[3.5px] w-full transition-all duration-300 ${
          isPageLoading
            ? 'animate-tricolor-loading shadow-[0_0_12px_rgba(56,189,248,0.7)]'
            : 'bg-gradient-to-r from-[#FF9933] via-white to-[#138808]'
        }`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between gap-2">
        {/* Left: Government of India / MoSPI identity */}
        <div className="flex items-center gap-3 truncate">
          <span className="font-semibold text-slate-300 hidden sm:inline">
            भारत सरकार • Government of India
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-blue-300 font-medium truncate">
            सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)
          </span>
        </div>

        {/* Right: Accessibility Controls & Sovereign Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Voice Briefing & Vernacular Reader Modal Trigger */}
          {onOpenVoiceModal && (
            <button
              type="button"
              onClick={onOpenVoiceModal}
              className="flex items-center gap-1.5 text-cyan-300 hover:text-cyan-200 bg-cyan-950/50 border border-cyan-700/60 hover:border-cyan-400 transition-all cursor-pointer px-2 py-0.5 rounded shadow-xs"
              title="Vernacular Voice Briefing & Reader (Sarvam Indic Audio)"
            >
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono text-[10px] font-bold">Indic Voice</span>
            </button>
          )}

          {/* Font Resizer Buttons (A- | A | A+) */}
          <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
            <button
              type="button"
              onClick={() => handleFontSizeChange(-1)}
              className={`px-1 font-bold transition-colors ${fontSizeLevel === -1 ? 'text-blue-400 font-black' : 'text-slate-400 hover:text-white'}`}
              title="Decrease Font Size"
              aria-label="Decrease Font Size"
            >
              A-
            </button>
            <span className="text-slate-700">|</span>
            <button
              type="button"
              onClick={() => handleFontSizeChange(0)}
              className={`px-1 font-bold transition-colors ${fontSizeLevel === 0 ? 'text-blue-400 font-black' : 'text-slate-400 hover:text-white'}`}
              title="Default Font Size"
              aria-label="Default Font Size"
            >
              A
            </button>
            <span className="text-slate-700">|</span>
            <button
              type="button"
              onClick={() => handleFontSizeChange(1)}
              className={`px-1 font-bold transition-colors ${fontSizeLevel > 0 ? 'text-blue-400 font-black' : 'text-slate-400 hover:text-white'}`}
              title="Increase Font Size"
              aria-label="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* Global Sovereign Indic Language Selector */}
          <div className="relative">
            <button
              type="button"
              data-dropdown-trigger="topLang"
              onClick={() => toggleDropdown('topLang')}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-all font-semibold cursor-pointer ${
                isLangOpen
                  ? 'bg-blue-900/80 text-white border border-blue-400'
                  : 'bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200'
              }`}
              title="Select Sovereign Indic Language"
            >
              <Globe className="w-3 h-3 text-emerald-400" />
              <span className="font-mono text-[10px]">{currentLangObj.flag} {currentLangObj.native}</span>
              <ChevronDown className={`w-2.5 h-2.5 text-slate-400 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  data-dropdown-menu="topLang"
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-1 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xl z-50 py-1 divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto text-slate-800 dark:text-slate-200 origin-top"
                >
                  <div className="px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60">
                    Sovereign Indic Languages (8)
                  </div>
                  <div className="py-0.5">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <motion.div key={lang.code} variants={itemVariants}>
                        <button
                          onClick={() => {
                            setLanguage(lang.code);
                            closeDropdowns();
                          }}
                          className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer ${
                            currentLanguage === lang.code ? 'font-bold text-blue-700 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40' : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.native}</span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{lang.name}</span>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};