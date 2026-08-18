/**
 * Homepage long-form content — everything below the tool grid.
 *
 * Kept out of the markup so the copy that changes most often (FAQ entries,
 * format rows, use cases) is editable in one place, the way tool-pages.js
 * holds tool-page copy.
 *
 * ------------------------------------------------------------------------
 * Internal-link budget (see the homepage content spec, §3)
 *
 * Contextual in-content links from this file, 13 in total, no destination
 * used twice and no anchor string repeated:
 *
 *   /epub-to-azw3   /epub-to-mobi   /pdf-to-epub    /epub-to-pdf
 *   /epub-to-docx   /cbz-to-epub    /docx-to-epub   /epub-reader
 *   /epub-validator /cbz-to-pdf     /epub-compressor /style-studio
 *   /blog
 *
 * External links, 2: the W3C EPUB specification and Amazon's Send to Kindle
 * documentation. (The team's profile links moved to /about with the
 * "Who runs this site" section.)
 *
 * The privacy section, the how-it-works steps and the alternatives comparison
 * carry no links at all, by design.
 * ------------------------------------------------------------------------
 *
 * Rich text is an array of parts: a string is literal text, an object is a
 * link. RichText.astro renders it.
 *
 * @typedef {string | { href: string, t: string, ext?: boolean }} Part
 */

const W3C_EPUB = 'https://www.w3.org/TR/epub-33/';
const SEND_TO_KINDLE = 'https://www.amazon.com/sendtokindle';

// --- 2.1 How it works -----------------------------------------------------

export const HOW_IT_WORKS = {
  title: 'How it works',
  steps: [
    {
      t: 'Drop a file',
      d: 'Choose a book from your device, or drag it onto the zone above.',
    },
    {
      t: 'It converts in your browser',
      d: 'The conversion runs on your own machine. Nothing is queued and nothing waits.',
    },
    {
      t: 'Download the result',
      d: 'The finished file saves straight to your downloads folder.',
    },
  ],
  body:
    'Epub Studio runs its converters as JavaScript inside the page you are already on. ' +
    'Your file is read from disk into the tab’s memory, transformed there, and handed back ' +
    'as a download. No file is transmitted to a server, so there is no upload queue, no ' +
    'processing wait and nothing stored anywhere afterwards.',
};

// --- 2.2 Privacy ----------------------------------------------------------

export const PRIVACY = {
  title: 'Why your files never leave your device',
  paragraphs: [
    'Epub Studio converts files inside your browser tab. When you choose a book, the browser’s ' +
      'File API hands the page a reference to it; the conversion code reads the bytes into memory, ' +
      'builds the output there, and gives it back to you as a download. At no point is the file ' +
      'sent anywhere. There is no server that could receive it.',
    'You do not have to take that on trust. Open your browser’s developer tools, switch to the ' +
      'Network tab, and convert something. You will see the page’s own scripts load and then ' +
      'nothing else — no request carrying your book, no upload of any size. A claim you can check ' +
      'in ten seconds is worth more than a policy page.',
    'Practically, that makes Epub Studio safe for work you cannot put on someone else’s machine: ' +
      'unpublished manuscripts, client documents, contracts, internal reports, anything under an ' +
      'NDA. The file’s privacy is a property of how the tools are built, not a promise about how ' +
      'carefully an upload would be handled.',
  ],
  /* Every disclosure below is checked against the codebase: no analytics or
     error-reporting script exists, and fonts are bundled from Fontsource
     rather than fetched from a CDN. */
  disclosure:
    'The exceptions, in full: there are none — Epub Studio loads no analytics, no error reporting, ' +
    'no advertising and no cookies, and serves its fonts from this site rather than a CDN, so the ' +
    'only record of a visit is the ordinary page-request log any web host keeps.',
  verify: {
    kicker: 'CHECK IT YOURSELF',
    steps: [
      'Press F12, or right-click the page and choose Inspect.',
      'Open the Network tab and clear it.',
      'Convert a file, and watch that no request carries it.',
    ],
  },
};

