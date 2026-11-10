import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from 'react';
import { Link } from 'wouter';
import { Typography } from '../components/ui/Typography';
import { useAmberDot } from '../hooks/useAmberDot';
import { hairline, raster } from '../lib/raster';
import { PHONE_MAX_WIDTH } from '../lib/tekentafel';
import { cn } from '../lib/utils';
import { headingId, versies, type Voorwaarden as Versie } from '../lib/voorwaarden';

const PHONE = `(max-width: ${PHONE_MAX_WIDTH - 1}px)`;

// Running text, set like Privacy. Article numbers (the **1.1** at the start of a paragraph) stand out by colour,
// not by weight; links are underlined so they read as links without colour.
const prose = cn(
  'max-w-2xl flex flex-col gap-5 text-base leading-relaxed tracking-wide-sm text-slate-700 dark:text-slate-300 text-pretty',
  '[&_a]:underline [&_a]:underline-offset-4',
  '[&_strong]:font-semibold [&_strong]:text-slate-900 dark:[&_strong]:text-white',
  '[&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5 [&_ul]:list-disc [&_li]:marker:text-amber-700 dark:[&_li]:marker:text-amber-400'
);

const text = (children: unknown): string =>
  typeof children === 'string' ? children : Array.isArray(children) ? children.map(text).join('') : '';

// Each part (A to D) starts a new row with a hairline above; each article can be linked to (#artikel-12).
const components = {
  h2: ({ children }: ComponentPropsWithoutRef<'h2'>) => (
    <h2
      id={headingId(text(children))}
      className={cn(
        'scroll-mt-28 mt-10 sm:mt-14 pt-10 sm:pt-14 border-t font-display font-medium text-2xl sm:text-4xl leading-8 sm:leading-10 tracking-heading text-slate-900 dark:text-white text-balance',
        hairline
      )}
    >
      {children}
    </h2>
  ),
  h3: ({ children }: ComponentPropsWithoutRef<'h3'>) => (
    <h3
      id={headingId(text(children))}
      className="scroll-mt-28 mt-6 font-display font-medium text-xl sm:text-2xl leading-snug text-slate-900 dark:text-white text-balance"
    >
      {children}
    </h3>
  ),
};

/**
 * De algemene voorwaarden, als gewone tekst die je kunt lezen, doorzoeken en opslaan. Bovenaan staat de versie,
 * daaronder de inhoud met een link naar elk artikel. Een eerdere versie zegt dat er een nieuwere is; onderaan staan
 * alle versies, zodat een offerte altijd naar de afgesproken versie kan wijzen (artikel 2.1).
 * The amber dot rests beside the eyebrow on wider screens and on the K's vertex on phones, as on Privacy.
 */
export function Voorwaarden({ versie }: { versie: Versie }) {
  const intro = useRef<HTMLSpanElement | null>(null);
  const [phone, setPhone] = useState(false);
  const nieuwste = versies[0]!;
  const ouder = versie.date !== nieuwste.date;
  const { Text } = versie;

  useAmberDot(() => (phone ? null : intro.current), phone, true);

  useEffect(() => {
    const query = window.matchMedia(PHONE);
    const update = () => setPhone(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return (
    <main id="inhoud" className="relative z-10 w-full max-w-7xl mx-auto pl-14 pr-6 sm:px-10 flex-1 pt-6 sm:pt-12 pb-8 motion-safe:animate-rise [--rise-from:16px]">
      <div className="sm:pl-14 flex flex-col gap-4 sm:gap-5">
        <Typography variant="eyebrow" as="p" className="relative">
          <span
            ref={intro}
            aria-hidden="true"
            className="absolute -left-8 sm:-left-10 top-[calc(0.5lh-0.4375rem)] size-3.5"
          />
          Voorwaarden
        </Typography>
        <h1
          tabIndex={-1}
          className="font-display font-normal text-4xl sm:text-6xl md:text-7xl tracking-display leading-[1.05] text-slate-900 dark:text-white text-balance outline-none"
        >
          Algemene voorwaarden
        </h1>
        <Typography variant="lead" className="max-w-xl text-xl sm:text-2xl md:text-2xl lg:text-2xl text-pretty">
          {`Versie van ${versie.label}.`}
        </Typography>
        {ouder && (
          <p className="max-w-xl text-base leading-relaxed text-slate-700 dark:text-slate-300">
            Dit is een eerdere versie. Ze geldt voor opdrachten die we toen afspraken. De nieuwste staat op{' '}
            <Link href="/voorwaarden" className="underline underline-offset-4">
              studiokopwerk.nl/voorwaarden
            </Link>
            .
          </p>
        )}
      </div>

      {/* The gap where the background's K has its vertex on phones (read by AbstractBackground) */}
      <div data-tekentafel-vertex aria-hidden="true" className="h-28 sm:h-12 shrink-0" />

      <nav aria-labelledby="inhoudsopgave" className={cn('py-10 sm:py-16 sm:ml-14 border-t', hairline, raster)}>
        <Typography variant="h2" id="inhoudsopgave" className="text-balance">
          Inhoud
        </Typography>
        <ol className="max-w-2xl flex flex-col gap-1 text-base leading-relaxed text-slate-700 dark:text-slate-300">
          {versie.headings.map((heading) => (
            <li key={heading.id} className={heading.level === 2 ? 'mt-4 first:mt-0 text-slate-900 dark:text-white font-medium' : ''}>
              <a href={`#${heading.id}`} className="-my-1 py-1 hover:underline underline-offset-4 rounded-sm">
                {heading.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className={cn('sm:ml-14 pb-10 sm:pb-16 [&>:first-child]:mt-0', prose)}>
        <Text components={components} />
      </div>

      <section aria-labelledby="versies" className={cn('py-10 sm:py-16 sm:ml-14 border-t', hairline, raster)}>
        <Typography variant="h2" id="versies" className="text-balance">
          Versies
        </Typography>
        <div className={prose}>
          <p>
            Voor een opdracht geldt de versie die we toen afspraken. Daarom blijft elke versie hier te lezen, op een
            eigen adres.
          </p>
          <ul>
            {versies.map((item) => (
              <li key={item.date}>
                <Link href={item.path}>{item.label}</Link>
                {item.date === nieuwste.date && ' (nieuwste)'}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
