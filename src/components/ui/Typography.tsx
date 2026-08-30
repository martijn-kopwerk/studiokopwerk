import React from 'react';
import { cn } from '../../lib/utils';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'eyebrow' | 'lead' | 'body' | 'subtext' | 'small';
  as?: React.ElementType;
  children?: React.ReactNode;
  className?: string;
  id?: string;
}

export function Typography({
  variant = 'body',
  as,
  className,
  children,
  ...props
}: TypographyProps) {
  const Component = as || defaultElement(variant);

  const baseStyles = {
    h1: "font-display font-light text-[clamp(2.5rem,10vw,7.5rem)] tracking-wide-md sm:tracking-wide-lg uppercase leading-none text-slate-900 dark:text-white whitespace-nowrap",
    h2: "font-display font-medium text-3xl sm:text-4xl md:text-5xl tracking-tight text-slate-900 dark:text-white",
    h3: "text-2xl font-semibold tracking-tight text-slate-900 dark:text-white",
    eyebrow: "text-xs sm:text-sm md:text-base font-medium tracking-super-wide sm:tracking-ultra-wide uppercase text-slate-500 dark:text-slate-400",
    lead: "text-lg sm:text-xl md:text-2xl lg:text-3xl font-light tracking-wide-sm text-slate-600 dark:text-slate-300",
    body: "text-base font-normal text-slate-700 dark:text-slate-300",
    subtext: "text-sm sm:text-base font-normal text-slate-500 dark:text-slate-400",
    small: "text-xs text-slate-400 dark:text-slate-500",
  };

  return (
    <Component className={cn(baseStyles[variant], className)} {...props}>
      {children}
    </Component>
  );
}

function defaultElement(variant: TypographyProps['variant']): React.ElementType {
  switch (variant) {
    case 'h1': return 'h1';
    case 'h2': return 'h2';
    case 'h3': return 'h3';
    case 'eyebrow': return 'span';
    case 'lead': return 'p';
    case 'body': return 'p';
    case 'subtext': return 'p';
    case 'small': return 'span';
    default: return 'p';
  }
}