// --- 2.3 Format comparison ------------------------------------------------

/** @type {{ format: string, best: string, flow: string, works: string, notes: Part[] }[]} */
export const FORMAT_ROWS = [
  {
    format: 'EPUB',
    best: 'Everyday reading, and keeping a master copy',
    flow: 'Reflowable',
    works: 'Kobo, Nook, Apple Books, Google Play Books, phones, tablets; Kindle via Send to Kindle',
    notes: [
      'An open standard published by ',
      { href: W3C_EPUB, t: 'the W3C', ext: true },
      '. Two versions are in circulation, EPUB 2 and EPUB 3.',
    ],
  },
  {
    format: 'PDF',
    best: 'Printing, and layouts that must not move',
    flow: 'Fixed',
    works: 'Every desktop, phone, browser and most e-readers',
    notes: ['Pages keep their exact layout, so a small screen means zooming and panning.'],
  },
  {
    format: 'AZW3',
    best: 'Sideloading a file onto a modern Kindle',
    flow: 'Reflowable',
    works: 'Kindle hardware and Kindle apps',
    notes: ['Amazon’s KF8 format. Epub Studio reads AZW3 but cannot write it in a browser.'],
  },
  {
    format: 'MOBI',
    best: 'Kindles too old to accept anything newer',
    flow: 'Reflowable',
    works: 'Older Kindle hardware and apps',
    notes: [
      'Effectively retired: ',
      { href: SEND_TO_KINDLE, t: 'Send to Kindle', ext: true },
      ' stopped accepting MOBI in 2022.',
    ],
  },
  {
    format: 'DOCX',
    best: 'Writing and editing a manuscript',
    flow: 'Reflowable',
    works: 'Word, Google Docs, LibreOffice, Pages',
    notes: ['Not an ebook format — no e-reader opens it directly — but it keeps edits and comments.'],
  },
  {
    format: 'TXT',
    best: 'Plain text with no structure to lose',
    flow: 'Reflowable',
    works: 'Everything, including the oldest devices',
    notes: ['No images, no styling, no chapter marks. The smallest possible file.'],
  },
  {
    format: 'FB2',
    best: 'Books from FictionBook libraries',
    flow: 'Reflowable',
    works: 'FictionBook-aware apps such as FBReader and CoolReader',
    notes: ['One XML file holding text and metadata together. Rarely supported outside those apps.'],
  },
  {
    format: 'CBZ',
    best: 'Comics and manga',
    flow: 'Fixed (page images)',
    works: 'Comic readers on desktop, phone and tablet',
    notes: [
      'A ZIP of page images in reading order. Converting ',
      { href: '/cbz-to-epub', t: 'CBZ to EPUB' },
      ' makes an archive that ordinary ebook apps will open.',
    ],
  },
];

// --- 2.4 Which format for which device ------------------------------------

/** @type {{ device: string, format: string, body: Part[] }[]} */
export const DEVICE_GUIDE = [
  {
    device: 'Modern Kindle',
    format: 'EPUB',
    body: [
      'Amazon’s Send to Kindle has accepted EPUB since 2022, so a modern Kindle usually needs no ' +
        'conversion at all. A sideloaded AZW3 file also works, though Epub Studio cannot write ' +
        'that format in a browser — the page on ',
      { href: '/epub-to-azw3', t: 'EPUB to AZW3 for Kindle' },
      ' explains why, and what to do instead.',
    ],
  },
  {
    device: 'Older Kindle',
    format: 'MOBI',
    body: [
      'Kindles that predate Amazon’s 2011 KF8 rebuild read MOBI and nothing newer. Writing MOBI ' +
        'needs Amazon’s own toolchain, which cannot run in a browser, so the page on ',
      { href: '/epub-to-mobi', t: 'EPUB to MOBI for older Kindles' },
      ' sets out the routes that work rather than offering a converter that would have to upload the book.',
    ],
  },
  {
    device: 'Kobo, Nook, Apple Books, Google Play Books',
    format: 'EPUB',
    body: [
      'These readers open EPUB directly, so a book already in that format needs nothing done to ' +
        'it. A course pack or report that arrived as a PDF is the exception: ',
      { href: '/pdf-to-epub', t: 'make a PDF reflowable' },
      ' first, and the text will resize to the screen instead of forcing you to zoom.',
    ],
  },
  {
    device: 'Printing, or a layout that must not move',
    format: 'PDF',
    body: [
      'Anything headed for a printer belongs in PDF, because PDF pages are fixed. Epub Studio can ',
      { href: '/epub-to-pdf', t: 'convert EPUB to PDF' },
      ' with real, selectable text and a trim size you choose, rather than photographing each rendered page.',
    ],
  },
  {
    device: 'Editing a manuscript',
    format: 'DOCX',
    body: [
      'Editing a book means taking it back to a word processor. Epub Studio can ',
      { href: '/epub-to-docx', t: 'open an EPUB in Word' },
      ', keeping headings, paragraphs and emphasis so the structure survives the round trip into Word, Google Docs or LibreOffice.',
    ],
  },
];

