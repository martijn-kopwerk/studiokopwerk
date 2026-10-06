import { describe, expect, it } from 'vitest';
import { K, computeLayout } from './tekentafel';

// The header logo on a phone: 28px wide at the 24px gutter.
const logo = { left: 24, top: 24, width: 28 };
const logoStem = logo.left + (K.stemX * logo.width) / 120;

describe('computeLayout', () => {
  it('draws the K on phones, continuing the header logo’s stem and cropped on the right', () => {
    const layout = computeLayout(375, 812, logo, 500);
    expect(layout.phone).toBe(true);
    expect(layout.stemX).toBeCloseTo(logoStem);
    expect(layout.armDY).toBeGreaterThan(812 * 0.4);
    expect(layout.armX).toBeGreaterThan(375);
    expect(layout.midY).toBe(500);
    expect(layout.dotX).toBeGreaterThan(layout.stemX);
    expect(layout.dotX).toBeLessThan(layout.vertexX);
  });

  it('puts the vertex a little below the middle when the page asks for no place', () => {
    expect(computeLayout(375, 812, logo).midY).toBeCloseTo(812 * 0.6);
  });

  it('keeps the large K left of centre on wider screens, whatever the page asks', () => {
    const layout = computeLayout(1440, 900, logo, 500);
    expect(layout.phone).toBe(false);
    expect(layout.stemX).toBeCloseTo(144);
    expect(layout.midY).toBeCloseTo(900 * 0.54);
    expect(layout.armX).toBeLessThan(1440);
  });
});
