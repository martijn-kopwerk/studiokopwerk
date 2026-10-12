import { useEffect, useRef, useState } from 'react';

/**
 * The stops the amber dot travels past while you read: blocks (zones) in document order, each with a marker in the
 * margin. The active stop is the last one whose block has reached the middle of the screen, or null above the first.
 * Pass `markers.current[active]` to useAmberDot.
 */
export function useReadingStops() {
  const zones = useRef<(HTMLElement | null)[]>([]);
  const markers = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    let pending = false;
    const update = () => {
      pending = false;
      const middle = window.innerHeight / 2;
      let next: number | null = null;
      for (let i = 0; i < zones.current.length; i++) {
        const zone = zones.current[i];
        if (zone && zone.getBoundingClientRect().top <= middle) next = i;
      }
      setActive(next);
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

  const zone = (index: number) => (el: HTMLElement | null) => {
    zones.current[index] = el;
  };
  const stop = (index: number) => (el: HTMLElement | null) => {
    markers.current[index] = el;
  };

  return { active, markers, zone, stop };
}
