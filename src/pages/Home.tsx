import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Typography } from '../components/ui/Typography';
import { NextLink } from '../components/ui/NextLink';
import { ContactButton } from '../components/ContactButton';
import { KnelpuntKiezer } from '../components/Knelpunten';
import { Portret } from '../components/Portret';
import { Rondgang } from '../components/Rondgang';
import { ProjectShow, ProjectStat, ProjectText } from '../components/werk/ProjectCard';
import { Rekenhulp } from '../components/werk/Rekenhulp';
import { useAmberDot } from '../hooks/useAmberDot';
import { useReadingStops } from '../hooks/useReadingStops';
import { projects } from '../lib/projects';
import { cn } from '../lib/utils';

// Running text.
const prose = 'text-base leading-relaxed tracking-wide-sm text-slate-700 dark:text-slate-300 text-pretty';

// A dot target beside a line of text, in the left margin: on the K's stem on phones, in the gutter on wider screens.
const marker = 'absolute -left-8 sm:-left-10 top-[calc(0.5lh-0.4375rem)] size-3.5';
// The same for a heading in a block's right column (media left, from lg): back in the block's margin, past the left
// column and the 64px gap. The block is a container, so 50cqw is half its width.
const markerRight = 'lg:left-[calc(-50cqw-4.5rem)]';

// When the dot has landed on the K's vertex (animate-dot-land: 1.9s delay, 0.8s), it flies on to the full stop.
const LANDED_MS = 2700;

/**
 * Begin is the front door and a short walk: the promise, a concrete example, where it pinches, who you talk to
 * and how to begin, each a block of its own shape with one quiet way on to the page behind it, then the call to action again.
 *
 * The page's one moment (design system, "de tekentafel"): the amber dot lands on the K's vertex, then flies to the end
 * of "Zien wat wérkt" and stays there as its full stop. Screen readers hear a real full stop; before the script runs
 * the full stop is drawn in amber where the dot will land. From the first block on, the dot walks the margin from
 * block to block, as on Aanpak, and flies back to the full stop when you scroll up to the promise.
 */
