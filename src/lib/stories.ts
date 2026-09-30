import type { ComponentType } from 'react';
import type { MDXComponents } from 'mdx/types';

/**
 * Success stories ("verhalen"): one folder per story in src/content/werk/<slug>/,
 * with an index.mdx (frontmatter + text) and its images beside it.
 * How to add one: README.md, "Een verhaal toevoegen". Folders starting with _ (the template) are skipped.
 */

export type StoryForm = 'beeld' | 'woorden' | 'cijfers';

export const formLabels: Record<StoryForm, string> = {
  beeld: 'In beeld',
  woorden: 'In woorden',
  cijfers: 'In cijfers',
};

export type StoryPreview =
  | { form: 'beeld'; image: string; alt: string }
  | { form: 'woorden'; quote: string; name: string; role?: string }
  | { form: 'cijfers'; value: string; label: string };

export interface Story {
  slug: string;
  // Position in the list, as shown: '01', '02', …
  number: string;
  title: string;
  client: string;
  sector?: string;
  date: string;
  summary: string;
  question?: string;
  duration?: string;
  draft: boolean;
  preview: StoryPreview;
  // Image paths as written in the story ('./foto.webp') → their built URL.
  assets: Record<string, string>;
  Content: ComponentType<{ components?: MDXComponents }>;
}

export interface StoryModule {
  default: ComponentType<{ components?: MDXComponents }>;
  frontmatter?: unknown;
}

const modules = import.meta.glob<StoryModule>(['../content/werk/*/index.mdx', '!../content/werk/_*/index.mdx'], {
  eager: true,
});
const assetFiles = import.meta.glob<string>('../content/werk/*/*.{png,jpg,jpeg,webp,avif,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const forms: StoryForm[] = ['beeld', 'woorden', 'cijfers'];
const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Checks one story's frontmatter and turns it into a Story; throws one error naming every problem, in Dutch. */
export function parseStory(
  slug: string,
  module: StoryModule,
  assets: Record<string, string>
): Omit<Story, 'number'> {
  const problems: string[] = [];
  const data = (typeof module.frontmatter === 'object' && module.frontmatter) || {};
  const fm = data as Record<string, unknown>;

  const text = (key: string, required: boolean): string | undefined => {
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
  const sector = text('sector', false);
  const summary = text('samenvatting', true);
  const question = text('vraag', false);
  const duration = text('doorlooptijd', false);

  // YAML may hand a date over as text or as a Date; keep it as YYYY-MM-DD either way.
  const rawDate = fm.datum instanceof Date ? fm.datum.toISOString().slice(0, 10) : text('datum', true);
  if (rawDate && !/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) problems.push('"datum" moet de vorm JJJJ-MM-DD hebben');

  const draft = fm.concept === true;
  if (fm.concept !== undefined && typeof fm.concept !== 'boolean') problems.push('"concept" moet true of false zijn');

  const form = fm.vorm as StoryForm;
  if (!forms.includes(form)) problems.push(`"vorm" moet een van deze zijn: ${forms.join(', ')}`);

  const p = (typeof fm.voorproef === 'object' && fm.voorproef) || null;
  const preview = p as Record<string, unknown> | null;
  const field = (key: string) => {
    const value = preview?.[key];
    return typeof value === 'string' || typeof value === 'number' ? String(value).trim() : '';
  };
  let parsedPreview: StoryPreview | undefined;
  if (!preview) {
    problems.push('"voorproef" ontbreekt');
  } else if (form === 'beeld') {
    const image = field('beeld');
    const alt = field('alt');
    if (!image) problems.push('"voorproef.beeld" ontbreekt (bijv. ./foto.webp)');
    else if (!assets[image]) problems.push(`"voorproef.beeld": ${image} staat niet in de map van dit verhaal`);
    if (!alt) problems.push('"voorproef.alt" ontbreekt: beschrijf wat er op het beeld te zien is');
    parsedPreview = { form, image: assets[image] ?? '', alt };
  } else if (form === 'woorden') {
    const quote = field('citaat');
    const name = field('naam');
    if (!quote) problems.push('"voorproef.citaat" ontbreekt');
    if (!name) problems.push('"voorproef.naam" ontbreekt');
    parsedPreview = { form, quote, name, role: field('rol') || undefined };
  } else if (form === 'cijfers') {
    const value = field('getal');
    const label = field('label');
    if (!value) problems.push('"voorproef.getal" ontbreekt');
    if (!label) problems.push('"voorproef.label" ontbreekt: wat meet het getal?');
    parsedPreview = { form, value, label };
  }

  if (problems.length > 0 || !parsedPreview) {
    throw new Error(`Verhaal "${slug}" (src/content/werk/${slug}/index.mdx): ${problems.join('; ')}.`);
  }

  return {
    slug,
    title: title!,
    client: client!,
    sector,
    date: rawDate!,
    summary: summary!,
    question,
    duration,
    draft,
    preview: parsedPreview,
    assets,
    Content: module.default,
  };
}

/** Newest first; the list numbers follow that order. */
export function orderStories(stories: Omit<Story, 'number'>[]): Story[] {
  return [...stories]
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))
    .map((story, index) => ({ ...story, number: String(index + 1).padStart(2, '0') }));
}

// Drafts show in `npm run dev` and in pull request previews (the workflow sets VITE_TOON_CONCEPTEN), never on the live site.
const showDrafts = import.meta.env.DEV || import.meta.env.VITE_TOON_CONCEPTEN === 'true';

function assetsFor(slug: string) {
  const prefix = `../content/werk/${slug}/`;
  return Object.fromEntries(
    Object.entries(assetFiles)
      .filter(([file]) => file.startsWith(prefix))
      .map(([file, url]) => [`./${file.slice(prefix.length)}`, url])
  );
}

export const stories: Story[] = orderStories(
  Object.entries(modules)
    .map(([file, module]) => {
      const slug = file.split('/').at(-2)!;
      return parseStory(slug, module, assetsFor(slug));
    })
    .filter((story) => showDrafts || !story.draft)
);
