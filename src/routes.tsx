import type { ComponentType, ReactNode } from 'react';
import type { PageMeta } from './lib/head';
import { projects, type Project } from './lib/projects';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { Over } from './pages/Over';
import { Aanpak } from './pages/Aanpak';
import { Werk } from './pages/Werk';
import { Privacy } from './pages/Privacy';

// How a page ends (design system: Slot): its own last line and at most one quiet way on. Without one the page
// ends with "Begin met één ding dat knelt.".
export interface PageSlot {
  line?: ReactNode;
  next?: { href: string; label: string };
}

export interface PageRoute {
  meta: PageMeta;
  Page: ComponentType;
  slot?: PageSlot;
}

const siteDescription =
  'Een duidelijkere website, een prettiger portaal of minder werk met de hand. Martijn maakt met AI een proefversie die je zelf kunt proberen.';

/**
 * Every page is a concrete path, so the build can prerender each one to its own HTML file.
 * /werk only exists while there's an opdracht to show: without one there's no page, no sitemap entry,
 * and the URL is a 404. Drafts count in dev and pull request previews only, so on the live site
 * that means a published opdracht.
 */
export function buildRoutes(shown: Project[]): PageRoute[] {
  const home: PageRoute = {
    meta: { path: '/', title: 'Studio Kopwerk · Zien wat wérkt · AI voor ondernemers in Nederland', description: siteDescription },
    Page: Home,
    slot: shown.length > 0 ? { next: { href: '/werk', label: 'Bekijk wat ik maakte' } } : undefined,
  };
  const aanpak: PageRoute = {
    meta: {
      path: '/aanpak',
      title: 'Aanpak · Studio Kopwerk',
      description:
        'Een proefversie vanaf € 500 exclusief btw. Vooraf spreken we af wat je krijgt en wanneer. Verder bouwen is een aparte keuze.',
    },
    Page: Aanpak,
    // The proof that it works, once /werk exists
    slot: shown.length > 0 ? { next: { href: '/werk', label: 'Bekijk wat ik maakte' } } : undefined,
  };
  const over: PageRoute = {
    meta: {
      path: '/over',
      title: 'Over · Studio Kopwerk',
      description:
        'Ik ben Martijn van Studio Kopwerk. Ik werk al ruim vijftien jaar aan digitale dienstverlening en maak nu het werk van ondernemers eenvoudiger.',
    },
    Page: Over,
    slot: { next: { href: '/aanpak', label: 'Lees hoe we werken' } },
  };
  const privacy: PageRoute = {
    meta: {
      path: '/privacy',
      title: 'Privacy · Studio Kopwerk',
      description: 'Wat Studio Kopwerk van je bewaart: zo weinig mogelijk. Geen cookies, geen tracking.',
    },
    Page: Privacy,
  };
  if (shown.length === 0) return [home, aanpak, privacy, over];
  return [
    home,
    aanpak,
    privacy,
    {
      meta: {
        path: '/werk',
        title: 'Wat ik maakte · Studio Kopwerk',
        description: 'Wat ik maakte en wat het opleverde, met stille filmpjes van Operatie Kopwerk en Onze Elf.',
        noindex: shown.every((project) => project.draft),
      },
      Page: Werk,
      slot: {
        line: (
          <>
            Hier is nog plek voor jouw opdracht.
          </>
        ),
      },
    },
    over,
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
