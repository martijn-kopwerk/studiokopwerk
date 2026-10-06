import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { Router } from 'wouter';
import App from './App.tsx';
import { renderHead } from './lib/head';
import { findRoute } from './routes';

export { routes, notFoundRoute } from './routes';
export { siteUrl } from './lib/head';

/** Renders one page for the prerender step (scripts/prerender.mjs): the markup for #root and its <head> tags. */
export function render(path: string) {
  const html = renderToString(
    <StrictMode>
      <Router ssrPath={path}>
        <App />
      </Router>
    </StrictMode>
  );
  return { html, head: renderHead(findRoute(path).meta) };
}
