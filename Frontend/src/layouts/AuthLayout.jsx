import React from 'react';
import { Link } from 'react-router-dom';

export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full relative flex flex-col justify-between overflow-x-hidden bg-[#6b21a8] text-slate-900 selection:bg-purple-900 selection:text-white">
      {/* Subtle Tiranga Top Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] shrink-0 z-20" />

      {/* Atmospheric Purple Gradient & Smooth Curved Waves Backdrop matching reference */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-gradient-to-br from-[#7e22ce] via-[#6b21a8] to-[#581c87]">
        {/* Soft Radial ambient lighting */}
        <div className="absolute top-[-10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-purple-400/25 blur-[120px]" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[650px] h-[650px] rounded-full bg-fuchsia-500/20 blur-[130px]" />
        
        {/* Elegant Curved Vector Waves Overlay */}
        <svg
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 900"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M-100 250 C 350 450, 700 120, 1540 320"
            stroke="white"
            strokeWidth="1.5"
            strokeOpacity="0.45"
            fill="none"
          />
          <path
            d="M-100 480 C 420 200, 920 620, 1540 380"
            stroke="white"
            strokeWidth="2"
            strokeOpacity="0.35"
            fill="none"
          />
          <path
            d="M-100 700 C 500 550, 850 820, 1540 600"
            stroke="white"
            strokeWidth="1.2"
            strokeOpacity="0.3"
            fill="none"
          />
          <path
            d="M-100 120 C 400 30, 1100 350, 1540 180"
            stroke="white"
            strokeWidth="1.8"
            strokeOpacity="0.25"
            fill="none"
          />
        </svg>
      </div>

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
