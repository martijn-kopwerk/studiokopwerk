import { CornerDownRight } from 'lucide-react';
import { hairline } from '../lib/raster';
import { cn } from '../lib/utils';

export interface Knelpunt {
  knelt: string;
  maken: string;
}

// What gets stuck, and what we make for it: what it does for people, never the kind of product. Word for word from
// the positionering, in its order.
export const knelpunten: Knelpunt[] = [
  {
    knelt: 'Werk dat loopt zoals het ooit gegroeid is, met stappen die niemand meer kan uitleggen.',
    maken: 'Werk dat logisch loopt, van aanvraag tot factuur.',
  },
  { knelt: "Gegevens verspreid over losse programma's.", maken: 'Eén plek waar je alles terugvindt.' },
  {
    knelt: 'Klanten die op je website niet snappen wat je doet, terwijl je werk goed is.',
    maken: 'Een website waarop klanten meteen zien wat je doet.',
  },
  {
    knelt: 'Werk dat elke week opnieuw met de hand gaat.',
    maken: 'AI die het werk doet dat steeds terugkomt. Jij beslist wat ermee gebeurt.',
  },
  { knelt: 'Schermen waar je eerst uitleg bij nodig hebt.', maken: 'Schermen die zonder uitleg werken.' },
];

/**
 * Each friction as a couplet: what knelt, quiet, and below it what we make for it, in Syne. No table, no
 * column labels: it reads as one sentence turning round, the same on every screen.
 */
export function Knelpunten({ items = knelpunten }: { items?: Knelpunt[] }) {
  return (
    <dl className={`border-b ${hairline}`}>
      {items.map(({ knelt, maken }) => (
        <div key={knelt} className={cn('flex flex-col gap-1.5 py-5 border-t', hairline)}>
          <dt className="text-sm sm:text-base leading-relaxed tracking-wide-sm text-slate-500 dark:text-slate-400 text-pretty">
            {knelt}
          </dt>
          <dd className="relative pl-7 font-display font-medium text-lg sm:text-xl leading-snug text-pretty text-slate-900 dark:text-white">
            <CornerDownRight
              aria-hidden="true"
              className="absolute left-0 top-[calc(0.5lh-0.5rem)] size-4 text-slate-400 dark:text-slate-500"
            />
            {maken}
          </dd>
        </div>
      ))}
    </dl>
  );
}
