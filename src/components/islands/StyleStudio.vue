<script setup>
/**
 * Style Studio — the re-typesetting editor.
 *
 * Two control layers, exactly as the mock separates them:
 *   "Saved into your book" → written into the EPUB stylesheet on download
 *   "Preview only"         → affects this preview and nothing else
 *
 * When a book arrives from a conversion (?book=<handoff id>), the preview shows
 * that book's own first chapter and Download applies the settings to it. With
 * no book, it falls back to The Time Machine sample from the mock.
 */
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import {
  BASE,
  PREVIEW_DEFAULTS,
  PRESET_META,
  presetDef,
  THEMES,
  THEME_NAMES,
  PV_THEME_MAP,
  FONT_GROUPS,
  HEADING_SCALE,
  MARGIN_PAD,
  contrast,
  contrastBadge,
  resolveTheme,
  fontStack,
  outputName,
} from '../../lib/style/settings.js';

const ACC = '#FF2E63';
const INK = '#17130E';
const MUT = '#6E675D';
const STORAGE_KEY = 'epubstudio-style-v1';

const props = defineProps({
  /** Handoff id from a converter, or '' for standalone use. */
  bookId: { type: String, default: '' },
});

// --- State ---------------------------------------------------------------
const s = reactive({ ...BASE, ...presetDef('Classic novel') });
const preset = ref('Classic novel');
const pv = reactive({ ...PREVIEW_DEFAULTS });

const raw = ref(false);
const page = ref(3);
const rulerY = ref(200);
const bookOpen = ref(false);
const sheetPx = ref(150);
const isMobile = ref(false);

// Loaded book (null when running on the sample)
const book = ref(null);
const loading = ref(false);
const loadError = ref('');
const busy = ref(false);
const busyPct = ref(0);
const downloadUrl = ref('');
const downloadName = ref('');
const embeddedKb = ref(0);

let lastPreset = 'Classic novel';

// --- Persistence ---------------------------------------------------------
function persist() {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...s, _preset: preset.value }));
  } catch {
    /* private mode — settings just won't survive a reload */
  }
}

function set(patch) {
  Object.assign(s, patch);
  preset.value = 'Custom';
  persist();
}

function applyPreset(name) {
  Object.assign(s, presetDef(name));
  preset.value = name;
  lastPreset = name;
  persist();
}

// --- Lifecycle -----------------------------------------------------------
const onResize = () => (isMobile.value = window.innerWidth < 760);

onMounted(async () => {
  onResize();
  window.addEventListener('resize', onResize);

  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null');
    if (saved) {
      Object.assign(s, { ...BASE, ...saved });
      preset.value = saved._preset || 'Custom';
      lastPreset = preset.value === 'Custom' ? 'Classic novel' : preset.value;
    }
  } catch {
    /* ignore corrupt saved state */
  }

  // A converter hands the book over as ?book=<id>, with the blob in IndexedDB.
  const id = props.bookId || new URLSearchParams(location.search).get('book') || '';
  if (id) await loadHandoff(id);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
  if (downloadUrl.value) URL.revokeObjectURL(downloadUrl.value);
});

async function loadHandoff(id) {
  loading.value = true;
  try {
    const { getBook } = await import('../../lib/handoff.js');
    const rec = await getBook(id);
    if (!rec) {
      loadError.value = 'That converted book is no longer available — convert it again to style it.';
      return;
    }
    await openBook(rec.blob, rec.filename, rec.sourceName);
  } catch (e) {
    loadError.value = e?.message || 'Could not open that book.';
  } finally {
    loading.value = false;
  }
}

/** Read an EPUB and pull its first chapter in for the live preview. */
async function openBook(blob, filename, sourceName = '') {
  const { readEpub, htmlToBlocks } = await import('../../lib/epub/read.js');
  const parsed = await readEpub(blob);

  const blocks = [];
  for (const ch of parsed.chapters) {
    for (const b of htmlToBlocks(ch.html, { basePath: ch.path })) {
      if (b.type === 'image') continue;
      blocks.push(b);
      if (blocks.length >= 14) break;
    }
    if (blocks.length >= 14) break;
  }

  book.value = { blob, filename, sourceName, blocks, chapters: parsed.chapters.length };

  // Metadata from the book wins over whatever the sample left behind.
  Object.assign(s, {
    title: parsed.metadata.title || s.title,
    author: parsed.metadata.author || s.author,
    language: parsed.metadata.language || 'en',
  });
  persist();
}

async function onFilePick(e) {
  const f = e.target.files && e.target.files[0];
  if (!f) return;
  loadError.value = '';
  loading.value = true;
  try {
    await openBook(f, f.name, f.name);
  } catch (err) {
    loadError.value = err?.message || 'Could not read that EPUB.';
  } finally {
    loading.value = false;
  }
}

// --- Derived -------------------------------------------------------------
const savedTheme = computed(() => resolveTheme(s));
const T = computed(() =>
  pv.pvTheme === 'Follow saved' ? savedTheme.value : THEMES[PV_THEME_MAP[pv.pvTheme]],
);
const desk = computed(() => (T.value.dark ? '#0E0F12' : '#EAE4DA'));
const paginated = computed(() => pv.view === 'Paginated');
const cols = computed(() => (isMobile.value ? 1 : pv.cols));
const hs = computed(() => HEADING_SCALE[s.headings] || HEADING_SCALE.standard);
const headWeight = computed(() => Math.min(700, s.weight + 200));

const cardW = computed(() => {
  const extra = s.margins === 'Wide' ? '136px' : s.margins === 'Narrow' ? '52px' : '96px';
  return `min(94%, calc(${s.measure * cols.value}ch + ${cols.value === 2 ? '64px' : '0px'} + ${extra}))`;
});

