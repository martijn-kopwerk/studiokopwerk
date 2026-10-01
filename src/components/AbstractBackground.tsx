import React, { useEffect, useRef } from 'react';
import { ResolvedTheme } from '../types';
import type { DotTarget } from '../hooks/useAmberDot';

interface AbstractBackgroundProps {
  theme: ResolvedTheme;
  // Where the amber dot should be; null sends it back to the K's vertex. Set through useAmberDot().
  dotTarget: DotTarget | null;
}

// Clear of the header at the top and of the screen edge at the bottom, for a clamped dot.
const DOT_CLAMP = { top: 96, bottom: 48 };

// An element's centre in viewport coordinates, from its layout position: entrance animations
// (transforms) are ignored, so the dot heads for where the element will come to rest.
function layoutCenter(element: HTMLElement) {
  let x = element.offsetWidth / 2;
  let y = element.offsetHeight / 2;
  for (let node: HTMLElement | null = element; node; node = node.offsetParent as HTMLElement | null) {
    x += node.offsetLeft;
    y += node.offsetTop;
  }
  return { x: x - window.scrollX, y: y - window.scrollY };
}

// Logo geometry in its own 120×120 units (see KopwerkLogo): the vertical stroke runs from
// y=20 to y=100 at x=30, the diagonals meet at the vertex (40, 60) and end at x=94,
// and the amber dot sits at (37, 60).
const K = { stemX: 30, vertexX: 40, dotX: 37, armX: 94, top: 20, bottom: 100, mid: 60 };

const INTRO_SECONDS = 2.6;

// Brand curve cubic-bezier(0.19, 1, 0.22, 1), approximated with an ease-out quart.
const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 4);

const ARM_SLOPE = (K.mid - K.top) / (K.armX - K.vertexX);

interface Layout {
  width: number;
  height: number;
  stemX: number;
  vertexX: number;
  midY: number;
  // x of the vertical guide through the arm ends
  armX: number;
  // Half-height of the large K; 0 when only the guides are drawn
  armDY: number;
  dotX: number;
  showDot: boolean;
}

interface Box {
  left: number;
  top: number;
  width: number;
}

function computeLayout(width: number, height: number, logo?: Box): Layout {
  if (width < 640 && logo) {
    // Phones: there's no room for a large K, so the guides grow out of the header logo itself.
    // Its own amber dot is the vertex; the arm guide mirrors the stem as a right-hand margin.
    const unit = logo.width / 120;
    const stemX = logo.left + K.stemX * unit;
    return {
      width,
      height,
      stemX,
      vertexX: logo.left + K.vertexX * unit,
      midY: logo.top + K.mid * unit,
      armX: width - stemX,
      armDY: 0,
      dotX: 0,
      showDot: false,
    };
  }

  // Wider screens: the K is drawn large and faint, a little left of centre so it never competes with the wordmark.
  const scale = Math.min(height * 1.05, width * 1.1) / (K.bottom - K.top);
  const stemX = width * 0.1;
  return {
    width,
    height,
    stemX,
    vertexX: stemX + (K.vertexX - K.stemX) * scale,
    midY: height * 0.54,
    armX: stemX + (K.armX - K.stemX) * scale,
    armDY: (K.mid - K.top) * scale,
    dotX: stemX + (K.dotX - K.stemX) * scale,
    showDot: true,
  };
}

/**
 * The drafting table: hairlines draw the geometry of the Kopwerk K once on load,
 * the amber dot lands on the vertex, and a soft amber light follows the cursor.
 * After the intro nothing animates on the canvas; the dot pulse and the light are CSS.
 * The table is fixed to the viewport and stays mounted across pages; pages can send the dot
 * to an element of theirs (useAmberDot), such as the story under the cursor.
 */
