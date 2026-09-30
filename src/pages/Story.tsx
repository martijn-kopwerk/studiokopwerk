import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { stories, type Story } from '../lib/stories';
import { Typography } from '../components/ui/Typography';
import { RollingText } from '../components/ui/RollingText';
import { CapsuleButton } from '../components/ui/CapsuleButton';
import {
  ReadingLineContext,
  ReadingNode,
  StoryAssetsContext,
  StoryHeading,
  storyComponents,
} from '../components/werk/storyComponents';
import { useAmberDot } from '../hooks/useAmberDot';
import { useContact } from '../hooks/useContact';

const linkClass =
  'group inline-flex items-center gap-3 rounded-md outline-none focus-visible:ring-4 focus-visible:ring-amber-500/50 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-kopwerk-dark';
const arrowClass =
  'w-5 h-5 shrink-0 transition-transform duration-500 ease-kopwerk group-hover:text-amber-700 dark:group-hover:text-amber-400 motion-reduce:transition-none';

/**
 * One story. The K's stem runs down the left as a reading line with a node per section;
 * the amber dot settles on the section you're reading.
 */
export function StoryPage({ story }: { story: Story }) {
  const { openContact, preloadContact } = useContact();
  const nodes = useRef(new Set<HTMLElement>());
  const [current, setCurrent] = useState<HTMLElement | null>(null);
  const index = stories.indexOf(story);
  const next = stories.length > 1 ? stories[(index + 1) % stories.length] : undefined;

  const register = useCallback((node: HTMLElement) => {
    nodes.current.add(node);
    return () => {
      nodes.current.delete(node);
    };
  }, []);

  const orderedNodes = () =>
    [...nodes.current].sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

  // Until the first scroll measurement, the dot heads for the title's node (never back to the K in between).
  useAmberDot(() => current ?? orderedNodes()[0] ?? null, current, true);

  // The current section is the last one whose node has passed 40% of the screen height.
  useEffect(() => {
    let pending = false;
    const update = () => {
      pending = false;
      const ordered = orderedNodes();
      const line = window.innerHeight * 0.4;
      const passed = ordered.filter((node) => node.getBoundingClientRect().top <= line);
      setCurrent(passed.at(-1) ?? ordered[0] ?? null);
    };
    const schedule = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  const details = [
    { label: 'Klant', value: story.client },
    { label: 'Sector', value: story.sector },
    { label: 'Vraag', value: story.question },
    { label: 'Doorlooptijd', value: story.duration },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  const { Content } = story;

  return (
    <main className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 flex-1 pt-4 sm:pt-10 pb-20 sm:pb-28">
      <ReadingLineContext.Provider value={register}>
        <article className="relative pl-12 sm:pl-20 motion-safe:animate-rise [--rise-from:16px]">
          {/* The reading line: the K's stem, continued */}
          <span aria-hidden="true" className="absolute left-4 sm:left-8 inset-y-0 w-px bg-slate-200 dark:bg-slate-800" />

          <header className="flex flex-col gap-5 sm:gap-6">
            <Link
              href="/werk"
              className={`${linkClass} self-start min-h-11 text-xs font-semibold tracking-wide-xl uppercase text-slate-500 dark:text-slate-400`}
            >
              <ArrowLeft className={`${arrowClass} w-4 h-4 group-hover:-translate-x-1`} aria-hidden="true" />
              <RollingText accentClassName="text-amber-700 dark:text-amber-400">Alle verhalen</RollingText>
            </Link>
            <Typography variant="eyebrow">
              Verhaal {story.number} • {story.client}
              {story.draft && ' • Concept'}
            </Typography>
            <h1
              tabIndex={-1}
              className="relative max-w-5xl font-display font-normal text-3xl sm:text-5xl md:text-6xl tracking-wide-md uppercase leading-tight text-balance text-slate-900 dark:text-white outline-none"
            >
              <ReadingNode className="top-[0.5em]" />
              {story.title}
            </h1>
            <Typography variant="lead" className="max-w-3xl text-pretty">
              {story.summary}
            </Typography>
          </header>

          {details.length > 0 && (
            <dl className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-6 max-w-5xl">
              {details.map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-1.5 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <dt className="text-xs font-semibold tracking-wide-xl uppercase text-slate-500 dark:text-slate-400">
                    {label}
                  </dt>
                  <dd className="font-medium text-slate-900 dark:text-white">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-6 sm:mt-10 flex flex-col gap-6 max-w-4xl">
            <StoryAssetsContext.Provider value={{ slug: story.slug, assets: story.assets }}>
              <Content components={storyComponents} />
            </StoryAssetsContext.Provider>
          </div>

          <section className="mt-20 sm:mt-28 pt-10 sm:pt-12 border-t border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="flex flex-col items-start gap-4">
              <Typography variant="eyebrow">Jouw zet</Typography>
              <StoryHeading className="mt-0 mb-4 font-normal text-3xl sm:text-5xl">Tijd voor actie.</StoryHeading>
              <CapsuleButton onClick={openContact} onPointerEnter={preloadContact} onFocus={preloadContact}>
                Daag ons uit
              </CapsuleButton>
            </div>
            {next && (
              <Link href={`/werk/${next.slug}`} className={`${linkClass} flex-col items-start lg:items-end gap-3 lg:text-right max-w-md`}>
                <span className="text-xs font-semibold tracking-wide-xl uppercase text-slate-500 dark:text-slate-400">
                  Volgend verhaal • {next.number}
                </span>
                <span className="inline-flex items-center gap-3 font-display font-medium text-xl sm:text-2xl leading-snug text-slate-900 dark:text-white">
                  <span className="text-balance">{next.title}</span>
                  <ArrowRight className={`${arrowClass} group-hover:translate-x-1`} aria-hidden="true" />
                </span>
              </Link>
            )}
          </section>
        </article>
      </ReadingLineContext.Provider>
    </main>
  );
}
