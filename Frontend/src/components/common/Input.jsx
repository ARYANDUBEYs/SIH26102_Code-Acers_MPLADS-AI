import React, { forwardRef } from 'react';
import { cn } from '../../utils/helpers';

export const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  variant = 'light',
  className = '',
  wrapperClassName = '',
  type = 'text',
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const isDark = variant === 'dark';

  return (
    <div className={cn('w-full flex flex-col gap-1.5', wrapperClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            'text-xs font-semibold tracking-wider uppercase',
            isDark ? 'text-slate-300' : 'text-gov-slateDark'
          )}
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className={cn('absolute left-3 pointer-events-none flex items-center justify-center', isDark ? 'text-slate-400' : 'text-gov-muted')}>
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            'w-full rounded-lg px-3.5 py-2 text-sm transition-colors',
            isDark
              ? 'bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-slate-950'
              : 'bg-white border border-gov-border text-gov-slateDark placeholder-gov-muted focus:outline-none focus:ring-2 focus:ring-gov-navy focus:border-gov-navy disabled:opacity-50 disabled:bg-gov-canvas',
            Icon && 'pl-9',
            error && 'border-rose-500 focus:ring-rose-500 focus:border-rose-500',
            className
          )}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
      {helperText && !error && (
        <span className={cn('text-xs', isDark ? 'text-slate-400' : 'text-gov-muted')}>{helperText}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
