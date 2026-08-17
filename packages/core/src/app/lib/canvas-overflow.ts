/**
 * Slides never reflow — the canvas is a fixed box that gets scaled — so content
 * wider or taller than the canvas is silently clipped. On screen that is easy to
 * miss, and in an exported PDF it is invisible until someone reads the file. It
 * shows up most often after the canvas size changes under a deck laid out for
 * the previous one.
 *
 * The measurement cannot use `scrollWidth`: pages are told to fill the canvas
 * and almost always set `overflow: hidden` on their root, so the clip happens
 * there and the canvas still measures exactly canvas-sized. Layout geometry
 * survives clipping though, so `getBoundingClientRect()` on the content still
 * reports where it actually landed.
 *
 * Only elements holding their own text count. Full-bleed decoration — a glow
 * pushed past the corner, a background that deliberately runs off the edge — is
 * a normal technique and must not be reported; text falling off the edge is
 * always a mistake.
 *
 * Kept free of `./canvas` (and so of the virtual config) so it stays importable
 * from unit tests; callers pass the dimensions they already hold.
 */

export type ContentExtent = {
  width: number;
  height: number;
};

export type Overflow = {
  right: number;
  bottom: number;
};

/** Sub-pixel layout rounding routinely lands a pixel over. Ignore that. */
const TOLERANCE_PX = 1;

export function measureOverflow(
  extent: ContentExtent,
  canvasWidth: number,
  canvasHeight: number,
): Overflow | null {
  const right = extent.width - canvasWidth;
  const bottom = extent.height - canvasHeight;
  if (right <= TOLERANCE_PX && bottom <= TOLERANCE_PX) return null;
  return {
    right: right > TOLERANCE_PX ? Math.round(right) : 0,
    bottom: bottom > TOLERANCE_PX ? Math.round(bottom) : 0,
  };
}

export function formatOverflow(
  where: string,
  overflow: Overflow,
  canvasWidth: number,
  canvasHeight: number,
): string {
  const parts: string[] = [];
  if (overflow.right) parts.push(`${overflow.right}px past the right edge`);
  if (overflow.bottom) parts.push(`${overflow.bottom}px past the bottom edge`);
  return (
    `[open-slide] ${where} overflows the ${canvasWidth}x${canvasHeight} canvas: ` +
    `${parts.join(' and ')}. That text is clipped here and in every export. ` +
    `Rework the page for this canvas, or change \`canvas\` in open-slide.config.ts.`
  );
}

/** An element holding a text node of its own, rather than only wrapping others. */
function hasOwnText(el: Element): boolean {
  for (const node of el.childNodes) {
    if (node.nodeType === 3 && node.textContent?.trim()) return true;
  }
  return false;
}

/**
 * How far the page's text actually reaches, in canvas pixels. Rects come back
 * in screen space, so they are divided by the canvas's own scale — the viewer
 * renders it scaled to fit, the print root renders it 1:1.
 */
export function contentExtent(root: HTMLElement, canvasWidth: number): ContentExtent {
  const base = root.getBoundingClientRect();
  const scale = base.width > 0 ? base.width / canvasWidth : 1;
  let width = 0;
  let height = 0;
  for (const el of root.querySelectorAll('*')) {
    if (!hasOwnText(el)) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;
    width = Math.max(width, (rect.right - base.left) / scale);
    height = Math.max(height, (rect.bottom - base.top) / scale);
  }
  return { width, height };
}

// One warning per page per session, so a re-render or a page revisit does not
// stack duplicates in the console.
const warned = new Set<string>();

export function warnOnOverflow(
  el: HTMLElement | null | undefined,
  where: string,
  canvasWidth: number,
  canvasHeight: number,
  key: string = where,
): void {
  if (!el || warned.has(key)) return;
  const overflow = measureOverflow(contentExtent(el, canvasWidth), canvasWidth, canvasHeight);
  if (!overflow) return;
  warned.add(key);
  console.warn(formatOverflow(where, overflow, canvasWidth, canvasHeight));
}

export function resetOverflowWarnings(): void {
  warned.clear();
}
