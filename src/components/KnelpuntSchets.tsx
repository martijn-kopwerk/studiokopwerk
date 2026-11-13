import { useState } from 'react';
import { m, useReducedMotion } from 'motion/react';
import { Icon } from './ui/Icon';
import { cn } from '../lib/utils';

export type SchetsNaam = 'stroom' | 'plek' | 'website' | 'herhaling' | 'scherm';

// Illustrations of a possible change, not finished products or measured customer results.
const schetsen: Record<SchetsNaam, {
  nu: string[];
  straks: string[];
  proberen: string;
  uitlegNu: string;
  uitlegStraks: string;
}> = {
  stroom: {
    nu: ['Een aanvraag komt binnen', 'Gegevens opnieuw overtypen', 'Ontbrekende informatie zoeken', 'De offerte maken'],
    straks: ['Een aanvraag komt binnen', 'De gegevens gaan mee', 'Jij kijkt de offerte na'],
    proberen: 'Probeer een kortere route',
    uitlegNu: 'Tussen de aanvraag en de offerte zit veel overnemen en zoeken.',
    uitlegStraks: 'Gegevens gaan mee naar de volgende stap. Jij houdt de controle.',
  },
  plek: {
    nu: ['Een mail openen', 'Het overzicht erbij zoeken', 'De notities terugvinden', 'Weer terug naar de mail'],
    straks: ['Een klant openen', 'Mail, notities en werk bij elkaar', 'Verder met de vraag'],
    proberen: 'Breng het bij elkaar',
    uitlegNu: 'Om één vraag te beantwoorden moet je op verschillende plekken kijken.',
    uitlegStraks: 'Wat bij de klant hoort staat bij elkaar. Je kunt verder met het werk.',
  },
  website: {
    nu: ['Wat doet dit bedrijf?', 'Is dit ook voor mij?', 'Waar moet ik beginnen?'],
    straks: ['Dit doet het bedrijf', 'Dit past bij mijn vraag', 'Dit is mijn volgende stap'],
    proberen: 'Maak de route duidelijker',
    uitlegNu: 'Een bezoeker moet zelf uitzoeken wat je doet en waar hij verder kan.',
    uitlegStraks: 'Je aanbod, voor wie het is en de volgende stap volgen elkaar op.',
  },
  herhaling: {
    nu: ['Dezelfde gegevens verzamelen', 'Weer een antwoord schrijven', 'Alles overnemen', 'De volgende keer opnieuw'],
    straks: ['AI maakt een concept', 'Jij leest het na en stuurt bij', 'Klaar om zelf te versturen'],
    proberen: 'Laat AI het voorwerk doen',
    uitlegNu: 'Hetzelfde voorwerk komt steeds terug. Jij begint telkens opnieuw.',
    uitlegStraks: 'Je begint met een concept. Het oordeel en het versturen blijven bij jou.',
  },
  scherm: {
    nu: ['Waar moet ik klikken?', 'Wat moet ik hier invullen?', 'Even iemand om uitleg vragen'],
    straks: ['Eén duidelijke vraag', 'Een begrijpelijke keuze', 'Weten hoe je verdergaat'],
    proberen: 'Probeer een eenvoudiger scherm',
    uitlegNu: 'Mensen moeten uitleg vragen voordat ze met het scherm kunnen werken.',
    uitlegStraks: 'Het scherm helpt bij de keuze die op dat moment nodig is.',
  },
};

/** A visitor can rearrange a familiar situation into a possible approach. No timer or automatic loop. */
export function KnelpuntSchets({ naam, className }: { naam: SchetsNaam; className?: string }) {
  const [anders, setAnders] = useState(false);
  const reduceMotion = useReducedMotion();
  const schets = schetsen[naam];
  const stappen = anders ? schets.straks : schets.nu;
  const uitleg = anders ? schets.uitlegStraks : schets.uitlegNu;

  return (
    <figure className={cn('tekenvel w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6', className)}>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2 text-sm text-subtle dark:text-slate-400">
        <span>Schets van je werk</span>
        <span className="font-medium text-slate-900 dark:text-white">{anders ? 'Een mogelijke aanpak' : 'Herkenbaar?'}</span>
      </figcaption>

      <ol aria-label={anders ? 'Een mogelijke aanpak' : 'De beginsituatie'} className="min-h-64 flex flex-col justify-center gap-3 py-6">
        {stappen.map((stap, index) => (
          <m.li
            key={index}
            layout={!reduceMotion}
            initial={false}
            animate={{ marginLeft: anders ? 0 : index % 2 === 0 ? 0 : 20, marginRight: anders ? 0 : index % 2 === 0 ? 20 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.19, 1, 0.22, 1] }}
            className="relative flex items-center gap-3"
          >
            {index < stappen.length - 1 && <span aria-hidden="true" className="absolute left-1.5 top-5 -bottom-5 border-l border-slate-300 dark:border-slate-700" />}
            <span aria-hidden="true" className={cn('relative z-10 size-3 shrink-0 rounded-full border transition-colors duration-500 ease-kopwerk motion-reduce:transition-none', anders && index === stappen.length - 1 ? 'bg-amber-500 border-amber-500' : 'bg-slate-50 dark:bg-kopwerk-dark border-slate-400 dark:border-slate-500')} />
            <span className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/90 dark:bg-kopwerk-dark/90 px-4 py-3 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
              {stap}
            </span>
          </m.li>
        ))}
      </ol>

      <p aria-live="polite" aria-atomic="true" className="min-h-20 text-sm leading-relaxed text-subtle dark:text-slate-400">
        {uitleg}
      </p>
      <button
        type="button"
        aria-pressed={anders}
        onClick={() => setAnders(!anders)}
        className="group inline-flex items-center gap-3 rounded-lg py-2 text-left text-sm font-medium text-slate-900 dark:text-white"
      >
        <Icon name={anders ? 'restart' : 'arrow-right'} className="size-4 shrink-0 text-amber-700 dark:text-amber-400" />
        <span className="underline underline-offset-4">{anders ? 'Bekijk de beginsituatie' : schets.proberen}</span>
      </button>
    </figure>
  );
}
