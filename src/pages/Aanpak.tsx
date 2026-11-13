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
const STOP = { verloop: 0, vragen: 1, werkwijze: 2 } as const;

// How an opdracht goes, in the order it happens.
const stappen: [string, ReactNode][] = [
  ['Een gesprek zoals het jou uitkomt', 'Vrijblijvend, online of bij jou op de zaak, waar je ook onderneemt in Nederland. We praten over je werk.'],
  [
    'Samen kiezen waar het knelt',
    'We kiezen één ding dat je wilt verbeteren. We spreken vooraf af wat ik maak en wat het kost. In de offerte staat ook wanneer je het kunt proberen en wat je krijgt bij de overdracht.',
  ],
  [
    'Zelf proberen en samen bijstellen',
    'Ik maak met AI de proefversie, met verzonnen gegevens. Jij probeert hem en vertelt wat beter kan. Samen stellen we bij binnen de afspraken van de offerte.',
  ],
  [
    'Jij kiest of je verder wilt',
    'Wil je ermee verder? Dan spreken we af wat daarvoor nodig is, wie het oppakt en wat het kost. Een proefversie verplicht je niet om verder te bouwen.',
  ],
];

// What a reader still wants to know before mailing, answered in a sentence or two each.
const vragen: [string, ReactNode][] = [
  [
    'Wat kan ik proberen?',
    'Een werkende proefversie van de oplossing, bijvoorbeeld de weg van een aanvraag naar een offerte of een paar schermen van je nieuwe portaal. Je klikt erdoorheen, probeert het met je eigen werk in gedachten en laat het aan je team zien. Er staan nog verzonnen gegevens in. Zo weet je wat werkt, voordat je meer laat maken.',
  ],
  [
    'Moet ik verstand hebben van AI?',
    'Nee. We praten over jouw werk. Ik maak de proefversie en jij probeert of je werk er duidelijker of gemakkelijker van wordt.',
  ],
  [
    'Wat gebeurt er met mijn gegevens?',
    <>
      Een proefversie maken we met verzonnen gegevens. Met echte gegevens werken we pas als jij dat wilt. De AI die we
      gebruiken, traint er niet mee. Meer daarover lees je bij{' '}
      <Link href="/privacy" className="underline underline-offset-4">
        privacy
      </Link>
      .
    </>,
  ],
  [
    'Wanneer kan ik de proefversie proberen?',
    'Dat spreken we per opdracht af. In de offerte staat de planning, met een concrete datum voor de eerste proefversie.',
  ],
  [
    'Wat krijg ik bij de overdracht?',
    'Dat spreken we vooraf af en zetten we in de offerte. Daarin staat welke bestanden je krijgt, of de code erbij hoort en waarmee je daarna verder kunt.',
  ],
  [
    'En als ik het echt wil gebruiken?',
    'Een proefversie is bedoeld om te proberen. Voor dagelijks gebruik is verder werk nodig, bijvoorbeeld voor je eigen gegevens of toegang voor klanten en medewerkers. Als je verder wilt, spreken we apart af wie dat doet, wat het kost en wie het daarna bijhoudt. Je kunt ook kiezen voor een eigen ontwikkelaar; de overdracht stemmen we daarop af.',
  ],
];

const PHONE = `(max-width: ${PHONE_MAX_WIDTH - 1}px)`;

// Running text.
const prose = 'text-base leading-relaxed tracking-wide-sm text-slate-700 dark:text-slate-300 text-pretty';

// A dot target beside a line of text, in the left margin: on the K's stem on phones, in the gutter on wider screens.
const marker = 'absolute -left-8 sm:-left-10 top-[calc(0.5lh-0.4375rem)] size-3.5';

/**
 * Hoe Studio Kopwerk werkt, as a short walk in the reader's order: how an opdracht goes, the questions left before
 * you mail and how we work (the werkwijze). Where it pinches
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
          className="font-display font-normal text-4xl sm:text-6xl md:text-7xl tracking-display leading-[1.05] text-slate-900 dark:text-white text-balance outline-none"
        >
          Zo werken we samen
        </h1>
        <Typography variant="lead" className="max-w-xl text-xl sm:text-2xl md:text-2xl lg:text-2xl text-pretty">
          Eerst proberen, dan beslissen. Je test zelf een werkende proefversie en ziet wat die je oplevert.
        </Typography>
      </div>

      {/* The gap where the background's K has its vertex on phones (read by AbstractBackground) */}
      <div data-tekentafel-vertex aria-hidden="true" className="h-12 sm:h-12 shrink-0" />

      <Chapter
        id="verloop"
        number="01"
        label="Zo verloopt het"
        title="Van je vraag naar een proefversie"
        zoneRef={zone(STOP.verloop)}
        markerRef={stop(STOP.verloop)}
      >
        {/* A real sequence, so a numbered list: the talk, choosing what pinches, the proefversie, finishing it */}
        <ol className="flex flex-col">
          {stappen.map(([kop, tekst], index) => (
            <li key={kop} className={`grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4 py-5 border-t ${hairline} first:border-t-0 first:pt-0`}>
              <span className="font-display font-semibold text-sm leading-relaxed text-slate-900 dark:text-white">
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
        <p>
          Ik beoordeel wat AI maakt. Met mijn kennis en ervaring bewaak ik de kwaliteit en controleer ik of het werk past bij wat we hebben afgesproken.
        </p>
        {/* The werkwijze as the design system's Loop: three steps that go round, amber where you decide */}
        <Rondgang className="my-4" />
        {/* The proof that it works, linked once /werk exists (see routes.tsx) */}
        <p>
          {projects.length > 0 ? (
            <>
              Zo gaat elke opdracht. Ook deze site is zo gemaakt, net als{' '}
              <Link href="/werk" className="underline underline-offset-4">
                de opdrachten op Werk
              </Link>
              .
            </>
          ) : (
            'Zo gaat elke opdracht. Ook deze site is zo gemaakt.'
          )}
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
        <p className="relative flex items-baseline gap-4 text-sm font-medium text-subtle dark:text-slate-400">
          <span ref={markerRef} aria-hidden="true" className={marker} />
          <span className="font-display font-semibold text-sm text-slate-900 dark:text-white">{number}</span>
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
