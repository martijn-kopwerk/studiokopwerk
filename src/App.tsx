import { useState, useCallback, useMemo, Suspense, lazy } from 'react';
import { LazyMotion, MotionConfig } from 'motion/react';
import { useLocation } from 'wouter';
import { useTheme } from './hooks/useTheme';
import { ContactContext } from './hooks/useContact';
import { AmberDotContext, type DotTarget } from './hooks/useAmberDot';
import { usePageChange } from './hooks/usePageChange';
import { AbstractBackground } from './components/AbstractBackground';
import { CompactNav, Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { mailtoHref } from './lib/contact';
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
  const [dotTarget, setDotTarget] = useState<DotTarget | null>(null);
  // The footer takes the dot over from the page while it's in view.
  const [footerDotTarget, setFooterDotTarget] = useState<DotTarget | null>(null);

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

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadMotionFeatures} strict>
        <div
          id="kopwerk-app-root"
          className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden bg-slate-50 dark:bg-kopwerk-dark transition-colors duration-500 font-sans"
        >
          <AbstractBackground theme={resolvedTheme} dotTarget={footerDotTarget ?? dotTarget} page={route.meta.path} />

          {/* The first stop for the keyboard: past the menu, straight to the page. Hidden until it has focus. */}
          <a
            href="#inhoud"
            className="absolute left-4 top-4 z-50 -translate-y-24 focus:translate-y-0 rounded-full bg-slate-900 dark:bg-white px-5 py-3 text-xs font-semibold tracking-wide-xl uppercase text-white dark:text-slate-950 transition-transform duration-500 ease-kopwerk motion-reduce:transition-none"
          >
            Naar de inhoud
          </a>

          <ContactContext.Provider value={contactActions}>
            <Header onToggleTheme={toggleTheme} />
            <CompactNav />

            <AmberDotContext.Provider value={setDotTarget}>
              {/* Keyed by path so each page plays its entrance again */}
              <route.Page key={route.meta.path} />
            </AmberDotContext.Provider>

            {/* Inside the contact provider: the footer's address opens the same contact card */}
            <Footer slot={route.slot} onDotTarget={setFooterDotTarget} />
          </ContactContext.Provider>
          {isContactMounted && (
            <ErrorBoundary onError={handleContactError}>
              <Suspense fallback={null}>
                <ContactCard
                  isOpen={isContactOpen}
                  onClose={() => setIsContactOpen(false)}
                />
              </Suspense>
            </ErrorBoundary>
          )}
        </div>
      </LazyMotion>
    </MotionConfig>
  );
}
