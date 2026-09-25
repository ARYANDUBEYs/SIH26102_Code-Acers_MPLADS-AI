import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { useSmoothScrollProgress } from '../../hooks/useScrollReveal';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * usePathPoint:
 * Measures the exact SVG curved path and computes both the strokeDashoffset
 * and the exact (x, y) percentage coordinates of the leading pointer tip.
 * Guarantees the pointer glides smoothly around rounded Bezier turns without sharp corners.
 */
function usePathPoint(pathRef, progress, defaultX = '50%', defaultY = '0%') {
  const [metrics, setMetrics] = useState({
    left: defaultX,
    top: defaultY,
    totalLength: 1000,
    dashOffset: 1000
  });

  useIsomorphicLayoutEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    try {
      const len = el.getTotalLength();
      if (len > 0) {
        const clamped = Math.max(0, Math.min(1, progress));
        const pt = el.getPointAtLength(clamped * len);
        setMetrics({
          left: `${((pt.x / 1200) * 100).toFixed(2)}%`,
          top: `${((pt.y / 100) * 100).toFixed(2)}%`,
          totalLength: len,
          dashOffset: len * (1 - clamped)
        });
      }
    } catch (_) {
      // Safe fallback prior to SVG layout
    }
  }, [progress, defaultX, defaultY]);

  return metrics;
}

/**
 * RipplingPointer:
 * A prominent luminous head node that emits outward-radiating capillary ripples.
 * Styled as a thick institutional junction node that looks integral to the container border.
 */
export const RipplingPointer = ({ className = '' }) => (
  <div className={`relative flex items-center justify-center pointer-events-none ${className}`}>
    {/* 3 Staggered Thick Outward Capillary Ripple Waves */}
    <div className="pointer-ripple-ring" style={{ animationDelay: '0s' }} />
    <div className="pointer-ripple-ring" style={{ animationDelay: '0.7s' }} />
    <div className="pointer-ripple-ring" style={{ animationDelay: '1.4s' }} />

    {/* Big Luminous Core Bead - Thick white border, deep purple gradient */}
    <div className="relative z-10 w-6 h-6 rounded-full bg-gradient-to-tr from-[#2E1065] via-[#7e22ce] to-[#c084fc] shadow-[0_0_18px_rgba(147,51,234,0.95)] border-[3px] border-white flex items-center justify-center">
      <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
    </div>
  </div>
);

/**
 * ConnectorLine1:
 * Connects Live Surveillance bottom-center directly to National Developmental Indicators.
 * - canStart: only starts drawing after Live Surveillance is fully visible.
 * - onDestinationReached: notifies when the pointer hits the top border of National Indicators.
 */
export const ConnectorLine1 = ({ canStart = true, onDestinationReached }) => {
  const [containerRef, effectiveProgress] = useSmoothScrollProgress(140, 0, {
    maxStep: 0.022,
    enabled: canStart
  });

  const pathRef = useRef(null);
  const { left, top, totalLength, dashOffset } = usePathPoint(pathRef, effectiveProgress, '50%', '0%');
  const pointerOpacity = effectiveProgress <= 0.01 ? 0 : Math.min(1, effectiveProgress * 5);

  useEffect(() => {
    if (onDestinationReached) {
      onDestinationReached(effectiveProgress >= 0.94);
    }
  }, [effectiveProgress, onDestinationReached]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 sm:h-28 -mt-[3px] -mb-[3px] z-20 overflow-visible pointer-events-none"
    >
      <div className="relative w-full h-full">
        <svg
          viewBox="0 0 1200 100"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          <path
            ref={pathRef}
            d="M 600 0 L 600 22 Q 600 48 558 48 L 386 48 Q 344 48 344 74 L 344 100"
            fill="none"
            stroke="#2E1065"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={totalLength}
            strokeDashoffset={dashOffset}
          />
        </svg>

        {/* Single Moving Head Pointer locked to the curved path tip */}
        <div
          className="absolute pointer-events-none"
          style={{
            left,
            top,
            opacity: pointerOpacity,
            transform: 'translate(-50%, -50%)',
            willChange: 'left, top, opacity'
          }}
        >
          <RipplingPointer />
        </div>
      </div>
    </div>
  );
};

/**
 * ConnectorLine2:
 * Connects bottom of National Indicators directly to "How it Works?" container.
 * - canStart: only starts drawing after National Indicators is visible.
 * - onDestinationReached: notifies when the pointer hits the top border of "How it Works?".
 */
