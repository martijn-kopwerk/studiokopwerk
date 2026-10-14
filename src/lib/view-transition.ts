import { flushSync } from 'react-dom';
import type { AroundNavHandler } from 'wouter';

/**
 * Page changes as a View Transition (design system, Motion): the title glides to its place on the next page and the
 * rest fades (the CSS is in index.css). The new page is rendered synchronously inside the transition. Browsers
 * without View Transitions, and people who asked for reduced motion, simply get the next page.
 */
export const aroundNav: AroundNavHandler = (navigate, to, options) => {
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!document.startViewTransition || still || to === window.location.pathname) {
    navigate(to, options);
    return;
  }
  document.startViewTransition(() => {
    flushSync(() => navigate(to, options));
  });
};
