/**
 * Long-form sections for the tool pages that carry a reference article as well
 * as a converter. Kept out of tool-pages.js so that file stays a catalogue of
 * runner configuration rather than a wall of prose.
 *
 * A section renders in ToolPageShell between the explainer and the FAQ. Every
 * field is optional, so a section is only as complex as it needs to be:
 *
 *   id      anchor id, also the sticky-nav target
 *   title   the h2
 *   lead    one pulled-out paragraph, set as a callout
 *   body    paragraphs
 *   table   { caption, head: [], rows: [[]] } — caption is read by screen
 *           readers and is not decorative, so write it as a sentence
 *   groups  [{ title, body: [] }] — h3 subsections
 *   bullets [{ t, d }] — a term and its explanation
 *   links   [{ label, href, d }] — internal links with a reason to click
 *   note    a closing callout
 *   draft   TRUE MEANS NOT RENDERED. The section stays here in source, in
 *           full, but never reaches a built page. Used for copy that is
 *           written but not yet fact-checked — see the retailer section below.
 *
 * Everything asserted here about our own tools was checked against the code
 * that runs them (src/lib/convert/), not against how the feature is described
 * elsewhere on the site.
 */

/** @typedef {{ id: string, title: string, draft?: boolean }} Section */

const validator = [
  {
    id: 'checks',
    title: 'What the report tells you',
    lead:
      'The validator runs seven structural checks against your file, in the order a reading app ' +
      'would hit them. Each one either passes or names the thing that is missing. There are no ' +
      'codes to look up.',
    table: {
      caption:
        'The seven checks this validator runs, what each one is testing, and the symptom when it fails',
      head: ['Check', 'What it means', 'What breaks if it fails'],
      rows: [
        [
          '`mimetype` entry',
          "The archive must contain a file called `mimetype` holding exactly `application/epub+zip`.",
          'The file is not recognised as an EPUB at all. Most readers refuse to open it; store ingestion rejects it before any other check runs.',
        ],
        [
          '`container.xml`',
          '`META-INF/container.xml` must exist and point at the package document.',
          'Nothing knows where the book starts. The reader opens an empty shell or throws a generic "damaged file" error.',
        ],
        [
          'Package document XML',
          'The `.opf` file must be well-formed XML.',
          'The manifest, spine and metadata all become unreadable at once. This is the failure behind most "corrupt file" messages.',
        ],
        [
          'Required metadata',
          '`dc:title`, `dc:language` and `dc:identifier` must all be present.',
          'The book opens but arrives with no title or author. Every store rejects it — this is the single most common cause of a KDP bounce.',
        ],
        [
          'Manifest href resolution',
          'Every file the manifest declares must actually exist in the archive.',
          'Missing images, missing stylesheets, or a chapter that opens blank. The book looks broken rather than failing outright.',
        ],
        [
          'Non-empty spine',
          'The spine must list at least one content document in reading order.',
          'There is nothing to read. The reader opens the file and shows a blank page.',
        ],
        [
          'Navigation document',
          'An EPUB 3 nav document (or an NCX for EPUB 2) should be present.',
          'The table of contents is empty. The book is readable but you cannot jump between chapters, and some stores reject on this.',
        ],
      ],
    },
  },

  {
    id: 'codes',
    title: 'Common EPUBCheck error codes, decoded',
    lead:
      'If you have already run EPUBCheck, or a store has quoted a code back at you, this is what ' +
      'each one means. Every code is a category prefix plus a number, and the prefix tells you ' +
      'which part of the book is wrong: `PKG` is the outer archive, `OPF` is the package ' +
      'document, `RSC` is a resource or reference, `HTM` is a chapter, `NCX` is the legacy ' +
      'navigation file.',
    table: {
      caption:
        'Common EPUBCheck codes, what each one means in plain English, the fix, and whether this validator catches it',
      head: ['Code', 'What it means', 'The fix', 'Caught here?'],
      rows: [
        [
          '`PKG-006`',
          'The mimetype entry is missing, or is not the first file in the archive.',
          'Rebuild the ZIP so `mimetype` is written first. A normal desktop archiver cannot guarantee this.',
          // Our check reads the entry and its contents; it does not inspect the
          // archive's ordering, so claiming a full catch here would overstate it.
          '**Partly** — a missing entry is caught, an out-of-order one is not',
        ],
        [
          '`PKG-007`',
          'The mimetype is compressed, or does not contain exactly `application/epub+zip`.',
          'Store it uncompressed, with no trailing newline.',
          // Likewise: contents are compared, the compression method is not.
          '**Partly** — wrong contents are caught, compression is not',
        ],
        [
          '`RSC-001`',
          'A path in `container.xml` or the OPF points at a file that is not there.',
          'Correct the path, or restore the file.',
          '**Yes**',
        ],
        [
          '`RSC-005`',
          'A file could not be parsed. The code itself tells you almost nothing.',
          'Read the sentence after the colon — it names a line and column. Usually an unclosed tag or a bare `&` that should be `&amp;`.',
          '**Partly** — flagged when the fault is in the package document, not when it is inside a chapter',
        ],
        [
          '`RSC-007`',
          'A referenced resource — an image, a stylesheet, a chapter — is missing from the archive.',
          'Restore the file, or remove the reference to it.',
          '**Yes**',
        ],
        [
          '`OPF-003`',
          'A file exists in the archive but the manifest never declares it.',
          'Add it to the manifest, or delete it if it is genuinely unused.',
          '**No** — requires full EPUBCheck',
        ],
        [
          '`OPF-014`',
          'Content uses SVG, scripting, MathML or remote resources, but the manifest entry does not advertise it.',
          'Add the `properties` attribute to that manifest item. Nothing is visibly broken; this is bookkeeping.',
          '**No** — requires full EPUBCheck',
        ],
        [
          '`OPF-015`',
          'The reverse: a declared property the file does not actually use.',
          'Remove the property.',
          '**No** — requires full EPUBCheck',
        ],
        [
          '`HTM-004`',
          'A chapter carries an old or malformed doctype.',
          'Replace it with plain `<!DOCTYPE html>`.',
          '**No** — requires full EPUBCheck',
        ],
        [
          '`NCX-001`',
          'The identifier in `toc.ncx` disagrees with `dc:identifier` in the OPF.',
          'Make the two values equal. The [Metadata Editor](/epub-metadata-editor) settles the OPF side.',
          '**No** — requires full EPUBCheck',
        ],
      ],
    },
    note:
      'Two of these ten are caught here in full and three in part. The rest need EPUBCheck itself, ' +
      'which parses every chapter and every stylesheet rather than the package alone. That ' +
      'difference is set out below. The long version of this table, with the reasoning behind each ' +
      'code, is in [EPUB validation errors explained](/blog/epub-validation-errors-explained).',
  },

  {
    /**
     * NOT RENDERED. Written, but every retailer number in it is unverified —
     * cover minimums, size caps and metadata rules change without notice, and
     * this site's whole position is that its claims are checkable.
     *
     * TO PUBLISH: check each [VERIFY] against the current KDP / Apple / Kobo /
     * Google Play / Draft2Digital guidelines, replace the marker with the
     * confirmed figure (or delete the sentence), then remove `draft: true`.
     * Do not publish it with the markers still in place.
     */
    draft: true,
    id: 'stores',
    title: 'Why each store rejects a file',
    lead:
      'Passing the spec is the floor, not the bar. Every retailer layers its own ingestion rules ' +
      'on top, and those rules are where a technically valid file still gets bounced.',
    groups: [
      {
        title: 'Amazon KDP',
        body: [
          'KDP prefers EPUB and converts it on its own side, which means your file is re-processed ' +
            'before anyone reads it. Rejections cluster around two things: cover images below the ' +
            'minimum long edge [VERIFY: 1,000 px], and metadata that disagrees with what you typed ' +
            'into the KDP form. The title in `dc:title` and the title in the dashboard must match.',
          'KDP also strips or overrides embedded fonts during conversion, so a book that looks ' +
            'right locally can arrive with different type — that mechanism is covered in ' +
            '[EPUB embedded fonts not working on Kindle](/blog/epub-embedded-fonts-not-working).',
        ],
      },
      {
        title: 'Apple Books',
        body: [
          'The strictest of the five. Apple runs full EPUBCheck at ingestion and rejects on errors ' +
            'this validator does not see — `OPF-014` property declarations and malformed chapter ' +
            'XHTML in particular. It also requires a valid language tag in `dc:language`; `en` and ' +
            '`en-GB` pass, invented values do not. Run EPUBCheck before submitting to Apple, not ' +
            'this tool.',
        ],
      },
      {
        title: 'Kobo',
        body: [
          'Accepts both EPUB 2 and EPUB 3 through Kobo Writing Life, so an EPUB 2 warning here is ' +
            'not a problem for Kobo specifically. Its constraints are size [VERIFY: 200 MB] and ' +
            'cover dimensions [VERIFY: 1,400 px minimum width]. Image-heavy books are the usual ' +
            'casualty — the [EPUB Compressor](/epub-compressor) recompresses interior images ' +
            'without touching the text.',
        ],
      },
      {
        title: 'Google Play Books',
        body: [
          'Wants a genuinely unique `dc:identifier`. Reusing an identifier across two editions, or ' +
            "leaving a converter's placeholder in place, causes the second upload to collide with " +
            'the first. Google is also less forgiving than most about a missing navigation ' +
            'document, which this validator reports as a warning rather than an error.',
        ],
      },
      {
        title: 'Draft2Digital',
        body: [
          'Runs its own validation and then distributes onward to stores with different rules ' +
            'again, so a D2D pass is not an Apple pass. Its own conversion step is usually ' +
            'tolerant, but it will reject files with structural damage to the package document — ' +
            'the `RSC-005` case above.',
        ],
      },
    ],
  },

  {
    id: 'epubcheck',
    title: 'This validator vs EPUBCheck',
    lead:
      'EPUBCheck is a Java program maintained by the DAISY Consortium on behalf of the W3C. It is ' +
      'the authority. It cannot run in a browser tab, so this tool is not a port of it and does ' +
      'not pretend to be.',
    table: {
      caption:
        'How this browser validator compares to EPUBCheck, and which one to use when',
      head: ['', 'This validator', 'EPUBCheck', 'Use which'],
      rows: [
        [
          '**What it reads**',
          'The package: archive structure, container, OPF, manifest, spine, nav',
          'Everything: package, every XHTML chapter, every stylesheet, every reference',
          'EPUBCheck for a complete audit',
        ],
        [
          '**Depth**',
          'Seven structural checks',
          'The full EPUB specification, hundreds of rules',
          'EPUBCheck before you publish',
        ],
        [
          '**Output**',
          'Plain English naming the file and the fault',
          'Codes plus line and column numbers',
          'This tool for triage; EPUBCheck for a record you can hand to a publisher',
        ],
        [
          '**Where it runs**',
          'Your browser tab. The file stays on your device',
          'Your own machine, via the command line or a GUI wrapper',
          'Either — neither needs an upload if you run EPUBCheck locally',
        ],
        [
          '**Speed**',
          'Instant. No download, no toolchain',
          'Seconds, after installing Java and the checker',
          'This tool when you want an answer now',
        ],
        [
          '**File size**',
          "No cap. The ceiling is your device's memory",
          'No cap',
          'Either',
        ],
        ['**Cost**', 'Free, no account', 'Free and open source', 'Either'],
      ],
    },
    note:
      '**Our recommendation, plainly:** run this first to find out whether something is obviously ' +
      'broken and where. Run EPUBCheck before final submission, especially for Apple Books. This ' +
      'tool catches the failures behind most real rejections; it does not catch all of them, and ' +
      'we would rather say so than lose you a submission.',
  },

  {
    id: 'fix',
    title: 'Fix the error you found',
    lead: 'Knowing what is broken is half of it. Each of these covers one failure mode end to end.',
    links: [
      {
        label: 'EPUB validation errors explained',
        href: '/blog/epub-validation-errors-explained',
        d: 'The ten EPUBCheck codes above, with the reasoning behind each. Start here if a store quoted a code at you.',
      },
      {
        label: 'Fixing corrupt EPUB files',
        href: '/blog/fixing-corrupt-epub-files',
        d: 'What to do when the package document itself is damaged and the book will not open at all.',
      },
      {
        label: 'EPUB cover not showing',
        href: '/blog/epub-cover-not-showing',
        d: 'The image is in the archive but not marked in the manifest. Why Calibre hides it, and the fix.',
      },
      {
        label: 'EPUB table of contents problems',
        href: '/blog/epub-table-of-contents-problems',
        d: 'Stray bullets, wrong order, missing chapters. All of it is the navigation file drifting from the spine.',
      },
      {
        label: 'EPUB images not showing after conversion',
        href: '/blog/epub-images-not-showing',
        d: 'Almost always a broken manifest link rather than a lost picture.',
      },
      {
        label: 'EPUB compatibility problems',
        href: '/blog/epub-compatibility-problems',
        d: 'When the same file works in one reader and breaks in another, because one enforces a rule the other ignores.',
      },
    ],
  },
];

