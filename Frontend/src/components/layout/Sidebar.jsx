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
import { cn } from '../../utils/helpers';

export const Sidebar = () => {
  const { role, logout, isAdmin, isDistrictOfficer, isCitizen } = useAuth();
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useApp();
  const location = useLocation();

  const adminNavItems = [
    { label: 'Executive Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Intelligence Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'National Risk Map', path: '/risk-map', icon: Map },
    { label: 'High-Risk Audit Queue', path: '/high-risk', icon: AlertOctagon, badge: '42', badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200' },
    { label: 'Cartel & Monopoly Matrix', path: '/cartel-matrix', icon: Network, highlight: true },
    { label: 'All Works Directory', path: '/projects', icon: FolderGit2 },
    { label: 'AI Forensic Evidence Lab', path: '/evidence', icon: Camera, highlight: true },
    { label: 'SLA Delay Escalations', path: '/sla', icon: Clock, badge: '12', badgeColor: 'bg-amber-50 text-amber-800 border border-amber-200' },
  ];

  const districtNavItems = [
    { label: 'District Overview', path: '/district', icon: LayoutDashboard },
    { label: 'Pending Sanctions', path: '/district/pending', icon: CheckSquare, badge: '24', badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200' },
    { label: 'SLA Risk Alerts', path: '/sla', icon: Clock, badge: '7', badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200' },
    { label: 'AI Pre-Screening', path: '/district/pre-screening', icon: Sparkles, highlight: true },
    { label: 'Photo Integrity Validation', path: '/district/photo-validation', icon: Camera, highlight: true },
    { label: 'Constituency Works', path: '/projects', icon: FolderGit2 },
  ];

  const citizenNavItems = [
    { label: 'Public Vigilance Portal', path: '/public', icon: ShieldCheck },
    { label: 'Geospatial Work Explorer', path: '/public/map', icon: Map },
    { label: 'Search Local Works', path: '/public/search', icon: Search },
    { label: 'Submit Citizen Grievance', path: '/public/report', icon: MessageSquareWarning, highlight: true },
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
          'fixed lg:sticky top-16 z-30 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Navigation list */}
        <div className="p-3.5 space-y-6 overflow-y-auto flex-1">
          <div>
            <div className="px-3 mb-2.5 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {isCitizen ? 'Citizen Navigation' : isDistrictOfficer ? 'District Officer Suite' : 'National Command Suite'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
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
                      'group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150',
                      isActive
                        ? 'bg-blue-50 text-blue-900 border border-blue-200 font-semibold shadow-gov-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={cn(
                          'w-4 h-4 shrink-0 transition-colors',
                          isActive ? 'text-blue-700' : 'text-slate-400 group-hover:text-slate-700',
                          item.highlight && !isActive && 'text-blue-600'
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
        </div>

        {/* Bottom Institutional Info Box */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70">
          <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-gov-sm text-xs">
            <div className="flex items-center justify-between font-semibold text-slate-800">
              <span>e-SAKSHI Sync</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-mono leading-none">LIVE</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 leading-tight">
              Continuous Audit Layer active for 784 Parliamentary Constituencies.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
