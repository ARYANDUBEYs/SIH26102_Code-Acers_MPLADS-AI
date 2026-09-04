import React from 'react';
import { cn } from '../../utils/helpers';

export const PageLayout = ({
  title,
  subtitle,
  badge,
  actions,
  children,
  className = '',
  breadcrumbs = [],
}) => {
  return (
    <div className={cn('space-y-4 pb-8', className)}>
      {/* Page Header */}
      {(title || subtitle || actions || breadcrumbs.length > 0) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gov-border pb-4 mb-4">
          <div className="space-y-1">
            {breadcrumbs.length > 0 && (
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="text-slate-300">/</span>}
                    <span className={idx === breadcrumbs.length - 1 ? 'text-gov-navy font-bold' : 'hover:text-gov-blue cursor-pointer'}>{crumb}</span>
                  </React.Fragment>
                ))}
              </div>
            )}
            <div className="flex items-center gap-3">
              {title && <h1 className="text-xl font-extrabold text-gov-navyDark tracking-tight">{title}</h1>}
              {badge && <div>{badge}</div>}
            </div>
            {subtitle && <p className="text-xs text-slate-600 font-medium">{subtitle}</p>}
          </div>

          {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
        </div>
      )}

      {/* Main Content Area */}
      <div>{children}</div>
    </div>
  );
};
