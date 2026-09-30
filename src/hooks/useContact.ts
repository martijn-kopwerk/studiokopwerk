import { createContext, useContext } from 'react';

interface ContactActions {
  openContact: () => void;
  // Fetches the contact card on first intent (hover or focus), before it's opened.
  preloadContact: () => void;
}

export const ContactContext = createContext<ContactActions>({
  openContact: () => {},
  preloadContact: () => {},
});

export const useContact = () => useContext(ContactContext);
