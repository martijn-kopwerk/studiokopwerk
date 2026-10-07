import { Sun, Moon } from 'lucide-react';
import { cn } from '../lib/utils';

interface ThemeToggleProps {
  onToggle: () => void;
}

/**
 * A single round button: shows the theme you'll switch to (moon in light, sun in dark).
 * The icons turn over on the brand curve. Dark first: the site is dark unless the system asks for light;
 * see useTheme().toggleTheme for how a manual choice is forgotten again.
 * Icons and label follow the `dark` class (set before first paint by theme-init.js), not React state,
 * so the prerendered markup is the same for every visitor.
 */
export function ThemeToggle({ onToggle }: ThemeToggleProps) {
  const icon = 'absolute h-4 w-4 transition-[rotate,scale,opacity] duration-500 ease-kopwerk motion-reduce:transition-none';

  return (
    <button
      id="theme-toggle"
      type="button"
      onClick={onToggle}
      className="group relative flex size-10 items-center justify-center rounded-full border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-xs text-slate-500 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-400 transition-colors duration-300 ease-kopwerk"
    >
      <span className="sr-only dark:hidden">Schakel naar donkere weergave</span>
      <span className="sr-only hidden dark:inline">Schakel naar lichte weergave</span>
      <Moon aria-hidden="true" className={cn(icon, 'rotate-0 scale-100 opacity-100 dark:-rotate-90 dark:scale-50 dark:opacity-0')} />
      <Sun aria-hidden="true" className={cn(icon, 'rotate-90 scale-50 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100')} />
    </button>
  );
}
