import { routes } from '../routes';

// The pages in the order a visitor walks them: how we work, the work itself, then who you'll be talking to. Short single words.
// A page only shows up once its route exists (no /werk without opdrachten), so no link ever leads to a 404.
const pages = [
  { path: '/aanpak', label: 'Aanpak' },
  { path: '/werk', label: 'Werk' },
  { path: '/over', label: 'Over' },
];

export const navItems = pages.filter(({ path }) => routes.some((route) => route.meta.path === path));
