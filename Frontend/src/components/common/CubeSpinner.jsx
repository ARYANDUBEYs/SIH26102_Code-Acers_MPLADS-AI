import React from 'react';
import { cn } from '../../utils/helpers';

export const CubeSpinner = ({ text = 'Initializing Sovereign Security Layer...', className = '' }) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 gap-4 text-center', className)}>
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
        <div>
          <p className="text-xs font-semibold text-slate-700 tracking-wide">{text}</p>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">MoSPI e-SAKSHI 2.0 • Realtime Telemetry</p>
        </div>
      )}
    </div>
  );
};
