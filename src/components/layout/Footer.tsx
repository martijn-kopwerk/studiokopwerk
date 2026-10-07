import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import type { DotTarget } from '../../hooks/useAmberDot';
import { RollingText } from '../ui/RollingText';
import { contactEmail, mailtoHref } from '../../lib/contact';
import { routes } from '../../routes';

const focusRing =
  'outline-none focus-visible:ring-4 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-kopwerk-dark';
const meta = 'text-xs text-slate-500 dark:text-slate-400';

const footerLinks = [
  { path: '/werk', label: 'Werk' },
  { path: '/over', label: 'Over' },
].filter(({ path }) => routes.some((route) => route.meta.path === path));

// The company details the design system's footer shows in its meta row.
const details = ['Oosterweg 24, 9751 PH Haren Gn', 'KvK 42154955', 'Btw NL004525964B92'];

/**
 * The design system's footer: the wordmark, "Deel je plannen" with the address in Syne,
 * and a meta row with the pages and the company details. On phones it stands right of the K's stem, like the pages.
 */
export function Footer({ onDotTarget }: { onDotTarget: (target: DotTarget | null) => void }) {
  const currentYear = new Date().getFullYear();
  const footer = useRef<HTMLElement | null>(null);
  const wordmarkDot = useRef<HTMLSpanElement | null>(null);

  // The drafting table is fixed to the screen and the footer scrolls over it, so once the footer is in view
  // the amber dot comes down to rest on the wordmark's own dot instead of floating over the text.
  useEffect(() => {
    const element = footer.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const dot = wordmarkDot.current;
        onDotTarget(entry?.isIntersecting && dot ? { element: dot } : null);
      },
      { rootMargin: '0px 0px -15% 0px' }
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      onDotTarget(null);
    };
  }, [onDotTarget]);

  return (
    <footer
      ref={footer}
      id="main-footer"
      className="relative z-20 w-full max-w-7xl mx-auto pl-14 pr-6 sm:px-10 pt-12 sm:pt-16 pb-8 shrink-0"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
        {/* No tagline here: home and Over already close on "Zien wat wérkt" just above */}
        <span className="flex items-center gap-3">
          <span
            ref={wordmarkDot}
            aria-hidden="true"
            className="size-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
          />
          <span className="font-display font-bold text-sm tracking-wide-xl uppercase text-slate-900 dark:text-white">
            Studio Kopwerk
          </span>
        </span>

        <div className="flex flex-col gap-2 sm:items-end">
          <span className="text-xs font-medium tracking-super-wide uppercase text-slate-500 dark:text-slate-400">
            Deel je plannen
          </span>
          <a
            href={mailtoHref()}
            className={`group -mx-1 px-1 rounded-md font-display font-medium text-lg sm:text-2xl text-slate-900 dark:text-white ${focusRing}`}
          >
            <RollingText accentClassName="text-amber-700 dark:text-amber-400">{contactEmail}</RollingText>
          </a>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {footerLinks.length > 0 && (
          <nav aria-label="Pagina's">
            <ul className="flex items-center gap-6">
              {footerLinks.map(({ path, label }) => (
                <li key={path}>
                  <Link
                    href={path}
                    className={`group -mx-1 px-1 rounded-md text-xs font-semibold tracking-wide-xl uppercase text-slate-700 dark:text-slate-300 ${focusRing}`}
                  >
                    <RollingText accentClassName="text-amber-700 dark:text-amber-400">{label}</RollingText>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <p className={`${meta} flex flex-wrap gap-x-2 gap-y-1`}>
          {details.map((detail) => (
            <span key={detail} className="after:content-['•'] after:ml-2">
              {detail}
            </span>
          ))}
          {/* The year comes from the build; in the first days of a new year the browser may know better */}
          <span suppressHydrationWarning>© {currentYear}</span>
        </p>
      </div>
    </footer>
  );
}
