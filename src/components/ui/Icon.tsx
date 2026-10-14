import type { SVGProps } from 'react';
import { cn } from '../../lib/utils';

// The design system's Kopwerk line icons (`Icon`): a 24px grid, 1.5px stroke, square caps and mitre joins, the
// same construction as the K. The paths are the design system's, so the site never needs a third-party icon set.
const icons = {
  'arrow-up-right': ['M7 17 L17 7', 'M8 7 H17 V16'],
  'arrow-right': ['M4 12 H20', 'M14 6 L20 12 L14 18'],
  'arrow-left': ['M20 12 H4', 'M10 6 L4 12 L10 18'],
  'chevron-left': ['M15 6 L9 12 L15 18'],
  'chevron-right': ['M9 6 L15 12 L9 18'],
  'corner-down-right': ['M6 4 V14 H19', 'M15 10 L19 14 L15 18'],
  check: ['M5 12.5 L10 17.5 L19 7'],
  close: ['M6 6 L18 18', 'M18 6 L6 18'],
  copy: ['M8.5 8.5 H19.5 V19.5 H8.5 Z', 'M15.5 8.5 V4.5 H4.5 V15.5 H8.5'],
  play: ['M8 5 L19 12 L8 19 Z'],
  pause: ['M9 6 V18', 'M15 6 V18'],
  loop: ['M19 12 A7 7 0 1 1 16.95 7.05', 'M17 2.5 V7 H12.5'],
  restart: ['M5 12 A7 7 0 1 0 7.05 7.05', 'M7 2.5 V7 H11.5'],
  eraser: ['M14 4.5 L20 10.5 L11 19.5 H6.5 L3.5 16.5 Z', 'M9 9.5 L15 15.5', 'M11 19.5 H20'],
  sun: [
    'M16 12 A4 4 0 1 1 8 12 A4 4 0 1 1 16 12 Z',
    'M12 2.5 V4.5',
    'M12 19.5 V21.5',
    'M2.5 12 H4.5',
    'M19.5 12 H21.5',
    'M5.3 5.3 L6.7 6.7',
    'M17.3 17.3 L18.7 18.7',
    'M5.3 18.7 L6.7 17.3',
    'M17.3 6.7 L18.7 5.3',
  ],
  moon: ['M19.5 14.5 A8 8 0 1 1 9.5 4.5 A6.5 6.5 0 0 0 19.5 14.5 Z'],
} as const;

export type IconName = keyof typeof icons;

/**
 * A Kopwerk line icon in the text colour. Decorative by default (`aria-hidden`); icons support a word, they never
 * replace one. Size it with a `size-*` class: 16px beside small labels, 20px beside body text.
 */
export function Icon({ name, className, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      className={cn('size-4 shrink-0', className)}
      {...props}
    >
      {icons[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
