/**
 * EPUB → DOCX / TXT — the remaining "convert from EPUB" directions that can be
 * done honestly in the browser.
 */
import { readEpub, htmlToBlocks } from '../epub/read.js';
import { baseName } from './epub-to-pdf.js';

export async function epubToDocx(file, options = {}, onProgress = () => {}) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx');
  const book = await readEpub(file);

  const children = [];
  for (let ci = 0; ci < book.chapters.length; ci++) {
    const chapter = book.chapters[ci];
    if (ci > 0) children.push(new Paragraph({ text: '', pageBreakBefore: true }));

    for (const block of htmlToBlocks(chapter.html, { basePath: chapter.path })) {
      switch (block.type) {
        case 'h1':
          children.push(new Paragraph({ text: block.text, heading: HeadingLevel.HEADING_1 }));
          break;
        case 'h2':
          children.push(new Paragraph({ text: block.text, heading: HeadingLevel.HEADING_2 }));
          break;
        case 'h3':
          children.push(new Paragraph({ text: block.text, heading: HeadingLevel.HEADING_3 }));
          break;
        case 'blockquote':
          children.push(
            new Paragraph({
              children: [new TextRun({ text: block.text, italics: true })],
              indent: { left: 720 },
              spacing: { before: 120, after: 120 },
            }),
          );
          break;
        case 'li':
          children.push(new Paragraph({ text: block.text, bullet: { level: 0 } }));
          break;
        case 'image':
          // Images are dropped rather than silently mangled; a note keeps the
          // reader aware that something was there.
          break;
        default:
          children.push(
            new Paragraph({
              text: block.text,
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 120 },
            }),
          );
      }
    }
    onProgress(Math.round(((ci + 1) / book.chapters.length) * 100));
  }

  const doc = new Document({
    creator: book.metadata.author || 'Epub Studio',
    title: book.metadata.title,
    description: book.metadata.description,
    sections: [{ children }],
  });

  const blob = await Packer.toBlob(doc);
  return { blob, filename: baseName(file.name) + '.docx' };
}

export async function epubToTxt(file, options = {}, onProgress = () => {}) {
  const book = await readEpub(file);
  const parts = [];

  parts.push(book.metadata.title);
  if (book.metadata.author) parts.push(`by ${book.metadata.author}`);
  parts.push('', '');

  for (let ci = 0; ci < book.chapters.length; ci++) {
    const chapter = book.chapters[ci];
    for (const block of htmlToBlocks(chapter.html, { basePath: chapter.path })) {
      if (block.type === 'image') continue;
      if (block.type === 'h1' || block.type === 'h2' || block.type === 'h3') {
        parts.push('', block.text.toUpperCase(), '');
      } else if (block.type === 'li') {
        parts.push(`  - ${block.text}`);
      } else {
        parts.push(block.text, '');
      }
    }
    parts.push('');
    onProgress(Math.round(((ci + 1) / book.chapters.length) * 100));
  }

  const blob = new Blob([parts.join('\n')], { type: 'text/plain;charset=utf-8' });
  return { blob, filename: baseName(file.name) + '.txt' };
}
