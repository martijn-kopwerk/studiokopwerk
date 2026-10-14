import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { RollingText } from '../ui/RollingText';
import { Icon } from '../ui/Icon';
import { NextLink } from '../ui/NextLink';
import { Typography } from '../ui/Typography';
import { ContactButton } from '../ContactButton';
import type { DotTarget } from '../../hooks/useAmberDot';
import { contactEmail, mailtoHref } from '../../lib/contact';
import { navItems } from '../../lib/nav';
import { hairline, raster } from '../../lib/raster';
import { cn } from '../../lib/utils';
import type { PageSlot } from '../../routes';

const link = 'group inline-block -mx-1 px-1 py-1.5 rounded-full text-xs font-semibold tracking-wide-xl uppercase text-slate-700 dark:text-slate-300';

const details = ['Oosterweg 24, 9751 PH Haren Gn', 'KvK 42154955', 'Btw NL004525964B92'];

type CopyState = 'idle' | 'copied' | 'failed';

/**
 * How every page ends (design system: Slot and Footer): the page's own last line, the capsule "Vertel waar het
 * knelt" and, smaller, "Of mail zelf" with the address. One invitation per page: the capsule is the step, the address
 * is for whoever prefers to write themselves. Then the quiet meta row: the pages, the company details and Privacy.
 * The amber dot rests in the margin beside the last line while the footer is in view. On phones it stands right of
 * the K's stem.
 */
export function Footer({ slot, onDotTarget }: { slot?: PageSlot; onDotTarget: (target: DotTarget | null) => void }) {
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
      <section
        aria-label="Vertel waar het knelt"
        className={cn('sm:ml-14 py-12 sm:py-16 border-t lg:items-center kopwerk-reveal', hairline, raster)}
      >
        <Typography variant="lead" className="relative text-xl sm:text-2xl md:text-2xl lg:text-2xl text-pretty text-slate-900 dark:text-white">
          {/* Where the amber dot rests while the footer is in view: in the margin, on the K's stem on phones */}
          <span ref={marker} aria-hidden="true" className="absolute -left-8 sm:-left-10 top-[calc(0.5lh-0.4375rem)] size-3.5" />
          {slot?.line ?? 'Klein beginnen, snel iets maken dat werkt.'}
        </Typography>

        <div className="flex flex-col items-start gap-6">
          <ContactButton />
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold tracking-wide-xl uppercase text-subtle dark:text-slate-400">Of mail zelf</span>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <a
                href={mailtoHref()}
                className="group rounded-full font-display font-medium text-xl sm:text-2xl tracking-heading text-slate-900 dark:text-white"
              >
                <RollingText accentClassName="text-amber-700 dark:text-amber-400">{contactEmail}</RollingText>
              </a>
              <button
                type="button"
                onClick={copyAddress}
                className="group inline-flex items-center gap-2 rounded-full border border-slate-500 dark:border-slate-400 pl-3 pr-4 py-2 text-xs font-semibold tracking-wide-xl uppercase text-slate-900 dark:text-white transition-colors duration-300 ease-kopwerk hover:border-amber-600 dark:hover:border-amber-400 motion-reduce:transition-none"
              >
                <Icon name={copy === 'copied' ? 'check' : 'copy'} className="size-4" />
                <RollingText accentClassName="text-amber-700 dark:text-amber-400">Kopieer</RollingText>
                <span className="sr-only"> het mailadres</span>
              </button>
            </div>
            <span aria-live="polite" className="text-sm text-subtle dark:text-slate-400">
              {copy === 'copied' && 'Gekopieerd. Plak het in je mail.'}
              {copy === 'failed' && `Kopiëren lukte niet. Het adres is ${contactEmail}.`}
            </span>
          </div>
          {slot?.next && <NextLink href={slot.next.href}>{slot.next.label}</NextLink>}
        </div>
      </section>

      <div className={cn('sm:ml-14 pt-8 border-t text-xs', hairline, raster, 'gap-6')}>
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
    </footer>
  );
}
