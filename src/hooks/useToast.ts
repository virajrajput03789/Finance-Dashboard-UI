import { useState, useCallback, useRef } from 'react';
import type { ToastItem } from '../types/index';

let toastId = 0;

/**
 * Toast notification system with stack management
 * Max 3 visible toasts, queue the rest
 */
export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const queueRef = useRef<ToastItem[]>([]);

  const addToast = useCallback((
    message: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'info',
    duration: number = 3000
  ) => {
    const id = String(toastId++);
    const toast: ToastItem = {
      id,
      type,
      message,
      duration,
    };

    setToasts(prev => {
      const updated = [...prev, toast];
      if (updated.length > 3) {
        queueRef.current.push(...updated.slice(3));
        return updated.slice(0, 3);
      }
      return updated;
    });

    // Auto-remove after duration
    const timer = setTimeout(() => {
      removeToast(id);
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => {
      const updated = prev.filter(t => t.id !== id);
      
      // Add queued toast if available
      if (queueRef.current.length > 0 && updated.length < 3) {
        const nextToast = queueRef.current.shift()!;
        updated.push(nextToast);
        
        setTimeout(() => {
          removeToast(nextToast.id);
        }, nextToast.duration || 3000);
        
        return updated;
      }
      
      return updated;
    });
  }, []);

  const success = useCallback((message: string) => {
    addToast(message, 'success', 3000);
  }, [addToast]);

  const error = useCallback((message: string) => {
    addToast(message, 'error', 4000);
  }, [addToast]);

  const warning = useCallback((message: string) => {
    addToast(message, 'warning', 3500);
  }, [addToast]);

  const info = useCallback((message: string) => {
    addToast(message, 'info', 3000);
  }, [addToast]);

  return { toasts, removeToast, addToast, success, error, warning, info };
}
