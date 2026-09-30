import type { Story } from '../../lib/stories';
import { cn } from '../../lib/utils';

const meta = 'text-xs font-semibold tracking-wide-xl uppercase text-slate-500 dark:text-slate-400';

/**
 * A story's teaser in its own form: a picture, a quote or one number.
 * `compact` is the small version shown inside a list row on phones.
 */
export function StoryPreview({ story, compact = false }: { story: Story; compact?: boolean }) {
  const preview = story.preview;

  if (preview.form === 'beeld') {
    return (
      <img
        src={preview.image}
        alt={compact ? '' : preview.alt}
        loading="lazy"
        decoding="async"
        className="block w-full aspect-[4/3] object-cover rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900"
      />
    );
  }

  if (preview.form === 'woorden') {
    return (
      <span className="flex flex-col gap-4">
        <span
          className={cn(
            'font-light tracking-wide-sm text-slate-600 dark:text-slate-300 text-pretty',
            compact ? 'text-lg leading-relaxed' : 'text-2xl xl:text-3xl leading-snug'
          )}
        >
          “{preview.quote}”
        </span>
        <span className={meta}>
          {preview.name}
          {preview.role && ` • ${preview.role}`}
        </span>
      </span>
    );
  }

  return (
    <span className="flex flex-col gap-3">
      <span
        className={cn(
          'font-display font-bold tracking-wide-lg leading-none text-slate-900 dark:text-white',
          compact ? 'text-5xl' : 'text-7xl xl:text-8xl'
        )}
      >
        {preview.value}
      </span>
      <span className={meta}>{preview.label}</span>
    </span>
  );
}
