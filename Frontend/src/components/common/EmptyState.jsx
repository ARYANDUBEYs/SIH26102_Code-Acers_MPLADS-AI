import React from 'react';
import { ShieldAlert, SearchX, CheckCircle, FileText } from 'lucide-react';
import { cn } from '../../utils/helpers';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = SearchX,
  title = 'No Data Found',
  description = 'There are currently no records matching your selected query or filters.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30', className)}>
      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-slate-200">{title}</h4>
      <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
