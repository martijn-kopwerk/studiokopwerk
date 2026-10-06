import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { Typography } from '../components/ui/Typography';
import { RollingText } from '../components/ui/RollingText';

export function NotFound() {
  return (
    <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 flex-1 flex flex-col items-center justify-center text-center my-auto">
      <div className="flex flex-col items-center gap-5 sm:gap-6 motion-safe:animate-rise [--rise-from:20px]">
        <Typography variant="eyebrow">404</Typography>
        <h1 tabIndex={-1} className="font-display font-normal text-4xl sm:text-6xl tracking-wide-md uppercase leading-none text-slate-900 dark:text-white outline-none">
          Hier is niets
        </h1>
        <Typography variant="lead">
          Deze pagina bestaat niet <em className="italic font-normal">(meer)</em>.
        </Typography>
        <Link
          href="/"
          className="group mt-6 inline-flex items-center gap-3 text-lg font-medium text-slate-900 dark:text-white outline-none rounded-md focus-visible:ring-4 focus-visible:ring-amber-500/50 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-kopwerk-dark"
        >
          <ArrowLeft
            className="w-5 h-5 transition-transform duration-500 ease-kopwerk group-hover:-translate-x-1 group-hover:text-amber-700 dark:group-hover:text-amber-400 motion-reduce:transition-none"
            aria-hidden="true"
          />
          <RollingText accentClassName="text-amber-700 dark:text-amber-400">Terug naar home</RollingText>
        </Link>
      </div>
    </main>
  );
}
