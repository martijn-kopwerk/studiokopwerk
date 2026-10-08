import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { RollingText } from '../ui/RollingText';
import type { DotTarget } from '../../hooks/useAmberDot';
import { useContact } from '../../hooks/useContact';
import { contactEmail } from '../../lib/contact';
import { navItems } from '../../lib/nav';
import { hairline, raster } from '../../lib/raster';
import { cn } from '../../lib/utils';

const link = 'group -mx-1 px-1 py-1 rounded-md text-xs font-semibold tracking-wide-xl uppercase text-slate-700 dark:text-slate-300';

const details = ['Oosterweg 24, 9751 PH Haren Gn', 'KvK 42154955', 'Btw NL004525964B92'];

/**
 * A quiet footer on the site's grid, below a hairline: the pages on the text line, the address and the company
 * details in the second column, all in one small style. No second call to action:
 * every page already ends with "Vertel waar het knelt", and the address opens that same contact card.
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
      className="relative z-20 w-full max-w-7xl mx-auto pl-14 pr-6 sm:px-10 pb-8 shrink-0"
    >
      <div className={cn('sm:ml-14 pt-8 border-t text-xs', hairline, raster, 'gap-6')}>
        <nav aria-label="Pagina's" className="relative">
          {/* Where the amber dot rests while the footer is in view: in the margin, on the K's stem on phones */}
          <span ref={marker} aria-hidden="true" className="absolute -left-8 sm:-left-10 top-[calc(0.5lh-0.1875rem)] size-3.5" />
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

        {/* The address and the company details in the second column, one small style */}
        <div className="flex flex-col items-start gap-2">
          <button
            type="button"
            onClick={openContact}
            onPointerEnter={preloadContact}
            onFocus={preloadContact}
            aria-label={`Vertel waar het knelt: ${contactEmail}`}
            className="group -mx-1 px-1 py-1 rounded-md text-slate-700 dark:text-slate-300"
          >
            <RollingText accentClassName="text-amber-700 dark:text-amber-400">{contactEmail}</RollingText>
          </button>
          <p className="flex flex-wrap gap-x-2 gap-y-1 text-slate-500 dark:text-slate-400">
            {details.map((detail) => (
              <span key={detail} className="after:content-['•'] after:ml-2">
                {detail}
              </span>
            ))}
            {/* The year comes from the build; in the first days of a new year the browser may know better */}
            <span suppressHydrationWarning>© {currentYear} Studio Kopwerk</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
