/**
 * Everything → EPUB.
 *
 * Each importer produces the same shape ({ metadata, chapters, resources,
 * cover }) and hands it to `buildEpub`, so all of them emit structurally
 * identical, valid EPUB 3 files.
 */
import JSZip from 'jszip';
import { buildEpub, esc, mimeForPath } from '../epub/write.js';
import { baseName } from './epub-to-pdf.js';

const titleFromFilename = (name) =>
  baseName(name)
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

/** Split a run of paragraphs into chapters on heading-ish boundaries. */
function chapterize(blocks, fallbackTitle) {
  const chapters = [];
  let current = null;

  for (const b of blocks) {
    if (b.type === 'h1' || (b.type === 'h2' && chapters.length === 0 && !current)) {
      if (current && current.body.length) chapters.push(current);
      current = { title: b.text, body: [`  <h1>${esc(b.text)}</h1>`] };
      continue;
    }
    if (!current) current = { title: fallbackTitle, body: [] };
    if (b.type === 'h2') current.body.push(`  <h2>${esc(b.text)}</h2>`);
    else if (b.type === 'h3') current.body.push(`  <h3>${esc(b.text)}</h3>`);
    else if (b.type === 'blockquote') current.body.push(`  <blockquote><p>${esc(b.text)}</p></blockquote>`);
    else if (b.type === 'raw') current.body.push(b.html);
    else current.body.push(`  <p>${esc(b.text)}</p>`);
  }
  if (current && current.body.length) chapters.push(current);
  if (!chapters.length) chapters.push({ title: fallbackTitle, body: ['  <p></p>'] });

  return chapters.map((c) => ({ title: c.title, html: c.body.join('\n') }));
}

/** Sanitise arbitrary HTML into the XHTML subset EPUB readers accept. */
async function sanitizeToXhtml(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script, style, iframe, object, embed, form, link, meta').forEach((el) =>
    el.remove(),
  );
  doc.querySelectorAll('*').forEach((el) => {
    for (const attr of [...el.attributes]) {
      if (/^on/i.test(attr.name) || attr.name === 'style' || attr.name === 'class') {
        el.removeAttribute(attr.name);
      }
    }
  });
  // XMLSerializer emits well-formed XHTML (self-closed voids, escaped entities).
  const body = doc.body;
  return new XMLSerializer()
    .serializeToString(body)
    .replace(/^<body[^>]*>/, '')
    .replace(/<\/body>$/, '')
    .replace(/ xmlns="[^"]*"/g, '');
}

// --- Plain text -----------------------------------------------------------

export async function txtToEpub(file, options = {}, onProgress = () => {}) {
  const text = await file.text();
  onProgress(40);

  // Blank-line separated paragraphs; ALL-CAPS short lines read as headings.
  const blocks = [];
  for (const para of text.split(/\r?\n\s*\r?\n/)) {
    const t = para.replace(/\s*\r?\n\s*/g, ' ').trim();
    if (!t) continue;
    if (t.length < 70 && t === t.toUpperCase() && /[A-Z]/.test(t)) {
      blocks.push({ type: 'h1', text: t });
    } else {
      blocks.push({ type: 'p', text: t });
    }
  }
  onProgress(80);

  const title = titleFromFilename(file.name);
  const blob = await buildEpub({
    metadata: { title, language: options.language || 'en' },
    chapters: chapterize(blocks, title),
  });
  onProgress(100);
  return { blob, filename: baseName(file.name) + '.epub' };
}

// --- Markdown -------------------------------------------------------------

export async function markdownToEpub(file, options = {}, onProgress = () => {}) {
  const { marked } = await import('marked');
  const md = await file.text();
  onProgress(30);

  const html = await marked.parse(md, { async: true, gfm: true });
  onProgress(60);

  const title = inferTitle(html, file.name);
  const chapters = await splitHtmlIntoChapters(html, title);
  onProgress(85);

  const blob = await buildEpub({
    metadata: { title, language: options.language || 'en' },
    chapters,
  });
  onProgress(100);
  return { blob, filename: baseName(file.name) + '.epub' };
}

// --- HTML -----------------------------------------------------------------

export async function htmlToEpub(file, options = {}, onProgress = () => {}) {
  const raw = await file.text();
  onProgress(35);
  const doc = new DOMParser().parseFromString(raw, 'text/html');
  const title =
    (doc.querySelector('title')?.textContent || '').trim() || inferTitle(raw, file.name);
  const inner = doc.body ? doc.body.innerHTML : raw;
  onProgress(65);

  const chapters = await splitHtmlIntoChapters(inner, title);
  const blob = await buildEpub({ metadata: { title, language: options.language || 'en' }, chapters });
  onProgress(100);
  return { blob, filename: baseName(file.name) + '.epub' };
}

function extractFirstHeading(html) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? m[1].replace(/<[^>]+>/g, '').trim() : '';
}

/**
 * Decide the book title from a document's headings.
 *
 * A single h1 is almost always the book's title. Several h1s means they are
 * chapter headings — taking the first would title the book "Chapter One", so
 * the filename is the better guess.
 */
