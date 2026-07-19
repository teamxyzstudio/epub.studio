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
