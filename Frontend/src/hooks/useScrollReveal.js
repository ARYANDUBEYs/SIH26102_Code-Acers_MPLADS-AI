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
 * Combines scroll-driven progress over `distance` with smooth time-based interpolation
 * via a high-frequency timer (16ms), guaranteeing slow, silky-smooth progression.
 * When `enabled` is false (e.g., waiting for a connector pointer to reach its destination),
 * target progress remains 0 and only begins animating once `enabled` becomes true.
 */
export function useSmoothScrollProgress(
  distance = 380,
  offset = 0,
  { maxStep = 0.02, enabled = true } = {}
) {
  const ref = useRef(null);
  const [smoothed, setSmoothed] = useState(0);
  const currentRef = useRef(0);
  const targetRef = useRef(0);
  const timerRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const stepTick = () => {
      const diff = targetRef.current - currentRef.current;
      if (Math.abs(diff) > 0.001) {
        const delta = Math.sign(diff) * Math.min(Math.abs(diff), Math.max(0.004, Math.min(Math.abs(diff) * 0.14, maxStep)));
        currentRef.current = Math.max(0, Math.min(1, currentRef.current + delta));
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
      if (!enabled) {
        targetRef.current = 0;
      } else if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const current = windowHeight - rect.top - offset;
        const p = Math.max(0, Math.min(1, current / distance));
        targetRef.current = p;
      }

      if (!timerRef.current && Math.abs(targetRef.current - currentRef.current) > 0.001) {
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
  }, [distance, offset, maxStep, enabled]);

  return [ref, smoothed];
}

/**
 * getStageStyle:
 * Computes inline opacity, translateY, subtle blur, and smooth CSS transitions for a specific
 * sub-stage [start, end] within a container's [0, 1] progress.
 */
export function getStageStyle(progress, start, end, yOffset = 18) {
  const stageProgress = Math.max(0, Math.min(1, (progress - start) / (end - start || 1)));
  const eased = 1 - Math.pow(1 - stageProgress, 3);
  const y = (1 - eased) * yOffset;
  const blur = (1 - eased) * 3.5;

  return {
    opacity: Number(eased.toFixed(3)),
    transform: `translateY(${y.toFixed(2)}px)`,
    filter: blur > 0.15 ? `blur(${blur.toFixed(1)}px)` : 'none',
    pointerEvents: eased < 0.08 ? 'none' : 'auto',
    transition: 'opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1), transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), filter 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
    willChange: 'opacity, transform, filter'
  };
}

/**
 * TypewriterHeading:
 * Reveals heading text from left to right character-by-character with a pulsing cursor
 * during its active progress window [start, end], while keeping layout dimensions stable.
 */
export function TypewriterHeading({
  text,
  progress,
  start = 0.18,
  end = 0.45,
  className = '',
  cursorClassName = 'bg-amber-400'
}) {
  const typingProgress = Math.max(0, Math.min(1, (progress - start) / (end - start || 1)));
  const targetCount = Math.round(typingProgress * text.length);
  const [displayedCount, setDisplayedCount] = useState(targetCount);

  useEffect(() => {
    if (displayedCount === targetCount) return;
    const timer = setInterval(() => {
      setDisplayedCount((prev) => {
        if (prev < targetCount) return prev + 1;
        if (prev > targetCount) return prev - 1;
        return prev;
      });
    }, 32);
    return () => clearInterval(timer);
  }, [targetCount, displayedCount]);

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
 * High-performance wrapper that smoothly fades in, translates up, and de-blurs as you
 * scroll down, and reverses the exact motion (fades out, translates down, blurs) as you scroll up.
 */
export function BidirectionalReveal({
  children,
  className = '',
  distance = 200,
  offset = 0,
  yOffset = 24,
  blurAmount = 6,
  delay = 0,
  enabled = true,
  onAppeared,
  style = {}
}) {
  const [ref, progress] = useSmoothScrollProgress(distance, offset, {
    maxStep: 0.032,
    enabled
  });

  const adjustedProgress = delay > 0
    ? Math.max(0, Math.min(1, (progress - delay * 0.15) / (1 - delay * 0.15 || 1)))
    : progress;

  useEffect(() => {
    if (onAppeared) {
      onAppeared(adjustedProgress >= 0.85);
    }
  }, [adjustedProgress, onAppeared]);

  const opacity = Number(adjustedProgress.toFixed(3));
  const y = (1 - adjustedProgress) * yOffset;
  const blur = (1 - adjustedProgress) * blurAmount;

  return React.createElement(
    'div',
    {
      ref,
      className,
      style: {
        ...style,
        opacity,
        transform: `translateY(${y.toFixed(2)}px)`,
        filter: blur > 0.08 ? `blur(${blur.toFixed(1)}px)` : 'none',
        pointerEvents: opacity < 0.05 ? 'none' : 'auto',
        transition: 'opacity 0.28s cubic-bezier(0.22, 1, 0.36, 1), transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), filter 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: 'opacity, transform, filter'
      }
    },
    children
  );
}
