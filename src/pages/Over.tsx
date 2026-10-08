import { useRef, type ReactNode } from 'react';
import { Typography } from '../components/ui/Typography';
import { CapsuleButton } from '../components/ui/CapsuleButton';
import { MagneticWrapper } from '../components/ui/MagneticWrapper';
import { NextLink } from '../components/ui/NextLink';
import { useAmberDot } from '../hooks/useAmberDot';
import { useContact } from '../hooks/useContact';
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

// TODO(Martijn): describe what's in the photo, for people who can't see it.
const portraitAlt = '[Beschrijving van de foto: wat er te zien is en waar]';

// Running text.
const prose = 'text-base leading-relaxed tracking-wide-sm text-slate-700 dark:text-slate-300 text-pretty';

// A dot target beside a line of text, in the left margin: on the K's stem on phones, in the gutter on wider screens.
const marker = 'absolute -left-8 sm:-left-10 top-[calc(0.5lh-0.4375rem)] size-3.5';

/**
 * Wie je spreekt: a name, a black-and-white portrait and a few sentences in the first person. Set on the same
 * grid as Aanpak: the photo in the narrow column, the text beside it, then rows with a conclusion on the left.
 * Everything in [brackets] is still to be written by Martijn; nothing here is invented.
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
          Martijn Fieten
        </h1>
        <Typography variant="lead" className="max-w-xl text-xl sm:text-2xl md:text-2xl lg:text-2xl text-pretty">
          [Eén zin over wie je bent, met één <em className="italic font-normal">woord</em> cursief.]
        </Typography>
      </div>

      {/* The gap where the background's K has its vertex on phones (read by AbstractBackground) */}
      <div data-tekentafel-vertex aria-hidden="true" className="h-28 sm:h-12 shrink-0" />

      {/* The portrait in the narrow column, off-centre, with room beside it for the first words */}
      <section aria-label="Wie je spreekt" className={`py-10 sm:py-16 sm:ml-14 border-t ${hairline} ${raster}`}>
        <Portrait />
        <div className={cn('max-w-xl flex flex-col gap-6 lg:pt-2', prose)}>
          <p>[Twee of drie zinnen in de ik-vorm: wat je deed voordat je Studio Kopwerk begon.]</p>
          <p>[Wat je daar zag gebeuren, en waarom je dit nu doet.]</p>
        </div>
      </section>

      <Row id="waarom" title="[Een kop die iets zegt: waarom Studio Kopwerk]">
        <p>[Een tot vier zinnen.]</p>
      </Row>

      <Row id="verwachten" title="[Een kop die iets zegt: wat je van me kunt verwachten]">
        <p>[Een tot vier zinnen over hoe het is om met je te werken.]</p>
        <p>AI doet het maakwerk, wij kijken wat werkt en jij beslist wat blijft.</p>
      </Row>

      <section
        aria-label="Daag ons uit"
        className={`py-10 sm:py-16 sm:ml-14 border-t ${hairline} ${raster} lg:items-center`}
      >
        <Typography variant="lead" className="text-xl sm:text-2xl md:text-2xl lg:text-2xl text-pretty">
          Klein beginnen, snel iets maken dat <em className="italic font-normal">werkt</em>.
        </Typography>
        <div className="flex flex-col items-start gap-6">
          <MagneticWrapper>
            <CapsuleButton onClick={openContact} onPointerEnter={preloadContact} onFocus={preloadContact} className="w-auto">
              Daag ons uit
            </CapsuleButton>
          </MagneticWrapper>
          <NextLink href="/aanpak">Verder: hoe we werken</NextLink>
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
