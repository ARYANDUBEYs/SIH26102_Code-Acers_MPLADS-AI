import React from 'react';
import { cn } from '../../utils/helpers';

export const ShimmerLoader = ({ count = 3, className = '' }) => {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="skeleton-card relative overflow-hidden bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="skeleton-shimmer" />
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-slate-200 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 bg-slate-200 rounded w-3/4" />
              <div className="h-2.5 bg-slate-100 rounded w-1/2" />
            </div>
          </div>
          <div className="space-y-2 mb-3">
            <div className="h-2.5 bg-slate-100 rounded w-full" />
            <div className="h-2.5 bg-slate-100 rounded w-5/6" />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="h-3 bg-slate-200 rounded w-20" />
            <div className="h-3 bg-slate-200 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};
