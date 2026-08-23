import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/helpers';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'md',
  showClose = true,
  className = '',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    full: 'max-w-[95vw] h-[90vh]',
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', duration: 0.3, bounce: 0.1 }}
            className={cn(
              'relative w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 my-auto',
              sizes[size],
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {(title || showClose) && (
              <div className="flex items-start justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
                <div>
                  {title && <h3 className="text-lg font-semibold text-slate-100">{title}</h3>}
                  {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
                </div>
                {showClose && (
                  <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-200 hover:bg-slate-800 p-1.5 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="p-6 max-h-[calc(85vh-8rem)] overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