function inferTitle(html, filename) {
  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
  if (h1Count === 1) {
    const heading = extractFirstHeading(html);
    if (heading) return heading;
  }
  return titleFromFilename(filename);
}

/** Break an HTML run into chapters at each <h1>. */
async function splitHtmlIntoChapters(html, fallbackTitle) {
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
  const root = doc.body.firstElementChild;
  const groups = [];
  let current = { title: fallbackTitle, nodes: [] };

  for (const node of [...root.children]) {
    if (node.tagName === 'H1' && current.nodes.length) {
      groups.push(current);
      current = { title: node.textContent.trim(), nodes: [node] };
    } else {
      if (node.tagName === 'H1') current.title = node.textContent.trim();
      current.nodes.push(node);
    }
  }
  if (current.nodes.length) groups.push(current);
  if (!groups.length) groups.push({ title: fallbackTitle, nodes: [] });

  const out = [];
  for (const g of groups) {
    const frag = g.nodes.map((n) => n.outerHTML).join('\n');
    out.push({ title: g.title, html: await sanitizeToXhtml(frag) });
  }
  return out;
}

// --- FB2 (FictionBook) ----------------------------------------------------

export async function fb2ToEpub(file, options = {}, onProgress = () => {}) {
  const text = await file.text();
  onProgress(30);
  const doc = new DOMParser().parseFromString(text, 'application/xml');
  if (doc.querySelector('parsererror')) {
    throw new Error('This FB2 file has malformed XML and cannot be read.');
  }

  const tag = (name) => doc.getElementsByTagName(name)[0];
  const title = tag('book-title')?.textContent?.trim() || titleFromFilename(file.name);
  const authorEl = tag('author');
  const author = authorEl
    ? [
        authorEl.getElementsByTagName('first-name')[0]?.textContent,
        authorEl.getElementsByTagName('last-name')[0]?.textContent,
      ]
        .filter(Boolean)
        .join(' ')
        .trim()
    : '';
  const language = tag('lang')?.textContent?.trim() || options.language || 'en';
  onProgress(50);

  const bodies = [...doc.getElementsByTagName('body')].filter(
    (b) => b.getAttribute('name') !== 'notes',
  );
  const chapters = [];
  for (const body of bodies) {
    const sections = [...body.getElementsByTagName('section')];
    const targets = sections.length ? sections : [body];
    for (const section of targets) {
      const heading =
        section.getElementsByTagName('title')[0]?.textContent?.trim() || `Chapter ${chapters.length + 1}`;
      const paras = [...section.getElementsByTagName('p')]
        .map((p) => p.textContent.trim())
        .filter(Boolean);
      if (!paras.length) continue;
      chapters.push({
        title: heading,
        html: [`  <h1>${esc(heading)}</h1>`, ...paras.map((t) => `  <p>${esc(t)}</p>`)].join('\n'),
      });
    }
  }
  onProgress(80);

  // FB2 embeds images as base64 <binary> elements.
  const resources = [];
  for (const bin of [...doc.getElementsByTagName('binary')]) {
    const id = bin.getAttribute('id');
    if (!id) continue;
    resources.push({
      name: id,
      data: base64ToBytes(bin.textContent.replace(/\s/g, '')),
      mediaType: bin.getAttribute('content-type') || mimeForPath(id),
    });
  }

  const blob = await buildEpub({
    metadata: { title, author, language },
    chapters: chapters.length ? chapters : [{ title, html: '  <p></p>' }],
    resources,
  });
  onProgress(100);
  return { blob, filename: baseName(file.name) + '.epub' };
}

