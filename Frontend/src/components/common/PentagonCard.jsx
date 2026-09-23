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
        'relative select-none transition-all duration-200 group filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)] hover:drop-shadow-[0_4px_8px_rgba(0,0,0,0.09)]',
        onClick && 'cursor-pointer hover:-translate-y-0.5',
        className
      )}
    >
      {/* Pentagon Clipped Body */}
      <div
        style={clipPathStyle}
        className={cn(
          'relative w-full h-full min-h-[98px] pl-3.5 pr-8 sm:pr-9 py-3 sm:py-3.5 flex flex-col justify-between overflow-hidden',
          bgClass,
          contentClassName
        )}
      >
        {/* SVG Border ONLY on Edges 1 and 2 (numbered 1 & 2 in Image 3) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polyline
            points="93,0 100,50 93,100"
            fill="none"
            stroke={strokeColor}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Content */}
        {children ? (
          children
        ) : Icon ? (
          <>
            <div className="flex items-start justify-between gap-2.5">
              <div className="space-y-0.5 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
                  {title}
                </p>
                <h3 className={cn('text-lg sm:text-xl xl:text-[17px] 2xl:text-xl font-black font-mono tracking-tight truncate', style.value)}>
                  {value}
                </h3>
              </div>

              <div className={cn('p-1.5 rounded-md border shrink-0', style.iconBg)}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-100/90 flex items-center justify-between gap-2 text-xs">
              {trend && (
                <div className="flex items-center gap-1 font-medium text-[11px] shrink-0">
                  {trendPositive ? (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                  )}
                  <span className={trendPositive ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}>
                    {trend}
                  </span>
                </div>
              )}
              {subtitle && (
                <span className="text-slate-500 truncate text-[11px] font-medium ml-auto text-right">
                  {subtitle}
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-between h-full space-y-1">
            <p className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-slate-500 leading-tight">
              {title}
            </p>
            <h3 className={cn('text-base sm:text-lg xl:text-lg 2xl:text-xl font-black font-mono tracking-tight leading-tight whitespace-nowrap', style.value)}>
              {value}
            </h3>
            {subtitle && (
              <p className="text-[10px] sm:text-[10.5px] text-slate-500 font-medium truncate">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>
    </MotionWrapper>
  );
};
