import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { RollingText } from './RollingText';
import { cn } from '../../lib/utils';

/**
 * The quiet way on to the next page: small uppercase words and an arrow, never a second button.
 * A page ends with one call to action and at most one of these.
 */
export function NextLink({ href, children, className }: { href: string; children: string; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center gap-3 -mx-1 px-1 py-1 rounded-md text-xs font-semibold tracking-wide-xl uppercase text-slate-700 dark:text-slate-300 outline-none focus-visible:ring-4 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-kopwerk-dark',
        className
      )}
    >
      <RollingText accentClassName="text-amber-700 dark:text-amber-400">{children}</RollingText>
      <ArrowRight
        aria-hidden="true"
        className="size-4 transition-transform duration-500 ease-kopwerk group-hover:translate-x-1 group-hover:text-amber-700 dark:group-hover:text-amber-400 motion-reduce:transition-none"
      />
    </Link>
  );
}
