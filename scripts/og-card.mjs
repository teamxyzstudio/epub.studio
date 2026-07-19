/**
 * OG / social-card generator.
 *
 * Builds 1200x630 share images in the site's brand language (accent top bar,
 * lockup, Instrument Serif headline, mono footer, tilted page-card motif —
 * the composition of the handoff og-image.png) and rasterises them with sharp.
 *
 * All text is converted to <path> outlines via the real TTFs, so the PNG is
 * identical on any machine — librsvg never needs the fonts installed.
 *
 * Usage:
 *   node scripts/og-card.mjs --slug <slug> --title "<title>" --kicker "<category>"
 *       → public/blog-og/<slug>.png
 *   node scripts/og-card.mjs --all
 *       → regenerates a card for every post in src/content/blog (and writes the
 *         ogImage frontmatter field if missing)
 *   node scripts/og-card.mjs --site
 *       → regenerates public/og-image.png (the site-wide card)
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import TextToSVG from 'text-to-svg';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const FONTS = {
  serif: TextToSVG.loadSync(
    path.join(ROOT, 'node_modules/@expo-google-fonts/instrument-serif/400Regular/InstrumentSerif_400Regular.ttf'),
  ),
  serifItalic: TextToSVG.loadSync(
    path.join(ROOT, 'node_modules/@expo-google-fonts/instrument-serif/400Regular_Italic/InstrumentSerif_400Regular_Italic.ttf'),
  ),
  mono: TextToSVG.loadSync(
    path.join(ROOT, 'node_modules/@expo-google-fonts/ibm-plex-mono/500Medium/IBMPlexMono_500Medium.ttf'),
  ),
};

// Design tokens (README §Design Tokens).
const INK = '#17130E';
const PAPER = '#FAF7F2';
const CARD = '#FFFDF9';
const ACCENT = '#FF2E63';
const GRAPHITE = '#6E675D';

const W = 1200;
const H = 630;

/** Text → SVG path element, left-baseline anchored. */
function textPath(font, text, x, y, fontSize, fill, options = {}) {
  const d = font.getD(text, { x, y, fontSize, anchor: 'left baseline', ...options });
  return `<path d="${d}" fill="${fill}"/>`;
}

const widthOf = (font, text, fontSize, options = {}) =>
  font.getMetrics(text, { fontSize, ...options }).width;

