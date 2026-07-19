/**
 * EPUB → PDF.
 *
 * This genuinely re-typesets: it lays out real text runs with jsPDF's text API
 * rather than rasterising a rendered page. The output PDF therefore has
 * selectable, searchable, copyable text — which is the whole point of the tool.
 *
 * Page size and margins come from the UI's segmented controls.
 */
import { readEpub, htmlToBlocks } from '../epub/read.js';

/** Trim sizes in PostScript points (1pt = 1/72in). */
const PAGE_SIZES = {
  A4: [595.28, 841.89],
  'US Letter': [612, 792],
  '6×9″': [432, 648],
};

const MARGINS = {
  Narrow: 36, // 0.5in
  Medium: 54, // 0.75in
  Wide: 90, // 1.25in
};

const STYLES = {
  h1: { size: 22, font: 'bold', before: 26, after: 14, lead: 1.25 },
  h2: { size: 16, font: 'bold', before: 20, after: 10, lead: 1.25 },
  h3: { size: 13, font: 'bold', before: 16, after: 8, lead: 1.3 },
  p: { size: 11, font: 'normal', before: 0, after: 9, lead: 1.45 },
  blockquote: { size: 10.5, font: 'italic', before: 8, after: 10, lead: 1.5, indent: 24 },
  li: { size: 11, font: 'normal', before: 0, after: 5, lead: 1.45, indent: 16, bullet: true },
};

export async function epubToPdf(file, options = {}, onProgress = () => {}) {
  const { jsPDF } = await import('jspdf');
  const book = await readEpub(file);

  const [pw, ph] = PAGE_SIZES[options.pageSize] || PAGE_SIZES.A4;
  const margin = MARGINS[options.margins] ?? MARGINS.Medium;

  const doc = new jsPDF({ unit: 'pt', format: [pw, ph], compress: true });
  doc.setFont('times', 'normal');
  doc.setProperties({
    title: book.metadata.title,
    author: book.metadata.author,
    creator: 'Epub Studio',
  });

  const contentWidth = pw - margin * 2;
  const bottom = ph - margin;
  let y = margin;
  let firstBlockOnPage = true;

  const newPage = () => {
    doc.addPage([pw, ph]);
    y = margin;
    firstBlockOnPage = true;
  };

  const ensure = (needed) => {
    if (y + needed > bottom) newPage();
  };

  // Decode images once per book so a repeated asset isn't re-read per use.
  const imageCache = new Map();
  const loadImage = async (path) => {
    if (imageCache.has(path)) return imageCache.get(path);
    const entry = book.zip.file(path);
    if (!entry) return null;
    try {
      const b64 = await entry.async('base64');
      const ext = (path.split('.').pop() || '').toLowerCase();
      const fmt = ext === 'png' ? 'PNG' : ext === 'gif' ? 'GIF' : 'JPEG';
      if (!['png', 'jpg', 'jpeg', 'gif'].includes(ext)) {
        imageCache.set(path, null);
        return null; // jsPDF cannot embed SVG/WebP directly.
      }
      const props = doc.getImageProperties(`data:image/${ext};base64,${b64}`);
      const value = { b64, fmt, ext, w: props.width, h: props.height };
      imageCache.set(path, value);
      return value;
    } catch {
      imageCache.set(path, null);
      return null;
    }
  };

  for (let ci = 0; ci < book.chapters.length; ci++) {
    const chapter = book.chapters[ci];
    const blocks = htmlToBlocks(chapter.html, { basePath: chapter.path });

    // Chapters start on a fresh page, the way a printed book sets them.
    if (ci > 0 && !firstBlockOnPage) newPage();

    for (const block of blocks) {
      if (block.type === 'image') {
        const img = await loadImage(block.src);
        if (!img) continue;
        const scale = Math.min(contentWidth / img.w, (bottom - margin) / img.h, 1);
        const w = img.w * scale;
        const h = img.h * scale;
        ensure(h + 12);
        doc.addImage(
          `data:image/${img.ext};base64,${img.b64}`,
          img.fmt,
          margin + (contentWidth - w) / 2,
          y,
          w,
          h,
        );
        y += h + 12;
        firstBlockOnPage = false;
        continue;
      }

      const st = STYLES[block.type] || STYLES.p;
      const indent = st.indent || 0;
      doc.setFont('times', st.font);
      doc.setFontSize(st.size);

      const text = st.bullet ? `•  ${block.text}` : block.text;
      const lines = doc.splitTextToSize(text, contentWidth - indent);
      const lineHeight = st.size * st.lead;

      if (!firstBlockOnPage) y += st.before;

      for (const line of lines) {
        ensure(lineHeight);
        doc.text(line, margin + indent, y + st.size);
        y += lineHeight;
      }
      y += st.after;
      firstBlockOnPage = false;
    }

    onProgress(Math.round(((ci + 1) / book.chapters.length) * 100));
  }

  // Page numbers, centred in the bottom margin — skipped on page 1.
  const total = doc.getNumberOfPages();
  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  for (let i = 2; i <= total; i++) {
    doc.setPage(i);
    doc.text(String(i), pw / 2, ph - margin / 2, { align: 'center' });
  }

  return {
    blob: doc.output('blob'),
    filename: baseName(file.name) + '.pdf',
  };
}

export const baseName = (name) => name.replace(/\.[^.]+$/, '');
