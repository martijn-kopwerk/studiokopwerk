import { ThemeToggle } from '../ThemeToggle';
import { ResolvedTheme } from '../../types';
import { KopwerkLogo } from '../ui/KopwerkLogo';

export function Header({
  resolvedTheme,
  onToggleTheme,
}: {
  resolvedTheme: ResolvedTheme;
  onToggleTheme: () => void;
}) {
  return (
    <header
      id="main-header"
      className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 py-6 flex items-center justify-between shrink-0"
    >
      {/* Brand mark on every screen size */}
      <KopwerkLogo className="h-7 w-7 sm:h-8 sm:w-8" />

      <ThemeToggle resolvedTheme={resolvedTheme} onToggle={onToggleTheme} />
    </header>
  );
}
