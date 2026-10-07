/**
 * The site's one grid. Everything starts on the same two lines: the text line (right of the dot's margin on wider
 * screens, right of the K's stem on phones) and, from `lg`, the second column at 2:3, as the design system sets
 * a heading beside its explanation. Pages and the footer use these, so nothing invents its own column.
 */
export const raster = 'grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-x-16';

// A 1px `line` hairline, between rows and between sections.
export const hairline = 'border-slate-200 dark:border-slate-800';

// One style for every list on a page: a row between hairlines, set in Syne at list size.
export const row = `py-4 border-t ${hairline} font-display font-medium text-lg sm:text-xl leading-snug text-pretty text-slate-900 dark:text-white`;
