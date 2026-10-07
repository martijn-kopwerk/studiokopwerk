import { Link, useLocation } from 'wouter';
import { ThemeToggle } from '../ThemeToggle';
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
      {/* Brand mark on every screen size; it leads home from every other page */}
      <Link
        href="/"
        aria-label="Studio Kopwerk, naar home"
        className="-m-2 p-2 rounded-lg outline-none focus-visible:ring-4 focus-visible:ring-amber-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-kopwerk-dark"
      >
        <KopwerkLogo className="h-7 w-7 sm:h-8 sm:w-8" />
      </Link>

      <div className="flex items-center gap-5 sm:gap-8">
        {navItems.length > 0 && (
          <nav aria-label="Hoofdmenu">
            <ul className="flex items-center gap-5 sm:gap-8">
              {navItems.map(({ path, label }) => {
                const isCurrent = current === path;
                return (
                  <li key={path}>
                    {/* The current page stands out in ink, the others are quiet; amber stays for the dot on the drawing */}
                    <Link
                      href={path}
                      aria-current={isCurrent ? 'page' : undefined}
                      className={cn(
                        'group flex -mx-2 px-2 py-2 rounded-full text-xs font-semibold tracking-wide-xl uppercase transition-colors duration-500 ease-kopwerk outline-none focus-visible:ring-4 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-kopwerk-dark',
                        isCurrent ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                      )}
                    >
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
