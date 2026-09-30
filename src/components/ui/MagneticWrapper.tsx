import React, { useRef } from 'react';
import { m, useMotionValue, useReducedMotion, useSpring } from 'motion/react';

export function MagneticWrapper({
  children,
  className = '',
  strength = 0.5
}: {
  children: React.ReactNode,
  className?: string,
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Performance Optimization:
  // Using motion values (useMotionValue + useSpring) instead of React useState
  // avoids triggering React component re-renders on every mousemove event (~60-120fps).
  // Motion updates the DOM transforms directly on the GPU/animation frame layer.
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  // Mouse and pen only: a tap fires a move without a matching leave, which would leave the child stuck off-centre.
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch' || prefersReducedMotion) return;
    const { clientX, clientY } = e;
    const boundingRect = ref.current?.getBoundingClientRect();
    if (boundingRect) {
      const { width, height, left, top } = boundingRect;
      const middleX = clientX - (left + width / 2);
      const middleY = clientY - (top + height / 2);
      x.set(middleX * strength);
      y.set(middleY * strength);
    }
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </m.div>
  );
}
