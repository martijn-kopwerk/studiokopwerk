import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Brand micro-interaction: the label rolls up and an accent copy rolls in on hover or keyboard focus.
 * The parent interactive element must carry the `group` class.
 * The duplicate is aria-hidden, so screen readers announce the label once.
 */
export function RollingText({
  children,
  className,
  accentClassName,
}: {
  children: React.ReactNode;
  className?: string;
  accentClassName?: string;
}) {
  const roll = 'inline-block transition-transform duration-500 ease-kopwerk motion-reduce:transition-none';

  return (
    <span className={cn('relative inline-block overflow-hidden align-bottom', className)}>
      <span className={cn(roll, 'group-hover:-translate-y-full group-focus-visible:-translate-y-full')}>
        {children}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          roll,
          'absolute left-0 top-0 translate-y-full group-hover:translate-y-0 group-focus-visible:translate-y-0',
          accentClassName
        )}
      >
        {children}
      </span>
    </span>
  );
}

/**
 * Rolling text letter by letter, for one large line (the footer's mail address): each letter rolls a moment after
 * the one before, so the word turns over like a wave. Decorative: the parent carries the accessible name.
 */
export function RollingLetters({ text, accentClassName }: { text: string; accentClassName?: string }) {
  const roll =
    'inline-block transition-transform duration-500 ease-kopwerk motion-reduce:transition-none [transition-delay:calc(var(--i)*14ms)]';
  return (
    <span aria-hidden="true" className="inline-flex">
      {[...text].map((letter, index) => (
        <span
          key={index}
          style={{ '--i': index } as React.CSSProperties}
          className="relative inline-block overflow-hidden align-bottom leading-[1.1]"
        >
          <span className={cn(roll, 'group-hover:-translate-y-full group-focus-visible:-translate-y-full')}>{letter}</span>
          <span
            className={cn(
              roll,
              'absolute left-0 top-0 translate-y-full group-hover:translate-y-0 group-focus-visible:translate-y-0',
              accentClassName
            )}
          >
            {letter}
          </span>
        </span>
      ))}
    </span>
  );
}
