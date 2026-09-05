import React, { useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../context/LanguageContext';

export const LanguageSelector = ({ variant = 'dark' }) => {
  const { currentLanguage, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
          variant === 'dark'
            ? 'bg-white/10 hover:bg-white/20 border border-white/10 text-slate-200 hover:text-white'
            : 'bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700'
        }`}
        title="Translate Website (Sovereign Indic Languages)"
      >
        <Globe className="w-3.5 h-3.5 text-emerald-400" />
        <span className="font-mono text-[11px] truncate max-w-[85px]">
          {currentLangObj.flag} {currentLangObj.native}
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 flex items-center justify-between">
            <span>Sovereign Indic Languages</span>
            <span className="font-mono text-[9px] bg-slate-200 px-1 rounded text-slate-700">8</span>
          </div>

          <div className="py-1 max-h-64 overflow-y-auto">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = currentLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                    isSelected ? 'bg-blue-50 text-blue-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{lang.flag}</span>
                    <div>
                      <div className="leading-tight">{lang.native}</div>
                      <div className="text-[10px] text-slate-400">{lang.name}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-700" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
