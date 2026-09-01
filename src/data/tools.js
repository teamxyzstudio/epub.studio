/**
 * The tool catalogue — the single source of truth for the home grid, the
 * footer columns, the related-tools rails and the generated tool pages.
 *
 * Two entries are not converters: /epub-to-mobi and /epub-to-azw3 explain why
 * a browser cannot write those formats and route the reader to what does work.
 * They are flagged `guide` from NO_ENGINE — the same set the runner checks — so
 * the grid, the counts and the blog CTA cannot describe them as converters.
 *
 * Names, descriptions and format badges are taken verbatim from
 * `mocks/Home.dc.html`. Slugs follow the README's `/epub-to-pdf` convention.
 */

import { NO_ENGINE } from '../lib/convert/registry.js';

/** @typedef {{ n: string, d: string, a: string, b: string, slug: string, guide?: boolean }} Tool */

/** Tags the entries that explain a conversion rather than performing one. */
const mark = (tools) =>
  tools.map((t) => (NO_ENGINE.has(t.slug) ? { ...t, guide: true } : t));

const FROM_EPUB = [
  {
    n: 'EPUB to PDF',
    d: 'Turn a reflowable ebook into a fixed, printable PDF.',
    a: 'EPUB',
    b: 'PDF',
    slug: 'epub-to-pdf',
  },
  {
    n: 'EPUB to MOBI',
    d: 'Guide: why browsers cannot write MOBI, and the route that works.',
    a: 'EPUB',
    b: 'MOBI',
    slug: 'epub-to-mobi',
  },
  {
    n: 'EPUB to AZW3 (Kindle)',
    d: 'Guide: why browsers cannot write AZW3, and what to do instead.',
    a: 'EPUB',
    b: 'AZW3',
    slug: 'epub-to-azw3',
  },
  {
    n: 'EPUB to DOCX',
    d: 'Edit your book in Word or Google Docs.',
    a: 'EPUB',
    b: 'DOCX',
    slug: 'epub-to-docx',
  },
  {
    n: 'EPUB to TXT',
    d: 'Just the text, nothing else.',
    a: 'EPUB',
    b: 'TXT',
    slug: 'epub-to-txt',
  },
];

const TO_EPUB = [
  {
    n: 'PDF to EPUB',
    d: 'Make a fixed PDF reflow on any screen.',
    a: 'PDF',
    b: 'EPUB',
    slug: 'pdf-to-epub',
  },
  {
    n: 'DOCX to EPUB',
    d: 'From manuscript to ebook in one step.',
    a: 'DOCX',
    b: 'EPUB',
    slug: 'docx-to-epub',
  },
  {
    n: 'MOBI to EPUB',
    d: 'Move old Kindle books to an open format.',
    a: 'MOBI',
    b: 'EPUB',
    slug: 'mobi-to-epub',
  },
  {
    n: 'AZW3 to EPUB',
    d: 'Read Kindle files in any app.',
    a: 'AZW3',
    b: 'EPUB',
    slug: 'azw3-to-epub',
  },
  {
    n: 'TXT to EPUB',
    d: 'Plain text in, proper ebook out.',
    a: 'TXT',
    b: 'EPUB',
    slug: 'txt-to-epub',
  },
  {
    n: 'Markdown to EPUB',
    d: 'Write in Markdown, publish as a book.',
    a: 'MD',
    b: 'EPUB',
    slug: 'markdown-to-epub',
  },
  {
    n: 'HTML to EPUB',
    d: 'Save web pages as an ebook.',
    a: 'HTML',
    b: 'EPUB',
    slug: 'html-to-epub',
  },
  {
    n: 'FB2 to EPUB',
    d: 'Convert FictionBook files.',
    a: 'FB2',
    b: 'EPUB',
    slug: 'fb2-to-epub',
  },
  {
    n: 'AZW3 to PDF',
    d: 'Turn a DRM-free Kindle book into a printable PDF.',
    a: 'AZW3',
    b: 'PDF',
    slug: 'azw3-to-pdf',
  },
  {
    n: 'MOBI to PDF',
    d: 'Rescue an old MOBI file as a fixed, printable PDF.',
    a: 'MOBI',
    b: 'PDF',
    slug: 'mobi-to-pdf',
  },
  {
    n: 'CBZ to PDF',
    d: 'Turn a comic archive into a PDF you can read anywhere.',
    a: 'CBZ',
    b: 'PDF',
    slug: 'cbz-to-pdf',
  },
  {
    n: 'CBZ to EPUB',
    d: 'Comic archives, readable anywhere.',
    a: 'CBZ',
    b: 'EPUB',
    slug: 'cbz-to-epub',
  },
];

