import { describe, expect, it } from 'vitest';
import { render } from './entry-server';
import { renderHead } from './lib/head';
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
