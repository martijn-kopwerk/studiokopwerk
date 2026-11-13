import { useEffect, useId, useState } from 'react';
import { CapsuleButton } from './ui/CapsuleButton';
import { Icon } from './ui/Icon';
import { KnelpuntSchets, type SchetsNaam } from './KnelpuntSchets';
import { mailtoHref } from '../lib/contact';
import { hairline } from '../lib/raster';
import { cn } from '../lib/utils';
import { OpenUitnodiging } from './OpenUitnodiging';

export interface Knelpunt {
  knelt: string;
  // The same short wording is shown on the website and used in the mail subject.
  label?: string;
  maken: string;
  aanpak?: string;
  // An explorable sketch of a possible approach, shown when the friction is chosen.
  schets?: SchetsNaam;
}

// Five concrete work situations, chosen with Martijn. Labels also become the mail subject.
export const knelpunten: Knelpunt[] = [
  {
    knelt: 'Je portaal bevat goede informatie, maar is lastig te gebruiken',
    maken: 'Mensen vinden sneller wat ze nodig hebben en kunnen verder zonder steeds uitleg te vragen.',
    aanpak: 'Ik kijk waar gebruikers vastlopen en ontwerp een duidelijkere indeling. Met AI werk ik die uit tot een proefversie die je zelf kunt proberen.',
    schets: 'portaal',
  },
  {
    knelt: 'Elke offerte is maatwerk, maar het uitwerken kost veel tijd',
    maken: 'Een offerte speciaal voor jouw klant, met veel minder tijd voor het uitwerken.',
    aanpak: 'Ik kijk hoe je offertes maakt. Ik maak een proefversie waarin AI de klantvraag uitwerkt met jouw aanbod en afspraken. Jij controleert inhoud en prijs.',
    schets: 'offerte',
  },
  {
    knelt: 'Je werk is goed, maar je website maakt dat niet duidelijk',
    maken: 'Bezoekers begrijpen wat je doet, of je hen kunt helpen en hoe ze je kunnen bereiken.',
    aanpak: 'Ik verdiep me in je bedrijf en de vragen van je klanten. Met AI werk ik het verhaal en ontwerp uit tot een website die je kunt proberen.',
    schets: 'website',
  },
  {
    knelt: 'Je medewerkers houden eigen lijstjes naast het systeem bij',
    maken: 'Minder dubbel bijhouden. Samen zien wat nog moet, wat loopt en wat klaar is.',
    aanpak: 'Ik onderzoek waarom de lijstjes nodig zijn en ontwerp een passend overzicht. We proberen waar AI helpt bij het verwerken van updates.',
    schets: 'werkoverzicht',
  },
  {
    knelt: 'Voor één klantvraag zoek je in drie verschillende programma’s',
    maken: 'Minder zoeken en schakelen voordat je een klant kunt helpen.',
    aanpak: 'We kiezen welke bronnen nodig zijn. Ik maak een proefversie waarin AI de informatie samenbrengt en een antwoord voorbereidt. Jij kijkt het na.',
    schets: 'plek',
  },
];

/**
 * Each friction as a couplet: what knelt, quiet, and below it what we make for it, in Syne. No table, no
 * column labels: it reads as one sentence turning round, the same on every screen.
 */
export function Knelpunten({ items = knelpunten }: { items?: Knelpunt[] }) {
  return (
    <dl className={`border-b ${hairline}`}>
      {items.map(({ knelt, label, maken, aanpak }) => (
        <div key={knelt} className={cn('flex flex-col gap-1.5 py-5 border-t', hairline)}>
          <dt className="text-sm sm:text-base leading-relaxed tracking-wide-sm text-subtle dark:text-slate-400 text-pretty">
            {label ?? knelt}
          </dt>
          <dd className="relative pl-7 font-display font-medium text-lg sm:text-xl leading-snug text-pretty text-slate-900 dark:text-white">
            <Icon
              name="corner-down-right"
              className="absolute left-0 top-[calc(0.5lh-0.5rem)] size-4 text-slate-400 dark:text-slate-500"
            />
            {maken}
            {aanpak && <p className="mt-3 font-sans font-normal text-sm leading-relaxed text-slate-700 dark:text-slate-300">{aanpak}</p>}
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
 * All five situations start closed, so visitors can scan the complete choice before opening an example.
 */
export function KnelpuntKiezer({ items = knelpunten }: { items?: Knelpunt[] }) {
  const [interactive, setInteractive] = useState(false);
  const [gekozen, setGekozen] = useState<number | null>(null);
  const id = useId();

  useEffect(() => setInteractive(true), []);

  if (!interactive) return <><Knelpunten items={items} /><OpenUitnodiging /></>;

  return (
    <div className="flex flex-col items-start gap-6">
      <ul className={`w-full border-b ${hairline}`}>
        {items.map(({ knelt, label, maken, aanpak, schets }, index) => {
          const open = gekozen === index;
          return (
            <li
              key={knelt}
              className={cn('border-t', hairline)}
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
                      ? 'border-amber-500 bg-amber-500'
                      : 'border-slate-500 dark:border-slate-400 group-hover:border-slate-900 dark:group-hover:border-white',
                  )}
                />
                {label ?? knelt}
              </button>
              <div id={`${id}-${index}`} hidden={!open} className="sm:pl-8 pb-8">
                <div className="flex flex-col items-start gap-6 motion-safe:animate-rise [--rise-from:10px] [animation-duration:0.6s]">
                  <p className="relative pl-7 font-display font-medium text-lg sm:text-xl leading-snug text-pretty text-slate-900 dark:text-white">
                    <Icon
                      name="corner-down-right"
                      className="absolute left-0 top-[calc(0.5lh-0.5rem)] size-4 text-slate-400 dark:text-slate-500"
                    />
                    {maken}
                  </p>
                  {aanpak && <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">{aanpak}</p>}
                  <CapsuleButton href={mailtoHref(label ?? knelt)} className="w-auto">
                    Vertel het in een mail
                  </CapsuleButton>
                  {schets && <KnelpuntSchets naam={schets} />}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <OpenUitnodiging />

    </div>
  );
}
