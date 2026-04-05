import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ToastItem } from '../../types/index';
import { cn } from '../../utils';

interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

const toastVariants = {
  initial: { opacity: 0, x: 80, scale: 0.9 },
  animate: { 
    opacity: 1, 
    x: 0, 
    scale: 1
  },
  exit: { 
    opacity: 0, 
    x: 80, 
    scale: 0.9
  }
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500';
      case 'error':
        return 'bg-error';
      case 'warning':
        return 'bg-amber-500';
      case 'info':
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={onRemove}
            getIcon={getIcon}
            getBgColor={getBgColor}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{
  toast: ToastItem;
  onRemove: (id: string) => void;
  getIcon: (type: string) => string;
  getBgColor: (type: string) => string;
}> = ({ toast, onRemove, getIcon, getBgColor }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <motion.div
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        animate: { type: 'spring', stiffness: 400, damping: 30 },
        exit: { duration: 0.2 }
      } as any}
      className={cn(
        'bg-surface-container rounded-lg shadow-lg border border-outline-variant/20',
        'pointer-events-auto flex items-start gap-3 p-4 max-w-sm mb-2'
      )}
    >
      <span
        className={cn(
          'material-symbols-outlined text-lg flex-shrink-0',
          getBgColor(toast.type),
          'text-white rounded-full p-1'
        )}
        data-icon={getIcon(toast.type)}
      >
        {getIcon(toast.type)}
      </span>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-on-surface">{toast.message}</p>
        <motion.div
          className={cn('h-1 rounded-full mt-2', getBgColor(toast.type))}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: (toast.duration || 3000) / 1000, ease: 'linear' }}
        />
      </div>

      <motion.button
        onClick={() => onRemove(toast.id)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="flex-shrink-0 text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <span className="material-symbols-outlined text-lg" data-icon="close">
          close
        </span>
      </motion.button>
    </motion.div>
  );
};
