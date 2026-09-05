import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Camera, User, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

export const PublicHeader = ({ activeSubtitle = 'Public Registry' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const navItems = [
    { label: 'Citizen Home', path: '/public' },
    { label: 'Constituency Map', path: '/public/map' },
    { label: 'Search Works', path: '/public/search' },
  ];

  return (
    <div className="w-full">
      {/* 1. Official National Tricolor Accent Banner */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* 2. Public Header Masthead */}
      <header className="sticky top-0 z-40 bg-gov-surface border-b border-gov-border shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Portal Identity */}
          <Link to="/public" className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-md bg-gov-navy text-white flex items-center justify-center font-bold text-sm shadow-xs border border-gov-navyLight">
              MP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-gov-navy">
                  MPLADS <span className="text-gov-saffron font-bold">CITIZEN PORTAL</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-gov-canvas text-gov-muted border border-gov-border px-1.5 py-0.5 rounded hidden sm:inline-block">
                  MoSPI e-SAKSHI
                </span>
              </div>
              <p className="text-[10px] text-gov-muted font-medium hidden xs:block">
                Ministry of Statistics & Programme Implementation • {activeSubtitle}
              </p>
            </div>
          </Link>

          {/* Equal Sized Nav Tabs with Smooth Sliding Underline */}
          <nav className="hidden md:flex items-center gap-2 text-xs font-semibold text-gov-muted">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-gov-slateDark hover:text-gov-navy bg-gov-canvas hover:bg-slate-100 border border-gov-border rounded-md transition font-medium mr-1"
            >
              <Home className="w-3.5 h-3.5 text-gov-navy" />
              <span>Home</span>
            </Link>

            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-lg border border-slate-200">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-4 py-1.5 text-xs font-bold transition-colors duration-200 text-center min-w-[125px] ${
                      isActive ? 'text-gov-navy font-black' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="publicTabUnderline"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-gov-navy rounded-full"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link to="/public/report">
              <Button
                variant="danger"
                size="sm"
                icon={Camera}
                className="rounded-md shadow-xs font-semibold text-xs py-1.5"
              >
                <span className="hidden sm:inline">Report Issue</span>
                <span className="sm:hidden">Report</span>
              </Button>
            </Link>

            {/* Authenticated User Profile Pill OR Officer Login */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                  title="Account Profile"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={user?.name || 'User'}
                    className="w-7 h-7 rounded-md object-cover border border-slate-300"
                  />
                  <span className="hidden sm:inline-block text-xs font-bold text-slate-800 truncate max-w-[110px]">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2">
                      <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.designation || user?.email}</p>
                      <span className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200">
                        {user?.badge || 'Verified Citizen'}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
                        <span>Command Dashboard</span>
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>Profile & Grievances</span>
                      </Link>
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileDropdownOpen(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gov-border text-gov-slateDark hover:bg-gov-canvas rounded-md text-xs font-semibold py-1.5"
                >
                  Officer Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};
