/**
 * Style Studio's settings model, presets, themes and contrast math.
 *
 * Transcribed from `presetDef()` / `renderVals()` in mocks/Style Studio.dc.html.
 * Kept framework-free so the same values drive the live preview, the generated
 * EPUB stylesheet, and the tests.
 */

/** Settings that get written into the book. */
export const BASE = {
  font: 'Literata',
  keepOriginal: false,
  embed: false,
  weight: 400,
  size: 18,
  lh: 1.6,
  ls: 0,
  ws: 0,
  paraStyle: 'indent',
  indent: 1.4,
  gap: 0.9,
  align: 'justify',
  hyph: true,
  dropCaps: true,
  headings: 'standard',
  theme: 'paper',
  cBg: '#FFFFFF',
  cText: '#1A1814',
  cLink: '#C41E4F',
  dimImages: true,
  margins: 'Medium',
  measure: 66,
  title: 'The Time Machine',
  author: 'H. G. Wells',
  language: 'en',
};

/** Preview-only state — never written into the file. */
export const PREVIEW_DEFAULTS = {
  view: 'Paginated',
  cols: 1,
  ruler: false,
  fixation: false,
  pvTheme: 'Follow saved',
  prog: 'Page x of y',
};

export const PRESETS = {
  'Classic novel': {
    font: 'EB Garamond', size: 19, lh: 1.55, ls: 0, ws: 0, align: 'justify', hyph: true,
    paraStyle: 'indent', indent: 1.4, gap: 0.9, dropCaps: true, headings: 'standard',
    margins: 'Medium', measure: 64, weight: 400,
  },
  Modern: {
    font: 'Source Sans 3', size: 18, lh: 1.7, ls: 0, ws: 0, align: 'left', hyph: false,
    paraStyle: 'space', indent: 1.4, gap: 1.0, dropCaps: false, headings: 'standard',
    margins: 'Medium', measure: 66, weight: 400,
  },
  Compact: {
    font: 'Literata', size: 15.5, lh: 1.4, ls: 0, ws: 0, align: 'left', hyph: false,
    paraStyle: 'space', indent: 1.2, gap: 0.6, dropCaps: false, headings: 'subtle',
    margins: 'Narrow', measure: 74, weight: 400,
  },
  Airy: {
    font: 'Lora', size: 21, lh: 1.9, ls: 0.1, ws: 0.5, align: 'left', hyph: false,
    paraStyle: 'space', indent: 1.4, gap: 1.4, dropCaps: false, headings: 'strong',
    margins: 'Wide', measure: 58, weight: 400,
  },
  Accessible: {
    font: 'Atkinson Hyperlegible', size: 20, lh: 1.75, ls: 0.3, ws: 1, align: 'left', hyph: false,
    paraStyle: 'space', indent: 1.4, gap: 1.1, dropCaps: false, headings: 'standard',
    margins: 'Medium', measure: 60, weight: 400,
  },
};

export const PRESET_META = [
  { name: 'Classic novel', desc: 'Serif, justified, indents, drop caps' },
  { name: 'Modern', desc: 'Sans, left-aligned, block paragraphs' },
  { name: 'Compact', desc: 'Smaller, tighter — study docs' },
  { name: 'Airy', desc: 'Large, tall lines, wide margins' },
  { name: 'Accessible', desc: 'Hyperlegible, high contrast, larger' },
];

export const presetDef = (name) => PRESETS[name] || PRESETS['Classic novel'];

export const THEMES = {
  paper: { bg: '#FEFCF7', text: '#1A1814', link: '#C41E4F', dark: false },
  cream: { bg: '#F6EDDC', text: '#3B2F20', link: '#8A5A2B', dark: false },
  mist: { bg: '#EDF0F3', text: '#232A31', link: '#33586E', dark: false },
  dusk: { bg: '#2A2D33', text: '#E8E6E1', link: '#F08CA4', dark: true },
  ink: { bg: '#000000', text: '#DFDCD5', link: '#FF7A9C', dark: true },
};

export const THEME_NAMES = ['paper', 'cream', 'mist', 'dusk', 'ink'];
export const PV_THEME_MAP = { Paper: 'paper', Cream: 'cream', Mist: 'mist', Dusk: 'dusk', Ink: 'ink' };

export const FONT_GROUPS = [
  { label: 'Serif', list: ['Literata', 'Crimson Pro', 'EB Garamond', 'Lora', 'Source Serif 4', 'Merriweather', 'Bitter'] },
  { label: 'Sans', list: ['Inter', 'Source Sans 3', 'Nunito Sans'] },
  { label: 'Accessibility', list: ['Atkinson Hyperlegible', 'OpenDyslexic'] },
];

/** Heading scale multipliers per "Heading size" setting: [h1, h2]. */
export const HEADING_SCALE = { subtle: [1.35, 1.1], standard: [1.9, 1.35], strong: [2.5, 1.6] };

