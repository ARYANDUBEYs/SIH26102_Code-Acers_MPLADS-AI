import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/helpers';

export const SearchBar = ({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search project ID, district, vendor, keyword...',
  className = '',
  showShortcut = true,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'relative flex items-center w-full bg-slate-900/90 border border-slate-700/80 rounded-lg text-slate-100 transition-all duration-150',
        'focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500',
        className
      )}
    >
      <div className="pl-3.5 pr-2 text-slate-400 pointer-events-none flex items-center justify-center">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent py-2 pr-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="p-1 mr-2 text-slate-400 hover:text-slate-200 rounded-md transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
      {showShortcut && !value && (
        <div className="hidden sm:flex items-center gap-1 pr-3 pointer-events-none">
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-800 border border-slate-700 rounded">
            Ctrl
          </kbd>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-800 border border-slate-700 rounded">
            K
          </kbd>
        </div>
      )}
    </div>
  );
};
