/**
 * The drafting table follows the day: the ambient light rests where the sun would be, seen from the desk.
 * It rises low on the left in the morning, stands high and pale at midday and sets low on the right in the
 * evening, warmer at both ends. At night a faint glow stays in the bottom right corner. The cursor still
 * moves the light; this is only where it rests.
 */

export interface Daglicht {
  // Where the light rests, in vw and vh.
  x: number;
  y: number;
  // How strong it is, as the glow's opacity.
  sterkte: number;
  // Low sun: a warmer amber.
  laag: boolean;
}

const OP = 6.5;
const ONDER = 20.5;

export function daglicht(uur: number): Daglicht {
  if (uur < OP || uur > ONDER) return { x: 85, y: 92, sterkte: 0.55, laag: false };
  const t = (uur - OP) / (ONDER - OP);
  const hoogte = Math.sin(t * Math.PI);
  return {
    x: Math.round(12 + t * 76),
    y: Math.round(80 - hoogte * 55),
    sterkte: Math.round((0.75 + (1 - hoogte) * 0.25) * 100) / 100,
    laag: hoogte < 0.5,
  };
}

/** The hour as a decimal (14:30 is 14.5), in the visitor's own time. */
export const uurVan = (date: Date) => date.getHours() + date.getMinutes() / 60;
