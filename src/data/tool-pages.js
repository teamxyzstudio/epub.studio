/**
 * Per-tool page content: headline, options, how-to, explainer, FAQ, related.
 *
 * The EPUB → PDF entry is transcribed verbatim from `mocks/EPUB to PDF.dc.html`
 * (h1, subtitle, the three how-to cards, the EPUB-vs-PDF explainer and all five
 * FAQ answers). The other twenty entries follow the same shape with copy
 * written for this build — they are drafts to review, not handoff content.
 */
import { allTools, toolBySlug } from './tools.js';

const SIZE_OPTS = {
  key: 'pageSize',
  label: 'Page size',
  choices: ['A4', 'US Letter', '6×9″'],
  value: 'A4',
};
const MARGIN_OPTS = {
  key: 'margins',
  label: 'Margins',
  choices: ['Narrow', 'Medium', 'Wide'],
  value: 'Medium',
};

/** Shared FAQ answers, so privacy/size/DRM copy stays consistent site-wide. */
const COMMON = {
  size: {
    q: 'Is there a file size limit?',
    a: 'There is no size cap — nothing is uploaded, so no server quota applies. The real ceiling is your device’s memory, because the whole file is held in RAM while it converts: a novel is trivial anywhere, a very large illustrated book can be slow or run out of memory on an older phone. If one struggles, run it through the EPUB Compressor first — it usually shrinks image-heavy books by half.',
  },
  privacy: {
    q: 'Are my files private?',
    a: 'This tool runs entirely inside your browser — your file is never uploaded anywhere. It stays on your device, and closing the tab is all it takes to remove it.',
  },
  drm: {
    q: 'Does this work with DRM-protected books?',
    a: 'No. Files with DRM can’t be opened by any converter. This tool works with DRM-free files — like the ones you export from your own writing tools or buy from DRM-free stores.',
  },
  free: {
    q: 'Is it really free?',
    a: 'Yes. Every tool, no size cap, no account. There is no paid tier and nothing is held back.',
  },
};

const groupOf = (slug) => {
  if (slug.startsWith('epub-to-')) return 'Convert from EPUB';
  if (slug.endsWith('-to-epub')) return 'Convert to EPUB';
  if (slug.endsWith('-to-pdf')) return 'Convert to PDF';
  return 'EPUB utilities';
};

