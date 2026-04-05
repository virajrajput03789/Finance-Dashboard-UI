import { useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';

export function useAnimatedCounter(
  target: number,
  duration: number = 1.8,
  formatFn?: (v: number) => string
) {
  const count = useMotionValue(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false });

  const formatted = useTransform(count, (v) => {
    if (formatFn) return formatFn(Math.round(v));
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(v));
  });

  useEffect(() => {
    if (!inView) return;

    count.set(0);
    const controls = animate(count, target, {
      duration,
      ease: [0.34, 1.12, 0.64, 1], // Premium overshoot easing
    });

    return controls.stop;
  }, [inView, target, count, duration]);

  return { formatted, ref };
}
