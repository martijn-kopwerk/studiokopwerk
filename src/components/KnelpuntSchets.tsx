import { useState } from 'react';
import { Tekentafel } from './werk/Tekentafel';
import { Icon } from './ui/Icon';
import { cn } from '../lib/utils';

export type SchetsNaam = 'portaal' | 'offerte' | 'website' | 'werkoverzicht' | 'plek';

// The same pen, paper and hand-drawn lines as Werk's "Op de tekentafel".
// These are possibilities to explore, not finished screens or customer results.
const schetsen: Record<SchetsNaam, { lijnen: string[]; eindpunt: [number, number]; uitleg: string }> = {
  portaal: {
    lijnen: [
      'M25 25 Q140 22 255 26 L254 154 Q140 158 26 153 Z',
      'M26 46 Q140 44 254 47 M82 47 L81 154',
      'M39 64 L67 65 M39 83 L67 84 M39 102 L62 103',
      'M98 63 L172 64 M98 76 L213 77',
      'M98 91 Q167 89 237 92 L236 115 L99 114 Z M110 103 L183 104',
      'M98 135 Q98 125 108 125 L169 125 Q179 125 179 135 Q179 144 169 144 L108 144 Q98 144 98 135',
      'M202 133 L211 141 L231 121',
    ],
    eindpunt: [231, 121],
    uitleg: 'Een duidelijke indeling, leesbare informatie en een logische volgende stap.',
  },
  plek: {
    lijnen: [
      'M16 27 L60 28 L59 61 L17 60 Z M17 29 L38 45 L59 29',
      'M18 116 Q40 114 62 117 L61 152 L19 151 Z M27 128 L52 129 M27 138 L46 139',
      'M220 31 L263 32 L262 66 L221 65 Z M230 43 L253 44 M230 53 L247 54',
      'M65 45 Q95 44 103 70 M65 134 Q92 134 103 110 M216 49 Q190 48 178 71',
      'M105 58 Q141 56 176 59 L175 130 Q140 133 106 129 Z',
      'M106 76 Q140 74 175 77 M119 91 L161 92 M119 103 L153 104',
      'M133 115 L140 122 L156 105',
    ],
    eindpunt: [156, 105],
    uitleg: 'Mail, notities en werk bij elkaar. Je vindt wat je nodig hebt op één plek.',
  },
  website: {
    lijnen: [
      'M30 26 Q140 23 250 27 Q253 90 249 152 Q140 155 31 151 Q28 90 30 26',
      'M31 46 Q140 44 249 47',
      'M48 70 Q90 68 132 71 M48 87 Q110 85 172 88 M48 101 Q100 99 152 102',
      'M196 64 Q214 63 231 65 L230 105 L196 104 Z M198 102 L210 86 L218 95 L229 79',
      'M48 124 Q48 116 56 116 L100 116 Q108 116 108 124 Q108 132 100 132 L56 132 Q48 132 48 124',
      'M200 128 L208 136 L226 116',
    ],
    eindpunt: [226, 116],
    uitleg: 'Een helder aanbod en een duidelijke volgende stap. Je bezoeker weet waar hij kan beginnen.',
  },
  offerte: {
    lijnen: [
      'M23 34 Q53 32 82 35 L81 75 L24 74 Z M34 47 L69 48 M34 59 L61 60',
      'M23 100 Q53 98 82 101 L81 141 L24 140 Z M34 113 L69 114 M34 125 L61 126',
      'M87 55 Q112 54 124 86 M87 121 Q112 122 124 86 M124 86 L146 86 M139 80 L146 86 L139 92',
      'M157 36 Q207 33 255 37 L254 145 Q206 148 158 144 Z',
      'M173 54 L222 55 M173 69 L238 70 M173 84 L231 83 M173 99 L214 100',
      'M204 122 L213 131 L236 108',
    ],
    eindpunt: [236, 108],
    uitleg: 'Klantvraag en vast aanbod vormen de eerste opzet. Jij controleert de inhoud en de prijs.',
  },
  werkoverzicht: {
    lijnen: [
      'M27 35 Q140 32 253 36 L252 146 Q140 150 28 145 Z',
      'M28 55 L252 56 M100 56 L99 146 M176 56 L175 147',
      'M42 72 L84 73 M115 72 L160 73 M191 72 L235 73',
      'M41 87 L86 88 L85 108 L42 107 Z M41 116 L86 117 L85 136 L42 135 Z',
      'M113 87 L162 88 L161 108 L114 107 Z',
      'M189 87 L238 88 L237 108 L190 107 Z',
      'M201 96 L209 103 L225 85',
    ],
    eindpunt: [225, 85],
    uitleg: 'Wat moet nog, wat loopt en wat is klaar? Een overzicht dat past bij de werkdag.',
  },
};

export function KnelpuntSchets({ naam, className }: { naam: SchetsNaam; className?: string }) {
  const [ronde, setRonde] = useState(0);
  const schets = schetsen[naam];
  return (
    <figure className={cn('w-full max-w-md rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-5 sm:p-6', className)}>
      <Tekentafel key={ronde} strokes={schets.lijnen} eindpunt={schets.eindpunt} loop={false} className="w-full" />
      <figcaption className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {schets.uitleg}
      </figcaption>
      <button type="button" onClick={() => setRonde(ronde + 1)} className="mt-3 inline-flex items-center gap-2 rounded-lg py-2 text-sm text-subtle dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
        <Icon name="restart" className="size-4" />
        Teken opnieuw
      </button>
    </figure>
  );
}
