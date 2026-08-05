import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

// Landing page: drop a file to reach the file stage, read the stage CTA fill.
await page.goto('http://localhost:4321/calibre-alternative', { waitUntil: 'networkidle' });
const landing = await page.evaluate(async () => {
  const dt = new DataTransfer();
  dt.items.add(new File([new ArrayBuffer(1024)], 'book.azw3'));
  window.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt }));
  await new Promise(r => setTimeout(r, 400));
  const cta = document.querySelector('.tool-card .cta');
  const sub = document.querySelector('.dz-sub');
  return {
    stageCtaBg: cta ? getComputedStyle(cta).backgroundColor : 'NO CTA',
    fileAccepted: document.querySelector('.filename')?.textContent || 'not picked',
  };
});

// Tool page control: must still be Electric Pink (mock-pinned).
await page.goto('http://localhost:4321/epub-to-pdf', { waitUntil: 'networkidle' });
const tool = await page.evaluate(async () => {
  const dt = new DataTransfer();
  dt.items.add(new File([new ArrayBuffer(1024)], 'book.epub'));
  window.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt }));
  await new Promise(r => setTimeout(r, 400));
  const cta = document.querySelector('.desktop-cta');
  return { toolCtaBg: cta ? getComputedStyle(cta).backgroundColor : 'NO CTA' };
});

// Idle dropSub text on calibre page.
await page.goto('http://localhost:4321/calibre-alternative', { waitUntil: 'networkidle' });
const sub = await page.evaluate(() => document.querySelector('.dz-sub')?.textContent.trim());

console.log(JSON.stringify({ landing, tool, calibreDropSub: sub }, null, 1));
await browser.close();
