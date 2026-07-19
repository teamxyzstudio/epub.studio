// Builds a genuine EPUB 3 fixture for end-to-end testing of the converters.
import JSZip from 'jszip';
import { writeFileSync } from 'node:fs';

const OUT = process.argv[2];
const zip = new JSZip();
zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });
zip.file('META-INF/container.xml', `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
<rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles>
</container>`);

const chapters = [
  { file: 'c1.xhtml', title: 'I. Introduction', body: `<h1>I. Introduction</h1>
<p>The Time Traveller (for so it will be convenient to speak of him) was expounding a recondite matter to us. His pale grey eyes shone and twinkled, and his usually pale face was flushed and animated.</p>
<p>The fire burnt brightly, and the soft radiance of the incandescent lights in the lilies of silver caught the bubbles that flashed and passed in our glasses.</p>
<blockquote>You must follow me carefully. I shall have to controvert one or two ideas that are almost universally accepted.</blockquote>
<ul><li>Length</li><li>Breadth</li><li>Thickness</li><li>Duration</li></ul>` },
  { file: 'c2.xhtml', title: 'II. The Machine', body: `<h1>II. The Machine</h1>
<h2>A demonstration</h2>
<p>I think that at that time none of us quite believed in the Time Machine. The fact is, the Time Traveller was one of those men who are too clever to be believed.</p>
<p>You never felt that you saw all round him; you always suspected some subtle reserve, some ingenuity in ambush, behind his lucid frankness.</p>` },
];

const oebps = zip.folder('OEBPS');
for (const c of chapters) {
  oebps.file(c.file, `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" lang="en"><head><meta charset="utf-8"/><title>${c.title}</title></head><body>
${c.body}
</body></html>`);
}
oebps.file('nav.xhtml', `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"><head><meta charset="utf-8"/><title>Contents</title></head>
<body><nav epub:type="toc"><ol>${chapters.map(c=>`<li><a href="${c.file}">${c.title}</a></li>`).join('')}</ol></nav></body></html>`);

oebps.file('content.opf', `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:identifier id="bookid">urn:uuid:11111111-2222-3333-4444-555555555555</dc:identifier>
<dc:title>The Time Machine</dc:title>
<dc:creator>H. G. Wells</dc:creator>
<dc:language>en</dc:language>
<dc:publisher>Epub Studio Fixtures</dc:publisher>
<meta property="dcterms:modified">2024-01-01T00:00:00Z</meta>
</metadata>
<manifest>
<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
${chapters.map((c,i)=>`<item id="c${i+1}" href="${c.file}" media-type="application/xhtml+xml"/>`).join('\n')}
</manifest>
<spine>${chapters.map((c,i)=>`<itemref idref="c${i+1}"/>`).join('')}</spine>
</package>`);

const buf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
writeFileSync(OUT, buf);
console.log('wrote', OUT, buf.length, 'bytes');
