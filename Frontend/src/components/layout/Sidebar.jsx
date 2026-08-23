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
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ROLES } from '../../utils/constants';
import { cn } from '../../utils/helpers';

export const Sidebar = () => {
  const { role, logout, isAdmin, isDistrictOfficer, isCitizen } = useAuth();
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useApp();
  const location = useLocation();

  const adminNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'India Risk Map', path: '/risk-map', icon: Map },
    { label: 'High-Risk Queue', path: '/high-risk', icon: AlertOctagon, badge: '42', badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30' },
    { label: 'Cartel Matrix', path: '/cartel-matrix', icon: Network, highlight: true },
    { label: 'All Projects', path: '/projects', icon: FolderGit2 },
    { label: 'AI Evidence Verification', path: '/evidence', icon: Camera },
    { label: 'SLA Monitoring', path: '/sla', icon: Clock, badge: '12', badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
  ];

  const districtNavItems = [
    { label: 'District Overview', path: '/district', icon: LayoutDashboard },
    { label: 'Pending Projects', path: '/district/pending', icon: CheckSquare, badge: '24', badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
    { label: 'SLA Alerts', path: '/sla', icon: Clock, badge: '7', badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30' },
    { label: 'AI Pre-Screening', path: '/district/pre-screening', icon: Sparkles, highlight: true },
    { label: 'Photo Validation', path: '/district/photo-validation', icon: Camera },
    { label: 'District Projects', path: '/projects', icon: FolderGit2 },
  ];

  const citizenNavItems = [
    { label: 'Public Portal', path: '/public', icon: ShieldCheck },
    { label: 'Interactive Project Map', path: '/public/map', icon: Map },
    { label: 'Search Projects', path: '/public/search', icon: Search },
    { label: 'Report Project Issue', path: '/public/report', icon: MessageSquareWarning, highlight: true },
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
          className="fixed inset-0 bg-slate-950/80 z-30 lg:hidden backdrop-blur-sm"
        />
      )}

      <aside
        className={cn(
          'fixed lg:sticky top-16 z-30 h-[calc(100vh-4rem)] w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Navigation list */}
        <div className="p-4 space-y-6 overflow-y-auto flex-1">
          <div>
            <div className="px-3 mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {isCitizen ? 'Citizen Navigation' : isDistrictOfficer ? 'District Officer Suite' : 'National Command'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            </div>

            <nav className="space-y-1">
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
                        ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={cn(
                          'w-4 h-4 shrink-0 transition-colors',
                          isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200',
                          item.highlight && !isActive && 'text-cyan-400'
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={cn('px-1.5 py-0.2 text-[10px] font-mono rounded font-semibold', item.badgeColor)}>
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Quick Demo Scenario Highlight Box */}
          <div className="p-3 bg-gradient-to-br from-blue-950/40 to-slate-900 border border-blue-900/40 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Flagship Demo Case</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Investigate high-risk rural road <strong className="text-slate-200">MPLAD-00124</strong> with 96% duplicate image forensic match.
            </p>
            <NavLink
              to="/project/MPLAD-2026-00124"
              onClick={() => setIsMobileMenuOpen(false)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan-400 hover:text-cyan-300 hover:underline"
            >
              <span>Launch Demo Flow</span>
              <ChevronRight className="w-3 h-3" />
            </NavLink>
          </div>
        </div>

        {/* Footer info in sidebar */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>AI Engine v3.4</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Sync
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
