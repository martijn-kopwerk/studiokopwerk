import { useState } from 'react';
import { Tekentafel } from './werk/Tekentafel';
import { Icon } from './ui/Icon';
import { cn } from '../lib/utils';

export type SchetsNaam = 'stroom' | 'plek' | 'website' | 'herhaling' | 'scherm';

// The same pen, paper and hand-drawn lines as Werk's "Op de tekentafel".
// These are possibilities to explore, not finished screens or customer results.
const schetsen: Record<SchetsNaam, { lijnen: string[]; eindpunt: [number, number]; uitleg: string }> = {
  stroom: {
    lijnen: [
      'M20 62 Q47 60 74 63 L73 111 Q46 113 21 110 Z',
      'M32 77 L59 78 M32 89 L53 90 M32 100 L60 99',
      'M79 86 Q95 84 110 86 M103 80 L110 86 L103 92',
      'M118 62 Q143 60 168 63 L167 111 Q143 113 119 110 Z',
      'M131 79 L155 80 M131 91 L151 90',
      'M174 86 Q191 84 205 86 M198 80 L205 86 L198 92',
      'M214 62 Q238 60 261 63 L260 111 Q237 113 215 110 Z',
      'M226 86 L234 94 L250 76',
    ],
    eindpunt: [250, 76],
    uitleg: 'Gegevens gaan mee van aanvraag naar offerte. Jij kijkt na voordat er iets uitgaat.',
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
  herhaling: {
    lijnen: [
      'M23 34 Q53 32 82 35 L81 75 L24 74 Z M34 47 L69 48 M34 59 L61 60',
      'M23 100 Q53 98 82 101 L81 141 L24 140 Z M34 113 L69 114 M34 125 L61 126',
      'M87 55 Q112 54 124 86 M87 121 Q112 122 124 86 M124 86 L146 86 M139 80 L146 86 L139 92',
      'M157 36 Q207 33 255 37 L254 145 Q206 148 158 144 Z',
      'M173 54 L222 55 M173 69 L238 70 M173 84 L231 83 M173 99 L214 100',
      'M204 122 L213 131 L236 108',
    ],
    eindpunt: [236, 108],
    uitleg: 'AI maakt een eerste concept. Jij leest het na, stuurt bij en beslist wat je verstuurt.',
  },
  scherm: {
    lijnen: [
      'M65 21 Q140 18 215 22 L214 159 Q140 162 66 158 Z',
      'M66 42 Q140 40 214 43',
      'M84 62 Q125 60 166 63',
      'M84 78 Q140 76 196 79 L195 103 Q140 105 85 102 Z',
      'M96 91 L149 92',
      'M84 129 Q84 119 94 119 L145 119 Q155 119 155 129 Q155 139 145 139 L94 139 Q84 139 84 129',
      'M172 127 L180 135 L197 115',
    ],
    eindpunt: [197, 115],
    uitleg: 'Eén begrijpelijke vraag tegelijk. Het scherm helpt je verder, zonder dat iemand het hoeft uit te leggen.',
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
