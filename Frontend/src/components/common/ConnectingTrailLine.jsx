import React, { useRef, useLayoutEffect, useEffect } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

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
 * applyPathProgress:
 * Updates an SVG <path> strokeDashoffset and its head pointer DOM node directly via refs
 * without triggering any React state re-render.
 */
function applyPathProgress(pathEl, pointerEl, length, progress) {
  if (!pathEl || !length) return;
  const clamped = Math.max(0, Math.min(1, progress));
  pathEl.style.strokeDasharray = `${length}`;
  pathEl.style.strokeDashoffset = `${(length * (1 - clamped)).toFixed(2)}`;

  if (pointerEl) {
    try {
      const pt = pathEl.getPointAtLength(clamped * length);
      const leftPct = ((pt.x / 1200) * 100).toFixed(2);
      const topPct = ((pt.y / 100) * 100).toFixed(2);
      const opacity = clamped <= 0.01 ? 0 : Math.min(1, clamped * 5);
      pointerEl.style.left = `${leftPct}%`;
      pointerEl.style.top = `${topPct}%`;
      pointerEl.style.opacity = `${opacity.toFixed(3)}`;
    } catch (_) {
      // Safe fallback prior to layout
    }
  }
}

/**
 * useDirectPathAnimator:
 * Drives smooth exponentially-damped progress [0, 1] directly onto SVG paths and pointer DOM nodes
 * with zero React re-renders during scroll.
 */
function useDirectPathAnimator(containerRef, distance, offset, onFrame, damping = 0.13) {
  const currentRef = useRef(0);
  const targetRef = useRef(0);
  const timerRef = useRef(null);
  const onFrameRef = useRef(onFrame);
  onFrameRef.current = onFrame;

  useIsomorphicLayoutEffect(() => {
    const stepTick = () => {
      const diff = targetRef.current - currentRef.current;
      const absDiff = Math.abs(diff);

      if (absDiff > 0.0015) {
        const step = Math.sign(diff) * Math.max(0.0035, absDiff * damping);
        const clampedDelta = Math.sign(diff) * Math.min(absDiff, Math.abs(step));
        currentRef.current = Math.max(0, Math.min(1, currentRef.current + clampedDelta));
        onFrameRef.current(currentRef.current);
      } else {
        if (currentRef.current !== targetRef.current) {
          currentRef.current = targetRef.current;
          onFrameRef.current(currentRef.current);
        }
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    };

    const updateTarget = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const current = window.innerHeight - rect.top - offset;
      const p = Math.max(0, Math.min(1, current / distance));
      targetRef.current = p;

      if (!timerRef.current && Math.abs(targetRef.current - currentRef.current) > 0.0015) {
        timerRef.current = setInterval(stepTick, 16);
      }
    };

    // Initial synchronous setup
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const current = window.innerHeight - rect.top - offset;
      const initialP = Math.max(0, Math.min(1, current / distance));
      currentRef.current = initialP;
      targetRef.current = initialP;
      onFrameRef.current(initialP);
    }

    window.addEventListener('scroll', updateTarget, { passive: true });
    window.addEventListener('resize', updateTarget, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateTarget);
      window.removeEventListener('resize', updateTarget);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [containerRef, distance, offset, damping]);
}

/**
 * ConnectorLine1:
 * Connects Live Surveillance bottom-center directly to National Developmental Indicators.
 */
