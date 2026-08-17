---
"@open-slide/core": minor
---

Warn when a page's text is clipped by the canvas. Slides never reflow, so content laid out for one canvas size is silently cut off on another — the failure mode a configurable `canvas` introduces. The editing canvas warns while you author, and PDF export warns per page before printing. Full-bleed decoration is ignored; only text that runs past an edge is reported.
