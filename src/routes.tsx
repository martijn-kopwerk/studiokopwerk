import type { ComponentType } from 'react';
import type { PageMeta } from './lib/head';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';

export interface PageRoute {
  meta: PageMeta;
  Page: ComponentType;
}

const siteDescription =
  'Studio Kopwerk helpt iedereen om mooiere en fijnere ervaringen te maken, op welk vlak dan ook. Zien wat wérkt.';

// Every page is a concrete path, so the build can prerender each one to its own HTML file.
export const routes: PageRoute[] = [
  {
    meta: { path: '/', title: 'Studio Kopwerk · Zien wat wérkt', description: siteDescription },
    Page: Home,
  },
];

export const notFoundRoute: PageRoute = {
  meta: {
    path: '/404',
    title: 'Niet gevonden · Studio Kopwerk',
    description: 'Deze pagina bestaat niet (meer).',
    noindex: true,
  },
  Page: NotFound,
};

// '/werk/' and '/werk' are the same page.
export const normalizePath = (path: string) => (path.length > 1 ? path.replace(/\/+$/, '') : path);

export function findRoute(path: string): PageRoute {
  const normalized = normalizePath(path);
  return routes.find((route) => route.meta.path === normalized) ?? notFoundRoute;
}
