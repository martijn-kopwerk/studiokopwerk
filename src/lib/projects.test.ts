import { describe, expect, it } from 'vitest';
import * as template from '../content/werk/_sjabloon/index.md';
import { orderProjects, parseProject, type ProjectModule } from './projects';

const Text = () => null;
const module = (frontmatter: Record<string, unknown>): ProjectModule => ({ default: Text, frontmatter });
const base = { titel: 'Sneller van vraag naar antwoord', klant: 'Klant', datum: '2026-05-01' };

describe('parseProject', () => {
  it('accepts an opdracht with only text', () => {
    const project = parseProject('alleen-tekst', module(base), {});
    expect(project.title).toBe('Sneller van vraag naar antwoord');
    expect(project.media).toBeUndefined();
    expect(project.draft).toBe(false);
  });

  it('names every missing field at once, in Dutch', () => {
    expect(() => parseProject('leeg', module({}), {})).toThrow(/"titel" ontbreekt; "klant" ontbreekt; "datum" ontbreekt/);
  });

  it('takes a quote or a number beside the text', () => {
    expect(parseProject('c', module({ ...base, citaat: 'Een zin.', naam: 'Naam' }), {}).media).toEqual({
      kind: 'citaat',
      quote: 'Een zin.',
      name: 'Naam',
      role: undefined,
    });
    expect(() => parseProject('g', module({ ...base, getal: '40%' }), {})).toThrow(/"label" ontbreekt/);
  });

  it('requires an image to sit in the opdracht folder, with alt text', () => {
    expect(() => parseProject('b', module({ ...base, beeld: './foto.webp' }), {})).toThrow(
      /foto\.webp staat niet in de map.*"alt" ontbreekt/
    );
    const project = parseProject('b', module({ ...base, beeld: './foto.webp', alt: 'Een scherm' }), {
      './foto.webp': '/assets/foto-abc123.webp',
    });
    expect(project.media).toEqual({ kind: 'beeld', image: '/assets/foto-abc123.webp', alt: 'Een scherm' });
  });

  it('allows at most one of image, quote and number', () => {
    expect(() => parseProject('twee', module({ ...base, citaat: 'x', naam: 'y', getal: '1', label: 'z' }), {})).toThrow(
      /hoogstens één/
    );
  });

  it('rejects folder names that would make an awkward name', () => {
    expect(() => parseProject('Mijn Opdracht', module(base), {})).toThrow(/mapnaam/);
  });

  it('keeps the template valid, so copying it always gives a working start', () => {
    expect(parseProject('sjabloon', template as unknown as ProjectModule, {}).draft).toBe(true);
  });
});

describe('orderProjects', () => {
  it('puts the newest first and numbers them in that order', () => {
    const older = parseProject('ouder', module({ ...base, datum: '2025-01-01' }), {});
    const newer = parseProject('nieuwer', module({ ...base, datum: '2026-01-01' }), {});
    expect(orderProjects([older, newer]).map((p) => `${p.number} ${p.slug}`)).toEqual(['01 nieuwer', '02 ouder']);
  });
});
