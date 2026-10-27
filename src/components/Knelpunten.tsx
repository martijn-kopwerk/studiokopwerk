import { useEffect, useId, useState } from 'react';
import { CapsuleButton } from './ui/CapsuleButton';
import { Icon } from './ui/Icon';
import { KnelpuntSchets, type SchetsNaam } from './KnelpuntSchets';
import { mailtoHref } from '../lib/contact';
import { hairline } from '../lib/raster';
import { cn } from '../lib/utils';

export interface Knelpunt {
  knelt: string;
  maken: string;
  // The sketch of what we make, shown when the friction is chosen.
  schets?: SchetsNaam;
}

// What gets stuck, and what we make for it: what it does for people, never the kind of product. Word for word from
// the positionering, in its order.
export const knelpunten: Knelpunt[] = [
  {
    knelt: 'Werk dat loopt zoals het ooit gegroeid is, met stappen die niemand meer kan uitleggen.',
    maken: 'Werk dat logisch loopt, van aanvraag tot factuur.',
    schets: 'stroom',
  },
  { knelt: "Gegevens verspreid over losse programma's.", maken: 'Eén plek waar je alles terugvindt.', schets: 'plek' },
  {
    knelt: 'Klanten die op je website niet snappen wat je doet, terwijl je werk goed is.',
    maken: 'Een website waarop klanten meteen zien wat je doet.',
    schets: 'website',
  },
  {
    knelt: 'Werk dat elke week opnieuw met de hand gaat.',
    maken: 'AI die het werk doet dat steeds terugkomt. Jij beslist wat ermee gebeurt.',
    schets: 'herhaling',
  },
  { knelt: 'Schermen waar je eerst uitleg bij nodig hebt.', maken: 'Schermen die zonder uitleg werken.', schets: 'scherm' },
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
          <dt className="text-sm sm:text-base leading-relaxed tracking-wide-sm text-subtle dark:text-slate-400 text-pretty">
            {knelt}
          </dt>
          <dd className="relative pl-7 font-display font-medium text-lg sm:text-xl leading-snug text-pretty text-slate-900 dark:text-white">
            <Icon
              name="corner-down-right"
              className="absolute left-0 top-[calc(0.5lh-0.5rem)] size-4 text-slate-400 dark:text-slate-500"
            />
            {maken}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * The frictions to choose from (design system: "Wat we maken", on the website). Each friction is a button; choosing
 * one shows what we make for it and "Vertel het in een mail", which opens the mail with that friction in the subject.
 * No form, one choice. Before the script runs it is the plain list of pairs, so it reads the same without it.
 * Phones show the first three and "Toon alle vijf", so the walk on Begin stays short. The first one starts open, so
 * whoever doesn't click still sees that each friction has an answer.
 */
export function KnelpuntKiezer({ items = knelpunten }: { items?: Knelpunt[] }) {
  const [interactive, setInteractive] = useState(false);
  const [gekozen, setGekozen] = useState<number | null>(0);
  const [alle, setAlle] = useState(false);
  const id = useId();
  const kort = 3;

  useEffect(() => setInteractive(true), []);

  if (!interactive) return <Knelpunten items={items} />;

  return (
    <div className="flex flex-col items-start gap-6">
      <ul className={`w-full border-b ${hairline}`}>
        {items.map(({ knelt, maken, schets }, index) => {
          const open = gekozen === index;
          return (
            <li
              key={knelt}
              className={cn('border-t', hairline, !alle && index >= kort && gekozen !== index && 'max-sm:hidden')}
            >
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`${id}-${index}`}
                onClick={() => setGekozen(open ? null : index)}
                className={cn(
                  'group w-full grid grid-cols-[1.25rem_minmax(0,1fr)] gap-3 py-5 text-left rounded-2xl text-sm sm:text-base leading-relaxed tracking-wide-sm text-pretty transition-colors duration-300 ease-kopwerk motion-reduce:transition-none',
                  open
                    ? 'text-slate-900 dark:text-white'
                    : 'text-subtle dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
                )}
              >
                {/* A hollow ring that fills amber when chosen: the shape says it as well as the colour */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'mt-[calc(0.5lh-0.4375rem)] size-3.5 rounded-full border transition-[background-color,border-color,box-shadow] duration-500 ease-kopwerk motion-reduce:transition-none',
                    open
                      ? 'border-amber-500 bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]'
                      : 'border-slate-500 dark:border-slate-400 group-hover:border-slate-900 dark:group-hover:border-white',
                  )}
                />
                {knelt}
              </button>
              <div id={`${id}-${index}`} hidden={!open} className="pl-8 pb-8">
                <div className="flex flex-col items-start gap-6 motion-safe:animate-rise [--rise-from:10px] [animation-duration:0.6s]">
                  {schets && <KnelpuntSchets naam={schets} />}
                  <p className="relative pl-7 font-display font-medium text-lg sm:text-xl leading-snug text-pretty text-slate-900 dark:text-white">
                    <Icon
                      name="corner-down-right"
                      className="absolute left-0 top-[calc(0.5lh-0.5rem)] size-4 text-slate-400 dark:text-slate-500"
                    />
                    {maken}
                  </p>
                  <CapsuleButton href={mailtoHref(knelt)} className="w-auto">
                    Vertel het in een mail
                  </CapsuleButton>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {!alle && items.length > kort && (
        <button
          type="button"
          onClick={() => setAlle(true)}
          className="sm:hidden group inline-flex items-center gap-3 -mx-1 px-1 py-1 rounded-full text-xs font-semibold tracking-wide-xl uppercase text-slate-700 dark:text-slate-300"
        >
          Toon alle {items.length === 5 ? 'vijf' : items.length}
          <Icon name="chevron-down" className="size-4" />
        </button>
      )}
    </div>
  );
}