export const AbstractBackground: React.FC<AbstractBackgroundProps> = React.memo(({ theme, dotTarget }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotRef = useRef<HTMLSpanElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const themeRef = useRef(theme);
  const targetRef = useRef(dotTarget);
  // Redraws the finished drawing (used after the intro, on resize and on theme change).
  const redrawRef = useRef<() => void>(() => {});
  // Moves the dot to its target or the vertex; `animate` glides it there, otherwise it jumps (scroll, resize).
  const placeDotRef = useRef<(animate: boolean) => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let layout = computeLayout(0, 0);
    let progress = reducedMotion.matches ? INTRO_SECONDS : 0;
    let frameId = 0;
    let start = 0;

    const draw = () => {
      const { width, height, stemX, vertexX, midY, armX, armDY } = layout;
      const isDark = themeRef.current === 'dark';
      const ink = isDark ? '226, 232, 240' : '51, 65, 85';
      const t = progress;

      ctx.clearRect(0, 0, width, height);

      const slope = ARM_SLOPE;
      const far = Math.max(width, height) * 1.5;

      const segment = (x1: number, y1: number, x2: number, y2: number, p: number) => {
        if (p <= 0) return;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 + (x2 - x1) * p, y1 + (y2 - y1) * p);
        ctx.stroke();
      };

      // Construction lines: full-bleed guides through the K's stem, vertex and arm ends.
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${ink}, ${isDark ? 0.055 : 0.05})`;
      segment(stemX, 0, stemX, height, ease(t / 1.3));
      segment(0, midY, width, midY, ease((t - 0.2) / 1.4));
      segment(vertexX, midY, vertexX + far, midY - far * slope, ease((t - 0.45) / 1.5));
      segment(vertexX, midY, vertexX + far, midY + far * slope, ease((t - 0.45) / 1.5));
      segment(vertexX, midY, vertexX - far, midY + far * slope, ease((t - 0.6) / 1.5));
      segment(vertexX, midY, vertexX - far, midY - far * slope, ease((t - 0.6) / 1.5));
      segment(armX, 0, armX, height, ease((t - 0.8) / 1.4));

      // The K itself, a touch stronger (wider screens only).
      if (armDY > 0) {
        const k = ease((t - 1) / 1.3);
        ctx.lineWidth = 1.25;
        ctx.strokeStyle = `rgba(${ink}, ${isDark ? 0.13 : 0.11})`;
        segment(stemX, midY - armDY, stemX, midY + armDY, k);
        segment(vertexX, midY, armX, midY - armDY, k);
        segment(vertexX, midY, armX, midY + armDY, k);
      }
    };

    const placeDot = (animate: boolean) => {
      const dot = dotRef.current;
      if (!dot) return;
      const target = targetRef.current;
      let x = layout.dotX;
      let y = layout.midY;
      if (target) {
        ({ x, y } = layoutCenter(target.element));
        if (target.clamp) y = Math.min(Math.max(y, DOT_CLAMP.top), window.innerHeight - DOT_CLAMP.bottom);
      }
      const visible = Boolean(target) || layout.showDot;
      // A dot that was hidden appears in place rather than gliding in from its old spot.
      const glide = animate && !dot.hidden && !reducedMotion.matches;
      dot.hidden = !visible;
      if (!glide) dot.style.transitionDuration = '0s';
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      if (!glide) {
        requestAnimationFrame(() => {
          dot.style.transitionDuration = '';
        });
      }
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const logo = document.querySelector('#main-header svg')?.getBoundingClientRect();
      layout = computeLayout(
        rect.width,
        rect.height,
        logo && { left: logo.left - rect.left, top: logo.top - rect.top, width: logo.width }
      );
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      placeDot(false);
      draw();
    };

    const intro = (now: number) => {
      if (!start) start = now;
      progress = (now - start) / 1000;
      draw();
      if (progress < INTRO_SECONDS) {
        frameId = requestAnimationFrame(intro);
      }
    };

    redrawRef.current = draw;
    placeDotRef.current = placeDot;
    resize();
    // Web fonts can shift the page once they load; put the dot back on its target.
    document.fonts?.ready.then(() => placeDot(false));

    // A target scrolls with the page, so the dot follows it (without gliding).
    let scrollPending = false;
    const handleScroll = () => {
      if (!targetRef.current || scrollPending) return;
      scrollPending = true;
      requestAnimationFrame(() => {
        scrollPending = false;
        placeDot(false);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    const resizeObserver = new ResizeObserver(resize);
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    if (!reducedMotion.matches) {
      frameId = requestAnimationFrame(intro);
    }

    // Ambient light: follows a mouse or pen with a long, soft lag (a CSS transition).
    // Touch screens get a slow CSS drift instead; reduced motion keeps it still.
    let pending = false;
    let lastX = 0;
    let lastY = 0;
    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || reducedMotion.matches) return;
      lastX = e.clientX;
      lastY = e.clientY;
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        const glow = glowRef.current;
        if (glow) glow.style.translate = `${lastX}px ${lastY}px`;
      });
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      redrawRef.current = () => {};
      placeDotRef.current = () => {};
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    themeRef.current = theme;
    redrawRef.current();
  }, [theme]);

  useEffect(() => {
    targetRef.current = dotTarget;
    placeDotRef.current(true);
  }, [dotTarget]);

  return (
    <>
      <div
        id="abstract-background-container"
        className="fixed inset-0 pointer-events-none overflow-hidden z-0"
        aria-hidden="true"
      >
        <div
          ref={glowRef}
          className="kopwerk-glow absolute left-0 top-0 transition-[translate] duration-[1800ms] ease-kopwerk motion-reduce:transition-none pointer-coarse:motion-safe:animate-glow-drift"
        />
        <canvas ref={canvasRef} id="abstract-background-canvas" className="relative block w-full h-full" />
      </div>
      {/* The amber dot lands on the K's vertex, then pulses like the logo; pages can send it elsewhere.
          It sits above the page (below the header) so it can rest on a page's own markers; those are always in a margin. */}
      <span
        ref={dotRef}
        aria-hidden="true"
        className="fixed z-20 pointer-events-none -translate-x-1/2 -translate-y-1/2 size-3.5 transition-[left,top] duration-500 ease-kopwerk motion-reduce:transition-none motion-safe:animate-dot-land"
      >
        <span className="absolute inset-0 rounded-full bg-amber-500/60 opacity-0 [--pulse-scale:2.8] motion-safe:animate-pulse-ring motion-safe:[animation-delay:2.7s]" />
        <span className="absolute inset-0 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]" />
      </span>
    </>
  );
});
