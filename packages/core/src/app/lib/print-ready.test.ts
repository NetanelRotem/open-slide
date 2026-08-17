import { afterEach, describe, expect, it, vi } from 'vitest';
import { isRasterizingStyle, waitForFonts } from './print-ready';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('waitForFonts', () => {
  it('awaits document.fonts.ready without force-loading any face', async () => {
    const load = vi.fn();
    const faces = [
      { status: 'loaded', load },
      { status: 'unloaded', load },
      { status: 'unloaded', load },
    ];
    const fonts = {
      ready: Promise.resolve(),
      [Symbol.iterator]: () => faces[Symbol.iterator](),
    };
    vi.stubGlobal('document', { fonts });

    await waitForFonts();

    expect(load).not.toHaveBeenCalled();
  });

  it('resolves when the FontFaceSet API is unavailable', async () => {
    vi.stubGlobal('document', {});

    await expect(waitForFonts()).resolves.toBeUndefined();
  });
});

describe('isRasterizingStyle', () => {
  it('passes a plain element', () => {
    expect(
      isRasterizingStyle({
        maskImage: 'none',
        filter: 'none',
        backdropFilter: 'none',
        mixBlendMode: 'normal',
      }),
    ).toBe(false);
  });

  it('treats missing and empty values as unset', () => {
    expect(isRasterizingStyle({})).toBe(false);
    expect(isRasterizingStyle({ filter: '', mixBlendMode: '' })).toBe(false);
  });

  it('flags each rasterizing property on its own', () => {
    expect(isRasterizingStyle({ maskImage: 'linear-gradient(#000, transparent)' })).toBe(true);
    expect(isRasterizingStyle({ filter: 'blur(40px)' })).toBe(true);
    expect(isRasterizingStyle({ backdropFilter: 'blur(8px)' })).toBe(true);
    expect(isRasterizingStyle({ mixBlendMode: 'multiply' })).toBe(true);
  });

  it('flags an element that combines several', () => {
    expect(
      isRasterizingStyle({
        maskImage: 'radial-gradient(#000, transparent)',
        filter: 'none',
        mixBlendMode: 'screen',
      }),
    ).toBe(true);
  });
});
