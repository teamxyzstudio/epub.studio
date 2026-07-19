/**
 * EPUB reader — parses a real .epub (a ZIP with an OPF package document) into
 * a plain object the converters can work with.
 *
 * Deliberately dependency-light: JSZip for the container, the browser's own
 * DOMParser for the XML. No epub.js here — that library is for *rendering*,
 * and pulling it into every conversion path would cost ~200 KB for nothing.
 */
import JSZip from 'jszip';

const XML = 'application/xml';

/** Resolve an href that is relative to `base` (a path inside the zip). */
export function resolvePath(base, href) {
  const clean = href.split('#')[0];
  if (!clean) return '';
  if (clean.startsWith('/')) return clean.slice(1);
  const stack = base.split('/').slice(0, -1);
  for (const part of clean.split('/')) {
    if (part === '.' || part === '') continue;
    if (part === '..') stack.pop();
    else stack.push(part);
  }
  return stack.join('/');
}

function parseXml(text) {
  const doc = new DOMParser().parseFromString(text, XML);
  if (doc.querySelector('parsererror')) {
    throw new Error('This file has malformed XML inside and cannot be read.');
  }
  return doc;
}

/**
 * @param {File|Blob|ArrayBuffer} input
 * @returns {Promise<{
 *   zip: JSZip,
 *   opfPath: string,
 *   metadata: { title: string, author: string, language: string, identifier: string, publisher: string, description: string },
 *   coverPath: string | null,
 *   chapters: Array<{ id: string, path: string, html: string, title: string }>,
 *   resources: Array<{ path: string, mediaType: string }>,
 * }>}
 */
export async function readEpub(input) {
  let zip;
  try {
    zip = await JSZip.loadAsync(input);
  } catch {
    throw new Error('This does not look like an EPUB file (it is not a valid ZIP archive).');
  }

  const containerFile = zip.file('META-INF/container.xml');
  if (!containerFile) {
    throw new Error('Missing META-INF/container.xml — this is not a valid EPUB.');
  }

  const container = parseXml(await containerFile.async('string'));
  const rootfile = container.querySelector('rootfile');
  const opfPath = rootfile && rootfile.getAttribute('full-path');
  if (!opfPath) throw new Error('The EPUB container does not point at a package document.');

  const opfFile = zip.file(opfPath);
  if (!opfFile) throw new Error(`The package document (${opfPath}) is missing from the archive.`);
  const opf = parseXml(await opfFile.async('string'));

  // --- Metadata -----------------------------------------------------------
  const dc = (name) => {
    const el = [...opf.getElementsByTagName('*')].find(
      (n) => n.localName === name && n.namespaceURI?.includes('dc/elements'),
    );
    return el ? el.textContent.trim() : '';
  };

  const metadata = {
    title: dc('title') || 'Untitled',
    author: dc('creator') || '',
    language: dc('language') || 'en',
    identifier: dc('identifier') || '',
    publisher: dc('publisher') || '',
    description: dc('description') || '',
  };

  // --- Manifest + spine ---------------------------------------------------
  const manifest = new Map();
  for (const item of opf.querySelectorAll('manifest > item')) {
    manifest.set(item.getAttribute('id'), {
      href: item.getAttribute('href'),
      mediaType: item.getAttribute('media-type') || '',
      properties: item.getAttribute('properties') || '',
      path: resolvePath(opfPath, item.getAttribute('href') || ''),
    });
  }

  // Cover: EPUB 3 `properties="cover-image"`, or the EPUB 2 <meta name="cover">.
  let coverPath = null;
  for (const item of manifest.values()) {
    if (item.properties.split(/\s+/).includes('cover-image')) coverPath = item.path;
  }
  if (!coverPath) {
    const meta = [...opf.querySelectorAll('metadata > meta')].find(
      (m) => m.getAttribute('name') === 'cover',
    );
    const ref = meta && manifest.get(meta.getAttribute('content'));
    if (ref) coverPath = ref.path;
  }

  const chapters = [];
  for (const ref of opf.querySelectorAll('spine > itemref')) {
    const id = ref.getAttribute('idref');
    const item = manifest.get(id);
    if (!item || ref.getAttribute('linear') === 'no') continue;
    const file = zip.file(item.path);
    if (!file) continue;
    const html = await file.async('string');
    chapters.push({ id, path: item.path, html, title: extractTitle(html) });
  }

  if (!chapters.length) {
    throw new Error('This EPUB has no readable chapters in its spine.');
  }

  const resources = [...manifest.values()]
    .filter((i) => !i.mediaType.includes('html') && !i.mediaType.includes('ncx'))
    .map((i) => ({ path: i.path, mediaType: i.mediaType }));

  return { zip, opfPath, metadata, coverPath, chapters, resources };
}

/** Best-effort chapter title: <title>, then the first heading. */
export function extractTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (m && m[1].trim()) return decodeEntities(m[1].trim());
  const h = html.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i);
  if (h) return decodeEntities(stripTags(h[1])).trim();
  return '';
}

export function stripTags(html) {
  return html.replace(/<[^>]+>/g, '');
}

export function decodeEntities(text) {
  const el = document.createElement('textarea');
  el.innerHTML = text;
  return el.value;
}

/**
 * Chapter HTML → a flat list of typographic blocks. This is the shared
 * intermediate representation: every "EPUB to X" converter renders from these
 * rather than re-parsing markup itself.
 *
 * @returns {Array<{ type: 'h1'|'h2'|'h3'|'p'|'blockquote'|'li'|'image', text?: string, src?: string }>}
 */
export function htmlToBlocks(html, { basePath = '' } = {}) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const body = doc.body;
  if (!body) return [];

  const blocks = [];
  const walk = (node) => {
    for (const el of node.children) {
      const tag = el.tagName.toLowerCase();
      if (tag === 'script' || tag === 'style') continue;

      if (/^h[1-6]$/.test(tag)) {
        const text = el.textContent.trim();
        if (text) blocks.push({ type: tag === 'h1' ? 'h1' : tag === 'h2' ? 'h2' : 'h3', text });
      } else if (tag === 'p') {
        const text = el.textContent.trim();
        if (text) blocks.push({ type: 'p', text });
      } else if (tag === 'blockquote') {
        const text = el.textContent.trim();
        if (text) blocks.push({ type: 'blockquote', text });
      } else if (tag === 'ul' || tag === 'ol') {
        for (const li of el.querySelectorAll(':scope > li')) {
          const text = li.textContent.trim();
          if (text) blocks.push({ type: 'li', text });
        }
      } else if (tag === 'img') {
        const src = el.getAttribute('src');
        if (src) blocks.push({ type: 'image', src: resolvePath(basePath, src) });
      } else if (el.children.length) {
        walk(el);
      } else {
        const text = el.textContent.trim();
        if (text) blocks.push({ type: 'p', text });
      }
    }
  };
  walk(body);
  return blocks;
}
