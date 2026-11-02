import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'wouter';
import { Typography } from '../components/ui/Typography';
import { Rondgang } from '../components/Rondgang';
import { useAmberDot } from '../hooks/useAmberDot';
import { useReadingStops } from '../hooks/useReadingStops';

import { projects } from '../lib/projects';
import { PHONE_MAX_WIDTH } from '../lib/tekentafel';
import { hairline, raster } from '../lib/raster';
import { cn } from '../lib/utils';

// The stops the amber dot travels past while you read, in document order.
const STOP = { verloop: 0, vragen: 1, werkwijze: 2, waarom: 3 } as const;

// How an opdracht goes, in the order it happens.
const stappen: [string, ReactNode][] = [
  ['Een gesprek zoals het jou uitkomt', 'Vrijblijvend, online of bij jou op de zaak. Waar je ook onderneemt in Nederland. We praten over je werk.'],
  ['Eén onderdeel kiezen', 'Je krijgt een voorstel met een vaste prijs vanaf €\u00a0500 exclusief btw. We spreken af wat je wilt proberen.'],
  [
    'Binnen twee weken na akkoord een eerste versie',
    'Een werkend voorbeeld met voorbeeldgegevens. Je probeert het zelf en vertelt wat anders moet. Eén ronde aanpassen hoort erbij.',
  ],
  ['Daarmee kun je verder', 'Je houdt het voorbeeld en de bestanden waarmee het is gemaakt. Voor verder bouwen, online zetten en onderhouden maken we aparte afspraken.'],
];

// What a reader still wants to know before mailing, answered in a sentence or two each.
const vragen: [string, ReactNode][] = [
  [
    'Wat krijg ik voor mijn geld?',
    'Een prototype van één afgesproken onderdeel: een werkend voorbeeld om te proberen en van te leren. Bijvoorbeeld de weg van een aanvraag naar een offerte of een paar schermen van je nieuwe portaal.',
  ],
  [
    'Is het dan klaar voor mijn klanten of medewerkers?',
    'Je krijgt eerst een voorbeeld om te proberen, met voorbeeldgegevens. Om het dagelijks te gebruiken is verdere uitwerking nodig. Soms kan ik daar ook bij helpen. Dat hangt af van de techniek en de afspraken met de ontwikkelaars die verder bouwen.',
  ],
  [
    'Moet ik verstand hebben van AI?',
    'Nee. We praten over jouw werk. Ik maak het voorbeeld en jij probeert of het duidelijker of gemakkelijker wordt.',
  ],
  [
    'Wat gebeurt er met mijn gegevens?',
    <>
      Een eerste versie maken we met voorbeeldgegevens. Met echte gegevens werken we pas als jij dat wilt. De AI die we
      gebruiken, traint er niet mee. Meer daarover lees je bij{' '}
      <Link href="/privacy" className="underline underline-offset-4">
        privacy
      </Link>
      .
    </>,
  ],
  ['Van wie is het?', 'Van jou. Je krijgt ook de bestanden waarmee het voorbeeld is gemaakt. Een ander kan er later dus op verder bouwen.'],
  [
    'Wie zet het online en houdt het werkend?',
    'Dat spreken we apart af: wat er nodig is, wie het oppakt en wat het kost. Verder bouwen, online zetten en onderhouden vallen buiten de prijs van het prototype. Afhankelijk van de techniek en de afspraken met ontwikkelaars kan ik daarbij helpen.',
  ],
];

const PHONE = `(max-width: ${PHONE_MAX_WIDTH - 1}px)`;

// Running text.
const prose = 'text-base leading-relaxed tracking-wide-sm text-slate-700 dark:text-slate-300 text-pretty';

// A dot target beside a line of text, in the left margin: on the K's stem on phones, in the gutter on wider screens.
const marker = 'absolute -left-8 sm:-left-10 top-[calc(0.5lh-0.4375rem)] size-3.5';

/**
 * Hoe Studio Kopwerk werkt, as a short walk in the reader's order: how an opdracht goes, from the talk to what you use
 * every day; how we work (the werkwijze); why (the visie); and the questions left before you mail. Where it pinches
 * is on Begin, so it isn't repeated here. Each chapter is a row on the site's grid
 * (src/lib/raster.ts) with a hairline above, and every list uses the same row style. The amber dot keeps pace with the reader down the margin, from chapter to chapter,
 * ending beside the call to action. It never leaves that reading line here, and the page reads the same without it.
 */
