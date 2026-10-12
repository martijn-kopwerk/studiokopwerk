import type { ReactNode } from 'react';
import { Typography } from '../components/ui/Typography';
import { MagneticWrapper } from '../components/ui/MagneticWrapper';
import { CapsuleButton } from '../components/ui/CapsuleButton';
import { NextLink } from '../components/ui/NextLink';
import { Knelpunten, knelpunten } from '../components/Knelpunten';
import { Portret } from '../components/Portret';
import { ProjectBody } from '../components/werk/ProjectCard';
import { useAmberDot } from '../hooks/useAmberDot';
import { useContact } from '../hooks/useContact';
import { useReadingStops } from '../hooks/useReadingStops';
import { projects } from '../lib/projects';
import { hairline, raster } from '../lib/raster';
import { cn } from '../lib/utils';

// Running text.
const prose = 'text-base leading-relaxed tracking-wide-sm text-slate-700 dark:text-slate-300 text-pretty';

// A dot target beside a line of text, in the left margin: on the K's stem on phones, in the gutter on wider screens.
const marker = 'absolute -left-8 sm:-left-10 top-[calc(0.5lh-0.4375rem)] size-3.5';

// Three of the five frictions, the ones a visitor recognises first: the website, scattered data, work by hand.
const drieKnelpunten = [knelpunten[2], knelpunten[1], knelpunten[3]].filter((item) => item !== undefined);

/**
 * Begin is the front door and a short walk: the promise, then who you talk to, what he made and where it pinches,
 * each with one quiet way on to the page behind it, then the call to action again. Whoever isn't ready to mail
 * always has a next step on the page itself. The hero is one screen, with the next block just showing below it.
 * Phones: the hero stands left, right of the K's stem, with a gap above the button for the vertex and its amber
 * dot. Wider screens: the hero is centred, the blocks below sit on the site's grid. The dot rests on the vertex
 * during the hero, then walks the margin from block to block, as on Aanpak.
 */
export function Home() {
  const { openContact, preloadContact } = useContact();
  const { active, markers, zone, stop } = useReadingStops();
  const werk = projects.find((project) => project.film) ?? projects[0];

  useAmberDot(() => (active !== null ? (markers.current[active] ?? null) : null), active, true);

  const contact = (
    <MagneticWrapper>
      <CapsuleButton onClick={openContact} onPointerEnter={preloadContact} onFocus={preloadContact} className="w-auto">
        Vertel waar het knelt
      </CapsuleButton>
    </MagneticWrapper>
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
        className="min-h-[calc(100dvh-10rem)] flex flex-col items-start sm:items-center justify-center text-left sm:text-center pb-12"
      >
        <div className="w-full flex flex-col items-start sm:items-center gap-5 sm:gap-6 motion-safe:animate-rise [--rise-from:20px]">
          <Typography variant="eyebrow" as="p" className="motion-safe:animate-rise [--rise-from:-10px] [animation-delay:100ms]">
            Studio Kopwerk
          </Typography>
          <h1
            id="hero-title"
            tabIndex={-1}
            className="font-display font-normal text-4xl sm:text-6xl md:text-7xl tracking-wide-md uppercase leading-none text-slate-900 dark:text-white text-balance outline-none"
          >
            Zien wat <em className="italic font-normal">wérkt</em>.
          </h1>
          <Typography
            variant="lead"
            id="hero-mission"
            className="max-w-2xl text-xl sm:text-2xl md:text-2xl lg:text-2xl leading-snug text-balance motion-safe:animate-rise [--rise-from:10px] [animation-delay:250ms]"
          >
            Voor ondernemers en bedrijven die goed zijn in hun vak, maar vastlopen in het digitale eromheen. Wij maken
            het eenvoudig: van de eerste aanvraag tot de factuur, met je website en de programma's die daarbij horen.
          </Typography>
        </div>

        {/* The gap where the background's K has its vertex on phones (read by AbstractBackground) */}
        <div data-tekentafel-vertex aria-hidden="true" className="h-20 sm:h-12 md:h-14 shrink-0" />

        <div className="motion-safe:animate-rise [--rise-from:15px] [animation-delay:400ms]">{contact}</div>
      </section>

      <Block id="martijn" label="Wie je spreekt" title="Je spreekt steeds met mij" {...at()} aside={<Portret className="w-40 sm:w-56" />}>
        <p>
          Ik ben Martijn. Ik help ondernemers die vastlopen in het digitale eromheen. Met AI maak ik in korte tijd iets
          wat je kunt gebruiken.
        </p>
        <p>Je mail komt bij mij binnen. Ik lees hem zelf.</p>
        <NextLink className="self-start" href="/over">Lees wie ik ben</NextLink>
      </Block>

      {werk && (
        <Block id="werk" label="Wat ik maakte" title={werk.title} {...at()}>
          <ProjectBody project={werk} />
          <NextLink className="self-start" href="/werk">Bekijk het werk</NextLink>
        </Block>
      )}

      <Block id="knelt" label="Waar het knelt" title="Goed in je vak, vast in je systemen" {...at()}>
        <p>
          Je bent goed in je vak, maar loopt vast in het digitale eromheen. Wat we maken, hangt af van waar het knelt.
        </p>
        <Knelpunten items={drieKnelpunten} />
        <NextLink className="self-start" href="/aanpak">Lees hoe we werken</NextLink>
      </Block>

      {/* The same call to action as at the top, where the walk ends */}
      <section
        ref={zone(next)}
        aria-label="Vertel waar het knelt"
        className={`py-10 sm:py-16 sm:ml-14 border-t ${hairline} ${raster} lg:items-center`}
      >
        <Typography variant="lead" className="relative text-xl sm:text-2xl md:text-2xl lg:text-2xl text-pretty">
          <span ref={stop(next)} aria-hidden="true" className={marker} />
          Klein beginnen, snel iets maken dat werkt.
        </Typography>
        <div className="flex flex-col items-start">{contact}</div>
      </section>
    </main>
  );
}

// A block of the walk on the site's grid: a label and a conclusion on the left (with an optional image below them),
// a few sentences and the way on to the page behind it on the right, a hairline above. On phones the two stack.
function Block({
  id,
  label,
  title,
  aside,
  zoneRef,
  markerRef,
  children,
}: {
  id: string;
  label: string;
  title: string;
  aside?: ReactNode;
  zoneRef: (el: HTMLElement | null) => void;
  markerRef: (el: HTMLElement | null) => void;
  children: ReactNode;
}) {
  return (
    <section ref={zoneRef} aria-labelledby={id} className={`py-10 sm:py-16 sm:ml-14 border-t ${hairline} ${raster}`}>
      <div className="flex flex-col gap-5">
        <p className="relative text-xs sm:text-sm font-medium tracking-super-wide uppercase text-slate-500 dark:text-slate-400">
          <span ref={markerRef} aria-hidden="true" className={marker} />
          {label}
        </p>
        <Typography variant="h2" id={id} className="text-balance">
          {title}
        </Typography>
        {aside && <div className="pt-3">{aside}</div>}
      </div>
      <div className={cn('max-w-xl flex flex-col gap-6', prose)}>{children}</div>
    </section>
  );
}
