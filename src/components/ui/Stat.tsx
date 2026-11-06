import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

/**
 * A saving as a number (design system: `Stat`): the figure large in Syne bold, a small unit beside it, and below it
 * the sentence that makes it a saving ("Dat scheelt zeker vijf minuten per mail."). Only figures that are given.
 */
export function Stat({
  value,
  unit,
  children,
  className,
}: {
  value: string;
  unit?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure className={cn('flex flex-col gap-3', className)}>
      <span
        aria-hidden="true"
        className="font-display font-medium text-6xl sm:text-7xl leading-none tracking-heading tabular-nums text-slate-900 dark:text-white"
      >
        {value}
        {unit && (
          <span className="ml-2 text-2xl sm:text-3xl font-medium text-subtle dark:text-slate-400">{unit}</span>
        )}
      </span>
      <figcaption className="text-lg sm:text-xl font-normal leading-snug text-pretty text-slate-700 dark:text-slate-300">
        {children}
      </figcaption>
    </figure>
  );
}
