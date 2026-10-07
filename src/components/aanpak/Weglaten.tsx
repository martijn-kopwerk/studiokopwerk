import { useState } from 'react';
import { RollingText } from '../ui/RollingText';
import { cn } from '../../lib/utils';

// One after the other, so the strike reads as a single gesture.
const delays = ['', '[transition-delay:90ms]', '[transition-delay:180ms]', '[transition-delay:270ms]'];

/**
 * The vision, done rather than told: what piles up is struck through with one click, and can come back.
 * The lines stay in place and readable; screen readers hear them as left out.
 */
export function Weglaten({ items }: { items: string[] }) {
  const [weg, setWeg] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col gap-1">
        {items.map((extra, index) => (
          <li key={extra}>
            <span
              className={cn(
                'font-display font-medium text-3xl sm:text-4xl leading-tight line-through decoration-2 transition-[color,text-decoration-color] duration-500 ease-kopwerk motion-reduce:transition-none',
                delays[index],
                weg
                  ? 'text-slate-500 dark:text-slate-400 decoration-slate-500 dark:decoration-slate-400'
                  : 'text-slate-900 dark:text-white decoration-transparent'
              )}
            >
              {extra}
            </span>
            {weg && <span className="sr-only"> (weggelaten)</span>}
          </li>
        ))}
      </ul>
      <button
        type="button"
        aria-pressed={weg}
        onClick={() => setWeg((current) => !current)}
        className="group self-start -mx-3 px-3 py-2 rounded-full text-xs font-semibold tracking-wide-xl uppercase text-slate-500 dark:text-slate-400 outline-none focus-visible:ring-4 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-kopwerk-dark"
      >
        <RollingText accentClassName="text-amber-700 dark:text-amber-400">
          {weg ? 'Zet het terug' : 'Streep het door'}
        </RollingText>
      </button>
    </div>
  );
}
