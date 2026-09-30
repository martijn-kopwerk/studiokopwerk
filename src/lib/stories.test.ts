import { describe, expect, it } from 'vitest';
import * as template from '../content/werk/_sjabloon/index.mdx';
import { orderStories, parseStory, type StoryModule } from './stories';

const Content = () => null;
const module = (frontmatter: Record<string, unknown>): StoryModule => ({ default: Content, frontmatter });

const woorden = {
  titel: 'Sneller van vraag naar antwoord',
  klant: 'Klant',
  datum: '2026-05-01',
  samenvatting: 'Wat het opleverde.',
  vorm: 'woorden',
  voorproef: { citaat: 'Een zin.', naam: 'Naam' },
};

describe('parseStory', () => {
  it('accepts a complete story told in words', () => {
    const story = parseStory('sneller-antwoord', module(woorden), {});
    expect(story.title).toBe('Sneller van vraag naar antwoord');
    expect(story.preview).toEqual({ form: 'woorden', quote: 'Een zin.', name: 'Naam', role: undefined });
    expect(story.draft).toBe(false);
  });

  it('names every missing field at once, in Dutch', () => {
    expect(() => parseStory('leeg', module({}), {})).toThrow(
      /"titel" ontbreekt; "klant" ontbreekt; "samenvatting" ontbreekt; "datum" ontbreekt; "vorm" moet een van deze zijn/
    );
  });

  it('requires the preview image to sit in the story folder, with alt text', () => {
    const beeld = { ...woorden, vorm: 'beeld', voorproef: { beeld: './foto.webp' } };
    expect(() => parseStory('met-beeld', module(beeld), {})).toThrow(/foto\.webp staat niet in de map.*"voorproef\.alt" ontbreekt/);

    const story = parseStory('met-beeld', module({ ...beeld, voorproef: { beeld: './foto.webp', alt: 'Een scherm' } }), {
      './foto.webp': '/assets/foto-abc123.webp',
    });
    expect(story.preview).toEqual({ form: 'beeld', image: '/assets/foto-abc123.webp', alt: 'Een scherm' });
  });

  it('rejects folder names that would make an awkward URL', () => {
    expect(() => parseStory('Mijn Verhaal', module(woorden), {})).toThrow(/mapnaam/);
  });

  it('accepts a date that YAML parsed into a Date', () => {
    const story = parseStory('datum', module({ ...woorden, datum: new Date('2026-05-01T00:00:00Z') }), {});
    expect(story.date).toBe('2026-05-01');
  });

  it('keeps the template valid, so copying it always gives a working start', () => {
    const story = parseStory('sjabloon', template as unknown as StoryModule, {});
    expect(story.draft).toBe(true);
  });
});

describe('orderStories', () => {
  it('puts the newest first and numbers them in that order', () => {
    const older = parseStory('ouder', module({ ...woorden, datum: '2025-01-01' }), {});
    const newer = parseStory('nieuwer', module({ ...woorden, datum: '2026-01-01' }), {});
    expect(orderStories([older, newer]).map((s) => `${s.number} ${s.slug}`)).toEqual(['01 nieuwer', '02 ouder']);
  });
});
