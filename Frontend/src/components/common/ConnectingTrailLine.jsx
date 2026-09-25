import React from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useScrollReveal';

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
 * - Originates at the bottom border of Live Surveillance (x = 50%, y = 0).
 * - Moves straight down to y = 45%.
 * - Takes a turn towards LEFT to the horizontal center of the Indicators container (x = 28.67% = 344px).
 * - Moves down and connects directly into the top border of National Indicators (y = 100%).
 * - Retracts in reverse motion when scrolling up.
 */
export const ConnectorLine1 = () => {
  const [containerRef, progress] = useScrollReveal(180, 0);

  // Path segments: (600, 0) -> (600, 45) -> (344, 45) -> (344, 100)
  // Lengths: 45, 256, 55. Total = 356.
  const t1 = 0.126;
  const t2 = 0.845;
  let pointerLeft = '50%';
  let pointerTop = '0%';

  if (progress <= t1) {
    pointerLeft = '50%';
    const sub = t1 > 0 ? progress / t1 : 0;
    pointerTop = `${sub * 45}%`;
  } else if (progress <= t2) {
    const sub = (progress - t1) / (t2 - t1);
    pointerLeft = `${50 - sub * (50 - 28.67)}%`;
    pointerTop = '45%';
  } else {
    const sub = (progress - t2) / (1 - t2);
    pointerLeft = '28.67%';
    pointerTop = `${45 + sub * 55}%`;
  }

  const pointerOpacity = progress === 0 ? 0 : Math.min(1, progress * 4);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-24 -mt-[3px] -mb-[3px] z-20 overflow-visible pointer-events-none"
    >
      <div className="relative w-full h-full">
        <svg
          viewBox="0 0 1200 100"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          <motion.path
            d="M 600 0 L 600 45 L 344 45 L 344 100"
            fill="none"
            stroke="#2E1065"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: progress }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
          />
        </svg>

        {/* Single Moving Head Pointer - Follows path forward on scroll down, reverses on scroll up */}
        <motion.div
          className="absolute pointer-events-none"
          initial={false}
          animate={{
            left: pointerLeft,
            top: pointerTop,
            opacity: pointerOpacity
          }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <RipplingPointer />
        </motion.div>
      </div>
    </div>
  );
};

/**
 * ConnectorLine2:
 * Connects bottom of National Indicators directly to "How it Works?" container.
 * - Originates at the bottom-middle of the National Indicators border (x = 28.67% = 344px, y = 0).
 * - Moves down some distance (y = 45).
 * - Turns RIGHT towards the center of "How it Works?" (x = 50% = 600px).
 * - Moves straight down to y = 100%, connecting directly into the top-center border of "How it Works?".
 * - Retracts in reverse motion when scrolling up.
 */
export const ConnectorLine2 = () => {
  const [containerRef, progress] = useScrollReveal(180, 0);

  // Path segments: (344, 0) -> (344, 45) -> (600, 45) -> (600, 100)
  // Lengths: 45, 256, 55. Total = 356.
  const t1 = 0.126;
  const t2 = 0.845;
  let pointerLeft = '28.67%';
  let pointerTop = '0%';

  if (progress <= t1) {
    pointerLeft = '28.67%';
    const sub = t1 > 0 ? progress / t1 : 0;
    pointerTop = `${sub * 45}%`;
  } else if (progress <= t2) {
    const sub = (progress - t1) / (t2 - t1);
    pointerLeft = `${28.67 + sub * (50 - 28.67)}%`;
    pointerTop = '45%';
  } else {
    const sub = (progress - t2) / (1 - t2);
    pointerLeft = '50%';
    pointerTop = `${45 + sub * 55}%`;
  }

  const pointerOpacity = progress === 0 ? 0 : Math.min(1, progress * 4);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-24 -mt-[3px] -mb-[3px] z-20 overflow-visible pointer-events-none"
    >
      <div className="relative w-full h-full">
        <svg
          viewBox="0 0 1200 100"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          <motion.path
            d="M 344 0 L 344 45 L 600 45 L 600 100"
            fill="none"
            stroke="#2E1065"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: progress }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
          />
        </svg>

        {/* Moving Head Pointer that reverses on scroll up */}
        <motion.div
          className="absolute pointer-events-none"
          initial={false}
          animate={{
            left: pointerLeft,
            top: pointerTop,
            opacity: pointerOpacity
          }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <RipplingPointer />
        </motion.div>
      </div>
    </div>
  );
};