export function Aanpak() {
  const { active, markers, zone, stop } = useReadingStops();
  const intro = useRef<HTMLSpanElement | null>(null);
  const [phone, setPhone] = useState(false);

  // Before the first chapter the dot rests beside the eyebrow; on phones it stays on the K's vertex, in the gap below the intro.
  useAmberDot(
    () => (active !== null ? (markers.current[active] ?? null) : phone ? null : intro.current),
    `${active}-${phone}`,
    true,
    false,
    // The loop in "Hoe we werken" has its own dot: the reading dot steps aside while that chapter is read
    active === STOP.werkwijze
  );

  useEffect(() => {
    const query = window.matchMedia(PHONE);
    const update = () => setPhone(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return (
    <main id="inhoud" className="relative z-10 w-full max-w-7xl mx-auto pl-14 pr-6 sm:px-10 flex-1 pt-6 sm:pt-12 pb-8 motion-safe:animate-rise [--rise-from:16px]">
      {/* Eyebrow, title and lead stacked on the text line, as the design system's hero */}
      <div className="sm:pl-14 flex flex-col gap-4 sm:gap-5">
        <Typography variant="eyebrow" as="p" className="relative">
          <span ref={intro} aria-hidden="true" className={marker} />
          Aanpak
        </Typography>
        <h1
          tabIndex={-1}
          className="font-display font-normal text-4xl sm:text-6xl md:text-7xl tracking-wide-md uppercase leading-none text-slate-900 dark:text-white text-balance outline-none"
        >
          Zo werken we samen
        </h1>
        <Typography variant="lead" className="max-w-xl text-xl sm:text-2xl md:text-2xl lg:text-2xl text-pretty">
          Eerst een werkend voorbeeld. Je probeert het zelf en ontdekt wat je verder wilt laten bouwen.
        </Typography>
      </div>

      {/* The gap where the background's K has its vertex on phones (read by AbstractBackground) */}
      <div data-tekentafel-vertex aria-hidden="true" className="h-12 sm:h-12 shrink-0" />

      <Chapter
        id="verloop"
        number="01"
        label="Zo verloopt het"
        title="Van je vraag naar een werkend voorbeeld"
        zoneRef={zone(STOP.verloop)}
        markerRef={stop(STOP.verloop)}
      >
        {/* A real sequence, so a numbered list: the talk, the proposal, the first version, what you have at the end */}
        <ol className="flex flex-col">
          {stappen.map(([kop, tekst], index) => (
            <li key={kop} className={`grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4 py-5 border-t ${hairline} first:border-t-0 first:pt-0`}>
              <span className="font-display font-bold text-sm leading-relaxed tracking-wide-lg text-slate-900 dark:text-white">
                {index + 1}
              </span>
              <span className="flex flex-col gap-1">
                <span className="font-medium text-slate-900 dark:text-white">{kop}</span>
                <span>{tekst}</span>
              </span>
            </li>
          ))}
        </ol>
      </Chapter>

      <Chapter
        id="vragen"
        number="02"
        label="Vragen"
        title="Wat je wilt weten voor je mailt"
        zoneRef={zone(STOP.vragen)}
        markerRef={stop(STOP.vragen)}
      >
        <dl className="flex flex-col">
          {vragen.map(([vraag, antwoord]) => (
            <div key={vraag} className={`flex flex-col gap-1 py-5 border-t ${hairline} first:border-t-0 first:pt-0`}>
              <dt className="font-medium text-slate-900 dark:text-white">{vraag}</dt>
              <dd>{antwoord}</dd>
            </div>
          ))}
        </dl>
      </Chapter>

      <Chapter
        id="werkwijze"
        number="03"
        label="Hoe we werken"
        title="AI maakt, jij beslist"
        zoneRef={zone(STOP.werkwijze)}
        markerRef={stop(STOP.werkwijze)}
      >
        {/* The werkwijze as the design system's Loop: three steps that go round, amber where you decide */}
        <Rondgang className="my-4" />
        <p>
          Ik kijk hoe je werk nu gaat en maak met AI een eerste versie. Samen proberen we of die doet wat je bedoelt. Jij beslist wat blijft.
        </p>
        <p>Bij de afgesproken prijs hoort één ronde aanpassen. Wil je daarna meer proberen, dan spreken we dat apart af.</p>
        {/* The proof that it works, linked once /werk exists (see routes.tsx) */}
        <p>
          {projects.length > 0 ? (
            <>
              Ook deze site is zo gemaakt, net als{' '}
              <Link href="/werk" className="underline underline-offset-4">
                het programma waarmee Studio Kopwerk zelf draait
              </Link>
              .
            </>
          ) : (
            'Ook deze site is zo gemaakt.'
          )}
        </p>
      </Chapter>

      <Chapter
        id="waarom"
        number="04"
        label="Waarom zo"
        title="Techniek is pas goed als mensen er beter van worden"
        zoneRef={zone(STOP.waarom)}
        markerRef={stop(STOP.waarom)}
      >
        <p>
          Een nieuw scherm of meer AI maakt je werk niet vanzelf beter. Daarom beginnen we met één vraag en een voorbeeld dat je zelf kunt proberen.
        </p>
        <p>
          Techniek moet het werk rustiger, duidelijker en fijner maken. Door eerst te proberen zie je wat helpt en wat je kunt weglaten.
        </p>
      </Chapter>

    </main>
  );
}

// A chapter is a row on the grid, as the design system sets a document: the conclusion on the left, its
// explanation on the right, a hairline above. On phones the two stack.
function Chapter({
  id,
  number,
  label,
  title,
  zoneRef,
  markerRef,
  children,
}: {
  id: string;
  number: string;
  label: string;
  title: string;
  zoneRef: (el: HTMLElement | null) => void;
  markerRef: (el: HTMLElement | null) => void;
  children: ReactNode;
}) {
  return (
    <section
      ref={zoneRef}
      aria-labelledby={id}
      className={`py-10 sm:py-16 sm:ml-14 border-t ${hairline} ${raster} kopwerk-reveal`}
    >
      <div className="flex flex-col gap-5">
        <p className="relative flex items-baseline gap-4 text-xs sm:text-sm font-medium tracking-super-wide uppercase text-subtle dark:text-slate-400">
          <span ref={markerRef} aria-hidden="true" className={marker} />
          <span className="font-display font-bold text-sm tracking-wide-lg text-slate-900 dark:text-white">{number}</span>
          {label}
        </p>
        <Typography variant="h2" id={id} className="text-balance">
          {title}
        </Typography>
      </div>
      <div className={cn('max-w-xl flex flex-col gap-6', prose)}>{children}</div>
    </section>
  );
}
