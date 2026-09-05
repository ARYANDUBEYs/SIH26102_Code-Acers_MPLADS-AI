import React from 'react';
import { motion } from 'framer-motion';

export const ScrollReveal = ({
  children,
  className = '',
  delay = 0,
  y = 24,
  duration = 0.55
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
