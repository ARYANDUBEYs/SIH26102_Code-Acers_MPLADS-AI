import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const TiltQuoteCard = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for weight response
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 25 });

  // Calculate dynamic 3D rotation based on mouse offset (-1 to 1)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['14deg', '-14deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-14deg', '14deg']);

  // Corner rises up smoothly towards cursor
  const translateY = useTransform(mouseYSpring, [-0.5, 0.5], [-8, 8]);
  const translateX = useTransform(mouseXSpring, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className="w-full flex justify-center">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          translateX,
          translateY,
          transformStyle: 'preserve-3d'
        }}
        whileHover={{
          scale: 1.04,
          boxShadow: '0 25px 45px -12px rgba(11, 37, 69, 0.45), 0 0 30px 4px rgba(245, 158, 11, 0.45)',
          borderColor: 'rgba(245, 158, 11, 0.85)'
        }}
        className="w-full max-w-sm p-7 bg-gradient-to-br from-[#0B2545] via-[#0F315E] to-[#133A6B] text-white rounded-2xl shadow-xl space-y-5 border-2 border-blue-800/80 relative overflow-hidden cursor-pointer group select-none transition-colors duration-200"
      >
        {/* Decorative radial glows */}
        <div className="w-36 h-36 bg-amber-500/15 rounded-full absolute -right-10 -bottom-10 blur-2xl group-hover:bg-amber-500/30 transition-all duration-300 pointer-events-none" />
        <div className="w-28 h-28 bg-cyan-500/10 rounded-full absolute -left-8 -top-8 blur-xl pointer-events-none" />

        <div
          style={{ transform: 'translateZ(30px)' }}
          className="text-amber-400 font-serif text-4xl leading-none group-hover:scale-110 group-hover:text-amber-300 transition-all duration-200 origin-left"
        >
          “
        </div>
        <blockquote
          style={{ transform: 'translateZ(25px)' }}
          className="text-xs sm:text-sm font-medium leading-relaxed text-slate-100 italic relative z-10"
        >
          E-Governance is an essential part of our dream of Digital India. The more Technology we infuse in Governance, the better it is for India.
        </blockquote>

        <div
          style={{ transform: 'translateZ(35px)' }}
          className="pt-4 border-t border-blue-800/90 relative z-10 flex items-center justify-between"
        >
          <div>
            <p className="font-bold text-sm sm:text-base text-amber-300 group-hover:text-amber-200 transition-colors">
              Shri Narendra Modi
            </p>
            <p className="text-[11px] text-slate-300 font-medium">Hon'ble Prime Minister of India</p>
          </div>
          <span className="text-xl">🇮🇳</span>
        </div>
      </motion.div>
    </div>
  );
};
