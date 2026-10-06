// The drafting table ("de tekentafel"): the geometry of the Kopwerk K, drawn across the page.
// These values are the brand's source for the background (BRAND_GUIDE §5F); the design system mirrors them.

// Logo geometry in its own 120×120 units (see KopwerkLogo): the vertical stroke runs from
// y=20 to y=100 at x=30, the diagonals meet at the vertex (40, 60) and end at x=94,
// and the amber dot sits at (37, 60).
export const K = { stemX: 30, vertexX: 40, dotX: 37, armX: 94, top: 20, bottom: 100, mid: 60 };

export const ARM_SLOPE = (K.mid - K.top) / (K.armX - K.vertexX);

// Below this width the K is drawn cropped, growing out of the header logo.
export const PHONE_MAX_WIDTH = 640;

// Line weights and opacities. Guides: the full-bleed construction lines. K: the letter itself, a touch stronger.
// Phones get slightly stronger lines: the screen is small and often seen in daylight.
export const LINES = {
  guideWidth: 1,
  kWidth: 1.25,
  light: { ink: '51, 65, 85', guide: 0.05, k: 0.11, phoneGuide: 0.07, phoneK: 0.15 },
  dark: { ink: '226, 232, 240', guide: 0.055, k: 0.13, phoneGuide: 0.075, phoneK: 0.17 },
};

// Brand curve cubic-bezier(0.19, 1, 0.22, 1), approximated with an ease-out quart.
export const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 4);

export interface Layout {
  width: number;
  height: number;
  stemX: number;
  vertexX: number;
  midY: number;
  // x of the vertical guide through the arm ends
  armX: number;
  // Half-height of the large K
  armDY: number;
  dotX: number;
  phone: boolean;
}

export interface Box {
  left: number;
  top: number;
  width: number;
}

/**
 * Where the K goes. `logo` is the header logo's box, `vertexY` the y a page asks for the vertex
 * (its `data-tekentafel-vertex` marker), both relative to the drawing.
 */
export function computeLayout(width: number, height: number, logo?: Box, vertexY?: number): Layout {
  if (width < PHONE_MAX_WIDTH && logo) {
    // Phones: the K is drawn about as tall as the screen, its stem continuing the header logo's own stem,
    // its arms running off the right edge. The vertex sits in a gap the page leaves for it, never over text.
    const unit = logo.width / 120;
    const stemX = logo.left + K.stemX * unit;
    const scale = (height * 0.9) / (K.bottom - K.top);
    return {
      width,
      height,
      stemX,
      vertexX: stemX + (K.vertexX - K.stemX) * scale,
      midY: vertexY ?? height * 0.6,
      armX: stemX + (K.armX - K.stemX) * scale,
      armDY: (K.mid - K.top) * scale,
      dotX: stemX + (K.dotX - K.stemX) * scale,
      phone: true,
    };
  }

  // Wider screens: the K is drawn large and faint, a little left of centre so it never competes with the wordmark.
  const scale = Math.min(height * 1.05, width * 1.1) / (K.bottom - K.top);
  const stemX = width * 0.1;
  return {
    width,
    height,
    stemX,
    vertexX: stemX + (K.vertexX - K.stemX) * scale,
    midY: height * 0.54,
    armX: stemX + (K.armX - K.stemX) * scale,
    armDY: (K.mid - K.top) * scale,
    dotX: stemX + (K.dotX - K.stemX) * scale,
    phone: false,
  };
}
