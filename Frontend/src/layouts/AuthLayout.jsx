import React from 'react';
import { Link } from 'react-router-dom';
import { XmbWaveBackground } from '../components/common/XmbWaveBackground';

export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full relative flex flex-col justify-between overflow-x-hidden bg-[#581c87] text-slate-900 selection:bg-purple-900 selection:text-white">
      {/* Subtle Tiranga Top Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] shrink-0 z-20" />

      {/* Sony XMB-Style Animated Luminous Silk Ribbon Waves & Drifting Particles */}
      <XmbWaveBackground />

      {/* Main Content Area - Clean Centered Card */}
      <main className="flex-1 relative z-10 flex items-center justify-center p-4 sm:p-6 md:p-8">
        {children}
      </main>

      {/* Institutional Micro Footer */}
      <footer className="relative z-10 py-3.5 px-4 text-center text-[11px] text-purple-200/90 font-sans border-t border-white/10 bg-purple-950/40 backdrop-blur-md shrink-0">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <span className="font-medium">Official Scheme Guard Gateway</span>
          <span className="text-purple-300/50">•</span>
          <span>Ministry of Statistics and Programme Implementation</span>
          <span className="text-purple-300/50">•</span>
          <Link to="/" className="text-white hover:underline font-semibold transition">Return to Home</Link>
        </div>
      </footer>
    </div>
  );
};
