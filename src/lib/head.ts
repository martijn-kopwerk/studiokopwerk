export const siteUrl = 'https://www.studiokopwerk.nl';

const defaultImage = {
  path: '/og-image.png',
  width: 1200,
  height: 630,
  alt: 'Studio Kopwerk. Zien wat wérkt.',
};

export interface PageMeta {
  // Site-relative path without a trailing slash ('/' for home).
  path: string;
  title: string;
  description: string;
  // Keeps the page out of search results (e.g. the 404 page).
  noindex?: boolean;
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * The per-page <head> tags, written into each prerendered HTML file.
 * Link previews (LinkedIn, mail, chat) don't run JavaScript, so these must be in the static HTML.
 */
export function renderHead(meta: PageMeta): string {
  const e = escapeHtml;
  const url = siteUrl + meta.path;
  const image = siteUrl + defaultImage.path;
  const tags = [
    `<title>${e(meta.title)}</title>`,
    `<meta name="description" content="${e(meta.description)}" />`,
    meta.noindex ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${e(url)}" />`,
    `<meta property="og:title" content="${e(meta.title)}" />`,
    `<meta property="og:description" content="${e(meta.description)}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:url" content="${e(url)}" />`,
    `<meta property="og:image" content="${e(image)}" />`,
    `<meta property="og:image:width" content="${defaultImage.width}" />`,
    `<meta property="og:image:height" content="${defaultImage.height}" />`,
    `<meta property="og:image:alt" content="${e(defaultImage.alt)}" />`,
    `<meta name="twitter:image" content="${e(image)}" />`,
  ];
  return tags.join('\n    ');
}
