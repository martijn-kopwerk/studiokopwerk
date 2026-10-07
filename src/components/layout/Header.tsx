import { Link, useLocation } from 'wouter';
import { ThemeToggle } from '../ThemeToggle';
import { KopwerkLogo } from '../ui/KopwerkLogo';
import { RollingText } from '../ui/RollingText';
import { normalizePath, routes } from '../../routes';
import { cn } from '../../lib/utils';

// Short single words, in this order. A page only shows up once its route exists (no /werk without opdrachten).
const navLabels: Record<string, string> = { '/werk': 'Werk', '/over': 'Over' };
const navItems = Object.entries(navLabels).filter(([path]) => routes.some((route) => route.meta.path === path));

export function Header({ onToggleTheme }: { onToggleTheme: () => void }) {
  const [location] = useLocation();
  const current = normalizePath(location);

  return (
    <header
      id="main-header"
      className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 py-6 flex items-center justify-between shrink-0"
    >
      {/* Brand mark on every screen size; it leads home from every other page */}
      <Link
        href="/"
        aria-label="Studio Kopwerk, naar home"
        className="-m-2 p-2 rounded-lg outline-none focus-visible:ring-4 focus-visible:ring-amber-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-kopwerk-dark"
      >
        <KopwerkLogo className="h-7 w-7 sm:h-8 sm:w-8" />
      </Link>

      <div className="flex items-center gap-4 sm:gap-8">
        {navItems.length > 0 && (
          <nav aria-label="Hoofdmenu">
            <ul className="flex items-center gap-4 sm:gap-8">
              {navItems.map(([path, label]) => {
                const isCurrent = current === path;
                return (
                  <li key={path}>
                    <Link
                      href={path}
                      aria-current={isCurrent ? 'page' : undefined}
                      className={cn(
                        'group relative flex items-center -mx-2 px-2 py-2 rounded-full text-xs font-semibold tracking-wide-xl uppercase transition-colors duration-500 ease-kopwerk outline-none focus-visible:ring-4 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-kopwerk-dark',
                        isCurrent ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                      )}
                    >
                      {/* Amber means "where you are now": a small dot before the current page, in the link's own left padding */}
                      {isCurrent && (
                        <span
                          aria-hidden="true"
                          className="absolute -left-1 size-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] motion-safe:animate-rise [--rise-from:0px] [--rise-scale:0]"
                        />
                      )}
                      <RollingText accentClassName="text-amber-700 dark:text-amber-400">{label}</RollingText>
                    </Link>
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
