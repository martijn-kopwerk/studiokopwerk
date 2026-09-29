import { Sun, Moon } from 'lucide-react';
import { cn } from '../lib/utils';
import { ResolvedTheme } from '../types';

interface ThemeToggleProps {
  resolvedTheme: ResolvedTheme;
  onToggle: () => void;
}

/**
 * A single round button: shows the theme you'll switch to (moon in light, sun in dark).
 * The icons turn over on the brand curve. Following the system is the default;
 * see useTheme().toggleTheme for how a manual choice is forgotten again.
 */
export function ThemeToggle({ resolvedTheme, onToggle }: ThemeToggleProps) {
  const isDark = resolvedTheme === 'dark';
  const label = isDark ? 'Schakel naar lichte weergave' : 'Schakel naar donkere weergave';
  const icon = 'absolute h-4 w-4 transition-[rotate,scale,opacity] duration-500 ease-kopwerk motion-reduce:transition-none';

  return (
    <button
      id="theme-toggle"
      type="button"
      onClick={onToggle}
      aria-label={label}
      title={label}
      className="group relative flex size-10 items-center justify-center rounded-full border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-xs text-slate-500 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-400 transition-colors duration-300 ease-kopwerk outline-none focus-visible:ring-4 focus-visible:ring-amber-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-kopwerk-dark"
    >
      <Moon aria-hidden="true" className={cn(icon, isDark ? '-rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100')} />
      <Sun aria-hidden="true" className={cn(icon, isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-50 opacity-0')} />
    </button>
  );
}
