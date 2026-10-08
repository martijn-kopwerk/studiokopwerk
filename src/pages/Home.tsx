import { Typography } from '../components/ui/Typography';
import { MagneticWrapper } from '../components/ui/MagneticWrapper';
import { CapsuleButton } from '../components/ui/CapsuleButton';
import { useContact } from '../hooks/useContact';

// One screen, one message, one action. The way on to Aanpak is in the header; the footer waits below the fold.
// Phones: the hero stands left, just right of the K's stem (which continues the header logo's stem),
// and leaves a gap above the button for the vertex and its amber dot. Wider screens: centred.
export function Home() {
  const { openContact, preloadContact } = useContact();

  return (
    <main
      id="hero-section"
      className="relative z-10 w-full max-w-7xl mx-auto pl-14 pr-6 sm:px-8 flex-1 min-h-[calc(100dvh-5rem)] sm:min-h-[calc(100dvh-5.5rem)] flex flex-col items-start sm:items-center justify-center text-left sm:text-center"
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
          Voor ondernemers en bedrijven die goed zijn in hun vak, maar vastlopen in het digitale eromheen. Wij maken
          het eenvoudig: hoe het werk loopt en de schermen, sites en tools die erbij horen.
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
    </main>
  );
}
