/**
 * The tool catalogue — the single source of truth for the home grid, the
 * footer columns, the related-tools rails and the 21 generated tool pages.
 *
 * Names, descriptions and format badges are taken verbatim from
 * `mocks/Home.dc.html`. Slugs follow the README's `/epub-to-pdf` convention.
 */

/** @typedef {{ n: string, d: string, a: string, b: string, slug: string }} Tool */

export const fromEpub = [
  {
    n: 'EPUB to PDF',
    d: 'Turn a reflowable ebook into a fixed, printable PDF.',
    a: 'EPUB',
    b: 'PDF',
    slug: 'epub-to-pdf',
  },
  {
    n: 'EPUB to MOBI',
    d: 'For older Kindles that only read MOBI.',
    a: 'EPUB',
    b: 'MOBI',
    slug: 'epub-to-mobi',
  },
  {
    n: 'EPUB to AZW3 (Kindle)',
    d: 'The format modern Kindles like best.',
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

export const toEpub = [
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
    n: 'CBZ to EPUB',
    d: 'Comic archives, readable anywhere.',
    a: 'CBZ',
    b: 'EPUB',
    slug: 'cbz-to-epub',
  },
];

export const utils = [
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

export const groups = [
  { label: 'Convert from EPUB', count: '5 tools', tools: fromEpub },
  { label: 'Convert to EPUB', count: '9 tools', tools: toEpub },
  { label: 'EPUB utilities', count: '7 tools', tools: utils },
];

export const allTools = [...fromEpub, ...toEpub, ...utils];

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
