import React from 'react';
import { cn } from '../../lib/utils';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'display' | 'h1' | 'h2' | 'h3' | 'eyebrow' | 'lead' | 'sublead' | 'body' | 'subtext' | 'small';
  as?: React.ElementType;
  children?: React.ReactNode;
  className?: string;
  id?: string;
}

// Syne ships 400–800; 400 (font-normal) is its lightest weight.
const baseStyles = {
  // One statement per page, a line from the positionering (design system: `display`). Never a title.
  display: "font-display font-medium text-display tracking-display text-slate-900 dark:text-white text-balance",
  h1: "font-display font-normal text-[clamp(2.5rem,10vw,7.5rem)] tracking-wide-md sm:tracking-wide-lg uppercase leading-none text-slate-900 dark:text-white whitespace-nowrap",
  h2: "font-display font-medium text-2xl sm:text-4xl leading-8 sm:leading-10 tracking-heading text-slate-900 dark:text-white",
  h3: "font-display text-2xl font-semibold tracking-wide-sm text-slate-900 dark:text-white",
  eyebrow: "text-xs sm:text-sm font-medium tracking-super-wide sm:tracking-ultra-wide uppercase text-subtle dark:text-slate-400",
  lead: "text-lg sm:text-xl md:text-2xl lg:text-3xl font-light tracking-wide-sm text-slate-600 dark:text-slate-300",
  // The second step under a hero lead: what you get, after who it is for (design system: `sublead`).
  sublead: "text-base sm:text-lg leading-relaxed tracking-sublead text-subtle dark:text-slate-400",
  body: "text-base font-normal leading-relaxed text-slate-700 dark:text-slate-300",
  subtext: "text-sm sm:text-base font-normal text-subtle dark:text-slate-400",
  small: "text-xs text-subtle dark:text-slate-400",
};

const defaultElements: Record<NonNullable<TypographyProps['variant']>, React.ElementType> = {
  display: 'p',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  eyebrow: 'span',
  lead: 'p',
  sublead: 'p',
  body: 'p',
  subtext: 'p',
  small: 'span',
};

export function Typography({
  variant = 'body',
  as,
  className,
  children,
  ...props
}: TypographyProps) {
  const Component = as || defaultElements[variant];

  return (
    <Component className={cn(baseStyles[variant], className)} {...props}>
      {children}
    </Component>
  );
}
