import React from 'react';
import { cn, getRiskMeta } from '../../utils/helpers';
import { PROJECT_STATUS } from '../../utils/constants';

export const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  dot = false,
  dotColor = '',
}) => {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    primary: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    danger: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };

  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5 font-medium',
    sm: 'text-xs px-2.5 py-0.5 font-medium',
    md: 'text-xs px-3 py-1 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border tracking-wide uppercase font-mono',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColor || 'bg-current')}
        />
      )}
      {children}
    </span>
  );
};

export const RiskBadge = ({ score, level, showScore = true, className = '' }) => {
  const meta = getRiskMeta(score !== undefined ? score : level === 'CRITICAL' ? 95 : level === 'HIGH' ? 75 : level === 'MEDIUM' ? 45 : 15);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border font-mono tracking-wide',
        meta.badgeColor,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0 animate-pulse" />
      {showScore && score !== undefined ? `${score}% ${meta.label}` : meta.label}
    </span>
  );
};

export const StatusBadge = ({ status, className = '' }) => {
  const config = PROJECT_STATUS[status] || {
    label: status || 'Unknown',
    color: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border font-mono tracking-wide',
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
};
