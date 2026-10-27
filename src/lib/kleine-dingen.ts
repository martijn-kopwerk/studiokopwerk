import mate from '../content/klein/mate.webp';
import zuipwijs from '../content/klein/zuipwijs.webp';
import designSystem from '../content/klein/design-system.webp';

/**
 * Kleine dingen: what Martijn makes in between, no opdracht but real work. One detail as the image, always with
 * fictive example values, never real data from the thing itself.
 */
export interface KleinDing {
  titel: string;
  soort: string;
  tekst: string;
  beeld: string;
  alt: string;
  // The image's own background, so a detail with another ground sits well in its frame.
  grond: 'licht' | 'donker';
}

export const kleineDingen: KleinDing[] = [
  {
    titel: 'Mate',
    soort: 'Persoonlijke coach',
    tekst:
      'Een trainings- en voedingscoach op de gegevens van je Garmin. De code rekent, AI schrijft de woorden. Niets gaat naar je horloge zonder dat jij het goedkeurt.',
    beeld: mate,
    alt: 'Mate zegt: Goed hersteld. Vandaag gaan de drempelintervallen gewoon door. Met fictieve waarden.',
    grond: 'licht',
  },
  {
    titel: 'Zuipwijs',
    soort: 'Gezondheid',
    tekst:
      'Zie in één oogopslag hoe je week ervoor staat. Daag je vrienden uit voor een duel: wie haalt de meeste nuchtere dagen? Elke nuchtere dag is een streepje. Winnen voelt goed.',
    beeld: zuipwijs,
    alt: 'Zuipwijs: 3,5 van 7 glazen deze week, nog 3,5 glazen tot je grens. Met fictieve waarden.',
    grond: 'donker',
  },
  {
    titel: 'Design system',
    soort: 'Huisstijl',
    tekst:
      'Een huisstijl die AI begrijpt: kleuren, letters, knoppen en toon op één plek. Zo komt elke offerte, presentatie en pagina in een paar minuten in je eigen merk.',
    beeld: designSystem,
    alt: 'Het Kopwerk design system: de letters Syne en Plus Jakarta Sans, vijf kleuren en de knop Vertel waar het knelt.',
    grond: 'donker',
  },
];
