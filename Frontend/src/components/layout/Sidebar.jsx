import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Map,
  AlertOctagon,
  Network,
  FolderGit2,
  Sparkles,
  Camera,
  Clock,
  CheckSquare,
  ShieldCheck,
  Search,
  MessageSquareWarning,
  Sliders,
  LogOut,
  ChevronRight,
  FileCheck2,
  PanelLeftClose
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../utils/helpers';

export const Sidebar = () => {
  const { role, logout, isDistrictOfficer, isCitizen } = useAuth();
  const { isMobileMenuOpen, setIsMobileMenuOpen, isSidebarOpen, toggleSidebar } = useApp();
  const { t } = useLanguage();
  const location = useLocation();

  const adminNavItems = [
    { label: t('nav_exec_dashboard', 'Executive Dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { label: t('nav_analytics', 'Intelligence Analytics'), path: '/analytics', icon: BarChart3 },
    { label: t('nav_risk_map', 'National Risk Map'), path: '/risk-map', icon: Map },
    { label: t('nav_high_risk', 'High-Risk Audit Queue'), path: '/high-risk', icon: AlertOctagon, badge: '42', badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200' },
    { label: t('nav_cartel_matrix', 'Cartel & Monopoly Matrix'), path: '/cartel-matrix', icon: Network, highlight: true },
    { label: t('nav_evidence_lab', 'AI Forensic Evidence Lab'), path: '/evidence', icon: Camera, highlight: true },
    { label: t('nav_sla', 'SLA Delay Escalations'), path: '/sla', icon: Clock, badge: '12', badgeColor: 'bg-amber-50 text-amber-800 border border-amber-200' },
    { label: t('nav_public_reports', 'Public Vigilance Reports'), path: '/admin/grievances', icon: MessageSquareWarning, badge: 'New', badgeColor: 'bg-emerald-50 text-emerald-800 border border-emerald-200', highlight: true },
  ];

  const districtNavItems = [
    { label: t('nav_district_overview', 'District Overview'), path: '/district', icon: LayoutDashboard },
    { label: t('nav_pending_sanctions', 'Pending Sanctions'), path: '/district/pending', icon: CheckSquare, badge: '24', badgeColor: 'bg-purple-50 text-purple-700 border border-purple-200' },
    { label: t('nav_sla_alerts', 'SLA Risk Alerts'), path: '/sla', icon: Clock, badge: '7', badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200' },
    { label: t('nav_pre_screening', 'AI Pre-Screening'), path: '/district/pre-screening', icon: Sparkles, highlight: true },
    { label: t('nav_photo_val', 'Photo Integrity Validation'), path: '/district/photo-validation', icon: Camera, highlight: true },
  ];

  const citizenNavItems = [
    { label: t('nav_public_home', 'Public Vigilance Portal'), path: '/public', icon: ShieldCheck },
    { label: t('nav_geo_explorer', 'Geospatial Work Explorer'), path: '/public/map', icon: Map },
    { label: t('nav_search_works', 'Search Local Works'), path: '/public/search', icon: Search },
    { label: t('nav_submit_grievance', 'Submit Citizen Grievance'), path: '/public/report', icon: MessageSquareWarning, highlight: true },
    { label: t('nav_exec_dashboard_view', 'Executive Dashboard (Public)'), path: '/dashboard', icon: LayoutDashboard },
  ];

  const navItems = isCitizen
    ? citizenNavItems
    : isDistrictOfficer
    ? districtNavItems
    : adminNavItems;

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/60 z-30 lg:hidden backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      <aside
        className={cn(
          'fixed lg:sticky top-[88px] z-30 h-[calc(100vh-88px)] bg-gov-navyDark border-r border-gov-navy flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0 select-none',
          // Desktop collapse / expand
          isSidebarOpen
            ? 'lg:w-64 lg:opacity-100'
            : 'lg:w-0 lg:min-w-0 lg:max-w-0 lg:border-r-0 lg:opacity-0 lg:pointer-events-none lg:overflow-hidden',
          // Mobile drawer
          isMobileMenuOpen
            ? 'w-64 translate-x-0 shadow-2xl'
            : 'w-64 -translate-x-full lg:translate-x-0'
        )}
      >
        <div className="w-64 h-full flex flex-col justify-between shrink-0 overflow-hidden">
          {/* Navigation list */}
          <div className="p-4 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
            <div>
              <div className="px-2 mb-3.5 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {isCitizen ? t('suite_citizen', 'Citizen Navigation') : isDistrictOfficer ? t('suite_district', 'District Officer Suite') : t('suite_admin', 'National Command Suite')}
                </span>

                {/* Collapse / Expand toggle button inside sidebar header */}
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Close sidebar (Ctrl+B)"
                  aria-label="Close sidebar"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'group flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-all duration-150 border',
                        isActive
                          ? 'bg-white/12 text-white border-purple-500/40 shadow-xs font-bold'
                          : 'text-slate-400 border-transparent hover:text-white hover:bg-white/5'
                      )}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <Icon
                          className={cn(
                            'w-4 h-4 shrink-0 transition-colors',
                            isActive ? 'text-purple-300' : 'text-slate-500 group-hover:text-slate-300',
                            item.highlight && !isActive && 'text-amber-500/70'
                          )}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className={cn('px-2 py-0.5 text-[10px] font-mono rounded-md font-semibold leading-none', item.badgeColor)}>
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
