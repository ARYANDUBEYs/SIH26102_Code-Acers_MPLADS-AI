import React from 'react';

/**
 * 1. Aeroplane Fly-Through Arrow Icon
 * Moves right, disappears at border, reappears from left back to center.
 * Triggers on parent button hover (.group:hover) as well as direct hover.
 */
export const AeroplaneArrow = ({ className = "w-4 h-4 text-white" }) => {
  return (
    <span className="relative inline-flex items-center justify-center overflow-hidden w-4 h-4 shrink-0 pointer-events-none">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${className} group-aeroplane-fly will-change-transform`}
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </span>
  );
};

/**
 * 2. Aeroplane Fly-Through Paper Plane
 * Tilts and flies out top-right, reappears from bottom-left back to center.
 * Triggers on parent button/card hover (.group:hover).
 */
export const AeroplaneSend = ({ className = "w-5 h-5 text-amber-700" }) => {
  return (
    <span className="relative inline-flex items-center justify-center overflow-hidden w-6 h-6 shrink-0 pointer-events-none">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${className} group-paperplane-fly will-change-transform`}
      >
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    </span>
  );
};

/**
 * 3. Animated Eye with moving iris turning Red
 * Triggers when hovering anywhere on the button/card (.group:hover).
 */
export const AnimatedEye = ({ className = "w-4 h-4 text-cyan-300" }) => {
  return (
    <span className="relative inline-flex items-center justify-center w-5 h-5 shrink-0 pointer-events-none">
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
        
        {/* Iris & Pupil with scan animation and red color shift on parent hover */}
        <circle
          cx="12"
          cy="12"
          r="3"
          className="group-eye-scan transition-colors will-change-transform"
        />
      </svg>
    </span>
  );
};

/**
 * 4. Voice AI Equalizer Soundwave
 * 4 bars animating low to high smoothly on parent hover.
 */
export const AnimatedVoice = ({ className = "w-5 h-5 text-emerald-700" }) => {
  return (
    <div className="relative inline-flex items-center justify-center gap-[2.5px] h-5 w-6 px-0.5 shrink-0 pointer-events-none">
      <span className="w-[3px] bg-emerald-600 rounded-full h-2 group-soundbar-1 will-change-transform" />
      <span className="w-[3px] bg-emerald-600 rounded-full h-3.5 group-soundbar-2 will-change-transform" />
      <span className="w-[3px] bg-emerald-600 rounded-full h-2.5 group-soundbar-3 will-change-transform" />
      <span className="w-[3px] bg-emerald-600 rounded-full h-1.5 group-soundbar-4 will-change-transform" />
    </div>
  );
};

/**
 * 5. Alert Triangle with Elastic Popping Exclamation Mark
 * Triggers on parent card hover (.group:hover).
 */
export const AnimatedAlertTriangle = ({ className = "w-5 h-5 text-rose-700" }) => {
  return (
    <div className="relative inline-flex items-center justify-center w-6 h-6 shrink-0 pointer-events-none">
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
        <line
          x1="12"
          y1="9"
          x2="12"
          y2="13"
          stroke="#e11d48"
          strokeWidth="2.5"
          className="group-alert-pop origin-center will-change-transform"
        />
        <circle
          cx="12"
          cy="17"
          r="0.8"
          fill="#e11d48"
          stroke="#e11d48"
          className="group-alert-pop will-change-transform"
        />
      </svg>
    </div>
  );
};

/**
 * 6. Document FileText with Sequential Drawing Lines
 * Triggers on parent card hover (.group:hover).
 */
export const AnimatedFileText = ({ className = "w-5 h-5 text-blue-700" }) => {
  return (
    <div className="relative inline-flex items-center justify-center w-6 h-6 shrink-0 pointer-events-none">
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
        <line
          x1="16"
          y1="13"
          x2="8"
          y2="13"
          stroke="#1d4ed8"
          className="group-line-draw-1 will-change-transform"
        />
        <line
          x1="16"
          y1="17"
          x2="8"
          y2="17"
          stroke="#1d4ed8"
          className="group-line-draw-2 will-change-transform"
        />
        <line
          x1="10"
          y1="9"
          x2="8"
          y2="9"
          stroke="#1d4ed8"
          className="group-line-draw-3 will-change-transform"
        />
      </svg>
    </div>
  );
};
