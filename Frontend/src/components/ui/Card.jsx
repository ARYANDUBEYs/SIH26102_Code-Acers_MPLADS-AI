import React from 'react';
import { cn } from '../../utils/helpers';

export const Card = ({
  children,
  title,
  subtitle,
  action,
  icon: Icon,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  glow = false,
  riskAccent, // 'low' | 'medium' | 'high' | 'critical'
  ...props
}) => {
  const riskBorderMap = {
    low: 'border-l-4 border-l-emerald-600',
    medium: 'border-l-4 border-l-amber-500',
    high: 'border-l-4 border-l-orange-500',
    critical: 'border-l-4 border-l-rose-600',
  };

  return (
    <div
      className={cn(
        'bg-white border border-slate-200 rounded-xl shadow-gov-card transition-all duration-200 text-slate-800',
        riskAccent && riskBorderMap[riskAccent],
        className
      )}
      {...props}
    >
      {(title || subtitle || action || Icon) && (
        <div className={cn('flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 rounded-t-xl', headerClassName)}>
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div>
              {title && <h3 className="text-sm font-semibold text-slate-900 tracking-tight">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={cn('p-5', bodyClassName)}>{children}</div>
    </div>
  );
};