const epubToPdf = [
  {
    id: 'page-size',
    title: 'Choosing a page size',
    lead:
      'The single decision that changes the output most. An EPUB has no pages — it reflows to ' +
      'whatever screen it lands on. Converting to PDF means fixing a page size, and the one you ' +
      'pick determines line length, page count, and whether the result is printable.',
    groups: [
      {
        title: 'A4 — 210 × 297 mm',
        body: [
          'The default nearly everywhere outside North America, and the right choice if the PDF is ' +
            'going to be read on a laptop or printed on an office printer. It is a tall, wide ' +
            'page: at a normal reading size, body text runs to roughly 90 characters per line, ' +
            'which is longer than a book and noticeably harder on the eye over a whole chapter. ' +
            'Use it for reports, course readings, and anything that will be printed on ordinary ' +
            'paper. Not a good choice for a novel.',
        ],
      },
      {
        title: 'US Letter — 8.5 × 11 in',
        body: [
          'The North American office standard. Slightly wider and shorter than A4, and functionally ' +
            'the same decision — pick it over A4 if the file is going to a printer in the US or ' +
            'Canada, so nobody has to rescale it. The same line-length caveat applies.',
        ],
      },
      {
        title: '6 × 9 in — trade paperback',
        body: [
          'The standard trim for a self-published paperback, and the size KDP and IngramSpark both ' +
            'use as their default. This is the one to pick if you want the output to read like a ' +
            'book. The narrower page brings line length down to roughly 65 characters, which is ' +
            'inside the range typographers consider comfortable, and the proportions match what ' +
            'your eye expects from a printed novel.',
          'Most browser converters produce a generic A4 and give you no say in it. If you are ' +
            'reading a converted book rather than printing an office document, 6 × 9 is almost ' +
            'always the better output.',
        ],
      },
    ],
    note:
      'Margins are set alongside the page size: **Narrow** (0.5 in), **Medium** (0.75 in) or ' +
      '**Wide** (1.25 in). Medium is the default and suits most books; go Wide if you are printing ' +
      'and want room for a thumb, Narrow to save pages.',
  },

  {
    id: 'carries-over',
    title: 'What carries over, and what changes',
    lead:
      'An EPUB and a PDF disagree about what a page is. Everything below follows from that one ' +
      'difference.',
    groups: [
      {
        title: 'Carries over',
        body: [
          '**Headings** keep their hierarchy and their relative size. **Paragraphs** survive ' +
            'intact. **Images** — interior pictures and the cover — are placed in the flow at the ' +
            'point they appear in the book. **Lists** keep their markers and nesting, **bold and ' +
            'italic** carry across, and chapters appear in spine order: the same order your reader ' +
            'shows them in.',
        ],
      },
      {
        title: 'Changes',
        body: [
          '**Line breaks reset.** The EPUB never had fixed lines. Every line break in the PDF is ' +
            'calculated fresh at the page width you chose here, so no line will fall where it fell ' +
            'on your e-reader.',
          "**Your reader's font settings no longer apply.** Your e-reader's typeface, size and " +
            'theme were its own preferences applied at display time. A PDF has no display-time ' +
            'preferences — the type is set once, when the file is made.',
          '**Position becomes a page number.** An EPUB tracks where you are as a percentage, ' +
            'because there are no pages to number. A PDF has real, fixed page numbers instead.',
          '**Embedded fonts are not carried through.** The PDF is typeset in the converter’s own ' +
            'text font rather than any font embedded in the EPUB.',
        ],
      },
    ],
    note:
      'If you want control over the typography *before* this point, run the book through ' +
      '[Style Studio](/style-studio) first and set the typeface, spacing and margins there.',
  },

  {
    id: 'real-text',
    title: 'Real text, not pictures of pages',
    lead:
      'This is the difference that does not show up in a feature comparison, and it is the one ' +
      'that matters most six months later.',
    body: [
      'There are two ways to make a PDF from an ebook. The easy way is to render each page in a ' +
        'browser engine and photograph it — the output looks right, and every page is an image. ' +
        'The other way is to typeset the text into the PDF directly, as text. Epub Studio does the ' +
        'second: the output is built with jsPDF, which writes real glyphs and real text runs into ' +
        'the file.',
    ],
    bullets: [
      {
        t: 'You can search it',
        d: 'Ctrl-F finds words. In a rasterised PDF it finds nothing, because there are no words in the file — only pixels arranged to look like words.',
      },
      {
        t: 'You can select and copy from it',
        d: 'Quoting a passage means highlighting it, not retyping it.',
      },
      {
        t: 'Screen readers can read it',
        d: 'A page-image PDF is opaque to assistive technology unless somebody runs OCR over it afterwards. This one is not.',
      },
      {
        t: 'The file is far smaller',
        d: 'Text is a few kilobytes a chapter. Page images are a few hundred kilobytes a page, every page, whether the page had a picture on it or not.',
      },
    ],
    note:
      'You can check this in ten seconds: open the converted PDF and press Ctrl-F for a word you ' +
      'know is in chapter one.',
  },

  {
    id: 'printing',
    title: 'Printing your book',
    lead: 'Useful for a proof copy. Not a substitute for a print interior file.',
    body: [
      'If you are printing at home, or running off a proof to read on paper, convert at 6 × 9 with ' +
        'Wide margins and print two-up on A4 or Letter. That works well and is what most people ' +
        'want from this page.',
      '**If you are submitting to KDP Print or IngramSpark, read this part.** A commercial print ' +
        'interior needs things this converter does not produce:',
    ],
    bullets: [
      {
        t: 'Bleed',
        d: 'Anything that runs to the edge of the page — a full-bleed image, a coloured chapter opener — needs to extend past the trim line so the guillotine has tolerance. This tool lays out to the trim size with no bleed area.',
      },
      {
        t: 'A mirrored gutter',
        d: 'Printed books need more margin on the bound edge than the outer edge, and the two swap on facing pages. This tool applies the same margin to all four sides of every page rather than mirroring them, so text on a bound proof will sit closer to the spine than it should.',
      },
      {
        t: 'Embedded and licensed fonts',
        d: 'Print vendors require every font embedded with print licensing attached.',
      },
      {
        t: 'Front matter and pagination conventions',
        d: 'Half-title, title, copyright page, roman-numeraled front matter — a book interior has structure a conversion cannot invent.',
      },
    ],
    note:
      'So: use this for a readable, printable proof at the right trim. For a paid print run, take ' +
      "the manuscript into a layout tool, or use KDP's own interior templates. We would rather say " +
      'that than have you upload a rejected interior.',
  },

  {
    id: 'troubleshooting',
    title: 'If the output looks wrong',
    bullets: [
      {
        t: 'The fonts are not the ones in my book',
        d: 'Expected. The PDF is typeset in the converter’s text font. Set the typography you want in [Style Studio](/style-studio) first if it matters to you.',
      },
      {
        t: 'Images are enormous, or overflow the page',
        d: 'An image sized for a wide screen does not fit a 6 × 9 page. The usual cause is print-resolution artwork inside the EPUB. Run the file through the [EPUB Compressor](/epub-compressor) first — it recompresses interior images without touching the text.',
      },
      {
        t: 'Chapters break in odd places, or one starts mid-page',
        d: "The EPUB's own chapter boundaries are spine items; if the book was converted from Word by another tool, those boundaries may not be where you think they are. Check the file with the [EPUB Validator](/epub-validator) to see the actual spine.",
      },
      {
        t: 'The whole thing is one long chapter',
        d: 'The source EPUB has no chapter structure — usually a sign it came from a PDF originally.',
      },
      {
        t: 'The conversion stalls, or the tab runs out of memory',
        d: 'The whole file is held in RAM while it converts. A very large illustrated book can exhaust an older phone. Compress it first, or convert on a desktop.',
      },
    ],
    note:
      'The long version is in [Convert EPUB to PDF without losing formatting](/blog/convert-epub-to-pdf-without-losing-formatting).',
  },
];

