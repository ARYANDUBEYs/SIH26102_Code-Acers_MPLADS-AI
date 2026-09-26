import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Search,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  ExternalLink,
  Globe,
  Home,
  PanelLeft,
  PanelLeftClose
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../context/LanguageContext';
import { NotificationDropdown } from './NotificationDropdown';
import { SarvamIndicModal } from '../sarvam/SarvamIndicModal';
import { TopUtilityBar } from './TopUtilityBar';
import { ROLES } from '../../utils/constants';
import { cn } from '../../utils/helpers';

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
      staggerChildren: 0.04
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

export const Navbar = () => {
  const { user, role, logout } = useAuth();
  const {
    unreadCount,
    setIsSearchOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isSidebarOpen,
    toggleSidebar,
    activeGlobalDropdown,
    toggleDropdown,
    closeDropdowns
  } = useApp();
  const { currentLanguage, setLanguage, t } = useLanguage();

  const [isIndicModalOpen, setIsIndicModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-40 w-full">
      <TopUtilityBar onOpenVoiceModal={() => setIsIndicModalOpen(true)} />
      <header className="w-full bg-gov-navy border-b border-gov-navyDark shadow-md">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-6">
          <div className="flex items-center justify-between h-14 gap-4">
            
            {/* Brand / Logo + Gemini Sidebar Toggle */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Gemini-Style Sidebar Collapse/Expand Button */}
              <button
                type="button"
                onClick={toggleSidebar}
                className={cn(
                  "p-2 rounded-lg transition-all duration-150 cursor-pointer flex items-center justify-center shrink-0 group",
                  "text-slate-300 hover:text-white hover:bg-white/10 active:bg-white/15 focus:outline-none focus:ring-1 focus:ring-purple-400"
                )}
                title={
                  typeof window !== 'undefined' && window.innerWidth < 1024
                    ? (isMobileMenuOpen ? "Close menu" : "Open menu")
                    : (isSidebarOpen ? "Close sidebar (Ctrl+B)" : "Open sidebar (Ctrl+B)")
                }
                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                {/* Mobile View Toggle */}
                <span className="lg:hidden flex items-center justify-center">
                  {isMobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-slate-200" />}
                </span>
                {/* Desktop View Toggle (Gemini Panel Icon) */}
                <span className="hidden lg:inline-flex items-center justify-center">
                  {isSidebarOpen ? (
                    <PanelLeftClose className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                  ) : (
                    <PanelLeft className="w-5 h-5 text-purple-300 group-hover:text-white transition-colors" />
                  )}
                </span>
              </button>

              <Link to="/" className="flex items-center gap-2.5 group shrink-0">
                {/* National Emblem / Shield Icon */}
                <div className="w-9 h-9 rounded-xl bg-[#2E1065] p-0.5 shadow-sm flex items-center justify-center shrink-0 border border-purple-800">
                  <ShieldCheck className="w-5 h-5 text-amber-400 group-hover:scale-105 transition-transform" />
                </div>

                <div className="shrink-0">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="font-extrabold text-sm sm:text-base tracking-tight text-white whitespace-nowrap">
                      {t('brand_title', 'Scheme Guard')}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 font-medium tracking-wide hidden lg:block whitespace-nowrap">
                    {t('brand_sub', 'Ministry of Statistics & Programme Implementation • Govt. of India')}
                  </p>
                </div>
              </Link>
            </div>

          {/* Right Actions Cluster: Search -> Notifications -> User Profile */}
          <div className="flex items-center gap-3 sm:gap-3.5">
            {/* Global Search Quick Trigger (Pattern 9) */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/8 hover:bg-white/15 border border-white/15 text-slate-300 hover:text-white text-xs transition-all cursor-pointer shadow-xs"
              title="Search intelligence databases (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden md:inline text-xs font-medium text-slate-300">Search</span>
              <kbd className="hidden md:inline px-1.5 py-0.5 rounded bg-white/12 text-[10px] font-mono text-slate-300">⌘K</kbd>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                data-dropdown-trigger="notif"
                onClick={() => toggleDropdown('notif')}
                className={cn(
                  "relative p-2 rounded-xl transition-colors cursor-pointer",
                  activeGlobalDropdown === 'notif'
                    ? "bg-white/20 text-white border border-white/40"
                    : "text-slate-300 hover:text-white bg-white/5 border border-white/10 hover:border-white/30"
                )}
                title="Intelligence Alerts"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[9px] font-bold flex items-center justify-center border border-gov-navy">
                    {unreadCount}
                  </span>
                )}
              </button>
              <NotificationDropdown isOpen={activeGlobalDropdown === 'notif'} onClose={closeDropdowns} />
            </div>

            {/* User Avatar & Profile OR Clean Login Button */}
            {user ? (
              <div className="relative">
                <button
                  data-dropdown-trigger="profile"
                  onClick={() => toggleDropdown('profile')}
                  className={cn(
                    "flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl transition-colors cursor-pointer",
                    activeGlobalDropdown === 'profile'
                      ? "bg-white/20 border border-white/40"
                      : "bg-white/5 border border-white/10 hover:border-white/30"
                  )}
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                    alt={user?.name || 'User'}
                    className="w-7 h-7 rounded-lg object-cover border border-white/20"
                  />
                  <span className="hidden md:inline-block text-xs font-semibold text-white truncate max-w-[120px]">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className={cn("w-3.5 h-3.5 text-slate-300 transition-transform", activeGlobalDropdown === 'profile' && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {activeGlobalDropdown === 'profile' && (
                    <motion.div
                      data-dropdown-menu="profile"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 py-2 divide-y divide-slate-100 dark:divide-slate-800 origin-top overflow-hidden"
                    >
                      <motion.div variants={itemVariants} className="px-4 py-2">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.designation || user?.email}</p>
                        <span className="mt-1.5 inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {user?.badge}
                        </span>
                      </motion.div>

                      <div className="py-1">
                        <motion.div variants={itemVariants}>
                          <Link
                            to="/profile"
                            onClick={closeDropdowns}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                            <span>{t('sec_profile', 'Security & Profile')}</span>
                          </Link>
                        </motion.div>
                      </div>

                      <motion.div variants={itemVariants} className="pt-1">
                        <button
                          onClick={() => {
                            logout();
                            closeDropdowns();
                            navigate('/login');
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left font-medium cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>{t('sign_out', 'Sign Out')}</span>
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                Login
              </Link>
            )}

          </div>
        </div>
      </div>

      {/* Sovereign Indic Intelligence Modal */}
      <SarvamIndicModal isOpen={isIndicModalOpen} onClose={() => setIsIndicModalOpen(false)} />
    </header>
  </div>
);
};
