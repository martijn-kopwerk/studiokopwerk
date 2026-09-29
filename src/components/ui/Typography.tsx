import React from 'react';
import { cn } from '../../lib/utils';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'eyebrow' | 'lead' | 'body' | 'subtext' | 'small';
  as?: React.ElementType;
  children?: React.ReactNode;
  className?: string;
  id?: string;
}

// Syne ships 400–800; 400 (font-normal) is its lightest weight.
const baseStyles = {
  h1: "font-display font-normal text-[clamp(2.5rem,10vw,7.5rem)] tracking-wide-md sm:tracking-wide-lg uppercase leading-none text-slate-900 dark:text-white whitespace-nowrap",
  h2: "font-display font-medium text-3xl sm:text-4xl md:text-5xl tracking-wide-md text-slate-900 dark:text-white",
  h3: "font-display text-2xl font-semibold tracking-wide-sm text-slate-900 dark:text-white",
  eyebrow: "text-xs sm:text-sm md:text-base font-medium tracking-super-wide sm:tracking-ultra-wide uppercase text-slate-500 dark:text-slate-400",
  lead: "text-lg sm:text-xl md:text-2xl lg:text-3xl font-light tracking-wide-sm text-slate-600 dark:text-slate-300",
  body: "text-base font-normal leading-relaxed text-slate-700 dark:text-slate-300",
  subtext: "text-sm sm:text-base font-normal text-slate-500 dark:text-slate-400",
  small: "text-xs text-slate-400 dark:text-slate-500",
};

const defaultElements: Record<NonNullable<TypographyProps['variant']>, React.ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  eyebrow: 'span',
  lead: 'p',
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
