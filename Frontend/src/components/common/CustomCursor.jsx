import React, { useEffect, useState, useRef } from 'react';

/**
 * Institutional Custom Cursor:
 * Features a high-precision dot inside a smooth tracking circle.
 * Expands dynamically during mouse movement and contracts to compact resting size.
 * Automatically adapts when hovering over interactive elements.
 */
export const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const dotRef = useRef(null);
  const circleRef = useRef(null);
  
  const mousePos = useRef({ x: -100, y: -100 });
  const circlePos = useRef({ x: -100, y: -100 });
  const moveTimeout = useRef(null);
  const animFrameId = useRef(null);

  useEffect(() => {
    // Disable on touch / mobile devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      setIsMoving(true);
      clearTimeout(moveTimeout.current);
      moveTimeout.current = setTimeout(() => {
        setIsMoving(false);
      }, 150);

      // Instantly position the center dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check if hovering over clickable elements
      const target = e.target;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.getAttribute('role') === 'button' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT'
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth physics loop for the outer trailing circle
    const followLoop = () => {
      const ease = 0.18;
      circlePos.current.x += (mousePos.current.x - circlePos.current.x) * ease;
      circlePos.current.y += (mousePos.current.y - circlePos.current.y) * ease;

      if (circleRef.current) {
        circleRef.current.style.transform = `translate3d(${circlePos.current.x}px, ${circlePos.current.y}px, 0)`;
      }

      animFrameId.current = requestAnimationFrame(followLoop);
    };

    animFrameId.current = requestAnimationFrame(followLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      clearTimeout(moveTimeout.current);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  // Compute outer circle sizing based on movement and hover state
  const circleSize = isHovered ? 44 : isMoving ? 34 : 24;
  const circleHalf = circleSize / 2;

  return (
    <div className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden">
      {/* 1. Trailing Outer Ring */}
      <div
        ref={circleRef}
        className="absolute top-0 left-0 transition-[width,height,border-color,background-color] duration-200 ease-out rounded-full border will-change-transform"
        style={{
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          marginTop: `-${circleHalf}px`,
          marginLeft: `-${circleHalf}px`,
          borderColor: isHovered
            ? 'rgba(245, 158, 11, 0.85)' // Amber accent on interactive
            : isMoving
            ? 'rgba(14, 165, 233, 0.75)' // Cyan glow during motion
            : 'rgba(11, 37, 69, 0.65)',  // Institutional Navy at rest
          backgroundColor: isHovered
            ? 'rgba(245, 158, 11, 0.12)'
            : isMoving
            ? 'rgba(56, 189, 248, 0.08)'
            : 'rgba(11, 37, 69, 0.04)',
          boxShadow: isHovered
            ? '0 0 12px rgba(245, 158, 11, 0.3)'
            : isMoving
            ? '0 0 10px rgba(56, 189, 248, 0.25)'
            : 'none',
        }}
      />

      {/* 2. Precision Center Dot */}
      <div
        ref={dotRef}
        className="absolute top-0 left-0 -mt-1 -ml-1 w-2 h-2 rounded-full will-change-transform transition-colors duration-150"
        style={{
          backgroundColor: isHovered ? '#f59e0b' : '#0B2545',
          boxShadow: isHovered ? '0 0 6px #f59e0b' : '0 0 4px rgba(11, 37, 69, 0.5)',
        }}
      />
    </div>
  );
};
