import { useRef } from 'react';
import { useInView } from 'framer-motion';

export function useScrollReveal(options = {}) {
  const ref = useRef(null);
  const inView = useInView(ref, {
    once: true,
    margin: '-60px',
    ...options,
  });

  return { ref, inView };
}
