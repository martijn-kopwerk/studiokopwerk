import { routes } from '../routes';

// The pages in the order a visitor walks them: how we work, then the work itself. Short single words.
// A page only shows up once its route exists (no /werk without opdrachten), so no link ever leads to a 404.
const pages = [
  { path: '/aanpak', label: 'Aanpak' },
  { path: '/werk', label: 'Werk' },
];

export const navItems = pages.filter(({ path }) => routes.some((route) => route.meta.path === path));
