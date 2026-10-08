import { useEffect, useRef, useState, type ReactNode } from 'react';
import { RotateCw } from 'lucide-react';
import { Typography } from '../components/ui/Typography';
import { CapsuleButton } from '../components/ui/CapsuleButton';
import { MagneticWrapper } from '../components/ui/MagneticWrapper';
import { NextLink } from '../components/ui/NextLink';
import { Weglaten } from '../components/aanpak/Weglaten';
import { useAmberDot } from '../hooks/useAmberDot';
import { useContact } from '../hooks/useContact';

import { projects } from '../lib/projects';
import { PHONE_MAX_WIDTH } from '../lib/tekentafel';
import { hairline, raster } from '../lib/raster';
import { cn } from '../lib/utils';

// The stops the amber dot travels past while you read, in document order.
const STOP = { visie: 0, missie: 1, werkwijze: 2, einde: 3 } as const;

const PHONE = `(max-width: ${PHONE_MAX_WIDTH - 1}px)`;

// "AI maakt, jij beslist" in three steps, word for word from the positionering. They go round, not in order.
const steps = ['AI doet het maakwerk.', 'Wij kijken wat werkt.', 'Jij beslist wat blijft.'];

// What gets stuck, and what we make for it: what it does for people, never the kind of product.
const pairs = [
  { knelt: 'Een manier van werken die zo gegroeid is, niet zo bedacht.', maken: 'Een manier van werken die klopt.' },
  { knelt: "Programma's die niet met elkaar samenwerken.", maken: 'Eén plek waar je team alles terugvindt.' },
  {
    knelt: 'Klanten die merken dat het rommelig loopt, terwijl je werk goed is.',
    maken: 'Een website die klanten in één keer begrijpen.',
  },
  { knelt: 'Werk dat elke week opnieuw met de hand gaat.', maken: 'AI die terugkerend werk overneemt, terwijl jij beslist.' },
  { knelt: 'Schermen waar je eerst uitleg bij nodig hebt.', maken: 'Schermen die zonder uitleg werken.' },
];

// Running text, and the small uppercase labels above columns.
const prose = 'text-base leading-relaxed tracking-wide-sm text-slate-700 dark:text-slate-300 text-pretty';
const label = 'text-xs font-semibold tracking-wide-xl uppercase text-slate-500 dark:text-slate-400';

// A dot target beside a line of text, in the left margin: on the K's stem on phones, in the gutter on wider screens.
const marker = 'absolute -left-8 sm:-left-10 top-[calc(0.5lh-0.4375rem)] size-3.5';

/**
 * Hoe Studio Kopwerk werkt, as a short walk: visie, missie, werkwijze. Each chapter is a row on the site's grid
 * (src/lib/raster.ts) with a hairline above, and every list uses the same row style. The amber dot keeps pace with the reader down the margin, from chapter to chapter,
 * ending beside the call to action. It never leaves that reading line here, and the page reads the same without it.
 */