export const ConnectorLine2 = ({ canStart = true, onDestinationReached }) => {
  const [containerRef, effectiveProgress] = useSmoothScrollProgress(140, 0, {
    maxStep: 0.022,
    enabled: canStart
  });

  const pathRef = useRef(null);
  const { left, top, totalLength, dashOffset } = usePathPoint(pathRef, effectiveProgress, '28.67%', '0%');
  const pointerOpacity = effectiveProgress <= 0.01 ? 0 : Math.min(1, effectiveProgress * 5);

  useEffect(() => {
    if (onDestinationReached) {
      onDestinationReached(effectiveProgress >= 0.94);
    }
  }, [effectiveProgress, onDestinationReached]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 sm:h-28 -mt-[3px] -mb-[3px] z-20 overflow-visible pointer-events-none"
    >
      <div className="relative w-full h-full">
        <svg
          viewBox="0 0 1200 100"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          <path
            ref={pathRef}
            d="M 344 0 L 344 22 Q 344 48 386 48 L 558 48 Q 600 48 600 74 L 600 100"
            fill="none"
            stroke="#2E1065"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={totalLength}
            strokeDashoffset={dashOffset}
          />
        </svg>

        {/* Single Moving Head Pointer locked to the curved path tip */}
        <div
          className="absolute pointer-events-none"
          style={{
            left,
            top,
            opacity: pointerOpacity,
            transform: 'translate(-50%, -50%)',
            willChange: 'left, top, opacity'
          }}
        >
          <RipplingPointer />
        </div>
      </div>
    </div>
  );
};

/**
 * ConnectorLine3:
 * Starts directly from bottom-center of "How it Works?" container border (x = 50%, y = 0)
 * and splits smoothly with rounded curves into THREE branches connecting to the three boxes.
 * - canStart: only starts drawing after "How it Works?" is in view.
 * - onDestinationReached: notifies when all 3 pointers reach the top borders of the 3 containers.
 */
export const ConnectorLine3 = ({ canStart = true, onDestinationReached }) => {
  const [containerRef, effectiveProgress] = useSmoothScrollProgress(140, 0, {
    maxStep: 0.022,
    enabled: canStart
  });

  const centerPathRef = useRef(null);
  const leftPathRef = useRef(null);
  const rightPathRef = useRef(null);

  const centerMetrics = usePathPoint(centerPathRef, effectiveProgress, '50%', '0%');

  const branchProgress = effectiveProgress <= 0.32 ? 0 : (effectiveProgress - 0.32) / 0.68;
  const leftMetrics = usePathPoint(leftPathRef, branchProgress, '50%', '44%');
  const rightMetrics = usePathPoint(rightPathRef, branchProgress, '50%', '44%');

  const mainOpacity = effectiveProgress <= 0.01 ? 0 : Math.min(1, effectiveProgress * 5);
  const branchOpacity = branchProgress <= 0.01 ? 0 : Math.min(1, branchProgress * 4);

  useEffect(() => {
    if (onDestinationReached) {
      onDestinationReached(branchProgress >= 0.94);
    }
  }, [branchProgress, onDestinationReached]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 sm:h-28 -mt-[3px] -mb-[3px] z-20 overflow-visible pointer-events-none"
    >
      <div className="relative w-full h-full">
        <svg
          viewBox="0 0 1200 100"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          {/* Center Full Path: (600, 0) -> (600, 100) */}
          <path
            ref={centerPathRef}
            d="M 600 0 L 600 100"
            fill="none"
            stroke="#2E1065"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray={centerMetrics.totalLength}
            strokeDashoffset={centerMetrics.dashOffset}
          />

          {/* Left Smooth Curved Branch: (600, 32) -> Q curve -> (192, 100) */}
          <path
            ref={leftPathRef}
            d="M 600 32 Q 600 48 556 48 L 236 48 Q 192 48 192 74 L 192 100"
            fill="none"
            stroke="#2E1065"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={leftMetrics.totalLength}
            strokeDashoffset={leftMetrics.dashOffset}
          />

          {/* Right Smooth Curved Branch: (600, 32) -> Q curve -> (1008, 100) */}
          <path
            ref={rightPathRef}
            d="M 600 32 Q 600 48 644 48 L 964 48 Q 1008 48 1008 74 L 1008 100"
            fill="none"
            stroke="#2E1065"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={rightMetrics.totalLength}
            strokeDashoffset={rightMetrics.dashOffset}
          />
        </svg>

        {/* Three Pointers smoothly gliding along the three curved branches */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {/* Left Pointer */}
          <div
            className="absolute"
            style={{
              left: leftMetrics.left,
              top: leftMetrics.top,
              opacity: branchOpacity,
              transform: 'translate(-50%, -50%)',
              willChange: 'left, top, opacity'
            }}
          >
            <RipplingPointer />
          </div>

          {/* Center Pointer */}
          <div
            className="absolute"
            style={{
              left: centerMetrics.left,
              top: centerMetrics.top,
              opacity: mainOpacity,
              transform: 'translate(-50%, -50%)',
              willChange: 'left, top, opacity'
            }}
          >
            <RipplingPointer />
          </div>

          {/* Right Pointer */}
          <div
            className="absolute"
            style={{
              left: rightMetrics.left,
              top: rightMetrics.top,
              opacity: branchOpacity,
              transform: 'translate(-50%, -50%)',
              willChange: 'left, top, opacity'
            }}
          >
            <RipplingPointer />
          </div>
        </div>
      </div>
    </div>
  );
};
