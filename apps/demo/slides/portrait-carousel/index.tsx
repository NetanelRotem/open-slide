import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import type { CSSProperties } from 'react';

/**
 * Authored for a 1080 x 1350 canvas (4:5), the ratio LinkedIn document
 * carousels want. Set `canvas: '4:5'` in open-slide.config.ts before opening
 * it — on the 16:9 default the pages are correct but the frame is wrong.
 *
 * Portrait rules this deck follows, and a 16:9 deck usually breaks:
 *   - nothing sits side by side more than two across; sequences run downward
 *   - the hero drops to ~84px, not the ~160px a 1920-wide canvas carries
 *   - one idea per page, because a phone shows one page at a time
 */

export const design: DesignSystem = {
  palette: { bg: '#16181d', text: '#edede8', accent: '#c8f135' },
  fonts: {
    display: 'ui-serif, Georgia, "Times New Roman", serif',
    body: '-apple-system, BlinkMacSystemFont, "Inter", system-ui, sans-serif',
  },
  typeScale: { hero: 84, body: 30 },
  radius: 10,
};

export const meta: SlideMeta = { title: 'Portrait carousel (4:5)' };

const PAD = 80;

const muted = 'rgba(237, 237, 232, 0.52)';
const dim = 'rgba(237, 237, 232, 0.30)';
const hairline = 'rgba(237, 237, 232, 0.14)';
const surface = '#1e2128';
const cyan = '#4fd8e8';
const coral = '#ff7a59';

const page: CSSProperties = {
  width: '100%',
  height: '100%',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
  padding: PAD,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
};

const eyebrow: CSSProperties = {
  fontSize: 19,
  letterSpacing: '0.24em',
  textTransform: 'uppercase',
  color: 'var(--osd-accent)',
  fontWeight: 600,
};

const hero: CSSProperties = {
  fontFamily: 'var(--osd-font-display)',
  fontSize: 'var(--osd-size-hero)',
  lineHeight: 1.04,
  fontWeight: 400,
  margin: '20px 0 0',
  letterSpacing: '-0.015em',
};

const body: CSSProperties = {
  fontSize: 'var(--osd-size-body)',
  lineHeight: 1.5,
  color: muted,
  margin: '24px 0 0',
  maxWidth: 820,
};

