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
    low: 'border-l-4 border-l-emerald-500',
    medium: 'border-l-4 border-l-yellow-500',
    high: 'border-l-4 border-l-orange-500',
    critical: 'border-l-4 border-l-rose-500',
  };

  return (
    <div
      className={cn(
        'bg-slate-900/90 border border-slate-800 rounded-xl shadow-card-dark transition-all duration-200',
        glow && 'glass-panel-glow',
        riskAccent && riskBorderMap[riskAccent],
        className
      )}
      {...props}
    >
      {(title || subtitle || action || Icon) && (
        <div className={cn('flex items-center justify-between px-5 py-4 border-b border-slate-800/80', headerClassName)}>
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div>
              {title && <h3 className="text-sm font-semibold text-slate-100 tracking-wide">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={cn('p-5', bodyClassName)}>{children}</div>
    </div>
  );
};
