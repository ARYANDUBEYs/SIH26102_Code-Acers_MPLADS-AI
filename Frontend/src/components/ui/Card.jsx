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
        'bg-gov-surface border border-gov-border rounded-md shadow-sm transition-all duration-200 text-gov-slate',
        riskAccent && riskBorderMap[riskAccent],
        className
      )}
      {...props}
    >
      {(title || subtitle || action || Icon) && (
        <div className={cn('flex items-center justify-between px-4 py-3 border-b border-gov-border bg-gov-canvas/50 rounded-t-md', headerClassName)}>
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="p-1.5 rounded bg-gov-subtle text-gov-navy border border-gov-border shrink-0">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div>
              {title && <h3 className="text-sm font-bold text-gov-slateDark tracking-tight">{title}</h3>}
              {subtitle && <p className="text-xs text-gov-muted mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={cn('p-4', bodyClassName)}>{children}</div>
    </div>
  );
};
