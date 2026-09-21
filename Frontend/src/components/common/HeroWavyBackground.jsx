import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const HERO_IMAGES = [
  {
    id: 'image-1',
    src: '/hero-bg-1.jpg',
    fallback: 'https://images.hindustantimes.com/rf/image_size_960x540/HT/p2/2020/01/19/Pictures/_4d4de590-3a28-11ea-a49c-dfdc60e78d98.jpg',
    alt: 'Parliament Complex Central Vista'
  },
  {
    id: 'image-2',
    src: '/hero-bg-2.jpg',
    fallback: 'https://www.studiomatrx.org/guides/new-parliament-central-vista/hero.jpg',
    alt: 'Indian Parliament House Building'
  }
];

const CYCLE_DURATION_SEC = 14; // Duration of one complete to-and-fro cycle

export const HeroWavyBackground = () => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Switch image after one complete cycle of to-and-fro motion
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImageIndex((prev) => (prev === 0 ? 1 : 0));
    }, CYCLE_DURATION_SEC * 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
      {/* SVG ClipPath Definitions matching the exact wave geometry from reference image */}
      <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
        <defs>
          {/* Main Wave: covers from top down to the curved bottom edge just before Live Surveillance */}
          <clipPath id="heroWaveClip" clipPathUnits="objectBoundingBox">
            <path d="
              M 0,0 
              L 1,0 
              L 1,0.90 
              C 0.94,0.915 0.88,0.925 0.82,0.925 
              C 0.74,0.925 0.66,0.89 0.58,0.88 
              C 0.52,0.875 0.44,0.865 0.38,0.87 
              C 0.30,0.885 0.22,0.94 0.14,0.97 
              C 0.08,0.98 0.03,0.95 0,0.93 
              Z
            " />
          </clipPath>
          {/* Accent Wave: slightly lower to create the lavender bottom border strip */}
          <clipPath id="heroWaveAccentClip" clipPathUnits="objectBoundingBox">
            <path d="
              M 0,0 
              L 1,0 
              L 1,0.93 
              C 0.94,0.945 0.88,0.955 0.82,0.955 
              C 0.74,0.955 0.66,0.92 0.58,0.91 
              C 0.52,0.905 0.44,0.895 0.38,0.90 
              C 0.30,0.915 0.22,0.97 0.14,0.995 
              C 0.08,1.00 0.03,0.975 0,0.955 
              Z
            " />
          </clipPath>
        </defs>
      </svg>

      {/* Layer 1: Subtle Lavender Accent Wave along the bottom border */}
      <div
        className="absolute inset-0 bg-[#c4b5fd]/50 transition-opacity duration-700"
        style={{ clipPath: 'url(#heroWaveAccentClip)' }}
      />

      {/* Layer 2: Main Wave containing the alternating to-and-fro motion images */}
      <div
        className="absolute inset-0 bg-[#ede9fe] overflow-hidden"
        style={{ clipPath: 'url(#heroWaveClip)' }}
      >
        {HERO_IMAGES.map((imgObj, idx) => {
          const isActive = activeImageIndex === idx;

          return (
            <motion.div
              key={imgObj.id}
              className="absolute inset-0 w-full h-full"
              initial={false}
              animate={{
                opacity: isActive ? 0.45 : 0
              }}
              transition={{
                duration: 1.5,
                ease: 'easeInOut'
              }}
              style={{
                zIndex: isActive ? 2 : 1
              }}
            >
              <motion.img
                src={imgObj.src}
                onError={(e) => {
                  if (e.currentTarget.src !== imgObj.fallback) {
                    e.currentTarget.src = imgObj.fallback;
                  }
                }}
                alt={imgObj.alt}
                className="w-[140%] min-w-[140%] h-[130%] min-h-[130%] -left-[20%] -top-[15%] relative object-cover pointer-events-none"
                style={{
                  filter: 'blur(2px) brightness(0.92)',
                  transformOrigin: 'center center'
                }}
                animate={
                  isActive
                    ? {
                        x: ['-3%', '3%', '-3%'],
                        scale: 1.12
                      }
                    : {
                        x: '-3%',
                        scale: 1.12
                      }
                }
                transition={
                  isActive
                    ? {
                        x: {
                          duration: CYCLE_DURATION_SEC,
                          ease: 'easeInOut',
                          repeat: Infinity
                        },
                        scale: {
                          duration: 1.5,
                          ease: 'easeInOut'
                        }
                      }
                    : { duration: 0.8 }
                }
              />
            </motion.div>
          );
        })}

        {/* Soft institutional frosted overlay for high text contrast */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(245,243,255,0.30) 60%, rgba(255,255,255,0.50) 100%)'
          }}
        />
      </div>
    </div>
  );
};

export default HeroWavyBackground;
