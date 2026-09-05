import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * 1. Aeroplane Fly-Through Arrow Icon
 * Moves right, disappears at border, reappears from left back to center.
 */
export const AeroplaneArrow = ({ className = "w-4 h-4 text-white" }) => {
  return (
    <span className="relative inline-flex items-center justify-center overflow-hidden w-4 h-4 shrink-0">
      <motion.svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        initial={{ x: 0, opacity: 1 }}
        whileHover={{
          x: [0, 18, -18, 0],
          opacity: [1, 0, 0, 1],
          transition: {
            duration: 0.65,
            times: [0, 0.45, 0.55, 1],
            ease: "easeInOut"
          }
        }}
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </motion.svg>
    </span>
  );
};

/**
 * 2. Aeroplane Fly-Through Paper Plane
 * Tilts and flies out top-right, reappears from bottom-left back to center.
 */
export const AeroplaneSend = ({ className = "w-5 h-5 text-amber-700" }) => {
  return (
    <span className="relative inline-flex items-center justify-center overflow-hidden w-6 h-6 shrink-0">
      <motion.svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
        whileHover={{
          x: [0, 22, -22, 0],
          y: [0, -16, 16, 0],
          opacity: [1, 0, 0, 1],
          rotate: [0, 15, -15, 0],
          transition: {
            duration: 0.75,
            times: [0, 0.45, 0.55, 1],
            ease: "easeInOut"
          }
        }}
      >
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </motion.svg>
    </span>
  );
};

/**
 * 3. Animated Eye with moving iris turning Red
 */
export const AnimatedEye = ({ className = "w-4 h-4 text-cyan-300" }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      className="relative inline-flex items-center justify-center w-5 h-5 shrink-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        {/* Eye contour */}
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        
        {/* Iris & Pupil with horizontal wander and red color shift */}
        <motion.circle
          cx="12"
          cy="12"
          r="3"
          animate={
            isHovered
              ? {
                  cx: [12, 15, 9, 12],
                  fill: ['rgba(239,68,68,0)', 'rgba(239,68,68,1)', 'rgba(239,68,68,1)', 'rgba(239,68,68,0.9)'],
                  stroke: ['currentColor', '#ef4444', '#ef4444', '#ef4444']
                }
              : { cx: 12, fill: 'rgba(0,0,0,0)', stroke: 'currentColor' }
          }
          transition={{ duration: 0.7, repeat: isHovered ? Infinity : 0, repeatDelay: 0.2 }}
        />
      </svg>
    </span>
  );
};

/**
 * 4. Voice AI Equalizer Soundwave
 * 4 bars animating low to high smoothly on hover.
 */
export const AnimatedVoice = ({ className = "w-5 h-5 text-emerald-700" }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative inline-flex items-center justify-center gap-[2.5px] h-5 w-6 px-0.5 shrink-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.span
        className="w-[3px] bg-emerald-600 rounded-full"
        animate={isHovered ? { height: ['6px', '16px', '8px', '6px'] } : { height: '8px' }}
        transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0, ease: 'easeInOut' }}
      />
      <motion.span
        className="w-[3px] bg-emerald-600 rounded-full"
        animate={isHovered ? { height: ['12px', '6px', '18px', '12px'] } : { height: '14px' }}
        transition={{ duration: 0.45, repeat: isHovered ? Infinity : 0, ease: 'easeInOut', delay: 0.1 }}
      />
      <motion.span
        className="w-[3px] bg-emerald-600 rounded-full"
        animate={isHovered ? { height: ['8px', '18px', '10px', '8px'] } : { height: '10px' }}
        transition={{ duration: 0.55, repeat: isHovered ? Infinity : 0, ease: 'easeInOut', delay: 0.15 }}
      />
      <motion.span
        className="w-[3px] bg-emerald-600 rounded-full"
        animate={isHovered ? { height: ['14px', '8px', '16px', '14px'] } : { height: '6px' }}
        transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0, ease: 'easeInOut', delay: 0.05 }}
      />
    </div>
  );
};

/**
 * 5. Alert Triangle with Elastic Popping Exclamation Mark
 */
export const AnimatedAlertTriangle = ({ className = "w-5 h-5 text-rose-700" }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative inline-flex items-center justify-center w-6 h-6 shrink-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        
        {/* Popping exclamation line and dot */}
        <motion.line
          x1="12"
          y1="9"
          x2="12"
          y2="13"
          stroke="#e11d48"
          strokeWidth="2.5"
          animate={
            isHovered
              ? {
                  scaleY: [1, 1.45, 0.9, 1.25],
                  y: [-1, -3, 0, -2],
                  stroke: ['#e11d48', '#ff0033', '#e11d48']
                }
              : { scaleY: 1, y: 0 }
          }
          transition={{ duration: 0.4, ease: 'backOut' }}
        />
        <motion.circle
          cx="12"
          cy="17"
          r="0.8"
          fill="#e11d48"
          stroke="#e11d48"
          animate={
            isHovered
              ? {
                  scale: [1, 1.6, 1],
                  fill: ['#e11d48', '#ff0033', '#e11d48']
                }
              : { scale: 1 }
          }
          transition={{ duration: 0.35, ease: 'backOut', delay: 0.1 }}
        />
      </svg>
    </div>
  );
};

/**
 * 6. Document FileText with Sequential Drawing Lines
 */
export const AnimatedFileText = ({ className = "w-5 h-5 text-blue-700" }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative inline-flex items-center justify-center w-6 h-6 shrink-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        
        {/* 3 Sequential Drawing Lines */}
        <motion.line
          x1="16"
          y1="13"
          x2="8"
          y2="13"
          stroke="#1d4ed8"
          animate={
            isHovered
              ? { pathLength: [0, 1], opacity: [0, 1] }
              : { pathLength: 1, opacity: 1 }
          }
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
        <motion.line
          x1="16"
          y1="17"
          x2="8"
          y2="17"
          stroke="#1d4ed8"
          animate={
            isHovered
              ? { pathLength: [0, 1], opacity: [0, 1] }
              : { pathLength: 1, opacity: 1 }
          }
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.15 }}
        />
        <motion.line
          x1="10"
          y1="9"
          x2="8"
          y2="9"
          stroke="#1d4ed8"
          animate={
            isHovered
              ? { pathLength: [0, 1], opacity: [0, 1] }
              : { pathLength: 1, opacity: 1 }
          }
          transition={{ duration: 0.25, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
    </div>
  );
};
