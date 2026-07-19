import JSZip from 'jszip';
import sharp from 'sharp';
import { Document, Packer, Paragraph, HeadingLevel, TextRun } from 'docx';
import { writeFileSync } from 'node:fs';
const OUT = process.argv[2];

// --- CBZ: three real JPEG pages -----------------------------------------
const zip = new JSZip();
for (let i = 1; i <= 3; i++) {
  const png = await sharp({
    create: { width: 800, height: 1200, channels: 3, background: { r: 250 - i * 20, g: 247, b: 242 } },
  }).jpeg().toBuffer();
  zip.file(`page${i}.jpg`, png);
}
writeFileSync(`${OUT}/sample-comic.cbz`, await zip.generateAsync({ type: 'nodebuffer' }));

// --- DOCX: headings + paragraphs ----------------------------------------
const doc = new Document({
  creator: 'Epub Studio Fixtures',
  title: 'A Manuscript',
  sections: [{ children: [
    new Paragraph({ text: 'Chapter One', heading: HeadingLevel.HEADING_1 }),
    new Paragraph({ children: [new TextRun('It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.')] }),
    new Paragraph({ text: 'A subsection', heading: HeadingLevel.HEADING_2 }),
    new Paragraph({ children: [new TextRun('However little known the feelings of such a man may be.')] }),
    new Paragraph({ text: 'Chapter Two', heading: HeadingLevel.HEADING_1 }),
    new Paragraph({ children: [new TextRun('Mr. Bennet was among the earliest of those who waited on Mr. Bingley.')] }),
  ]}],
});
writeFileSync(`${OUT}/manuscript.docx`, await Packer.toBuffer(doc));
console.log('fixtures written');
