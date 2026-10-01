import { useEffect, useRef } from 'react';
import type { PageMeta } from '../lib/head';

function setMeta(selector: string, create: () => HTMLElement, attribute: string, value: string | null) {
  let element = document.head.querySelector<HTMLElement>(selector);
  if (value === null) {
    element?.remove();
    return;
  }
  if (!element) {
    element = create();
    document.head.append(element);
  }
  element.setAttribute(attribute, value);
}

/**
 * After a client-side navigation: update the title and the tags search engines read, scroll to the top,
 * and move keyboard focus to the new page's heading so screen readers announce it.
 * The first render is skipped: the prerendered HTML is already correct.
 */
export function usePageChange(meta: PageMeta, siteUrl: string) {
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    document.title = meta.title;
    setMeta('meta[name="description"]', () => Object.assign(document.createElement('meta'), { name: 'description' }), 'content', meta.description);
    setMeta('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }), 'href', meta.noindex ? null : siteUrl + meta.path);
    setMeta('meta[name="robots"]', () => Object.assign(document.createElement('meta'), { name: 'robots' }), 'content', meta.noindex ? 'noindex' : null);

    window.scrollTo(0, 0);
    document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true });
  }, [meta, siteUrl]);
}
