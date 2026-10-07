import { useState } from 'react';
import { Eraser, RotateCcw } from 'lucide-react';
import { RollingText } from '../ui/RollingText';
import { cn } from '../../lib/utils';
import { hairline, row } from '../../lib/raster';

// One after the other, so the strike reads as a single gesture.
const delays = ['', '[transition-delay:90ms]', '[transition-delay:180ms]', '[transition-delay:270ms]'];

const fade = 'transition-opacity duration-500 ease-kopwerk motion-reduce:transition-none';

/**
 * The vision, done rather than told: a screen drawn in the system's hairlines, crowded with tabs, panels, steps and
 * buttons. One click leaves out everything but what matters (a title, a few lines, one amber action), and can bring
 * it back. The lines beneath say the same in words, struck through; screen readers hear them as left out.
 */
export function Weglaten({ items }: { items: string[] }) {
  const [weg, setWeg] = useState(false);
  const extra = (delay = '') => cn(fade, weg && ['opacity-0', delay]);
  const toggle = () => setWeg((current) => !current);

  return (
    <figure className="flex flex-col gap-6">
      {/* Decorative (the words below carry the meaning); a click on it does what the button does, for the mouse */}
      <svg
        viewBox="0 0 320 200"
        aria-hidden="true"
        onClick={toggle}
        className="w-full max-w-md cursor-pointer text-slate-300 dark:text-slate-700 transition-colors duration-300 ease-kopwerk hover:text-slate-400 dark:hover:text-slate-600 motion-reduce:transition-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <rect x="0.5" y="0.5" width="319" height="199" rx="16" />

        {/* What piles up: tabs, a sidebar, steps, extra panels and buttons, a badge */}
        <g className={extra()}>
          {[16, 50, 84, 118, 152].map((x) => (
            <rect key={x} x={x} y="14" width="26" height="8" rx="4" />
          ))}
        </g>
        <g className={extra('[transition-delay:60ms]')}>
          <rect x="16" y="36" width="56" height="148" rx="6" />
          {[50, 66, 82, 98, 114, 130, 146].map((y) => (
            <line key={y} x1="26" y1={y} x2="62" y2={y} />
          ))}
        </g>
        <g className={extra('[transition-delay:120ms]')}>
          {[228, 246, 264, 282, 300].map((cx) => (
            <circle key={cx} cx={cx} cy="18" r="4" />
          ))}
          <rect x="232" y="40" width="72" height="40" rx="6" />
          <rect x="232" y="88" width="72" height="40" rx="6" />
          <rect x="232" y="136" width="72" height="48" rx="6" />
        </g>
        <g className={extra('[transition-delay:180ms]')}>
          <rect x="160" y="110" width="56" height="16" rx="8" />
          <rect x="88" y="150" width="40" height="14" rx="7" />
          <rect x="134" y="150" width="40" height="14" rx="7" />
          <rect x="180" y="150" width="40" height="14" rx="7" />
          <circle cx="306" cy="14" r="5" />
        </g>

        {/* What stays: a title, a few lines, one action */}
        <g stroke="none">
          <rect x="96" y="58" width="92" height="10" rx="2" className="fill-slate-900 dark:fill-white" />
          <rect x="96" y="78" width="112" height="4" rx="2" className="fill-slate-400 dark:fill-slate-500" />
          <rect x="96" y="88" width="96" height="4" rx="2" className="fill-slate-400 dark:fill-slate-500" />
          <rect x="96" y="110" width="56" height="16" rx="8" className="fill-amber-500" />
        </g>
      </svg>

      {/* The design system's small outline button: clearly a control, with an icon that says what a click does */}
      <button
        type="button"
        aria-pressed={weg}
        onClick={toggle}
        className="group self-start inline-flex items-center gap-3 rounded-full border border-slate-500 dark:border-slate-400 pl-2 pr-5 py-2 text-xs font-semibold tracking-wide-xl uppercase text-slate-900 dark:text-white transition-colors duration-300 ease-kopwerk hover:border-amber-600 dark:hover:border-amber-400 motion-reduce:transition-none"
      >
        <span
          aria-hidden="true"
          className="flex size-7 items-center justify-center rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 transition-colors duration-300 ease-kopwerk group-hover:bg-amber-500 group-hover:text-slate-950 group-focus-visible:bg-amber-500 group-focus-visible:text-slate-950 motion-reduce:transition-none"
        >
          {weg ? <RotateCcw className="size-3.5" /> : <Eraser className="size-3.5" />}
        </span>
        <RollingText accentClassName="text-amber-700 dark:text-amber-400">
          {weg ? 'Zet het terug' : 'Streep het door'}
        </RollingText>
      </button>

      <ul className={`border-b ${hairline}`}>
        {items.map((item, index) => (
          <li key={item} className={row}>
            <span
              className={cn(
                'line-through decoration-2 transition-[color,text-decoration-color] duration-500 ease-kopwerk motion-reduce:transition-none',
                delays[index],
                weg
                  ? 'text-slate-500 dark:text-slate-400 decoration-slate-500 dark:decoration-slate-400'
                  : 'text-slate-900 dark:text-white decoration-transparent'
              )}
            >
              {item}
            </span>
            {weg && <span className="sr-only"> (weggelaten)</span>}
          </li>
        ))}
      </ul>
    </figure>
  );
}