const mobiToEpub = [
  {
    id: 'why',
    title: 'Why convert MOBI to EPUB?',
    lead:
      'MOBI is Amazon’s original Kindle format, and Amazon has effectively retired it. Send to ' +
      'Kindle stopped accepting MOBI in 2022, and modern Kindles no longer need it. Outside the ' +
      'Kindle ecosystem it was never widely supported at all: Kobo, Nook, Apple Books and Google ' +
      'Play Books do not open it.',
    body: [
      'EPUB is the opposite. It is an open standard published by the W3C, it reflows to any screen ' +
        'size, and it is the native format of every major reading app and e-reader except Kindle — ' +
        'and Kindle itself now accepts EPUB through Send to Kindle. Converting turns a ' +
        'format-locked file into one that will keep working on whatever device you own next.',
    ],
    bullets: [
      {
        t: 'Reading an old library on hardware that never spoke MOBI',
        d: 'A Kobo, a Nook, an iPad or an Android phone will open the EPUB and would not have opened the MOBI.',
      },
      {
        t: 'Keeping one master copy in an open format',
        d: 'A library in a proprietary format is a library with a dependency. EPUB is publicly specified, so it outlives the company that shipped your reader.',
      },
      {
        t: 'Editing the book afterwards',
        d: 'An EPUB is XHTML inside a ZIP. Rename it to .zip and every part of it is readable in a text editor — a MOBI is not.',
      },
      {
        t: 'Fixing a wrong title or author',
        d: 'Old MOBI files are notorious for empty metadata. Once it is an EPUB, the [Metadata Editor](/epub-metadata-editor) rewrites those fields without re-encoding the book.',
      },
    ],
  },

  {
    id: 'what-survives',
    title: 'What survives the conversion',
    lead:
      'Checked against the converter itself rather than described in general terms, because two of ' +
      'these rows are limitations and a page that hid them would be no use to you.',
    table: {
      caption:
        'Each part of a MOBI file and whether this converter carries it into the EPUB it produces',
      head: ['Element', 'Carried over?'],
      rows: [
        ['Chapters and reading order', '**Yes** — rebuilt as the EPUB spine, in the order the MOBI declares.'],
        [
          'Paragraphs, bold, italics, lists',
          '**Yes** — the chapter markup is carried across and re-serialised as well-formed XHTML.',
        ],
        [
          'Title, author, language, publisher',
          '**Yes** — read from the MOBI’s own metadata record. Where the MOBI has none, the title falls back to the filename.',
        ],
        [
          'Contents entries',
          '**Partly** — a navigation document is always written, but its labels come from the MOBI’s internal section identifiers, so they can read as `chapter-0` rather than the chapter names you expect. Rename them in any EPUB editor, or ignore them if you only want to read.',
        ],
        [
          'Images and illustrations',
          '**No** — see the note below. This is the one that matters for an illustrated book.',
        ],
        [
          'Cover image',
          '**No** — nothing is embedded as the cover. Add one afterwards with the [Cover Editor](/epub-cover-editor).',
        ],
        [
          'DRM-protected content',
          '**No** — an encrypted file cannot be opened at all, by this or any other converter.',
        ],
      ],
    },
    note:
      '**About images.** The converter rebuilds the text of the book, not its picture files: an ' +
      'illustrated MOBI converts to an EPUB whose images are missing, and a validator will flag ' +
      'the references left behind. For a novel or any text-only book this changes nothing. For a ' +
      'comic, a cookbook or a photo book, convert to a fixed format instead — ' +
      '[MOBI to PDF](/mobi-to-pdf) keeps the pages intact. We would rather tell you that here than ' +
      'have you find it after converting a shelf.',
  },

  {
    id: 'mobi-vs-epub',
    title: 'MOBI vs EPUB at a glance',
    table: {
      caption: 'How the two formats compare on ownership, support and what each is still good for',
      head: ['', 'MOBI', 'EPUB'],
      rows: [
        ['**Owner**', 'Amazon — proprietary', 'W3C — open standard'],
        ['**Status**', 'Retired; Send to Kindle dropped it in 2022', 'Current; EPUB 3 actively maintained'],
        ['**Reflowable**', 'Yes', 'Yes'],
        [
          '**Opens on**',
          'Older Kindles, and little else',
          'Kobo, Nook, Apple Books, Google Play Books, Calibre, browsers — and Kindle via Send to Kindle',
        ],
        ['**Editable**', 'Difficult', 'Easy — XHTML inside a ZIP'],
        ['**Best use today**', 'Legacy Kindle hardware', 'Everything else'],
      ],
    },
  },

  {
    id: 'privacy',
    title: 'Your file never leaves your device',
    lead:
      'This converter is JavaScript running in the page you are already on. Your file is read from ' +
      'disk into the tab’s memory, transformed there, and handed back as a download. No server ' +
      'receives it.',
    body: [
      'You can check that rather than take our word for it: open your browser’s developer tools, ' +
        'switch to the Network tab, and convert a file. No request carries your book.',
      'That makes it safe for anything you would not hand to a third-party server — DRM-free ' +
        'purchases, unpublished manuscripts, review copies, anything under an NDA. There are no ' +
        'accounts, no cookies, no analytics and no size cap. The only ceiling is your device’s ' +
        'memory, because the whole file is held in RAM while it converts.',
    ],
  },

  {
    id: 'limits',
    title: 'What this tool cannot do',
    bullets: [
      {
        t: 'Open a DRM-protected book',
        d: 'Most Kindle Store purchases and all library loans are encrypted. This tool cannot open them, cannot convert them, and does not remove DRM. It works on DRM-free files: your own exports, sideloaded books, and purchases from DRM-free stores.',
      },
      {
        t: 'Carry images across',
        d: 'Text, structure and metadata are rebuilt; picture files are not. An illustrated book loses its illustrations — use [MOBI to PDF](/mobi-to-pdf) for those.',
      },
      {
        t: 'Cope with a very large book on a small device',
        d: 'Conversion happens in memory, so a heavy file can exhaust an older phone where a desktop would manage it comfortably.',
      },
      {
        t: 'Go the other way',
        d: 'Writing MOBI needs Amazon’s own toolchain, which cannot run in a browser. [EPUB to MOBI](/epub-to-mobi) explains the route that does work.',
      },
    ],
  },

  {
    id: 'after',
    title: 'After you convert',
    lead:
      'A MOBI that has been through several converters often arrives with a wrong title, no author ' +
      'or no cover. Everything below runs in the same tab, under the same no-upload guarantee.',
    cards: [
      {
        label: 'Metadata Editor',
        href: '/epub-metadata-editor',
        d: 'Fix the title, author and language so the book files correctly in your library.',
      },
      {
        label: 'Cover Editor',
        href: '/epub-cover-editor',
        d: 'Add the cover this conversion does not carry over, or replace a poor one.',
      },
      {
        label: 'EPUB Validator',
        href: '/epub-validator',
        d: 'Check the file before a store sees it — a missing manifest entry or an empty spine.',
      },
      {
        label: 'EPUB Compressor',
        href: '/epub-compressor',
        d: 'Shrink a bulky file when oversized images have made it larger than it needs to be.',
      },
      {
        label: 'Merge EPUBs',
        href: '/merge-epub',
        d: 'Combine a series or a set of volumes into one book.',
      },
      {
        label: 'Split EPUB',
        href: '/split-epub',
        d: 'Break a long book apart by chapters into separate files.',
      },
      {
        label: 'EPUB to PDF',
        href: '/epub-to-pdf',
        d: 'Make a fixed, printable copy once the EPUB is the way you want it.',
      },
    ],
    note:
      'Adding a cover from scratch is walked through in ' +
      '[how to add a cover to an EPUB](/blog/add-cover-to-epub). If what you actually want is a ' +
      'printable file rather than a reflowable one, skip the middle step and ' +
      '[convert MOBI to PDF](/mobi-to-pdf) directly.',
  },

  {
    id: 'azw3',
    title: 'Have an AZW3 instead?',
    body: [
      'Newer Kindle downloads are usually AZW3 — the KF8 format — rather than MOBI. The two are ' +
        'related but not identical: AZW3 replaced MOBI in 2011 with real CSS and better layout ' +
        'support. Send those through the [AZW3 to EPUB converter](/azw3-to-epub), which reads the ' +
        'KF8 container.',
    ],
  },
];

/** Slug → long-form sections. Pages absent from here simply have none. */
export const TOOL_SECTIONS = {
  'epub-validator': validator,
  'epub-to-pdf': epubToPdf,
  'mobi-to-epub': mobiToEpub,
};
