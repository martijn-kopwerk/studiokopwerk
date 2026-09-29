import { cn } from '../../lib/utils';

/**
 * The Studio Kopwerk mark: an architectural K with the amber dot at its vertex.
 * Strokes follow the text colour (currentColor), so it adapts to light and dark mode.
 * Decorative by default: the page heading already names the studio.
 */
export function KopwerkLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      focusable="false"
      className={cn('overflow-visible text-slate-900 dark:text-slate-50', className)}
    >
      <g fill="none" stroke="currentColor" strokeWidth="20" strokeLinecap="square" strokeLinejoin="miter">
        <polyline points="30,20 30,100" />
        <polyline points="94,20 40,60 94,100" />
      </g>
      {/* The pulse of Kopwerk: a slow ring around the dot, off for reduced motion */}
      <circle
        cx="37"
        cy="60"
        r="14"
        className="fill-amber-500/60 opacity-0 [transform-box:fill-box] origin-center [--pulse-scale:2.4] motion-safe:animate-pulse-ring"
      />
      <circle cx="37" cy="60" r="14" className="fill-amber-500" />
    </svg>
  );
}