function base64ToBytes(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

// --- DOCX -----------------------------------------------------------------

export async function docxToEpub(file, options = {}, onProgress = () => {}) {
  const mammoth = await import('mammoth/mammoth.browser.js');
  onProgress(20);
  const arrayBuffer = await file.arrayBuffer();

  const resources = [];
  let imageIndex = 0;
  const result = await (mammoth.default || mammoth).convertToHtml(
    { arrayBuffer },
    {
      convertImage: (mammoth.default || mammoth).images.imgElement(async (image) => {
        const ext = (image.contentType || 'image/png').split('/')[1].replace('jpeg', 'jpg');
        const name = `image-${String(++imageIndex).padStart(3, '0')}.${ext}`;
        const buffer = await image.read();
        resources.push({ name, data: buffer, mediaType: image.contentType });
        return { src: name };
      }),
    },
  );
  onProgress(70);

  const title = inferTitle(result.value, file.name);
  const chapters = await splitHtmlIntoChapters(result.value, title);
  onProgress(90);

  const blob = await buildEpub({
    metadata: { title, language: options.language || 'en' },
    chapters,
    resources,
  });
  onProgress(100);
  return { blob, filename: baseName(file.name) + '.epub' };
}

// --- PDF ------------------------------------------------------------------

export async function pdfToEpub(file, options = {}, onProgress = () => {}) {
  const pdfjs = await import('pdfjs-dist');
  const workerSrc = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

  const data = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data }).promise;

  const info = await pdf.getMetadata().catch(() => null);
  const title = info?.info?.Title?.trim() || titleFromFilename(file.name);
  const author = info?.info?.Author?.trim() || '';

  // Reassemble text runs into paragraphs: PDF text is positioned glyph runs,
  // so we rebuild lines by y-position and join them into paragraphs on
  // sentence-ending / indentation boundaries.
  const pageParas = [];
  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n);
    const content = await page.getTextContent();

    const lines = new Map();
    for (const item of content.items) {
      if (!item.str) continue;
      const y = Math.round(item.transform[5]);
      if (!lines.has(y)) lines.set(y, []);
      lines.get(y).push(item.str);
    }
    const ordered = [...lines.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([, parts]) => parts.join('').replace(/\s+/g, ' ').trim())
      .filter(Boolean);

    const paras = [];
    let buf = '';
    for (const line of ordered) {
      buf = buf ? `${buf} ${line}` : line;
      if (/[.!?…"”’]$/.test(line) && buf.length > 80) {
        paras.push(buf);
        buf = '';
      }
    }
    if (buf) paras.push(buf);
    pageParas.push(paras);

    onProgress(Math.round((n / pdf.numPages) * 90));
  }

  // One EPUB chapter per ~10 PDF pages keeps files navigable without inventing
  // chapter breaks the source does not have.
  const PAGES_PER_CHAPTER = 10;
  const chapters = [];
  for (let i = 0; i < pageParas.length; i += PAGES_PER_CHAPTER) {
    const slice = pageParas.slice(i, i + PAGES_PER_CHAPTER).flat();
    if (!slice.length) continue;
    const from = i + 1;
    const to = Math.min(i + PAGES_PER_CHAPTER, pageParas.length);
    const heading = `Pages ${from}–${to}`;
    chapters.push({
      title: heading,
      html: [`  <h1>${esc(heading)}</h1>`, ...slice.map((t) => `  <p>${esc(t)}</p>`)].join('\n'),
    });
  }

  if (!chapters.length) {
    throw new Error(
      'No text could be extracted — this PDF is probably a scan of page images. Run it through OCR first.',
    );
  }

  const blob = await buildEpub({
    metadata: { title, author, language: options.language || 'en' },
    chapters,
  });
  onProgress(100);
  return { blob, filename: baseName(file.name) + '.epub' };
}

// --- CBZ (comic archive) --------------------------------------------------

export async function cbzToEpub(file, options = {}, onProgress = () => {}) {
  const zip = await JSZip.loadAsync(file);
  const images = Object.keys(zip.files)
    .filter((n) => /\.(jpe?g|png|gif|webp)$/i.test(n) && !zip.files[n].dir && !n.startsWith('__MACOSX'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  if (!images.length) throw new Error('This CBZ contains no images.');

  const resources = [];
  const chapters = [];
  for (let i = 0; i < images.length; i++) {
    const src = images[i];
    const ext = (src.split('.').pop() || 'jpg').toLowerCase();
    const name = `page-${String(i + 1).padStart(4, '0')}.${ext}`;
    resources.push({
      name,
      data: await zip.file(src).async('uint8array'),
      mediaType: mimeForPath(name),
    });
    chapters.push({
      title: `Page ${i + 1}`,
      html: `  <figure><img src="${esc(name)}" alt="Page ${i + 1}"/></figure>`,
    });
    onProgress(Math.round(((i + 1) / images.length) * 95));
  }

  const title = titleFromFilename(file.name);
  const blob = await buildEpub({
    metadata: { title, language: options.language || 'en' },
    chapters,
    resources,
    // The first page is already in `resources`; flag it rather than re-adding it.
    coverName: resources[0].name,
  });
  onProgress(100);
  return { blob, filename: baseName(file.name) + '.epub' };
}

// --- MOBI / AZW3 ----------------------------------------------------------

export async function mobiToEpub(file, options = {}, onProgress = () => {}) {
  const { initMobiFile } = await import('@lingo-reader/mobi-parser');
  onProgress(15);

  const mobi = await initMobiFile(file);
  const spine = mobi.getSpine();
  const meta = mobi.getMetadata?.() || {};
  onProgress(30);

  const chapters = [];
  for (let i = 0; i < spine.length; i++) {
    const item = spine[i];
    const loaded = await mobi.loadChapter(item.id);
    if (!loaded || !loaded.html) continue;
    const inner = await extractBodyInner(loaded.html);
    if (!inner.trim()) continue;
    chapters.push({ title: item.id || `Chapter ${chapters.length + 1}`, html: inner });
    onProgress(30 + Math.round(((i + 1) / spine.length) * 60));
  }

  if (!chapters.length) throw new Error('No readable chapters were found in this file.');

  const blob = await buildEpub({
    metadata: {
      title: meta.title || titleFromFilename(file.name),
      author: Array.isArray(meta.author) ? meta.author.join(', ') : meta.author || '',
      language: meta.language || options.language || 'en',
      publisher: meta.publisher || '',
    },
    chapters,
  });
  onProgress(100);
  return { blob, filename: baseName(file.name) + '.epub' };
}

async function extractBodyInner(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return sanitizeToXhtml(doc.body ? doc.body.innerHTML : html);
}
