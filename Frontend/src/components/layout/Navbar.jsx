import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Volume2,
  Home
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../context/LanguageContext';
import { NotificationDropdown } from './NotificationDropdown';
import { SarvamIndicModal } from '../sarvam/SarvamIndicModal';
import { TopUtilityBar } from './TopUtilityBar';
import { CitizenRequestModal } from '../common/CitizenRequestModal';
import { ROLES } from '../../utils/constants';
import { cn } from '../../utils/helpers';

export const Navbar = () => {
  const { user, role, switchRole, logout } = useAuth();
  const { unreadCount, setIsSearchOpen, isMobileMenuOpen, setIsMobileMenuOpen } = useApp();
  const { currentLanguage, setLanguage, t } = useLanguage();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isIndicModalOpen, setIsIndicModalOpen] = useState(false);
  const [isCitizenModalOpen, setIsCitizenModalOpen] = useState(false);
  const navigate = useNavigate();

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const handleRoleChange = (newRole) => {
    switchRole(newRole);
    setIsRoleMenuOpen(false);
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
      <header className="w-full bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
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
                    <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#0B2545] whitespace-nowrap">
                      {t('brand_title', 'MPLADS e-SAKSHI 2.0')}
                    </span>
                    <span className="hidden xl:inline-block px-2 py-0.5 text-[10px] font-mono uppercase bg-emerald-50 text-emerald-800 border border-emerald-300 rounded font-bold whitespace-nowrap shrink-0">
                      {t('brand_tag', 'AI Vigilance Layer')}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium tracking-wide hidden lg:block whitespace-nowrap">
                    {t('brand_sub', 'Ministry of Statistics & Programme Implementation • Govt. of India')}
                  </p>
                </div>
              </Link>
            </div>

            {/* Back to Home Button */}
            <Link
              to="/"
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-xs text-slate-700 hover:text-blue-700 font-semibold transition-all shadow-sm shrink-0 whitespace-nowrap"
              title="Return to Main Landing Page"
            >
              <Home className="w-3.5 h-3.5 text-blue-700" />
              <span>{t('nav_back_home', 'Home / मुख्य पृष्ठ')}</span>
            </Link>

            {/* Citizen Request Button */}
            <button
              type="button"
              onClick={() => setIsCitizenModalOpen(true)}
              className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs text-blue-800 font-semibold transition-all shadow-sm shrink-0 whitespace-nowrap cursor-pointer"
              title="Submit Citizen Work Recommendation or Grievance"
            >
              <span>Citizen Request</span>
            </button>

          {/* Center Search Bar Trigger */}
          <div className="hidden md:flex flex-1 max-w-xs xl:max-w-sm mx-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-1.5 bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs text-slate-600 transition-all shadow-sm cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{t('search_placeholder', 'Search project ID, district, contractor, cartel...')}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-slate-100 border border-slate-200 rounded text-slate-500">
                  Ctrl+K
                </kbd>
              </div>
            </button>
          </div>

          {/* Right Actions: Full-Page Language Switcher, Voice AI, Role Switcher, Notifications, User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* 1. Global Indic Language Dropdown (TRANSLATES WHOLE PAGE) */}
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
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors cursor-pointer',
                          currentLanguage === lang.code
                            ? 'bg-blue-50 text-blue-900 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span className="font-medium">{lang.native}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">({lang.name})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Sarvam AI Voice Briefing & Grievance Trigger */}
            <button
              type="button"
              onClick={() => setIsIndicModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 hover:border-orange-500 rounded-lg text-xs text-orange-900 transition-all shadow-sm font-semibold cursor-pointer"
              title="Sarvam AI Voice Intelligence & Vernacular Grievances"
            >
              <Volume2 className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
              <span className="hidden sm:inline-block">{t('voice_briefing_btn', 'Voice AI')}</span>
            </button>

            {/* 3. Role Switcher for Hackathon Demo */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 hover:border-blue-600 rounded-lg text-xs text-slate-700 hover:text-blue-700 transition-all shadow-sm cursor-pointer"
                title="Switch Role for Demo"
              >
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline-block font-medium text-slate-500">Role:</span>
                <span className="font-semibold text-[#0B2545] truncate max-w-[120px]">
                  {role === ROLES.MOSPI_ADMIN ? t('role_admin', 'MoSPI Admin') : role === ROLES.DISTRICT_OFFICER ? t('role_district', 'District Officer') : t('role_citizen', 'Citizen Portal')}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isRoleMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 divide-y divide-slate-100">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {t('role_persona', 'Active Authority Persona')}
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => handleRoleChange(ROLES.MOSPI_ADMIN)}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors cursor-pointer',
                        role === ROLES.MOSPI_ADMIN ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                      )}
                    >
                      <Building2 className="w-4 h-4 text-blue-700" />
                      <div>
                        <div>{t('role_admin', 'MoSPI Central Auditor')}</div>
                        <div className="text-[10px] text-slate-500">{t('role_admin_sub', 'National oversight & cartels')}</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleRoleChange(ROLES.DISTRICT_OFFICER)}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors cursor-pointer',
                        role === ROLES.DISTRICT_OFFICER ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                      )}
                    >
                      <MapPin className="w-4 h-4 text-amber-600" />
                      <div>
                        <div>{t('role_district', 'District Officer (DM/Varanasi)')}</div>
                        <div className="text-[10px] text-slate-500">{t('role_district_sub', 'SLA alerts & photo verification')}</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleRoleChange(ROLES.CITIZEN)}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors cursor-pointer',
                        role === ROLES.CITIZEN ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                      )}
                    >
                      <User className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div>{t('role_citizen', 'Public / Citizen Portal')}</div>
                        <div className="text-[10px] text-slate-500">{t('role_citizen_sub', 'Project search & grievance filing')}</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white font-mono text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
            </div>

            {/* 5. User Avatar & Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                  alt={user?.name || 'User'}
                  className="w-6 h-6 rounded-md object-cover border border-slate-200"
                />
                <span className="hidden md:inline-block text-xs font-semibold text-slate-800 truncate max-w-[120px]">
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2 divide-y divide-slate-100">
                  <div className="px-4 py-2">
                    <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.designation || user?.email}</p>
                    <span className="mt-1.5 inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200">
                      {user?.badge}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <Home className="w-3.5 h-3.5 text-blue-700" />
                      <span>{t('nav_back_home', 'Home / मुख्य पृष्ठ')}</span>
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>{t('sec_profile', 'Security & Profile')}</span>
                    </Link>
                    <Link
                      to="/public"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{t('public_portal', 'Public Transparency Portal')}</span>
                    </Link>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('sign_out', 'Sign Out')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Sovereign Indic Intelligence Modal */}
      <SarvamIndicModal isOpen={isIndicModalOpen} onClose={() => setIsIndicModalOpen(false)} />

      {/* Citizen Request Modal */}
      <CitizenRequestModal isOpen={isCitizenModalOpen} onClose={() => setIsCitizenModalOpen(false)} />
    </header>
  </div>
);
};
