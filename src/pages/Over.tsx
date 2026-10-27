import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'wouter';
import { Typography } from '../components/ui/Typography';
import { Portret } from '../components/Portret';
import { useAmberDot } from '../hooks/useAmberDot';
import { projects } from '../lib/projects';
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
  // beside the portrait, so there the dot rests in the margin beside the page's statement instead.
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
            className="font-display font-normal text-4xl sm:text-6xl md:text-7xl tracking-wide-md uppercase leading-none text-slate-900 dark:text-white text-balance outline-none"
          >
            Martijn
          </h1>
          <Typography variant="lead" className="max-w-xl text-xl sm:text-2xl md:text-2xl lg:text-2xl text-pretty">
            Ik help ondernemers die vastlopen in het digitale eromheen. Met AI maak ik in korte tijd iets wat je kunt{" "}
            <em className="italic font-normal">gebruiken</em>.
          </Typography>
        </div>
        <div className="flex flex-col gap-4">
          <Portret className="max-w-xs sm:max-w-sm lg:max-w-none" priority />
          <p className="max-w-sm text-sm leading-relaxed tracking-wide-sm text-subtle dark:text-slate-400 text-pretty">
            Ik woon in Haren, net onder Groningen. Langskomen kan in heel Nederland.
          </p>
        </div>
      </div>

      {/* The gap where the background's K has its vertex on phones (read by AbstractBackground) */}
      <div data-tekentafel-vertex aria-hidden="true" className="h-16 sm:h-12 shrink-0" />

      {/* The page's one statement (design system: display): the sentence that gives the most trust */}
      <p className={`relative sm:ml-14 py-10 sm:py-16 border-t ${hairline} font-display font-medium text-display tracking-display text-slate-900 dark:text-white text-balance kopwerk-reveal`}>
        <span ref={statement} aria-hidden="true" className={cn(marker, 'top-[calc(2.5rem+0.5lh-0.4375rem)] sm:top-[calc(4rem+0.5lh-0.4375rem)]')} />
        Je mail komt bij mij binnen. Ik lees hem zelf.
      </p>

      <Row id="begin" title="Het begon met een rapportage">
        <p>
          Aan het begin van mijn loopbaan zag ik een collega elke week met de hand dezelfde rapportages maken. Dat kon
          handiger, dacht ik. Ik leerde mezelf hoe en liet de computer het werk doen. Dat scheelde een dag werk per week.
        </p>
        <p>
          Dat doe ik nog steeds, ook bij mijn eigen werk. Onlangs nog met mijn mail: die handel ik nu af met hulp van AI, in{" "}
          {/* Operatie Kopwerk, the opdracht on /werk, which only exists while there's an opdracht to show */}
          {projects.length > 0 ? (
            <Link href="/werk" className="underline underline-offset-4">
              mijn eigen programma
            </Link>
          ) : (
            "mijn eigen programma"
          )}
          . Outlook hoef ik niet meer te openen. Lezen doe ik nog steeds zelf.
        </p>
      </Row>

      <Row id="gezien" title="Ik zag hoe techniek het werk zwaarder kan maken">
        <p>
          Al tien jaar bepaal ik bij grote organisaties wat er gemaakt wordt en waarom. Steeds zag ik hetzelfde: schermen
          die ingewikkelder waren dan nodig en stappen met de hand die het werk ophielden. Het extra werk kwam terecht bij
          de mensen die het al druk hadden.
        </p>
      </Row>

      <Row id="ervaring" title="Wat ik daar leerde, gun ik ook ondernemers">
        <p>
          Een ondernemer heeft meestal niemand in huis die het digitale eromheen al eens heeft ingericht. Ik neem die
          ervaring mee, zonder de lange trajecten en vergaderingen. Maken kon ik altijd al, maar vaak waren er meerdere
          mensen voor nodig. Met AI doe ik het nu zelf, in korte tijd.
        </p>
      </Row>

      <Row id="verwachten" title="Je spreekt steeds met mij">
        <p>
          Het eerste gesprek kan bij jou op de zaak. Ik praat over je werk, niet over techniek. Studio Kopwerk doe ik
          naast mijn werk als productmanager. Daarom neem ik weinig opdrachten tegelijk aan: wie met mij werkt, krijgt
          mijn aandacht.
        </p>
      </Row>

      <Row id="tussendoor" title="Tussendoor maak ik dingen voor mezelf">
        <p>
          Kleine proeven met AI, om te zien wat werkt voordat ik het voor jou maak. Mate is een coach voor training en
          voeding op de gegevens van je Garmin. Met Zuipwijs daag je vrienden uit voor een duel: wie haalt de meeste
          nuchtere dagen?
        </p>
        {/* Kleine dingen sit on /werk, which only exists while there's an opdracht to show */}
        {projects.length > 0 && (
          <p>
            <Link href="/werk#kleine-dingen" className="underline underline-offset-4">
              Bekijk wat ik tussendoor maak
            </Link>
          </p>
        )}
      </Row>

    </main>
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
