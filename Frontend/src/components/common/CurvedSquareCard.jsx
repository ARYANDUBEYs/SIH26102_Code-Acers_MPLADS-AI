import React from 'react';
import { motion } from 'framer-motion';

/**
 * CurvedSquareCard:
 * Replaces the pentagon cards for the National Developmental Indicators 2x3 grid.
 * Square-proportioned card with smooth curved corners (rounded-2xl) and entrance
 * animation emerging upwards out of blur.
 */
export const CurvedSquareCard = ({
  index = 0,
  title,
  value,
  subtitle,
  variant = 'default',
  borderColor,
  bgColor,
  className = '',
  inView = true,
  compact = true
}) => {
  const variantStyles = {
    default: {
      border: 'border-slate-200',
      value: 'text-slate-900',
      tag: 'bg-slate-100 text-slate-700',
      glow: 'hover:border-slate-300'
    },
    purple: {
      border: 'border-purple-200/90',
      value: 'text-[#2E1065]',
      tag: 'bg-purple-50 text-purple-700',
      glow: 'hover:border-purple-300 hover:shadow-purple-100/50'
    },
    blue: {
      border: 'border-indigo-200/90',
      value: 'text-[#2E1065]',
      tag: 'bg-indigo-50 text-indigo-700',
      glow: 'hover:border-indigo-300 hover:shadow-indigo-100/50'
    },
    danger: {
      border: 'border-rose-200/90',
      value: 'text-rose-700',
      tag: 'bg-rose-50 text-rose-700',
      glow: 'hover:border-rose-300 hover:shadow-rose-100/50'
    },
    warning: {
      border: 'border-amber-200/90',
      value: 'text-amber-800',
      tag: 'bg-amber-50 text-amber-800',
      glow: 'hover:border-amber-300 hover:shadow-amber-100/50'
    },
    success: {
      border: 'border-emerald-200/90',
      value: 'text-emerald-700',
      tag: 'bg-emerald-50 text-emerald-700',
      glow: 'hover:border-emerald-300 hover:shadow-emerald-100/50'
    }
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <div
      className={`group relative rounded-xl bg-white ${compact ? 'p-2.5 sm:p-3 min-h-[76px] sm:min-h-[80px]' : 'p-5 min-h-[148px] rounded-2xl'} border ${style.border} shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between ${style.glow} ${className}`}
      style={{
        borderColor: borderColor || undefined
      }}
    >
      {/* Specular sheen on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/60 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Top Header Label */}
      <div className="relative z-10 flex items-start justify-between gap-1.5">
        <span className={`${compact ? 'text-[10px] sm:text-[10.5px]' : 'text-[11px] sm:text-xs'} font-bold uppercase tracking-wider text-slate-500 group-hover:text-purple-950 transition-colors leading-tight line-clamp-1`}>
          {title}
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-purple-200 group-hover:bg-[#2E1065] transition-colors shrink-0 mt-0.5" />
      </div>

      {/* Metric Value */}
      <div className={`relative z-10 ${compact ? 'my-0.5' : 'my-1'}`}>
        <div className={`${compact ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'} font-black font-archivo tracking-tight ${style.value}`}>
          {value}
        </div>
      </div>

      {/* Subtitle / Context Metadata */}
      <div className={`relative z-10 ${compact ? 'pt-0.5' : 'pt-1'} border-t border-slate-100/80 flex items-center justify-between`}>
        <span className={`${compact ? 'text-[9.5px]' : 'text-[11px]'} font-semibold text-slate-500 truncate`}>
          {subtitle}
        </span>
        <span className="text-[8.5px] font-mono font-bold uppercase px-1 py-0.2 rounded bg-slate-50 text-slate-400 group-hover:text-purple-700 group-hover:bg-purple-50 transition-colors">
          Verified
        </span>
      </div>
    </div>
  );
};
