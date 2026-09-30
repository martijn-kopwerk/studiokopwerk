import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import type { MDXComponents } from 'mdx/types';
import { Typography } from '../ui/Typography';
import { cn } from '../../lib/utils';

/** Registers a node on the story's reading line; returns the cleanup. Provided by the story page. */
export const ReadingLineContext = createContext<(node: HTMLElement) => () => void>(() => () => {});

/** The current story's image paths ('./foto.webp') → built URLs. */
export const StoryAssetsContext = createContext<{ slug: string; assets: Record<string, string> }>({
  slug: '',
  assets: {},
});

const meta = 'text-xs font-semibold tracking-wide-xl uppercase text-slate-500 dark:text-slate-400';

/** A hollow node on the reading line, next to a heading. The amber dot settles on the node of the section you're reading. */
export function ReadingNode({ className }: { className?: string }) {
  const register = useContext(ReadingLineContext);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => (ref.current ? register(ref.current) : undefined), [register]);
  // The registered element is zero wide and sits exactly on the line, so the dot (which ignores transforms) lands on it.
  return (
    <span ref={ref} aria-hidden="true" className={cn('absolute -left-8 sm:-left-12 w-0 h-3.5', className)}>
      <span className="absolute left-0 top-0 -translate-x-1/2 size-3.5 rounded-full border-2 border-slate-400 dark:border-slate-500 bg-slate-50 dark:bg-kopwerk-dark" />
    </span>
  );
}

export function StoryHeading({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <Typography
      variant="h2"
      className={cn('relative mt-10 sm:mt-16 text-2xl sm:text-3xl md:text-4xl leading-tight text-balance', className)}
    >
      <ReadingNode className="top-[0.45em]" />
      {children}
    </Typography>
  );
}

function Beeld({ src, alt, bijschrift }: { src: string; alt: string; bijschrift?: string }) {
  const { slug, assets } = useContext(StoryAssetsContext);
  const url = assets[src];
  if (!url) {
    throw new Error(`Verhaal "${slug}": <Beeld src="${src}"> staat niet in de map van dit verhaal.`);
  }
  if (!alt) {
    throw new Error(`Verhaal "${slug}": <Beeld src="${src}"> mist een alt die beschrijft wat er te zien is.`);
  }
  return (
    <figure className="my-4 sm:my-8 flex flex-col gap-4">
      <img
        src={url}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="block w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900"
      />
      {bijschrift && <figcaption className={meta}>{bijschrift}</figcaption>}
    </figure>
  );
}

// MDX wraps a quote's text in a paragraph; inside a quote that paragraph takes the quote's style, not the body's.
const InQuoteContext = createContext(false);

function Paragraph({ children }: { children?: ReactNode }) {
  if (useContext(InQuoteContext)) return <p>{children}</p>;
  return (
    <Typography variant="body" className="max-w-2xl sm:text-lg">
      {children}
    </Typography>
  );
}

function Citaat({ naam, rol, children }: { naam: string; rol?: string; children?: ReactNode }) {
  return (
    <figure className="my-6 sm:my-10 flex flex-col gap-6">
      <blockquote className="flex flex-col gap-4 text-2xl sm:text-3xl md:text-4xl font-light leading-snug tracking-wide-sm text-slate-600 dark:text-slate-300 text-pretty">
        <InQuoteContext.Provider value={true}>{children}</InQuoteContext.Provider>
      </blockquote>
      <figcaption className={meta}>
        {naam}
        {rol && ` • ${rol}`}
      </figcaption>
    </figure>
  );
}

function Cijfers({ children }: { children?: ReactNode }) {
  return <div className="my-6 sm:my-10 flex flex-wrap gap-x-16 gap-y-10">{children}</div>;
}

function Cijfer({ waarde, label }: { waarde: string | number; label: string }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-display font-bold text-6xl sm:text-7xl leading-none tracking-wide-lg text-slate-900 dark:text-white">
        {waarde}
      </span>
      <span className={meta}>{label}</span>
    </div>
  );
}

/** How the parts of a story's MDX render: running text in the brand's type, plus the building blocks from the template. */
export const storyComponents: MDXComponents = {
  h2: ({ children }) => <StoryHeading>{children}</StoryHeading>,
  h3: ({ children }) => (
    <Typography variant="h3" className="mt-6 text-xl sm:text-2xl">
      {children}
    </Typography>
  ),
  p: Paragraph,
  ul: ({ children }) => (
    <ul className="max-w-2xl list-disc pl-5 space-y-2 text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 marker:text-slate-400 dark:marker:text-slate-500">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="max-w-2xl list-decimal pl-5 space-y-2 text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
      {children}
    </ol>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="underline decoration-slate-300 dark:decoration-slate-600 underline-offset-4 hover:text-amber-700 dark:hover:text-amber-400 hover:decoration-current transition-colors duration-300 ease-kopwerk rounded-sm outline-none focus-visible:ring-4 focus-visible:ring-amber-500/50"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-semibold text-slate-900 dark:text-white">{children}</strong>,
  Beeld,
  Citaat,
  Cijfers,
  Cijfer,
};
