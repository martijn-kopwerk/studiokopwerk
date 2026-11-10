import type { ComponentType } from 'react';

/**
 * De algemene voorwaarden, één Markdown-bestand per versie in src/content/voorwaarden/<JJJJ-MM-DD>.md.
 * De nieuwste staat op /voorwaarden; elke versie blijft te lezen op /voorwaarden/<datum>, want voor een opdracht
 * geldt de versie die toen is afgesproken (artikel 2.1). Een nieuwe versie: kopieer het nieuwste bestand naar
 * een nieuwe datum en pas de tekst aan. De oude blijft staan.
 */

export interface Heading {
  id: string;
  text: string;
  // 2: een deel (A, B, …), 3: een artikel
  level: 2 | 3;
}

export interface Voorwaarden {
  // JJJJ-MM-DD, ook de naam van het bestand
  date: string;
  // "9 november 2026"
  label: string;
  path: string;
  headings: Heading[];
  Text: ComponentType<{ components?: Record<string, ComponentType<Record<string, unknown>>> }>;
}

interface Module {
  default: Voorwaarden['Text'];
}

const modules = import.meta.glob<Module>('../content/voorwaarden/*.md', { eager: true });
const sources = import.meta.glob<string>('../content/voorwaarden/*.md', { eager: true, query: '?raw', import: 'default' });

const months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

export function dateLabel(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return `${day} ${months[month! - 1]} ${year}`;
}

// "A. Voor elke opdracht" wordt #deel-a, "12. Stoppen, …" wordt #artikel-12: zo kan een offerte naar één artikel linken.
export function headingId(text: string) {
  const part = /^([A-Z])\.\s/.exec(text);
  if (part) return `deel-${part[1]!.toLowerCase()}`;
  const article = /^(\d+)\.\s/.exec(text);
  if (article) return `artikel-${article[1]}`;
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function parseHeadings(source: string): Heading[] {
  const body = source.replace(/^---[\s\S]*?\n---\n/, '');
  return [...body.matchAll(/^(##|###) (.+)$/gm)].map(([, hashes, text]) => ({
    id: headingId(text!.trim()),
    text: text!.trim(),
    level: hashes === '##' ? 2 : 3,
  }));
}

export const versies: Voorwaarden[] = Object.entries(modules)
  .map(([file, module]) => {
    const date = /(\d{4}-\d{2}-\d{2})\.md$/.exec(file)?.[1];
    if (!date) throw new Error(`${file}: noem het bestand naar de datum van de versie, bijv. 2026-11-09.md`);
    return {
      date,
      label: dateLabel(date),
      path: `/voorwaarden/${date}`,
      headings: parseHeadings(sources[file] ?? ''),
      Text: module.default,
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));
