import { useRef, type ReactNode } from 'react';
import { Link } from 'wouter';
import { Typography } from '../components/ui/Typography';
import { CapsuleButton } from '../components/ui/CapsuleButton';
import { MagneticWrapper } from '../components/ui/MagneticWrapper';
import { NextLink } from '../components/ui/NextLink';
import { useAmberDot } from '../hooks/useAmberDot';
import { useContact } from '../hooks/useContact';
import { projects } from '../lib/projects';
import { hairline, raster } from '../lib/raster';
import { cn } from '../lib/utils';

/**
 * The portrait: src/content/over/portret.(avif|webp|jpg|png), already graded black and white. No CSS filter
 * (the design system allows none), so amber stays the only warm point on the page. Until the file is there,
 * the frame shows where it goes.
 */
const portraitFiles = import.meta.glob<string>('../content/over/portret.{avif,webp,jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
});
const portrait = Object.values(portraitFiles)[0];

// What's in the photo, for people who can't see it.
const portraitAlt =
  'Zwart-witportret van Martijn: krullend haar, een gestreept overhemd, de armen over elkaar. Hij lacht naar de camera, voor een open stalen kast.';

// Running text.
const prose = 'text-base leading-relaxed tracking-wide-sm text-slate-700 dark:text-slate-300 text-pretty';

// A dot target beside a line of text, in the left margin: on the K's stem on phones, in the gutter on wider screens.
const marker = 'absolute -left-8 sm:-left-10 top-[calc(0.5lh-0.4375rem)] size-3.5';

/**
 * Wie je spreekt: a name, a black-and-white portrait and a few sentences by Martijn, in the first person.
 * It answers what the other pages leave open: who you talk to, where, and why it works this way. Set on the same grid as Aanpak: the photo in the narrow column, the text beside it,
 * then rows with a conclusion on the left. Every fact here comes from Martijn; nothing is invented.
 */
