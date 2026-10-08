import { useEffect, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
import type { Project } from '../../lib/projects';
import { useContact } from '../../hooks/useContact';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { CapsuleButton } from '../ui/CapsuleButton';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';

const SCENE_SECONDS = 6;
const EASE = [0.19, 1, 0.22, 1] as const;
// Stage and captions share one width: as wide as fits, but never so tall that the captions drop off the screen.
// Phones get an upright stage, cropped around each scene's focus.
const WIDTH: CSSProperties = { maxWidth: 'min(72rem, calc((100dvh - 17rem) * 1.6))' };

interface ProjectFilmProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * An opdracht's short film: its scenes one after another, each drifting slowly towards its focus with one line
 * of explanation, then a closing frame. Always dark, like a cinema. It plays by itself unless the viewer asked
 * for less motion; then there is no zoom and the viewer steps through. The zoom and the progress bar are CSS
 * animations of the same length, so pausing stops both and the bar's end moves on to the next scene.
 */
export function ProjectFilm({ project, open, onOpenChange }: ProjectFilmProps) {
  const scenes = project.film ?? [];
  const reduceMotion = useReducedMotion();
  const { openContact, preloadContact } = useContact();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const scene = scenes[index];
  const ended = index >= scenes.length;
  const timing = { '--scene': `${SCENE_SECONDS}s`, animationPlayState: playing ? 'running' : 'paused' } as CSSProperties;

  useEffect(() => {
    if (!open) return;
    setIndex(0);
    setPlaying(!reduceMotion);
  }, [open, reduceMotion]);

  // Fetch the next scene while this one plays.
  useEffect(() => {
    const next = scenes[index + 1];
    if (open && next) new Image().src = next.image;
  }, [open, index, scenes]);

  const go = (to: number) => setIndex(Math.max(0, Math.min(to, scenes.length)));

  const handleKeys = (e: KeyboardEvent) => {
    const to = { ArrowRight: index + 1, ArrowLeft: index - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    go(to);
  };

  const replay = () => {
    setIndex(0);
    setPlaying(true);
  };

  // Close the film first, so focus can go back before the contact card takes it.
  const challenge = () => {
    onOpenChange(false);
    window.setTimeout(openContact, 350);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onKeyDown={handleKeys}
        overlayClassName="bg-kopwerk-dark/80"
        className="dark inset-0 top-0 left-0 translate-x-0 translate-y-0 flex flex-col gap-6 w-full max-w-none sm:max-w-none h-dvh rounded-none ring-0 bg-kopwerk-dark text-slate-100 px-4 py-5 sm:px-10 sm:py-8"
      >
        <div className="flex items-center gap-3 pr-12">
          <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-amber-500" />
          <DialogTitle className="font-sans text-xs font-semibold tracking-wide-xl uppercase leading-normal text-slate-400">
            {project.title}
          </DialogTitle>
        </div>

        <div className="flex-1 min-h-0 flex items-center justify-center">
          <div
            style={WIDTH}
            className="relative w-full aspect-[4/5] sm:aspect-[16/10] overflow-hidden rounded-2xl border border-slate-800 bg-kopwerk-dark"
          >
            <AnimatePresence initial={false}>
              {scene ? (
                <m.div
                  key={index}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: EASE }}
                >
                  <img
                    src={scene.image}
                    alt={scene.alt}
                    className="size-full object-cover motion-safe:animate-film-zoom"
                    style={{ ...timing, transformOrigin: scene.focus, objectPosition: scene.focus }}
                  />
                </m.div>
              ) : (
                <m.div
                  key="slot"
                  className="absolute inset-0 flex flex-col items-center justify-center gap-10 p-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: EASE }}
                >
                  <p className="max-w-2xl font-display font-normal text-2xl sm:text-4xl md:text-5xl leading-tight tracking-wide-sm text-white text-balance">
                    AI doet het maakwerk, jij beslist wat blijft.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <CapsuleButton onClick={challenge} onPointerEnter={preloadContact} onFocus={preloadContact} className="w-auto">
                      Vertel waar het knelt
                    </CapsuleButton>
                    <button
                      type="button"
                      onClick={replay}
                      className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold tracking-wide-xl uppercase text-slate-400 hover:text-white transition-colors duration-500 ease-kopwerk"
                    >
                      <RotateCcw aria-hidden="true" className="size-4" />
                      Bekijk opnieuw
                    </button>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div style={WIDTH} className="mx-auto w-full flex flex-col gap-4">
          {/* Announced when the viewer steps through; while it plays by itself it stays quiet */}
          <div aria-live={playing ? 'off' : 'polite'} className="min-h-[5.5rem] sm:min-h-[4.5rem]">
            <AnimatePresence mode="wait" initial={false}>
              <m.p
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6"
              >
                {scene && (
                  <>
                    <span className="shrink-0 font-display font-bold text-sm tracking-wide-lg text-amber-400">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display font-medium text-lg sm:text-2xl leading-snug text-white text-pretty">
                      {scene.text}
                    </span>
                  </>
                )}
              </m.p>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <ol aria-label="Scènes" className="flex flex-1 gap-1.5 sm:gap-2">
              {scenes.map((item, i) => (
                <li key={i} className="flex-1">
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Scène ${i + 1}: ${item.text}`}
                    aria-current={i === index ? 'step' : undefined}
                    className="group block w-full py-3 rounded-sm"
                  >
                    <span className="block h-0.5 overflow-hidden rounded-full bg-white/15 transition-colors duration-500 ease-kopwerk group-hover:bg-white/30">
                      <span
                        key={i === index ? 'now' : 'other'}
                        className={cn(
                          'block h-full origin-left bg-amber-400',
                          i === index ? 'animate-film-progress' : i < index ? 'scale-x-100' : 'scale-x-0'
                        )}
                        style={i === index ? timing : undefined}
                        onAnimationEnd={i === index ? () => go(index + 1) : undefined}
                      />
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <Button aria-label="Vorige scène" disabled={index === 0} onClick={() => go(index - 1)} className="disabled:opacity-30">
              <ChevronLeft aria-hidden="true" className="size-5" />
            </Button>
            <Button
              aria-label={playing ? 'Pauzeer' : 'Speel af'}
              disabled={ended}
              onClick={() => setPlaying(!playing)}
              className="disabled:opacity-30"
            >
              {playing ? <Pause aria-hidden="true" className="size-5" /> : <Play aria-hidden="true" className="size-5" />}
            </Button>
            <Button aria-label="Volgende scène" disabled={ended} onClick={() => go(index + 1)} className="disabled:opacity-30">
              <ChevronRight aria-hidden="true" className="size-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
