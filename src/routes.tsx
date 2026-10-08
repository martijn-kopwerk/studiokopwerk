import type { ComponentType } from 'react';
import type { PageMeta } from './lib/head';
import { projects, type Project } from './lib/projects';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { Aanpak } from './pages/Aanpak';
import { Werk } from './pages/Werk';
import { Privacy } from './pages/Privacy';

export interface PageRoute {
  meta: PageMeta;
  Page: ComponentType;
}

const siteDescription =
  "Studio Kopwerk maakt de schermen, sites en programma's waarmee ondernemers en bedrijven hun werk eenvoudiger, mooier en fijner maken. Zien wat wérkt.";

/**
 * Every page is a concrete path, so the build can prerender each one to its own HTML file.
 * /werk only exists while there's an opdracht to show: without one there's no page, no sitemap entry,
 * and the URL is a 404. Drafts count in dev and pull request previews only, so on the live site
 * that means a published opdracht.
 */
export function buildRoutes(shown: Project[]): PageRoute[] {
  const home: PageRoute = {
    meta: { path: '/', title: 'Studio Kopwerk · Zien wat wérkt', description: siteDescription },
    Page: Home,
  };
  const aanpak: PageRoute = {
    meta: {
      path: '/aanpak',
      title: 'Aanpak · Studio Kopwerk',
      description:
        'Visie, missie en werkwijze van Studio Kopwerk. AI doet het maakwerk, wij kijken wat werkt, jij beslist wat blijft.',
    },
    Page: Aanpak,
  };
  const privacy: PageRoute = {
    meta: {
      path: '/privacy',
      title: 'Privacy · Studio Kopwerk',
      description: 'Wat Studio Kopwerk van je bewaart: zo weinig mogelijk. Geen cookies, geen tracking.',
    },
    Page: Privacy,
  };
  if (shown.length === 0) return [home, aanpak, privacy];
  return [
    home,
    aanpak,
    privacy,
    {
      meta: {
        path: '/werk',
        title: 'Wat wérkt · Studio Kopwerk',
        description: 'Opdrachten uit de praktijk, kort verteld: de vraag, wat we maakten en wat het opleverde.',
        noindex: shown.every((project) => project.draft),
      },
      Page: Werk,
    },
  ];
}

export const routes: PageRoute[] = buildRoutes(projects);

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
