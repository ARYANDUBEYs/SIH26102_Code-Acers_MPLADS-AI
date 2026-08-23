import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../utils/helpers';

export const Dropdown = ({
  options = [], // [{ value: 'ALL', label: 'All Options', icon?: Icon }]
  value,
  onChange,
  label,
  placeholder = 'Select option...',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(o => o.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('relative flex flex-col gap-1', className)} ref={dropdownRef}>
      {label && <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={cn('w-3.5 h-3.5 text-slate-400 transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 max-h-56 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors',
                opt.value === value ? 'bg-blue-600/20 text-blue-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
              )}
            >
              <div className="flex items-center gap-2 truncate">
                {opt.icon && <opt.icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                <span className="truncate">{opt.label}</span>
              </div>
              {opt.value === value && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
