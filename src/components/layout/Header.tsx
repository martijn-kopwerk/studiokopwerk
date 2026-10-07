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
      {/* The design system's lock-up: the K and the wordmark, the way home from every other page.
          On home the hero already says the name, so the K stands alone there. Phones keep the bare K everywhere
          (the wordmark doesn't fit beside the menu); its stem is where the drawing grows from. On wider screens the K
          stands in the dot's margin and the wordmark starts on the text line (src/lib/raster.ts). */}
      <Link
        href="/"
        aria-label="Studio Kopwerk, naar home"
        aria-current={current === '/' ? 'page' : undefined}
        className="group -m-2 p-2 flex items-center gap-3 sm:gap-6 rounded-lg"
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
                        'group flex -mx-2 px-2 py-2 rounded-full text-xs font-semibold tracking-wide-xl uppercase transition-colors duration-500 ease-kopwerk',
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
