import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { RollingLetters, RollingText } from '../ui/RollingText';
import { Icon } from '../ui/Icon';
import type { DotTarget } from '../../hooks/useAmberDot';
import { useContact } from '../../hooks/useContact';
import { contactEmail } from '../../lib/contact';
import { navItems } from '../../lib/nav';
import { hairline, raster } from '../../lib/raster';
import { cn } from '../../lib/utils';

const link = 'group inline-block -mx-1 px-1 py-1.5 rounded-full text-xs font-semibold tracking-wide-xl uppercase text-slate-700 dark:text-slate-300';

const details = ['Oosterweg 24, 9751 PH Haren Gn', 'KvK 42154955', 'Btw NL004525964B92'];

type CopyState = 'idle' | 'copied' | 'failed';

/**
 * Every page ends with the mail address (design system: Footer): "Vertel het in een mail" and the address in Syne,
 * as wide as the page, the last and largest thing you see and the shortest way to contact. It opens the same contact
 * card as the button; beside it you can copy the address. Below, quiet: the pages, the company details and privacy.
 * No second capsule: every page already ends with "Vertel waar het knelt". On phones it stands right of the K's stem.
 */
export function Footer({ onDotTarget }: { onDotTarget: (target: DotTarget | null) => void }) {
  const { openContact, preloadContact } = useContact();
  const currentYear = new Date().getFullYear();
  const footer = useRef<HTMLElement | null>(null);
  const marker = useRef<HTMLSpanElement | null>(null);
  const [copy, setCopy] = useState<CopyState>('idle');

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

  // Confirmed in words (no green success colour), then the button returns to its label.
  useEffect(() => {
    if (copy === 'idle') return;
    const timer = window.setTimeout(() => setCopy('idle'), 2500);
    return () => window.clearTimeout(timer);
  }, [copy]);

  const copyAddress = () => {
    if (!navigator.clipboard) {
      setCopy('failed');
      return;
    }
    navigator.clipboard.writeText(contactEmail).then(
      () => setCopy('copied'),
      () => setCopy('failed')
    );
  };

  return (
    <footer
      ref={footer}
      id="main-footer"
      className="relative z-20 w-full max-w-7xl mx-auto pl-14 pr-6 sm:px-10 pb-8 shrink-0"
    >
      <div className={cn('sm:ml-14 pt-16 sm:pt-24 border-t', hairline)}>
        <p className="relative text-xs sm:text-sm font-medium tracking-super-wide uppercase text-subtle dark:text-slate-400">
          {/* Where the amber dot rests while the footer is in view: in the margin, on the K's stem on phones */}
          <span ref={marker} aria-hidden="true" className="absolute -left-8 sm:-left-10 top-[calc(0.5lh-0.4375rem)] size-3.5" />
          Vertel het in een mail
        </p>

        {/* The address as wide as the column: its size follows the container, so it fits on every screen */}
        <div className="@container mt-4 sm:mt-6">
          <button
            type="button"
            onClick={openContact}
            onPointerEnter={preloadContact}
            onFocus={preloadContact}
            aria-haspopup="dialog"
            aria-label={`Vertel het in een mail: ${contactEmail}`}
            className="group block max-w-full -my-1 py-1 rounded-2xl text-left font-display font-medium text-footer-mail tracking-display text-slate-900 dark:text-white"
          >
            <RollingLetters text={contactEmail} accentClassName="text-amber-700 dark:text-amber-400" />
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <button
            type="button"
            onClick={copyAddress}
            className="group inline-flex items-center gap-2 rounded-full border border-slate-500 dark:border-slate-400 pl-3 pr-4 py-2 text-xs font-semibold tracking-wide-xl uppercase text-slate-900 dark:text-white transition-colors duration-300 ease-kopwerk hover:border-amber-600 dark:hover:border-amber-400 motion-reduce:transition-none"
          >
            <Icon name={copy === 'copied' ? 'check' : 'copy'} className="size-4" />
            <RollingText accentClassName="text-amber-700 dark:text-amber-400">Kopieer het mailadres</RollingText>
          </button>
          <span aria-live="polite" className="text-sm text-subtle dark:text-slate-400">
            {copy === 'copied' && 'Gekopieerd. Plak het in je mail.'}
            {copy === 'failed' && `Kopiëren lukte niet. Het adres is ${contactEmail}.`}
          </span>
        </div>

        <div className={cn('mt-16 sm:mt-20 pt-8 border-t text-xs', hairline, raster, 'gap-6')}>
          <nav aria-label="Pagina's">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <li>
                <Link href="/" className={link}>
                  <RollingText accentClassName="text-amber-700 dark:text-amber-400">Begin</RollingText>
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

          <p className="flex flex-wrap gap-x-2 gap-y-1 text-subtle dark:text-slate-400">
            {details.map((detail) => (
              <span key={detail} className="after:content-['•'] after:ml-2">
                {detail}
              </span>
            ))}
            {/* The year comes from the build; in the first days of a new year the browser may know better */}
            <span suppressHydrationWarning className="after:content-['•'] after:ml-2">
              © {currentYear} Studio Kopwerk
            </span>
            <Link href="/privacy" className="-my-1 py-1 underline underline-offset-4 hover:text-slate-900 dark:hover:text-white">
              Privacy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