export const MARGIN_PAD = { Narrow: '28px 26px', Medium: '46px 48px', Wide: '64px 68px' };

/** EPUB body padding per margin setting, in percent (reflowable-safe). */
export const MARGIN_PCT = { Narrow: 3, Medium: 6, Wide: 10 };

// --- WCAG contrast ---------------------------------------------------------

/** Relative luminance, per WCAG 2.x. */
export function lum(hex) {
  const c = String(hex).replace('#', '');
  const f = (i) => {
    const v = parseInt(c.substr(i, 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(0) + 0.7152 * f(2) + 0.0722 * f(4);
}

export function contrast(a, b) {
  const l1 = lum(a);
  const l2 = lum(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/** AAA ≥ 7:1, AA ≥ 4.5:1, otherwise Fails (WCAG 1.4.3 / 1.4.6, normal text). */
export function contrastBadge(ratio) {
  const label = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'Fails';
  return { label: `${label} · ${ratio.toFixed(1)}:1`, pass: ratio >= 4.5 };
}

export const resolveTheme = (s) =>
  s.theme === 'custom'
    ? { bg: s.cBg, text: s.cText, link: s.cLink, dark: lum(s.cBg) < 0.35 }
    : THEMES[s.theme];

// --- Stylesheet generation -------------------------------------------------

/** Font stacks used inside the generated EPUB. */
const FALLBACK = {
  Inter: 'sans-serif',
  'Source Sans 3': 'sans-serif',
  'Nunito Sans': 'sans-serif',
  'Atkinson Hyperlegible': 'sans-serif',
  OpenDyslexic: 'sans-serif',
};

export const fontStack = (s) =>
  s.keepOriginal
    ? 'Georgia, "Times New Roman", serif'
    : `'${s.font}', ${FALLBACK[s.font] || 'Georgia, serif'}`;

/**
 * The stylesheet written into the EPUB. This is the payload that makes Style
 * Studio's settings real — everything the reader sees comes from here.
 *
 * @param {object} s          settings
 * @param {string} [embedded] filename of an embedded font inside the EPUB
 */
export function buildEpubCss(s, embedded = '') {
  const theme = resolveTheme(s);
  const hs = HEADING_SCALE[s.headings] || HEADING_SCALE.standard;
  const headWeight = Math.min(700, s.weight + 200);
  const pad = MARGIN_PCT[s.margins] ?? MARGIN_PCT.Medium;
  const justified = s.align === 'justify';

  const face = embedded
    ? `@font-face{font-family:'${s.font}';src:url('${embedded}');font-weight:normal;font-style:normal}\n`
    : '';

  return `${face}/* Generated by Epub Studio — Style Studio */
html{background:${theme.bg}}
body{
  background:${theme.bg};
  color:${theme.text};
  font-family:${fontStack(s)};
  font-weight:${s.weight};
  font-size:${s.size}px;
  line-height:${s.lh};
  letter-spacing:${s.ls}px;
  word-spacing:${s.ws}px;
  text-align:${justified ? 'justify' : 'left'};
  ${justified && s.hyph ? 'hyphens:auto;-webkit-hyphens:auto;-epub-hyphens:auto;' : 'hyphens:none;'}
  max-width:${s.measure}ch;
  margin:0 auto;
  padding:${pad}%;
}
p{${
    s.paraStyle === 'indent'
      ? `margin:0;text-indent:${s.indent}em`
      : `margin:0 0 ${s.gap}em;text-indent:0`
  }}
/* A paragraph that opens a section has nothing to continue from. */
p:first-of-type,h1+p,h2+p,h3+p,blockquote p{text-indent:0}
h1,h2,h3{
  font-weight:${headWeight};
  line-height:1.15;
  letter-spacing:-.01em;
  text-align:left;
  page-break-after:avoid;
  break-after:avoid;
}
h1{font-size:${hs[0]}em;margin:0 0 .2em}
h2{font-size:${hs[1]}em;margin:1.2em 0 .5em}
h3{font-size:${(hs[1] * 0.82).toFixed(2)}em;margin:1.1em 0 .4em}
a{color:${theme.link};text-decoration:underline;text-underline-offset:3px}
blockquote{margin:1em 2em;font-style:italic}
img{max-width:100%;height:auto${theme.dark && s.dimImages ? ';opacity:.75' : ''}}
${
  s.dropCaps
    ? `/* Drop cap on the first paragraph of each chapter. */
p:first-of-type::first-letter{
  float:left;
  font-size:3.1em;
  line-height:.82;
  padding:.06em .08em 0 0;
  font-weight:${headWeight};
}
`
    : ''
}`;
}

/** Filename shown on the download button, derived from the book title. */
export const outputName = (title) =>
  `${String(title || 'book')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'book'}.epub`;
