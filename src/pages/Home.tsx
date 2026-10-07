import { useEffect, useRef, useState } from 'react';
import { Typography } from '../components/ui/Typography';
import { MagneticWrapper } from '../components/ui/MagneticWrapper';
import { CapsuleButton } from '../components/ui/CapsuleButton';
import { NextLink } from '../components/ui/NextLink';
import { useAmberDot } from '../hooks/useAmberDot';
import { useContact } from '../hooks/useContact';
import { steps } from '../lib/aanpak';

// Phones: the hero stands left, just right of the K's stem (which continues the header logo's stem),
// and leaves a gap above the button for the vertex and its amber dot. Wider screens: centred.
// The hero fills the first screen; below the fold a short preview of the aanpak gives a reason to scroll on.
export function Home() {
  const { openContact, preloadContact } = useContact();
  const preview = useRef<HTMLElement | null>(null);
  const previewMarker = useRef<HTMLSpanElement | null>(null);
  const [reading, setReading] = useState(false);

  // Once the preview reaches the middle of the screen the dot leaves the vertex and marks it, so it never floats over its text.
  useAmberDot(() => (reading ? previewMarker.current : null), reading, true);

  useEffect(() => {
    let pending = false;
    const update = () => {
      pending = false;
      const top = preview.current?.getBoundingClientRect().top;
      setReading(top !== undefined && top <= window.innerHeight / 2);
    };
    const schedule = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <main className="relative z-10 w-full max-w-7xl mx-auto pl-14 pr-6 sm:px-8 flex-1 flex flex-col">
      <section
        id="hero-section"
        className="min-h-[calc(100dvh-5rem)] sm:min-h-[calc(100dvh-5.5rem)] flex flex-col items-start sm:items-center justify-center text-left sm:text-center"
      >
        <div className="w-full space-y-5 sm:space-y-6 md:space-y-8 flex flex-col items-start sm:items-center justify-center motion-safe:animate-rise [--rise-from:20px] [--rise-scale:0.96]">
          <h1 id="hero-title" tabIndex={-1} className="flex flex-col items-start sm:items-center gap-4 sm:gap-6 md:gap-8 outline-none">
            <Typography
              as="span"
              variant="eyebrow"
              className="block motion-safe:animate-rise [--rise-from:-10px] [animation-delay:100ms]"
            >
              Studio
            </Typography>
            <Typography as="span" variant="h1" className="block text-[clamp(2.5rem,12vw,7.5rem)] sm:text-[clamp(2.5rem,10vw,7.5rem)]">
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
            Voor ondernemers en bedrijven die goed zijn in hun vak, maar vastlopen in van alles eromheen.
          </Typography>
        </div>

        {/* The gap where the background's K has its vertex on phones (read by AbstractBackground) */}
        <div data-tekentafel-vertex aria-hidden="true" className="h-20 sm:h-14 md:h-16 shrink-0" />

        <div
          id="hero-contact-trigger-wrapper"
          className="flex items-center justify-start sm:justify-center motion-safe:animate-rise [--rise-from:15px] [animation-delay:450ms]"
        >
          <MagneticWrapper>
            <CapsuleButton
              onClick={openContact}
              onPointerEnter={preloadContact}
              onFocus={preloadContact}
              className="w-auto"
            >
              Daag ons uit
            </CapsuleButton>
          </MagneticWrapper>
        </div>
      </section>

      {/* The way on: how we work in three steps, aligned with the pages' own column */}
      <section
        ref={preview}
        aria-labelledby="home-aanpak"
        className="sm:pl-16 py-20 sm:py-28 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-x-16"
      >
        <div className="flex flex-col gap-5">
          <p className="relative text-xs font-semibold tracking-wide-xl uppercase text-slate-500 dark:text-slate-400">
            <span
              ref={previewMarker}
              aria-hidden="true"
              className="absolute -left-8 sm:-left-10 top-[calc(0.5lh-0.4375rem)] size-3.5"
            />
            Aanpak
          </p>
          <Typography variant="h2" id="home-aanpak" className="text-balance leading-tight md:text-4xl xl:text-5xl">
            AI maakt, jij beslist
          </Typography>
        </div>
        <div className="flex flex-col items-start gap-10">
          <ol className="flex flex-col gap-5">
            {steps.map((step, index) => (
              <li key={step} className="flex items-baseline gap-5">
                <span className="font-display font-bold text-sm tracking-wide-lg text-slate-500 dark:text-slate-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-display font-medium text-xl sm:text-2xl leading-snug text-slate-900 dark:text-white">
                  {step}
                </span>
              </li>
            ))}
          </ol>
          <NextLink href="/aanpak">Lees hoe we werken</NextLink>
        </div>
      </section>
    </main>
  );
}
