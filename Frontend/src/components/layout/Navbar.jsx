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
  MapPin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { NotificationDropdown } from './NotificationDropdown';
import { ROLES, ROLE_LABELS } from '../../utils/constants';
import { cn } from '../../utils/helpers';

export const Navbar = () => {
  const { user, role, switchRole, logout, isAdmin, isDistrictOfficer, isCitizen } = useAuth();
  const { unreadCount, setIsSearchOpen, isMobileMenuOpen, setIsMobileMenuOpen } = useApp();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const navigate = useNavigate();

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
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      {/* Top Saffron/White/Green Micro Ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand / Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="flex items-center gap-3 group">
              {/* Ashoka / AI Shield Icon */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 p-0.5 shadow-glow-blue flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                    MPLADS <span className="text-blue-500">AI MONITOR</span>
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-mono uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded font-semibold">
                    MoSPI Command
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">
                  Ministry of Statistics & Programme Implementation • Govt. of India
                </p>
              </div>
            </Link>
          </div>

          {/* Center Search Bar Trigger */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-1.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-xs text-slate-400 transition-all shadow-inner"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-slate-500" />
                <span>Search project ID, district, vendor, cartel...</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-slate-800 border border-slate-700 rounded text-slate-400">
                  Ctrl+K
                </kbd>
              </div>
            </button>
          </div>

          {/* Right Actions: Role Switcher, Notifications, User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Role Switcher for Hackathon Demo */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 border border-slate-700 hover:border-blue-500 rounded-lg text-xs text-slate-200 transition-all"
                title="Switch Role for Demo"
              >
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline-block font-medium">Role:</span>
                <span className="font-semibold text-blue-400 truncate max-w-[110px]">
                  {role === ROLES.MOSPI_ADMIN ? 'MoSPI Admin' : role === ROLES.DISTRICT_OFFICER ? 'District Officer' : 'Public / Citizen'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isRoleMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 py-1.5 divide-y divide-slate-800">
                  <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Switch Active Role
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => handleRoleChange(ROLES.MOSPI_ADMIN)}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors',
                        role === ROLES.MOSPI_ADMIN ? 'bg-blue-600/20 text-blue-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                      )}
                    >
                      <Building2 className="w-4 h-4 text-blue-400" />
                      <div>
                        <div>MoSPI Central Admin</div>
                        <div className="text-[10px] text-slate-500">National oversight & cartels</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleRoleChange(ROLES.DISTRICT_OFFICER)}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors',
                        role === ROLES.DISTRICT_OFFICER ? 'bg-blue-600/20 text-blue-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                      )}
                    >
                      <MapPin className="w-4 h-4 text-amber-400" />
                      <div>
                        <div>District Officer (DM/Varanasi)</div>
                        <div className="text-[10px] text-slate-500">SLA alerts & photo verification</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleRoleChange(ROLES.CITIZEN)}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors',
                        role === ROLES.CITIZEN ? 'bg-blue-600/20 text-blue-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                      )}
                    >
                      <User className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div>Public / Citizen Portal</div>
                        <div className="text-[10px] text-slate-500">Project search & grievance filing</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[9px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
              <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
            </div>

            {/* User Avatar & Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors"
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                  alt={user?.name || 'User'}
                  className="w-6 h-6 rounded-md object-cover border border-slate-700"
                />
                <span className="hidden md:inline-block text-xs font-medium text-slate-200 truncate max-w-[120px]">
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 py-2 divide-y divide-slate-800">
                  <div className="px-4 py-2">
                    <p className="text-xs font-bold text-slate-100">{user?.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.designation || user?.email}</p>
                    <span className="mt-1.5 inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {user?.badge}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Security & Profile</span>
                    </Link>
                    <Link
                      to="/public"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Public Transparency Portal</span>
                    </Link>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
