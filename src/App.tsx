import { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { LazyMotion, MotionConfig } from 'motion/react';
import { useTheme } from './hooks/useTheme';
import { AbstractBackground } from './components/AbstractBackground';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Typography } from './components/ui/Typography';
import { MagneticWrapper } from './components/ui/MagneticWrapper';
import { CapsuleButton } from './components/ui/CapsuleButton';
import { ErrorBoundary } from './components/ErrorBoundary';
import { contactEmail, mailtoHref } from './lib/contact';

const loadMotionFeatures = () => import('./lib/motion-features').then((m) => m.default);

// The contact card (and its dialog dependencies) is fetched on first intent: hover, focus or open.
const loadContactCard = () => import('./components/ContactCard');
const ContactCard = lazy(() => loadContactCard().then((m) => ({ default: m.ContactCard })));

const openMail = () => {
  window.location.href = mailtoHref();
};

export default function App() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isContactMounted, setIsContactMounted] = useState(false);
  // Set when the contact card can't load (offline, or a stale tab after a deploy).
  // The call to action then goes straight to the mail app instead of opening the card.
  const [isContactUnavailable, setIsContactUnavailable] = useState(false);

  const openContact = useCallback(() => {
    if (isContactUnavailable) {
      openMail();
      return;
    }
    setIsContactMounted(true);
    setIsContactOpen(true);
  }, [isContactUnavailable]);

  const preloadContact = useCallback(() => {
    // A failed preload is handled when the card is opened (see the ErrorBoundary below).
    loadContactCard().catch(() => {});
  }, []);

  const handleContactError = useCallback(() => {
    setIsContactUnavailable(true);
    setIsContactOpen(false);
    openMail();
  }, []);

  // Keyboard shortcuts: C toggles contact, T toggles theme.
  // Ignored with modifiers (so Ctrl/Cmd+C still copies), on key repeat, and while typing.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const target = e.target;
      if (target instanceof HTMLElement && (target.isContentEditable || target.closest('input, textarea, select'))) {
        return;
      }
      const key = e.key.toLowerCase();
      if (key === 'c') {
        if (isContactUnavailable) {
          openMail();
          return;
        }
        setIsContactMounted(true);
        setIsContactOpen((prev) => !prev);
      } else if (key === 't') {
        toggleTheme();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTheme, isContactUnavailable]);

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadMotionFeatures} strict>
        <div
          id="kopwerk-app-root"
          className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden bg-slate-50 dark:bg-kopwerk-dark transition-colors duration-500 font-sans"
        >
          <AbstractBackground theme={resolvedTheme} />

          <Header resolvedTheme={resolvedTheme} onToggleTheme={toggleTheme} />

          <main
            id="hero-section"
            className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 flex-1 flex flex-col items-center justify-center text-center my-auto"
          >
            <div className="w-full space-y-5 sm:space-y-6 md:space-y-8 flex flex-col items-center justify-center motion-safe:animate-rise [--rise-from:20px] [--rise-scale:0.96]">
              <h1 id="hero-title" className="flex flex-col items-center gap-5 sm:gap-6 md:gap-8">
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
              className="mt-10 sm:mt-14 md:mt-16 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-6 sm:px-0 motion-safe:animate-rise [--rise-from:15px] [animation-delay:450ms]"
            >
              <MagneticWrapper>
                <CapsuleButton onClick={openContact} onPointerEnter={preloadContact} onFocus={preloadContact}>
                  Daag ons uit
                </CapsuleButton>
              </MagneticWrapper>
            </div>
          </main>

          <Footer />
          {isContactMounted && (
            <ErrorBoundary onError={handleContactError}>
              <Suspense fallback={null}>
                <ContactCard
                  isOpen={isContactOpen}
                  onClose={() => setIsContactOpen(false)}
                  email={contactEmail}
                />
              </Suspense>
            </ErrorBoundary>
          )}
        </div>
      </LazyMotion>
    </MotionConfig>
  );
}
