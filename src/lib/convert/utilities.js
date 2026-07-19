/**
 * The seven EPUB utilities. All operate on the archive in place where
 * possible, so the output keeps the original book's structure, styling and
 * assets rather than being rebuilt from an intermediate representation.
 */
import JSZip from 'jszip';
import { readEpub, resolvePath } from '../epub/read.js';
import { buildEpub, esc, mimeForPath } from '../epub/write.js';
import { baseName } from './epub-to-pdf.js';

const zipOut = (zip) =>
  zip.generateAsync({
    type: 'blob',
    mimeType: 'application/epub+zip',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

/**
 * Rewrites a Dublin Core element's text, creating it if absent.
 * Operates on the OPF source string to avoid reserialising the whole document
 * (which would otherwise drop the original's namespace prefixes).
 */
function setDcValue(opfXml, name, value) {
  const open = new RegExp(`<(dc:${name}|${name})(\\s[^>]*)?>([\\s\\S]*?)</\\1>`, 'i');
  if (open.test(opfXml)) {
    return opfXml.replace(open, (_m, tag, attrs = '') => `<${tag}${attrs || ''}>${esc(value)}</${tag}>`);
  }
  return opfXml.replace(/<\/metadata>/i, `  <dc:${name}>${esc(value)}</dc:${name}>\n</metadata>`);
}

// --- Metadata editor ------------------------------------------------------

export async function editMetadata(file, options = {}, onProgress = () => {}) {
  const zip = await JSZip.loadAsync(file);
  const container = await zip.file('META-INF/container.xml').async('string');
  const opfPath = container.match(/full-path="([^"]+)"/)?.[1];
  if (!opfPath) throw new Error('Could not locate the package document in this EPUB.');
  onProgress(40);

  let opf = await zip.file(opfPath).async('string');
  for (const key of ['title', 'creator', 'language', 'publisher', 'description']) {
    const value = options[key];
    if (value != null && value !== '') opf = setDcValue(opf, key, value);
  }
  zip.file(opfPath, opf);
  onProgress(85);

  const blob = await zipOut(zip);
  onProgress(100);
  return { blob, filename: baseName(file.name) + '.epub' };
}

/** Read current metadata so the editor form can be pre-filled. */
export async function inspectMetadata(file) {
  const book = await readEpub(file);
  return { ...book.metadata, chapters: book.chapters.length, hasCover: !!book.coverPath };
}

// --- Cover editor ---------------------------------------------------------

export async function replaceCover(file, options = {}, onProgress = () => {}) {
  const image = options.coverFile;
  if (!image) throw new Error('Choose a cover image to use.');

  const book = await readEpub(file);
  const zip = book.zip;
  onProgress(35);

  const ext = (image.name.split('.').pop() || 'jpg').toLowerCase();
  const bytes = new Uint8Array(await image.arrayBuffer());

  if (book.coverPath) {
    // Overwrite in place so the existing manifest entry stays valid.
    zip.file(book.coverPath, bytes);
  } else {
    const name = `cover.${ext}`;
    const coverPath = resolvePath(book.opfPath, name);
    zip.file(coverPath, bytes);
    let opf = await zip.file(book.opfPath).async('string');
    opf = opf.replace(
      /<\/manifest>/i,
      `  <item id="cover-image" href="${esc(name)}" media-type="${mimeForPath(name)}" properties="cover-image"/>\n</manifest>`,
    );
    zip.file(book.opfPath, opf);
  }
  onProgress(85);

  const blob = await zipOut(zip);
  onProgress(100);
  return { blob, filename: baseName(file.name) + '.epub' };
}

// --- Validator ------------------------------------------------------------

/**
 * Structural EPUB checks. This is not a full EPUBCheck port — it catches the
 * failures that actually make readers reject a file, and says so plainly.
 */
export async function validateEpub(file, options = {}, onProgress = () => {}) {
  const issues = [];
  const add = (level, message) => issues.push({ level, message });

  let zip;
  try {
    zip = await JSZip.loadAsync(file);
  } catch {
    return { report: { issues: [{ level: 'error', message: 'Not a valid ZIP archive.' }], ok: false } };
  }
  onProgress(20);

  const mimetype = zip.file('mimetype');
  if (!mimetype) add('error', 'Missing the `mimetype` file. Every EPUB must contain one.');
  else if ((await mimetype.async('string')).trim() !== 'application/epub+zip') {
    add('error', 'The `mimetype` file must contain exactly `application/epub+zip`.');
  }

  const containerFile = zip.file('META-INF/container.xml');
  if (!containerFile) {
    add('error', 'Missing `META-INF/container.xml`. Readers cannot find the book without it.');
    return { report: { issues, ok: false } };
  }
  onProgress(40);

  const container = await containerFile.async('string');
  const opfPath = container.match(/full-path="([^"]+)"/)?.[1];
  if (!opfPath) {
    add('error', '`container.xml` does not point at a package document.');
    return { report: { issues, ok: false } };
  }

  const opfFile = zip.file(opfPath);
  if (!opfFile) {
    add('error', `The package document \`${opfPath}\` is listed but missing from the archive.`);
    return { report: { issues, ok: false } };
  }

  const opfText = await opfFile.async('string');
  const opf = new DOMParser().parseFromString(opfText, 'application/xml');
  if (opf.querySelector('parsererror')) add('error', 'The package document contains malformed XML.');
  onProgress(60);

  for (const dc of ['title', 'language', 'identifier']) {
    if (!opfText.includes(`dc:${dc}`) && !opfText.includes(`<${dc}`)) {
      add('error', `Required metadata \`dc:${dc}\` is missing.`);
    }
  }

  // Every manifest href must resolve to a real entry.
  let missing = 0;
  for (const item of opf.querySelectorAll('manifest > item')) {
    const href = item.getAttribute('href');
    if (!href || /^[a-z]+:/i.test(href)) continue;
    if (!zip.file(resolvePath(opfPath, href))) {
      missing++;
      if (missing <= 5) add('error', `Manifest lists \`${href}\`, but that file is not in the archive.`);
    }
  }
  if (missing > 5) add('error', `…and ${missing - 5} more missing manifest files.`);
  onProgress(80);

  const spine = opf.querySelectorAll('spine > itemref');
  if (!spine.length) add('error', 'The spine is empty — the book has no reading order.');

  const hasNav =
    [...opf.querySelectorAll('manifest > item')].some((i) =>
      (i.getAttribute('properties') || '').split(/\s+/).includes('nav'),
    ) || !!opf.querySelector('spine[toc]');
  if (!hasNav) add('warning', 'No navigation document (nav.xhtml or toc.ncx). The table of contents will be empty.');

  const version = opf.querySelector('package')?.getAttribute('version');
  if (version && parseFloat(version) < 3) {
    add('warning', `This is EPUB ${version}. It works, but EPUB 3 is the current standard.`);
  }
  onProgress(100);

  const ok = !issues.some((i) => i.level === 'error');
  if (ok && !issues.length) add('ok', 'No problems found. This EPUB is structurally valid.');
  return { report: { issues, ok, spine: spine.length } };
}