// --- 2.5 Who this is for --------------------------------------------------

/** @type {{ title: string, body: Part[] }[]} */
export const AUDIENCES = [
  {
    title: 'Indie authors',
    body: [
      'Most self-published books are written in Word and have to be delivered as EPUB. Epub Studio can ',
      { href: '/docx-to-epub', t: 'turn a manuscript into an ebook' },
      ', and the heading styles already in the document become the book’s table of contents.',
    ],
  },
  {
    title: 'Students and researchers',
    body: [
      'Course readings and papers arrive as fixed PDFs, which are painful on a phone. Converting one ' +
        'to EPUB lets the text reflow and the type size follow your eyes. Epub Studio can also ',
      { href: '/epub-reader', t: 'read EPUB files in your browser' },
      ' without installing anything.',
    ],
  },
  {
    title: 'Publishers and KDP uploaders',
    body: [
      'Store ingestion rejects files for structural reasons that are rarely explained clearly. Before ' +
        'submitting, ',
      { href: '/epub-validator', t: 'validate your EPUB' },
      ' to find the missing package file, broken manifest entry or malformed XML behind the rejection.',
    ],
  },
  {
    title: 'Comic readers',
    body: [
      'Comics and manga arrive as CBZ archives, which most ebook apps ignore. Epub Studio can ',
      { href: '/cbz-to-pdf', t: 'convert CBZ comics' },
      ' into a PDF that opens on any device, with the pages kept in reading order.',
    ],
  },
];

// --- 2.6 Epub Studio vs Calibre vs online converters ----------------------

export const ALTERNATIVES = {
  title: 'Epub Studio, Calibre and server-based converters',
  intro:
    'Epub Studio is not the right tool for every ebook job. Here is where each of the three ' +
    'common options is genuinely stronger, including the places Epub Studio loses.',
  options: [
    {
      name: 'Calibre',
      kicker: 'DESKTOP APPLICATION',
      body:
        'Calibre does more than Epub Studio does. It manages an entire library, converts between ' +
        'far more formats, edits EPUB internals directly, and pushes books to e-readers over USB. ' +
        'The costs are that it has to be installed, it is a large program, and its conversion ' +
        'settings take real time to learn.',
    },
    {
      name: 'Server-based online converters',
      kicker: 'UPLOAD AND WAIT',
      body:
        'Services such as Zamzar, CloudConvert and Online-Convert support formats no browser can ' +
        'produce, because they run full desktop toolchains on their own machines. The trade-off is ' +
        'that your file is uploaded to a company’s server and processed there, and free tiers ' +
        'usually cap file size or the number of conversions per day.',
    },
    {
      name: 'Epub Studio',
      kicker: 'IN THE BROWSER TAB',
      body:
        'Epub Studio installs nothing and uploads nothing — the converters run in the tab that is ' +
        'already open. The real limitation is memory: the whole file is held in RAM while it is ' +
        'converted, so a very large illustrated book can fail on an older phone where a desktop ' +
        'program would cope. Writing MOBI and AZW3 is also impossible in a browser.',
      self: true,
    },
  ],
};

