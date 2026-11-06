import mate from '../content/klein/mate-film.webp';
import mateMp4 from '../content/klein/mate.mp4';
import mateWebm from '../content/klein/mate.webm';
import zuipwijs from '../content/klein/zuipwijs-film.webp';
import zuipwijsMp4 from '../content/klein/zuipwijs.mp4';
import zuipwijsWebm from '../content/klein/zuipwijs.webm';
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
  // Optional: a short silent loop that plays in place of the image (the image is its poster). Never with sound.
  film?: { webm: string; mp4: string };
}

export const kleineDingen: KleinDing[] = [
  {
    titel: 'Mate',
    soort: 'Training en voeding',
    tekst:
      'Ik sport veel en wil dat blessurevrij doen. Daarom maakte ik een coach voor training en voeding, op de gegevens van je sporthorloge. AI schrijft de uitleg erbij.',
    beeld: mate,
    alt: 'Mate zegt: Rustig aan vandaag. Je sliep kort, dus de snelle intervallen worden een rustige loop van 40 minuten. Jij tikt op Pas aan en het staat op je horloge. Daarna: Mate denkt mee. Mate rekent het na. Jij beslist. Met verzonnen gegevens.',
    grond: 'licht',
    film: { webm: mateWebm, mp4: mateMp4 },
  },
  {
    titel: 'Zuipwijs',
    soort: 'Gezondheid',
    tekst:
      'Zie hoe je week ervoor staat. Daag je vrienden uit voor een duel: wie haalt de meeste nuchtere dagen? Elke nuchtere dag is een streepje. Winnen voelt goed.',
    beeld: zuipwijs,
    alt: 'Zuipwijs in drie beelden: elke nuchtere dag een streepje op je viltje. Een duel met Sanne en Daan om een droog weekend. Vrienden zien je reeks van 12 dagen, nooit je drankjes. Met verzonnen gegevens.',
    grond: 'donker',
    film: { webm: zuipwijsWebm, mp4: zuipwijsMp4 },
  },
  {
    titel: 'Een huisstijl voor AI',
    soort: 'Huisstijl',
    tekst:
      'Een huisstijl die AI begrijpt: kleuren, letters, knoppen en toon op één plek. Zo komt elke offerte, presentatie en pagina in een paar minuten in je eigen merk.',
    beeld: designSystem,
    alt: 'De huisstijl van Kopwerk: de letters Syne en Plus Jakarta Sans, vijf kleuren en de knop Vertel waar het knelt.',
    grond: 'donker',
  },
];
