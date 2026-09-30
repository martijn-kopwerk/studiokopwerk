import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { formLabels, stories } from '../lib/stories';
import { Typography } from '../components/ui/Typography';
import { RollingText } from '../components/ui/RollingText';
import { CapsuleButton } from '../components/ui/CapsuleButton';
import { StoryPreview } from '../components/werk/StoryPreview';
import { useAmberDot } from '../hooks/useAmberDot';
import { useContact } from '../hooks/useContact';
import { cn } from '../lib/utils';

const focusRing =
  'outline-none focus-visible:ring-4 focus-visible:ring-amber-500/50 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-kopwerk-dark';

/**
 * The index of stories. The amber dot marks the story you're looking at: the one under the cursor or keyboard focus
 * on wide screens, the one in the middle of the screen on phones. Wide screens show its preview beside the list;
 * phones show every preview inside its row.
 */
export function Werk() {
  const { openContact, preloadContact } = useContact();
  const [active, setActive] = useState(0);
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const markers = useRef<(HTMLSpanElement | null)[]>([]);
  const activeStory = stories[active] ?? stories[0];

  useAmberDot(() => markers.current[active] ?? null, active);

  // Phones have no hover: the row passing through the middle of the screen becomes the active one.
  useEffect(() => {
    if (window.matchMedia('(min-width: 1024px)').matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    rows.current.forEach((row) => row && observer.observe(row));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 flex-1 pt-6 sm:pt-12 pb-20 sm:pb-28 motion-safe:animate-rise [--rise-from:16px]">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] xl:grid-cols-[minmax(0,1fr)_28rem] lg:gap-x-16 lg:items-end">
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
          Verhalen uit de praktijk. In beeld, in woorden of in één getal: elk verhaal in de vorm die het best vertelt
          wat er veranderde.
        </Typography>
      </div>

      <div className="mt-12 sm:mt-16 grid lg:grid-cols-[minmax(0,1fr)_24rem] xl:grid-cols-[minmax(0,1fr)_28rem] lg:gap-x-16 items-start">
        <nav aria-label="Verhalen">
          <ol className="border-b border-slate-200 dark:border-slate-800">
            {stories.map((story, index) => {
              const isActive = index === active;
              return (
                <li
                  key={story.slug}
                  ref={(el) => {
                    rows.current[index] = el;
                  }}
                  data-index={index}
                  className="border-t border-slate-200 dark:border-slate-800"
                >
                  <Link
                    href={`/werk/${story.slug}`}
                    onPointerEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    className={cn('group relative flex flex-col gap-5 py-6 sm:py-8 pl-10 sm:pl-14 rounded-md', focusRing)}
                  >
                    {/* Where the amber dot sits when this story is active */}
                    <span
                      ref={(el) => {
                        markers.current[index] = el;
                      }}
                      aria-hidden="true"
                      className="absolute left-2 sm:left-4 top-[2.3rem] sm:top-[2.85rem] size-3.5"
                    />
                    <span className="flex items-start justify-between gap-6">
                      <span className="flex items-baseline gap-5 sm:gap-8 min-w-0">
                        <span
                          className={cn(
                            'shrink-0 font-display font-bold text-sm tracking-wide-lg transition-colors duration-500 ease-kopwerk',
                            isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                          )}
                        >
                          {story.number}
                        </span>
                        <span className="flex flex-col gap-2 min-w-0">
                          <span
                            className={cn(
                              'font-display font-medium text-xl sm:text-2xl leading-snug text-balance transition-colors duration-500 ease-kopwerk',
                              isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                            )}
                          >
                            {story.title}
                          </span>
                          <span className="text-xs font-semibold tracking-wide-xl uppercase text-slate-500 dark:text-slate-400">
                            {story.client}
                            {story.sector && ` • ${story.sector}`}
                          </span>
                        </span>
                      </span>
                      <span className="hidden sm:flex shrink-0 flex-col items-end gap-2 pt-1.5 text-xs font-semibold tracking-wide-xl uppercase text-slate-500 dark:text-slate-400">
                        {formLabels[story.preview.form]}
                        {story.draft && (
                          <span className="rounded-full border border-slate-300 dark:border-slate-700 px-2.5 py-0.5 tracking-wide-md">
                            Concept
                          </span>
                        )}
                      </span>
                    </span>
                    {/* Phones: the preview lives in the row (a visual copy; the row's text already says it all) */}
                    <span aria-hidden="true" className="lg:hidden block max-w-md">
                      <StoryPreview story={story} compact />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Wide screens: the active story's preview. A visual echo of the list, so it stays out of the tab order. */}
        {activeStory && (
          <aside aria-hidden="true" className="hidden lg:flex sticky top-10 flex-col gap-8 pt-8">
            <div key={activeStory.slug} className="motion-safe:animate-rise [--rise-from:8px] [animation-duration:0.6s]">
              <StoryPreview story={activeStory} />
            </div>
            <Link
              href={`/werk/${activeStory.slug}`}
              tabIndex={-1}
              className="group inline-flex items-center gap-3 self-start text-base font-medium tracking-wide-sm text-slate-900 dark:text-white"
            >
              <RollingText accentClassName="text-amber-700 dark:text-amber-400">Lees het verhaal</RollingText>
              <ArrowRight
                className="w-5 h-5 transition-transform duration-500 ease-kopwerk group-hover:translate-x-1 group-hover:text-amber-700 dark:group-hover:text-amber-400 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </Link>
          </aside>
        )}
      </div>

      <section className="mt-20 sm:mt-28 flex flex-col sm:flex-row sm:items-center justify-between gap-8 pl-10 sm:pl-14">
        <Typography variant="lead" as="p">
          Hier is nog plek voor <em className="italic font-normal">jouw</em> verhaal.
        </Typography>
        <CapsuleButton onClick={openContact} onPointerEnter={preloadContact} onFocus={preloadContact} className="sm:w-auto">
          Daag ons uit
        </CapsuleButton>
      </section>
    </main>
  );
}
