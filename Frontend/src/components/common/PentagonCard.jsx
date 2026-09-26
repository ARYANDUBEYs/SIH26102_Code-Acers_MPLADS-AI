import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const PentagonCard = ({
  children,
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  variant = 'default',
  borderColor,
  bgColor,
  className = '',
  contentClassName = '',
  onClick,
  index = 0,
  animate = true,
  inView = false,
  viewport = { once: true, amount: 0.2 },
}) => {
  // Institutional styling variants matching SIH / MoSPI visual identity
  const variantStyles = {
    default: {
      stroke: '#64748b',
      bg: 'bg-white',
      value: 'text-slate-900',
      iconBg: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    purple: {
      stroke: '#7e22ce',
      bg: 'bg-white',
      value: 'text-[#2E1065]',
      iconBg: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    blue: {
      stroke: '#7e22ce', // purple brand theme
      bg: 'bg-white',
      value: 'text-[#2E1065]',
      iconBg: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    danger: {
      stroke: '#e11d48',
      bg: 'bg-white',
      value: 'text-rose-700',
      iconBg: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    warning: {
      stroke: '#d97706',
      bg: 'bg-white',
      value: 'text-amber-800',
      iconBg: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    success: {
      stroke: '#059669',
      bg: 'bg-white',
      value: 'text-emerald-700',
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  };

  const style = variantStyles[variant] || variantStyles.default;
  const strokeColor = borderColor || style.stroke;
  const bgClass = bgColor || style.bg;

  // Pentagon coordinates as per Image 3:
  // Edge 4: left vertical (0% 0% to 0% 100%) -> NO border
  // Edge 3: top horizontal (0% 0% to 93% 0%) -> NO border
  // Edge 5: bottom horizontal (0% 100% to 93% 100%) -> NO border
  // Edge 1: top-right slant (93% 0% to 100% 50%) -> BORDER DRAWN
  // Edge 2: bottom-right slant (100% 50% to 93% 100%) -> BORDER DRAWN
  const clipPathStyle = {
    clipPath: 'polygon(0% 0%, 93% 0%, 100% 50%, 93% 100%, 0% 100%)',
    WebkitClipPath: 'polygon(0% 0%, 93% 0%, 100% 50%, 93% 100%, 0% 100%)',
  };

  const MotionWrapper = animate ? motion.div : 'div';
  const motionProps = animate
    ? inView
      ? {
          initial: { opacity: 0, x: -60 },
          whileInView: { opacity: 1, x: 0 },
          viewport,
          transition: {
            duration: 0.7,
            delay: 0.08 + index * 0.18,
            ease: [0.22, 1, 0.36, 1],
          },
        }
      : {
          initial: { opacity: 0, x: -50 },
          animate: { opacity: 1, x: 0 },
          transition: {
            duration: 0.65,
            delay: 0.06 + index * 0.18,
            ease: [0.22, 1, 0.36, 1],
          },
        }
    : {};

  return (
    <MotionWrapper
      {...motionProps}
      onClick={onClick}
      className={cn(
        'relative rounded-2xl border shadow-xs hover:shadow-sm transition-all duration-200 select-none overflow-hidden group',
        bgClass,
        onClick && 'cursor-pointer hover:-translate-y-0.5',
        className
      )}
      style={{ borderColor: strokeColor ? `${strokeColor}40` : undefined }}
    >
      <div
        className={cn(
          'relative w-full h-full min-h-[112px] p-5 sm:p-6 flex flex-col justify-between',
          contentClassName
        )}
      >
        {/* Content */}
        {children ? (
          children
        ) : Icon ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
                {title}
              </p>

              <div className={cn('p-2 rounded-xl border shrink-0', style.iconBg)}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-2.5">
              <h3 className={cn('text-2xl sm:text-3xl font-black font-mono tracking-tight truncate', style.value)}>
                {value}
              </h3>
            </div>

            <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
              {trend && (
                <div className="flex items-center gap-1 font-semibold text-xs shrink-0">
                  {trendPositive ? (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                  )}
                  <span className={trendPositive ? 'text-emerald-700' : 'text-rose-700'}>
                    {trend}
                  </span>
                </div>
              )}
              {subtitle && (
                <span className="text-slate-500 truncate text-xs font-medium ml-auto text-right">
                  {subtitle}
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-between h-full space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 leading-tight">
              {title}
            </p>
            <h3 className={cn('text-2xl sm:text-3xl font-black font-mono tracking-tight leading-tight whitespace-nowrap', style.value)}>
              {value}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-500 font-medium truncate pt-1 border-t border-slate-100">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>
    </MotionWrapper>
  );
};