// --- Compressor -----------------------------------------------------------

export async function compressEpub(file, options = {}, onProgress = () => {}) {
  const quality = { Light: 0.85, Balanced: 0.7, Maximum: 0.5 }[options.level] ?? 0.7;
  const maxWidth = { Light: 2000, Balanced: 1400, Maximum: 1000 }[options.level] ?? 1400;

  const zip = await JSZip.loadAsync(file);
  const imagePaths = Object.keys(zip.files).filter(
    (n) => /\.(jpe?g|png)$/i.test(n) && !zip.files[n].dir,
  );

  let replaced = 0;
  let saved = 0;
  for (let i = 0; i < imagePaths.length; i++) {
    const path = imagePaths[i];
    try {
      const blob = await zip.file(path).async('blob');
      const shrunk = await recompressImage(blob, maxWidth, quality);
      // Only keep the new version if it is actually smaller.
      if (shrunk && shrunk.size < blob.size) {
        zip.file(path, shrunk);
        replaced++;
        saved += blob.size - shrunk.size;
      }
    } catch {
      /* Leave anything we cannot decode untouched. */
    }
    onProgress(Math.round(((i + 1) / Math.max(imagePaths.length, 1)) * 95));
  }

  const blob = await zipOut(zip);
  onProgress(100);

  // Report what actually happened — including "nothing", which is the honest
  // answer for a text-only book or images that are already well compressed.
  const note = replaced
    ? `${replaced} of ${imagePaths.length} image${imagePaths.length === 1 ? '' : 's'} shrunk, ${formatKb(saved)} saved`
    : imagePaths.length
      ? `${imagePaths.length} image${imagePaths.length === 1 ? '' : 's'} checked, already optimal`
      : 'no images to compress';

  return { blob, filename: baseName(file.name) + '.epub', note };
}