const UTILS = [
  {
    n: 'Online EPUB Reader',
    d: 'Open and read any EPUB right here.',
    a: 'EPUB',
    b: 'READ',
    slug: 'epub-reader',
  },
  {
    n: 'Metadata Editor',
    d: 'Fix the title, author and cover info.',
    a: 'EPUB',
    b: 'META',
    slug: 'epub-metadata-editor',
  },
  {
    n: 'Cover Editor',
    d: 'Replace or crop the cover image.',
    a: 'EPUB',
    b: 'COVER',
    slug: 'epub-cover-editor',
  },
  {
    n: 'EPUB Validator',
    d: 'Find out why a reader rejects your file.',
    a: 'EPUB',
    b: 'CHECK',
    slug: 'epub-validator',
  },
  {
    n: 'EPUB Compressor',
    d: 'Shrink images to make the file smaller.',
    a: 'EPUB',
    b: 'ZIP',
    slug: 'epub-compressor',
  },
  {
    n: 'Merge EPUBs',
    d: 'Combine several books into one file.',
    a: 'EPUB+',
    b: 'EPUB',
    slug: 'merge-epub',
  },
  {
    n: 'Split EPUB',
    d: 'Break a book apart by chapters.',
    a: 'EPUB',
    b: 'EPUBS',
    slug: 'split-epub',
  },
];

/**
 * Counted from the arrays themselves — the hardcoded labels had already drifted
 * ("9 tools" over a group of twelve) and counted the two guides as converters.
 */
export const fromEpub = mark(FROM_EPUB);
export const toEpub = mark(TO_EPUB);
export const utils = mark(UTILS);

const countLabel = (tools) => {
  const guides = tools.filter((t) => t.guide).length;
  const working = tools.length - guides;
  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
  return guides ? `${plural(working, 'tool')} · ${plural(guides, 'guide')}` : plural(working, 'tool');
};

export const groups = [
  { label: 'Convert from EPUB', count: countLabel(fromEpub), tools: fromEpub },
  { label: 'Convert to EPUB', count: countLabel(toEpub), tools: toEpub },
  { label: 'EPUB utilities', count: countLabel(utils), tools: utils },
];

export const allTools = [...fromEpub, ...toEpub, ...utils];

/** Everything that actually processes a file — excludes the two guide pages. */
export const workingTools = allTools.filter((t) => !t.guide);

/** @type {Record<string, Tool>} */
export const toolBySlug = Object.fromEntries(allTools.map((t) => [t.slug, t]));

export const href = (tool) => `/${tool.slug}`;

/**
 * Extension → suggested tools, used by the homepage drop zone.
 * Mirrors the `map` object in Home.dc.html's renderVals().
 */
export const suggestionsByExt = {
  epub: ['epub-to-pdf', 'epub-to-azw3', 'epub-to-docx'],
  pdf: ['pdf-to-epub'],
  docx: ['docx-to-epub'],
  mobi: ['mobi-to-epub'],
  azw3: ['azw3-to-epub'],
  txt: ['txt-to-epub'],
  md: ['markdown-to-epub'],
  html: ['html-to-epub'],
  fb2: ['fb2-to-epub'],
  cbz: ['cbz-to-epub'],
};

export const footerColumns = [
  { label: 'Convert from EPUB', links: fromEpub.map((t) => ({ n: t.n, href: href(t) })) },
  { label: 'Convert to EPUB', links: toEpub.map((t) => ({ n: t.n, href: href(t) })) },
  { label: 'Utilities', links: utils.map((t) => ({ n: t.n, href: href(t) })) },
  {
    label: 'Epub Studio',
    links: [
      { n: 'Style Studio', href: '/style-studio' },
      { n: 'Blog', href: '/blog' },
      { n: 'About', href: '/about' },
      { n: 'Privacy', href: '/privacy' },
    ],
  },
];
