import React from 'react';
import { getRiskMeta, cn } from '../../utils/helpers';
import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';

export const RiskGauge = ({
  score = 0,
  size = 180,
  strokeWidth = 14,
  showLabel = true,
  title = 'AI Risk Score',
  className = '',
}) => {
  const meta = getRiskMeta(score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Semi-circular or 270 degree arc gauge
  const progress = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn('flex flex-col items-center justify-center relative select-none', className)}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1E293B"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Risk Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={meta.hex}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          <span className="text-3xl font-extrabold font-mono text-slate-100 tracking-tight">
            {score}
            <span className="text-xs font-normal text-slate-400 font-sans">/100</span>
          </span>
          <span
            className="text-xs font-bold uppercase tracking-wider mt-0.5 px-2 py-0.5 rounded"
            style={{ color: meta.hex, backgroundColor: `${meta.hex}18` }}
          >
            {meta.label}
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="mt-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {score >= 86
              ? 'Critical anomaly patterns detected'
              : score >= 61
              ? 'High operational or cost discrepancy'
              : score >= 31
              ? 'Moderate variance, periodic review'
              : 'Routine baseline parameters normal'}
          </p>
        </div>
      )}
    </div>
  );
};