const formatKb = (n) => (n < 1048576 ? `${Math.round(n / 1024)} KB` : `${(n / 1048576).toFixed(1)} MB`);

async function recompressImage(blob, maxWidth, quality) {
  const bitmap = await createImageBitmap(blob);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return canvas.convertToBlob({ type: 'image/jpeg', quality });
}

// --- Merge ----------------------------------------------------------------

export async function mergeEpubs(file, options = {}, onProgress = () => {}) {
  const files = options.files && options.files.length ? options.files : [file];
  if (files.length < 2) throw new Error('Choose at least two EPUB files to merge.');

  const chapters = [];
  const resources = [];
  let first = null;

  for (let i = 0; i < files.length; i++) {
    const book = await readEpub(files[i]);
    if (!first) first = book.metadata;

    // Title each source book so the merged table of contents stays readable.
    chapters.push({
      title: book.metadata.title,
      html: `  <h1>${esc(book.metadata.title)}</h1>${
        book.metadata.author ? `\n  <p><em>${esc(book.metadata.author)}</em></p>` : ''
      }`,
    });

    for (const ch of book.chapters) {
      const doc = new DOMParser().parseFromString(ch.html, 'text/html');
      doc.querySelectorAll('script, style, link').forEach((el) => el.remove());
      doc.querySelectorAll('img').forEach((img) => img.remove()); // sources differ; avoid broken refs
      const inner = doc.body ? doc.body.innerHTML : '';
      if (inner.trim()) chapters.push({ title: ch.title || book.metadata.title, html: inner });
    }
    onProgress(Math.round(((i + 1) / files.length) * 90));
  }

  const blob = await buildEpub({
    metadata: {
      title: options.mergedTitle || files.map((f) => baseName(f.name)).join(' + '),
      author: first?.author || '',
      language: first?.language || 'en',
    },
    chapters,
    resources,
  });
  onProgress(100);
  return { blob, filename: 'merged.epub' };
}

// --- Split ----------------------------------------------------------------

export async function splitEpub(file, options = {}, onProgress = () => {}) {
  const book = await readEpub(file);
  const perFile = Math.max(1, parseInt(options.chaptersPerFile, 10) || 1);

  const out = new JSZip();
  const groups = [];
  for (let i = 0; i < book.chapters.length; i += perFile) {
    groups.push(book.chapters.slice(i, i + perFile));
  }

  for (let g = 0; g < groups.length; g++) {
    const group = groups[g];
    const chapters = [];
    for (const ch of group) {
      const doc = new DOMParser().parseFromString(ch.html, 'text/html');
      doc.querySelectorAll('script, style, link, img').forEach((el) => el.remove());
      chapters.push({ title: ch.title || `Part ${g + 1}`, html: doc.body ? doc.body.innerHTML : '' });
    }

    const part = await buildEpub({
      metadata: {
        ...book.metadata,
        identifier: '',
        title: `${book.metadata.title} — Part ${g + 1}`,
      },
      chapters,
    });
    out.file(`${baseName(file.name)}-part-${String(g + 1).padStart(2, '0')}.epub`, part);
    onProgress(Math.round(((g + 1) / groups.length) * 95));
  }

  // Several EPUBs cannot be one download, so they ship as a ZIP.
  const blob = await out.generateAsync({ type: 'blob', compression: 'STORE' });
  onProgress(100);
  return {
    blob,
    filename: `${baseName(file.name)}-split.zip`,
    note: `${groups.length} file${groups.length === 1 ? '' : 's'}`,
  };
}
