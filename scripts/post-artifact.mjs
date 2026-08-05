/**
 * Proof-of-experience artifacts for blog posts (SEO-hardening Phase 2).
 *
 * Every artifact is REAL: conversions run through the live tool page in
 * headless Chrome, structure listings come from actually unzipping the file.
 * Nothing here fabricates a number — if a mode fails, there is no artifact.
 *
 *   node scripts/post-artifact.mjs make <tool-slug> <fixture> <out-file>
 *       Run the conversion, save the produced file to disk, print real JSON
 *       (names, byte sizes). Used to build test-fixtures/ with our own tools.
 *
 *   node scripts/post-artifact.mjs shot <tool-slug> <fixture> <out.png>
 *       Run the conversion and element-screenshot the tool card's final
 *       state (done panel or validator report). Prints real JSON.
 *
 *   node scripts/post-artifact.mjs inspect <file.epub>
 *       Print the archive's true structure (entries, byte sizes, mimetype,
 *       OPF path) as a quotable text block.
 *
 * Server for make/shot: ARTIFACT_BASE env, default http://localhost:4321.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';

const BASE = process.env.ARTIFACT_BASE || 'http://localhost:4321';
const [mode, ...args] = process.argv.slice(2);

async function withTool(slug, fixture, fn) {
  const { chromium } = await import('playwright-core');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1400 } });
  await page.goto(`${BASE}/${slug}`, { waitUntil: 'networkidle' });
  const bytes = Array.from(readFileSync(fixture));
  const state = await page.evaluate(
    async ({ bytes, name }) => {
      const file = new File([new Uint8Array(bytes)], name);
      const dt = new DataTransfer();
      dt.items.add(file);
      window.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt }));
      await new Promise((r) => setTimeout(r, 400));
      document.querySelector('.cta')?.click();
      for (let i = 0; i < 240; i++) {
        await new Promise((r) => setTimeout(r, 500));
        if (document.querySelector('.done, .report')) break;
        const err = document.querySelector('.error');
        if (err && err.textContent.trim()) return { error: err.textContent.trim() };
      }
      if (!document.querySelector('.done, .report')) return { error: 'timed out' };
      const link = document.querySelector('a[download]');
      let out = null;
      if (link) {
        const blob = await fetch(link.href).then((r) => r.blob());
        out = {
          filename: link.getAttribute('download'),
          bytes: Array.from(new Uint8Array(await blob.arrayBuffer())),
        };
      }
      return { out, cardText: document.querySelector('.tool-card-shell')?.textContent.replace(/\s+/g, ' ').slice(0, 300) };
    },
    { bytes, name: basename(fixture) },
  );
  const result = await fn(page, state);
  await browser.close();
  return result;
}

if (mode === 'make') {
  const [slug, fixture, outFile] = args;
  await withTool(slug, fixture, async (_page, state) => {
    if (state.error) throw new Error(state.error);
    if (!state.out) throw new Error('tool produced no downloadable file');
    writeFileSync(outFile, Buffer.from(state.out.bytes));
    console.log(
      JSON.stringify({
        tool: slug,
        input: basename(fixture),
        inputBytes: readFileSync(fixture).length,
        output: state.out.filename,
        outputBytes: state.out.bytes.length,
        savedTo: outFile,
      }),
    );
  });
} else if (mode === 'shot') {
  const [slug, fixture, outPng] = args;
  await withTool(slug, fixture, async (page, state) => {
    if (state.error) throw new Error(state.error);
    await page.locator('.tool-card-shell').screenshot({ path: outPng });
    console.log(
      JSON.stringify({
        tool: slug,
        input: basename(fixture),
        inputBytes: readFileSync(fixture).length,
        outputBytes: state.out ? state.out.bytes.length : null,
        output: state.out ? state.out.filename : '(report — no file output)',
        shot: outPng,
      }),
    );
  });
} else if (mode === 'inspect') {
  const [file] = args;
  const JSZip = (await import('jszip')).default;
  const zip = await JSZip.loadAsync(readFileSync(file));
  const rows = [];
  for (const name of Object.keys(zip.files).sort()) {
    const f = zip.files[name];
    if (f.dir) continue;
    const data = await f.async('uint8array');
    rows.push({ name, bytes: data.length });
  }
  const mimetype = zip.files['mimetype'] ? await zip.files['mimetype'].async('string') : '(missing)';
  const container = zip.files['META-INF/container.xml'];
  let opf = '(missing container.xml)';
  if (container) {
    const xml = await container.async('string');
    opf = /full-path="([^"]+)"/.exec(xml)?.[1] || '(no rootfile)';
  }
  console.log(`$ unzip -l ${basename(file)}   (${readFileSync(file).length.toLocaleString('en-US')} bytes total)`);
  for (const r of rows) console.log(`  ${String(r.bytes).padStart(8)}  ${r.name}`);
  console.log(`mimetype: ${mimetype}`);
  console.log(`rootfile (from META-INF/container.xml): ${opf}`);
} else {
  console.error('usage: post-artifact.mjs make|shot|inspect ...');
  process.exit(1);
}
