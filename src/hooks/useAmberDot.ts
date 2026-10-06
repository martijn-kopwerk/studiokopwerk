import { createContext, useContext, useEffect } from 'react';

export interface DotTarget {
  element: HTMLElement;
  // Keep the dot inside the viewport while its target scrolls out of view (the reading line).
  clamp?: boolean;
}

export const AmberDotContext = createContext<(target: DotTarget | null) => void>(() => {});

/**
 * Sends the background's amber dot to an element: it glides there on the brand curve whenever `key` changes,
 * and goes back to the K's vertex when the page unmounts. The dot sits on the element's centre.
 */
export function useAmberDot(getElement: () => HTMLElement | null, key: unknown, clamp = false) {
  const setTarget = useContext(AmberDotContext);

  useEffect(() => {
    const element = getElement();
    setTarget(element ? { element, clamp } : null);
    // getElement is read when the key changes, not on every render.
  }, [key, clamp, setTarget]);

  useEffect(() => () => setTarget(null), [setTarget]);
}
