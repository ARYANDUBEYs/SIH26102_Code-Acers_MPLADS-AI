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
      card: 'bg-white border-slate-200 hover:border-slate-300',
      icon: 'bg-slate-100 text-slate-700 border-slate-200',
      value: 'text-slate-900',
    },
    danger: {
      card: 'bg-white border-rose-200 hover:border-rose-300 ring-1 ring-rose-50',
      icon: 'bg-rose-50 text-rose-700 border-rose-200',
      value: 'text-rose-700',
    },
    warning: {
      card: 'bg-white border-amber-200 hover:border-amber-300 ring-1 ring-amber-50',
      icon: 'bg-amber-50 text-amber-800 border-amber-200',
      value: 'text-amber-800',
    },
    success: {
      card: 'bg-white border-emerald-200 hover:border-emerald-300 ring-1 ring-emerald-50',
      icon: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      value: 'text-emerald-700',
    },
    blue: {
      card: 'bg-white border-blue-200 hover:border-blue-300 ring-1 ring-blue-50',
      icon: 'bg-blue-50 text-blue-700 border-blue-200',
      value: 'text-[#0B2545]',
    },
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-5 rounded-xl border shadow-gov-card hover:shadow-gov-hover transition-all duration-200 flex flex-col justify-between select-none relative overflow-hidden bg-white',
        style.card,
        onClick && 'cursor-pointer hover:-translate-y-0.5',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{title}</p>
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

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {trend && (
          <div className="flex items-center gap-1 font-medium">
            {trendPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
            )}
            <span className={trendPositive ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}>{trend}</span>
          </div>
        )}
        {subtitle && <span className="text-slate-500 truncate text-[11px]">{subtitle}</span>}
      </div>
    </div>
  );
};
