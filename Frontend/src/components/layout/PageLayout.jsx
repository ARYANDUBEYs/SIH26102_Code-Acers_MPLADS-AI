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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5 bg-white -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 lg:-mx-8 lg:-mt-6 px-4 py-5 sm:px-6 lg:px-8 shadow-gov-sm mb-6">
          <div className="space-y-1">
            {breadcrumbs.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="text-slate-300">/</span>}
                    <span className={idx === breadcrumbs.length - 1 ? 'text-slate-800 font-semibold' : 'hover:text-blue-700'}>{crumb}</span>
                  </React.Fragment>
                ))}
              </div>
            )}
            <div className="flex items-center gap-3">
              {title && <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B2545] tracking-tight">{title}</h1>}
              {badge && <div>{badge}</div>}
            </div>
            {subtitle && <p className="text-xs sm:text-sm text-slate-600">{subtitle}</p>}
          </div>

          {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
        </div>
      )}

      {/* Main Content Area */}
      <div>{children}</div>
    </div>
  );
};