const pageCardStyle = computed(() => {
  if (raw.value) {
    return {
      position: 'relative', background: '#fff', color: '#000',
      fontFamily: "'Times New Roman', serif", fontSize: '16px', lineHeight: '1.3',
      textAlign: 'left', width: 'min(94%,720px)', padding: '24px', margin: '20px auto',
      border: '1px solid rgba(0,0,0,.2)',
      ...(paginated.value ? { height: 'calc(100% - 88px)', overflow: 'hidden' } : {}),
    };
  }
  return {
    position: 'relative',
    background: T.value.bg,
    color: T.value.text,
    fontFamily: fontStack(s),
    fontWeight: String(s.weight),
    fontSize: `${s.size}px`,
    lineHeight: String(s.lh),
    letterSpacing: `${s.ls}px`,
    wordSpacing: `${s.ws}px`,
    textAlign: s.align === 'justify' ? 'justify' : 'left',
    ...(s.hyph && s.align === 'justify' ? { hyphens: 'auto', WebkitHyphens: 'auto' } : {}),
    width: cardW.value,
    padding: MARGIN_PAD[s.margins],
    margin: isMobile.value ? '12px auto' : '28px auto',
    borderRadius: '3px',
    boxShadow: `0 1px 3px rgba(0,0,0,${T.value.dark ? '.5' : '.12'}), 0 14px 40px rgba(0,0,0,${T.value.dark ? '.45' : '.1'})`,
    ...(cols.value === 2 ? { columnCount: '2', columnGap: '64px' } : {}),
    ...(paginated.value ? { height: 'calc(100% - 96px)', overflow: 'hidden' } : {}),
    transition: 'background .25s, color .25s',
  };
});

const h1Style = computed(() =>
  raw.value
    ? { fontSize: '24px', fontWeight: '700', margin: '0 0 4px' }
    : {
        fontSize: `${hs.value[0]}em`, fontWeight: String(headWeight.value), lineHeight: '1.15',
        margin: '0 0 .2em', letterSpacing: '-.01em', textAlign: 'left',
      },
);
const bylineStyle = computed(() =>
  raw.value
    ? { fontSize: '14px', margin: '0 0 16px' }
    : { fontSize: '.85em', opacity: '.65', margin: '0 0 2.2em', textAlign: 'left' },
);
const h2Style = computed(() =>
  raw.value
    ? { fontSize: '18px', fontWeight: '700', margin: '0 0 8px' }
    : { fontSize: `${hs.value[1]}em`, fontWeight: String(headWeight.value), margin: '0 0 1em', textAlign: 'left' },
);

/** The Time Machine excerpt from the mock, used when no book is loaded. */
const SAMPLE = [
  'The Time Traveller (for so it will be convenient to speak of him) was expounding a recondite matter to us. His pale grey eyes shone and twinkled, and his usually pale face was flushed and animated. The fire burnt brightly, and the soft radiance of the incandescent lights caught the bubbles that flashed and passed in our glasses.',
  'Our chairs, being his patents, embraced and caressed us rather than submitted to be sat upon, and there was that luxurious after-dinner atmosphere, when thought runs gracefully free of the trammels of precision. And he put it to us in this way — marking the points with a lean forefinger — as we sat and lazily admired his earnestness over this new paradox.',
  '“You must follow me carefully. I shall have to controvert one or two ideas that are almost universally accepted. The geometry, for instance, they taught you at school is founded on a misconception.”',
  '“Is not that rather a large thing to expect us to begin upon?” said Filby, an argumentative person with red hair.',
];

const paragraphs = computed(() => {
  if (!book.value) return SAMPLE;
  const ps = book.value.blocks.filter((b) => b.type === 'p').map((b) => b.text);
  return ps.length ? ps.slice(0, 4) : SAMPLE;
});

const chapterHeading = computed(() => {
  if (!book.value) return 'I.';
  const h = book.value.blocks.find((b) => b.type === 'h1' || b.type === 'h2');
  return h ? h.text : 'I.';
});

const boldW = computed(() => Math.min(700, s.weight + 250));

/** Fixation bolding: first ~45% of each word (README §Preview only). */
function fixate(text) {
  if (!pv.fixation || raw.value) return [{ b: '', r: text }];
  return text.split(' ').map((w) => {
    const n = Math.max(1, Math.ceil(w.length * 0.45));
    return { b: w.slice(0, n), r: w.slice(n) + ' ' };
  });
}

const pStyleBase = computed(() =>
  raw.value
    ? { margin: '0 0 8px' }
    : s.paraStyle === 'indent'
      ? { margin: '0', textIndent: `${s.indent}em` }
      : { margin: `0 0 ${s.gap}em` },
);

const paraList = computed(() =>
  paragraphs.value.slice(0, 3).map((txt, i) => ({
    style: i === 0 && s.paraStyle === 'indent' && !raw.value ? { margin: '0' } : pStyleBase.value,
    dropCap: i === 0 && s.dropCaps && !raw.value ? txt[0] : '',
    runs: fixate(i === 0 && s.dropCaps && !raw.value ? txt.slice(1) : txt),
  })),
);

const lastPara = computed(() => fixate(paragraphs.value[3] || ''));

const figStyle = computed(() =>
  raw.value
    ? { margin: '10px 0', padding: '18px', border: '1px solid #ccc', textAlign: 'center', fontSize: '12px', color: '#888' }
    : {
        margin: '1.4em 0', padding: '2.2em 1em',
        border: `1px solid ${T.value.dark ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.15)'}`,
        borderRadius: '2px', textAlign: 'center', fontSize: '.72em', letterSpacing: '.12em',
        textTransform: 'uppercase',
        opacity: T.value.dark && s.dimImages ? '.45' : '.75',
        background: T.value.dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)',
        transition: 'opacity .25s',
      },
);

const linkStyle = computed(() =>
  raw.value
    ? { color: 'blue', textDecoration: 'underline', fontSize: '14px' }
    : { color: T.value.link, textDecoration: 'underline', textUnderlineOffset: '3px', fontSize: '.9em' },
);

const rulerStyle = computed(() => ({
  position: 'absolute', left: '0', right: '0', top: `${rulerY.value}px`,
  height: `${s.size * s.lh}px`, background: 'rgba(255,46,99,.08)',
  borderTop: '1px solid rgba(255,46,99,.35)', borderBottom: '1px solid rgba(255,46,99,.35)',
  pointerEvents: 'none', zIndex: 5,
}));

const totalPages = computed(() => Math.max(24, Math.round(224 * (s.size / 18) * (1.6 / s.lh))));
const curPage = computed(() => Math.min(page.value, totalPages.value));
const progressLabel = computed(() => {
  if (pv.prog === 'None') return '';
  if (pv.prog === 'Percent') return `${Math.round((curPage.value / totalPages.value) * 100)}%`;
  return `Page ${curPage.value} of ${totalPages.value}`;
});