// --- 2.8 Technical transparency -------------------------------------------

/**
 * Versions come from package.json / package-lock.json at the time of writing.
 * Only libraries actually imported by the conversion code are listed.
 */
export const TECH = {
  title: 'What Epub Studio is built on',
  libraries: [
    { name: 'JSZip 3.10.1', use: 'Reads and writes the EPUB and CBZ ZIP containers.' },
    { name: 'pdf.js 6.1.200', use: 'Extracts text and structure when a PDF is the input.' },
    { name: 'jsPDF 4.2.1', use: 'Typesets the output PDF as real, selectable text.' },
    { name: 'Mammoth 1.12.0', use: 'Converts Word documents into clean HTML.' },
    { name: 'docx 9.7.1', use: 'Writes the .docx file when an EPUB is converted to Word.' },
    { name: '@lingo-reader/mobi-parser 0.4.6', use: 'Parses MOBI and AZW3 containers.' },
    { name: 'marked 18.0.6', use: 'Parses Markdown input.' },
  ],
  specs: [
    'Epub Studio reads EPUB 2 and EPUB 3. Every converter that produces an EPUB writes EPUB 3, ' +
      'the current version of the standard.',
    'The validator is Epub Studio’s own structural checker running in your browser — not ' +
      'EPUBCheck, which is a Java program and cannot run in a browser tab. It checks the mimetype ' +
      'entry, container.xml, the package document’s XML and required metadata, that every manifest ' +
      'href resolves to a file in the archive, that the spine is not empty, and that a navigation ' +
      'document exists.',
  ],
  limits: [
    'DRM-protected files are not supported. Epub Studio cannot open them, cannot convert them, and ' +
      'does not remove DRM — here or anywhere. Most Kindle Store purchases and library loans are ' +
      'encrypted and will fail to open in any converter.',
    'Writing MOBI and AZW3 requires Amazon’s toolchain and is not possible in a browser, so those ' +
      'pages explain the working route instead of offering a converter.',
    'Very large files are bounded by your device’s memory, because the whole file is held in RAM ' +
      'while it converts.',
  ],
  /* TODO: verify — the repository is private, so there is no public source link
     to give. Add one here if and when the source is opened. */
};

// --- 2.9 FAQ --------------------------------------------------------------

/**
 * Answers are 40–60 words, self-contained, and name the entity rather than
 * relying on a pronoun. This array is also the source of the FAQPage JSON-LD,
 * so the schema and the visible text cannot drift apart.
 *
 * @type {{ q: string, a: Part[] }[]}
 */
