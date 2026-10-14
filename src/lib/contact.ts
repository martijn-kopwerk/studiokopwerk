export const contactEmail = 'hallo@studiokopwerk.nl';

/**
 * The mail to Studio Kopwerk. With a chosen friction its subject already names it ("Waar het knelt: …"), so the
 * story has begun; without one the subject is "Waar het knelt".
 */
export function mailtoHref(knelt?: string) {
  const subject = knelt ? `Waar het knelt: ${knelt.replace(/\.$/, '')}` : 'Waar het knelt';
  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}`;
}
