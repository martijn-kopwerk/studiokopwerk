import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { projects } from '../lib/projects';
import { Typography } from '../components/ui/Typography';
import { ProjectBody, ProjectMedia, ProjectMeta, ProjectStat, ProjectText } from '../components/werk/ProjectCard';
import { KleineDingen } from '../components/werk/KleineDingen';
import { useAmberDot } from '../hooks/useAmberDot';
import { cn } from '../lib/utils';

const WIDE = '(min-width: 1024px)';

/**
 * Opdrachten, one short card each. Wide screens with one opdracht: that card alone, wide, its image beside its text
 * (a list to choose from with one choice feels empty). With more: a list of titles with the chosen opdracht beside it (tabs);
 * the amber dot marks the one under the cursor or keyboard focus. Phones: every card in full, one below the other, right of the K's stem;
 * the dot rides the stem and marks the card passing through the middle of the screen.
 */
export function Werk() {
  const [active, setActive] = useState(0);
  const [wide, setWide] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabMarkers = useRef<(HTMLSpanElement | null)[]>([]);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const cardMarkers = useRef<(HTMLSpanElement | null)[]>([]);
  const singleMarker = useRef<HTMLSpanElement | null>(null);
  const current = projects[active] ?? projects[0];
  const single = projects.length === 1 ? projects[0] : undefined;

  useAmberDot(
    () => (wide && single ? singleMarker.current : ((wide ? tabMarkers : cardMarkers).current[active] ?? null)),
    `${active}-${wide}`
  );

  useEffect(() => {
    const query = window.matchMedia(WIDE);
    const update = () => setWide(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  // Phones have no hover: the card passing through the middle of the screen is the active one.
  useEffect(() => {
    if (wide) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    cards.current.forEach((card) => card && observer.observe(card));
    return () => observer.disconnect();
  }, [wide]);

  // Arrow keys, Home and End move between the opdrachten, as in any vertical tab list.
  const handleTabKeys = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = projects.length - 1;
    const next = { ArrowDown: active + 1, ArrowUp: active - 1, Home: 0, End: last }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const index = next < 0 ? last : next > last ? 0 : next;
    setActive(index);
    tabs.current[index]?.focus();
  };

  return (
    <main id="inhoud" className="relative z-10 w-full max-w-7xl mx-auto pl-14 pr-6 sm:px-10 flex-1 pt-6 sm:pt-12 pb-20 sm:pb-28 motion-safe:animate-rise [--rise-from:16px]">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_26rem] xl:grid-cols-[minmax(0,1fr)_30rem] lg:gap-x-16 lg:items-end">
        <div className="flex flex-col gap-4 sm:gap-5">
          <Typography variant="eyebrow">Werk</Typography>
          <h1
            tabIndex={-1}
            className="font-display font-normal text-4xl sm:text-6xl md:text-7xl tracking-wide-md uppercase leading-none text-slate-900 dark:text-white outline-none"
          >
            Wat ik maakte
          </h1>
        </div>
        <Typography variant="body" className="max-w-md tracking-wide-sm text-pretty">
          Elke opdracht kort verteld: de vraag, wat ik maakte en wat het opleverde.
        </Typography>
      </div>

      {/* Wide screens, one opdracht: the card alone, its image (and film) beside the text and the saving */}
      {single && (
        <article
          aria-labelledby={`opdracht-${single.slug}`}
          className="relative hidden lg:grid mt-16 pt-12 pl-14 border-t border-slate-200 dark:border-slate-800 grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-x-16 items-center"
        >
          {/* The dot's place: in the margin beside the card, on the reading line of the page */}
          <span ref={singleMarker} aria-hidden="true" className="absolute left-4 top-[3.35rem] size-3.5" />
          <ProjectMedia project={single} still={single.begin} />
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h2
                id={`opdracht-${single.slug}`}
                className="font-display font-medium text-3xl leading-snug tracking-heading text-balance text-slate-900 dark:text-white"
              >
                {single.title}
              </h2>
              <ProjectMeta project={single} />
            </div>
            <ProjectText project={single} />
            <ProjectStat project={single} className="mt-4" />
          </div>
        </article>
      )}

      {/* Wide screens, more than one opdracht: titles on the left, the chosen opdracht beside them. Not rendered at all
          for one, so its title and id are in the page once. */}
      {!single && (
      <div className="hidden lg:grid mt-16 grid-cols-[minmax(0,1fr)_26rem] xl:grid-cols-[minmax(0,1fr)_30rem] gap-x-16 items-start">
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-label="Opdrachten"
          onKeyDown={handleTabKeys}
          className="border-b border-slate-200 dark:border-slate-800"
        >
          {projects.map((project, index) => {
            const isActive = index === active;
            return (
              // The dot's marker sits beside the tab, not inside it: offsets measured inside a <button> are unreliable
              <div key={project.slug} role="presentation" className="relative">
                <span
                  ref={(el) => {
                    tabMarkers.current[index] = el;
                  }}
                  aria-hidden="true"
                  className="absolute left-4 top-[2.85rem] size-3.5"
                />
                <button
                  ref={(el) => {
                    tabs.current[index] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`opdracht-${project.slug}`}
                  aria-selected={isActive}
                  aria-controls="opdracht-detail"
                  tabIndex={isActive ? 0 : -1}
                  onPointerEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                  className="w-full flex items-baseline gap-8 py-8 pl-14 text-left border-t border-slate-200 dark:border-slate-800 rounded-2xl"
                >
                  <span
                    className={cn(
                      'shrink-0 font-display font-bold text-sm tracking-wide-lg transition-colors duration-500 ease-kopwerk',
                      isActive ? 'text-slate-900 dark:text-white' : 'text-subtle dark:text-slate-400'
                    )}
                  >
                    {project.number}
                  </span>
                  <span className="flex flex-col gap-2 min-w-0">
                    <span
                      className={cn(
                        'font-display font-medium text-2xl leading-snug text-balance transition-colors duration-500 ease-kopwerk',
                        isActive ? 'text-slate-900 dark:text-white' : 'text-subtle dark:text-slate-400'
                      )}
                    >
                      {project.title}
                    </span>
                    <ProjectMeta project={project} />
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {current && (
          <section
            role="tabpanel"
            id="opdracht-detail"
            aria-labelledby={`opdracht-${current.slug}`}
            tabIndex={0}
            className="sticky top-10 pt-8 rounded-2xl"
          >
            <div key={current.slug} className="motion-safe:animate-rise [--rise-from:8px] [animation-duration:0.6s]">
              <ProjectBody project={current} />
            </div>
          </section>
        )}
      </div>
      )}

      {/* Phones and tablets: every opdracht in full */}
      <ol className="lg:hidden mt-12 border-b border-slate-200 dark:border-slate-800">
        {projects.map((project, index) => (
          <li
            key={project.slug}
            ref={(el) => {
              cards.current[index] = el;
            }}
            data-index={index}
            className="relative flex flex-col gap-5 py-8 sm:pl-14 border-t border-slate-200 dark:border-slate-800"
          >
            <span
              ref={(el) => {
                cardMarkers.current[index] = el;
              }}
              aria-hidden="true"
              className="absolute -left-8 sm:left-4 top-[2.55rem] size-3.5"
            />
            <div className="flex items-baseline gap-5 sm:gap-8">
              {/* A number only means something in a list of more than one */}
              {!single && (
                <span className="shrink-0 font-display font-bold text-sm tracking-wide-lg text-slate-900 dark:text-white">
                  {project.number}
                </span>
              )}
              <div className="flex flex-col gap-2 min-w-0">
                <h2 className="font-display font-medium text-xl sm:text-2xl leading-snug text-balance text-slate-900 dark:text-white">
                  {project.title}
                </h2>
                <ProjectMeta project={project} />
              </div>
            </div>
            <div className="max-w-md">
              <ProjectBody project={project} />
            </div>
          </li>
        ))}
      </ol>

      <KleineDingen />
    </main>
  );
}