export const HOME_FAQS = [
  {
    q: 'Is Epub Studio free?',
    a: [
      'Yes. Every tool on Epub Studio is free, with no account, no trial and no paid tier. There is ' +
        'no conversion quota and nothing is watermarked. Because the tools run on your own device ' +
        'rather than on a server, serving them costs about as much as serving a plain web page.',
    ],
  },
  {
    q: 'Are my files uploaded to a server?',
    a: [
      'No. Epub Studio converts files inside the browser tab, using JavaScript the page has already ' +
        'loaded. Your file is read from disk into memory, transformed there, and handed back as a ' +
        'download. Open the Network tab in your browser’s developer tools during a conversion: no ' +
        'request carries the file.',
    ],
  },
  {
    q: 'Is there a file size limit?',
    a: [
      'Epub Studio sets no size cap, because nothing is uploaded and no server quota applies. The ' +
        'practical ceiling is your device’s memory, since the whole file is held in RAM while it ' +
        'converts. A novel is trivial on any machine. A very large illustrated book may fail on an ' +
        'older phone.',
    ],
  },
  {
    q: 'Can Epub Studio remove DRM?',
    a: [
      'No. Epub Studio cannot open DRM-protected files, cannot convert them, and does not remove ' +
        'DRM. Most Kindle Store purchases and library loans are encrypted, and no converter can read ' +
        'them. The tools work on DRM-free files: your own exports, sideloaded books and purchases ' +
        'from DRM-free stores.',
    ],
  },
  {
    q: 'Does Epub Studio work offline?',
    a: [
      'Partly. Epub Studio installs no offline cache, so the page itself has to load over the ' +
        'network the first time. Once a tool has loaded, the conversion needs no connection at all, ' +
        'because the work happens on your device. Losing your connection mid-conversion does not ' +
        'interrupt it.',
    ],
  },
  {
    q: 'Which EPUB versions does Epub Studio support?',
    a: [
      'Epub Studio reads both EPUB 2 and EPUB 3. Every converter that produces an EPUB writes ' +
        'EPUB 3, which is the current version of the standard. The validator accepts EPUB 2 files ' +
        'and flags them with a note rather than an error, since most reading apps still open them ' +
        'without trouble.',
    ],
  },
  {
    q: 'Do I need to create an account?',
    a: [
      'No. Epub Studio has no accounts, no sign-in and no email capture. Drop a file, convert it, ' +
        'download the result and close the tab. Nothing is recorded about who you are, beyond the ' +
        'ordinary access log that any web host keeps of which pages were requested.',
    ],
  },
  {
    q: 'What formats can Epub Studio convert to and from?',
    a: [
      'Epub Studio converts EPUB to PDF, DOCX and TXT, and converts PDF, DOCX, TXT, Markdown, HTML, ' +
        'FB2, MOBI, AZW3 and CBZ into EPUB. CBZ, MOBI and AZW3 also convert straight to PDF. Writing ' +
        'MOBI and AZW3 is not offered, because that requires Amazon’s own toolchain.',
    ],
  },
  {
    q: 'Will converting to PDF preserve my formatting?',
    a: [
      'Mostly. An EPUB reflows to any screen while a PDF has fixed pages, so Epub Studio must choose ' +
        'a page size, margins and typeface when rendering one. Headings, paragraphs, images and ' +
        'emphasis carry across. ',
      { href: '/style-studio', t: 'Style Studio' },
      ' lets you set the typography first.',
    ],
  },
  {
    q: 'Which format should I use for Kindle?',
    a: [
      'Send an EPUB. Amazon’s Send to Kindle has accepted EPUB since 2022 and converts it on ' +
        'Amazon’s side, so a modern Kindle needs no local conversion. AZW3 suits sideloading a file ' +
        'directly onto modern Kindle hardware. MOBI is only for Kindles too old to accept anything ' +
        'newer.',
    ],
  },
  {
    q: 'Why is my EPUB file so large?',
    a: [
      'Images, almost always. Cover art and interior illustrations saved at print resolution ' +
        'dominate an EPUB’s size, while the text itself is rarely more than a megabyte. ' +
        'Recompressing those images is the fix, and it is possible to ',
      { href: '/epub-compressor', t: 'reduce EPUB file size' },
      ' without touching the text.',
    ],
  },
  {
    q: 'Why will my EPUB not open on my e-reader?',
    a: [
      'Usually something structural: a missing package document, a manifest entry pointing at a file ' +
        'that is not in the archive, malformed XML, or an empty spine. Epub Studio’s validator checks ' +
        'each of those in the browser and names the specific failure instead of reporting a generic ' +
        'error.',
    ],
  },
];

/** Plain-text FAQ, for the FAQPage JSON-LD. Must match the rendered answers. */
export const faqPlain = HOME_FAQS.map(({ q, a }) => ({
  q,
  a: a.map((part) => (typeof part === 'string' ? part : part.t)).join(''),
}));

// --- 2.10 Freshness -------------------------------------------------------

export const BLOG_INTRO = {
  title: 'Latest from the blog',
  /** @type {Part[]} */
  body: [
    'Epub Studio publishes guides on how ebook formats actually work, how to repair files that ' +
      'readers reject, and how to make a book pleasant to read. The three most recent posts are ' +
      'below, and ',
    { href: '/blog', t: 'the blog' },
    ' holds the rest.',
  ],
};
