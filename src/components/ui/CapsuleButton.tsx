import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { RollingText } from './RollingText';

type CapsuleButtonProps = React.ComponentProps<'button'> & {
  icon?: React.ComponentType<{ className?: string }>;
};

/**
 * The Studio Kopwerk primary CTA: an asymmetric capsule (wide label side, tight icon well)
 * with rolling text and contrast inversion of the icon well on hover.
 */
export function CapsuleButton({
  children,
  className,
  icon: Icon = ArrowUpRight,
  type = 'button',
  ...props
}: CapsuleButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'group relative inline-flex w-full sm:w-auto items-center justify-between sm:justify-start gap-6 rounded-full bg-slate-900 dark:bg-white pl-8 pr-2 py-2 shadow-xl shadow-slate-900/10 dark:shadow-kopwerk-dark/20 transition-transform duration-500 ease-kopwerk hover:scale-[1.02] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:scale-100 outline-none focus-visible:ring-4 focus-visible:ring-amber-500/80 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-kopwerk-dark',
        className
      )}
      {...props}
    >
      {/* Design system: a 14px uppercase label at 0.1em, beside a 40px arrow disc */}
      <RollingText
        className="text-sm font-medium tracking-wide-md uppercase text-white dark:text-slate-950"
        accentClassName="text-amber-400 dark:text-amber-700"
      >
        {children}
      </RollingText>
      <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20 dark:bg-slate-900/10 transition-colors duration-500 ease-kopwerk group-hover:bg-amber-500 group-focus-visible:bg-amber-500 dark:group-hover:bg-amber-400 dark:group-focus-visible:bg-amber-400 shrink-0">
        <Icon className="h-4 w-4 text-white dark:text-slate-950 transition-transform duration-500 ease-kopwerk group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-950 group-focus-visible:text-slate-950 motion-reduce:transition-none" />
      </span>
    </button>
  );
}
