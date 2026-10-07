import React, { useEffect, useRef } from 'react';
import { ResolvedTheme } from '../types';
import type { DotTarget } from '../hooks/useAmberDot';
import { ARM_SLOPE, LINES, computeLayout, ease } from '../lib/tekentafel';

interface AbstractBackgroundProps {
  theme: ResolvedTheme;
  // Where the amber dot should be; null sends it back to the K's vertex. Set through useAmberDot().
  dotTarget: DotTarget | null;
  // The current page's path: on phones a page can place the vertex (data-tekentafel-vertex), so it is measured again.
  page: string;
}

// Clear of the header at the top and of the screen edge at the bottom, for a clamped dot.
const DOT_CLAMP = { top: 96, bottom: 48 };
// How long the dot takes to fade out before it reappears somewhere off the reading line (matches duration-300).
const DOT_FADE_MS = 300;

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

// The y a page asks for the K's vertex, as if scrolled to the top (the drawing is fixed to the viewport).
function vertexAnchorY() {
  const anchor = document.querySelector<HTMLElement>('[data-tekentafel-vertex]');
  return anchor ? layoutCenter(anchor).y + window.scrollY : undefined;
}

const INTRO_SECONDS = 2.6;

/**
 * The drafting table: hairlines draw the geometry of the Kopwerk K once on load,
 * the amber dot lands on the vertex, and a soft amber light follows the cursor.
 * After the intro nothing animates on the canvas; the dot pulse and the light are CSS.
 * The table is fixed to the viewport and stays mounted across pages; pages can send the dot
 * to an element of theirs (useAmberDot), such as the story under the cursor.
 */
export const AbstractBackground: React.FC<AbstractBackgroundProps> = React.memo(({ theme, dotTarget, page }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotRef = useRef<HTMLSpanElement | null>(null);
  // Fades the dot out and in when it moves off the reading line, instead of sliding across the page.
  const fadeRef = useRef<HTMLSpanElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const themeRef = useRef(theme);
  const targetRef = useRef(dotTarget);
  // Redraws the finished drawing (used after the intro, on resize and on theme change).
  const redrawRef = useRef<() => void>(() => {});
  // Measures the page again and redraws (page change, fonts loaded).
  const relayoutRef = useRef<() => void>(() => {});
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
      const { width, height, stemX, vertexX, midY, armX, armDY, phone } = layout;
      const lines = themeRef.current === 'dark' ? LINES.dark : LINES.light;
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
      ctx.lineWidth = LINES.guideWidth;
      ctx.strokeStyle = `rgba(${lines.ink}, ${phone ? lines.phoneGuide : lines.guide})`;
      segment(stemX, 0, stemX, height, ease(t / 1.3));
      segment(0, midY, width, midY, ease((t - 0.2) / 1.4));
      segment(vertexX, midY, vertexX + far, midY - far * slope, ease((t - 0.45) / 1.5));
      segment(vertexX, midY, vertexX + far, midY + far * slope, ease((t - 0.45) / 1.5));
      segment(vertexX, midY, vertexX - far, midY + far * slope, ease((t - 0.6) / 1.5));
      segment(vertexX, midY, vertexX - far, midY - far * slope, ease((t - 0.6) / 1.5));
      segment(armX, 0, armX, height, ease((t - 0.8) / 1.4));

      // The K itself, a touch stronger.
      const k = ease((t - 1) / 1.3);
      ctx.lineWidth = LINES.kWidth;
      ctx.strokeStyle = `rgba(${lines.ink}, ${phone ? lines.phoneK : lines.k})`;
      segment(stemX, midY - armDY, stemX, midY + armDY, k);
      segment(vertexX, midY, armX, midY - armDY, k);
      segment(vertexX, midY, armX, midY + armDY, k);
    };

    // Where the dot belongs now: its target's centre (kept on screen when clamped), or the K's vertex.
    const dotPoint = () => {
      // A target from the page that just left is no longer in the document.
      const target = targetRef.current?.element.isConnected ? targetRef.current : null;
      if (!target) return { x: layout.dotX, y: layout.midY };
      const point = layoutCenter(target.element);
      if (target.clamp) point.y = Math.min(Math.max(point.y, DOT_CLAMP.top), window.innerHeight - DOT_CLAMP.bottom);
      return point;
    };

    let fadeTimer = 0;
    const placeDot = (animate: boolean) => {
      const dot = dotRef.current;
      const fade = fadeRef.current;
      if (!dot || !fade) return;
      const { x, y } = dotPoint();
      const fromX = parseFloat(dot.style.left);

      const jump = (to: { x: number; y: number }) => {
        dot.style.transitionDuration = '0s';
        dot.style.left = `${to.x}px`;
        dot.style.top = `${to.y}px`;
        requestAnimationFrame(() => {
          dot.style.transitionDuration = '';
        });
      };

      window.clearTimeout(fadeTimer);
      fade.style.opacity = '';
      if (!animate || reducedMotion.matches || Number.isNaN(fromX)) {
        jump({ x, y });
        return;
      }
      // Along the reading line (same x: the margin, or the K's stem on phones) it glides.
      if (Math.abs(fromX - x) <= 2) {
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;
        return;
      }
      // Anywhere else it would slide across text and buttons, so it fades out and reappears at its new place.
      fade.style.opacity = '0';
      fadeTimer = window.setTimeout(() => {
        jump(dotPoint());
        fade.style.opacity = '';
      }, DOT_FADE_MS);
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
        logo && { left: logo.left - rect.left, top: logo.top - rect.top, width: logo.width },
        vertexAnchorY()
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
    relayoutRef.current = resize;
    placeDotRef.current = placeDot;
    resize();
    // Web fonts can shift the page once they load; measure the vertex again and put the dot back on its target.
    document.fonts?.ready.then(() => relayoutRef.current());

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
      window.clearTimeout(fadeTimer);
      redrawRef.current = () => {};
      relayoutRef.current = () => {};
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

  // A new page may place the vertex elsewhere.
  useEffect(() => {
    relayoutRef.current();
  }, [page]);

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
        <span ref={fadeRef} className="absolute inset-0 transition-opacity duration-300 ease-kopwerk motion-reduce:transition-none">
          <span className="absolute inset-0 rounded-full bg-amber-500/60 opacity-0 [--pulse-scale:2.8] motion-safe:animate-pulse-ring motion-safe:[animation-delay:2.7s]" />
          <span className="absolute inset-0 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]" />
        </span>
      </span>
    </>
  );
});
