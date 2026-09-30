import type { ComponentType } from 'react';
import type { PageMeta } from './lib/head';
import { stories, type Story } from './lib/stories';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { Werk } from './pages/Werk';
import { StoryPage } from './pages/Story';

export interface PageRoute {
  meta: PageMeta;
  Page: ComponentType;
}

const siteDescription =
  'Studio Kopwerk helpt iedereen om mooiere en fijnere ervaringen te maken, op welk vlak dan ook. Zien wat wérkt.';

function storyRoute(story: Story): PageRoute {
  const Page = () => <StoryPage story={story} />;
  return {
    meta: {
      path: `/werk/${story.slug}`,
      title: `${story.title} · Studio Kopwerk`,
      description: story.summary,
      noindex: story.draft,
    },
    Page,
  };
}

// The portfolio only exists once there's a story to show (drafts count in dev and previews only).
const werkRoutes: PageRoute[] =
  stories.length > 0
    ? [
        {
          meta: {
            path: '/werk',
            title: 'Wat wérkt · Studio Kopwerk',
            description: 'Verhalen uit de praktijk: wat er veranderde, in beeld, in woorden of in één getal.',
            noindex: stories.every((story) => story.draft),
          },
          Page: Werk,
        },
        ...stories.map(storyRoute),
      ]
    : [];

// Every page is a concrete path, so the build can prerender each one to its own HTML file.
export const routes: PageRoute[] = [
  {
    meta: { path: '/', title: 'Studio Kopwerk · Zien wat wérkt', description: siteDescription },
    Page: Home,
  },
  ...werkRoutes,
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