// --- Contrast ------------------------------------------------------------
const textRatio = computed(() => contrast(s.cBg, s.cText));
const linkRatio = computed(() => contrast(s.cBg, s.cLink));
const textBadge = computed(() => contrastBadge(textRatio.value));
const linkBadgeC = computed(() => contrastBadge(linkRatio.value));

// --- Download ------------------------------------------------------------
const srcLabel = computed(() => {
  const out = outputName(s.title);
  if (book.value?.sourceName) return `${book.value.sourceName} → ${out}`;
  return book.value ? out : `sample.epub → ${out}`;
});

/**
 * Measure the actual woff2 whenever embedding is on, so the size shown on the
 * download button is real. Latin subsets are ~10-60 KB — far less than the
 * "~240 KB" the mock guessed at — so an estimate would be misleading.
 */
const fontBytes = ref(0);
const fontSizeCache = new Map();

async function measureFont() {
  if (!s.embed || s.keepOriginal) {
    fontBytes.value = 0;
    return;
  }
  if (fontSizeCache.has(s.font)) {
    fontBytes.value = fontSizeCache.get(s.font);
    return;
  }
  try {
    const { findFontUrl } = await import('../../lib/style/apply.js');
    const url = findFontUrl(s.font);
    if (!url) return;
    const res = await fetch(url);
    const bytes = (await res.arrayBuffer()).byteLength;
    fontSizeCache.set(s.font, bytes);
    fontBytes.value = bytes;
  } catch {
    fontBytes.value = 0;
  }
}

watch([() => s.embed, () => s.font, () => s.keepOriginal], measureFont, { immediate: false });

/** Estimated output size. Small books must not round to "0.0 MB". */
const sizeLabel = computed(() => {
  const embedBytes = s.embed && !s.keepOriginal ? embeddedKb.value * 1024 || fontBytes.value : 0;
  const bytes = (book.value ? book.value.blob.size : 1.16 * 1048576) + embedBytes;
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  if (bytes < 1048576) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
});

const dlMeta = computed(() => `${outputName(s.title)} · ${sizeLabel.value}`);
const dlLabel = computed(() => (busy.value ? `Applying… ${busyPct.value}%` : downloadUrl.value ? 'Download ready ✓' : 'Download EPUB'));

async function doDownload() {
  if (!book.value) {
    loadError.value = 'Open an EPUB first — then your settings can be written into it.';
    return;
  }
  busy.value = true;
  busyPct.value = 0;
  loadError.value = '';
  try {
    const { applyStyleToEpub } = await import('../../lib/style/apply.js');
    const out = await applyStyleToEpub(book.value.blob, { ...s }, (p) => (busyPct.value = p));
    if (downloadUrl.value) URL.revokeObjectURL(downloadUrl.value);
    downloadUrl.value = URL.createObjectURL(out.blob);
    downloadName.value = out.filename;
    embeddedKb.value = Math.round(out.embeddedBytes / 1024);

    // Hand the file straight to the browser.
    const a = document.createElement('a');
    a.href = downloadUrl.value;
    a.download = out.filename;
    a.click();
  } catch (e) {
    loadError.value = e?.message || 'Could not apply your settings to this book.';
  } finally {
    busy.value = false;
  }
}

// --- Mobile bottom sheet -------------------------------------------------
function sheetDown(e) {
  e.preventDefault();
  const startY = e.clientY;
  const startH = sheetPx.value;
  const move = (ev) => {
    sheetPx.value = Math.max(120, Math.min(window.innerHeight * 0.9, startH + (startY - ev.clientY)));
  };
  const up = () => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
    const wh = window.innerHeight;
    const snaps = [150, wh * 0.52, wh * 0.88];
    sheetPx.value = snaps.reduce((a, b) => (Math.abs(b - sheetPx.value) < Math.abs(a - sheetPx.value) ? b : a));
  };
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
}

function sheetCycle() {
  const wh = window.innerHeight;
  const snaps = [150, wh * 0.52, wh * 0.88];
  const i = snaps.findIndex((x) => Math.abs(x - sheetPx.value) < 40);
  sheetPx.value = snaps[(i + 1) % 3];
}

function onPvMove(e) {
  if (!pv.ruler) return;
  const r = e.currentTarget.getBoundingClientRect();
  rulerY.value = Math.max(0, e.clientY - r.top + e.currentTarget.scrollTop - 40);
}

// --- Resets --------------------------------------------------------------
const resetAll = () => applyPreset(lastPreset || 'Classic novel');
const resetType = () =>
  set({ font: presetDef(lastPreset).font, keepOriginal: false, embed: false, weight: 400 });
const resetText = () => {
  const d = presetDef(lastPreset);
  set({ size: d.size, lh: d.lh, ls: d.ls, ws: d.ws, paraStyle: d.paraStyle, align: d.align, hyph: d.hyph, dropCaps: d.dropCaps, headings: d.headings });
};
const resetColor = () => set({ theme: 'paper', dimImages: true });
const resetLayout = () => {
  const d = presetDef(lastPreset);
  set({ margins: d.margins, measure: d.measure });
};

// --- Control helpers -----------------------------------------------------
const segStyle = (selected, first) => ({
  flex: '1', minHeight: '40px', padding: '8px 4px', border: 'none', cursor: 'pointer',
  fontFamily: "'Archivo', sans-serif", fontSize: '12.5px',
  fontWeight: selected ? '600' : '400',
  background: selected ? INK : 'transparent',
  color: selected ? '#FAF7F2' : INK,
  borderLeft: first ? 'none' : '1px solid rgba(23,19,14,.18)',
  transition: 'background .15s',
});

const chipStyle = (selected, bg, fg) => ({
  minHeight: '40px', padding: '7px 13px', borderRadius: '999px',
  border: `1.5px solid ${selected ? ACC : 'rgba(23,19,14,.2)'}`,
  background: bg, color: fg, fontFamily: "'Archivo', sans-serif", fontSize: '12.5px',
  fontWeight: selected ? '600' : '400', cursor: 'pointer', transition: 'border-color .15s',
});

