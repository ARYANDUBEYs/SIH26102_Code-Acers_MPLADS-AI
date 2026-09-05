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
  FileCheck2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../utils/helpers';

export const Sidebar = () => {
  const { role, logout, isDistrictOfficer, isCitizen } = useAuth();
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useApp();
  const { t } = useLanguage();
  const location = useLocation();

  const adminNavItems = [
    { label: t('nav_exec_dashboard', 'Executive Dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { label: t('nav_analytics', 'Intelligence Analytics'), path: '/analytics', icon: BarChart3 },
    { label: t('nav_risk_map', 'National Risk Map'), path: '/risk-map', icon: Map },
    { label: t('nav_high_risk', 'High-Risk Audit Queue'), path: '/high-risk', icon: AlertOctagon, badge: '42', badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200' },
    { label: t('nav_cartel_matrix', 'Cartel & Monopoly Matrix'), path: '/cartel-matrix', icon: Network, highlight: true },
    { label: t('nav_all_works', 'All Works Directory'), path: '/projects', icon: FolderGit2 },
    { label: t('nav_evidence_lab', 'AI Forensic Evidence Lab'), path: '/evidence', icon: Camera, highlight: true },
    { label: t('nav_sla', 'SLA Delay Escalations'), path: '/sla', icon: Clock, badge: '12', badgeColor: 'bg-amber-50 text-amber-800 border border-amber-200' },
  ];

  const districtNavItems = [
    { label: t('nav_district_overview', 'District Overview'), path: '/district', icon: LayoutDashboard },
    { label: t('nav_pending_sanctions', 'Pending Sanctions'), path: '/district/pending', icon: CheckSquare, badge: '24', badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200' },
    { label: t('nav_sla_alerts', 'SLA Risk Alerts'), path: '/sla', icon: Clock, badge: '7', badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200' },
    { label: t('nav_pre_screening', 'AI Pre-Screening'), path: '/district/pre-screening', icon: Sparkles, highlight: true },
    { label: t('nav_photo_val', 'Photo Integrity Validation'), path: '/district/photo-validation', icon: Camera, highlight: true },
    { label: t('nav_constituency_works', 'Constituency Works'), path: '/projects', icon: FolderGit2 },
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
          className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={cn(
          'fixed lg:sticky top-[88px] z-30 h-[calc(100vh-88px)] w-64 bg-gov-navyDark border-r border-gov-navy flex flex-col justify-between transition-transform duration-300 ease-in-out',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Navigation list */}
        <div className="p-3.5 space-y-6 overflow-y-auto flex-1">
          <div>
            <div className="px-3 mb-2.5 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {isCitizen ? t('suite_citizen', 'Citizen Navigation') : isDistrictOfficer ? t('suite_district', 'District Officer Suite') : t('suite_admin', 'National Command Suite')}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-900" />
            </div>

            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 border',
                      isActive
                        ? 'bg-gov-blue/20 text-white border-gov-blue/50 shadow-[0_0_10px_rgba(29,78,216,0.3)] font-semibold'
                        : 'text-slate-400 border-transparent hover:text-white hover:bg-white/5'
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={cn(
                          'w-4 h-4 shrink-0 transition-colors',
                          isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300',
                          item.highlight && !isActive && 'text-amber-500/70'
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={cn('px-1.5 py-0.5 text-[10px] font-mono rounded font-semibold leading-none', item.badgeColor)}>
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Quick SLA / Vigilance Status Card */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                AI Sentinel Stream
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              dHash & IsolationForest models cross-referencing 28 States & UTs.
            </p>
            <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Latency: 18ms</span>
              <span className="text-emerald-400 font-semibold">99.98% Uptime</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