export function Over() {
  const { openContact, preloadContact } = useContact();
  const intro = useRef<HTMLSpanElement | null>(null);

  // The dot rests in the margin beside the eyebrow; the footer takes it over at the end.
  useAmberDot(() => intro.current, 'over', true);

  return (
    <main className="relative z-10 w-full max-w-7xl mx-auto pl-14 pr-6 sm:px-10 flex-1 pt-6 sm:pt-12 pb-8 motion-safe:animate-rise [--rise-from:16px]">
      <div className="sm:pl-14 flex flex-col gap-4 sm:gap-5">
        <Typography variant="eyebrow" as="p" className="relative">
          <span ref={intro} aria-hidden="true" className={marker} />
          Over
        </Typography>
        <h1
          tabIndex={-1}
          className="font-display font-normal text-4xl sm:text-6xl md:text-7xl tracking-wide-md uppercase leading-none text-slate-900 dark:text-white text-balance outline-none"
        >
          Martijn
        </h1>
        <Typography variant="lead" className="max-w-xl text-xl sm:text-2xl md:text-2xl lg:text-2xl text-pretty">
          Ik help ondernemers die vastlopen in het digitale eromheen. Met AI maak ik in korte tijd iets wat je kunt{' '}
          <em className="italic font-normal">gebruiken</em>.
        </Typography>
      </div>

      {/* The gap where the background's K has its vertex on phones (read by AbstractBackground) */}
      <div data-tekentafel-vertex aria-hidden="true" className="h-28 sm:h-12 shrink-0" />

      {/* The portrait in the narrow column, off-centre, with room beside it for the first words */}
      <section aria-label="Wie je spreekt" className={`py-10 sm:py-16 sm:ml-14 border-t ${hairline} ${raster}`}>
        <div className="flex flex-col gap-4">
          <Portrait />
          <p className="max-w-sm text-sm leading-relaxed tracking-wide-sm text-slate-500 dark:text-slate-400 text-pretty">
            Ik woon in Haren, net onder Groningen. Langskomen kan in heel Nederland.
          </p>
        </div>
        <div className={cn('max-w-xl flex flex-col gap-6 lg:pt-2', prose)}>
          <p>
            Aan het begin van mijn loopbaan zag ik een collega elke week met de hand dezelfde rapportages maken. Dat kon
            handiger, dacht ik. Ik leerde mezelf hoe en liet de computer het werk doen. Dat scheelde een dag werk per week.
          </p>
          <p>
            Dat doe ik nog steeds, ook bij mijn eigen werk. Onlangs nog met mijn mail: die handel ik nu af met hulp van AI, in{' '}
            {/* Operatie Kopwerk, the opdracht on /werk, which only exists while there's an opdracht to show */}
            {projects.length > 0 ? (
              <Link href="/werk" className="underline underline-offset-4">
                mijn eigen programma
              </Link>
            ) : (
              'mijn eigen programma'
            )}
            . Outlook hoef ik niet meer te openen.
          </p>
        </div>
      </section>

      <Row id="gezien" title="Ik zag hoe techniek het werk zwaarder kan maken">
        <p>
          Al tien jaar bepaal ik bij grote organisaties wat er gemaakt wordt en waarom. Ik hielp er ook grote programma's
          invoeren.
        </p>
        <p>
          Steeds zag ik hetzelfde: schermen die ingewikkelder waren dan nodig en stappen met de hand die het werk
          ophielden. Het extra werk kwam terecht bij de mensen die het al druk hadden.
        </p>
      </Row>

      <Row id="ervaring" title="Wat ik daar leerde, gun ik ook ondernemers">
        <p>
          Een ondernemer heeft meestal niemand in huis die het digitale eromheen al eens heeft ingericht. Ik neem die
          ervaring mee, zonder de lange trajecten en vergaderingen.
        </p>
        <p>
          Maken kon ik altijd al, maar het duurde lang en vaak waren er meerdere mensen voor nodig. Met AI doe ik het nu
          zelf, in korte tijd.
        </p>
      </Row>

      <Row id="verwachten" title="Je spreekt steeds met mij">
        <p>
          Het eerste gesprek kan bij jou op de zaak. Dan zie ik hoe het werk nu loopt. Ik praat over je werk, niet over
          techniek: je hoeft geen computertaal te spreken.
        </p>
        <p>
          Studio Kopwerk doe ik naast mijn werk als productmanager. Daarom neem ik weinig opdrachten tegelijk aan: wie
          met mij werkt, krijgt mijn aandacht.
        </p>
      </Row>

      <Row id="naam" title="Kopwerk staat voor denkwerk en voor op kop rijden">
        <p>Kopwerk is het menselijke denkwerk, met je kop. En het is op kop rijden: voorop blijven met wat AI kan.</p>
      </Row>

      <section
        aria-label="Vertel waar het knelt"
        className={`py-10 sm:py-16 sm:ml-14 border-t ${hairline} ${raster} lg:items-center`}
      >
        <Typography variant="lead" className="text-xl sm:text-2xl md:text-2xl lg:text-2xl text-pretty">
          Je mail komt bij mij binnen. Ik lees hem zelf.
        </Typography>
        <div className="flex flex-col items-start gap-6">
          <MagneticWrapper>
            <CapsuleButton onClick={openContact} onPointerEnter={preloadContact} onFocus={preloadContact} className="w-auto">
              Vertel waar het knelt
            </CapsuleButton>
          </MagneticWrapper>
          <NextLink href="/aanpak">Lees hoe we werken</NextLink>
        </div>
      </section>
    </main>
  );
}

// The design system's ImageFrame: radius-2xl, a 1px `line` hairline, portrait 4:5. The photo sits a little
// darker on dark pages, never tinted.
function Portrait() {
  const frame =
    'block w-full max-w-sm aspect-[4/5] rounded-2xl border overflow-hidden bg-slate-100 dark:bg-slate-900 ' + hairline;

  if (!portrait) {
    return (
      <div
        aria-hidden="true"
        className={cn(frame, 'flex items-center justify-center text-xs font-semibold tracking-wide-xl uppercase text-slate-500 dark:text-slate-400')}
      >
        [Foto]
      </div>
    );
  }

  return (
    <figure className="max-w-sm">
      <img
        src={portrait}
        alt={portraitAlt}
        width={800}
        height={1000}
        decoding="async"
        fetchPriority="high"
        className={cn(frame, 'object-cover dark:brightness-90')}
      />
    </figure>
  );
}

// A row on the grid, as on Aanpak: the conclusion on the left, its explanation on the right, a hairline above.
function Row({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className={`py-10 sm:py-16 sm:ml-14 border-t ${hairline} ${raster}`}>
      <Typography variant="h2" id={id} className="text-balance">
        {title}
      </Typography>
      <div className={cn('max-w-xl flex flex-col gap-6', prose)}>{children}</div>
    </section>
  );
}
