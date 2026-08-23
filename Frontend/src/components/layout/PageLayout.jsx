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
    <div className={cn('space-y-6 pb-12', className)}>
      {/* Page Header */}
      {(title || subtitle || actions || breadcrumbs.length > 0) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="space-y-1">
            {breadcrumbs.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span>/</span>}
                    <span>{crumb}</span>
                  </React.Fragment>
                ))}
              </div>
            )}
            <div className="flex items-center gap-3">
              {title && <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">{title}</h1>}
              {badge && <div>{badge}</div>}
            </div>
            {subtitle && <p className="text-xs sm:text-sm text-slate-400">{subtitle}</p>}
          </div>

          {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
        </div>
      )}

      {/* Main Content Area */}
      <div>{children}</div>
    </div>
  );
};
