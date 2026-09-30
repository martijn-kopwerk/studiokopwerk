export const contactEmail = 'hallo@studiokopwerk.nl';

export function mailtoHref(email: string = contactEmail) {
  return `mailto:${email}?subject=${encodeURIComponent('Kennismaking Studio Kopwerk')}`;
}
