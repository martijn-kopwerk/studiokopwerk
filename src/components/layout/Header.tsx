import { ThemeToggle } from '../ThemeToggle';
import { ThemeMode, ResolvedTheme } from '../../types';
import { MagneticWrapper } from '../ui/MagneticWrapper';

export function Header({
  themeMode,
  resolvedTheme,
  onThemeChange,
  onContactClick,
  onContactIntent,
}: {
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  onThemeChange: (mode: ThemeMode) => void;
  onContactClick: () => void;
  onContactIntent?: () => void;
}) {
  return (
    <header
      id="main-header"
      className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 py-6 flex items-center justify-between shrink-0"
    >
      {/* Left side: The Dot (Hidden on mobile to reduce cognitive load, user can click main CTA) */}
      <div className="hidden md:flex items-center gap-2">
        <MagneticWrapper strength={0.4}>
          <button
            type="button"
            onClick={onContactClick}
            onPointerEnter={onContactIntent}
            onFocus={onContactIntent}
            className="group relative flex items-center justify-center w-10 h-10 outline-none rounded-full focus-visible:ring-4 focus-visible:ring-amber-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-kopwerk-dark"
            aria-label="Samenwerken met Studio Kopwerk"
          >
            {/* Subtle pulsing ring (smooth & slow, off for reduced motion) */}
            <span
              aria-hidden="true"
              className="absolute w-3 h-3 rounded-full bg-amber-500/60 opacity-0 motion-safe:animate-pulse-ring group-hover:hidden pointer-events-none"
            />

            {/* The Dot */}
            <span className="relative w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)] group-hover:scale-150 group-hover:shadow-[0_0_24px_rgba(245,158,11,1)] group-focus-visible:scale-150 group-active:scale-90 transition-all duration-500 ease-kopwerk" />

            {/* Tooltip / Expand text */}
            <span
              aria-hidden="true"
              className="absolute left-full ml-4 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 -translate-x-4 group-hover:translate-x-0 group-focus-visible:translate-x-0 transition-all duration-500 ease-kopwerk text-xs font-semibold tracking-wide-xl uppercase text-amber-600 dark:text-amber-400 whitespace-nowrap pointer-events-none"
            >
              Samenwerken
            </span>
          </button>
        </MagneticWrapper>
      </div>

      <div className="flex items-center gap-6 ml-auto">
        <ThemeToggle
          themeMode={themeMode}
          resolvedTheme={resolvedTheme}
          onThemeChange={onThemeChange}
        />
      </div>
    </header>
  );
}
