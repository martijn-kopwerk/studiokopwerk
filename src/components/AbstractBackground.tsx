import React, { useEffect, useRef } from 'react';
import { ResolvedTheme } from '../types';

interface AbstractBackgroundProps {
  theme: ResolvedTheme;
}

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  phase: number;
}

// Memoized to prevent parent re-renders (e.g. contact dialog toggle) from triggering React re-evaluations
export const AbstractBackground: React.FC<AbstractBackgroundProps> = React.memo(({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // The render loop reads the theme from a ref, so a theme toggle recolours the scene
  // without tearing down the canvas or re-seeding the nodes.
  const themeRef = useRef(theme);
  // Redraws one still frame; only does work when reduced motion has paused the loop.
  const redrawStillRef = useRef<() => void>(() => {});
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number; isHovering: boolean }>({
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    isHovering: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0;
    let height = 0;
    let time = 0;

    // Handle high DPI screens
    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
      redrawStillRef.current();
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Initialize subtle floating nodes for background depth
    const nodeCount = Math.min(36, Math.floor((window.innerWidth * window.innerHeight) / 32000));
    const points: Point[] = [];
    for (let i = 0; i < nodeCount; i++) {
      points.push({
        x: Math.random() * (width || window.innerWidth),
        y: Math.random() * (height || window.innerHeight),
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 0.8,
        baseAlpha: Math.random() * 0.3 + 0.15,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.isHovering = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.targetX = e.touches[0].clientX - rect.left;
        mouseRef.current.targetY = e.touches[0].clientY - rect.top;
        mouseRef.current.isHovering = true;
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovering = false;
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    const handleTouchEnd = () => {
      handleMouseLeave();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchend', handleTouchEnd);

    // Reusable point buffer to eliminate per-frame object allocations and GC pressure
    const linePointsBuffer: { x: number; y: number }[] = [];
    const maxDist = 240;
    const maxDistSq = maxDist * maxDist;
    const invMaxDist = 1 / maxDist;
    const invMaxDistPi = Math.PI * invMaxDist;
    const connectDist = 130;
    const connectDistSq = connectDist * connectDist;

    // Draws a single frame of the scene
    const drawFrame = () => {
      time += 0.008;

      // Smooth mouse interpolation
      if (mouseRef.current.isHovering) {
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
      } else {
        mouseRef.current.x += (width / 2 - mouseRef.current.x) * 0.02;
        mouseRef.current.y += (height / 2 - mouseRef.current.y) * 0.02;
      }

      ctx.clearRect(0, 0, width, height);

      const isDark = themeRef.current === 'dark';

      // 1. Subtle ambient background glow / gradient
      const bgGradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        width * 0.05,
        width * 0.5,
        height * 0.5,
        width * 0.85
      );
      
      if (isDark) {
        bgGradient.addColorStop(0, 'rgba(25, 30, 48, 0.45)');
        bgGradient.addColorStop(0.5, 'rgba(13, 16, 26, 0.2)');
        bgGradient.addColorStop(1, 'rgba(7, 9, 14, 0)');
      } else {
        bgGradient.addColorStop(0, 'rgba(241, 245, 249, 0.7)');
        bgGradient.addColorStop(0.5, 'rgba(248, 250, 252, 0.35)');
        bgGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }
      
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Flowing harmonic abstract contour ribbons (represents structured insight / "Kopwerk")
      const linesCount = 7;
      const stepX = 20;

      // Performance optimizations for 60 FPS animation loop:
      // Pre-calculate frame-invariant time terms and height scales outside loops
      const time11 = time * 1.1;
      const time08 = time * 0.8;
      const time17 = time * 1.7;
      const h008 = height * 0.08;
      const h005 = height * 0.05;
      const h002 = height * 0.02;
      const height052 = height * 0.52;
      const height0045 = height * 0.045;
      const invWidth = width > 0 ? 1 / width : 1;

      for (let i = 0; i < linesCount; i++) {
        ctx.beginPath();
        const lineOffset = (i / linesCount) * Math.PI * 2;
        const progress = i / linesCount;
        
        let strokeStyle: string;
        if (isDark) {
          // Subtle warm amber and cool titanium lines in dark mode
          if (i % 3 === 0) {
            strokeStyle = `rgba(245, 158, 11, ${0.25 + Math.sin(time + progress) * 0.08})`; // Amber
          } else {
            strokeStyle = `rgba(226, 232, 240, ${0.15 + Math.sin(time + progress * 2) * 0.06})`; // Titanium slate
          }
        } else {
          // Crisp charcoal and warm amber contour lines in light mode
          if (i % 3 === 0) {
            strokeStyle = `rgba(217, 119, 6, ${0.14 + Math.sin(time + progress) * 0.04})`; // Amber warm
          } else {
            strokeStyle = `rgba(51, 65, 85, ${0.08 + Math.sin(time + progress * 2) * 0.03})`; // Charcoal
          }
        }

        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = i % 2 === 0 ? 1.2 : 0.8;

        // Calculate points into reusable buffer array (0 allocations per frame after warmup)
        let ptCount = 0;

        // Performance optimization: Hoist loop-invariant baseY calculation out of inner x sampling loop
        // Avoids recomputing baseY ~100 times per line (~700 times per frame at 60 FPS)
        const baseY = height052 + (i - linesCount / 2) * height0045;

        for (let x = 0; x <= width + stepX; x += stepX) {
          // Multi-frequency wave calculation using pre-computed multipliers
          const normX = x * invWidth;
          const wave1 = Math.sin(normX * 4 + time11 + lineOffset) * h008;
          const wave2 = Math.cos(normX * 2.5 - time08 + lineOffset * 0.5) * h005;
          const wave3 = Math.sin(normX * 6 + time17) * h002;

          let y = baseY + wave1 + wave2 + wave3;

          // Mouse subtle deflection - optimized with squared distance check before Math.sqrt
          const dx = x - mouseRef.current.x;
          const dy = y - mouseRef.current.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist * invMaxDist) * 32;
            y += Math.sin(dist * invMaxDistPi) * force * (dy < 0 ? -1 : 1);
          }

          if (ptCount < linePointsBuffer.length) {
            linePointsBuffer[ptCount].x = x;
            linePointsBuffer[ptCount].y = y;
          } else {
            linePointsBuffer.push({ x, y });
          }
          ptCount++;
        }

        // Render smoothly using quadratic curves
        if (ptCount > 0) {
          ctx.moveTo(linePointsBuffer[0].x, linePointsBuffer[0].y);
          for (let p = 1; p < ptCount - 1; p++) {
            const xc = (linePointsBuffer[p].x + linePointsBuffer[p + 1].x) / 2;
            const yc = (linePointsBuffer[p].y + linePointsBuffer[p + 1].y) / 2;
            ctx.quadraticCurveTo(linePointsBuffer[p].x, linePointsBuffer[p].y, xc, yc);
          }
          // Connect to the final point
          ctx.lineTo(linePointsBuffer[ptCount - 1].x, linePointsBuffer[ptCount - 1].y);
        }

        ctx.stroke();
      }

      // 3. Subtle floating connective constellation nodes
      const maxConnAlpha = isDark ? 0.18 : 0.06;
      const nodeAlphaFactor = isDark ? 0.7 : 0.5;

      for (let i = 0; i < points.length; i++) {
        const pt = points[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.phase += 0.02;

        // Wrap around boundaries
        if (pt.x < -20) pt.x = width + 20;
        if (pt.x > width + 20) pt.x = -20;
        if (pt.y < -20) pt.y = height + 20;
        if (pt.y > height + 20) pt.y = -20;

        // Distance to other nodes for subtle connective hair-lines
        // Performance optimization: check squared distance before costly Math.sqrt calculation
        for (let j = i + 1; j < points.length; j++) {
          const pt2 = points[j];
          const dx = pt.x - pt2.x;
          const dy = pt.y - pt2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connectDistSq) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / connectDist) * maxConnAlpha;
            ctx.strokeStyle = isDark ? `rgba(226, 232, 240, ${alpha})` : `rgba(71, 85, 105, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(pt2.x, pt2.y);
            ctx.stroke();
          }
        }

        // Draw node
        const pulse = Math.sin(pt.phase) * 0.3 + 0.7;
        const currentAlpha = pt.baseAlpha * pulse * nodeAlphaFactor;
        ctx.fillStyle = isDark
          ? `rgba(245, 158, 11, ${currentAlpha})`
          : `rgba(217, 119, 6, ${currentAlpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.radius * pulse, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      drawFrame();
      animationFrameId = requestAnimationFrame(loop);
    };

    // Respect reduced motion: show one still frame instead of the endless animation.
    const start = () => {
      cancelAnimationFrame(animationFrameId);
      if (reducedMotion.matches) {
        drawFrame();
      } else {
        loop();
      }
    };

    redrawStillRef.current = () => {
      if (reducedMotion.matches) drawFrame();
    };

    start();
    reducedMotion.addEventListener('change', start);

    return () => {
      cancelAnimationFrame(animationFrameId);
      redrawStillRef.current = () => {};
      reducedMotion.removeEventListener('change', start);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    themeRef.current = theme;
    redrawStillRef.current();
  }, [theme]);

  return (
    <div
      id="abstract-background-container"
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        id="abstract-background-canvas"
        className="w-full h-full block"
      />
    </div>
  );
});