const trackStyle = (on) => ({
  flex: 'none', width: '46px', height: '27px', borderRadius: '14px', border: 'none',
  cursor: 'pointer', padding: '2.5px', display: 'flex',
  background: on ? ACC : 'rgba(23,19,14,.22)', transition: 'background .18s',
  justifyContent: on ? 'flex-end' : 'flex-start',
});

const KNOB = { width: '22px', height: '22px', borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.25)', transition: 'transform .18s' };

const sliders = computed(() => [
  { label: 'Text size', key: 'size', min: 12, max: 28, step: 0.5, out: `${s.size}px · ${Math.round(s.size * 0.75)}pt` },
  { label: 'Space between lines', key: 'lh', min: 1.2, max: 2.2, step: 0.05, out: s.lh.toFixed(2) },
  { label: 'Space between letters', key: 'ls', min: -0.5, max: 2, step: 0.1, out: s.ls.toFixed(1) + 'px' },
  { label: 'Space between words', key: 'ws', min: 0, max: 6, step: 0.5, out: s.ws.toFixed(1) + 'px' },
]);

const presetCards = computed(() =>
  PRESET_META.map((p) => {
    const d = presetDef(p.name);
    return {
      ...p,
      selected: preset.value === p.name,
      thumb: {
        display: 'block', width: '100%', height: '44px', overflow: 'hidden',
        fontFamily: `'${d.font}', serif`, fontSize: '8.5px', lineHeight: String(d.lh),
        textAlign: d.align === 'justify' ? 'justify' : 'left', color: INK, opacity: '.8',
        borderBottom: '1px solid rgba(23,19,14,.1)', paddingBottom: '4px',
      },
    };
  }),
);

const SAMPLE_THUMB =
  'It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of light.';

/**
 * Chip lists are pure data — the click handlers live in the template.
 *
 * These computeds read `s.theme` to mark the selected chip. Returning closures
 * that also *write* `s.theme` made the computed both read and invalidate the
 * same dependency, and Vue stopped re-evaluating it: the theme changed in state
 * but the preview never repainted.
 */
const themeChips = computed(() => [
  ...THEME_NAMES.map((n) => ({
    key: n,
    label: n[0].toUpperCase() + n.slice(1),
    style: chipStyle(s.theme === n, THEMES[n].bg, THEMES[n].text),
  })),
  { key: 'custom', label: 'Custom…', style: chipStyle(s.theme === 'custom', '#FFFDF9', INK) },
]);

const pvThemeChips = computed(() =>
  ['Follow saved', 'Paper', 'Cream', 'Mist', 'Dusk', 'Ink'].map((n) => {
    const th = n === 'Follow saved' ? null : THEMES[PV_THEME_MAP[n]];
    return {
      key: n,
      label: n,
      style: chipStyle(pv.pvTheme === n, th ? th.bg : '#FFFDF9', th ? th.text : INK),
    };
  }),
);

const presetChipStyle = computed(() => ({
  fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', padding: '3px 9px', borderRadius: '5px',
  background: preset.value === 'Custom' ? INK : 'rgba(255,46,99,.12)',
  color: preset.value === 'Custom' ? '#FAF7F2' : '#C41E4F',
}));

const pgBtnStyle = computed(() => ({
  minWidth: '44px', minHeight: '44px', borderRadius: '9px',
  border: `1px solid ${T.value.dark ? 'rgba(255,255,255,.25)' : 'rgba(23,19,14,.2)'}`,
  background: 'transparent', color: T.value.dark ? '#fff' : INK, cursor: 'pointer', fontSize: '15px',
  visibility: paginated.value ? 'visible' : 'hidden',
}));

const rawBtnStyle = computed(() => ({
  marginLeft: 'auto', minHeight: '38px', padding: '7px 14px', borderRadius: '999px',
  border: `1.5px solid ${raw.value ? ACC : 'rgba(23,19,14,.25)'}`,
  background: raw.value ? ACC : 'transparent', color: raw.value ? '#fff' : INK,
  fontFamily: "'Archivo', sans-serif", fontSize: '12.5px', fontWeight: '600', cursor: 'pointer',
  whiteSpace: 'nowrap', userSelect: 'none', WebkitUserSelect: 'none',
}));

watch(() => s.align, (a) => { if (a === 'justify' && !s.hyph) s.hyph = true; });
</script>

