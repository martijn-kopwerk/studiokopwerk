import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { RollingText } from '../ui/RollingText';
import type { DotTarget } from '../../hooks/useAmberDot';
import { useContact } from '../../hooks/useContact';
import { contactEmail } from '../../lib/contact';
import { navItems } from '../../lib/nav';

const focusRing =
  'outline-none focus-visible:ring-4 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-kopwerk-dark';
const link = `group -mx-1 px-1 rounded-md text-xs font-semibold tracking-wide-xl uppercase text-slate-700 dark:text-slate-300 ${focusRing}`;

const details = ['Oosterweg 24, 9751 PH Haren Gn', 'KvK 42154955', 'Btw NL004525964B92'];

/**
 * A quiet footer: the pages and the address on one line, the company details below. No second call to action:
 * every page already ends with "Daag ons uit", and the address opens that same contact card.
 * On phones it stands right of the K's stem, like the pages.
 */
export function Footer({ onDotTarget }: { onDotTarget: (target: DotTarget | null) => void }) {
  const { openContact, preloadContact } = useContact();
  const currentYear = new Date().getFullYear();
  const footer = useRef<HTMLElement | null>(null);
  const marker = useRef<HTMLSpanElement | null>(null);

  // The drafting table is fixed to the screen and the footer scrolls over it, so once the footer is in view
  // the amber dot comes down the reading line and rests beside it instead of floating over the text.
  useEffect(() => {
    const element = footer.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const target = marker.current;
        onDotTarget(entry?.isIntersecting && target ? { element: target } : null);
      },
      { rootMargin: '0px 0px -10% 0px' }
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
      className="relative z-20 w-full max-w-7xl mx-auto pl-14 pr-6 sm:px-10 pt-16 sm:pt-24 pb-8 shrink-0"
    >
      <div className="relative sm:pl-14 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Where the amber dot rests while the footer is in view: in the margin, on the K's stem on phones */}
        <span ref={marker} aria-hidden="true" className="absolute -left-8 sm:left-4 top-1 size-3.5" />

        <nav aria-label="Pagina's">
          <ul className="flex items-center gap-6">
            <li>
              <Link href="/" className={link}>
                <RollingText accentClassName="text-amber-700 dark:text-amber-400">Home</RollingText>
              </Link>
            </li>
            {navItems.map(({ path, label }) => (
              <li key={path}>
                <Link href={path} className={link}>
                  <RollingText accentClassName="text-amber-700 dark:text-amber-400">{label}</RollingText>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={openContact}
          onPointerEnter={preloadContact}
          onFocus={preloadContact}
          aria-label={`Daag ons uit: ${contactEmail}`}
          className={`group self-start sm:self-auto -mx-1 px-1 rounded-md text-sm text-slate-700 dark:text-slate-300 ${focusRing}`}
        >
          <RollingText accentClassName="text-amber-700 dark:text-amber-400">{contactEmail}</RollingText>
        </button>
      </div>

      <p className="sm:pl-14 mt-6 flex flex-wrap gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
        {details.map((detail) => (
          <span key={detail} className="after:content-['•'] after:ml-2">
            {detail}
          </span>
        ))}
        {/* The year comes from the build; in the first days of a new year the browser may know better */}
        <span suppressHydrationWarning>© {currentYear} Studio Kopwerk</span>
      </p>
    </footer>
  );
}
