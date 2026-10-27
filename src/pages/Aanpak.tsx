import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'wouter';
import { Typography } from '../components/ui/Typography';
import { Weglaten } from '../components/aanpak/Weglaten';
import { Knelpunten } from '../components/Knelpunten';
import { Rondgang } from '../components/Rondgang';
import { useAmberDot } from '../hooks/useAmberDot';
import { useReadingStops } from '../hooks/useReadingStops';

import { projects } from '../lib/projects';
import { PHONE_MAX_WIDTH } from '../lib/tekentafel';
import { hairline, raster } from '../lib/raster';
import { cn } from '../lib/utils';

// The stops the amber dot travels past while you read, in document order.
const STOP = { knelt: 0, werkwijze: 1, waarom: 2 } as const;

const PHONE = `(max-width: ${PHONE_MAX_WIDTH - 1}px)`;

// Running text.
const prose = 'text-base leading-relaxed tracking-wide-sm text-slate-700 dark:text-slate-300 text-pretty';

// A dot target beside a line of text, in the left margin: on the K's stem on phones, in the gutter on wider screens.
const marker = 'absolute -left-8 sm:-left-10 top-[calc(0.5lh-0.4375rem)] size-3.5';

/**
 * Hoe Studio Kopwerk werkt, as a short walk in the reader's order: where it pinches (the missie), how we work
 * (the werkwijze) and why (the visie). Each chapter is a row on the site's grid
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
          Wat ertoe doet
        </h1>
        <Typography variant="lead" className="max-w-xl text-xl sm:text-2xl md:text-2xl lg:text-2xl text-pretty">
          Zien wat <em className="italic font-normal">wérkt</em>. Snel iets werkends in handen, in plaats van een plan
          op papier.
        </Typography>
      </div>

      {/* The gap where the background's K has its vertex on phones (read by AbstractBackground) */}
      <div data-tekentafel-vertex aria-hidden="true" className="h-28 sm:h-12 shrink-0" />

      <Chapter
        id="knelt"
        number="01"
        label="Waar het knelt"
        title="Goed in je vak, vast in je systemen"
        zoneRef={zone(STOP.knelt)}
        markerRef={stop(STOP.knelt)}
      >
        <p>
          Je bent goed in je vak, maar loopt vast in het digitale eromheen. Wat we maken, hangt af van waar het knelt.
        </p>
        <Knelpunten />
      </Chapter>

      <Chapter
        id="werkwijze"
        number="02"
        label="Hoe we werken"
        title="AI maakt, jij beslist"
        zoneRef={zone(STOP.werkwijze)}
        markerRef={stop(STOP.werkwijze)}
      >
        {/* The werkwijze as the design system's Loop: three steps that go round, amber where you decide */}
        <Rondgang className="my-4" />
        {/* In the order it happens: the talk, the proposal, the first version, real data only if you want, then what you have at the end */}
        <p>
          Het begint met een vrijblijvend gesprek, bij jou op de zaak. Daarna krijg je een voorstel met een vaste prijs.
          Een eerste opdracht kost vanaf €&nbsp;500.
        </p>
        <p>
          Dan maakt AI in korte tijd een eerste versie, met voorbeeldgegevens. Je hoeft er zelf geen verstand van te
          hebben: je ziet het en zegt wat klopt.
        </p>
        <p>
          Met echte gegevens werken we pas als jij dat wilt. De AI die we gebruiken, traint er niet mee. Meer daarover lees
          je bij{' '}
          <Link href="/privacy" className="underline underline-offset-4">
            privacy
          </Link>
          .
        </p>
        <p>
          Aan het eind heb je iets wat je elke dag gebruikt: een website, een programma of werk dat vanzelf gaat. Geen
          rapport.
        </p>
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
        number="03"
        label="Waarom zo"
        title="Techniek is pas goed als mensen er beter van worden"
        zoneRef={zone(STOP.waarom)}
        markerRef={stop(STOP.waarom)}
      >
        <p>
          Iets maken is nog nooit zo makkelijk geweest. Een tekst, een programma, een eerste versie: met AI staat het er in
          een middag.
        </p>
        <p>
          Toch wordt het werk daar niet vanzelf beter van, zeker niet voor de mensen die ermee moeten werken. Er komen
          meer schermen en meer stappen bij. Mensen passen zich aan de techniek aan.
        </p>
        <p>
          Volgens ons hoort het andersom: techniek moet het werk rustiger, duidelijker en fijner maken. Het echte werk is
          zien wat ertoe doet en de rest durven weglaten.
        </p>
        {/* First the story, then the reader does it: strike out what piles up and what matters is left */}
        <Weglaten
          vraag="Probeer het zelf: wat blijft er over?"
          items={['Meer schermen.', 'Meer stappen.']}
          rest="Wat ertoe doet."
        />
        <p>Wat ertoe doet, zie je het snelst door het te maken, samen met de mensen voor wie het is.</p>
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
