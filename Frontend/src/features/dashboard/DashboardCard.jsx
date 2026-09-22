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
        'relative select-none transition-all duration-200 group filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)] hover:drop-shadow-[0_4px_8px_rgba(0,0,0,0.09)]',
        onClick && 'cursor-pointer hover:-translate-y-0.5',
        className
      )}
    >
      {/* Pentagon Clipped Body */}
      <div
        style={clipPathStyle}
        className={cn(
          'relative w-full h-full min-h-[96px] pl-4 pr-10 py-3.5 flex flex-col justify-between overflow-hidden',
          style.bg
        )}
      >
        {/* SVG Border ONLY on Edges 1 and 2 */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polyline
            points="93,0 100,50 93,100"
            fill="none"
            stroke={style.stroke}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="flex items-start justify-between gap-2.5">
          <div className="space-y-0.5 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">{title}</p>
            <h3 className={cn('text-xl sm:text-2xl font-black font-mono tracking-tight truncate', style.value)}>
              {value}
            </h3>
          </div>

          {Icon && (
            <div className={cn('p-1.5 rounded-md border shrink-0', style.icon)}>
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-100/90 flex items-center justify-between gap-2 text-xs">
          {trend && (
            <div className="flex items-center gap-1 font-medium text-[11px] shrink-0">
              {trendPositive ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
              )}
              <span className={trendPositive ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}>
                {trend}
              </span>
            </div>
          )}
          {subtitle && <span className="text-slate-500 truncate text-[11px] font-medium ml-auto text-right">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
};
