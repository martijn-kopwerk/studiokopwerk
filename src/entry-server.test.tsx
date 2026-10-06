import { describe, expect, it } from 'vitest';
import { render } from './entry-server';
import { renderHead } from './lib/head';
import { projects, type Project } from './lib/projects';
import { buildRoutes, findRoute, normalizePath } from './routes';

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
    expect(buildRoutes([]).map((route) => route.meta.path)).toEqual(['/']);
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
