import { Typography } from '../ui/Typography';
import { kleineDingen } from '../../lib/kleine-dingen';
import { cn } from '../../lib/utils';

/**
 * Kleine dingen, below the opdrachten on /werk: what Martijn makes in between. One short card each (the kind, the
 * name, two sentences and one detail as the image), quieter than an opdracht: no film, no number.
 */
export function KleineDingen() {
  return (
    <section
      aria-labelledby="kleine-dingen"
      className="mt-20 sm:mt-28 pt-12 sm:pt-16 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-10 sm:gap-14 kopwerk-reveal"
    >
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-x-16 lg:items-end">
        <div className="flex flex-col gap-4">
          <Typography variant="eyebrow">Kleine dingen</Typography>
          <Typography variant="h2" as="h2" id="kleine-dingen" className="text-balance">
            Wat ik tussendoor maak
          </Typography>
        </div>
        <Typography variant="lead" className="max-w-xl text-lg sm:text-lg md:text-xl lg:text-xl text-pretty">
          Geen opdracht, wel echt werk. Kleine proeven met AI, om te zien wat werkt voordat ik het voor jou maak.
        </Typography>
      </div>

      <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {kleineDingen.map((ding) => (
          <li
            key={ding.titel}
            className="flex flex-col gap-4 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-kopwerk-dark/80 shadow-xl shadow-slate-900/5"
          >
            <div
              className={cn(
                'aspect-[16/10] overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800',
                ding.grond === 'donker' ? 'bg-kopwerk-dark' : 'bg-white'
              )}
            >
              <img
                src={ding.beeld}
                alt={ding.alt}
                loading="lazy"
                decoding="async"
                className={cn('block size-full', ding.grond === 'donker' ? 'object-contain' : 'object-cover object-left-top')}
              />
            </div>
            <span className="text-xs font-semibold tracking-wide-xl uppercase text-amber-700 dark:text-amber-400">
              {ding.soort}
            </span>
            <h3 className="font-display font-semibold text-2xl leading-snug text-slate-900 dark:text-white">
              {ding.titel}
            </h3>
            <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 text-pretty">{ding.tekst}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