export function Aanpak() {
  const { openContact, preloadContact } = useContact();
  const zones = useRef<(HTMLElement | null)[]>([]);
  const markers = useRef<(HTMLElement | null)[]>([]);
  const intro = useRef<HTMLSpanElement | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [phone, setPhone] = useState(false);

  // Before the first chapter the dot rests beside the eyebrow; on phones it stays on the K's vertex, in the gap below the intro.
  useAmberDot(
    () => (active !== null ? (markers.current[active] ?? null) : phone ? null : intro.current),
    `${active}-${phone}`,
    true
  );

  useEffect(() => {
    const query = window.matchMedia(PHONE);
    const update = () => setPhone(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  // The active stop is the last one whose block has reached the middle of the screen (none above the first).
  useEffect(() => {
    let pending = false;
    const update = () => {
      pending = false;
      const middle = window.innerHeight / 2;
      let next: number | null = null;
      for (let i = 0; i < zones.current.length; i++) {
        const zone = zones.current[i];
        if (zone && zone.getBoundingClientRect().top <= middle) next = i;
      }
      setActive(next);
    };
    const schedule = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  const zone = (index: number) => (el: HTMLElement | null) => {
    zones.current[index] = el;
  };
  const stop = (index: number) => (el: HTMLElement | null) => {
    markers.current[index] = el;
  };

  return (
    <main className="relative z-10 w-full max-w-7xl mx-auto pl-14 pr-6 sm:px-10 flex-1 pt-6 sm:pt-12 pb-8 motion-safe:animate-rise [--rise-from:16px]">
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
        id="visie"
        number="01"
        label="Visie"
        title="Technologie is pas goed als mensen er beter van worden"
        zoneRef={zone(STOP.visie)}
        markerRef={stop(STOP.visie)}
      >
        <p>
          Iets maken is nog nooit zo makkelijk geweest. Een tekst, een tool, een eerste versie: met AI staat het er in een
          middag.
        </p>
        <p>
          Toch wordt het daar niet vanzelf beter van, zeker niet voor de mensen die ermee moeten werken.
        </p>
        <Weglaten items={['Meer schermen.', 'Meer stappen.']} />
        <p>Mensen passen zich aan de techniek aan, in plaats van andersom.</p>
        <p>
          Volgens ons hoort het andersom. Technologie is pas goed als het voor mensen beter wordt: rustiger, duidelijker
          en fijner. Het echte werk zit in zien wat ertoe doet, en de rest durven weglaten. Dat zie je het snelst door
          het te maken, samen met de mensen voor wie het is.
        </p>
      </Chapter>

      <Chapter
        id="missie"
        number="02"
        label="Missie"
        title="Vast in het digitale eromheen"
        zoneRef={zone(STOP.missie)}
        markerRef={stop(STOP.missie)}
        wide={
          <>
            {/* Each friction beside its answer, on the page's two columns; on phones the answer follows its friction */}
            <div aria-hidden="true" className={cn(raster, 'hidden lg:grid pb-3', label)}>
              <span>Wat knelt</span>
              <span>Wat we maken</span>
            </div>
            <dl className={`border-b ${hairline}`}>
              {pairs.map(({ knelt, maken }) => (
                <div key={knelt} className={cn(raster, 'gap-y-2 py-4 border-t', hairline)}>
                  <dt className={prose}>{knelt}</dt>
                  <dd className="font-display font-medium text-lg sm:text-xl leading-snug text-pretty text-slate-900 dark:text-white">
                    {maken}
                  </dd>
                </div>
              ))}
            </dl>
            <div className={raster}>
              <p className={cn('lg:col-start-2 max-w-xl pt-8', prose)}>
                We maken het eenvoudiger, mooier en fijner, voor jou, je team en je klanten.
              </p>
            </div>
          </>
        }
      >
        <p>
          Studio Kopwerk helpt ondernemers en bedrijven die goed zijn in hun vak, maar vastlopen in het digitale eromheen.
        </p>
        <p>Wat we maken, hangt af van waar het knelt.</p>
      </Chapter>

      <Chapter
        id="werkwijze"
        number="03"
        label="Werkwijze"
        title="AI maakt, jij beslist"
        zoneRef={zone(STOP.werkwijze)}
        markerRef={stop(STOP.werkwijze)}
      >
        {/* The design system's Timeline without numbers, because it's a loop, not a sequence: hollow nodes on a
            hairline, amber only where a person decides, and the line ending in the turn back to the start */}
        <ul className="flex flex-col">
          {steps.map((step, index) => {
            const last = index === steps.length - 1;
            return (
              <li
                key={step}
                className={cn(
                  'relative pl-10 py-4 font-display font-medium text-lg sm:text-xl leading-snug text-slate-900 dark:text-white',
                  'after:absolute after:left-[6.5px] after:top-[calc(1rem+0.5lh)] after:h-full after:w-px after:bg-slate-300 dark:after:bg-slate-700'
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute z-10 left-0 top-[calc(1rem+0.5lh-0.4375rem)] size-3.5 rounded-full',
                    last
                      ? 'bg-amber-500 shadow-[0_0_0_4px_rgba(245,158,11,0.2)]'
                      : 'border border-slate-500 dark:border-slate-400 bg-slate-50 dark:bg-kopwerk-dark'
                  )}
                />
                {step}
              </li>
            );
          })}
          <li className="relative pl-10 py-4 text-slate-500 dark:text-slate-400">
            <RotateCw
              aria-hidden="true"
              className="absolute left-0 top-[calc(1rem+0.5lh-0.4375rem)] size-3.5 bg-slate-50 dark:bg-kopwerk-dark"
            />
            En dan weer opnieuw, tot het werkt.
          </li>
        </ul>
        <p>
          AI maakt in korte tijd een eerste versie. Samen kijken we wat werkt, jij houdt alleen wat je echt helpt, en
          daarmee begint de volgende ronde.
        </p>
        <p>Ook deze site is zo gemaakt.</p>
      </Chapter>

      {/* One call to action on the same grid: the line on the left, the button where the explanations start */}
      <section
        ref={zone(STOP.einde)}
        aria-label="Daag ons uit"
        className={`py-10 sm:py-16 sm:ml-14 border-t ${hairline} ${raster} lg:items-center`}
      >
        <Typography variant="lead" className="relative text-xl sm:text-2xl md:text-2xl lg:text-2xl text-pretty">
          <span ref={stop(STOP.einde)} aria-hidden="true" className={marker} />
          Klein beginnen, snel iets maken dat <em className="italic font-normal">werkt</em>.
        </Typography>
        <div className="flex flex-col items-start gap-6">
          {/* The same button as on home, magnetic too */}
          <MagneticWrapper>
            <CapsuleButton onClick={openContact} onPointerEnter={preloadContact} onFocus={preloadContact} className="w-auto">
              Daag ons uit
            </CapsuleButton>
          </MagneticWrapper>
          {/* /werk only exists while there's an opdracht to show (see routes.tsx) */}
          {projects.length > 0 && <NextLink href="/werk">Verder: wat wérkt</NextLink>}
        </div>
      </section>
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
  wide,
  children,
}: {
  id: string;
  number: string;
  label: string;
  title: string;
  zoneRef: (el: HTMLElement | null) => void;
  markerRef: (el: HTMLElement | null) => void;
  // Content across both columns, below the row (it keeps to the grid itself).
  wide?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      ref={zoneRef}
      aria-labelledby={id}
      className={`py-10 sm:py-16 sm:ml-14 border-t ${hairline} ${raster}`}
    >
      <div className="flex flex-col gap-5">
        <p className="relative flex items-baseline gap-4 text-xs sm:text-sm font-medium tracking-super-wide uppercase text-slate-500 dark:text-slate-400">
          <span ref={markerRef} aria-hidden="true" className={marker} />
          <span className="font-display font-bold text-sm tracking-wide-lg text-slate-900 dark:text-white">{number}</span>
          {label}
        </p>
        <Typography variant="h2" id={id} className="text-balance">
          {title}
        </Typography>
      </div>
      <div className={cn('max-w-xl flex flex-col gap-6', prose)}>{children}</div>
      {wide && <div className="lg:col-span-2">{wide}</div>}
    </section>
  );
}
