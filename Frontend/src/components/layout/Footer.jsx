import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-[#0B2545] border-t border-slate-700 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-300">
      {/* Tiranga Ribbon */}
      <div className="h-0.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] -mt-6 mb-6 opacity-70" />

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-200">
          <ShieldCheck className="w-4 h-4 text-blue-300 shrink-0" />
          <span className="leading-relaxed">
            {t('footer_text', 'MPLADS AI MONITOR — Ministry of Statistics and Programme Implementation (MoSPI) • Govt. of India')}
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px] shrink-0">
          <span>{t('footer_sec', 'RESTRICTED GOVERNMENT AUDIT ACCESS • ZERO-LEAKAGE ALLOCATION')}</span>
          <span>•</span>
          <span>© 2026</span>
        </div>
      </div>
    </footer>
  );
};
