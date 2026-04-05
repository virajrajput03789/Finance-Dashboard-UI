import { useEffect, useState } from 'react';
import { useMotionValue, useTransform, animate } from 'framer-motion';

/**
 * Hook to animate a number value with currency formatting
 * Uses framer-motion's useMotionValue for smooth animation
 * @param target - Target numeric value to animate to
 * @param duration - Animation duration in seconds (default: 1.4s)
 * @returns Formatted currency string that animates
 */
export const useAnimatedValue = (target: number, duration: number = 1.4): string => {
  const motionValue = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState('$0.00');

  // Transform motion value to formatted currency string
  const formattedValue = useTransform(motionValue, (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  });

  // Subscribe to formatted value updates
  useEffect(() => {
    return formattedValue.on('change', (latest) => {
      setDisplayValue(latest);
    });
  }, [formattedValue]);

  // Animate from current to target
  useEffect(() => {
    const controls = animate(motionValue, target, {
      duration,
      ease: 'easeOut'
    });

    return () => controls.stop();
  }, [target, motionValue, duration]);

  return displayValue;
};
