import React from 'react';
import { Link } from 'react-router-dom';

export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full relative flex flex-col justify-between overflow-x-hidden bg-[#0d121c] text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* Subtle Tiranga Top Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] shrink-0 z-20" />

      {/* Atmospheric Soft Ambient Blurred Backdrop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-15%] left-[20%] w-[550px] h-[550px] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[25%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[130px]" />
        <div className="absolute top-[40%] right-[-10%] w-[450px] h-[450px] rounded-full bg-emerald-500/5 blur-[100px]" />
        {/* Soft frosted glass overlay that gives the exact blurred background requested */}
        <div className="absolute inset-0 backdrop-blur-[60px] bg-slate-950/40" />
      </div>

      {/* Main Content Area - Clean Centered Card */}
      <main className="flex-1 relative z-10 flex items-center justify-center p-4 sm:p-6 md:p-8">
        {children}
      </main>

      {/* Institutional Micro Footer */}
      <footer className="relative z-10 py-3 px-4 text-center text-[11px] text-slate-400 font-sans border-t border-slate-800/40 bg-slate-950/60 backdrop-blur-md shrink-0">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <span>Official Scheme Guard Gateway</span>
          <span className="text-slate-600">•</span>
          <span>Ministry of Statistics and Programme Implementation</span>
          <span className="text-slate-600">•</span>
          <Link to="/" className="text-slate-300 hover:text-white transition">Return to Home</Link>
        </div>
      </footer>
    </div>
  );
};
