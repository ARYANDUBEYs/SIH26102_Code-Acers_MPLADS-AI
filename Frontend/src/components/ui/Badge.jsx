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
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
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

  const styleMap = {
    CRITICAL: 'bg-rose-50 text-rose-700 border-rose-200',
    HIGH: 'bg-orange-50 text-orange-700 border-orange-200',
    MEDIUM: 'bg-amber-50 text-amber-800 border-amber-200',
    LOW: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border font-mono tracking-wide',
        styleMap[meta.level] || meta.badgeColor,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
      {showScore && score !== undefined ? `${score}% ${meta.label}` : meta.label}
    </span>
  );
};

export const StatusBadge = ({ status, className = '' }) => {
  const config = PROJECT_STATUS[status] || {
    label: status || 'Unknown',
    color: 'bg-slate-100 text-slate-700 border-slate-200',
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
