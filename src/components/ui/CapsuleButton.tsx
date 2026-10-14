import React from 'react';
import { cn } from '../../lib/utils';
import { Icon, type IconName } from './Icon';
import { RollingText } from './RollingText';

type CapsuleButtonProps = {
  icon?: IconName;
  className?: string;
  children?: React.ReactNode;
} & (
  | ({ href?: undefined } & React.ComponentProps<'button'>)
  | ({ href: string } & React.ComponentProps<'a'>)
);

const capsule =
  'group relative inline-flex w-full sm:w-auto items-center justify-between sm:justify-start gap-4 sm:gap-6 rounded-full bg-slate-900 dark:bg-white pl-8 pr-2 py-2 shadow-xl shadow-slate-900/10 dark:shadow-kopwerk-dark/20 transition-transform duration-500 ease-kopwerk hover:scale-[1.02] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:scale-100';

/**
 * The Studio Kopwerk primary CTA: an asymmetric capsule (wide label side, tight icon well)
 * with rolling text and contrast inversion of the icon well on hover. A button, or a link when it has an `href`
 * (the mail with a chosen friction in its subject).
 */
export function CapsuleButton({ children, className, icon = 'arrow-up-right', ...props }: CapsuleButtonProps) {
  const content = (
    <>
      {/* Design system: a 14px uppercase label at 0.1em, beside a 40px arrow disc (a little closer on phones, so
          "Vertel waar het knelt" stays on one line at 375px). Narrower still, it breaks into two even lines. */}
      <RollingText
        className="text-sm font-medium tracking-wide-md uppercase text-balance text-white dark:text-slate-950"
        accentClassName="text-amber-400 dark:text-amber-700"
      >
        {children}
      </RollingText>
      <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20 dark:bg-slate-900/10 transition-colors duration-500 ease-kopwerk group-hover:bg-amber-500 group-focus-visible:bg-amber-500 dark:group-hover:bg-amber-400 dark:group-focus-visible:bg-amber-400 shrink-0">
        <Icon
          name={icon}
          className="h-4 w-4 text-white dark:text-slate-950 transition-transform duration-500 ease-kopwerk group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-950 group-focus-visible:text-slate-950 motion-reduce:transition-none"
        />
      </span>
    </>
  );

  if (props.href !== undefined) {
    return (
      <a className={cn(capsule, className)} {...(props as React.ComponentProps<'a'>)}>
        {content}
      </a>
    );
  }
  const { type = 'button', ...rest } = props as React.ComponentProps<'button'>;
  return (
    <button type={type} className={cn(capsule, className)} {...rest}>
      {content}
    </button>
  );
}
