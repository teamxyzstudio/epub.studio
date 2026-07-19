/**
 * EPUB 3 writer — assembles a spec-valid .epub from chapters + resources.
 *
 * Every "X to EPUB" converter funnels through `buildEpub`, so the output
 * structure (and therefore its validity) is defined in exactly one place.
 */
import JSZip from 'jszip';

const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const CONTAINER = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;

const STYLESHEET = `body{margin:5%;line-height:1.5;text-align:justify;hyphens:auto}
h1,h2,h3{line-height:1.2;text-align:left;page-break-after:avoid}
h1{font-size:1.8em;margin:1em 0 .6em}
h2{font-size:1.4em;margin:1.4em 0 .5em}
h3{font-size:1.15em;margin:1.2em 0 .4em}
p{margin:0;text-indent:1.2em}
p:first-of-type,h1+p,h2+p,h3+p,blockquote p{text-indent:0}
blockquote{margin:1em 2em;font-style:italic}
img{max-width:100%;height:auto}
figure{margin:1em 0;text-align:center}`;

const MIME_BY_EXT = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  webp: 'image/webp',
};

export const mimeForPath = (path) =>
  MIME_BY_EXT[(path.split('.').pop() || '').toLowerCase()] || 'application/octet-stream';

function xhtml(title, bodyHtml, lang) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${esc(lang)}" xml:lang="${esc(lang)}">
<head>
  <meta charset="utf-8"/>
  <title>${esc(title)}</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
${bodyHtml}
</body>
</html>`;
}

/**
 * @param {object} book
 * @param {{title?: string, author?: string, language?: string, identifier?: string, publisher?: string, description?: string}} book.metadata
 * @param {Array<{ title: string, html: string }>} book.chapters  Body-level XHTML, already escaped/well-formed.
 * @param {Array<{ name: string, data: Uint8Array|ArrayBuffer|Blob, mediaType?: string }>} [book.resources]
 * @param {{ name: string, data: Uint8Array|ArrayBuffer|Blob } | null} [book.cover] A cover that is not already in `resources`.
 * @param {string} [book.coverName] Name of an *existing* resource to mark as the cover.
 *   Use this instead of `cover` when the image is already in `resources` — adding it
 *   twice would put two manifest entries on one file, which is invalid EPUB.
 * @returns {Promise<Blob>}
 */
export async function buildEpub({
  metadata = {},
  chapters = [],
  resources = [],
  cover = null,
  coverName = '',
}) {
  const meta = {
    title: metadata.title || 'Untitled',
    author: metadata.author || 'Unknown',
    language: metadata.language || 'en',
    // A stable, valid identifier. Real publishing pipelines would mint a UUID
    // per book; urn:uuid with a random v4 is correct and offline-safe.
    identifier: metadata.identifier || `urn:uuid:${crypto.randomUUID()}`,
    publisher: metadata.publisher || '',
    description: metadata.description || '',
  };

  const zip = new JSZip();

  // The mimetype entry must be first and STORED (uncompressed) — this is the
  // one part of the EPUB spec that constrains the ZIP layout itself.
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });
  zip.file('META-INF/container.xml', CONTAINER);

  const oebps = zip.folder('OEBPS');
  oebps.file('style.css', STYLESHEET);

  const chapterFiles = chapters.map((ch, i) => ({
    id: `chap${i + 1}`,
    name: `chapter-${String(i + 1).padStart(3, '0')}.xhtml`,
    title: ch.title || `Chapter ${i + 1}`,
    html: ch.html,
  }));

  for (const ch of chapterFiles) {
    oebps.file(ch.name, xhtml(ch.title, ch.html, meta.language));
  }

  for (const res of resources) {
    oebps.file(res.name, res.data);
  }
  if (cover) oebps.file(cover.name, cover.data);

  // --- Navigation (EPUB 3 nav doc + EPUB 2 NCX for older readers) ----------
  const navItems = chapterFiles
    .map((c) => `      <li><a href="${c.name}">${esc(c.title)}</a></li>`)
    .join('\n');

  oebps.file(
    'nav.xhtml',
    `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${esc(meta.language)}">
<head><meta charset="utf-8"/><title>Contents</title></head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>Contents</h1>
    <ol>
${navItems}
    </ol>
  </nav>
</body>
</html>`,
  );

  oebps.file(
    'toc.ncx',
    `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head><meta name="dtb:uid" content="${esc(meta.identifier)}"/></head>
  <docTitle><text>${esc(meta.title)}</text></docTitle>
  <navMap>
${chapterFiles
  .map(
    (c, i) =>
      `    <navPoint id="np${i + 1}" playOrder="${i + 1}"><navLabel><text>${esc(c.title)}</text></navLabel><content src="${c.name}"/></navPoint>`,
  )
  .join('\n')}
  </navMap>
</ncx>`,
  );

  // --- Package document ---------------------------------------------------
  const manifestItems = [
    '    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>',
    '    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>',
    '    <item id="css" href="style.css" media-type="text/css"/>',
    ...chapterFiles.map(
      (c) => `    <item id="${c.id}" href="${c.name}" media-type="application/xhtml+xml"/>`,
    ),
    ...resources.map(
      (r, i) =>
        `    <item id="res${i + 1}" href="${esc(r.name)}" media-type="${r.mediaType || mimeForPath(r.name)}"${
          r.name === coverName ? ' properties="cover-image"' : ''
        }/>`,
    ),
  ];
  if (cover) {
    manifestItems.push(
      `    <item id="cover-image" href="${esc(cover.name)}" media-type="${mimeForPath(cover.name)}" properties="cover-image"/>`,
    );
  }

  oebps.file(
    'content.opf',
    `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="bookid">${esc(meta.identifier)}</dc:identifier>
    <dc:title>${esc(meta.title)}</dc:title>
    <dc:creator>${esc(meta.author)}</dc:creator>
    <dc:language>${esc(meta.language)}</dc:language>
${meta.publisher ? `    <dc:publisher>${esc(meta.publisher)}</dc:publisher>\n` : ''}${meta.description ? `    <dc:description>${esc(meta.description)}</dc:description>\n` : ''}    <meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d+Z$/, 'Z')}</meta>
  </metadata>
  <manifest>
${manifestItems.join('\n')}
  </manifest>
  <spine toc="ncx">
${chapterFiles.map((c) => `    <itemref idref="${c.id}"/>`).join('\n')}
  </spine>
</package>`,
  );

  return zip.generateAsync({
    type: 'blob',
    mimeType: 'application/epub+zip',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}

/** Escape text and wrap it in a paragraph — the common case for text importers. */
export const p = (text) => `  <p>${esc(text)}</p>`;
export const heading = (level, text) => `  <h${level}>${esc(text)}</h${level}>`;
export { esc };
