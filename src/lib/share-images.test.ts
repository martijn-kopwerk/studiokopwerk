import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { renderHead } from './head';
import { shareImageFor, shareImages } from './share-images';
import { routes } from '../routes';

describe('share images', () => {
  it('gives every page its own image, and the image exists', () => {
    for (const route of routes) {
      const image = shareImageFor(route.meta.path);
      expect(image.path, `${route.meta.path} heeft geen eigen deelbeeld`).toBe(route.meta.path);
    }
    for (const image of shareImages) {
      expect(existsSync(`public/og/${image.name}.png`), `public/og/${image.name}.png ontbreekt: npm run share-images`).toBe(true);
    }
  });

  it('points the og tags at the page image', () => {
    const head = renderHead({ path: '/over', title: 'Over', description: 'Over' });
    expect(head).toContain('<meta property="og:image" content="https://www.studiokopwerk.nl/og/over.png" />');
    expect(head).toContain('og:image:alt" content="Over Studio Kopwerk: Martijn."');
  });
});