/**
 * ConnectorLine3:
 * Starts directly from bottom-center of "How it Works?" container border (x = 50%, y = 0).
 * Moves down, then splits into THREE branches connecting directly into the top borders of the three pillars:
 * - Branch Left (x = 16% = 192px): into Pillar 1 "1. Evidence & Fraud Checks"
 * - Branch Center (x = 50% = 600px): into Pillar 2 "2. AI Risk Scoring Models"
 * - Branch Right (x = 84% = 1008px): into Pillar 3 "3. Interactive Dashboards & Voice AI"
 * - Retracts in reverse motion when scrolling up.
 */
export const ConnectorLine3 = () => {
  const [containerRef, progress] = useScrollReveal(200, 0);

  // When progress <= 0.4: stem draws from y = 0 to 45
  // When progress > 0.4: branches draw down to 100
  const stemProgress = Math.min(1, progress / 0.4);
  const branchProgress = progress <= 0.4 ? 0 : (progress - 0.4) / 0.6;

  // Center pointer
  const centerPointerTop = progress <= 0.4
    ? `${stemProgress * 45}%`
    : `${45 + branchProgress * 55}%`;

  // Left pointer
  let leftPointerX = '50%';
  let leftPointerY = '45%';
  if (branchProgress <= 0.6) {
    const sub = branchProgress / 0.6;
    leftPointerX = `${50 - sub * (50 - 16)}%`;
    leftPointerY = '45%';
  } else {
    const sub = (branchProgress - 0.6) / 0.4;
    leftPointerX = '16%';
    leftPointerY = `${45 + sub * 55}%`;
  }

  // Right pointer
  let rightPointerX = '50%';
  let rightPointerY = '45%';
  if (branchProgress <= 0.6) {
    const sub = branchProgress / 0.6;
    rightPointerX = `${50 + sub * (84 - 50)}%`;
    rightPointerY = '45%';
  } else {
    const sub = (branchProgress - 0.6) / 0.4;
    rightPointerX = '84%';
    rightPointerY = `${45 + sub * 55}%`;
  }

  const mainOpacity = progress === 0 ? 0 : Math.min(1, progress * 4);
  const branchPointersOpacity = branchProgress === 0 ? 0 : Math.min(1, branchProgress * 3);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-24 -mt-[3px] -mb-[3px] z-20 overflow-visible pointer-events-none"
    >
      <div className="relative w-full h-full">
        <svg
          viewBox="0 0 1200 100"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          {/* Center Stem: (600, 0) -> (600, 45) */}
          <motion.path
            d="M 600 0 L 600 45"
            fill="none"
            stroke="#2E1065"
            strokeWidth="4.5"
            strokeLinecap="round"
            initial={false}
            animate={{ pathLength: stemProgress }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
          />

          {/* Center Continuation: (600, 45) -> (600, 100) */}
          <motion.path
            d="M 600 45 L 600 100"
            fill="none"
            stroke="#2E1065"
            strokeWidth="4.5"
            strokeLinecap="round"
            initial={false}
            animate={{ pathLength: branchProgress }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
          />

          {/* Left Branch: (600, 45) -> (192, 45) -> (192, 100) */}
          <motion.path
            d="M 600 45 L 192 45 L 192 100"
            fill="none"
            stroke="#2E1065"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: branchProgress }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
          />

          {/* Right Branch: (600, 45) -> (1008, 45) -> (1008, 100) */}
          <motion.path
            d="M 600 45 L 1008 45 L 1008 100"
            fill="none"
            stroke="#2E1065"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: branchProgress }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
          />
        </svg>

        {/* Three Pointers resting on the top borders of the three pillars */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {/* Left Pointer */}
          <motion.div
            className="absolute"
            initial={false}
            animate={{
              left: leftPointerX,
              top: leftPointerY,
              opacity: branchPointersOpacity
            }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <RipplingPointer />
          </motion.div>

          {/* Center Pointer */}
          <motion.div
            className="absolute"
            initial={false}
            animate={{
              left: '50%',
              top: centerPointerTop,
              opacity: mainOpacity
            }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <RipplingPointer />
          </motion.div>

          {/* Right Pointer */}
          <motion.div
            className="absolute"
            initial={false}
            animate={{
              left: rightPointerX,
              top: rightPointerY,
              opacity: branchPointersOpacity
            }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <RipplingPointer />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
