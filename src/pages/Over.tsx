import { useEffect, useRef, useState, type ReactNode, type Ref } from 'react';
import { Typography } from '../components/ui/Typography';
import { Portret } from '../components/Portret';
import { useAmberDot } from '../hooks/useAmberDot';
import { KleineDingen } from '../components/werk/KleineDingen';
import { hairline, raster } from '../lib/raster';
import { cn } from '../lib/utils';

// Running text.
const prose = 'text-base leading-relaxed tracking-wide-sm text-slate-700 dark:text-slate-300 text-pretty';

// A dot target beside a line of text, in the left margin: on the K's stem on phones, in the gutter on wider screens.
const marker = 'absolute -left-8 sm:-left-10 top-[calc(0.5lh-0.4375rem)] size-3.5';

const WIDE = '(min-width: 1024px)';

/**
 * Wie je spreekt: a name, a black-and-white portrait and a few sentences by Martijn, in the first person.
 * It answers what the other pages leave open: who you talk to, where, and why it works this way. Set on the same grid as Aanpak: the photo in the narrow column, the text beside it,
 * then rows with a conclusion on the left. Every fact here comes from Martijn; nothing is invented.
 */
export function Over() {
  const intro = useRef<HTMLSpanElement | null>(null);
  const statement = useRef<HTMLSpanElement | null>(null);
  const [wide, setWide] = useState(false);

  // The dot rests in the margin beside the eyebrow; the footer takes it over at the end.
  // Phones and tablets: beside the eyebrow, on the reading line. Wide screens put the eyebrow in the right column,
  // beside the portrait, so there the dot rests in the margin beside the first row's heading instead.
  useAmberDot(() => (wide ? statement.current : intro.current), `over-${wide}`, true);

  useEffect(() => {
    const query = window.matchMedia(WIDE);
    const update = () => setWide(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return (
    <main id="inhoud" className="relative z-10 w-full max-w-7xl mx-auto pl-14 pr-6 sm:px-10 flex-1 pt-6 sm:pt-12 pb-8 motion-safe:animate-rise [--rise-from:16px]">
      {/* The portrait beside the name: who you talk to, before anything else. On phones the name comes first. */}
      <div className="sm:pl-14 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-x-16 lg:items-end">
        <div className="flex flex-col gap-4 sm:gap-5 lg:order-last lg:pb-4">
          <Typography variant="eyebrow" as="p" className="relative">
            <span ref={intro} aria-hidden="true" className={marker} />
            Over
          </Typography>
          <h1
            tabIndex={-1}
            className="font-display font-normal text-4xl sm:text-6xl md:text-7xl tracking-display leading-[1.05] text-slate-900 dark:text-white text-balance outline-none"
          >
            Martijn
          </h1>
          <Typography variant="lead" className="max-w-xl text-xl sm:text-2xl md:text-2xl lg:text-2xl text-pretty">
            Ik help je uitzoeken hoe je website, portaal of dagelijkse werk eenvoudiger kan, met een proefversie die je zelf kunt proberen.
          </Typography>
        </div>
        <div className="flex flex-col gap-4">
          <Portret className="max-w-xs sm:max-w-sm lg:max-w-none" priority />
          <p className="max-w-sm text-sm leading-relaxed tracking-wide-sm text-subtle dark:text-slate-400 text-pretty">
            Ik woon in Haren, net onder Groningen. Langskomen kan in heel Nederland.
          </p>
          <a
            href="https://www.linkedin.com/in/martijnfieten/"
            rel="me"
            className="self-start text-sm font-medium tracking-wide-sm text-slate-900 dark:text-white underline underline-offset-4"
          >
            Bekijk mijn LinkedIn
          </a>
        </div>
      </div>

      {/* The gap where the background's K has its vertex on phones (read by AbstractBackground) */}
      <div data-tekentafel-vertex aria-hidden="true" className="h-16 sm:h-12 shrink-0" />

      <Row id="mensen" title="Ik kijk eerst hoe mensen werken" markerRef={statement}>
        <p>
          Ik ben opgeleid als leraar en studeerde daarna onderwijskunde. Daar leerde ik kijken hoe mensen leren en werken. Dat doe ik nog steeds, voordat ik iets maak.
        </p>
        <p>
          Al ruim vijftien jaar werk ik aan digitale dienstverlening: van rapportages en werkprocessen tot portalen voor medewerkers. Als adviseur en productmanager zoek ik uit wat mensen nodig hebben en zorg ik dat schermen en werkstappen daarop aansluiten.
        </p>
      </Row>

      <Row id="ervaring" title="Je merkt pas wat helpt als je het probeert">
        <p>
          Aan het begin van mijn loopbaan zag ik een collega elke week dezelfde rapportages maken. Ik liet de computer het werk doen. Dat scheelde een dag per week.
        </p>
        <p>
          Met Studio Kopwerk breng ik die manier van kijken naar ondernemers. We kiezen één ding dat je tijd of ergernis kost en ik maak met AI een proefversie van de oplossing. Jij probeert of het duidelijker wordt en of het je werk gemakkelijker maakt.
        </p>
      </Row>

      <Row id="verwachten" title="Wie met mij werkt, krijgt mijn aandacht">
        <p>
          Het eerste gesprek kan online of bij jou op de zaak, waar je ook onderneemt in Nederland. We praten over je werk. Je hoeft niets van techniek te weten of al een oplossing te hebben.
        </p>
        <p>Ik neem weinig opdrachten tegelijk aan. Je mail komt bij mij binnen en ik lees hem zelf.</p>
      </Row>

      <details className={`sm:ml-14 py-8 border-t ${hairline}`}>
        <summary className="cursor-pointer rounded-2xl py-3 font-display font-medium text-xl sm:text-2xl tracking-heading text-slate-900 dark:text-white">
          Bekijk wat ik voor mezelf maak
        </summary>
        <KleineDingen />
      </details>

    </main>
  );
}

// A row on the grid, as on Aanpak: the conclusion on the left, its explanation on the right, a hairline above.
function Row({
  id,
  title,
  markerRef,
  children,
}: {
  id: string;
  title: string;
  markerRef?: Ref<HTMLSpanElement>;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className={`py-10 sm:py-16 sm:ml-14 border-t ${hairline} ${raster}`}>
      <Typography variant="h2" id={id} className="relative text-balance">
        {markerRef && <span ref={markerRef} aria-hidden="true" className={marker} />}
        {title}
      </Typography>
      <div className={cn('max-w-xl flex flex-col gap-6', prose)}>{children}</div>
    </section>
  );
}
