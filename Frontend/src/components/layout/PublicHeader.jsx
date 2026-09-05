import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Camera, User, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';

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

export const PublicHeader = ({ activeSubtitle = 'Public Registry' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { activeGlobalDropdown, toggleDropdown, closeDropdowns } = useApp();

  const isProfileOpen = activeGlobalDropdown === 'publicProfile';

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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:text-gov-navy hover:bg-gov-canvas transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>

            <div className="h-4 w-[1px] bg-gov-border mx-1" />

            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-1.5 text-center transition-colors ${
                    isActive ? 'font-bold text-gov-navy' : 'hover:text-gov-navy'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="publicNavUnderline"
                      className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-gov-navy rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Section: Citizen Grievance & User Profile */}
          <div className="flex items-center gap-3">

            <Button
              variant="danger"
              size="sm"
              icon={Camera}
              onClick={() => navigate('/public/report')}
              className="font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer"
            >
              Report Issue
            </Button>

            {/* Authenticated Citizen Profile Dropdown OR Sign In Link */}
            {user ? (
              <div className="relative">
                <button
                  data-dropdown-trigger="publicProfile"
                  onClick={() => toggleDropdown('publicProfile')}
                  className={`flex items-center gap-2 p-1.5 rounded-lg border transition-all cursor-pointer ${
                    isProfileOpen
                      ? 'bg-gov-canvas border-gov-navy/30'
                      : 'border-gov-border hover:bg-gov-canvas'
                  }`}
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                    alt={user?.name || 'User'}
                    className="w-7 h-7 rounded-md object-cover border border-slate-300"
                  />
                  <span className="hidden sm:inline-block text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[110px]">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      data-dropdown-menu="publicProfile"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 py-2 divide-y divide-slate-100 dark:divide-slate-800 origin-top overflow-hidden"
                    >
                      <motion.div variants={itemVariants} className="px-4 py-2">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.designation || user?.email}</p>
                        <span className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {user?.badge || 'Verified Citizen'}
                        </span>
                      </motion.div>

                      <div className="py-1">
                        <motion.div variants={itemVariants}>
                          <Link
                            to="/dashboard"
                            onClick={closeDropdowns}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            <LayoutDashboard className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                            <span>Command Dashboard</span>
                          </Link>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <Link
                            to="/profile"
                            onClick={closeDropdowns}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                            <span>Profile & Grievances</span>
                          </Link>
                        </motion.div>
                      </div>

                      <motion.div variants={itemVariants} className="pt-1">
                        <button
                          onClick={() => {
                            logout();
                            closeDropdowns();
                            navigate('/');
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left font-medium cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 bg-gov-navy hover:bg-gov-navyLight text-white rounded-md text-xs font-bold shadow-xs transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};
