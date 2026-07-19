/**
 * Applies Style Studio settings to a real EPUB.
 *
 * This is what makes the studio more than a preview: it rewrites the book's
 * stylesheet, updates its metadata, and optionally embeds the chosen typeface,
 * then repackages the archive.
 */
import JSZip from 'jszip';
import { buildEpubCss, outputName, fontStack } from './settings.js';
import { resolvePath } from '../epub/read.js';

const CSS_NAME = 'epub-studio.css';

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Locate the woff2 the browser already loaded for a family, by reading the
 * @font-face rules Fontsource injected. Avoids hard-coding paths that change
 * with every package version.
 */
export function findFontUrl(family) {
  for (const sheet of document.styleSheets) {
    let rules;
    try {
      rules = sheet.cssRules;
    } catch {
      continue; // cross-origin sheet
    }
    if (!rules) continue;
    for (const rule of rules) {
      if (rule.constructor.name !== 'CSSFontFaceRule' && rule.type !== 5) continue;
      const fam = (rule.style.fontFamily || '').replace(/['"]/g, '').trim();
      if (fam.toLowerCase() !== family.toLowerCase()) continue;
      const weight = (rule.style.fontWeight || '400').trim();
      const style = (rule.style.fontStyle || 'normal').trim();
      if (style !== 'normal' || !(weight === '400' || weight === 'normal')) continue;
      const m = /url\(["']?([^"')]+)["']?\)/.exec(rule.style.src || '');
      if (m && /\.woff2?($|\?)/i.test(m[1])) return m[1];
    }
  }
  return null;
}

function setDc(opfXml, name, value) {
  const re = new RegExp(`<(dc:${name}|${name})(\\s[^>]*)?>([\\s\\S]*?)</\\1>`, 'i');
  if (re.test(opfXml)) {
    return opfXml.replace(re, (_m, tag, attrs = '') => `<${tag}${attrs || ''}>${esc(value)}</${tag}>`);
  }
  return opfXml.replace(/<\/metadata>/i, `  <dc:${name}>${esc(value)}</dc:${name}>\n</metadata>`);
}

/**
 * @param {Blob|File} file      the source EPUB
 * @param {object}    settings  Style Studio's saved settings
 * @param {(pct:number)=>void} [onProgress]
 * @returns {Promise<{ blob: Blob, filename: string, embeddedBytes: number }>}
 */
export async function applyStyleToEpub(file, settings, onProgress = () => {}) {
  const zip = await JSZip.loadAsync(file);
  onProgress(10);

  const containerFile = zip.file('META-INF/container.xml');
  if (!containerFile) throw new Error('This is not a valid EPUB — META-INF/container.xml is missing.');
  const opfPath = (await containerFile.async('string')).match(/full-path="([^"]+)"/)?.[1];
  if (!opfPath) throw new Error('The EPUB container does not point at a package document.');

  let opf = await zip.file(opfPath).async('string');
  const opfDoc = new DOMParser().parseFromString(opf, 'application/xml');
  onProgress(20);

  // --- Optional font embedding -------------------------------------------
  let embeddedHref = '';
  let embeddedBytes = 0;
  if (settings.embed && !settings.keepOriginal) {
    const url = findFontUrl(settings.font);
    if (url) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const bytes = new Uint8Array(await res.arrayBuffer());
          const ext = /\.woff2($|\?)/i.test(url) ? 'woff2' : 'woff';
          embeddedHref = `fonts/${settings.font.toLowerCase().replace(/\s+/g, '-')}.${ext}`;
          zip.file(resolvePath(opfPath, embeddedHref), bytes);
          embeddedBytes = bytes.length;
        }
      } catch {
        // Embedding is a nicety — a failure must not lose the user's book.
      }
    }
  }
  onProgress(40);

  // --- Stylesheet ---------------------------------------------------------
  const css = buildEpubCss(settings, embeddedHref ? embeddedHref.split('/').pop() : '');
  const cssPath = resolvePath(opfPath, CSS_NAME);
  zip.file(cssPath, css);
  // The @font-face url is relative to the CSS file, which sits beside the OPF.
  if (embeddedHref) {
    zip.file(cssPath, buildEpubCss(settings, embeddedHref));
  }
  onProgress(50);

  // --- Manifest -----------------------------------------------------------
  const hasCssItem = [...opfDoc.querySelectorAll('manifest > item')].some(
    (i) => i.getAttribute('href') === CSS_NAME,
  );
  const additions = [];
  if (!hasCssItem) {
    additions.push(`    <item id="epubstudio-css" href="${CSS_NAME}" media-type="text/css"/>`);
  }
  if (embeddedHref) {
    const mediaType = embeddedHref.endsWith('woff2') ? 'font/woff2' : 'font/woff';
    additions.push(
      `    <item id="epubstudio-font" href="${esc(embeddedHref)}" media-type="${mediaType}"/>`,
    );
  }
  if (additions.length) {
    opf = opf.replace(/<\/manifest>/i, `${additions.join('\n')}\n</manifest>`);
  }

  // --- Metadata -----------------------------------------------------------
  if (settings.title) opf = setDc(opf, 'title', settings.title);
  if (settings.author) opf = setDc(opf, 'creator', settings.author);
  if (settings.language) opf = setDc(opf, 'language', settings.language);
  zip.file(opfPath, opf);
  onProgress(60);

  // --- Link the stylesheet into every content document --------------------
  // The book's own stylesheets are removed rather than layered under ours.
  // Re-typesetting means replacing the book's design; leaving the original CSS
  // in place would let its class-based rules out-specify these element rules,
  // and the settings would silently do nothing.
  const manifest = new Map();
  for (const item of opfDoc.querySelectorAll('manifest > item')) {
    manifest.set(item.getAttribute('id'), {
      href: item.getAttribute('href'),
      mediaType: item.getAttribute('media-type') || '',
    });
  }

  const spine = [...opfDoc.querySelectorAll('spine > itemref')]
    .map((r) => manifest.get(r.getAttribute('idref')))
    .filter((i) => i && i.mediaType.includes('html'));

  for (let i = 0; i < spine.length; i++) {
    const path = resolvePath(opfPath, spine[i].href);
    const entry = zip.file(path);
    if (!entry) continue;

    let html = await entry.async('string');
    // Depth from this document back to the OPF folder, so the href resolves.
    const depth = path.split('/').length - opfPath.split('/').length;
    const prefix = depth > 0 ? '../'.repeat(depth) : '';

    html = html
      .replace(/<link[^>]+rel=["']stylesheet["'][^>]*>\s*/gi, '')
      .replace(/<style[\s\S]*?<\/style>\s*/gi, '');

    const link = `<link rel="stylesheet" type="text/css" href="${prefix}${CSS_NAME}"/>`;
    html = /<\/head>/i.test(html)
      ? html.replace(/<\/head>/i, `  ${link}\n</head>`)
      : html.replace(/<body/i, `<head>${link}</head><body`);

    zip.file(path, html);
    onProgress(60 + Math.round(((i + 1) / Math.max(spine.length, 1)) * 35));
  }

  const blob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/epub+zip',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
  onProgress(100);

  return { blob, filename: outputName(settings.title), embeddedBytes };
}

export { fontStack };
