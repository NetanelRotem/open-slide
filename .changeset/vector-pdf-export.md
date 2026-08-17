---
"@open-slide/core": minor
---

Add `export.vectorPdf` to `open-slide.config.ts`. When enabled, PDF export strips `mask-image`, `filter`, `backdrop-filter` and `mix-blend-mode` — the properties Chromium can only render by flattening the layer they sit on into a bitmap, which turns the whole page into a raster image with unselectable text. Decorative layers are hidden and elements carrying real content keep it, losing only the property. Off by default, since dropping the effect is a visual trade.
