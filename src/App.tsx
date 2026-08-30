/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useTheme } from './hooks/useTheme';
import { AbstractBackground } from './components/AbstractBackground';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Typography } from './components/ui/Typography';
import { Button } from './components/ui/button';
import { MagneticWrapper } from './components/ui/MagneticWrapper';

// Lazy load the heavy ContactCard (and its Dialog dependencies)
const ContactCard = lazy(() => import('./components/ContactCard').then(m => ({ default: m.ContactCard })));

export default function App() {
  const { themeMode, resolvedTheme, setThemeMode } = useTheme();
  const [isContactOpen, setIsContactOpen] = useState(false);

  const contactEmail = 'hallo@studiokopwerk.nl';

  // Keyboard shortcut support (C for contact, T for theme toggle)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'c' || e.key === 'C') {
        setIsContactOpen((prev) => !prev);
      }
      if (e.key === 't' || e.key === 'T') {
        setThemeMode(resolvedTheme === 'dark' ? 'light' : 'dark');
      }
      if (e.key === 'Escape' && isContactOpen) {
        setIsContactOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isContactOpen, resolvedTheme, setThemeMode]);

  return (
    <div
      id="kopwerk-app-root"
      className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden bg-slate-50 dark:bg-kopwerk-dark transition-colors duration-500 font-sans select-none"
    >
      <AbstractBackground theme={resolvedTheme} />

      <Header
        themeMode={themeMode}
        resolvedTheme={resolvedTheme}
        onThemeChange={setThemeMode}
        onContactClick={() => setIsContactOpen(true)}
      />

      <main
        id="hero-section"
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 flex-1 flex flex-col items-center justify-center text-center my-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full space-y-5 sm:space-y-6 md:space-y-8 flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Typography variant="eyebrow">STUDIO</Typography>
          </motion.div>

          <Typography variant="h1" id="hero-title">
            KOPWERK
          </Typography>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
          >
            <Typography variant="lead" id="hero-tagline">
              Zien wat <em className="italic font-normal">wérkt</em>.
            </Typography>
          </motion.div>
          

        </motion.div>

        <motion.div
          id="hero-contact-trigger-wrapper"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
          className="mt-10 sm:mt-14 md:mt-16 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 transition-all duration-300 w-full sm:w-auto px-6 sm:px-0"
        >
          <MagneticWrapper>
            <button
              onClick={() => setIsContactOpen(true)}
              className="group relative inline-flex w-full sm:w-auto items-center justify-between sm:justify-start gap-6 rounded-full bg-slate-900 dark:bg-white pl-8 pr-2 py-2 shadow-xl shadow-slate-900/10 dark:shadow-black/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] outline-none focus-visible:ring-4 focus-visible:ring-amber-500/80 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-kopwerk-dark"
            >
              <span className="relative overflow-hidden text-sm sm:text-base font-medium tracking-wide text-white dark:text-slate-950">
                <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-full">
                  Daag ons uit
                </span>
                <span className="absolute left-0 top-0 inline-block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0 text-amber-400 dark:text-amber-600">
                  Daag ons uit
                </span>
              </span>
              <span className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/20 dark:bg-black/10 transition-colors duration-500 group-hover:bg-amber-500 group-hover:dark:bg-amber-400 shrink-0">
                <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 text-white dark:text-slate-950 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-950 group-hover:dark:text-slate-900" />
              </span>
            </button>
          </MagneticWrapper>
        </motion.div>
      </main>

      <Footer />
      <Suspense fallback={null}>
        <ContactCard
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
          email={contactEmail}
        />
      </Suspense>
    </div>
  );
}
