// The share image per page (design system: ShareImage): what a chat, mail or LinkedIn shows for a link. Each image is
// the page's own h1 on the drafting table, so a link shows where it leads. The PNGs live in public/og/ and are made
// by scripts/share-images.mjs; change a title here and run `npm run share-images`.

export interface ShareImage {
  // public/og/<name>.png
  name: string;
  // Site-relative path of the page it belongs to
  path: string;
  eyebrow: string;
  // The page's h1, as HTML (the italic accent on wérkt)
  title: string;
  url: string;
  // What's in the image, for og:image:alt
  alt: string;
}

export const shareImages: ShareImage[] = [
  {
    name: 'begin',
    path: '/',
    eyebrow: 'Studio Kopwerk',
    title: 'Zien wat <em>wérkt</em>',
    url: 'studiokopwerk.nl',
    alt: 'Studio Kopwerk: Zien wat wérkt.',
  },
  {
    name: 'aanpak',
    path: '/aanpak',
    eyebrow: 'Aanpak',
    title: 'Wat ertoe doet',
    url: 'studiokopwerk.nl/aanpak',
    alt: 'Aanpak van Studio Kopwerk: Wat ertoe doet.',
  },
  {
    name: 'werk',
    path: '/werk',
    eyebrow: 'Werk',
    title: 'Wat ik maakte',
    url: 'studiokopwerk.nl/werk',
    alt: 'Werk van Studio Kopwerk: Wat ik maakte.',
  },
  {
    name: 'over',
    path: '/over',
    eyebrow: 'Over',
    title: 'Martijn',
    url: 'studiokopwerk.nl/over',
    alt: 'Over Studio Kopwerk: Martijn.',
  },
  {
    name: 'privacy',
    path: '/privacy',
    eyebrow: 'Privacy',
    title: 'Wat ik bewaar',
    url: 'studiokopwerk.nl/privacy',
    alt: 'Privacy bij Studio Kopwerk: Wat ik bewaar.',
  },
];

// The image for a page; pages without their own (the 404) share Begin's.
export function shareImageFor(path: string): ShareImage {
  return shareImages.find((image) => image.path === path) ?? shareImages[0]!;
}
