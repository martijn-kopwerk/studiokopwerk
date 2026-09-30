import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { stories } from '../lib/stories';
import { Typography } from '../components/ui/Typography';
import { RollingText } from '../components/ui/RollingText';
import { MagneticWrapper } from '../components/ui/MagneticWrapper';
import { CapsuleButton } from '../components/ui/CapsuleButton';
import { useContact } from '../hooks/useContact';

export function Home() {
  const { openContact, preloadContact } = useContact();

  return (
    <main
      id="hero-section"
      className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 flex-1 flex flex-col items-center justify-center text-center my-auto"
    >
      <div className="w-full space-y-5 sm:space-y-6 md:space-y-8 flex flex-col items-center justify-center motion-safe:animate-rise [--rise-from:20px] [--rise-scale:0.96]">
        <h1 id="hero-title" tabIndex={-1} className="flex flex-col items-center gap-5 sm:gap-6 md:gap-8 outline-none">
          <Typography
            as="span"
            variant="eyebrow"
            className="block motion-safe:animate-rise [--rise-from:-10px] [animation-delay:100ms]"
          >
            Studio
          </Typography>
          <Typography as="span" variant="h1" className="block">
            Kopwerk
          </Typography>
        </h1>

        <Typography
          variant="lead"
          id="hero-tagline"
          className="motion-safe:animate-rise [--rise-from:10px] [animation-delay:250ms]"
        >
          Zien wat <em className="italic font-normal">wérkt</em>.
        </Typography>

        <Typography
          variant="subtext"
          id="hero-mission"
          className="max-w-[17rem] sm:max-w-md leading-relaxed tracking-wide-sm text-balance motion-safe:animate-rise [--rise-from:10px] [animation-delay:350ms]"
        >
          Wij helpen iedereen om mooiere en fijnere ervaringen te maken, op welk vlak dan ook.
        </Typography>
      </div>

      <div
        id="hero-contact-trigger-wrapper"
        className="mt-10 sm:mt-14 md:mt-16 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 w-full sm:w-auto px-6 sm:px-0 motion-safe:animate-rise [--rise-from:15px] [animation-delay:450ms]"
      >
        <MagneticWrapper>
          <CapsuleButton onClick={openContact} onPointerEnter={preloadContact} onFocus={preloadContact}>
            Daag ons uit
          </CapsuleButton>
        </MagneticWrapper>
        {stories.length > 0 && (
          <Link
            href="/werk"
            className="group inline-flex items-center gap-3 min-h-11 px-2 text-sm sm:text-base font-medium tracking-wide-sm text-slate-900 dark:text-white rounded-md outline-none focus-visible:ring-4 focus-visible:ring-amber-500/50 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-kopwerk-dark"
          >
            <RollingText accentClassName="text-amber-700 dark:text-amber-400">Bekijk wat wérkt</RollingText>
            <ArrowRight
              className="w-5 h-5 transition-transform duration-500 ease-kopwerk group-hover:translate-x-1 group-hover:text-amber-700 dark:group-hover:text-amber-400 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </Link>
        )}
      </div>
    </main>
  );
}
