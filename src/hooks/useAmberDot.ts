import { createContext, useContext, useEffect } from 'react';

export interface DotTarget {
  element: HTMLElement;
  // Keep the dot inside the viewport while its target scrolls out of view (the reading line).
  clamp?: boolean;
  // The page's one moment (design system, "de tekentafel"): the dot flies there slowly, even off the reading line.
  glide?: boolean;
  // A component with its own dot is in view (the Loop): the reading dot fades out there and comes back after.
  hide?: boolean;
}

export const AmberDotContext = createContext<(target: DotTarget | null) => void>(() => {});

/**
 * Sends the background's amber dot to an element: it glides there on the brand curve whenever `key` changes,
 * and goes back to the K's vertex when the page unmounts. The dot sits on the element's centre.
 */
export function useAmberDot(
  getElement: () => HTMLElement | null,
  key: unknown,
  clamp = false,
  glide = false,
  hide = false
) {
  const setTarget = useContext(AmberDotContext);

  useEffect(() => {
    const element = getElement();
    setTarget(element ? { element, clamp, glide, hide } : null);
    // getElement is read when the key changes, not on every render.
  }, [key, clamp, glide, hide, setTarget]);

  useEffect(() => () => setTarget(null), [setTarget]);
}