/** @type {Record<string, object>} */
const pages = {
  // =========================================================================
  // Convert from EPUB
  // =========================================================================
  'epub-to-pdf': {
    h1: 'Convert EPUB to PDF',
    lede: 'Turn a reflowable ebook into a fixed, printable PDF — free, in your browser, no signup.',
    accept: '.epub',
    dropHeadline: 'Drop your EPUB here, or click to choose',
    dropSub: '.epub · any size your device can handle',
    cta: 'Convert to PDF',
    doneTitle: 'Your PDF is ready',
    downloadLabel: 'Download PDF',
    options: [SIZE_OPTS, MARGIN_OPTS],
    howToTitle: 'How to convert EPUB to PDF',
    howTo: [
      {
        t: 'Choose your EPUB',
        d: 'Drop the file above or tap to pick one from your device.',
      },
      {
        t: 'Set page size and margins',
        d: 'A4 or Letter for printing, 6×9″ for a book-like page. Defaults work fine.',
      },
      {
        t: 'Convert and download',
        d: 'Press Convert to PDF, then Download PDF. Nothing leaves your device.',
      },
    ],
    explainerTitle: 'EPUB vs PDF — what changes',
    explainer: [
      {
        kicker: 'EPUB — REFLOWABLE',
        body: 'Text reflows to fit any screen. Readers control text size, font and theme. Page numbers don’t exist — position is a percentage.',
      },
      {
        kicker: 'PDF — FIXED',
        body: 'Every page is frozen at the size you choose here. Perfect for printing and annotation; text no longer adapts to the screen.',
      },
    ],
    faqs: [
      {
        q: 'Will my PDF keep the book’s formatting?',
        a: 'Chapters, headings, images and lists carry over. Because PDF pages are fixed, line breaks are set at the page size you choose here rather than by your reading app.',
      },
      COMMON.size,
      COMMON.privacy,
      {
        q: 'Why does my PDF look different from my e-reader?',
        a: 'Your e-reader applies its own font and spacing. The PDF is typeset fresh at a fixed page size. Pick 6×9″ with Medium margins for the most book-like result.',
      },
      COMMON.drm,
    ],
    related: ['epub-to-docx', 'epub-to-azw3', 'pdf-to-epub', 'epub-compressor'],
  },

  'azw3-to-pdf': {
    h1: 'Convert AZW3 to PDF',
    lede: 'Turn a DRM-free Kindle book into a fixed, printable PDF — free, in your browser, no signup.',
    accept: '.azw3,.azw',
    dropHeadline: 'Drop your AZW3 here, or click to choose',
    dropSub: '.azw3 · .azw · any size your device can handle',
    cta: 'Convert to PDF',
    doneTitle: 'Your PDF is ready',
    downloadLabel: 'Download PDF',
    options: [SIZE_OPTS, MARGIN_OPTS],
    howToTitle: 'How to convert AZW3 to PDF',
    howTo: [
      {
        t: 'Choose your AZW3',
        d: 'Drop a DRM-free .azw3 or .azw file above — one you sideloaded, exported, or bought DRM-free.',
      },
      {
        t: 'Set page size and margins',
        d: 'A4 or Letter for printing, 6×9″ for a book-like page. Defaults work fine.',
      },
      {
        t: 'Convert and download',
        d: 'The book is unpacked to EPUB, then typeset as a PDF — all on your device.',
      },
    ],
    explainerTitle: 'The DRM question, answered honestly',
    explainer: [
      {
        kicker: 'WORKS — DRM-FREE FILES',
        body: 'Sideloaded books, files from DRM-free stores, and your own exports open fine. The converter reads the AZW3 container directly in your browser.',
      },
      {
        kicker: 'BLOCKED — KINDLE STORE BOOKS',
        body: 'Most books bought from the Kindle store carry DRM, and no converter can open them — this one included. We don’t remove DRM, here or anywhere.',
      },
    ],
    faqs: [
      {
        q: 'Why does my Kindle store book fail to convert?',
        a: 'It is almost certainly DRM-protected. DRM-locked files cannot be opened by any converter, and removing DRM is not something this site does. The tool works on DRM-free files: sideloaded books, DRM-free store purchases, and files you produced yourself.',
      },
      {
        q: 'What about KFX files?',
        a: 'KFX is Amazon’s newest download format and stays locked to Kindle apps. This tool reads AZW3 and AZW. If you have a DRM-free MOBI instead, the MOBI to PDF tool takes it.',
      },
      COMMON.size,
      COMMON.privacy,
      COMMON.free,
    ],
    related: ['mobi-to-pdf', 'azw3-to-epub', 'epub-to-pdf', 'epub-reader'],
  },

  'mobi-to-pdf': {
    h1: 'Convert MOBI to PDF',
    lede: 'Rescue an old MOBI file as a fixed, printable PDF — free, in your browser, no signup.',
    accept: '.mobi,.prc',
    dropHeadline: 'Drop your MOBI here, or click to choose',
    dropSub: '.mobi · .prc · any size your device can handle',
    cta: 'Convert to PDF',
    doneTitle: 'Your PDF is ready',
    downloadLabel: 'Download PDF',
    options: [SIZE_OPTS, MARGIN_OPTS],
    howToTitle: 'How to convert MOBI to PDF',
    howTo: [
      {
        t: 'Choose your MOBI',
        d: 'Drop the .mobi or .prc file above — the format is retired, but the files still open fine.',
      },
      {
        t: 'Set page size and margins',
        d: 'A4 or Letter for printing, 6×9″ for a book-like page.',
      },
      {
        t: 'Convert and download',
        d: 'The book is unpacked to EPUB, then typeset as a PDF — all on your device.',
      },
    ],
    explainerTitle: 'MOBI vs PDF — what changes',
    explainer: [
      {
        kicker: 'MOBI — RETIRED, REFLOWABLE',
        body: 'A Palm-era format Amazon retired in 2022. Text reflows, styling is minimal, and fewer and fewer apps open it.',
      },
      {
        kicker: 'PDF — FIXED, UNIVERSAL',
        body: 'Every page frozen at the size you choose, readable on anything with a screen, printable forever.',
      },
    ],
    faqs: [
      {
        q: 'Would EPUB be a better target than PDF?',
        a: 'If you want to keep reading on an e-reader, yes — EPUB stays reflowable, and the MOBI to EPUB tool does that conversion. Choose PDF when you want printing, annotation, or a file that renders identically everywhere.',
      },
      COMMON.drm,
      COMMON.size,
      COMMON.privacy,
      COMMON.free,
    ],
    related: ['mobi-to-epub', 'azw3-to-pdf', 'epub-to-pdf', 'epub-reader'],
  },

  'cbz-to-pdf': {
    h1: 'Convert CBZ to PDF',
    lede: 'Turn a comic book archive into a PDF you can read and share anywhere — free, in your browser.',
    accept: '.cbz',
    dropHeadline: 'Drop your CBZ here, or click to choose',
    dropSub: '.cbz · any size your device can handle',
    cta: 'Convert to PDF',
    doneTitle: 'Your PDF is ready',
    downloadLabel: 'Download PDF',
    options: [SIZE_OPTS],
    howToTitle: 'How to convert CBZ to PDF',
    howTo: [
      {
        t: 'Choose your CBZ',
        d: 'Drop the comic archive above. Pages stay in their reading order.',
      },
      {
        t: 'Pick a page size',
        d: 'A4 works for most comics; 6×9″ gives a digest-sized page.',
      },
      {
        t: 'Convert and download',
        d: 'Every page is placed onto a PDF page — all on your device, nothing uploaded.',
      },
    ],
    explainerTitle: 'CBZ vs PDF — what changes',
    explainer: [
      {
        kicker: 'CBZ — A ZIP OF PAGES',
        body: 'A comic archive is simply images in a zip, named in reading order. Comic apps read it natively; most other software does not.',
      },
      {
        kicker: 'PDF — READS ANYWHERE',
        body: 'The same pages, wrapped in a format every phone, tablet and laptop opens without a special app.',
      },
    ],
    faqs: [
      {
        q: 'What about CBR files?',
        a: 'CBR is the same idea inside a RAR archive, which browsers cannot unpack. Convert the CBR to CBZ first with a desktop tool (or re-zip the images), then drop it here. Renaming the extension is not enough — the container really is different.',
      },
      {
        q: 'Will image quality drop?',
        a: 'No. Your pages are placed into the PDF as-is, not recompressed. The PDF is roughly the size of the original archive.',
      },
      COMMON.size,
      COMMON.privacy,
      COMMON.free,
    ],
    related: ['cbz-to-epub', 'epub-to-pdf', 'epub-compressor', 'epub-reader'],
  },

  'epub-to-mobi': {
    h1: 'EPUB to MOBI: what to do instead',
    lede: 'Amazon retired MOBI in 2022. Here is the honest answer about converting to it — and the route that actually works.',
    mode: 'guidance',
    guidance: {
      kicker: 'WE DO NOT CONVERT TO MOBI',
      title: 'You almost certainly do not need a MOBI file',
      body: [
        'Writing MOBI requires Amazon’s own toolchain, which cannot run in a browser. We could upload your book to a server to do it — but every other tool here runs on your device, and we are not going to make an exception that quietly sends your files away.',
        'The better news: since August 2022, Send-to-Kindle accepts EPUB directly. Amazon converts it on their end. For any Kindle bought in the last decade, emailing the EPUB to your @kindle.com address is faster than converting and produces a better result.',
      ],
      actions: [
        { label: 'How to send an EPUB to your Kindle', href: '/blog/send-epub-to-kindle' },
        { label: 'Convert MOBI files you already have to EPUB', href: '/mobi-to-epub' },
      ],
      fallback:
        'Genuinely need a .mobi file for a pre-2011 device? Calibre is free, open source and runs on your desktop — it is the right tool for that job.',
    },
    howToTitle: 'What to do instead',
    howTo: [
      { t: 'Check your Kindle', d: 'Anything from the Touch generation onward reads EPUB via Send-to-Kindle. No conversion needed.' },
      { t: 'Email the EPUB', d: 'Send it to your @kindle.com address from an approved sender. Amazon handles the rest.' },
      { t: 'Only if the device is ancient', d: 'For a pre-2011 Kindle, use Calibre on your desktop to produce a MOBI.' },
    ],
    explainerTitle: 'Why MOBI went away',
    explainer: [
      {
        kicker: 'MOBI — RETIRED',
        body: 'Designed in 2000 for Palm-era hardware. No embedded fonts, minimal CSS. Amazon replaced it with KF8 in 2011 and stopped accepting it for Send-to-Kindle in 2022.',
      },
      {
        kicker: 'EPUB — ACCEPTED',
        body: 'The open standard, and now the format Amazon prefers you send. It is also readable everywhere else, which MOBI never was.',
      },
    ],
    faqs: [
      {
        q: 'Why will you not just convert it on a server?',
        a: 'Because every other tool on this site runs entirely in your browser and never uploads anything. Adding one tool that silently works differently would undermine the promise the rest of the site makes. Calibre does this locally on your desktop, and we would rather point you there.',
      },
      {
        q: 'Will my old MOBI files stop working?',
        a: 'No. Files already on a device keep working. You just cannot email new ones to Amazon any more.',
      },
      {
        q: 'What about AZW3?',
        a: 'Same situation — it needs Amazon’s toolchain. And the same answer: send the EPUB instead.',
      },
      COMMON.privacy,
      COMMON.free,
    ],
    related: ['mobi-to-epub', 'azw3-to-epub', 'epub-to-pdf', 'epub-metadata-editor'],
  },

  'epub-to-azw3': {
    h1: 'EPUB to AZW3: what to do instead',
    lede: 'Modern Kindles accept EPUB directly. Here is why we do not convert to AZW3, and what to do instead.',
    mode: 'guidance',
    guidance: {
      kicker: 'WE DO NOT CONVERT TO AZW3',
      title: 'Send the EPUB — your Kindle already reads it',
      body: [
        'AZW3 is Amazon’s KF8 format, and writing it requires their own toolchain. That cannot run in a browser, and we are not willing to upload your book to a server when every other tool here works on your device.',
        'It also is not necessary. Since 2022 Send-to-Kindle takes EPUB directly and converts it to whatever your device needs. You get the same result with fewer steps, and Amazon’s converter is the one their own devices are tuned for.',
      ],
      actions: [
        { label: 'How to send an EPUB to your Kindle', href: '/blog/send-epub-to-kindle' },
        { label: 'Convert AZW3 files you already have to EPUB', href: '/azw3-to-epub' },
      ],
      fallback:
        'Want to control the conversion yourself and hold an .azw3 file? Calibre is free, open source, and does it locally on your desktop.',
    },
    howToTitle: 'What to do instead',
    howTo: [
      { t: 'Style the book first', d: 'Set the typeface, spacing and theme in Style Studio so the EPUB you send is already typeset the way you want.' },
      { t: 'Email it to your Kindle', d: 'Send the EPUB to your @kindle.com address from an approved sender address.' },
      { t: 'Or use USB', d: 'Modern Kindles read EPUB over USB too — drop it into the documents folder.' },
    ],
    explainerTitle: 'AZW3 vs sending EPUB',
    explainer: [
      {
        kicker: 'CONVERTING TO AZW3',
        body: 'Needs desktop software. Gives you a file you can archive and sideload. Worth it if you want the conversion under your control.',
      },
      {
        kicker: 'SENDING THE EPUB',
        body: 'No conversion step, syncs across devices, backed up to your account, and Amazon optimises for the specific device. Right for almost everyone.',
      },
    ],
    faqs: [
      {
        q: 'Will my Kindle really open an EPUB?',
        a: 'Through Send-to-Kindle, yes — Amazon converts it on arrival. Any Kindle from the Touch generation onward works this way.',
      },
      {
        q: 'Why not run the conversion on a server?',
        a: 'Every other tool here runs in your browser and never uploads your files. We would rather point you at Calibre, which also runs locally, than break that promise for one format.',
      },
      {
        q: 'Can I still get my books off a Kindle?',
        a: 'Yes — AZW3 to EPUB works in your browser, for any DRM-free file.',
      },
      COMMON.privacy,
      COMMON.drm,
    ],
    related: ['azw3-to-epub', 'mobi-to-epub', 'epub-to-pdf', 'epub-metadata-editor'],
  },

  'epub-to-docx': {
    h1: 'Convert EPUB to Word (DOCX)',
    lede: 'Get an editable Word document from an ebook — headings, paragraphs and lists intact.',
    accept: '.epub',
    cta: 'Convert to DOCX',
    doneTitle: 'Your DOCX is ready',
    downloadLabel: 'Download DOCX',
    options: [],
    howTo: [
      { t: 'Choose your EPUB', d: 'Drop the file above or tap to pick one from your device.' },
      { t: 'Convert', d: 'Chapters become page breaks; headings become real Word heading styles.' },
      { t: 'Open and edit', d: 'Works in Word, Google Docs, LibreOffice and Pages.' },
    ],
    explainerTitle: 'What carries over',
    explainer: [
      {
        kicker: 'KEPT',
        body: 'Heading levels, paragraphs, bullet and numbered lists, block quotes, and one page break per chapter.',
      },
      {
        kicker: 'SIMPLIFIED',
        body: 'The book’s CSS is replaced by Word’s own styles, so you get a clean editable document rather than a pixel copy.',
      },
    ],
    faqs: [
      {
        q: 'Are headings real Word headings?',
        a: 'Yes — they use Heading 1/2/3 styles, so Word’s navigation pane and automatic table of contents both work.',
      },
      { q: 'Can I open it in Google Docs?', a: 'Yes. Upload the .docx to Drive and open it with Docs.' },
      COMMON.size,
      COMMON.privacy,
      COMMON.drm,
    ],
    related: ['docx-to-epub', 'epub-to-txt', 'epub-to-pdf', 'epub-metadata-editor'],
  },

  'epub-to-txt': {
    h1: 'Convert EPUB to plain text',
    lede: 'Strip an ebook down to its words — for searching, scripting or reading anywhere.',
    accept: '.epub',
    cta: 'Convert to TXT',
    doneTitle: 'Your text file is ready',
    downloadLabel: 'Download TXT',
    options: [],
    howTo: [
      { t: 'Choose your EPUB', d: 'Drop the file above or tap to pick one from your device.' },
      { t: 'Convert', d: 'Markup and images are removed; chapter titles are kept as plain headings.' },
      { t: 'Download', d: 'You get one UTF-8 .txt file with the whole book in reading order.' },
    ],
    faqs: [
      {
        q: 'What happens to images and tables?',
        a: 'Images are dropped entirely. Table cells come through as text, which may read oddly for complex tables.',
      },
      {
        q: 'What encoding is the file?',
        a: 'UTF-8, so accented characters, curly quotes and non-Latin scripts all survive.',
      },
      COMMON.privacy,
      COMMON.drm,
      COMMON.free,
    ],
    related: ['txt-to-epub', 'epub-to-docx', 'epub-to-pdf', 'epub-reader'],
  },

  // =========================================================================
  // Convert to EPUB
  // =========================================================================
  'pdf-to-epub': {
    h1: 'Convert PDF to EPUB',
    lede: 'Free a book from fixed pages so the text reflows on a phone, tablet or e-reader.',
    accept: '.pdf',
    dropSub: '.pdf · any size your device can handle',
    cta: 'Convert to EPUB',
    doneTitle: 'Your EPUB is ready',
    downloadLabel: 'Download EPUB',
    options: [],
    howTo: [
      { t: 'Choose your PDF', d: 'Drop the file above or tap to pick one from your device.' },
      { t: 'Convert', d: 'Text is extracted page by page and rejoined into flowing paragraphs.' },
      { t: 'Read it anywhere', d: 'Open the EPUB in Apple Books, Google Play Books, Kobo or our reader.' },
    ],
    explainerTitle: 'What to expect',
    explainer: [
      {
        kicker: 'WORKS WELL',
        body: 'PDFs that were exported from a word processor or typesetting tool — the text layer is clean and paragraphs rebuild accurately.',
      },
      {
        kicker: 'WORKS BADLY',
        body: 'Scans and photos of pages. There is no text to extract, only images. Run OCR first, then convert.',
      },
    ],
    faqs: [
      {
        q: 'Why is my converted book one long run of text?',
        a: 'PDFs have no concept of chapters — only pages. We group every ten pages into a section so the file stays navigable, then you can retitle them with the Metadata Editor.',
      },
      {
        q: 'My PDF produced an empty file. Why?',
        a: 'It is almost certainly a scan, which contains page images rather than text. Put it through an OCR tool first.',
      },
      { q: 'Do images come across?', a: 'Not yet — this converter extracts the text layer only.' },
      COMMON.privacy,
      COMMON.free,
    ],
    related: ['epub-to-pdf', 'docx-to-epub', 'epub-reader', 'epub-metadata-editor'],
  },

  'docx-to-epub': {
    h1: 'Convert Word (DOCX) to EPUB',
    lede: 'Turn a finished manuscript into a real ebook — headings, images and all.',
    accept: '.docx',
    dropSub: '.docx · any size your device can handle',
    cta: 'Convert to EPUB',
    doneTitle: 'Your EPUB is ready',
    downloadLabel: 'Download EPUB',
    options: [],
    howTo: [
      { t: 'Choose your DOCX', d: 'Drop the file above or tap to pick one from your device.' },
      { t: 'Convert', d: 'Heading 1 starts a new chapter; images are embedded into the book.' },
      { t: 'Check and publish', d: 'Run it through the Validator, then upload it to your store of choice.' },
    ],
    explainerTitle: 'Getting a clean result',
    explainer: [
      {
        kicker: 'USE REAL STYLES',
        body: 'Apply Word’s Heading 1 to chapter titles rather than making text big and bold. That is what tells us where chapters begin.',
      },
      {
        kicker: 'AVOID MANUAL LAYOUT',
        body: 'Page breaks, text boxes and multi-column sections have no meaning in a reflowable book and are dropped.',
      },
    ],
    faqs: [
      {
        q: 'How are chapters decided?',
        a: 'Every Heading 1 in the document starts a new chapter, and its text becomes the entry in the table of contents.',
      },
      { q: 'Do images come across?', a: 'Yes — pictures are extracted and embedded in the EPUB at their original resolution.' },
      { q: 'What about footnotes?', a: 'Footnote text is preserved inline. Linked footnote markers are not yet rebuilt.' },
      COMMON.privacy,
      COMMON.free,
    ],
    related: ['epub-to-docx', 'markdown-to-epub', 'epub-validator', 'epub-cover-editor'],
  },

  'mobi-to-epub': {
    h1: 'Convert MOBI to EPUB',
    lede: 'Move books out of Amazon’s old format and into the one every other reader speaks.',
    accept: '.mobi,.prc',
    dropSub: '.mobi · any size your device can handle',
    cta: 'Convert to EPUB',
    doneTitle: 'Your EPUB is ready',
    downloadLabel: 'Download EPUB',
    options: [],
    howTo: [
      { t: 'Choose your MOBI', d: 'Drop the file above or tap to pick one from your device.' },
      { t: 'Convert', d: 'Chapters, headings and the reading order are rebuilt as EPUB 3.' },
      { t: 'Read it anywhere', d: 'Apple Books, Kobo, Google Play Books and our own reader all open it.' },
    ],
    faqs: [
      {
        q: 'Will books I bought from Amazon work?',
        a: 'Only if they are DRM-free. Purchased Kindle books carry DRM and cannot be opened by any converter.',
      },
      { q: 'Does my cover survive?', a: 'The cover is carried over when the source file has one embedded.' },
      COMMON.privacy,
      COMMON.drm,
      COMMON.free,
    ],
    related: ['azw3-to-epub', 'epub-to-mobi', 'epub-reader', 'epub-metadata-editor'],
  },

  'azw3-to-epub': {
    h1: 'Convert AZW3 to EPUB',
    lede: 'Read your Kindle files in any app — Apple Books, Kobo, Play Books or right here.',
    accept: '.azw3,.azw,.kfx',
    dropSub: '.azw3 · any size your device can handle',
    cta: 'Convert to EPUB',
    doneTitle: 'Your EPUB is ready',
    downloadLabel: 'Download EPUB',
    options: [],
    howTo: [
      { t: 'Choose your AZW3', d: 'Drop the file above or tap to pick one from your device.' },
      { t: 'Convert', d: 'The book’s structure and styling are mapped onto EPUB 3.' },
      { t: 'Open it anywhere', d: 'The result is a standard EPUB that any reader will accept.' },
    ],
    faqs: [
      {
        q: 'Where do I find the AZW3 file?',
        a: 'Connect your Kindle by USB and look in the documents folder. Books you downloaded to the device are there as .azw3.',
      },
      {
        q: 'It says the file cannot be opened.',
        a: 'That usually means DRM. Books bought from the Kindle Store are encrypted and no converter can read them.',
      },
      COMMON.privacy,
      COMMON.drm,
      COMMON.free,
    ],
    related: ['mobi-to-epub', 'epub-to-azw3', 'epub-reader', 'epub-validator'],
  },

  'txt-to-epub': {
    h1: 'Convert plain text to EPUB',
    lede: 'Turn a .txt file into a proper ebook with chapters and a table of contents.',
    accept: '.txt',
    dropSub: '.txt · any size your device can handle',
    cta: 'Convert to EPUB',
    doneTitle: 'Your EPUB is ready',
    downloadLabel: 'Download EPUB',
    options: [],
    howTo: [
      { t: 'Choose your text file', d: 'Drop the file above or tap to pick one from your device.' },
      { t: 'Convert', d: 'Blank lines become paragraph breaks; short ALL-CAPS lines become chapter titles.' },
      { t: 'Download', d: 'You get a valid EPUB 3 with a working table of contents.' },
    ],
    explainerTitle: 'How your text is read',
    explainer: [
      {
        kicker: 'PARAGRAPHS',
        body: 'A blank line separates paragraphs. Single line breaks inside a paragraph are joined up, which is how most plain-text books are written.',
      },
      {
        kicker: 'CHAPTERS',
        body: 'A short line in capitals — like CHAPTER ONE — is treated as a chapter heading and added to the table of contents.',
      },
    ],
    faqs: [
      {
        q: 'My chapters were not detected.',
        a: 'Chapter headings need to be on their own line, in capitals, and under 70 characters. Otherwise the whole file becomes one chapter, which still works fine.',
      },
      { q: 'What about accents and other alphabets?', a: 'Files are read as UTF-8, so any script comes through intact.' },
      COMMON.privacy,
      COMMON.free,
      COMMON.size,
    ],
    related: ['epub-to-txt', 'markdown-to-epub', 'epub-metadata-editor', 'epub-validator'],
  },

  'markdown-to-epub': {
    h1: 'Convert Markdown to EPUB',
    lede: 'Write in Markdown, publish as a real ebook — headings, lists, quotes and code included.',
    accept: '.md,.markdown,.mdown',
    dropSub: '.md · any size your device can handle',
    cta: 'Convert to EPUB',
    doneTitle: 'Your EPUB is ready',
    downloadLabel: 'Download EPUB',
    options: [],
    howToTitle: 'How to convert Markdown to EPUB',
    howTo: [
      { t: 'Choose your Markdown', d: 'Drop the file above or tap to pick one from your device.' },
      { t: 'Convert', d: 'Every `#` heading starts a chapter. GitHub-flavoured Markdown is supported.' },
      { t: 'Download', d: 'The table of contents is built from your headings automatically.' },
    ],
    faqs: [
      {
        q: 'Which Markdown flavour is supported?',
        a: 'GitHub-flavoured Markdown — tables, strikethrough, fenced code blocks and task lists all work.',
      },
      { q: 'How do chapters get split?', a: 'At every top-level `#` heading. Use `##` and below freely inside a chapter.' },
      { q: 'Can I include images?', a: 'Linked images need to be reachable URLs; local file paths cannot be resolved from your browser.' },
      COMMON.privacy,
      COMMON.free,
    ],
    related: ['html-to-epub', 'txt-to-epub', 'docx-to-epub', 'epub-validator'],
  },

  'html-to-epub': {
    h1: 'Convert HTML to EPUB',
    lede: 'Save an article, a set of docs or a whole web page as an ebook you can read offline.',
    accept: '.html,.htm,.xhtml',
    dropSub: '.html · any size your device can handle',
    cta: 'Convert to EPUB',
    doneTitle: 'Your EPUB is ready',
    downloadLabel: 'Download EPUB',
    options: [],
    howTo: [
      { t: 'Choose your HTML file', d: 'Save the page from your browser first, then drop the file here.' },
      { t: 'Convert', d: 'Scripts, styles and trackers are stripped; the text structure is kept.' },
      { t: 'Read it offline', d: 'The result opens in any EPUB reader, with no network needed.' },
    ],
    faqs: [
      {
        q: 'Do images from the page come through?',
        a: 'Only if they were saved alongside the HTML and referenced by a relative path. Remote images are not downloaded.',
      },
      {
        q: 'Is JavaScript kept?',
        a: 'No. Scripts, iframes and embedded objects are removed — an EPUB is a document, not an app.',
      },
      COMMON.privacy,
      COMMON.free,
      COMMON.size,
    ],
    related: ['markdown-to-epub', 'txt-to-epub', 'epub-reader', 'epub-validator'],
  },

  'fb2-to-epub': {
    h1: 'Convert FB2 to EPUB',
    lede: 'FictionBook files, converted to the format the rest of the world reads.',
    accept: '.fb2,.xml',
    dropSub: '.fb2 · any size your device can handle',
    cta: 'Convert to EPUB',
    doneTitle: 'Your EPUB is ready',
    downloadLabel: 'Download EPUB',
    options: [],
    howTo: [
      { t: 'Choose your FB2', d: 'Drop the file above or tap to pick one from your device.' },
      { t: 'Convert', d: 'FB2 sections become chapters; the title, author and language are carried across.' },
      { t: 'Download', d: 'Embedded images are unpacked and included in the EPUB.' },
    ],
    faqs: [
      {
        q: 'Are the book’s title and author preserved?',
        a: 'Yes — FB2 stores rich metadata and we map the title, author and language straight onto the EPUB.',
      },
      { q: 'What about the embedded images?', a: 'FB2 keeps images as base64 inside the file. They are decoded and added as real image files.' },
      { q: 'Can I open .fb2.zip files?', a: 'Unzip it first, then convert the .fb2 inside.' },
      COMMON.privacy,
      COMMON.free,
    ],
    related: ['epub-reader', 'epub-metadata-editor', 'epub-to-pdf', 'epub-validator'],
  },

  'cbz-to-epub': {
    h1: 'Convert CBZ comics to EPUB',
    lede: 'Turn a comic archive into an ebook your reader can page through properly.',
    accept: '.cbz,.zip',
    dropSub: '.cbz · any size your device can handle',
    cta: 'Convert to EPUB',
    doneTitle: 'Your EPUB is ready',
    downloadLabel: 'Download EPUB',
    options: [],
    howTo: [
      { t: 'Choose your CBZ', d: 'Drop the file above or tap to pick one from your device.' },
      { t: 'Convert', d: 'Images are ordered naturally by filename, one page per image.' },
      { t: 'Read it', d: 'The first page becomes the cover. Open it in any EPUB reader.' },
    ],
    faqs: [
      {
        q: 'How is page order decided?',
        a: 'Filenames are sorted naturally, so page2 comes before page10 rather than after it.',
      },
      { q: 'Can you handle CBR?', a: 'Not directly — CBR uses RAR compression. Repackage it as a CBZ first.' },
      { q: 'Will the file be huge?', a: 'It will be about the size of the original archive. Run the Compressor afterwards to shrink it.' },
      COMMON.privacy,
      COMMON.free,
    ],
    related: ['epub-compressor', 'epub-reader', 'epub-cover-editor', 'epub-to-pdf'],
  },

  // =========================================================================
  // Utilities
  // =========================================================================
  'epub-reader': {
    h1: 'Read EPUB files online',
    lede: 'Open any EPUB right here — no app, no account, nothing uploaded.',
    accept: '.epub',
    dropHeadline: 'Drop an EPUB here to start reading',
    dropSub: '.epub · opens instantly',
    cta: 'Open book',
    mode: 'reader',
    howTo: [
      { t: 'Choose your EPUB', d: 'Drop the file above or tap to pick one from your device.' },
      { t: 'Read', d: 'Page with the arrow keys or by tapping the edges of the page.' },
      { t: 'Nothing is stored', d: 'The book is read straight from your device and never uploaded.' },
    ],
    faqs: [
      { q: 'Is my book uploaded?', a: 'No. It is opened directly in your browser and never sent to a server.' },
      { q: 'Does it remember my place?', a: 'Your position is kept for as long as the tab is open.' },
      COMMON.drm,
      COMMON.free,
      COMMON.size,
    ],
    related: ['epub-to-pdf', 'epub-metadata-editor', 'epub-validator', 'azw3-to-epub'],
  },

  'epub-metadata-editor': {
    h1: 'Edit EPUB metadata',
    lede: 'Fix the title, author and language your reading app shows — without rebuilding the book.',
    accept: '.epub',
    cta: 'Save changes',
    doneTitle: 'Your updated EPUB is ready',
    downloadLabel: 'Download EPUB',
    mode: 'metadata',
    howTo: [
      { t: 'Choose your EPUB', d: 'The current title, author and language are read straight from the file.' },
      { t: 'Edit the fields', d: 'Change whatever is wrong. Everything else in the book is left untouched.' },
      { t: 'Download', d: 'Only the package metadata is rewritten — nothing is re-encoded.' },
    ],
    faqs: [
      {
        q: 'Why does my reader still show the old title?',
        a: 'Most apps cache metadata when a book is first imported. Remove the book from your library and re-add the new file.',
      },
      { q: 'Does this re-encode my book?', a: 'No. Only the metadata block in the package file is edited; every other byte is preserved.' },
      { q: 'Can I change the cover here?', a: 'Use the Cover Editor for that — it is a separate tool.' },
      COMMON.privacy,
      COMMON.free,
    ],
    related: ['epub-cover-editor', 'epub-validator', 'epub-reader', 'epub-compressor'],
  },

  'epub-cover-editor': {
    h1: 'Change an EPUB cover',
    lede: 'Replace the cover image on a book — useful when a converted file has none.',
    accept: '.epub',
    cta: 'Apply cover',
    doneTitle: 'Your updated EPUB is ready',
    downloadLabel: 'Download EPUB',
    mode: 'cover',
    howTo: [
      { t: 'Choose your EPUB', d: 'Drop the book you want to change.' },
      { t: 'Pick a cover image', d: 'A JPEG or PNG. Portrait at roughly 1600×2560 looks right on every device.' },
      { t: 'Download', d: 'The new image replaces the old cover and is registered in the manifest.' },
    ],
    faqs: [
      {
        q: 'What size should the cover be?',
        a: 'Portrait, around 1600×2560 pixels, at a 1:1.6 ratio. Smaller works but looks soft on a modern screen.',
      },
      { q: 'What if the book has no cover at all?', a: 'One is added and registered properly, so readers pick it up.' },
      { q: 'JPEG or PNG?', a: 'JPEG for photographic covers, PNG for flat artwork and type.' },
      COMMON.privacy,
      COMMON.free,
    ],
    related: ['epub-metadata-editor', 'epub-compressor', 'epub-validator', 'cbz-to-epub'],
  },

  'epub-validator': {
    h1: 'Validate an EPUB file',
    lede: 'Find out exactly why a store or reader is rejecting your book.',
    accept: '.epub',
    cta: 'Check this file',
    doneTitle: 'Check complete',
    mode: 'report',
    howTo: [
      { t: 'Choose your EPUB', d: 'Drop the file above or tap to pick one from your device.' },
      { t: 'Read the report', d: 'Errors break the file. Warnings will still open, but are worth fixing.' },
      { t: 'Fix and re-check', d: 'Most problems are missing metadata or files listed but not included.' },
    ],
    explainerTitle: 'Errors vs warnings',
    explainer: [
      {
        kicker: 'ERROR — WILL BE REJECTED',
        body: 'A missing mimetype, a broken container, absent required metadata, or manifest entries pointing at files that are not in the archive.',
      },
      {
        kicker: 'WARNING — WORTH FIXING',
        body: 'No navigation document, or an EPUB 2 package. The book opens, but the table of contents may be empty and some stores will complain.',
      },
    ],
    faqs: [
      {
        q: 'Is this the same as EPUBCheck?',
        a: 'No. EPUBCheck is the official, exhaustive validator. This runs the structural checks that catch the overwhelming majority of real rejections, instantly and without uploading your file.',
      },
      { q: 'It passes here but my store still refuses it.', a: 'Stores add their own rules on top of the spec — cover dimensions, metadata completeness, file size. Check their guidelines next.' },
      COMMON.privacy,
      COMMON.free,
      COMMON.drm,
    ],
    related: ['epub-metadata-editor', 'epub-cover-editor', 'docx-to-epub', 'epub-compressor'],
  },

  'epub-compressor': {
    h1: 'Compress an EPUB file',
    lede: 'Shrink an image-heavy book so it fits an email attachment or a Send-to-Kindle limit.',
    accept: '.epub',
    cta: 'Compress',
    doneTitle: 'Your smaller EPUB is ready',
    downloadLabel: 'Download EPUB',
    options: [
      { key: 'level', label: 'Compression', choices: ['Light', 'Balanced', 'Maximum'], value: 'Balanced' },
    ],
    howTo: [
      { t: 'Choose your EPUB', d: 'Drop the file above or tap to pick one from your device.' },
      { t: 'Pick a level', d: 'Balanced is the right answer for almost every book.' },
      { t: 'Download', d: 'Text is never touched — only the images are re-encoded.' },
    ],
    explainerTitle: 'What actually gets smaller',
    explainer: [
      {
        kicker: 'IMAGES',
        body: 'Nearly all of an oversized EPUB is picture data. Images are resized down and re-encoded as JPEG, which is where the savings come from.',
      },
      {
        kicker: 'TEXT',
        body: 'Left completely alone. The words, markup and metadata in your book are byte-for-byte identical afterwards.',
      },
    ],
    faqs: [
      {
        q: 'How much smaller will it get?',
        a: 'An image-heavy book typically halves on Balanced. A text-only novel will barely change, because there was nothing to compress.',
      },
      { q: 'Will the pictures look worse?', a: 'Slightly, on close inspection. Light is near-invisible; Maximum is noticeable but still fine for reading.' },
      { q: 'Is any image ever made bigger?', a: 'No. If re-encoding would not shrink an image, the original is kept.' },
      COMMON.privacy,
      COMMON.free,
    ],
    related: ['epub-validator', 'cbz-to-epub', 'epub-cover-editor', 'split-epub'],
  },

  'merge-epub': {
    h1: 'Merge EPUB files',
    lede: 'Combine a series, or a set of short stories, into one book with one table of contents.',
    accept: '.epub',
    dropHeadline: 'Drop two or more EPUBs here',
    dropSub: '.epub · select several at once',
    cta: 'Merge books',
    doneTitle: 'Your merged EPUB is ready',
    downloadLabel: 'Download EPUB',
    mode: 'multi',
    howTo: [
      { t: 'Choose two or more EPUBs', d: 'Select them together, or drop them onto the page in one go.' },
      { t: 'Check the order', d: 'Books are merged in the order listed. Remove any you did not mean to include.' },
      { t: 'Download', d: 'Each source book becomes a titled section in the combined table of contents.' },
    ],
    faqs: [
      {
        q: 'What order are the books merged in?',
        a: 'The order shown in the list, which follows how you selected them. Each book keeps its own title as a section heading.',
      },
      { q: 'Do images survive the merge?', a: 'Images are dropped when merging, because the same filenames in different books would collide.' },
      { q: 'How many can I merge?', a: 'As many as your browser has memory for. Ten full-length novels is comfortable.' },
      COMMON.privacy,
      COMMON.free,
    ],
    related: ['split-epub', 'epub-metadata-editor', 'epub-compressor', 'epub-validator'],
  },

  'split-epub': {
    h1: 'Split an EPUB into parts',
    lede: 'Break a long book into separate files — one per chapter, or in groups.',
    accept: '.epub',
    cta: 'Split book',
    doneTitle: 'Your split files are ready',
    downloadLabel: 'Download ZIP',
    options: [
      { key: 'chaptersPerFile', label: 'Chapters per file', choices: ['1', '5', '10'], value: '1' },
    ],
    howTo: [
      { t: 'Choose your EPUB', d: 'Drop the file above or tap to pick one from your device.' },
      { t: 'Choose how to divide it', d: 'One chapter per file, or larger groups for a long book.' },
      { t: 'Download the ZIP', d: 'Each part is a complete, valid EPUB in its own right.' },
    ],
    faqs: [
      {
        q: 'Why do I get a ZIP?',
        a: 'Splitting produces several files, and a browser can only hand you one download. Unzip it to get the individual EPUBs.',
      },
      { q: 'Is each part a real EPUB?', a: 'Yes — each one has its own metadata, navigation and table of contents.' },
      { q: 'How are chapters counted?', a: 'By the book’s own spine, which is the reading order its author defined.' },
      COMMON.privacy,
      COMMON.free,
    ],
    related: ['merge-epub', 'epub-compressor', 'epub-metadata-editor', 'epub-reader'],
  },
};

