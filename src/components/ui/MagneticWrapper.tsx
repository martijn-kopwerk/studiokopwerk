import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

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

  // Performance Optimization:
  // Using motion values (useMotionValue + useSpring) instead of React useState
  // avoids triggering React component re-renders on every mousemove event (~60-120fps).
  // Motion updates the DOM transforms directly on the GPU/animation frame layer.
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
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
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
