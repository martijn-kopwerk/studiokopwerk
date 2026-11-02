import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/button';
import type { KleinDing } from '../../lib/kleine-dingen';
import { cn } from '../../lib/utils';

/**
 * A kleine ding's short loop, in place of its image: always silent (the files carry no sound at all), playing only
 * while it is on screen. The image is its poster, so before it plays, and for anyone who asked for less motion, the
 * card shows the same still. It runs longer than five seconds, so there is a pause button.
 */
export function KleinFilm({ ding }: { ding: KleinDing & Required<Pick<KleinDing, 'film'>> }) {
  const video = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const watch = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.4 });
    watch.observe(el);
    return () => watch.disconnect();
  }, []);

  const plays = visible && !paused && !reduceMotion;

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    el.muted = true;
    if (plays) el.play().catch(() => {});
    else el.pause();
  }, [plays]);

  return (
    <div className="relative size-full">
      <video
        ref={video}
        poster={ding.beeld}
        aria-label={ding.alt}
        muted
        loop
        playsInline
        disablePictureInPicture
        preload="none"
        className="block size-full object-contain"
      >
        <source src={ding.film.webm} type="video/webm" />
        <source src={ding.film.mp4} type="video/mp4" />
      </video>
      {/* Hidden by CSS rather than by the hook, so the prerendered page and the browser agree */}
      <div className={cn('absolute right-2 bottom-2 motion-reduce:hidden', ding.grond === 'donker' && 'dark')}>
        <Button aria-label={paused ? 'Speel af' : 'Pauzeer'} onClick={() => setPaused(!paused)}>
          {paused ? <Icon name="play" className="size-5" /> : <Icon name="pause" className="size-5" />}
        </Button>
      </div>
    </div>
  );
}