/** Greedy word-wrap against real glyph metrics. */
function wrap(font, text, fontSize, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const probe = line ? `${line} ${word}` : word;
    if (line && widthOf(font, probe, fontSize) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = probe;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** The brand mark: rounded ink square, three text bars, accent middle bar. */
function mark(x, y, size) {
  const s = size / 24; // artwork is on a 24-unit grid
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="0" y="0" width="24" height="24" rx="5.4" fill="${INK}"/>
    <rect x="6" y="7" width="12" height="2.2" rx="1.1" fill="${PAPER}"/>
    <rect x="6" y="11" width="9" height="2.2" rx="1.1" fill="${ACCENT}"/>
    <rect x="6" y="15" width="11" height="2.2" rx="1.1" fill="${PAPER}"/>
  </g>`;
}

/** Tilted page-card motif (echoes the hero's "living book"). */
function pageMotif(x, y, w, h, angle) {
  const bar = (bx, by, bw, bh, fill, opacity = 1) =>
    `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="${bh / 2}" fill="${fill}" opacity="${opacity}"/>`;
  const pad = Math.round(w * 0.11);
  const bw = w - pad * 2;
  const rows = [
    bar(pad, pad, bw * 0.52, 16, '#454037'),
    bar(pad, pad + 40, bw * 0.98, 10, 'rgba(23,19,14,.25)'),
    bar(pad, pad + 66, bw * 0.9, 10, 'rgba(23,19,14,.25)'),
    bar(pad, pad + 92, bw, 10, ACCENT),
    bar(pad, pad + 118, bw * 0.94, 10, 'rgba(23,19,14,.25)'),
    bar(pad, pad + 144, bw * 0.85, 10, 'rgba(23,19,14,.25)'),
    bar(pad, pad + 170, bw * 0.6, 10, 'rgba(23,19,14,.25)'),
  ].join('');
  return `<g transform="translate(${x} ${y}) rotate(${angle})">
    <rect x="6" y="10" width="${w}" height="${h}" rx="8" fill="rgba(23,19,14,.08)"/>
    <rect x="0" y="0" width="${w}" height="${h}" rx="8" fill="${CARD}" stroke="rgba(23,19,14,.18)"/>
    ${rows}
  </g>`;
}

/** Wordmark: "Epub Studio" + accent full stop, as paths. */
function wordmark(x, baseline, fontSize) {
  const main = textPath(FONTS.serif, 'Epub Studio', x, baseline, fontSize, INK);
  const w = widthOf(FONTS.serif, 'Epub Studio', fontSize);
  const dot = textPath(FONTS.serif, '.', x + w, baseline, fontSize, ACCENT);
  return main + dot;
}

/** Blog post card. */
function blogCard({ title, kicker }) {
  const marginX = 80;
  const maxTitleWidth = 690;

  // Adaptive title size: shrink until it fits three lines.
  let fontSize = 66;
  let lines = wrap(FONTS.serif, title, fontSize, maxTitleWidth);
  while (lines.length > 3 && fontSize > 44) {
    fontSize -= 6;
    lines = wrap(FONTS.serif, title, fontSize, maxTitleWidth);
  }
  const lineHeight = Math.round(fontSize * 1.12);

  const parts = [];
  parts.push(`<rect width="${W}" height="${H}" fill="${PAPER}"/>`);
  parts.push(`<rect width="${W}" height="14" fill="${ACCENT}"/>`);

  // Lockup
  parts.push(mark(marginX, 64, 44));
  parts.push(wordmark(marginX + 58, 98, 38));

  // Kicker: CATEGORY · BLOG
  parts.push(
    textPath(FONTS.mono, `${kicker.toUpperCase()} · BLOG`, marginX, 208, 21, GRAPHITE, {
      tracking: 90,
    }),
  );

  // Title block, vertically centred in the remaining space.
  const blockH = lines.length * lineHeight;
  let y = Math.round(258 + (250 - blockH) / 2) + fontSize;
  for (let i = 0; i < lines.length; i++) {
    const isLast = i === lines.length - 1;
    parts.push(textPath(FONTS.serif, lines[i], marginX, y, fontSize, INK));
    // Accent full stop, the wordmark gesture — only when the title ends bare.
    if (isLast && /[a-z0-9]$/i.test(title)) {
      const wLast = widthOf(FONTS.serif, lines[i], fontSize);
      parts.push(textPath(FONTS.serif, '.', marginX + wLast, y, fontSize, ACCENT));
    }
    y += lineHeight;
  }

  // Footer
  parts.push(
    textPath(FONTS.mono, 'epub.studio/blog · free · in your browser', marginX, 566, 22, GRAPHITE),
  );

  // Motif
  parts.push(pageMotif(880, 190, 300, 390, 8));

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${parts.join('\n')}</svg>`;
}

/** Site-wide card — the handoff composition, with the corrected footer. */
function siteCard() {
  const marginX = 96;
  const parts = [];
  parts.push(`<rect width="${W}" height="${H}" fill="${PAPER}"/>`);
  parts.push(`<rect width="${W}" height="14" fill="${ACCENT}"/>`);

  parts.push(mark(marginX, 190, 106));
  parts.push(wordmark(marginX + 140, 268, 64));

  parts.push(textPath(FONTS.serif, 'Convert any ebook. Keep it', marginX, 375, 46, INK));
  const italic = textPath(FONTS.serifItalic, 'beautiful', marginX, 428, 46, ACCENT);
  parts.push(italic);
  const wIt = widthOf(FONTS.serifItalic, 'beautiful', 46);
  parts.push(textPath(FONTS.serif, '.', marginX + wIt, 428, 46, INK));

  parts.push(
    textPath(FONTS.mono, 'free · no signup · in your browser', marginX, 572, 26, GRAPHITE),
  );

  parts.push(pageMotif(930, 230, 330, 430, 10));

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${parts.join('\n')}</svg>`;
}

async function render(svg, outFile) {
  mkdirSync(path.dirname(outFile), { recursive: true });
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outFile);
  console.log('wrote', path.relative(ROOT, outFile));
}

// --- Frontmatter helpers for --all ----------------------------------------

const BLOG_DIR = path.join(ROOT, 'src/content/blog');

function readFrontmatter(file) {
  const src = readFileSync(file, 'utf8');
  const m = /^---\n([\s\S]*?)\n---/.exec(src);
  if (!m) return null;
  const unq = (s) => s.replace(/^'(.*)'$/s, '$1').replace(/''/g, "'");
  const title = /^title:\s*(.+)$/m.exec(m[1]);
  const category = /^category:\s*(.+)$/m.exec(m[1]);
  return {
    src,
    fm: m[1],
    title: title ? unq(title[1].trim()) : null,
    category: category ? unq(category[1].trim()) : null,
    hasOgImage: /^ogImage:/m.test(m[1]),
  };
}

/** Add the ogImage field just after `category:` if the post lacks one. */
function ensureOgImageField(file, slug) {
  const post = readFrontmatter(file);
  if (!post || post.hasOgImage) return;
  const updated = post.src.replace(
    /^(category:\s*.+)$/m,
    `$1\nogImage: '/blog-og/${slug}.png'`,
  );
  writeFileSync(file, updated);
}

// --- CLI -------------------------------------------------------------------

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : null;
};

if (args.includes('--site')) {
  await render(siteCard(), path.join(ROOT, 'public/og-image.png'));
} else if (args.includes('--all')) {
  for (const f of readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'))) {
    const slug = f.replace(/\.md$/, '');
    const post = readFrontmatter(path.join(BLOG_DIR, f));
    if (!post?.title) {
      console.warn('skip (no title):', f);
      continue;
    }
    const svg = blogCard({ title: post.title, kicker: post.category || 'Blog' });
    await render(svg, path.join(ROOT, `public/blog-og/${slug}.png`));
    ensureOgImageField(path.join(BLOG_DIR, f), slug);
  }
} else {
  const slug = flag('slug');
  const title = flag('title');
  const kicker = flag('kicker') || 'Blog';
  if (!slug || !title) {
    console.error('Usage: og-card.mjs --slug <slug> --title "<title>" [--kicker "<category>"] | --all | --site');
    process.exit(1);
  }
  await render(blogCard({ title, kicker }), path.join(ROOT, `public/blog-og/${slug}.png`));
}
