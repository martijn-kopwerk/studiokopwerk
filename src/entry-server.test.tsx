import { describe, expect, it } from 'vitest';
import { render } from './entry-server';
import { renderHead } from './lib/head';
import { projects, type Project } from './lib/projects';
import { buildRoutes, findRoute, normalizePath, routes } from './routes';

describe('prerendering', () => {
  it('renders home with its heading, call to action and own head tags', () => {
    const { html, head } = render('/');
    expect(html).toMatch(/<h1[^>]*id="hero-title"/);
    expect(html).toContain('Vertel waar het knelt');
    expect(head).toContain('<title>Studio Kopwerk · Zien wat wérkt · AI voor ondernemers in Nederland</title>');
    expect(head).toContain('<link rel="canonical" href="https://www.studiokopwerk.nl/" />');
  });

  it('walks home past where it pinches, who you talk to and the work, each with a way on', () => {
    const { html } = render('/');
    // The full stop is the amber dot, but a real one for screen readers and search
    expect(html).toMatch(/<h1[^>]*>Zien wat <em[^>]*>wérkt<\/em><span[^>]*><span class="sr-only">.<\/span>/);
    const ids = ['knelt', 'martijn', 'werkwijze', ...(projects.length > 0 ? ['werk'] : [])];
    const positions = ids.map((id) => html.indexOf(`aria-labelledby="${id}"`));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    expect(html).toContain('href="/over"');
    expect(html).toContain('href="/aanpak"');
    if (projects.length > 0) expect(html).toContain('Bekijk hoe het werkt');
    expect(html.split('Vertel waar het knelt').length - 1).toBeGreaterThanOrEqual(2);
    // The loop is a real list of the three steps; the frictions and their answers read without the script
    expect(html).toContain('aria-label="Hoe we werken"');
    expect(html).toContain('Jij beslist wat blijft.');
    expect(html).toContain('Schermen die zonder uitleg werken.');
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
  it('walks in the reader\'s order, how it goes, how we work, why and the questions, ending in one call to action', () => {
    const { html, head } = render('/aanpak');
    expect(html).toMatch(/<h1[^>]*tabindex="-1"[^>]*>Wat ertoe doet<\/h1>/i);
    const ids = ['verloop', 'werkwijze', 'waarom', 'vragen'];
    // Where it pinches is on Begin; Aanpak doesn't repeat it
    expect(html).not.toContain('aria-labelledby="knelt"');
    expect(html).toContain('vanaf €\u00a0500');
    const positions = ids.map((id) => html.indexOf(`aria-labelledby="${id}"`));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    expect(html).not.toContain('aria-labelledby="principes"');
    expect(html).toContain('aria-pressed="false"');
    expect(html).toContain('Vertel waar het knelt');
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

  it('ends every page with one invitation: its own last line, the button and, smaller, the address', () => {
    const { html } = render('/');
    expect(html).toContain('Klein beginnen, snel iets maken dat werkt.');
    expect(html).toContain('Of mail zelf');
    expect(html).toContain('href="mailto:hallo@studiokopwerk.nl?subject=Waar%20het%20knelt"');
    expect(html).toContain('KvK 42154955');
    // The hero, the slot and the compact bar (hidden until you scroll back up): nothing in between
    expect(html.split('aria-haspopup="dialog"').length - 1).toBe(3);
    if (projects.length > 0) expect(render('/werk').html).toContain('Hier is nog plek voor');
    expect(render('/over').html).toContain('Je mail komt bij mij binnen. Ik lees hem zelf.');
  });
});

describe('privacy', () => {
  it('says what we keep, linked from the footer of every page', () => {
    const { html, head } = render('/privacy');
    expect(html).toMatch(/<h1[^>]*tabindex="-1"[^>]*>Wat ik bewaar<\/h1>/i);
    expect(head).toContain('<link rel="canonical" href="https://www.studiokopwerk.nl/privacy" />');
    expect(render('/').html).toMatch(/<a[^>]*href="\/privacy"/);
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
    expect(html).toContain('Wat ik maakte');
    for (const project of projects) {
      expect(html).toContain(`id="opdracht-${project.slug}"`);
    }
    if (projects.length > 1) expect(html).toMatch(/role="tabpanel"[^>]*aria-labelledby="opdracht-/);
    // Every id once, also with a single opdracht shown in more than one layout
    const ids = [...html.matchAll(/ id="([^"]+)"/g)].map((match) => match[1]);
    expect(ids.filter((id, index) => ids.indexOf(id) !== index)).toEqual([]);
    expect(head).toContain('<title>Wat ik maakte · Studio Kopwerk</title>');
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
  it('is published: on the live site and in search results, with or without opdrachten', () => {
    const over = buildRoutes([]).find((route) => route.meta.path === '/over');
    expect(over).toBeDefined();
    expect(over?.meta.noindex).toBeFalsy();
  });
});