<template>
  <div class="studio">
    <header class="bar">
      <a href="/" class="brand focus-ring">
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="1.5" y="1.5" width="21" height="21" rx="5.5" fill="#17130E" />
          <rect x="6" y="7" width="12" height="2.2" rx="1.1" fill="#FAF7F2" />
          <rect x="6" y="11" width="9" height="2.2" rx="1.1" fill="#FF2E63" />
          <rect x="6" y="15" width="11" height="2.2" rx="1.1" fill="#FAF7F2" />
        </svg>
        <span class="wordmark">Epub Studio<span class="dot">.</span></span>
      </a>
      <span class="tool-name">Style Studio</span>
      <span class="src-label">{{ srcLabel }}</span>
      <button
        :style="rawBtnStyle"
        class="focus-ring-2"
        @pointerdown="raw = true"
        @pointerup="raw = false"
        @pointerleave="raw = false"
      >
        {{ raw ? 'Raw conversion' : 'Hold to compare' }}
      </button>
    </header>

    <div class="body" :class="{ mobile: isMobile }">
      <!-- ============ Preview ============ -->
      <div
        class="preview"
        :style="{ background: desk, paddingBottom: isMobile ? sheetPx + 16 + 'px' : undefined }"
        @mousemove="onPvMove"
      >
        <div :style="pageCardStyle" lang="en">
          <div v-if="pv.ruler && !raw" :style="rulerStyle"></div>
          <h1 :style="h1Style">{{ s.title }}</h1>
          <div :style="bylineStyle">{{ s.author }}</div>
          <h2 :style="h2Style">{{ chapterHeading }}</h2>

          <p v-for="(p, i) in paraList" :key="i" :style="p.style">
            <span
              v-if="p.dropCap"
              :style="{ float: 'left', fontSize: '3.1em', lineHeight: '.82', padding: '.06em .08em 0 0', fontWeight: String(headWeight) }"
              >{{ p.dropCap }}</span
            ><template v-for="(run, j) in p.runs" :key="j"
              ><span v-if="run.b" :style="{ fontWeight: String(boldW) }">{{ run.b }}</span
              >{{ run.r }}</template
            >
          </p>

          <div :style="figStyle">— illustration —</div>

          <p :style="pStyleBase">
            <template v-for="(run, j) in lastPara" :key="j"
              ><span v-if="run.b" :style="{ fontWeight: String(boldW) }">{{ run.b }}</span
              >{{ run.r }}</template
            >
          </p>

          <div style="margin-top: 1.4em">
            <a href="#notes" :style="linkStyle">Chapter notes →</a>
          </div>
        </div>

        <div class="pv-footer" :style="{ color: T.dark ? 'rgba(255,255,255,.65)' : MUT }">
          <button :style="pgBtnStyle" class="focus-ring-2" aria-label="Previous page" @click="page = Math.max(1, page - 1)">←</button>
          <span style="min-width: 110px; text-align: center">{{ progressLabel }}</span>
          <button :style="pgBtnStyle" class="focus-ring-2" aria-label="Next page" @click="page = Math.min(totalPages, page + 1)">→</button>
        </div>
      </div>

      <!-- ============ Control panel ============ -->
      <div class="panel" :style="isMobile ? { height: sheetPx + 'px' } : undefined">
        <div v-if="isMobile" class="grab" @pointerdown="sheetDown">
          <button class="grab-pill focus-ring" aria-label="Expand settings" @click="sheetCycle"></button>
        </div>

        <div class="dl-bar">
          <button class="dl focus-ring-ink" :disabled="busy" @click="doDownload">
            <span style="white-space: nowrap">{{ dlLabel }}</span>
            <span class="dl-meta">{{ dlMeta }}</span>
          </button>
        </div>

        <div class="scroll">
          <!-- Book source -->
          <div v-if="!book" class="open-book">
            <label for="ss-file" class="open-label focus-ring">
              <input id="ss-file" type="file" accept=".epub" class="sr-only-file" @change="onFilePick" />
              <strong>{{ loading ? 'Opening…' : 'Open an EPUB to style' }}</strong>
              <span>Or convert a file first — it lands here automatically.</span>
            </label>
          </div>
          <div v-else class="loaded-book">
            <span class="loaded-name">{{ book.filename }}</span>
            <span class="loaded-meta">{{ book.chapters }} chapters</span>
          </div>

          <p v-if="loadError" class="err" role="alert">{{ loadError }}</p>

          <!-- Presets -->
          <div class="row-head">
            <span class="section-label">Presets</span>
            <span :style="presetChipStyle">{{ preset }}</span>
          </div>
          <div class="preset-row" :class="{ mobile: isMobile }">
            <button
              v-for="p in presetCards"
              :key="p.name"
              class="preset-card focus-ring-2"
              :class="{ on: p.selected }"
              @click="applyPreset(p.name)"
            >
              <span :style="p.thumb">{{ SAMPLE_THUMB }}</span>
              <span class="preset-name">{{ p.name }}</span>
              <span class="preset-desc">{{ p.desc }}</span>
            </button>
          </div>

          <!-- ===== Saved into your book ===== -->
          <div class="card saved">
            <div class="card-head">
              <span class="bullet-square"></span>
              <span class="card-title">Saved into your book</span>
              <button class="reset-all focus-ring-2" @click="resetAll">Reset to preset</button>
            </div>
            <p class="card-note">
              These become the book’s default look. Reading apps may let readers override them.
            </p>

            <!-- Typeface -->
            <div class="sec-head"><span>Typeface</span><button class="reset focus-ring-2" title="Reset typeface" @click="resetType">↺</button></div>
            <template v-for="g in FONT_GROUPS" :key="g.label">
              <div class="font-group">{{ g.label }}</div>
              <div class="font-list">
                <button
                  v-for="name in g.list"
                  :key="name"
                  class="font-row focus-ring-inset"
                  :class="{ on: s.font === name && !s.keepOriginal }"
                  @click="set({ font: name, keepOriginal: false })"
                >
                  <span :style="{ fontFamily: `'${name}', serif`, fontSize: '16.5px', color: INK }">{{ name }}</span>
                  <span class="dot-radio" :class="{ on: s.font === name && !s.keepOriginal }"></span>
                </button>
              </div>
            </template>

            <div class="toggle-row">
              <div class="toggle-copy">
                <div class="toggle-label">Keep original fonts</div>
                <div class="toggle-hint">Uses whatever survived the conversion.</div>
              </div>
              <button role="switch" :aria-checked="s.keepOriginal" :style="trackStyle(s.keepOriginal)" class="focus-ring" @click="set({ keepOriginal: !s.keepOriginal })">
                <span :style="KNOB"></span>
              </button>
            </div>
            <div class="toggle-row">
              <div class="toggle-copy">
                <div class="toggle-label">Embed font in file</div>
                <div class="toggle-hint">
                  {{
                    s.embed
                      ? `Travels with the book${fontBytes ? ` — adds ${Math.round(fontBytes / 1024)} KB` : ''}. Looks identical everywhere.`
                      : 'Off: readers use their closest match.'
                  }}
                </div>
              </div>
              <button role="switch" :aria-checked="s.embed" :style="trackStyle(s.embed)" class="focus-ring" @click="set({ embed: !s.embed })">
                <span :style="KNOB"></span>
              </button>
            </div>

            <div class="slider-block">
              <div class="slider-head"><span>Boldness</span><span class="mono">{{ s.weight }}</span></div>
              <input type="range" min="300" max="700" step="10" :value="s.weight" aria-label="Boldness" @input="set({ weight: parseInt($event.target.value, 10) })" />
            </div>

            <!-- Text settings -->
            <div class="sec-head"><span>Text settings</span><button class="reset focus-ring-2" title="Reset text settings" @click="resetText">↺</button></div>
            <div v-for="sl in sliders" :key="sl.key" class="slider-block small">
              <div class="slider-head"><span>{{ sl.label }}</span><span class="mono">{{ sl.out }}</span></div>
              <input type="range" :min="sl.min" :max="sl.max" :step="sl.step" :value="s[sl.key]" :aria-label="sl.label" @input="set({ [sl.key]: parseFloat($event.target.value) })" />
            </div>

            <div class="block">
              <div class="block-label">Paragraphs</div>
              <div class="seg">
                <button v-for="(l, i) in ['First-line indent', 'Space between']" :key="l" class="focus-ring-inset" :style="segStyle((s.paraStyle === 'indent') === (i === 0), i === 0)" @click="set({ paraStyle: i === 0 ? 'indent' : 'space' })">{{ l }}</button>
              </div>
              <div class="slider-block small">
                <div class="slider-head sub">
                  <span>{{ s.paraStyle === 'indent' ? 'Indent depth' : 'Gap between paragraphs' }}</span>
                  <span class="mono">{{ (s.paraStyle === 'indent' ? s.indent : s.gap).toFixed(1) }}em</span>
                </div>
                <input type="range" min="0" max="3" step="0.1" :value="s.paraStyle === 'indent' ? s.indent : s.gap" :aria-label="s.paraStyle === 'indent' ? 'Indent depth' : 'Gap between paragraphs'" @input="set(s.paraStyle === 'indent' ? { indent: parseFloat($event.target.value) } : { gap: parseFloat($event.target.value) })" />
              </div>
            </div>

            <div class="block">
              <div class="block-label">Alignment</div>
              <div class="seg">
                <button v-for="(l, i) in ['Left', 'Justified']" :key="l" class="focus-ring-inset" :style="segStyle((s.align === 'justify') === (i === 1), i === 0)" @click="set({ align: i === 1 ? 'justify' : 'left' })">{{ l }}</button>
              </div>
            </div>

            <div class="toggle-row">
              <div class="toggle-copy">
                <div class="toggle-label">Hyphenation</div>
                <div v-if="s.align === 'justify'" class="toggle-hint">Recommended with justified text — it evens out word spacing.</div>
              </div>
              <button role="switch" :aria-checked="s.hyph" :style="trackStyle(s.hyph)" class="focus-ring" @click="set({ hyph: !s.hyph })"><span :style="KNOB"></span></button>
            </div>
            <div class="toggle-row">
              <div class="toggle-copy"><div class="toggle-label">Drop caps on chapters</div></div>
              <button role="switch" :aria-checked="s.dropCaps" :style="trackStyle(s.dropCaps)" class="focus-ring" @click="set({ dropCaps: !s.dropCaps })"><span :style="KNOB"></span></button>
            </div>

            <div class="block pb">
              <div class="block-label">Heading size</div>
              <div class="seg">
                <button v-for="(l, i) in ['Subtle', 'Standard', 'Strong']" :key="l" class="focus-ring-inset" :style="segStyle(s.headings === l.toLowerCase(), i === 0)" @click="set({ headings: l.toLowerCase() })">{{ l }}</button>
              </div>
            </div>

            <!-- Colour & theme -->
            <div class="sec-head"><span>Color &amp; theme</span><button class="reset focus-ring-2" title="Reset colors" @click="resetColor">↺</button></div>
            <div class="chips">
              <button v-for="c in themeChips" :key="c.key" :style="c.style" class="focus-ring-2" @click="set({ theme: c.key })">{{ c.label }}</button>
            </div>

            <div v-if="s.theme === 'custom'" class="custom-colors">
              <div class="color-row">
                <input type="color" :value="s.cBg" aria-label="Background color" @input="set({ cBg: $event.target.value })" />
                <span style="flex: 1">Background</span><span class="mono">{{ s.cBg }}</span>
              </div>
              <div class="color-row">
                <input type="color" :value="s.cText" aria-label="Text color" @input="set({ cText: $event.target.value })" />
                <span style="flex: 1">Text</span>
                <span class="badge" :class="{ fail: !textBadge.pass }">{{ textBadge.label }}</span>
              </div>
              <div class="color-row">
                <input type="color" :value="s.cLink" aria-label="Link color" @input="set({ cLink: $event.target.value })" />
                <span style="flex: 1">Links</span>
                <span class="badge" :class="{ fail: !linkBadgeC.pass }">{{ linkBadgeC.label }}</span>
              </div>
              <div v-if="textRatio < 4.5" class="contrast-warn">
                Low contrast — this will be hard to read. It’s saved anyway, but consider a darker text color.
              </div>
            </div>

            <div class="toggle-row">
              <div class="toggle-copy"><div class="toggle-label">Dim images in dark themes</div></div>
              <button role="switch" :aria-checked="s.dimImages" :style="trackStyle(s.dimImages)" class="focus-ring" @click="set({ dimImages: !s.dimImages })"><span :style="KNOB"></span></button>
            </div>

            <!-- Layout -->
            <div class="sec-head"><span>Layout</span><button class="reset focus-ring-2" title="Reset layout" @click="resetLayout">↺</button></div>
            <div class="block">
              <div class="block-label">Page margins</div>
              <div class="seg">
                <button v-for="(l, i) in ['Narrow', 'Medium', 'Wide']" :key="l" class="focus-ring-inset" :style="segStyle(s.margins === l, i === 0)" @click="set({ margins: l })">{{ l }}</button>
              </div>
            </div>
            <div class="slider-block measure">
              <div class="slider-head"><span>Line length</span><span class="mono">{{ s.measure }} characters</span></div>
              <input type="range" min="40" max="95" step="1" :value="s.measure" aria-label="Line length" @input="set({ measure: parseInt($event.target.value, 10) })" />
              <div class="comfort-band"></div>
              <div class="comfort-note">60–75 characters per line is comfortable</div>
            </div>

            <!-- Book details -->
            <button class="book-toggle focus-ring-inset" @click="bookOpen = !bookOpen">
              <span>Book details</span>
              <span class="chev" :style="{ transform: `rotate(${bookOpen ? 45 : 0}deg)` }">＋</span>
            </button>
            <div v-if="bookOpen" class="book-fields">
              <label>Title<input type="text" :value="s.title" class="focus-ring-2" @change="set({ title: $event.target.value })" /></label>
              <label>Author<input type="text" :value="s.author" class="focus-ring-2" @change="set({ author: $event.target.value })" /></label>
              <label>Language<input type="text" :value="s.language" class="focus-ring-2" @change="set({ language: $event.target.value })" /></label>
            </div>
          </div>

          <!-- ===== Preview only ===== -->
          <div class="card preview-only">
            <div class="card-head">
              <span class="bullet-circle"></span>
              <span class="card-title muted">Preview only</span>
            </div>
            <p class="card-note">Just for this preview — not saved in the file.</p>

            <div class="block">
              <div class="block-label">View</div>
              <div class="seg">
                <button v-for="(l, i) in ['Paginated', 'Continuous']" :key="l" class="focus-ring-inset" :style="segStyle(pv.view === l, i === 0)" @click="pv.view = l">{{ l }}</button>
              </div>
            </div>

            <div v-if="!isMobile" class="block">
              <div class="block-label">Columns</div>
              <div class="seg">
                <button v-for="(l, i) in ['1 column', '2 columns']" :key="l" class="focus-ring-inset" :style="segStyle(pv.cols === i + 1, i === 0)" @click="pv.cols = i + 1">{{ l }}</button>
              </div>
            </div>

            <div class="toggle-row">
              <div class="toggle-copy">
                <div class="toggle-label">Focus ruler</div>
                <div class="toggle-hint">Highlights the line under your cursor.</div>
              </div>
              <button role="switch" :aria-checked="pv.ruler" :style="trackStyle(pv.ruler)" class="focus-ring" @click="pv.ruler = !pv.ruler"><span :style="KNOB"></span></button>
            </div>
            <div class="toggle-row">
              <div class="toggle-copy">
                <div class="toggle-label">Fixation bolding</div>
                <div class="toggle-hint">Bolds the start of each word as a reading aid.</div>
              </div>
              <button role="switch" :aria-checked="pv.fixation" :style="trackStyle(pv.fixation)" class="focus-ring" @click="pv.fixation = !pv.fixation"><span :style="KNOB"></span></button>
            </div>

            <div class="block">
              <div class="block-label">Preview theme</div>
              <div class="chips">
                <button v-for="c in pvThemeChips" :key="c.key" :style="c.style" class="focus-ring-2" @click="pv.pvTheme = c.key">{{ c.label }}</button>
              </div>
            </div>

            <div class="block pb">
              <div class="block-label">Progress indicator</div>
              <div class="seg">
                <button v-for="(l, i) in ['Percent', 'Page x of y', 'None']" :key="l" class="focus-ring-inset" :style="segStyle(pv.prog === l, i === 0)" @click="pv.prog = l">{{ l }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.studio {
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* --- Header (56px, not the site's 60px) --- */
.bar {
  flex: none;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 clamp(12px, 2vw, 24px);
  height: 56px;
  background: rgba(250, 247, 242, 0.96);
  border-bottom: 1px solid rgba(23, 19, 14, 0.14);
  z-index: 60;
}
.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}
.brand:hover {
  color: #17130e;
}
.wordmark {
  font-family: 'Instrument Serif', serif;
  font-size: 20px;
}
.dot {
  color: #ff2e63;
}
.tool-name {
  font-size: 13.5px;
  font-weight: 600;
  border-left: 1px solid rgba(23, 19, 14, 0.18);
  padding-left: 14px;
}
.src-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11.5px;
  color: #6e675d;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* --- Body --- */
.body {
  flex: 1;
  display: flex;
  overflow: hidden;
}
.body.mobile {
  display: block;
  position: relative;
}

.preview {
  flex: 1;
  position: relative;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  transition: background 0.25s;
}
.body.mobile .preview {
  position: absolute;
  inset: 0;
  display: block;
}

.pv-footer {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 8px 0 14px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
}

/* --- Panel --- */
.panel {
  flex: none;
  width: 390px;
  display: flex;
  flex-direction: column;
  background: #faf7f2;
  border-left: 1px solid rgba(23, 19, 14, 0.14);
}
.body.mobile .panel {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  width: auto;
  border-left: none;
  border-radius: 18px 18px 0 0;
  box-shadow: 0 -8px 32px rgba(23, 19, 14, 0.18);
  padding-bottom: env(safe-area-inset-bottom);
  transition: height 0.25s cubic-bezier(0.3, 0.9, 0.3, 1);
}

.grab {
  flex: none;
  display: flex;
  justify-content: center;
  padding: 10px 0 4px;
  cursor: grab;
  touch-action: none;
}
.grab-pill {
  width: 64px;
  height: 6px;
  border-radius: 3px;
  background: rgba(23, 19, 14, 0.25);
  border: none;
  cursor: grab;
  padding: 0;
}

.dl-bar {
  flex: none;
  display: flex;
  padding: 12px 16px;
  order: 99;
  border-top: 1px solid rgba(23, 19, 14, 0.14);
  background: #faf7f2;
}
.body.mobile .dl-bar {
  order: 0;
  padding: 4px 16px 10px;
  border-top: none;
}
.dl {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  background: #c41e4f;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 13px 16px;
  font-family: 'Archivo', sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  min-height: 48px;
}
.dl:hover:not(:disabled) {
  box-shadow: 0 5px 16px rgba(196, 30, 79, 0.35);
}
.dl:disabled {
  opacity: 0.7;
  cursor: progress;
}
.dl-meta {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  font-weight: 400;
  opacity: 0.9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}
.focus-ring-ink:focus-visible {
  outline: 2px solid #17130e;
  outline-offset: 2px;
}

.scroll {
  flex: 1;
  overflow-y: auto;
  padding: 14px 16px 28px;
}

/* --- Book source --- */
.open-book {
  margin-bottom: 14px;
}
.open-label {
  display: flex;
  flex-direction: column;
  gap: 3px;
  border: 2px dashed rgba(23, 19, 14, 0.3);
  border-radius: 11px;
  padding: 14px;
  cursor: pointer;
  text-align: center;
  transition: border-color 0.15s;
}
.open-label:hover {
  border-color: #ff2e63;
}
.open-label strong {
  font-size: 13.5px;
}
.open-label span {
  font-size: 11.5px;
  color: #6e675d;
  line-height: 1.4;
}
.loaded-book {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}
.loaded-name {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11.5px;
  background: #17130e;
  color: #faf7f2;
  padding: 5px 9px;
  border-radius: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.loaded-meta {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  color: #6e675d;
}
.err {
  margin: 0 0 12px;
  padding: 10px 12px;
  border-radius: 9px;
  background: rgba(179, 38, 30, 0.07);
  border: 1px solid rgba(179, 38, 30, 0.25);
  color: #b3261e;
  font-size: 12px;
  line-height: 1.5;
}

/* --- Presets --- */
.row-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.section-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #6e675d;
}
.preset-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.preset-row.mobile {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 6px;
}
.preset-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  text-align: left;
  border: 1.5px solid rgba(23, 19, 14, 0.16);
  background: #fffdf9;
  border-radius: 11px;
  padding: 10px;
  cursor: pointer;
  transition: border-color 0.15s;
}
.preset-row.mobile .preset-card {
  min-width: 150px;
}
.preset-card.on {
  border-color: #ff2e63;
  background: rgba(255, 46, 99, 0.05);
}
.preset-name {
  font-size: 12.5px;
  font-weight: 600;
  color: #17130e;
}
.preset-desc {
  font-size: 10.5px;
  line-height: 1.35;
  color: #6e675d;
}

/* --- Cards --- */
.card {
  margin-top: 22px;
  padding: 12px 12px 4px;
  border-radius: 12px;
}
.card.saved {
  border: 1px solid rgba(23, 19, 14, 0.16);
  background: #fffdf9;
}
.card.preview-only {
  margin-top: 16px;
  padding: 12px 12px 6px;
  border: 1px dashed rgba(23, 19, 14, 0.25);
}
.card-head {
  display: flex;
  align-items: center;
  gap: 8px;
}
.bullet-square {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: #ff2e63;
}
.bullet-circle {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1.5px solid #6e675d;
}
.card-title {
  font-size: 13px;
  font-weight: 700;
}
.card-title.muted {
  color: #454037;
}
.card-note {
  margin: 4px 0 0;
  font-size: 11.5px;
  line-height: 1.45;
  color: #6e675d;
}
.card.preview-only .card-note {
  margin: 4px 0 6px;
}
.reset-all {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 12px;
  color: #6e675d;
  cursor: pointer;
  text-decoration: underline;
  min-height: 32px;
}
.reset-all:hover {
  color: #c41e4f;
}

.sec-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #6e675d;
  border-top: 1px solid rgba(23, 19, 14, 0.12);
  margin-top: 14px;
  padding-top: 12px;
}
.reset {
  background: none;
  border: none;
  font-size: 15px;
  color: #6e675d;
  cursor: pointer;
  min-width: 32px;
  min-height: 32px;
}

