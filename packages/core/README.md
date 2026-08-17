# @open-slide/core

Runtime and CLI for [open-slide](https://github.com/1weiho/open-slide) — a React-based slide framework where you write slides and the framework handles the Vite/React stack, layout, navigation, hot reload, and fullscreen play mode.

## Install

```bash
pnpm add @open-slide/core
```

Most users get this installed automatically by running `npx @open-slide/cli init`. Use this package directly only if you're wiring up an existing workspace by hand.

## What's inside

- **Runtime** — home page, slide viewer, thumbnail rail, keyboard navigation, and fullscreen presenter mode. Every slide renders into a fixed pixel canvas — **1920×1080** by default, configurable via `canvas` — and the framework scales it.
- **Vite plugin** — discovers `slides/<id>/index.{tsx,jsx,ts,js}`, exposes them via virtual modules, and reloads when slides are added or removed.
- **CLI** — `open-slide dev | build | preview` so workspaces never need to touch Vite, React, or tsconfig directly.

## CLI

Once installed, the `open-slide` bin is available in the workspace:

| Command | Description |
| --- | --- |
| `open-slide dev` | Start the dev server. Flags: `-p, --port <port>`, `--host [host]`, `--open`. |
| `open-slide build` | Build a static site. Flags: `--out-dir <dir>` (defaults to `dist`). |
| `open-slide preview` | Preview the production build. Flags: `-p, --port <port>`, `--host [host]`, `--open`. |

## Config

Create `open-slide.config.ts` in the workspace root (all fields optional):

```ts
import type { OpenSlideConfig } from '@open-slide/core';

const openSlideConfig: OpenSlideConfig = {
  slidesDir: 'slides',
  port: 5173,
  canvas: '16:9',
};

export default openSlideConfig;
```

### Canvas size

`canvas` sets the pixel canvas every slide renders into. It takes a named preset or explicit dimensions:

```ts
const openSlideConfig: OpenSlideConfig = {
  canvas: '4:5', // or { width: 1080, height: 1350 }
};
```

| Preset | Size | Typical use |
| --- | --- | --- |
| `'16:9'` *(default)* | 1920 × 1080 | Talks, screen shares |
| `'4:3'` | 1440 × 1080 | Projectors, older displays |
| `'4:5'` | 1080 × 1350 | LinkedIn document carousels, Instagram |
| `'1:1'` | 1080 × 1080 | Square social posts |
| `'9:16'` | 1080 × 1920 | Stories, Reels, Shorts |

The setting is workspace-wide and flows through the viewer, thumbnails, presenter, and the PDF, HTML, and PPTX exports — a PDF exported from a `'4:5'` workspace has 1080 × 1350 pages. Landscape presets keep the 1080px height so a deck authored at 1920 × 1080 keeps its type scale when narrowed.

Slides do not reflow. The canvas is scaled to fit, so changing this on an existing deck re-frames its layout rather than adapting it.

### Vector PDF export

By default a PDF page comes out as a bitmap the moment anything on it uses `mask-image`, `filter`, `backdrop-filter` or `mix-blend-mode` — Chromium has no vector representation for those, so it flattens the whole stacking context that contains one, at the layer's CSS-pixel size. The text on that page stops being selectable and softens when the reader zooms in.

`export.vectorPdf` strips those four properties during PDF export only:

```ts
const openSlideConfig: OpenSlideConfig = {
  export: { vectorPdf: true },
};
```

Layers that exist only as decoration — an empty masked overlay, a blurred glow, a `mix-blend-mode` grain sheet — are hidden. Elements that carry text, images or media keep their box and lose only the property, so their content stays sharp and vector.

It is off by default because it is lossy: a page built around a blur or a mask keeps the effect on screen and in the HTML export, and loses it in the PDF. Turn it on when a fully vector PDF matters more than the effect — a deck headed for LinkedIn, or for print.

To check a PDF afterwards, `BaseFont` entries should list your real fonts (a fallback like `Consolas` or `SegoeUI` means a webfont did not load in time) and there should be no full-page `/Subtype /Image` objects.

### Hosting under a subpath

Set `base` to deploy the built site under a sub-directory (intranet folders, GitHub Pages project sites, reverse proxies). Use a leading and trailing slash:

```ts
const openSlideConfig: OpenSlideConfig = {
  base: '/my-slides/',
};
```

The value is passed straight to Vite's `base` and to React Router's `basename`, so client-side navigation matches the deployed path.

## Authoring slides

Slides live under `slides/<kebab-case-id>/index.tsx` and default-export an array of `Page` components:

```tsx
import type { Page } from '@open-slide/core';

const Cover: Page = () => (
  <div className="flex h-full w-full items-center justify-center">
    <h1 className="text-[120px] font-bold">Hello, open-slide</h1>
  </div>
);

const pages: Page[] = [Cover];
export default pages;

export const meta = { title: 'Hello' };
```

## Exports

```ts
import {
  CANVAS_WIDTH,   // 1920 by default, or whatever `canvas` resolves to
  CANVAS_HEIGHT,  // 1080 by default
  MorphElement,   // match or fade objects across pages for morph transitions
  type Page,
  type SlideMeta,
  type SlideModule,
  type SlideTransition,
  type OpenSlideConfig,
} from '@open-slide/core';
```

The Vite plugin is exposed under a subpath for advanced setups:

```ts
import { createViteConfig } from '@open-slide/core/vite';
```

## License

MIT
