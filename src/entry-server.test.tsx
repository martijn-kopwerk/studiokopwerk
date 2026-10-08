import { describe, expect, it } from 'vitest';
import { render } from './entry-server';
import { renderHead } from './lib/head';
import { projects, type Project } from './lib/projects';
import { buildRoutes, findRoute, normalizePath, routes } from './routes';

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

describe('aanpak', () => {
  it('walks through visie, missie and werkwijze, ending in one call to action', () => {
    const { html, head } = render('/aanpak');
    expect(html).toMatch(/<h1[^>]*tabindex="-1"[^>]*>Wat ertoe doet<\/h1>/i);
    for (const id of ['visie', 'missie', 'werkwijze']) {
      expect(html).toContain(`aria-labelledby="${id}"`);
    }
    expect(html).not.toContain('aria-labelledby="principes"');
    expect(html).toContain('aria-pressed="false"');
    expect(html).toContain('Daag ons uit');
    expect(head).toContain('<title>Aanpak · Studio Kopwerk</title>');
    expect(head).toContain('<link rel="canonical" href="https://www.studiokopwerk.nl/aanpak" />');
  });

  it('is offered as a way on from the 404 page', () => {
    expect(render('/bestaat-niet').html).toMatch(/<a[^>]*href="\/aanpak"/);
  });
});

describe('header and footer', () => {
  it('links to Aanpak from every page and marks the current one', () => {
    expect(render('/').html).toMatch(/<a[^>]*href="\/aanpak"/);
    expect(render('/aanpak').html).toMatch(/<a[^>]*href="\/aanpak"[^>]*aria-current="page"|<a[^>]*aria-current="page"[^>]*href="\/aanpak"/);
  });

  it('links to Werk only while that page exists', () => {
    const hasWerk = routes.some((route) => route.meta.path === '/werk');
    expect(render('/').html.includes('href="/werk"')).toBe(hasWerk);
  });

  it('opens the contact card from the footer address and shows the company details', () => {
    const { html } = render('/');
    expect(html).toContain('aria-label="Daag ons uit: hallo@studiokopwerk.nl"');
    expect(html).toContain('KvK 42154955');
  });
});

describe('werk', () => {
  const opdracht = (draft: boolean): Project => ({
    slug: 'x',
    number: '01',
    title: 't',
    client: 'k',
    date: '2026-01-01',
    draft,
    Text: () => null,
  });

  it('does not exist without opdrachten: no page, so no sitemap entry', () => {
    expect(buildRoutes([]).map((route) => route.meta.path)).not.toContain('/werk');
  });

  it('exists with only drafts (dev and previews), kept out of search results', () => {
    const werk = buildRoutes([opdracht(true)]).find((route) => route.meta.path === '/werk');
    expect(werk?.meta.noindex).toBe(true);
  });

  it('exists once an opdracht is published', () => {
    const werk = buildRoutes([opdracht(false)]).find((route) => route.meta.path === '/werk');
    expect(werk?.meta.noindex).toBe(false);
  });

  it.runIf(projects.length === 0)('renders /werk as the 404 page while there are none', () => {
    expect(render('/werk').html).toContain('Hier is niets');
  });

  // Tests run in dev mode, so drafts count too.
  it.skipIf(projects.length === 0)('renders every opdracht, with the first one beside the list', () => {
    const { html, head } = render('/werk');
    expect(html).toContain('Wat wérkt');
    for (const project of projects) {
      expect(html).toContain(`id="opdracht-${project.slug}"`);
    }
    expect(html).toMatch(/role="tabpanel"[^>]*aria-labelledby="opdracht-/);
    expect(head).toContain('<title>Wat wérkt · Studio Kopwerk</title>');
  });

  it.skipIf(projects.length === 0)('keeps a page of drafts out of search results', () => {
    const { head } = render('/werk');
    if (projects.every((project) => project.draft)) {
      expect(head).toContain('<meta name="robots" content="noindex" />');
    } else {
      expect(head).toContain('<link rel="canonical" href="https://www.studiokopwerk.nl/werk" />');
    }
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

describe('over', () => {
  it('is a draft while the photo and text are still to come: kept out of search results', () => {
    const over = buildRoutes([]).find((route) => route.meta.path === '/over');
    expect(over?.meta.noindex).toBe(true);
  });
});