const foot: CSSProperties = {
  marginTop: 'auto',
  paddingTop: 28,
  borderTop: `1px solid ${hairline}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  fontSize: 17,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: dim,
  fontVariantNumeric: 'tabular-nums',
};

const Foot = ({ n }: { n: number }) => (
  <div style={foot}>
    <span>Portrait carousel</span>
    <span>{String(n).padStart(2, '0')} / 06</span>
  </div>
);

/* ── 01 ─────────────────────────────────────────────── */

const Cover: Page = () => (
  <div style={page}>
    <div style={eyebrow}>4 : 5 · 1080 × 1350</div>
    <h1 style={{ ...hero, marginTop: 140 }}>
      Built portrait,
      <br />
      not cropped
      <br />
      <span style={{ color: 'var(--osd-accent)' }}>into it.</span>
    </h1>
    <p style={body}>
      Every page here is laid out for a 1080 × 1350 canvas. Nothing is squeezed, nothing runs off
      the right edge, and the type is sized for a phone.
    </p>
    <Foot n={1} />
  </div>
);

/* ── 02 ─────────────────────────────────────────────── */

const rowStyle: CSSProperties = {
  display: 'flex',
  gap: 20,
  alignItems: 'baseline',
  padding: '22px 0',
  borderBottom: `1px solid ${hairline}`,
};

const Rules: Page = () => (
  <div style={page}>
    <div style={eyebrow}>The constraint</div>
    <h2 style={{ ...hero, fontSize: 64 }}>Half the width.</h2>
    <p style={{ ...body, marginTop: 20 }}>
      A 16:9 deck has 1640px of usable width. Here you get 920. Layouts that assume the first number
      fall apart at the second.
    </p>

    <div style={{ marginTop: 44 }}>
      {[
        ['Sequences', 'Run downward, never across.'],
        ['Columns', 'Two at most, and only for short text.'],
        ['Hero type', '84px, not 160px.'],
        ['Per page', 'One idea. The reader sees one page at a time.'],
      ].map(([k, v]) => (
        <div key={k} style={rowStyle}>
          <span style={{ width: 220, fontSize: 26, color: 'var(--osd-accent)', flexShrink: 0 }}>
            {k}
          </span>
          <span style={{ fontSize: 26, lineHeight: 1.45, color: muted }}>{v}</span>
        </div>
      ))}
    </div>
    <Foot n={2} />
  </div>
);

/* ── 03 ─────────────────────────────────────────────── */

const steps = [
  ['Read', 'Files, errors, output.', 'var(--osd-accent)'],
  ['Plan', 'Pick the next tool.', cyan],
  ['Act', 'Edit, run, fetch.', coral],
  ['Check', 'Did it work? Iterate.', 'var(--osd-accent)'],
] as const;

const Arrow = () => (
  <svg width="24" height="30" viewBox="0 0 24 30" aria-hidden="true" style={{ margin: '0 auto' }}>
    <title>then</title>
    <path
      d="M12 2 L12 22 M5 16 L12 23 L19 16"
      stroke={dim}
      strokeWidth="1.8"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Loop: Page = () => (
  <div style={page}>
    <div style={eyebrow}>How it works</div>
    <h2 style={{ ...hero, fontSize: 60 }}>A loop, not a one-shot.</h2>

    <div style={{ marginTop: 40 }}>
      {steps.map(([label, note, colour], i) => (
        <div key={label}>
          {i > 0 && <Arrow />}
          <div
            style={{
              background: surface,
              border: `1px solid ${hairline}`,
              borderLeft: `3px solid ${colour}`,
              borderRadius: 'var(--osd-radius)',
              padding: '20px 26px',
              display: 'flex',
              alignItems: 'baseline',
              gap: 22,
            }}
          >
            <span style={{ fontSize: 15, letterSpacing: '0.2em', color: colour, width: 74 }}>
              STEP {i + 1}
            </span>
            <span style={{ fontFamily: 'var(--osd-font-display)', fontSize: 40 }}>{label}</span>
            <span style={{ fontSize: 22, color: muted, marginLeft: 'auto' }}>{note}</span>
          </div>
        </div>
      ))}
    </div>
    <Foot n={3} />
  </div>
);

/* ── 04 ─────────────────────────────────────────────── */

const Stat: Page = () => (
  <div style={page}>
    <div style={eyebrow}>Why portrait</div>
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 8,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 260,
          lineHeight: 0.9,
          color: 'var(--osd-accent)',
          letterSpacing: '-0.03em',
        }}
      >
        80%
      </div>
      <div style={{ fontSize: 34, lineHeight: 1.4, marginTop: 24, maxWidth: 800 }}>
        of a phone screen is filled by a 4:5 page.
      </div>
      <div style={{ fontSize: 26, lineHeight: 1.5, color: muted, marginTop: 16, maxWidth: 800 }}>
        A square gets about 65%, and a 16:9 page lands near 40% — a strip in the middle with the
        feed either side of it.
      </div>
    </div>
    <Foot n={4} />
  </div>
);

/* ── 05 ─────────────────────────────────────────────── */

const Vector: Page = () => (
  <div style={page}>
    <div style={eyebrow}>Vector check</div>
    <h2 style={{ ...hero, fontSize: 60 }}>Everything here is a path.</h2>
    <p style={{ ...body, marginTop: 20 }}>
      Text stays selectable, the diagram stays sharp at any zoom. Open the PDF and try to select
      this sentence.
    </p>

    <svg
      width="920"
      height="330"
      viewBox="0 0 920 330"
      style={{ marginTop: 44 }}
      aria-hidden="true"
    >
      <title>vector diagram</title>
      <circle cx="140" cy="165" r="60" fill="none" stroke="var(--osd-accent)" strokeWidth="2" />
      <circle cx="460" cy="165" r="84" fill="none" stroke={cyan} strokeWidth="2" />
      <circle cx="780" cy="165" r="60" fill="none" stroke={coral} strokeWidth="2" />
      <path d="M200 165 L376 165" stroke={hairline} strokeWidth="2" />
      <path d="M544 165 L720 165" stroke={hairline} strokeWidth="2" />
      <path
        d="M140 165 Q300 40 460 165 Q620 290 780 165"
        fill="none"
        stroke={dim}
        strokeWidth="1.5"
        strokeDasharray="6 8"
      />
      <text x="140" y="173" textAnchor="middle" fontSize="26" fill="var(--osd-text)">
        in
      </text>
      <text x="460" y="173" textAnchor="middle" fontSize="26" fill="var(--osd-text)">
        model
      </text>
      <text x="780" y="173" textAnchor="middle" fontSize="26" fill="var(--osd-text)">
        out
      </text>
    </svg>
    <Foot n={5} />
  </div>
);

/* ── 06 ─────────────────────────────────────────────── */

const Close: Page = () => (
  <div style={page}>
    {/* Decorative only. With `export.vectorPdf` on, this layer is dropped from
        the PDF instead of forcing the page to rasterise. */}
    <div
      aria-hidden
      style={{
        position: 'absolute',
        top: -160,
        right: -160,
        width: 620,
        height: 620,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,241,53,0.22), transparent 68%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }}
    />
    <div style={eyebrow}>Takeaway</div>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h2 style={{ ...hero, fontSize: 72, margin: 0 }}>
        Pick the canvas
        <br />
        <span style={{ color: 'var(--osd-accent)' }}>before</span> the layout.
      </h2>
      <p style={{ ...body, marginTop: 28 }}>
        Reformatting a finished deck crops it. Choosing the ratio up front costs nothing.
      </p>
    </div>
    <Foot n={6} />
  </div>
);

export default [Cover, Rules, Loop, Stat, Vector, Close] satisfies Page[];
