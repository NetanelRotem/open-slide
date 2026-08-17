import { describe, expect, it } from 'vitest';
import { formatOverflow, measureOverflow } from './canvas-overflow.ts';

const W = 1080;
const H = 1350;

describe('measureOverflow', () => {
  it('returns null when the page fits', () => {
    expect(measureOverflow({ width: W, height: H }, W, H)).toBeNull();
    expect(measureOverflow({ width: 800, height: 900 }, W, H)).toBeNull();
  });

  it('tolerates a pixel of sub-pixel rounding', () => {
    expect(measureOverflow({ width: W + 1, height: H + 1 }, W, H)).toBeNull();
    expect(measureOverflow({ width: W + 2, height: H }, W, H)).toEqual({
      right: 2,
      bottom: 0,
    });
  });

  it('reports each axis independently', () => {
    expect(measureOverflow({ width: W + 460, height: H }, W, H)).toEqual({
      right: 460,
      bottom: 0,
    });
    expect(measureOverflow({ width: W, height: H + 120 }, W, H)).toEqual({
      right: 0,
      bottom: 120,
    });
    expect(measureOverflow({ width: W + 40, height: H + 12 }, W, H)).toEqual({
      right: 40,
      bottom: 12,
    });
  });

  it('rounds fractional overflow', () => {
    expect(measureOverflow({ width: W + 12.4, height: H }, W, H)).toEqual({
      right: 12,
      bottom: 0,
    });
  });

  it('measures against the canvas it is given, not a fixed 16:9', () => {
    // 1920x1080 content is fine on a 16:9 canvas and badly over on a 4:5 one.
    expect(measureOverflow({ width: 1920, height: 1080 }, 1920, 1080)).toBeNull();
    expect(measureOverflow({ width: 1920, height: 1080 }, W, H)).toEqual({
      right: 840,
      bottom: 0,
    });
  });
});

describe('formatOverflow', () => {
  it('names the page, the canvas and the axis', () => {
    const msg = formatOverflow('my-deck page 3', { right: 460, bottom: 0 }, W, H);
    expect(msg).toContain('my-deck page 3');
    expect(msg).toContain('1080x1350');
    expect(msg).toContain('460px past the right edge');
    expect(msg).not.toContain('bottom edge');
  });

  it('joins both axes when both overflow', () => {
    const msg = formatOverflow('deck page 1', { right: 40, bottom: 12 }, W, H);
    expect(msg).toContain('40px past the right edge and 12px past the bottom edge');
  });
});
