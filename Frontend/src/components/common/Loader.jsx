import React from 'react';
import { cn } from '../../utils/helpers';

export const Loader = ({
  size = 'md',
  text = 'Syncing MoSPI Telemetry...',
  type = 'cube',
  className = '',
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-6 gap-3 text-center', className)}>
      <div className="cube-spinner-container">
        <div className="cube-spinner">
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
      {text && (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide font-mono mt-1">
          {text}
        </span>
      )}
    </div>
  );
};

