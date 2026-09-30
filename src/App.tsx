import { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react';
import { LazyMotion, MotionConfig } from 'motion/react';
import { useLocation } from 'wouter';
import { useTheme } from './hooks/useTheme';
import { ContactContext } from './hooks/useContact';
import { usePageChange } from './hooks/usePageChange';
import { AbstractBackground } from './components/AbstractBackground';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { contactEmail, mailtoHref } from './lib/contact';
import { siteUrl } from './lib/head';
import { findRoute } from './routes';

const loadMotionFeatures = () => import('./lib/motion-features').then((m) => m.default);

// The contact card (and its dialog dependencies) is fetched on first intent: hover, focus or open.
const loadContactCard = () => import('./components/ContactCard');
const ContactCard = lazy(() => loadContactCard().then((m) => ({ default: m.ContactCard })));

const openMail = () => {
  window.location.href = mailtoHref();
};

/**
 * The frame that stays put while pages change: the drafting-table background, header, footer and contact card.
 * Only the page inside it is swapped, so the background never redraws on navigation.
 */
export default function App() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const route = findRoute(location);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isContactMounted, setIsContactMounted] = useState(false);
  // Set when the contact card can't load (offline, or a stale tab after a deploy).
  // The call to action then goes straight to the mail app instead of opening the card.
  const [isContactUnavailable, setIsContactUnavailable] = useState(false);

  usePageChange(route.meta, siteUrl);

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

  const contactActions = useMemo(() => ({ openContact, preloadContact }), [openContact, preloadContact]);

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

          <Header onToggleTheme={toggleTheme} />

          <ContactContext.Provider value={contactActions}>
            {/* Keyed by path so each page plays its entrance again */}
            <route.Page key={route.meta.path} />
          </ContactContext.Provider>

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
