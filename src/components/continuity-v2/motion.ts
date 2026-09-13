import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

export const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Pointer parallax, normalised to -1..1 on each axis. Returns zero when the
 * visitor prefers reduced motion or is on a touch pointer.
 */
export function usePointerParallax<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || reduce) return;
    if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const rect = node.getBoundingClientRect();
        setOffset({
          x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
          y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
        });
      });
    };
    const onLeave = () => setOffset({ x: 0, y: 0 });

    node.addEventListener('pointermove', onMove);
    node.addEventListener('pointerleave', onLeave);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
    };
  }, [reduce]);

  return { ref, offset };
}
