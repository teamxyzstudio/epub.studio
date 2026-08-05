/**
 * Slug → conversion engine.
 *
 * Engines are loaded with dynamic `import()` so a visitor to /epub-to-pdf never
 * downloads mammoth, pdf.js or the MOBI parser. Each engine has the signature:
 *
 *   (file: File, options: object, onProgress: (pct: number) => void)
 *     => Promise<{ blob: Blob, filename: string, note?: string, report?: object }>
 */

/**
 * Formats with no viable browser-side writer.
 *
 * Writing MOBI/KF8 needs Amazon's own toolchain. Rather than ship a dead button
 * or a fake progress bar, these pages explain the situation and give the route
 * that actually works today — which, since Send-to-Kindle began accepting EPUB
 * in 2022, is usually "you do not need to convert at all".
 */
export const NO_ENGINE = new Set(['epub-to-mobi', 'epub-to-azw3']);

/**
 * Conversions that produce an EPUB. These hand their result to Style Studio so
 * the reader can re-typeset the book before downloading it — the styling step
 * only makes sense on a reflowable format, which is why the utilities that
 * merely repair an existing EPUB are not in this list.
 */
export const PRODUCES_EPUB = new Set([
  'pdf-to-epub',
  'docx-to-epub',
  'mobi-to-epub',
  'azw3-to-epub',
  'txt-to-epub',
  'markdown-to-epub',
  'html-to-epub',
  'fb2-to-epub',
  'cbz-to-epub',
]);

/**
 * Compose two engines into one: the first leg produces an EPUB, the second
 * consumes it. Progress maps 0–50% to the parse leg, 50–100% to the build
 * leg. This is what makes azw3/mobi/cbz→pdf one-line entries — the middle
 * format is always EPUB, which both sides already speak.
 */
const chain = (firstLoader, secondLoader) => async () => {
  const [first, second] = await Promise.all([firstLoader(), secondLoader()]);
  return async (file, options = {}, onProgress = () => {}) => {
    const mid = await first(file, options, (p) => onProgress(p / 2));
    const midFile = new File([mid.blob], mid.filename, {
      type: 'application/epub+zip',
    });
    return second(midFile, options, (p) => onProgress(50 + p / 2));
  };
};

const toEpub = (name) => () => import('./to-epub.js').then((m) => m[name]);
const toPdf = () => import('./epub-to-pdf.js').then((m) => m.epubToPdf);

const engines = {
  'epub-to-pdf': () => import('./epub-to-pdf.js').then((m) => m.epubToPdf),
  'epub-to-docx': () => import('./from-epub.js').then((m) => m.epubToDocx),
  'epub-to-txt': () => import('./from-epub.js').then((m) => m.epubToTxt),

  'pdf-to-epub': () => import('./to-epub.js').then((m) => m.pdfToEpub),
  'docx-to-epub': () => import('./to-epub.js').then((m) => m.docxToEpub),
  'txt-to-epub': () => import('./to-epub.js').then((m) => m.txtToEpub),
  'markdown-to-epub': () => import('./to-epub.js').then((m) => m.markdownToEpub),
  'html-to-epub': () => import('./to-epub.js').then((m) => m.htmlToEpub),
  'fb2-to-epub': () => import('./to-epub.js').then((m) => m.fb2ToEpub),
  'cbz-to-epub': () => import('./to-epub.js').then((m) => m.cbzToEpub),
  'mobi-to-epub': () => import('./to-epub.js').then((m) => m.mobiToEpub),
  'azw3-to-epub': () => import('./to-epub.js').then((m) => m.mobiToEpub),

  'azw3-to-pdf': chain(toEpub('mobiToEpub'), toPdf),
  'mobi-to-pdf': chain(toEpub('mobiToEpub'), toPdf),
  'cbz-to-pdf': chain(toEpub('cbzToEpub'), toPdf),

  'epub-metadata-editor': () => import('./utilities.js').then((m) => m.editMetadata),
  'epub-cover-editor': () => import('./utilities.js').then((m) => m.replaceCover),
  'epub-validator': () => import('./utilities.js').then((m) => m.validateEpub),
  'epub-compressor': () => import('./utilities.js').then((m) => m.compressEpub),
  'merge-epub': () => import('./utilities.js').then((m) => m.mergeEpubs),
  'split-epub': () => import('./utilities.js').then((m) => m.splitEpub),
};

export async function getEngine(slug) {
  const loader = engines[slug];
  if (!loader) return null;
  return loader();
}

export const hasEngine = (slug) => Boolean(engines[slug]);
