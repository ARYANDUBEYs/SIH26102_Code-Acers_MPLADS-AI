import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';

export const GlobalCubeLoader = () => {
  const location = useLocation();
  const { isGlobalLoading } = useApp();
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  // Trigger non-intrusive overlay on route navigation
  useEffect(() => {
    setIsRouteLoading(true);
    const timer = setTimeout(() => {
      setIsRouteLoading(false);
    }, 750);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const shouldShow = isRouteLoading || isGlobalLoading;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, y: -24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-12 right-6 z-[9999] pointer-events-none flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-sky-400/50 dark:border-sky-500/40 shadow-[0_8px_30px_rgba(0,120,215,0.25)]"
        >
          {/* Miniature 3D Rotating Cube */}
          <div className="w-5 h-5 perspective-[160px] flex items-center justify-center shrink-0">
            <div className="cube-spinner !w-3.5 !h-3.5">
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
            </div>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-slate-800 dark:text-slate-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="tracking-tight">Telemetry Syncing...</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
