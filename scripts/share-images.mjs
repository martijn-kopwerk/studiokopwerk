// Renders the share images (design system: ShareImage) to public/og/<name>.png, one per page: the page's own h1 on
// the drafting table, the amber dot as its full stop. Run after changing a page title: `npm run share-images`.
// Needs Chrome or Edge on this machine (headless screenshot at 1200×630); the images are committed, so the build
// and CI don't need a browser. A test checks that every route has its image.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { shareImages } from '../src/lib/share-images.ts';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = path.join(root, 'public', 'og');
fs.mkdirSync(out, { recursive: true });

const browsers = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);
const browser = browsers.find((candidate) => fs.existsSync(candidate));
if (!browser) throw new Error('Geen Chrome of Edge gevonden; zet CHROME_PATH.');

const font = (pkg, file) => pathToFileURL(path.join(root, 'node_modules', '@fontsource-variable', pkg, 'files', file)).href;
const escape = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function page({ eyebrow, title, url }) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Syne; src: url(${font('syne', 'syne-latin-wght-normal.woff2')}) format('woff2'); font-weight: 400 800; }
@font-face { font-family: Jakarta; src: url(${font('plus-jakarta-sans', 'plus-jakarta-sans-latin-wght-normal.woff2')}) format('woff2'); font-weight: 200 800; }
html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; background: #07090e; }
.glow { position: absolute; inset: 0; background: radial-gradient(720px 470px at 68% 40%, rgba(245,158,11,.10), transparent 70%); }
svg { position: absolute; inset: 0; }
line { stroke: rgb(226 232 240); }
.text { position: absolute; left: 324px; right: 72px; top: 50%; transform: translateY(-50%); display: grid; gap: 38px; }
.eyebrow { font: 500 19px/1 Jakarta; letter-spacing: .5em; text-transform: uppercase; color: #94a3b8; }
.title { font: 400 ${title.length > 12 ? 80 : 92}px/1 Syne; letter-spacing: .1em; text-transform: uppercase; color: #fff; white-space: nowrap; }
.title em { font-style: italic; }
.dot { display: inline-block; width: 17px; height: 17px; margin-left: 6px; border-radius: 50%; background: #f59e0b; box-shadow: 0 0 17px rgba(245,158,11,.6); }
.url { position: absolute; left: 324px; bottom: 44px; font: 600 17px/1 Jakarta; letter-spacing: .2em; text-transform: uppercase; color: #94a3b8; }
</style></head><body>
<div class="glow"></div>
<svg width="1200" height="630" viewBox="0 0 1200 630">
  <g stroke-width="1" stroke-opacity=".06">
    <line x1="230" y1="0" x2="230" y2="630"/><line x1="0" y1="340" x2="1200" y2="340"/>
    <line x1="260" y1="340" x2="1200" y2="-180"/><line x1="260" y1="340" x2="1200" y2="860"/>
    <line x1="660" y1="0" x2="660" y2="630"/>
  </g>
  <g stroke-width="1.6" stroke-opacity=".16">
    <line x1="230" y1="120" x2="230" y2="560"/><line x1="260" y1="340" x2="660" y2="120"/><line x1="260" y1="340" x2="660" y2="560"/>
  </g>
</svg>
<div class="text"><span class="eyebrow">${escape(eyebrow)}</span><span class="title">${title}<span class="dot"></span></span></div>
<span class="url">${escape(url)}</span>
</body></html>`;
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kopwerk-og-'));
for (const image of shareImages) {
  const html = path.join(tmp, `${image.name}.html`);
  fs.writeFileSync(html, page(image));
  const png = path.join(out, `${image.name}.png`);
  execFileSync(browser, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--default-background-color=07090eff',
    '--window-size=1200,630',
    '--virtual-time-budget=2000',
    `--screenshot=${png}`,
    pathToFileURL(html).href,
  ]);
  console.log(`  og/${image.name}.png`);
}
fs.rmSync(tmp, { recursive: true, force: true });
