import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Router } from 'wouter';
import '@fontsource-variable/syne';
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/plus-jakarta-sans/wght-italic.css';
import App from './App.tsx';
import './index.css';

const container = document.getElementById('root')!;
const app = (
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);

// Built pages arrive prerendered and are hydrated; the dev server serves an empty shell and renders from scratch.
// The shell still holds the `<!--app-html-->` placeholder comment, so check for an element rather than any child node.
if (container.firstElementChild) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
