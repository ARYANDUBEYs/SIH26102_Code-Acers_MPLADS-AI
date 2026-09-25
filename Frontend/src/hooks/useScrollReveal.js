import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * useScrollReveal:
 * Calculates a normalized progress value [0, 1] as an element enters from the bottom
 * of the viewport when scrolling down, and reverses [1 -> 0] as the element exits
 * towards the bottom when scrolling up.
 *
 * - When element is below the viewport: progress = 0 (completely hidden/disappeared)
 * - As user scrolls down and element enters: progress increases smoothly from 0 to 1 (appears slowly)
 * - When element is comfortably in view or scrolled above viewport: progress = 1 (remains visible)
 * - When user scrolls back up and element approaches the bottom to exit: progress decreases smoothly from 1 to 0 (disappears slowly in reverse)
 */
export function useScrollReveal(distance = 240, offset = 0) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  const rafId = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const handleScroll = () => {
      if (rafId.current) return;
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        // Distance from bottom of viewport:
        const current = windowHeight - rect.top - offset;
        const p = Math.max(0, Math.min(1, current / distance));
        setProgress(p);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [distance, offset]);

  return [ref, progress];
}

/**
 * BidirectionalReveal:
 * High-performance wrapper that smoothly fades in, translates up, and de-blurs as you
 * scroll down, and reverses the exact motion (fades out, translates down, blurs) as you scroll up.
 */
export function BidirectionalReveal({
  children,
  className = '',
  distance = 240,
  offset = 0,
  yOffset = 24,
  blurAmount = 8,
  delay = 0,
  style = {}
}) {
  const [ref, progress] = useScrollReveal(distance, offset);

  // If delay is provided, smoothly offset progress
  const adjustedProgress = delay > 0
    ? Math.max(0, Math.min(1, (progress - delay * 0.15) / (1 - delay * 0.15 || 1)))
    : progress;

  const opacity = adjustedProgress;
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
        filter: blur > 0.05 ? `blur(${blur.toFixed(1)}px)` : 'none',
        pointerEvents: opacity < 0.05 ? 'none' : 'auto',
        transition: 'opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), filter 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'opacity, transform, filter'
      }
    },
    children
  );
}

