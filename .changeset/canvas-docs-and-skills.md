---
"@open-slide/core": patch
---

Teach the bundled agent skills about the configurable canvas. `slide-authoring` now reads `canvas` from the config before authoring, carries a portrait type scale and layout rules alongside the 16:9 ones, states the vertical *and* horizontal budget in terms of the configured canvas rather than a hardcoded 1080, explains the clipping warning, and documents which CSS properties cost a PDF its vector output. `create-slide` reads the canvas as its first step.
