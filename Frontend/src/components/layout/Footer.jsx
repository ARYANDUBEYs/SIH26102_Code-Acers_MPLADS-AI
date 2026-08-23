import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <span>
            <strong>MPLADS AI MONITOR</strong> — Developed for Ministry of Statistics and Programme Implementation (MoSPI)
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
          <span>Security Level: RESTRICTED GOV ACCESS</span>
          <span>•</span>
          <span>© 2026 Government of India</span>
        </div>
      </div>
    </footer>
  );
};
