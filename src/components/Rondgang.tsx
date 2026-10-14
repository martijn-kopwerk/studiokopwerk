import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';

// "AI maakt, jij beslist" in three steps, word for word from the positionering. They go round, not in order.
export const stappen = ['AI doet het maakwerk.', 'Samen kijken we wat werkt.', 'Jij beslist wat blijft.'];
const opnieuw = 'En dan weer opnieuw, tot het werkt.';

// The loop in a 400×400 box: the circle, and each step's node on it (top, lower right, lower left).
const C = { x: 200, y: 200, r: 130 };
const HOEKEN = [-90, 30, 150];
const BESLIST = 2;
const punt = (hoek: number) => {
  const t = (hoek * Math.PI) / 180;
  return { x: C.x + C.r * Math.cos(t), y: C.y + C.r * Math.sin(t) };
};

// One round: quick past AI, slower where we look together, and a long wait where you decide. [from, to, ms];
// `to` null is a wait.
const RONDE: [number, number | null, number][] = [
  [-90, 30, 1100],
  [30, null, 900],
  [30, 150, 1900],
  [150, null, 2400],
  [150, 270, 1100],
  [270, null, 500],
];
const DUUR = RONDE.reduce((sum, [, , ms]) => sum + ms, 0);
const ease = (t: number) => 1 - Math.pow(1 - t, 4);

// Where each step's words stand, in % of the box: above the top node, below the two lower ones.
const labels = [
  { left: '50%', top: '13%' },
  { left: '78%', top: '72%' },
  { left: '22%', top: '72%' },
];

/**
 * The werkwijze as a loop (design system: `Loop`): three hollow nodes on a circle, amber where a person decides.
 * The amber dot walks the loop and waits at "Jij beslist wat blijft."; in the middle "En dan weer opnieuw, tot het
 * werkt." The words are a real list, the drawing is decoration. With reduced motion, before the script runs and
 * while the loop is out of view, the dot rests where you decide.
 */
export function Rondgang({ className }: { className?: string }) {
  const box = useRef<HTMLDivElement | null>(null);
  const stip = useRef<SVGCircleElement | null>(null);
  const [wacht, setWacht] = useState(true);
  const rust = punt(HOEKEN[BESLIST]!);

  useEffect(() => {
    const element = box.current;
    const dot = stip.current;
    if (!element || !dot || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let start = 0;
    let waiting = true;
    const zet = (hoek: number) => {
      const { x, y } = punt(hoek);
      dot.setAttribute('cx', x.toFixed(1));
      dot.setAttribute('cy', y.toFixed(1));
    };
    const tick = (now: number) => {
      if (!start) start = now;
      let t = (now - start) % DUUR;
      let hoek = HOEKEN[BESLIST]!;
      let nu = false;
      for (const [van, naar, ms] of RONDE) {
        if (t <= ms) {
          if (naar === null) {
            hoek = van;
            nu = van === HOEKEN[BESLIST];
          } else hoek = van + (naar - van) * ease(t / ms);
          break;
        }
        t -= ms;
      }
      zet(hoek);
      if (nu !== waiting) setWacht((waiting = nu));
      frame = requestAnimationFrame(tick);
    };

    // Only while the loop is on screen; it starts its round from the top each time it comes into view.
    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry?.isIntersecting) {
        start = 0;
        frame = requestAnimationFrame(tick);
      } else {
        zet(HOEKEN[BESLIST]!);
        setWacht((waiting = true));
      }
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={box} className={cn('relative w-full max-w-[28rem] aspect-square', className)}>
      <svg viewBox="0 0 400 400" aria-hidden="true" className="absolute inset-0 size-full overflow-visible">
        <circle cx={C.x} cy={C.y} r={C.r} fill="none" strokeWidth={1} className="stroke-slate-400 dark:stroke-slate-600" />
        {HOEKEN.map((hoek, index) => {
          const { x, y } = punt(hoek);
          const beslist = index === BESLIST;
          return (
            <circle
              key={hoek}
              cx={x}
              cy={y}
              r={7}
              strokeWidth={1.5}
              className={cn(
                'transition-[fill] duration-500 ease-kopwerk motion-reduce:transition-none',
                beslist ? 'stroke-amber-500' : 'stroke-slate-500 dark:stroke-slate-400',
                beslist && wacht ? 'fill-amber-500' : 'fill-slate-50 dark:fill-kopwerk-dark'
              )}
            />
          );
        })}
        <circle
          ref={stip}
          cx={rust.x}
          cy={rust.y}
          r={5}
          className="fill-amber-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.7)]"
        />
      </svg>

      <ul aria-label="Hoe we werken" className="absolute inset-0">
        {stappen.map((stap, index) => {
          const plek = labels[index]!;
          return (
            <li
              key={stap}
              style={{ left: plek.left, top: plek.top }}
              className={cn(
                'absolute -translate-x-1/2 w-[42%] text-center font-display font-medium text-sm sm:text-base leading-snug text-balance text-slate-900 dark:text-white',
                index === 0 && '-translate-y-full'
              )}
            >
              {stap}
            </li>
          );
        })}
        <li className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[46%] text-center text-xs sm:text-sm leading-relaxed text-balance text-subtle dark:text-slate-400">
          {opnieuw}
        </li>
      </ul>
    </div>
  );
}
