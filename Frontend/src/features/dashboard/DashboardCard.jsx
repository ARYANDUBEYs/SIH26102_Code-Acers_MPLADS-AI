import React from 'react';
import { cn } from '../../utils/helpers';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const DashboardCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  variant = 'default', // 'default' | 'danger' | 'warning' | 'success' | 'blue'
  className = '',
  onClick,
}) => {
  const variantStyles = {
    default: {
      stroke: '#64748b',
      bg: 'bg-white',
      icon: 'bg-slate-100 text-slate-700 border-slate-200',
      value: 'text-slate-900',
    },
    danger: {
      stroke: '#e11d48',
      bg: 'bg-white',
      icon: 'bg-rose-50 text-rose-700 border-rose-200',
      value: 'text-rose-700',
    },
    warning: {
      stroke: '#d97706',
      bg: 'bg-white',
      icon: 'bg-amber-50 text-amber-800 border-amber-200',
      value: 'text-amber-800',
    },
    success: {
      stroke: '#059669',
      bg: 'bg-white',
      icon: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      value: 'text-emerald-700',
    },
    blue: {
      stroke: '#7e22ce',
      bg: 'bg-white',
      icon: 'bg-purple-50 text-purple-700 border-purple-200',
      value: 'text-[#2E1065]',
    },
  };

  const style = variantStyles[variant] || variantStyles.default;

  // Pentagon coordinates as per Image 3:
  // Edge 4: left vertical -> NO border
  // Edge 3: top horizontal -> NO border
  // Edge 5: bottom horizontal -> NO border
  // Edge 1: top-right slant -> BORDER DRAWN
  // Edge 2: bottom-right slant -> BORDER DRAWN
  const clipPathStyle = {
    clipPath: 'polygon(0% 0%, 93% 0%, 100% 50%, 93% 100%, 0% 100%)',
    WebkitClipPath: 'polygon(0% 0%, 93% 0%, 100% 50%, 93% 100%, 0% 100%)',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-all duration-200 select-none p-5 sm:p-6 flex flex-col justify-between overflow-hidden group',
        onClick && 'cursor-pointer hover:-translate-y-0.5',
        className
      )}
    >
      {/* Top Header: Label on Left, Icon/Badge pinned on Top-Right */}
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
          {title}
        </p>

        {Icon && (
          <div className={cn('p-2 rounded-xl border shrink-0', style.icon)}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Main Anchor: Large Bold Number directly below label */}
      <div className="mt-2.5">
        <h3 className={cn('text-2xl sm:text-3xl font-black font-mono tracking-tight truncate', style.value)}>
          {value}
        </h3>
      </div>

      {/* Bottom Footer: Delta/Trend Indicator + Comparison Caption */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
        {trend && (
          <div className="flex items-center gap-1 font-semibold text-xs shrink-0">
            {trendPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
            )}
            <span className={trendPositive ? 'text-emerald-700' : 'text-rose-700'}>
              {trend}
            </span>
          </div>
        )}
        {subtitle && (
          <span className="text-slate-500 truncate text-xs font-medium ml-auto text-right">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
