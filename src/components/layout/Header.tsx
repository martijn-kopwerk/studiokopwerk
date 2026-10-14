import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useContact } from '../../hooks/useContact';
import { ThemeToggle } from '../ThemeToggle';
import { Icon } from '../ui/Icon';
import { KopwerkLogo } from '../ui/KopwerkLogo';
import { RollingText } from '../ui/RollingText';
import { normalizePath } from '../../routes';
import { navItems } from '../../lib/nav';
import { cn } from '../../lib/utils';

export function Header({ onToggleTheme }: { onToggleTheme: () => void }) {
  const [location] = useLocation();
  const current = normalizePath(location);

  return (
    <header
      id="main-header"
      className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 py-6 flex items-center justify-between shrink-0"
    >
      {/* The design system's lock-up: the K and the wordmark, the way home from every other page.
          On home the hero already says the name, so the K stands alone there. Phones keep the bare K everywhere
          (the wordmark doesn't fit beside the menu); its stem is where the drawing grows from. On wider screens the K
          stands in the dot's margin and the wordmark starts on the text line (src/lib/raster.ts). */}
      <Link
        href="/"
        aria-label="Studio Kopwerk, naar het begin"
        aria-current={current === '/' ? 'page' : undefined}
        className="group -ml-2 -my-2 sm:-mr-2 py-2 pl-2 sm:pr-2 flex items-center gap-3 sm:gap-6 rounded-full"
      >
        <KopwerkLogo className="h-7 w-7 sm:h-8 sm:w-8 shrink-0" />
        <span
          aria-hidden="true"
          className={cn(
            'hidden font-display font-bold text-sm tracking-wide-xl uppercase text-slate-900 dark:text-white',
            current !== '/' && 'sm:inline-flex'
          )}
        >
          <RollingText accentClassName="text-amber-700 dark:text-amber-400">Studio Kopwerk</RollingText>
        </span>
      </Link>

      <div className="flex items-center gap-3 sm:gap-8">
        {navItems.length > 0 && (
          <nav aria-label="Hoofdmenu">
            <ul className="flex items-center gap-3 min-[360px]:gap-4 sm:gap-8">
              {navItems.map(({ path, label }) => {
                const isCurrent = current === path;
                return (
                  <li key={path}>
                    <NavLink path={path} label={label} current={isCurrent} />
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        <ThemeToggle onToggle={onToggleTheme} />
      </div>
    </header>
  );
}

/**
 * A menu link (design system: Nav): the current page in ink, underlined in amber; the others quiet.
 * The underline is drawn beside the rolling text, which clips its own overflow.
 */
function NavLink({ path, label, current }: { path: string; label: string; current: boolean }) {
  return (
    <Link
      href={path}
      aria-current={current ? 'page' : undefined}
      className={cn(
        'group relative flex -mx-2 px-2 py-2 rounded-full text-xs font-semibold tracking-wide-xl uppercase transition-colors duration-500 ease-kopwerk',
        current
          ? 'text-slate-900 dark:text-white after:absolute after:inset-x-2 after:bottom-0.5 after:h-0.5 after:rounded-full after:bg-amber-500'
          : 'text-subtle dark:text-slate-400'
      )}
    >
      <RollingText accentClassName="text-amber-700 dark:text-amber-400">{label}</RollingText>
    </Link>
  );
}

// Below the first screen, scrolling up this far brings the compact bar back; scrolling down puts it away.
const SHOW_AFTER = 480;
const DELTA = 6;

/**
 * The frame moving along (design system: Nav, "On the website"): the header scrolls away with the page, and scrolling
 * back up brings a compact glass bar with the K, the pages and the call to action, outlined so the page's capsule stays
 * the one filled button. On phones there's room for the K and the button only. While hidden it is inert, so neither the
 * keyboard nor a screen reader meets it twice. Reduced motion: it appears without sliding.
 */
export function CompactNav() {
  const [location] = useLocation();
  const current = normalizePath(location);
  const { openContact, preloadContact } = useContact();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let pending = false;
    const update = () => {
      pending = false;
      const y = window.scrollY;
      if (y < SHOW_AFTER) setShown(false);
      else if (y < last - DELTA) setShown(true);
      else if (y > last + DELTA) setShown(false);
      if (Math.abs(y - last) > DELTA) last = y;
    };
    const handleScroll = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(update);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // A new page starts at the top, without the bar.
  useEffect(() => setShown(false), [location]);

  return (
    <div
      inert={!shown}
      aria-hidden={!shown}
      className={cn(
        'fixed inset-x-0 top-0 z-30 flex justify-center px-4 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pointer-events-none transition-[translate,opacity] duration-500 ease-kopwerk motion-reduce:transition-none',
        shown ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0'
      )}
    >
      <nav
        aria-label="Menu"
        className="pointer-events-auto flex items-center gap-2 sm:gap-6 rounded-full border border-slate-200/80 dark:border-slate-800 bg-white/75 dark:bg-kopwerk-dark/75 backdrop-blur-xl shadow-xl shadow-slate-900/5 dark:shadow-kopwerk-dark/40 py-1.5 pl-4 pr-1.5"
      >
        <Link href="/" aria-label="Studio Kopwerk, naar het begin" className="flex rounded-full p-1">
          <KopwerkLogo className="size-5" />
        </Link>
        {navItems.length > 0 && (
          <ul className="hidden sm:flex items-center gap-6">
            {navItems.map(({ path, label }) => (
              <li key={path}>
                <NavLink path={path} label={label} current={current === path} />
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          onClick={openContact}
          onPointerEnter={preloadContact}
          onFocus={preloadContact}
          aria-haspopup="dialog"
          className="group inline-flex items-center gap-2 rounded-full border border-slate-500 dark:border-slate-400 px-4 py-2.5 text-xs font-semibold tracking-wide-xl uppercase text-slate-900 dark:text-white transition-colors duration-300 ease-kopwerk hover:border-amber-600 dark:hover:border-amber-400 motion-reduce:transition-none"
        >
          <RollingText accentClassName="text-amber-700 dark:text-amber-400">Vertel waar het knelt</RollingText>
          <Icon name="arrow-up-right" className="size-4" />
        </button>
      </nav>
    </div>
  );
}