/* --- Typeface list --- */
.font-group {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #6e675d;
  margin: 12px 0 6px;
}
.font-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.font-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  min-height: 44px;
  padding: 8px 10px;
  border: 1px solid rgba(23, 19, 14, 0.14);
  border-radius: 9px;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s;
}
.font-row.on {
  border-color: #ff2e63;
  background: rgba(255, 46, 99, 0.06);
}
.dot-radio {
  flex: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: transparent;
  border: 1.5px solid rgba(23, 19, 14, 0.3);
}
.dot-radio.on {
  background: #ff2e63;
  border-color: #ff2e63;
}

/* --- Toggles --- */
.toggle-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 9px 0;
  min-height: 44px;
}
.toggle-copy {
  flex: 1;
}
.toggle-label {
  font-size: 13.5px;
  font-weight: 500;
}
.toggle-hint {
  font-size: 11.5px;
  color: #6e675d;
  margin-top: 2px;
  line-height: 1.4;
}

/* --- Sliders --- */
.slider-block {
  padding: 6px 0 12px;
}
.slider-block.small {
  padding: 7px 0;
}
.slider-block.measure {
  padding: 10px 0 14px;
}
.slider-head {
  display: flex;
  justify-content: space-between;
  font-size: 13.5px;
  font-weight: 500;
  margin-bottom: 4px;
}
.slider-head.sub {
  font-size: 12.5px;
  font-weight: 400;
  color: #6e675d;
  margin-bottom: 3px;
}
.mono {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11.5px;
  color: #6e675d;
}
.slider-head.sub .mono {
  font-size: 11px;
}
.comfort-band {
  position: relative;
  height: 4px;
  margin-top: 2px;
  border-radius: 2px;
  background: linear-gradient(
    to right,
    rgba(23, 19, 14, 0.08) 0%,
    rgba(23, 19, 14, 0.08) 36%,
    rgba(255, 46, 99, 0.35) 36%,
    rgba(255, 46, 99, 0.35) 64%,
    rgba(23, 19, 14, 0.08) 64%
  );
}
.comfort-note {
  font-size: 10.5px;
  color: #6e675d;
  margin-top: 3px;
}

