import { describe, expect, it } from 'vitest';
import { daglicht } from './daglicht';

describe('daglicht', () => {
  it('rises low and warm on the left in the morning', () => {
    const licht = daglicht(8);
    expect(licht.x).toBeLessThan(30);
    expect(licht.y).toBeGreaterThan(55);
    expect(licht.laag).toBe(true);
  });

  it('stands high and pale at midday', () => {
    const licht = daglicht(13.5);
    expect(licht.x).toBeGreaterThan(40);
    expect(licht.x).toBeLessThan(60);
    expect(licht.y).toBeLessThan(30);
    expect(licht.laag).toBe(false);
    expect(licht.sterkte).toBeLessThan(daglicht(8).sterkte);
  });

  it('sets low on the right in the evening', () => {
    const licht = daglicht(19.5);
    expect(licht.x).toBeGreaterThan(70);
    expect(licht.laag).toBe(true);
  });

  it('keeps a faint glow in the corner at night', () => {
    expect(daglicht(2)).toEqual(daglicht(23));
    expect(daglicht(2).sterkte).toBeLessThan(daglicht(13.5).sterkte);
  });
});
