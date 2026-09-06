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
  Layers,
  Sparkles,
  ExternalLink,
  Building2,
  MapPin,
  Globe,
  Home
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
  const { user, role, switchRole, logout } = useAuth();
  const {
    unreadCount,
    setIsSearchOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    activeGlobalDropdown,
    toggleDropdown,
    closeDropdowns
  } = useApp();
  const { currentLanguage, setLanguage, t } = useLanguage();

  const [isIndicModalOpen, setIsIndicModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    switchRole(newRole);
    closeDropdowns();
    if (newRole === ROLES.CITIZEN) {
      navigate('/public');
    } else if (newRole === ROLES.DISTRICT_OFFICER) {
      navigate('/district');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="sticky top-0 z-40 w-full">
      <TopUtilityBar onOpenVoiceModal={() => setIsIndicModalOpen(true)} />
      <header className="w-full bg-gov-navy border-b border-gov-navyDark shadow-md">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-6">
          <div className="flex items-center justify-between h-14 gap-4">
            
            {/* Brand / Logo */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Link to="/" className="flex items-center gap-2.5 group shrink-0">
                {/* National Emblem / Shield Icon */}
                <div className="w-9 h-9 rounded-xl bg-[#0B2545] p-0.5 shadow-sm flex items-center justify-center shrink-0 border border-blue-900">
                  <ShieldCheck className="w-5 h-5 text-amber-400 group-hover:scale-105 transition-transform" />
                </div>

                <div className="shrink-0">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="font-extrabold text-sm sm:text-base tracking-tight text-white whitespace-nowrap">
                      {t('brand_title', 'Scheme Guard 2.0')}
                    </span>
                    <span className="hidden xl:inline-block px-2 py-0.5 text-[10px] font-mono uppercase bg-gov-indiaGreen/20 text-emerald-100 border border-gov-indiaGreen/50 rounded font-bold whitespace-nowrap shrink-0">
                      {t('brand_tag', 'AI Vigilance Layer')}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 font-medium tracking-wide hidden lg:block whitespace-nowrap">
                    {t('brand_sub', 'Ministry of Statistics & Programme Implementation • Govt. of India')}
                  </p>
                </div>
              </Link>
            </div>


          {/* Center Search Bar Trigger */}
          <div className="hidden md:flex flex-1 max-w-xs xl:max-w-sm mx-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-xs text-slate-300 transition-all shadow-sm cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{t('search_placeholder', 'Search project ID, district, contractor, cartel...')}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-white/10 border border-white/20 rounded text-slate-300">
                  Ctrl+K
                </kbd>
              </div>
            </button>
          </div>

          {/* Right Actions: Role Switcher, Notifications, User Profile (Mutual Exclusivity & Staggered Motion) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Role Switcher for Hackathon Demo */}
            <div className="relative">
              <button
                type="button"
                data-dropdown-trigger="role"
                onClick={() => toggleDropdown('role')}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all shadow-sm cursor-pointer",
                  activeGlobalDropdown === 'role'
                    ? "bg-white/20 border-white/40 text-white"
                    : "bg-white/10 border border-white/10 hover:border-white/30 text-slate-200 hover:text-white"
                )}
                title="Switch Role for Demo"
              >
                <Layers className="w-3.5 h-3.5 text-gov-saffron" />
                <span className="hidden sm:inline-block font-medium text-slate-300">Role:</span>
                <span className="font-semibold text-white truncate max-w-[120px]">
                  {role === ROLES.MOSPI_ADMIN ? t('role_admin', 'MoSPI Admin') : role === ROLES.DISTRICT_OFFICER ? t('role_district', 'District Officer') : t('role_citizen', 'Citizen Portal')}
                </span>
                <ChevronDown className={cn("w-3 h-3 text-slate-400 transition-transform", activeGlobalDropdown === 'role' && "rotate-180")} />
              </button>

              <AnimatePresence>
                {activeGlobalDropdown === 'role' && (
                  <motion.div
                    data-dropdown-menu="role"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 py-1.5 divide-y divide-slate-100 dark:divide-slate-800 origin-top overflow-hidden"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {t('role_persona', 'Active Authority Persona')}
                    </div>
                    <div className="py-1">
                      <motion.div variants={itemVariants}>
                        <button
                          onClick={() => handleRoleChange(ROLES.MOSPI_ADMIN)}
                          className={cn(
                            'w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors cursor-pointer',
                            role === ROLES.MOSPI_ADMIN ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-semibold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                          )}
                        >
                          <Building2 className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                          <div>
                            <div>{t('role_admin', 'MoSPI Central Auditor')}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">{t('role_admin_sub', 'National oversight & cartels')}</div>
                          </div>
                        </button>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <button
                          onClick={() => handleRoleChange(ROLES.DISTRICT_OFFICER)}
                          className={cn(
                            'w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors cursor-pointer',
                            role === ROLES.DISTRICT_OFFICER ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-semibold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                          )}
                        >
                          <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <div>
                            <div>{t('role_district', 'District Officer (DM/Varanasi)')}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">{t('role_district_sub', 'SLA alerts & photo verification')}</div>
                          </div>
                        </button>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <button
                          onClick={() => handleRoleChange(ROLES.CITIZEN)}
                          className={cn(
                            'w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors cursor-pointer',
                            role === ROLES.CITIZEN ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-semibold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                          )}
                        >
                          <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <div>
                            <div>{t('role_citizen', 'Public / Citizen Portal')}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">{t('role_citizen_sub', 'Project search & grievance filing')}</div>
                          </div>
                        </button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                data-dropdown-trigger="notif"
                onClick={() => toggleDropdown('notif')}
                className={cn(
                  "relative p-2 rounded-lg transition-colors cursor-pointer",
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
                    "flex items-center gap-2 p-1.5 rounded-lg transition-colors cursor-pointer",
                    activeGlobalDropdown === 'profile'
                      ? "bg-white/20 border border-white/40"
                      : "bg-white/5 border border-white/10 hover:border-white/30"
                  )}
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                    alt={user?.name || 'User'}
                    className="w-6 h-6 rounded-md object-cover border border-white/20"
                  />
                  <span className="hidden md:inline-block text-xs font-semibold text-white truncate max-w-[120px]">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className={cn("w-3 h-3 text-slate-400 transition-transform", activeGlobalDropdown === 'profile' && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {activeGlobalDropdown === 'profile' && (
                    <motion.div
                      data-dropdown-menu="profile"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 py-2 divide-y divide-slate-100 dark:divide-slate-800 origin-top overflow-hidden"
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
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap"
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