export const ConnectorLine1 = () => {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const pointerRef = useRef(null);
  const lengthRef = useRef(0);

  useIsomorphicLayoutEffect(() => {
    if (pathRef.current) {
      try {
        lengthRef.current = pathRef.current.getTotalLength() || 400;
      } catch (_) {
        lengthRef.current = 400;
      }
    }
  }, []);

  useDirectPathAnimator(containerRef, 135, 55, (progress) => {
    const len = lengthRef.current || (pathRef.current ? pathRef.current.getTotalLength() : 400);
    lengthRef.current = len;
    applyPathProgress(pathRef.current, pointerRef.current, len, progress);
  });

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
          />
        </svg>

        <div
          ref={pointerRef}
          className="absolute pointer-events-none"
          style={{
            left: '50%',
            top: '0%',
            opacity: 0,
            transform: 'translate3d(-50%, -50%, 0)',
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
 */
export const ConnectorLine2 = () => {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const pointerRef = useRef(null);
  const lengthRef = useRef(0);

  useIsomorphicLayoutEffect(() => {
    if (pathRef.current) {
      try {
        lengthRef.current = pathRef.current.getTotalLength() || 400;
      } catch (_) {
        lengthRef.current = 400;
      }
    }
  }, []);

  useDirectPathAnimator(containerRef, 135, 55, (progress) => {
    const len = lengthRef.current || (pathRef.current ? pathRef.current.getTotalLength() : 400);
    lengthRef.current = len;
    applyPathProgress(pathRef.current, pointerRef.current, len, progress);
  });

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
          />
        </svg>

        <div
          ref={pointerRef}
          className="absolute pointer-events-none"
          style={{
            left: '28.67%',
            top: '0%',
            opacity: 0,
            transform: 'translate3d(-50%, -50%, 0)',
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
 */
export const ConnectorLine3 = () => {
  const containerRef = useRef(null);
  const centerPathRef = useRef(null);
  const leftPathRef = useRef(null);
  const rightPathRef = useRef(null);

  const centerPointerRef = useRef(null);
  const leftPointerRef = useRef(null);
  const rightPointerRef = useRef(null);

  const lengthsRef = useRef({ center: 0, left: 0, right: 0 });

  useIsomorphicLayoutEffect(() => {
    try {
      if (centerPathRef.current) lengthsRef.current.center = centerPathRef.current.getTotalLength() || 100;
      if (leftPathRef.current) lengthsRef.current.left = leftPathRef.current.getTotalLength() || 480;
      if (rightPathRef.current) lengthsRef.current.right = rightPathRef.current.getTotalLength() || 480;
    } catch (_) {
      lengthsRef.current = { center: 100, left: 480, right: 480 };
    }
  }, []);

  useDirectPathAnimator(containerRef, 135, 55, (progress) => {
    const cLen = lengthsRef.current.center || (centerPathRef.current ? centerPathRef.current.getTotalLength() : 100);
    const lLen = lengthsRef.current.left || (leftPathRef.current ? leftPathRef.current.getTotalLength() : 480);
    const rLen = lengthsRef.current.right || (rightPathRef.current ? rightPathRef.current.getTotalLength() : 480);
    lengthsRef.current = { center: cLen, left: lLen, right: rLen };

    applyPathProgress(centerPathRef.current, centerPointerRef.current, cLen, progress);

    const branchProgress = progress <= 0.32 ? 0 : (progress - 0.32) / 0.68;
    applyPathProgress(leftPathRef.current, leftPointerRef.current, lLen, branchProgress);
    applyPathProgress(rightPathRef.current, rightPointerRef.current, rLen, branchProgress);
  });

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-28 sm:h-32 -mt-[3px] -mb-[3px] z-20 overflow-visible pointer-events-none"
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
          />
        </svg>

        {/* Left Moving Head Pointer */}
        <div
          ref={leftPointerRef}
          className="absolute pointer-events-none hidden lg:block"
          style={{
            left: '50%',
            top: '32%',
            opacity: 0,
            transform: 'translate3d(-50%, -50%, 0)',
            willChange: 'left, top, opacity'
          }}
        >
          <RipplingPointer />
        </div>

        {/* Center Moving Head Pointer */}
        <div
          ref={centerPointerRef}
          className="absolute pointer-events-none"
          style={{
            left: '50%',
            top: '0%',
            opacity: 0,
            transform: 'translate3d(-50%, -50%, 0)',
            willChange: 'left, top, opacity'
          }}
        >
          <RipplingPointer />
        </div>

        {/* Right Moving Head Pointer */}
        <div
          ref={rightPointerRef}
          className="absolute pointer-events-none hidden lg:block"
          style={{
            left: '50%',
            top: '32%',
            opacity: 0,
            transform: 'translate3d(-50%, -50%, 0)',
            willChange: 'left, top, opacity'
          }}
        >
          <RipplingPointer />
        </div>
      </div>
    </div>
  );
};
