import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PARLIAMENT_SLIDES = [
  {
    id: 'par1',
    src: '/Par1.jpeg',
    title: 'Historic Parliament House',
    caption: 'Sansad Bhavan, New Delhi'
  },
  {
    id: 'par2',
    src: '/Par2.jpeg',
    title: 'New Parliament of India',
    caption: 'Central Vista, New Delhi'
  },
  {
    id: 'par3',
    src: '/Par3.jpeg',
    title: 'Pillars of Indian Democracy',
    caption: 'Parliament House Facade'
  },
  {
    id: 'par4',
    src: '/Par4.jpeg',
    title: 'Lok Sabha Chamber',
    caption: '543 Parliamentary Constituencies'
  },
  {
    id: 'par5',
    src: '/Par5.jpeg',
    title: 'Central Vista Architecture',
    caption: 'Symbol of Democratic Sovereignty'
  },
  {
    id: 'par6',
    src: '/Par6.jpeg',
    title: 'Parliament Gardens & Central Fountain',
    caption: 'Constitution Vista'
  }
];

/**
 * AboutBackgroundTransition:
 * Renders a continuous moving transition of 6 Parliament images in the background
 * of the About section. Formatted with soft institutional transparency and
 * contrast-preserving overlays so foreground text remains 100% sharp and readable.
 */
export const AboutBackgroundTransition = ({
  interval = 5200,
  opacity = 0.65,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Preload all 6 images on mount
  useEffect(() => {
    PARLIAMENT_SLIDES.forEach(slide => {
      const img = new Image();
      img.src = slide.src;
    });
  }, []);

  // Moving transition loop every interval ms
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % PARLIAMENT_SLIDES.length);
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  const currentSlide = PARLIAMENT_SLIDES[currentIndex];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}>
      {/* Animated Moving Slide Layer with Full-Bleed Symmetrical Ken-Burns Motion */}
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, scale: 1.14 }}
          animate={{
            opacity: opacity,
            scale: 1.06
          }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{
            opacity: { duration: 1.8, ease: 'easeInOut' },
            scale: { duration: 6.0, ease: 'easeInOut' }
          }}
          className="absolute -inset-16 sm:-inset-24 bg-cover bg-center origin-center"
          style={{
            backgroundImage: `url(${currentSlide.src})`,
            filter: 'contrast(106%) saturate(112%)'
          }}
        />
      </AnimatePresence>

      {/* Symmetrical Atmospheric Overlays for Uniform Background Visibility & Content Contrast */}
      {/* 1. Uniform soft veil across 100% width so Parliament imagery is equally visible edge-to-edge */}
      <div className="absolute inset-0 bg-white/30 pointer-events-none" />

      {/* 2. Top and bottom smooth blending gradients into adjacent sections */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-transparent to-white/85 pointer-events-none" />
    </div>
  );
};
