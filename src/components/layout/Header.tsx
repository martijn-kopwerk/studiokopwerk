import { Link } from 'wouter';
import { ThemeToggle } from '../ThemeToggle';
import { KopwerkLogo } from '../ui/KopwerkLogo';

export function Header({ onToggleTheme }: { onToggleTheme: () => void }) {
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

      <ThemeToggle onToggle={onToggleTheme} />
    </header>
  );
}