export function Home() {
  const { active, markers, zone, stop } = useReadingStops();
  const werk = projects.find((project) => project.film) ?? projects[0];
  const werkwijzeIndex = werk ? 3 : 2;
  // A saving in minutes (per mail) can be made personal: how many hours a year is that for you?
  const minuten = werk?.begin?.figure?.unit === 'min' ? Number.parseInt(werk.begin.figure.value, 10) : NaN;

  const punt = useRef<HTMLSpanElement | null>(null);
  // Once the script runs, the full stop is left empty for the dot; it flies in once it has landed on the vertex.
  const [leeg, setLeeg] = useState(false);
  const [geland, setGeland] = useState(false);

  useEffect(() => {
    setLeeg(true);
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => setGeland(true), still ? 0 : LANDED_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const inHero = active === null;
  useAmberDot(
    () => (inHero ? (geland ? punt.current : null) : (markers.current[active] ?? null)),
    `${active}-${geland}`,
    !inHero,
    inHero,
    // The loop has its own dot: while it is the block being read, the reading dot steps aside (one dot walking)
    active === werkwijzeIndex
  );

  // The blocks in reading order; Werk only while there's an opdracht to show (see routes.tsx).
  let next = 0;
  const at = () => {
    const index = next++;
    return { zoneRef: zone(index), markerRef: stop(index) };
  };

  return (
    <main id="inhoud" className="relative z-10 w-full max-w-7xl mx-auto pl-14 pr-6 sm:px-10 flex-1 pb-8">
      <section
        aria-labelledby="hero-title"
        className="flex flex-col items-start sm:items-center justify-center text-left sm:text-center pt-8 sm:pt-16 pb-10 sm:pb-16"
      >
        <div className="w-full flex flex-col items-start sm:items-center gap-5 sm:gap-6 motion-safe:animate-rise [--rise-from:20px]">
          <Typography variant="eyebrow" as="p" className="motion-safe:animate-rise [--rise-from:-10px] [animation-delay:100ms]">
            Studio Kopwerk
          </Typography>
          <h1
            id="hero-title"
            tabIndex={-1}
            className="font-display font-normal text-4xl sm:text-6xl lg:text-7xl tracking-wide-md uppercase leading-none text-slate-900 dark:text-white text-balance outline-none"
          >
            Zien wat <em className="italic font-normal">wérkt</em>
            {/* The full stop is the amber dot. It stays in the text (selectable, read aloud) and is drawn by the dot. */}
            <span className="whitespace-nowrap">
              <span className="sr-only">.</span>
              <span
                ref={punt}
                aria-hidden="true"
                className={cn(
                  'inline-block size-3.5 ml-[0.12em] rounded-full align-baseline transition-colors duration-300',
                  leeg ? 'bg-transparent' : 'bg-amber-500'
                )}
              />
            </span>
          </h1>
          {/* What you can ask for: the solution as a proefversie you try yourself, made with AI. */}
          <div className="flex flex-col items-start sm:items-center gap-3 sm:gap-4 motion-safe:animate-rise [--rise-from:10px] [animation-delay:250ms]">
            <Typography
              variant="lead"
              className="max-w-2xl text-xl sm:text-2xl md:text-2xl lg:text-2xl leading-snug text-balance text-slate-800 dark:text-slate-200"
            >
              Een duidelijkere website of minder werk met de hand. Ik maak met AI een proefversie van de oplossing, zodat je ziet of het werkt.
            </Typography>
            <Typography variant="sublead" className="max-w-xl text-balance">
              Voor ondernemers die goed zijn in hun vak en het digitale eromheen eenvoudiger willen maken. Je hoeft zelf niets van techniek te weten.
            </Typography>
          </div>
        </div>

        {/* The gap where the background's K has its vertex on phones (read by AbstractBackground) */}
        <div data-tekentafel-vertex aria-hidden="true" className="self-stretch h-10 sm:h-12 shrink-0" />

        <div className="motion-safe:animate-rise [--rise-from:15px] [animation-delay:400ms]">
          <ContactButton />
        </div>
        <NextLink href="/aanpak" className="mt-6">Bekijk wat je krijgt</NextLink>
      </section>

      {werk && (
        <Block id="werk" title={werk.title} media={<ProjectShow project={werk} />} {...at()}>
          <ProjectText project={werk} />
          {werk.begin?.figure ? (
            <ProjectStat project={werk} />
          ) : (
            werk.begin && (
              <Typography variant="lead" className="text-xl sm:text-2xl md:text-2xl lg:text-2xl text-pretty">
                {werk.begin.line}
              </Typography>
            )
          )}
          {minuten > 0 && <Rekenhulp minuten={minuten} />}
          <NextLink className="self-start" href="/werk">Bekijk het werk</NextLink>
        </Block>
      )}

      {/* A concrete example first; then recognition, the maker and how to begin */}
      <Block
        id="knelt"
        title="Wat wil je eenvoudiger maken?"
        media={<KnelpuntKiezer />}
        mediaSide="right"
        mediaFirst={false}
        align="start"
        {...at()}
      >
        <p>
          Wat we maken hangt af van waar het knelt: een duidelijke website of een prettig portaal voor je klanten of
          medewerkers, minder werk met de hand, of AI een vaste plek in je werk. Kies wat je herkent.
        </p>
      </Block>

      <Block
        id="martijn"
        title="Je spreekt altijd met mij"
        media={<Portret className="w-48 sm:w-64 lg:w-80 lg:self-center" />}
        {...at()}
      >
        <p>
          Ik ben Martijn. Al ruim vijftien jaar werk ik aan digitale dienstverlening bij grote bedrijven, als adviseur en productmanager. Ik kijk eerst hoe mensen werken en maak dan een proefversie die je zelf kunt proberen.
        </p>
        <p>Je mail komt bij mij binnen. Ik lees hem zelf.</p>
        <NextLink className="self-start" href="/over">Lees wie ik ben</NextLink>
      </Block>

      <Block
        id="werkwijze"
        title="AI maakt, jij beslist"
        display
        media={<Rondgang className="mx-auto lg:mx-0 lg:ml-auto" />}
        mediaSide="right"
        mediaFirst={false}
        {...at()}
      >
        <p>
          We kiezen samen één ding dat je nu tijd of ergernis kost. Binnen twee weken maak ik met AI de proefversie. We kijken er samen naar, jij zegt wat beter kan en ik pas het aan.
        </p>
        <p>Vanaf € 500 exclusief btw.</p>
        <p>Werkt het? Dan maken we het af. De proefversie is van jou. Voor dagelijks gebruik spreken we samen af wat nodig is en wat het kost.</p>
        <NextLink className="self-start" href="/aanpak">Lees hoe we werken</NextLink>
      </Block>

    </main>
  );
}

/**
 * A block of the walk, a doorway to the page behind it. One heading per block, the conclusion: a label above it
 * would read as a second title. Each block has its own shape, so scrolling reads as separate stops rather than one
 * long table: the media sits left or right on wider screens, and on phones a block opens with its image. One block may
 * set its heading as the page's one `display` statement. No hairlines between blocks; the whitespace and the change of
 * shape separate them, and each rises into place as it scrolls into view. The heading's dot marker stays in the block's
 * margin, also when the heading sits in the right column, so the dot keeps one reading line.
 */
function Block({
  id,
  title,
  display = false,
  media,
  mediaSide = 'left',
  mediaFirst = true,
  align = 'center',
  zoneRef,
  markerRef,
  children,
}: {
  id: string;
  title: string;
  display?: boolean;
  media: ReactNode;
  mediaSide?: 'left' | 'right';
  // On phones, whether the media comes before the heading.
  mediaFirst?: boolean;
  align?: 'center' | 'start';
  zoneRef: (el: HTMLElement | null) => void;
  markerRef: (el: HTMLElement | null) => void;
  children: ReactNode;
}) {
  const aside = <div className={cn('flex flex-col', mediaSide === 'right' ? 'lg:order-last' : 'lg:order-first')}>{media}</div>;
  return (
    <section
      ref={zoneRef}
      aria-labelledby={id}
      className={cn(
        '@container py-10 sm:py-16 sm:ml-14 grid gap-8 lg:grid-cols-2 lg:gap-x-16 kopwerk-reveal',
        align === 'center' ? 'lg:items-center' : 'lg:items-start'
      )}
    >
      {mediaFirst && aside}
      <div className="flex flex-col gap-6">
        <Typography variant={display ? 'display' : 'h2'} as="h2" id={id} className="relative text-balance">
          <span
            ref={markerRef}
            aria-hidden="true"
            className={cn(marker, mediaSide === 'left' && markerRight)}
          />
          {title}
        </Typography>
        <div className={cn('max-w-xl flex flex-col gap-6', prose)}>{children}</div>
      </div>
      {!mediaFirst && aside}
    </section>
  );
}
