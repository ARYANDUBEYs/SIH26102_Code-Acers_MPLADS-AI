import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * useScrollReveal:
 * Calculates a normalized progress value [0, 1] as an element enters from the bottom
 * of the viewport when scrolling down, and reverses [1 -> 0] as the element exits
 * towards the bottom when scrolling up.
 */
export function useScrollReveal(distance = 240, offset = 0) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useIsomorphicLayoutEffect(() => {
    const update = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const current = windowHeight - rect.top - offset;
      const p = Math.max(0, Math.min(1, current / distance));
      setProgress(p);
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [distance, offset]);

  return [ref, progress];
}

/**
 * useSmoothScrollProgress:
 * Continuous exponentially-damped scroll progress [0, 1] with ZERO hard snaps or velocity jumps.
 * - Uses a smooth proportional damping factor (`diff * damping`) so slow scrolling is gentle
 *   and fast scrolling glides smoothly to completion in ~220ms without any teleporting or jitter.
 */
export function useSmoothScrollProgress(
  distance = 220,
  offset = 0,
  { damping = 0.14 } = {}
) {
  const ref = useRef(null);
  const [smoothed, setSmoothed] = useState(0);
  const currentRef = useRef(0);
  const targetRef = useRef(0);
  const timerRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    // Initialize to current scroll position on first mount so already-visible elements don't flash
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const current = window.innerHeight - rect.top - offset;
      const initialP = Math.max(0, Math.min(1, current / distance));
      currentRef.current = initialP;
      targetRef.current = initialP;
      setSmoothed(initialP);
    }

    const stepTick = () => {
      const diff = targetRef.current - currentRef.current;
      const absDiff = Math.abs(diff);

      if (absDiff > 0.0015) {
        // Pure continuous exponential damping — no abrupt threshold switches or hard snaps
        const step = Math.sign(diff) * Math.max(0.0035, absDiff * damping);
        const clampedDelta = Math.sign(diff) * Math.min(absDiff, Math.abs(step));
        currentRef.current = Math.max(0, Math.min(1, currentRef.current + clampedDelta));
        setSmoothed(currentRef.current);
      } else {
        if (currentRef.current !== targetRef.current) {
          currentRef.current = targetRef.current;
          setSmoothed(currentRef.current);
        }
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    };

    const updateTarget = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const current = windowHeight - rect.top - offset;
      const p = Math.max(0, Math.min(1, current / distance));
      targetRef.current = p;

      if (!timerRef.current && Math.abs(targetRef.current - currentRef.current) > 0.0015) {
        timerRef.current = setInterval(stepTick, 16);
      }
    };

    window.addEventListener('scroll', updateTarget, { passive: true });
    window.addEventListener('resize', updateTarget, { passive: true });
    updateTarget();

    return () => {
      window.removeEventListener('scroll', updateTarget);
      window.removeEventListener('resize', updateTarget);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [distance, offset, damping]);

  return [ref, smoothed];
}

/**
 * getStageStyle:
 * Computes GPU-accelerated inline opacity and translate3d for a specific
 * sub-stage [start, end] within a container's [0, 1] progress.
 */
export function getStageStyle(progress, start, end, yOffset = 14) {
  const stageProgress = Math.max(0, Math.min(1, (progress - start) / (end - start || 1)));
  // Smooth cubic ease-out
  const eased = 1 - Math.pow(1 - stageProgress, 3);
  const y = (1 - eased) * yOffset;

  return {
    opacity: Number(eased.toFixed(3)),
    transform: `translate3d(0, ${y.toFixed(2)}px, 0)`,
    pointerEvents: eased < 0.08 ? 'none' : 'auto',
    willChange: 'opacity, transform'
  };
}

/**
 * TypewriterHeading:
 * Smoothly reveals heading text from left to right proportional to `progress` in `[start, end]`.
 * Directly maps to the already-smoothed progress so there is no secondary timer fighting the scroll.
 */
export function TypewriterHeading({
  text,
  progress,
  start = 0.18,
  end = 0.48,
  className = '',
  cursorClassName = 'bg-amber-400'
}) {
  const typingProgress = Math.max(0, Math.min(1, (progress - start) / (end - start || 1)));
  const displayedCount = Math.round(typingProgress * text.length);
  const visibleText = text.slice(0, displayedCount);
  const hiddenText = text.slice(displayedCount);
  const isTyping = displayedCount > 0 && displayedCount < text.length;

  return React.createElement(
    'span',
    { className: `relative inline-block ${className}` },
    React.createElement('span', null, visibleText),
    isTyping
      ? React.createElement('span', {
          className: `inline-block w-[2.5px] h-[0.88em] ${cursorClassName} ml-0.5 align-baseline animate-pulse`
        })
      : null,
    React.createElement(
      'span',
      { className: 'opacity-0 select-none pointer-events-none' },
      hiddenText
    )
  );
}

/**
 * BidirectionalReveal:
 * GPU-accelerated wrapper that smoothly fades in and translates up as you
 * scroll down, and reverses the exact motion as you scroll up.
 */
export function BidirectionalReveal({
  children,
  className = '',
  distance = 160,
  offset = 0,
  yOffset = 18,
  delay = 0,
  style = {}
}) {
  const [ref, progress] = useSmoothScrollProgress(distance, offset, {
    damping: 0.15
  });

  const adjustedProgress = delay > 0
    ? Math.max(0, Math.min(1, (progress - delay * 0.15) / (1 - delay * 0.15 || 1)))
    : progress;

  const eased = 1 - Math.pow(1 - adjustedProgress, 3);
  const opacity = Number(eased.toFixed(3));
  const y = (1 - eased) * yOffset;

  return React.createElement(
    'div',
    {
      ref,
      className,
      style: {
        ...style,
        opacity,
        transform: `translate3d(0, ${y.toFixed(2)}px, 0)`,
        pointerEvents: opacity < 0.05 ? 'none' : 'auto',
        willChange: 'opacity, transform'
      }
    },
    children
  );
}
