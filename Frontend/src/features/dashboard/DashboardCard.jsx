import React from 'react';
import { cn } from '../../utils/helpers';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

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
      card: 'bg-slate-900/90 border-slate-800 hover:border-slate-700',
      icon: 'bg-slate-800 text-slate-300 border-slate-700',
      value: 'text-slate-100',
    },
    danger: {
      card: 'bg-gradient-to-br from-slate-900 to-rose-950/30 border-rose-900/40 hover:border-rose-700/60 shadow-glow-red/20',
      icon: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      value: 'text-rose-300',
    },
    warning: {
      card: 'bg-gradient-to-br from-slate-900 to-amber-950/30 border-amber-900/40 hover:border-amber-700/60 shadow-glow-orange/20',
      icon: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      value: 'text-amber-300',
    },
    success: {
      card: 'bg-gradient-to-br from-slate-900 to-emerald-950/30 border-emerald-900/40 hover:border-emerald-700/60',
      icon: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      value: 'text-emerald-300',
    },
    blue: {
      card: 'bg-gradient-to-br from-slate-900 to-blue-950/40 border-blue-900/40 hover:border-blue-700/60 shadow-glow-blue/20',
      icon: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      value: 'text-blue-300',
    },
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-5 rounded-xl border transition-all duration-200 flex flex-col justify-between select-none relative overflow-hidden',
        style.card,
        onClick && 'cursor-pointer hover:scale-[1.02] active:scale-[0.99]',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className={cn('text-2xl sm:text-3xl font-black font-mono tracking-tight', style.value)}>
            {value}
          </h3>
        </div>

        {Icon && (
          <div className={cn('p-2.5 rounded-xl border shrink-0', style.icon)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
        {trend && (
          <div className="flex items-center gap-1.5 font-medium">
            {trendPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span className={trendPositive ? 'text-emerald-400' : 'text-rose-400'}>{trend}</span>
          </div>
        )}
        {subtitle && <span className="text-slate-500 truncate">{subtitle}</span>}
      </div>
    </div>
  );
};
