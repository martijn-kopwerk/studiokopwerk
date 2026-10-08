import type { ComponentType } from 'react';

/**
 * Opdrachten for /werk: one short card each. A folder per opdracht in src/content/werk/<slug>/
 * holds an index.md (a few fields on top, two or three sentences below) and, if used, its image.
 * How to add one: README.md, "Een opdracht toevoegen". Folders starting with _ (the template) are skipped.
 */

// At most one of these, beside the text.
export type ProjectMedia =
  | { kind: 'beeld'; image: string; alt: string }
  | { kind: 'citaat'; quote: string; name: string; role?: string }
  | { kind: 'getal'; value: string; label: string };

// One scene of an opdracht's short film: an image, what it shows, one line of explanation,
// and the point the slow zoom moves towards (a CSS transform-origin, e.g. "70% 40%").
export interface FilmScene {
  image: string;
  alt: string;
  text: string;
  focus: string;
}

export interface Project {
  slug: string;
  // Position in the list, as shown: '01', '02', …
  number: string;
  title: string;
  client: string;
  sector?: string;
  date: string;
  draft: boolean;
  media?: ProjectMedia;
  // Optional: a short film that opens from the image.
  film?: FilmScene[];
  // The two or three sentences below the fields.
  Text: ComponentType;
}

export interface ProjectModule {
  default: ComponentType;
  frontmatter?: unknown;
}

const modules = import.meta.glob<ProjectModule>(['../content/werk/*/index.md', '!../content/werk/_*/index.md'], {
  eager: true,
});
const imageFiles = import.meta.glob<string>('../content/werk/*/*.{png,jpg,jpeg,webp,avif,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const focusPattern = /^(100|[1-9]?\d)% (100|[1-9]?\d)%$/;

/** Checks one opdracht's fields and turns them into a Project; throws one error naming every problem, in Dutch. */
export function parseProject(
  slug: string,
  module: ProjectModule,
  images: Record<string, string>
): Omit<Project, 'number'> {
  const problems: string[] = [];
  const fm = ((typeof module.frontmatter === 'object' && module.frontmatter) || {}) as Record<string, unknown>;

  const text = (key: string, required = false): string | undefined => {
    const value = fm[key];
    if (value === undefined || value === null || value === '') {
      if (required) problems.push(`"${key}" ontbreekt`);
      return undefined;
    }
    if (typeof value !== 'string' && typeof value !== 'number') {
      problems.push(`"${key}" moet tekst zijn`);
      return undefined;
    }
    return String(value).trim();
  };

  if (!slugPattern.test(slug)) {
    problems.push('de mapnaam mag alleen kleine letters, cijfers en streepjes bevatten (bijv. "snellere-intake")');
  }

  const title = text('titel', true);
  const client = text('klant', true);
  const sector = text('sector');

  // YAML may hand a date over as text or as a Date; keep it as YYYY-MM-DD either way.
  const date = fm.datum instanceof Date ? fm.datum.toISOString().slice(0, 10) : text('datum', true);
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) problems.push('"datum" moet de vorm JJJJ-MM-DD hebben');

  if (fm.concept !== undefined && typeof fm.concept !== 'boolean') problems.push('"concept" moet true of false zijn');

  const image = text('beeld');
  const quote = text('citaat');
  const value = text('getal');
  let media: ProjectMedia | undefined;
  if ([image, quote, value].filter(Boolean).length > 1) {
    problems.push('kies hoogstens één van "beeld", "citaat" en "getal"');
  } else if (image) {
    const alt = text('alt');
    if (!images[image]) problems.push(`"beeld": ${image} staat niet in de map van deze opdracht`);
    if (!alt) problems.push('"alt" ontbreekt: beschrijf wat er op het beeld te zien is');
    media = { kind: 'beeld', image: images[image] ?? '', alt: alt ?? '' };
  } else if (quote) {
    const name = text('naam');
    if (!name) problems.push('"naam" ontbreekt: van wie is het citaat?');
    media = { kind: 'citaat', quote, name: name ?? '', role: text('rol') };
  } else if (value) {
    const label = text('label');
    if (!label) problems.push('"label" ontbreekt: wat meet het getal?');
    media = { kind: 'getal', value, label: label ?? '' };
  }

  let film: FilmScene[] | undefined;
  if (fm.film !== undefined) {
    if (!Array.isArray(fm.film) || fm.film.length === 0) {
      problems.push('"film" moet een lijst met scènes zijn');
    } else if (media?.kind !== 'beeld') {
      problems.push('"film" kan alleen naast een "beeld": de film opent vanaf dat beeld');
    } else {
      film = fm.film.map((scene: unknown, index) => {
        const fields = ((typeof scene === 'object' && scene) || {}) as Record<string, unknown>;
        const field = (key: string) => (typeof fields[key] === 'string' ? (fields[key] as string).trim() : '');
        const where = `scène ${index + 1}`;
        const image = field('beeld');
        const focus = field('focus') || '50% 50%';
        if (!image) problems.push(`${where}: "beeld" ontbreekt`);
        else if (!images[image]) problems.push(`${where}: ${image} staat niet in de map van deze opdracht`);
        if (!field('alt')) problems.push(`${where}: "alt" ontbreekt: beschrijf wat er op het beeld te zien is`);
        if (!field('tekst')) problems.push(`${where}: "tekst" ontbreekt: één regel uitleg bij het beeld`);
        if (!focusPattern.test(focus)) problems.push(`${where}: "focus" moet de vorm "70% 40%" hebben`);
        return { image: images[image] ?? '', alt: field('alt'), text: field('tekst'), focus };
      });
    }
  }

  if (problems.length > 0) {
    throw new Error(`Opdracht "${slug}" (src/content/werk/${slug}/index.md): ${problems.join('; ')}.`);
  }

  return {
    slug,
    title: title!,
    client: client!,
    sector,
    date: date!,
    draft: fm.concept === true,
    media,
    film,
    Text: module.default,
  };
}

/** Newest first; the list numbers follow that order. */
export function orderProjects(projects: Omit<Project, 'number'>[]): Project[] {
  return [...projects]
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))
    .map((project, index) => ({ ...project, number: String(index + 1).padStart(2, '0') }));
}

// Drafts show in `npm run dev` and in pull request previews (the workflow sets VITE_TOON_CONCEPTEN), never on the live site.
// /over uses the same switch while it is still a draft (see routes.tsx).
export const showDrafts = import.meta.env.DEV || import.meta.env.VITE_TOON_CONCEPTEN === 'true';

function imagesFor(slug: string) {
  const prefix = `../content/werk/${slug}/`;
  return Object.fromEntries(
    Object.entries(imageFiles)
      .filter(([file]) => file.startsWith(prefix))
      .map(([file, url]) => [`./${file.slice(prefix.length)}`, url])
  );
}

export const projects: Project[] = orderProjects(
  Object.entries(modules)
    .map(([file, module]) => {
      const slug = file.split('/').at(-2)!;
      return parseProject(slug, module, imagesFor(slug));
    })
    .filter((project) => showDrafts || !project.draft)
);
