import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Typography } from '../components/ui/Typography';
import { CapsuleButton } from '../components/ui/CapsuleButton';
import { MagneticWrapper } from '../components/ui/MagneticWrapper';
import { NextLink } from '../components/ui/NextLink';
import { Weglaten } from '../components/aanpak/Weglaten';
import { useAmberDot } from '../hooks/useAmberDot';
import { useContact } from '../hooks/useContact';

import { projects } from '../lib/projects';
import { PHONE_MAX_WIDTH } from '../lib/tekentafel';

// The stops the amber dot travels past while you read, in document order.
const STOP = { visie: 0, missie: 1, werkwijze: 2, einde: 3 } as const;

const PHONE = `(max-width: ${PHONE_MAX_WIDTH - 1}px)`;

// "AI maakt, jij beslist" in three steps, word for word from the positionering.
const steps = ['AI doet het maakwerk.', 'Wij kijken wat werkt.', 'Jij beslist wat blijft.'];

const frictions = [
  'Een manier van werken die zo gegroeid is, niet zo bedacht.',
  "Programma's die niet met elkaar samenwerken.",
  'Klanten die merken dat het rommelig loopt, terwijl je werk goed is.',
];

// What we make, as the answer to the frictions: what it does for people, not the kind of product.
const makes = [
  'Een website die klanten in één keer begrijpen.',
  'Een manier van werken die klopt, in plaats van gegroeid is.',
  'AI die terugkerend werk overneemt, terwijl jij beslist.',
  'Eén plek waar je team alles terugvindt.',
  'Schermen die zonder uitleg werken.',
];

// A dot target beside a line of text, in the left margin: on the K's stem on phones, in the gutter on wider screens.
const marker = 'absolute -left-8 sm:-left-10 top-[calc(0.5lh-0.4375rem)] size-3.5';
const hairline = 'border-slate-200 dark:border-slate-800';

/**
 * Hoe Studio Kopwerk werkt, as a short walk: visie, missie, werkwijze. Whitespace separates the chapters; hairlines
 * only separate rows within a list. The amber dot keeps pace with the reader down the margin, from chapter to chapter,
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
      <div className="sm:pl-14 grid gap-6 lg:grid-cols-[minmax(0,1fr)_26rem] xl:grid-cols-[minmax(0,1fr)_30rem] lg:gap-x-16 lg:items-end">
        <div className="flex flex-col gap-4 sm:gap-5">
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
        </div>
        <Typography variant="lead" className="max-w-md text-xl sm:text-2xl md:text-2xl lg:text-2xl text-pretty">
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
        <div className="py-2">
          <Weglaten items={['Meer schermen.', 'Meer stappen.']} />
        </div>
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
        title="Vast in van alles eromheen"
        zoneRef={zone(STOP.missie)}
        markerRef={stop(STOP.missie)}
      >
        <p>
          Studio Kopwerk helpt ondernemers en bedrijven die goed zijn in hun vak, maar vastlopen in van alles eromheen.
        </p>
        <ul className={`border-b ${hairline}`}>
          {frictions.map((item) => (
            <li
              key={item}
              className={`py-5 border-t ${hairline} font-display font-medium text-xl sm:text-2xl leading-snug text-balance text-slate-900 dark:text-white`}
            >
              {item}
            </li>
          ))}
        </ul>
        <p>Wat we maken, hangt af van waar het knelt:</p>
        <ul className="flex flex-col gap-3">
          {makes.map((item) => (
            <li
              key={item}
              className="font-display font-medium text-lg sm:text-xl leading-snug text-pretty text-slate-900 dark:text-white"
            >
              {item}
            </li>
          ))}
        </ul>
        <p>We maken het eenvoudiger, mooier en fijner, voor jou, je team en je klanten.</p>
      </Chapter>

      <Chapter
        id="werkwijze"
        number="03"
        label="Werkwijze"
        title="AI maakt, jij beslist"
        zoneRef={zone(STOP.werkwijze)}
        markerRef={stop(STOP.werkwijze)}
      >
        {/* Numbered steps, no dots: amber stays for the one on the reading line */}
        <ol className="flex flex-col gap-6">
          {steps.map((step, index) => (
            <li key={step} className="flex items-baseline gap-5">
              <span className="font-display font-bold text-sm tracking-wide-lg text-slate-500 dark:text-slate-400">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="font-display font-medium text-2xl sm:text-3xl leading-tight text-slate-900 dark:text-white">
                {step}
              </span>
            </li>
          ))}
        </ol>
        <p>
          AI maakt in korte tijd een eerste versie. Samen kijken we wat werkt, en jij houdt alleen wat je echt helpt.
        </p>
        <p>Ook deze site is zo gemaakt.</p>
      </Chapter>

      {/* One call to action, and the quiet way on to the work once there is some */}
      <section
        ref={zone(STOP.einde)}
        aria-label="Daag ons uit"
        className="py-20 sm:py-28 sm:pl-14 flex flex-col lg:flex-row lg:items-center justify-between gap-10"
      >
        <Typography variant="lead" className="relative">
          <span ref={stop(STOP.einde)} aria-hidden="true" className={marker} />
          Klein beginnen, snel iets maken dat <em className="italic font-normal">werkt</em>.
        </Typography>
        <div className="flex flex-col items-start lg:items-end gap-6">
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
      className="py-16 sm:py-24 sm:pl-14 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-x-16"
    >
      <div className="flex flex-col gap-5">
        <p className="relative flex items-baseline gap-4 text-xs font-semibold tracking-wide-xl uppercase text-slate-500 dark:text-slate-400">
          <span ref={markerRef} aria-hidden="true" className={marker} />
          <span className="font-display font-bold text-sm tracking-wide-lg text-slate-900 dark:text-white">{number}</span>
          {label}
        </p>
        <Typography variant="h2" id={id} className="text-balance leading-tight md:text-4xl xl:text-5xl">
          {title}
        </Typography>
      </div>
      <div className="max-w-xl flex flex-col gap-6 text-base leading-relaxed tracking-wide-sm text-slate-700 dark:text-slate-300 text-pretty">
        {children}
      </div>
    </section>
  );
}
