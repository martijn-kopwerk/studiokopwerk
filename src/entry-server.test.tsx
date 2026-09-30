import { describe, expect, it } from 'vitest';
import { render } from './entry-server';
import { renderHead } from './lib/head';
import { stories } from './lib/stories';
import { findRoute, normalizePath } from './routes';

describe('prerendering', () => {
  it('renders home with its heading, call to action and own head tags', () => {
    const { html, head } = render('/');
    expect(html).toMatch(/<h1[^>]*id="hero-title"/);
    expect(html).toContain('Daag ons uit');
    expect(head).toContain('<title>Studio Kopwerk · Zien wat wérkt</title>');
    expect(head).toContain('<link rel="canonical" href="https://www.studiokopwerk.nl/" />');
  });

  it('renders the 404 page for unknown paths and keeps it out of search results', () => {
    const { html, head } = render('/bestaat-niet');
    expect(html).toContain('Hier is niets');
    expect(head).toContain('<meta name="robots" content="noindex" />');
    expect(head).not.toContain('rel="canonical"');
  });

  it('gives the theme toggle the same markup for every visitor', () => {
    const { html } = render('/');
    expect(html).toContain('Schakel naar donkere weergave');
    expect(html).toContain('Schakel naar lichte weergave');
  });
});

describe('portfolio pages', () => {
  // Tests run in dev mode, so drafts count: with only the example stories this still covers every page.
  it.skipIf(stories.length === 0)('renders the index with every story and a link to each', () => {
    const { html, head } = render('/werk');
    expect(html).toContain('Wat wérkt');
    for (const story of stories) {
      expect(html).toContain(`href="/werk/${story.slug}"`);
    }
    expect(head).toContain('<title>Wat wérkt · Studio Kopwerk</title>');
  });

  it.skipIf(stories.length === 0)('renders each story with its own title, text and head tags', () => {
    for (const story of stories) {
      const { html, head } = render(`/werk/${story.slug}`);
      expect(html).toMatch(/<h1[^>]*>.*<\/h1>/s);
      expect(html).toContain('Tijd voor actie.');
      if (story.draft) {
        // Drafts only appear in previews and must never be indexed
        expect(head).toContain('<meta name="robots" content="noindex" />');
      } else {
        expect(head).toContain(`<link rel="canonical" href="https://www.studiokopwerk.nl/werk/${story.slug}" />`);
      }
    }
  });

  it.skipIf(stories.length === 0)('links home to the portfolio', () => {
    expect(render('/').html).toContain('href="/werk"');
  });
});

describe('routes', () => {
  it('treats a trailing slash as the same page', () => {
    expect(normalizePath('/werk/')).toBe('/werk');
    expect(normalizePath('/')).toBe('/');
    expect(findRoute('/').meta.path).toBe('/');
  });
});

describe('head tags', () => {
  it('escapes text so a title can never break out of its tag', () => {
    const head = renderHead({ path: '/x', title: 'A "quote" & <tag>', description: 'd' });
    expect(head).toContain('<title>A &quot;quote&quot; &amp; &lt;tag&gt;</title>');
    expect(head).toContain('content="A &quot;quote&quot; &amp; &lt;tag&gt;"');
  });
});
