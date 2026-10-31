// Turns the client build into one static HTML file per page, plus 404.html and sitemap.xml.
// Runs after `vite build` (client, into dist/) and `vite build --ssr` (the renderer, into dist-ssr/).
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const { render, routes, notFoundRoute, siteUrl } = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
);
// Every page opens with a Syne title, but the browser only finds that font once the CSS is in. Preloading it lets the
// title appear in its own letter straight away. The file name carries a hash, so look it up in the build.
const syne = (await fs.readdir(path.join(dist, 'assets'))).find((file) => /^syne-latin-wght-normal-.*\.woff2$/.test(file));
const preload = syne ? `<link rel="preload" href="/assets/${syne}" as="font" type="font/woff2" crossorigin />\n    ` : '';
const template = (await fs.readFile(path.join(dist, 'index.html'), 'utf8')).replace('<!--app-head-->', `${preload}<!--app-head-->`);

// The CSP allows no inline scripts (script-src 'self'); JSON-LD is data, not a script, so it may stay.
function check(file, html) {
  const problems = [];
  if (html.includes('<!--app-')) problems.push('a placeholder was not filled in');
  if (!/<h1[\s>]/.test(html)) problems.push('no <h1>');
  for (const [tag] of html.matchAll(/<script\b[^>]*>/g)) {
    if (!/\bsrc=/.test(tag) && !/type="application\/ld\+json"/.test(tag)) {
      problems.push(`an inline script, which the CSP would block: ${tag}`);
    }
  }
  if (problems.length) throw new Error(`${file}: ${problems.join('; ')}`);
}

async function writePage(routePath, file) {
  const { html, head } = render(routePath);
  const page = template.replace('<!--app-head-->', head).replace('<!--app-html-->', html);
  check(file, page);
  const target = path.join(dist, file);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, page);
  console.log(`  ${file}`);
}

console.log('Prerendering');
for (const { meta } of routes) {
  await writePage(meta.path, meta.path === '/' ? 'index.html' : path.join(meta.path.slice(1), 'index.html'));
}
await writePage(notFoundRoute.meta.path, '404.html');

const urls = routes
  .filter(({ meta }) => !meta.noindex)
  .map(({ meta }) => `  <url>\n    <loc>${siteUrl}${meta.path === '/' ? '/' : meta.path}</loc>\n  </url>`);
await fs.writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
);
console.log('  sitemap.xml');

await fs.rm(ssrDir, { recursive: true, force: true });
