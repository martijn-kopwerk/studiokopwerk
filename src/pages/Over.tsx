import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Typography } from '../components/ui/Typography';
import { CapsuleButton } from '../components/ui/CapsuleButton';
import { Weglaten } from '../components/over/Weglaten';
import { useAmberDot } from '../hooks/useAmberDot';
import { useContact } from '../hooks/useContact';
import { PHONE_MAX_WIDTH } from '../lib/tekentafel';

// The stops the amber dot travels past while you read, in document order.
const STOP = { visie: 0, missie: 1, werkwijze: 2, stap: 3, principes: 6, tijd: 7 } as const;

const PHONE = `(max-width: ${PHONE_MAX_WIDTH - 1}px)`;

const steps = ['AI doet het maakwerk.', 'Wij kijken wat werkt.', 'Jij beslist wat blijft.'];

const principles = [
  { title: 'Maken boven praten.', text: 'Een werkend prototype zegt meer dan een plan.' },
  { title: 'Rust.', text: 'Witruimte, weinig tekst en één punt van aandacht, zoals de amber stip.' },
  { title: 'De mens beslist.', text: 'AI schrijft en maakt, een mens kijkt en tekent.' },
  { title: 'Eenvoud.', text: 'De eigen processen zo simpel mogelijk, en die van de klant ook.' },
];

// A dot target beside a line of text, in the left margin: on the K's stem on phones, in the gutter on wider screens.
const marker = 'absolute -left-8 sm:-left-10 top-[calc(0.5lh-0.4375rem)] size-3.5';
const hairline = 'border-slate-200 dark:border-slate-800';

/**
 * Over Studio Kopwerk, as a short walk: visie, missie, werkwijze, principes. The amber dot
 * keeps pace with the reader, from chapter to chapter and down the three steps of "AI maakt, jij beslist",
 * ending beside the call to action. It reads the same without the dot; it's only a guide.
 */
export function Over() {
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
            Over
          </Typography>
          <h1
            tabIndex={-1}
            className="font-display font-normal text-4xl sm:text-6xl md:text-7xl tracking-wide-md uppercase leading-none text-slate-900 dark:text-white text-balance outline-none"
          >
            Wat ertoe doet
          </h1>
        </div>
        <Typography variant="body" className="max-w-md tracking-wide-sm text-pretty">
          Studio Kopwerk helpt ondernemers en bedrijven die goed zijn in hun vak om hun werk en klantervaring
          eenvoudiger, mooier en fijner te maken. We maken snel iets dat werkt: AI doet het maakwerk, jij beslist wat
          blijft.
        </Typography>
      </div>

      {/* The gap where the background's K has its vertex on phones (read by AbstractBackground) */}
      <div data-tekentafel-vertex aria-hidden="true" className="h-28 sm:h-20 shrink-0" />

      <Chapter
        id="visie"
        number="01"
        label="Visie"
        title="Meer is niet vanzelf beter"
        zoneRef={zone(STOP.visie)}
        markerRef={stop(STOP.visie)}
      >
        <p>
          Iets maken is nog nooit zo makkelijk geweest. Een tekst, een tool, een prototype: met AI staat het er in een
          middag.
        </p>
        <p>Toch wordt het daar niet vanzelf beter van. Vaak komt er vooral méér bij:</p>
        <div className="py-4">
          <Weglaten />
        </div>
        <p>
          Het echte werk zit in zien wat ertoe doet, en de rest durven weglaten. Dat zie je het snelst door het te maken.
        </p>
      </Chapter>

      <Chapter
        id="missie"
        number="02"
        label="Missie"
        title="Goed in je vak, vast in van alles eromheen"
        zoneRef={zone(STOP.missie)}
        markerRef={stop(STOP.missie)}
      >
        <p>Het vak zelf loopt goed. Het gedoe eromheen niet.</p>
        <ul className={`border-b ${hairline}`}>
          {[
            'Processen die gegroeid zijn in plaats van ontworpen.',
            'Tools die niet op elkaar aansluiten.',
            'Een klantervaring die rommeliger is dan het werk verdient.',
          ].map((item) => (
            <li
              key={item}
              className={`py-5 border-t ${hairline} font-display font-medium text-xl sm:text-2xl leading-snug text-balance text-slate-900 dark:text-white`}
            >
              {item}
            </li>
          ))}
        </ul>
        <p>
          We maken het eenvoudiger, mooier en fijner. Klein beginnen, snel iets maken dat werkt.
        </p>
      </Chapter>

      <Chapter
        id="werkwijze"
        number="03"
        label="Werkwijze"
        title="AI maakt, jij beslist"
        zoneRef={zone(STOP.werkwijze)}
        markerRef={stop(STOP.werkwijze)}
      >
        {/* A timeline: the dot steps down its nodes as you read. A hairline joins the nodes. */}
        <ol className="relative before:absolute before:left-[0.40625rem] before:top-10 before:bottom-10 before:w-px before:bg-slate-200 dark:before:bg-slate-800">
          {steps.map((step, index) => (
            <li key={step} ref={zone(STOP.stap + index)} className="relative pl-10 py-6">
              <span
                ref={stop(STOP.stap + index)}
                aria-hidden="true"
                className="absolute left-0 top-[calc(1.5rem+0.5lh-0.4375rem)] size-3.5 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-kopwerk-dark"
              />
              <p className="font-display font-medium text-2xl sm:text-3xl leading-tight text-slate-900 dark:text-white">
                {step}
              </p>
            </li>
          ))}
        </ol>
        <p>Geen slogan: zo draait Studio Kopwerk zelf ook.</p>
      </Chapter>

      <Chapter
        id="principes"
        number="04"
        label="Principes"
        title="Vier principes houden het werk scherp"
        zoneRef={zone(STOP.principes)}
        markerRef={stop(STOP.principes)}
      >
        <dl className={`border-b ${hairline}`}>
          {principles.map((principle) => (
            <div key={principle.title} className={`py-6 border-t ${hairline} flex flex-col gap-2`}>
              <dt className="font-display font-semibold text-xl tracking-wide-sm text-slate-900 dark:text-white">
                {principle.title}
              </dt>
              <dd>{principle.text}</dd>
            </div>
          ))}
        </dl>
      </Chapter>

      <section
        ref={zone(STOP.tijd)}
        aria-label="Tijd voor actie"
        className={`py-20 sm:py-28 sm:pl-14 border-t ${hairline} flex flex-col lg:flex-row lg:items-center justify-between gap-10`}
      >
        <div className="flex flex-col gap-4">
          <Typography variant="lead" className="relative">
            <span ref={stop(STOP.tijd)} aria-hidden="true" className={marker} />
            Zien wat <em className="italic font-normal">wérkt</em>.
          </Typography>
          <Typography variant="body" className="max-w-md tracking-wide-sm text-pretty">
            Snel iets werkends in handen, in plaats van een plan op papier.
          </Typography>
        </div>
        <CapsuleButton onClick={openContact} onPointerEnter={preloadContact} onFocus={preloadContact} className="sm:w-auto">
          Daag ons uit
        </CapsuleButton>
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
      className={`py-20 sm:py-28 sm:pl-14 border-t ${hairline} grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-x-16`}
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
      <div className="max-w-xl flex flex-col gap-6 text-base sm:text-lg leading-relaxed tracking-wide-sm text-slate-700 dark:text-slate-300 text-pretty">
        {children}
      </div>
    </section>
  );
}