/* --- Blocks / segmented --- */
.block {
  padding: 8px 0 2px;
}
.block.pb {
  padding-bottom: 12px;
}
.block-label {
  font-size: 13.5px;
  font-weight: 500;
  margin-bottom: 6px;
}
.seg {
  display: flex;
  border: 1px solid rgba(23, 19, 14, 0.22);
  border-radius: 9px;
  overflow: hidden;
}

.chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 8px 0 4px;
}

/* --- Custom colours --- */
.custom-colors {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 0;
  border-top: 1px dashed rgba(23, 19, 14, 0.15);
  margin-top: 6px;
}
.color-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}
.badge {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 5px;
  color: #fff;
  background: #1b7f4d;
}
.badge.fail {
  background: #b3261e;
}
.contrast-warn {
  font-size: 11.5px;
  line-height: 1.45;
  color: #b3261e;
}

/* --- Book details --- */
.book-toggle {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  border-top: 1px solid rgba(23, 19, 14, 0.12);
  padding: 12px 0;
  font-family: 'Archivo', sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  color: #17130e;
  cursor: pointer;
  min-height: 44px;
}
.book-toggle:hover {
  color: #c41e4f;
}
.chev {
  font-size: 16px;
  color: #ff2e63;
  transition: transform 0.2s;
}
.book-fields {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 0 14px;
}
.book-fields label {
  font-size: 12px;
  color: #6e675d;
}
.book-fields input {
  display: block;
  width: 100%;
  margin-top: 4px;
  padding: 10px;
  font-size: 16px;
  font-family: 'Archivo', sans-serif;
  border: 1px solid rgba(23, 19, 14, 0.25);
  border-radius: 8px;
  background: #fff;
  color: #17130e;
}
</style>
