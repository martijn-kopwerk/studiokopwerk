import { Typography } from '../ui/Typography';

const kbd = 'inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-slate-300 dark:border-slate-700 px-1 font-sans text-[11px] font-semibold text-slate-600 dark:text-slate-300';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="main-footer"
      className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 py-6 sm:py-8 flex flex-col items-center justify-center gap-3 shrink-0"
    >
      {/* Keyboard shortcut hint: only for devices with a precise pointer (i.e. a keyboard-and-mouse setup) */}
      <p className="hidden pointer-fine:flex items-center gap-4 text-xs font-medium tracking-wide-xl uppercase text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-2"><kbd className={kbd}>C</kbd> Contact</span>
        <span aria-hidden="true">·</span>
        <span className="inline-flex items-center gap-2"><kbd className={kbd}>T</kbd> Thema</span>
      </p>
      <Typography variant="small" className="font-semibold tracking-wide-xl uppercase">
        © {currentYear} Studio Kopwerk
      </Typography>
    </footer>
  );
}
