export const contactEmail = 'hallo@studiokopwerk.nl';

export function mailtoHref(email: string = contactEmail) {
  return `mailto:${email}?subject=${encodeURIComponent('Waar het bij ons knelt')}`;
}