/**
 * Utilities are not "X to Y", so a generated "How to <tool name>" reads badly
 * ("How to epub validator"). Converters get a generated title from their two
 * formats; utilities name their own.
 */
const UTILITY_HOWTO = {
  'epub-reader': 'How to read an EPUB online',
  'epub-metadata-editor': 'How to edit EPUB metadata',
  'epub-cover-editor': 'How to change an EPUB cover',
  'epub-validator': 'How to check an EPUB for problems',
  'epub-compressor': 'How to compress an EPUB',
  'merge-epub': 'How to merge EPUB files',
  'split-epub': 'How to split an EPUB into parts',
};

function defaultHowToTitle(tool, group) {
  if (group === 'EPUB utilities') return UTILITY_HOWTO[tool.slug] || `How to use the ${tool.n}`;
  return `How to convert ${tool.a} to ${tool.b}`;
}

/** Fill in the derived fields every page needs, so templates stay dumb. */
export function getToolPage(slug) {
  const tool = toolBySlug[slug];
  const page = pages[slug];
  if (!tool || !page) return null;

  const group = groupOf(slug);
  return {
    ...tool,
    ...page,
    group,
    mode: page.mode || 'convert',
    options: page.options || [],
    accept: page.accept || '.epub',
    dropHeadline: page.dropHeadline || `Drop your ${tool.a} here, or click to choose`,
    dropSub: page.dropSub || `${page.accept || '.epub'} · any size your device can handle`,
    cta: page.cta || `Convert to ${tool.b}`,
    doneTitle: page.doneTitle || `Your ${tool.b} is ready`,
    downloadLabel: page.downloadLabel || `Download ${tool.b}`,
    howToTitle: page.howToTitle || defaultHowToTitle(tool, group),
    related: (page.related || []).map((s) => toolBySlug[s]).filter(Boolean),
    seoTitle: `${page.h1} — free, in your browser | Epub Studio`,
  };
}

export const toolSlugs = allTools.map((t) => t.slug);
