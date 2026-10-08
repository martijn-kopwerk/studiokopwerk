import type { ReactNode } from 'react';
import { Typography } from '../components/ui/Typography';
import { contactEmail } from '../lib/contact';
import { hairline, raster } from '../lib/raster';
import { cn } from '../lib/utils';

// Running text, links underlined so they read as links without colour.
const prose =
  'max-w-xl flex flex-col gap-6 text-base leading-relaxed tracking-wide-sm text-slate-700 dark:text-slate-300 text-pretty [&_a]:underline [&_a]:underline-offset-4';

/**
 * What the site and Studio Kopwerk keep about you, as short as the AVG allows. Set like Aanpak: each part a row on
 * the site's grid with a hairline above, the conclusion on the left and its explanation on the right.
 * No amber dot targets: the dot rests on the vertex and goes to the footer.
 */
export function Privacy() {
  return (
    <main className="relative z-10 w-full max-w-7xl mx-auto pl-14 pr-6 sm:px-10 flex-1 pt-6 sm:pt-12 pb-8 motion-safe:animate-rise [--rise-from:16px]">
      <div className="sm:pl-14 flex flex-col gap-4 sm:gap-5">
        <Typography variant="eyebrow" as="p">
          Privacy
        </Typography>
        <h1
          tabIndex={-1}
          className="font-display font-normal text-4xl sm:text-6xl md:text-7xl tracking-wide-md uppercase leading-none text-slate-900 dark:text-white text-balance outline-none"
        >
          Wat we bewaren
        </h1>
        <Typography variant="lead" className="max-w-xl text-xl sm:text-2xl md:text-2xl lg:text-2xl text-pretty">
          Zo weinig mogelijk. Deze site volgt je niet.
        </Typography>
      </div>

      {/* The gap where the background's K has its vertex on phones (read by AbstractBackground) */}
      <div data-tekentafel-vertex aria-hidden="true" className="h-28 sm:h-12 shrink-0" />

      <Part id="site" title="Geen cookies, geen tracking">
        <p>
          We tellen geen bezoekers en tonen geen advertenties. Er laadt niets van andere partijen: ook de lettertypen
          staan op onze eigen server.
        </p>
        <p>
          Kies je een lichte of donkere weergave, dan onthoudt je browser die keuze. Die blijft op je eigen apparaat. Wij
          zien hem niet.
        </p>
      </Part>

      <Part id="mail" title="Mail je ons, dan bewaren we je mail">
        <p>
          Dan hebben we je naam, je mailadres en wat je schrijft. Dat gebruiken we om je te antwoorden en, als er een
          opdracht uit voortkomt, om die opdracht te doen.
        </p>
        <p>
          Komt er geen opdracht, dan verwijderen we je mail uiterlijk een jaar na ons laatste contact. Hoort hij bij een
          opdracht, dan bewaren we hem zeven jaar. Zo lang moeten we onze administratie bewaren.
        </p>
      </Part>

      <Part id="microsoft" title="Microsoft host de site en onze mail">
        <p>
          Zoals bij elke website ziet de server wie een pagina opvraagt: je IP-adres, je browser en de pagina. Die server
          is van Microsoft (Azure), net als onze mail (Microsoft 365). Microsoft verwerkt dat alleen voor ons.
        </p>
        <p>We verkopen niets en delen je gegevens met niemand anders.</p>
      </Part>

      <Part id="rechten" title="Je gegevens blijven van jou">
        <p>
          Wil je weten wat we van je hebben, iets laten aanpassen of alles laten verwijderen? Mail naar{' '}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. Je hoort binnen een maand van ons.
        </p>
        <p>
          Kom je er met ons niet uit, dan kun je een klacht indienen bij de{' '}
          <a href="https://autoriteitpersoonsgegevens.nl">Autoriteit Persoonsgegevens</a>.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Studio Kopwerk, Oosterweg 24, 9751 PH Haren Gn. Bijgewerkt op 8 oktober 2026.
        </p>
      </Part>
    </main>
  );
}

// A row on the grid, as on Aanpak: the conclusion on the left, its explanation on the right, a hairline above.
function Part({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className={cn('py-10 sm:py-16 sm:ml-14 border-t', hairline, raster)}>
      <Typography variant="h2" id={id} className="text-balance">
        {title}
      </Typography>
      <div className={prose}>{children}</div>
    </section>
  );
}
