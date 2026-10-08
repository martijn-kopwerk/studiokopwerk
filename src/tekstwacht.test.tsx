import { describe, expect, it } from 'vitest';
import { notFoundRoute, render, routes } from './entry-server';
import { projects } from './lib/projects';

/**
 * De tekstwacht: elke tekst die een bezoeker leest of hoort, getoetst aan de woordkeuze in het design system
 * (project/voice.md). Zo valt een komma voor "en" of een woord als "tool" op voordat het live staat.
 */

// Woorden die we niet gebruiken: jargon, ambtelijke taal en Engelse woorden waar gewoon Nederlands bestaat.
const verboden = [
  'tool',
  'tools',
  'app',
  'apps',
  'software',
  'mkb',
  'home',
  'synergie',
  'leverage',
  'turnkey',
  'teneinde',
  'derhalve',
  'gaarne',
];

// Wat nog in de positionering staat en daar eerst moet veranderen (docs/tekstreview/2026-10-08.md, fase 1).
// Haal een regel weg zodra de site is bijgewerkt.
const nogTeBeslissen = ['een tool'];

const entities: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', '#x27': "'", '#39': "'", nbsp: ' ' };
const decode = (text: string) => text.replace(/&(#x27|#39|amp|lt|gt|quot|nbsp);/g, (_, name: string) => entities[name]);

/** De tekst van een pagina zoals je hem leest, plus wat een schermlezer voorleest (alt, aria-label, title). */
function leesbareTekst(html: string) {
  const attributen = [...html.matchAll(/\s(?:alt|aria-label|title)="([^"]*)"/g)].map((match) => match[1]);
  const tekst = html
    .replace(/<!--.*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
  return decode([tekst, ...attributen].join(' \n '));
}

function fouten(tekst: string) {
  let rest = tekst;
  for (const uitzondering of nogTeBeslissen) rest = rest.split(uitzondering).join('');
  const gevonden: string[] = [];
  for (const match of rest.matchAll(/[^.]{0,30},\s+en\s[^.]{0,30}/g)) gevonden.push(`komma voor "en": …${match[0].trim()}…`);
  for (const woord of verboden) {
    if (new RegExp(`(?<!\\p{L})${woord}(?!\\p{L})`, 'iu').test(rest)) gevonden.push(`"${woord}"`);
  }
  return gevonden;
}

describe('tekstwacht', () => {
  for (const route of [...routes, notFoundRoute]) {
    it(`${route.meta.path} volgt de woordkeuze`, () => {
      const { html, head } = render(route.meta.path === '/404' ? '/bestaat-niet' : route.meta.path);
      expect(fouten(leesbareTekst(html))).toEqual([]);
      expect(fouten(leesbareTekst(head.replace(/content="([^"]*)"/g, ' title="$1" ')))).toEqual([]);
    });
  }

  // De film opent pas na een klik, dus zijn tekst staat niet in de gerenderde pagina.
  it('de films volgen de woordkeuze', () => {
    const tekst = projects.flatMap((project) => (project.film ?? []).flatMap((scene) => [scene.alt, scene.text]));
    expect(fouten(tekst.join(' \n '))).toEqual([]);
  });

  it('vangt wat hij moet vangen', () => {
    expect(fouten('Snel, en goed.')).toHaveLength(1);
    expect(fouten('Terug naar Home')).toEqual(['"home"']);
    expect(fouten('Een handige tool.')).toEqual(['"tool"']);
    expect(fouten('Op je eigen apparaat, met een appel.')).toEqual([]);
  });
});
