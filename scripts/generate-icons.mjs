import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';

const icon = readFileSync('public/icon.svg');
const maskable = readFileSync('public/icon-maskable.svg');
const favicon = readFileSync('public/favicon.svg');

// Standard app icons (README §Assets: export 512/192 PNGs for the manifest).
await sharp(icon, { density: 600 }).resize(192, 192).png().toFile('public/icon-192.png');
await sharp(icon, { density: 600 }).resize(512, 512).png().toFile('public/icon-512.png');
// Maskable manifest icon (art already inset to the 80% safe zone).
await sharp(maskable, { density: 600 }).resize(512, 512).png().toFile('public/icon-maskable-512.png');
// apple-touch-icon: 180px, flattened onto the ink background.
await sharp(icon, { density: 600 })
  .resize(180, 180)
  .flatten({ background: '#17130E' })
  .png()
  .toFile('public/apple-touch-icon.png');
// favicon.ico at 32px, from the thicker-bar 16-32px variant.
const ico32 = await sharp(favicon, { density: 600 }).resize(32, 32).png().toBuffer();
writeFileSync('public/favicon-32.png', ico32);
console.log('icons written');
