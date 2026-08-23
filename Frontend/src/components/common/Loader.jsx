import React from 'react';
import { Loader2, ShieldCheck, Cpu } from 'lucide-react';
import { cn } from '../../utils/helpers';

export const Loader = ({
  size = 'md',
  text = 'Analyzing Gov Data...',
  type = 'spinner',
  className = '',
}) => {
  if (type === 'ai-scan') {
    return (
      <div className={cn('flex flex-col items-center justify-center p-8 gap-4 text-center', className)}>
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-blue-500/20 animate-ping absolute" />
          <div className="w-12 h-12 rounded-full border-2 border-t-blue-500 border-r-cyan-500 border-b-transparent border-l-transparent animate-spin" />
          <Cpu className="w-6 h-6 text-cyan-400 absolute animate-pulse" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-200">{text}</p>
          <p className="text-xs text-slate-500 mt-0.5">Running neural baseline & cross-project verification models</p>
        </div>
      </div>
    );
  }

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center p-6 gap-3', className)}>
      <Loader2 className={cn('animate-spin text-blue-500', sizes[size])} />
      {text && <span className="text-xs font-medium text-slate-400">{text}</span>}
    </div>
  );
};
