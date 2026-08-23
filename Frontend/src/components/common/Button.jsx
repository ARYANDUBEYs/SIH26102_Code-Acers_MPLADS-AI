import React from 'react';
import { cn } from '../../utils/helpers';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-lg';

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 active:scale-[0.98]',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-[0.98]',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 active:scale-[0.98]',
    warning: 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold shadow-md active:scale-[0.98]',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 active:scale-[0.98]',
    outline: 'bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-800/60 hover:text-white',
    ghost: 'bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white',
    glow: 'bg-blue-600 hover:bg-blue-500 text-white shadow-glow-blue active:scale-[0.98]',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
    xl: 'text-lg px-6 py-3 gap-3',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
};
