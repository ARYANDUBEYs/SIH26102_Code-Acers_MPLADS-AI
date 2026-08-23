import React, { forwardRef } from 'react';
import { cn } from '../../utils/helpers';

export const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  wrapperClassName = '',
  type = 'text',
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={cn('w-full flex flex-col gap-1.5', wrapperClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            'w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'disabled:opacity-50 disabled:bg-slate-950 disabled:cursor-not-allowed',
            Icon && 'pl-9',
            error && 'border-rose-500 focus:ring-rose-500 focus:border-rose-500',
            className
          )}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-rose-400 font-medium">{error}</span>}
      {helperText && !error && <span className="text-xs text-slate-400">{helperText}</span>}
    </div>
  );
});

Input.displayName = 'Input';
