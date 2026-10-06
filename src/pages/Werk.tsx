import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { projects } from '../lib/projects';
import { Typography } from '../components/ui/Typography';
import { CapsuleButton } from '../components/ui/CapsuleButton';
import { ProjectBody, ProjectMeta } from '../components/werk/ProjectCard';
import { useAmberDot } from '../hooks/useAmberDot';
import { useContact } from '../hooks/useContact';
import { cn } from '../lib/utils';

const WIDE = '(min-width: 1024px)';

/**
 * Opdrachten, one short card each. Wide screens: a list of titles with the chosen opdracht beside it (tabs);
 * the amber dot marks the one under the cursor or keyboard focus. Phones: every card in full, one below the other, right of the K's stem;
 * the dot rides the stem and marks the card passing through the middle of the screen.
 */
export function Werk() {
  const { openContact, preloadContact } = useContact();
  const [active, setActive] = useState(0);
  const [wide, setWide] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabMarkers = useRef<(HTMLSpanElement | null)[]>([]);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const cardMarkers = useRef<(HTMLSpanElement | null)[]>([]);
  const current = projects[active] ?? projects[0];

  useAmberDot(() => (wide ? tabMarkers : cardMarkers).current[active] ?? null, `${active}-${wide}`);

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
    <main className="relative z-10 w-full max-w-7xl mx-auto pl-14 pr-6 sm:px-10 flex-1 pt-6 sm:pt-12 pb-20 sm:pb-28 motion-safe:animate-rise [--rise-from:16px]">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_26rem] xl:grid-cols-[minmax(0,1fr)_30rem] lg:gap-x-16 lg:items-end">
        <div className="flex flex-col gap-4 sm:gap-5">
          <Typography variant="eyebrow">Werk</Typography>
          <h1
            tabIndex={-1}
            className="font-display font-normal text-4xl sm:text-6xl md:text-7xl tracking-wide-md uppercase leading-none text-slate-900 dark:text-white outline-none"
          >
            Wat wérkt
          </h1>
        </div>
        <Typography variant="body" className="max-w-md tracking-wide-sm text-pretty">
          Opdrachten uit de praktijk, kort verteld: de vraag, wat we maakten en wat het opleverde.
        </Typography>
      </div>

      {/* Wide screens: titles on the left, the chosen opdracht beside them */}
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
                  className="w-full flex items-baseline gap-8 py-8 pl-14 text-left border-t border-slate-200 dark:border-slate-800 rounded-md outline-none focus-visible:ring-4 focus-visible:ring-amber-500/50 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-kopwerk-dark"
                >
                  <span
                    className={cn(
                      'shrink-0 font-display font-bold text-sm tracking-wide-lg transition-colors duration-500 ease-kopwerk',
                      isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                    )}
                  >
                    {project.number}
                  </span>
                  <span className="flex flex-col gap-2 min-w-0">
                    <span
                      className={cn(
                        'font-display font-medium text-2xl leading-snug text-balance transition-colors duration-500 ease-kopwerk',
                        isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
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
            className="sticky top-10 pt-8 rounded-md outline-none focus-visible:ring-4 focus-visible:ring-amber-500/50 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-kopwerk-dark"
          >
            <div key={current.slug} className="motion-safe:animate-rise [--rise-from:8px] [animation-duration:0.6s]">
              <ProjectBody project={current} />
            </div>
          </section>
        )}
      </div>

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
              <span className="shrink-0 font-display font-bold text-sm tracking-wide-lg text-slate-900 dark:text-white">
                {project.number}
              </span>
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

      <section className="mt-20 sm:mt-28 flex flex-col sm:flex-row sm:items-center justify-between gap-8 sm:pl-14">
        <Typography variant="lead" as="p">
          Hier is nog plek voor <em className="italic font-normal">jouw</em> opdracht.
        </Typography>
        <CapsuleButton onClick={openContact} onPointerEnter={preloadContact} onFocus={preloadContact} className="sm:w-auto">
          Daag ons uit
        </CapsuleButton>
      </section>
    </main>
  );
}
