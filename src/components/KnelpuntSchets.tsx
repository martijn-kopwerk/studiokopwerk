import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

export type SchetsNaam = 'stroom' | 'plek' | 'website' | 'herhaling' | 'scherm';

// Hairlines in the ink colour, quieter lines in grey; the amber dot is the one point of focus (design system, Imagery:
// "built from the system itself: hairlines, dot grids, square blocks").
const ink = 'text-slate-900 dark:text-white';
const quiet = 'text-slate-400 dark:text-slate-600';
const label = 'fill-subtle dark:fill-slate-400 font-sans text-[10px] font-semibold tracking-wide-xl';

function Stip({ cx, cy }: { cx: number; cy: number }) {
  return <circle className="schets-stip fill-amber-500" cx={cx} cy={cy} r="5" />;
}

const schetsen: Record<SchetsNaam, { beschrijving: string; tekening: ReactNode }> = {
  stroom: {
    beschrijving: 'Vier blokken op één lijn: aanvraag, offerte, werk, factuur.',
    tekening: (
      <>
        <g className={ink} fill="none" stroke="currentColor" strokeWidth="1.25">
          <rect className="schets-lijn" x="40" y="130" width="72" height="60" />
          <rect className="schets-lijn [animation-delay:150ms]" x="164" y="130" width="72" height="60" />
          <rect className="schets-lijn [animation-delay:300ms]" x="288" y="130" width="72" height="60" />
          <rect className="schets-lijn [animation-delay:450ms]" x="412" y="130" width="72" height="60" />
          <path className="schets-lijn" d="M112 160H164M236 160H288M360 160H412" />
        </g>
        <g className={label}>
          <text x="40" y="216">AANVRAAG</text>
          <text x="164" y="216">OFFERTE</text>
          <text x="288" y="216">WERK</text>
          <text x="412" y="216">FACTUUR</text>
        </g>
        <Stip cx={496} cy={160} />
      </>
    ),
  },
  plek: {
    beschrijving: 'Losse kleine blokken met lijnen naar één groter blok.',
    tekening: (
      <>
        <g className={quiet} fill="none" stroke="currentColor" strokeWidth="1">
          <rect className="schets-lijn" x="60" y="40" width="36" height="28" />
          <rect className="schets-lijn" x="80" y="250" width="36" height="28" />
          <rect className="schets-lijn" x="420" y="36" width="36" height="28" />
          <rect className="schets-lijn" x="430" y="256" width="36" height="28" />
          <rect className="schets-lijn" x="40" y="146" width="36" height="28" />
          <path
            className="schets-lijn [animation-delay:150ms]"
            d="M96 54L220 130M116 264L220 190M420 50L300 130M430 270L300 190M76 160H220"
          />
        </g>
        <rect
          className={cn(ink, 'schets-lijn [animation-delay:300ms]')}
          x="220"
          y="120"
          width="80"
          height="80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <Stip cx={260} cy={160} />
      </>
    ),
  },
  website: {
    beschrijving: 'Een webpagina met één grote kop en één knop.',
    tekening: (
      <>
        <g className={ink} fill="none" stroke="currentColor" strokeWidth="1.25">
          <rect className="schets-lijn" x="70" y="30" width="380" height="260" />
          <path className="schets-lijn [animation-delay:150ms]" d="M70 58H450" />
          <path className="schets-lijn [animation-delay:300ms]" d="M110 120H370M110 150H300" strokeWidth="6" />
          <rect className="schets-lijn [animation-delay:450ms]" x="110" y="200" width="120" height="32" rx="16" />
        </g>
        <Stip cx={314} cy={152} />
      </>
    ),
  },
  herhaling: {
    beschrijving: 'Zeven gestippelde blokken die steeds terugkomen, en één blok waar jij beslist.',
    tekening: (
      <>
        <g className={quiet} fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 4">
          <rect x="40" y="90" width="40" height="40" />
          <rect x="92" y="90" width="40" height="40" />
          <rect x="144" y="90" width="40" height="40" />
          <rect x="196" y="90" width="40" height="40" />
          <rect x="40" y="142" width="40" height="40" />
          <rect x="92" y="142" width="40" height="40" />
          <rect x="144" y="142" width="40" height="40" />
        </g>
        <g className={ink} fill="none" stroke="currentColor" strokeWidth="1.25">
          <path className="schets-lijn" d="M260 136H340" />
          <path className="schets-lijn [animation-delay:150ms]" d="M330 128L340 136L330 144" />
          <rect className="schets-lijn [animation-delay:300ms]" x="360" y="96" width="80" height="80" />
        </g>
        <text className={label} x="360" y="202">
          JIJ BESLIST
        </text>
        <Stip cx={400} cy={136} />
      </>
    ),
  },
  scherm: {
    beschrijving: 'Een scherm met één veld en één knop, zonder uitleg.',
    tekening: (
      <>
        <g className={ink} fill="none" stroke="currentColor" strokeWidth="1.25">
          <rect className="schets-lijn" x="150" y="40" width="220" height="240" rx="16" />
          <path className="schets-lijn [animation-delay:150ms]" d="M180 140H340" />
          <rect className="schets-lijn [animation-delay:300ms]" x="180" y="190" width="160" height="36" rx="18" />
        </g>
        <text className={label} x="180" y="120">
          ÉÉN VRAAG
        </text>
        <Stip cx={322} cy={208} />
      </>
    ),
  },
};

/**
 * What we make for a friction, drawn on the drafting table: a few hairlines on dotted paper, with the amber dot as the
 * one point that matters. The lines draw themselves once when the friction is chosen; with reduced motion they are
 * simply there.
 */
export function KnelpuntSchets({ naam, className }: { naam: SchetsNaam; className?: string }) {
  const { beschrijving, tekening } = schetsen[naam];
  return (
    <div className={cn('tekenvel w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800', className)}>
      <svg role="img" aria-label={beschrijving} viewBox="0 0 520 320" className="block w-full h-auto">
        {tekening}
      </svg>
    </div>
  );
}
