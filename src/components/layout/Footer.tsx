import React from 'react';
import { Typography } from '../ui/Typography';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer
      id="main-footer"
      className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 py-6 sm:py-8 flex flex-col items-center justify-center gap-2 shrink-0"
    >
      <div>
        <Typography variant="small" className="text-slate-500 dark:text-slate-400 font-semibold tracking-wide uppercase text-[10px] sm:text-[11px]">
          © {currentYear} STUDIO KOPWERK
        </Typography>
      </div>
    </footer>
  );
}
