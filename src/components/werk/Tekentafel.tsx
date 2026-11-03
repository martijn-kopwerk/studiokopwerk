import { useEffect, useRef } from 'react';

/**
 * A screen being sketched on the drafting table: one pen line draws a page (frame, bar, heading, text, button, picture),
 * the amber dot is the pen tip, and a check mark closes it. Then it rests, fades and starts over.
 * Prerendered and under reduced motion: the finished sketch, still, with the dot resting on the check mark.
 * Plays only while in view. One path per stroke: a dash pattern starts over at every subpath.
 */
const SKETCH = [
  'M30 26 Q140 23 250 27 Q253 90 249 152 Q140 155 31 151 Q28 90 30 26',
  'M31 46 Q140 44 249 47',
  'M48 70 Q90 68 132 71',
  'M48 88 Q110 86 172 89',
  'M48 102 Q100 100 152 103',
  'M48 124 Q48 116 56 116 L100 116 Q108 116 108 124 Q108 132 100 132 L56 132 Q48 132 48 124',
  'M196 64 Q214 63 231 65 Q232 85 230 105 Q213 106 196 104 Q195 84 196 64',
  'M198 102 L210 86 L218 95 L223 89 L229 101',
  'M200 128 L208 136 L226 116',
];

const DRAW = 7000;
const REST = 2200;
const FADE = 600;

export function Tekentafel({ className }: { className?: string }) {
  const svg = useRef<SVGSVGElement>(null);
  const lines = useRef<(SVGPathElement | null)[]>([]);
  const pen = useRef<SVGGElement>(null);

  useEffect(() => {
    const el = svg.current;
    const paths = lines.current.filter((path): path is SVGPathElement => path !== null);
    const tip = pen.current;
    if (!el || !tip || paths.length !== SKETCH.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lengths = paths.map((path) => path.getTotalLength());
    const total = lengths.reduce((sum, length) => sum + length, 0);
    let frame = 0;
    let start = 0;
    let offset = 0;

    const paint = (now: number) => {
      const t = (now - start) % (DRAW + REST + FADE);
      const drawn = Math.min(t / DRAW, 1);
      const eased = drawn < 1 ? drawn - Math.sin(drawn * Math.PI * 2 * 9) / (Math.PI * 2 * 9 * 1.6) : 1;
      let left = eased * total;
      paths.forEach((path, i) => {
        const length = lengths[i];
        const done = Math.min(Math.max(left, 0), length);
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length - done}`;
        if (left > 0 && left <= length) {
          const at = path.getPointAtLength(done);
          tip.setAttribute('transform', `translate(${at.x} ${at.y})`);
        }
        left -= length;
      });
      el.style.opacity = t > DRAW + REST ? `${1 - (t - DRAW - REST) / FADE}` : '1';
      frame = requestAnimationFrame(paint);
    };

    const watch = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry.isIntersecting) {
        start = performance.now() - offset;
        frame = requestAnimationFrame(paint);
      } else {
        offset = (performance.now() - start) % (DRAW + REST + FADE);
      }
    });
    watch.observe(el);
    return () => {
      watch.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <svg ref={svg} viewBox="0 0 280 180" aria-hidden="true" className={className}>
      <defs>
        <pattern id="tekentafel-raster" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.8" className="fill-slate-300 dark:fill-slate-700" />
        </pattern>
      </defs>
      <rect x="1" y="1" width="278" height="178" rx="14" fill="url(#tekentafel-raster)" />
      <g fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-slate-500 dark:stroke-slate-400">
        {SKETCH.map((d, i) => (
          <path
            key={d}
            ref={(path) => {
              lines.current[i] = path;
            }}
            d={d}
          />
        ))}
      </g>
      <g ref={pen} transform="translate(226 116)">
        <circle r="9" className="fill-amber-500/25" />
        <circle r="4" className="fill-amber-500" />
      </g>
    </svg>
  );
}
