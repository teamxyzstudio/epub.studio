/**
 * Viewport-accurate page captures via the installed Chrome (playwright-core,
 * channel "chrome" — no browser download). Exists because bare
 * `chrome --headless --window-size=390,…` clamps width to ~500 CSS px and
 * crops, which silently fakes mobile evidence.
 *
 * Usage: node scripts/shot.mjs <url> <out.png> <width> <height>
 * Prints the page's real innerWidth and flags horizontal overflow.
 */
import { chromium } from 'playwright-core';

const [url, out, w, h] = process.argv.slice(2);
if (!url || !out) {
  console.error('Usage: shot.mjs <url> <out.png> <width> <height>');
  process.exit(1);
}
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: +w || 1440, height: +h || 1000 } });
await page.goto(url, { waitUntil: 'networkidle' });
const probe = await page.evaluate(() => ({ w: innerWidth, scrollW: document.documentElement.scrollWidth }));
await page.screenshot({ path: out, fullPage: false });
await browser.close();
console.log(`wrote ${out} viewport=${probe.w} scrollWidth=${probe.scrollW}${probe.scrollW > probe.w ? ' OVERFLOW!' : ''}`);
