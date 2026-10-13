import { hairline } from '../lib/raster';
import { cn } from '../lib/utils';

/**
 * The portrait: src/content/over/portret.(avif|webp|jpg|png), already graded black and white. No CSS filter
 * (the design system allows none), so amber stays the only warm point on the page. Until the file is there,
 * the frame shows where it goes.
 */
const portraitFiles = import.meta.glob<string>('../content/over/portret.{avif,webp,jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
});
const portrait = Object.values(portraitFiles)[0];

// What's in the photo, for people who can't see it.
const portraitAlt =
  'Zwart-witportret van Martijn: krullend haar, een gestreept overhemd, de armen over elkaar. Hij lacht naar de camera, voor een open stalen kast.';

/**
 * The design system's ImageFrame: radius-2xl, a 1px `line` hairline, portrait 4:5. The photo sits a little darker
 * on dark pages, never tinted. `className` sets its width; `priority` when it's the first thing on the page.
 */
export function Portret({ className, priority = false }: { className?: string; priority?: boolean }) {
  const frame = 'block w-full aspect-[4/5] rounded-2xl border overflow-hidden bg-slate-100 dark:bg-slate-900 ' + hairline;

  if (!portrait) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          frame,
          'flex items-center justify-center text-xs font-semibold tracking-wide-xl uppercase text-slate-600 dark:text-slate-400',
          className
        )}
      >
        [Foto]
      </div>
    );
  }

  return (
    <figure className={className}>
      <img
        src={portrait}
        alt={portraitAlt}
        width={800}
        height={1000}
        decoding="async"
        loading={priority ? undefined : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        className={cn(frame, 'object-cover dark:brightness-90')}
      />
    </figure>
  );
}
