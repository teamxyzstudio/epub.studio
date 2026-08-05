<script setup>
/**
 * The tool card: idle → file → working → done, exactly as specified by
 * `state` / `renderVals()` in mocks/EPUB to PDF.dc.html.
 *
 * The mock fakes progress on a 90ms timer. This runs the real conversion and
 * reports genuine progress from the engine, so the bar reflects actual work.
 */
import { computed, onBeforeUnmount, onMounted, ref, reactive } from 'vue';
import { getEngine, PRODUCES_EPUB } from '../../lib/convert/registry.js';

const props = defineProps({
  slug: { type: String, required: true },
  accept: { type: String, default: '.epub' },
  dropHeadline: { type: String, required: true },
  /** Touch-phrased invitation under 760px; landing pages override it. */
  dropHeadlineMobile: { type: String, default: 'Tap to choose a file' },
  dropSub: { type: String, required: true },
  cta: { type: String, required: true },
  doneTitle: { type: String, required: true },
  downloadLabel: { type: String, default: 'Download' },
  options: { type: Array, default: () => [] },
  /** 'convert' | 'metadata' | 'cover' | 'report' | 'multi' | 'reader' */
  mode: { type: String, default: 'convert' },
});

const stage = ref('idle');
const dragging = ref(false);
const files = ref([]);
const pct = ref(0);
const error = ref('');
const downloaded = ref(false);
const result = ref(null);
const report = ref(null);
const coverFile = ref(null);
const handoffId = ref('');
const handoffPending = ref(false);
const meta = reactive({ title: '', creator: '', language: '', publisher: '' });

const producesEpub = PRODUCES_EPUB.has(props.slug);

const choice = reactive(
  Object.fromEntries(props.options.map((o) => [o.key, o.value ?? o.choices[0]])),
);

const file = computed(() => files.value[0] || null);
const fileSize = computed(() => (file.value ? formatBytes(file.value.size) : ''));
const isMulti = computed(() => props.mode === 'multi');

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1048576) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1048576).toFixed(1)} MB`;
}

// --- Page-wide drag target (mirrors the mock's window listeners) ----------
const onOver = (e) => {
  e.preventDefault();
  if (stage.value === 'idle' && !dragging.value) dragging.value = true;
};
const onLeave = (e) => {
  if (!e.relatedTarget) dragging.value = false;
};
const onDrop = (e) => {
  e.preventDefault();
  dragging.value = false;
  const dropped = e.dataTransfer && e.dataTransfer.files;
  if (dropped && dropped.length && stage.value === 'idle') pick([...dropped]);
};

onMounted(() => {
  window.addEventListener('dragover', onOver);
  window.addEventListener('dragleave', onLeave);
  window.addEventListener('drop', onDrop);
});
onBeforeUnmount(() => {
  window.removeEventListener('dragover', onOver);
  window.removeEventListener('dragleave', onLeave);
  window.removeEventListener('drop', onDrop);
  if (result.value?.url) URL.revokeObjectURL(result.value.url);
});

async function pick(list) {
  files.value = isMulti.value ? list : [list[0]];
  error.value = '';
  downloaded.value = false;
  stage.value = 'file';

  // The metadata editor pre-fills its form from the book itself.
  if (props.mode === 'metadata') {
    try {
      const { inspectMetadata } = await import('../../lib/convert/utilities.js');
      const current = await inspectMetadata(files.value[0]);
      meta.title = current.title;
      meta.creator = current.author;
      meta.language = current.language;
      meta.publisher = current.publisher;
    } catch (e) {
      error.value = e.message;
    }
  }
}

const onFileInput = (e) => {
  const list = e.target.files;
  if (list && list.length) pick([...list]);
};

function clearFile() {
  if (result.value?.url) URL.revokeObjectURL(result.value.url);
  stage.value = 'idle';
  files.value = [];
  pct.value = 0;
  error.value = '';
  result.value = null;
  report.value = null;
  coverFile.value = null;
}

async function run() {
  error.value = '';
  stage.value = 'working';
  pct.value = 0;

  try {
    const engine = await getEngine(props.slug);
    if (!engine) throw new Error('This tool is not wired up yet.');

    const options = {
      ...choice,
      ...(props.mode === 'metadata' ? meta : {}),
      ...(props.mode === 'cover' ? { coverFile: coverFile.value } : {}),
      ...(isMulti.value ? { files: files.value } : {}),
    };

    const out = await engine(files.value[0], options, (p) => {
      pct.value = Math.min(100, Math.max(pct.value, p));
    });

    pct.value = 100;

    if (out.report) {
      report.value = out.report;
      stage.value = 'done';
      return;
    }

    result.value = {
      url: URL.createObjectURL(out.blob),
      filename: out.filename,
      size: formatBytes(out.blob.size),
      note: out.note || '',
    };
    stage.value = 'done';

    // A freshly converted EPUB continues into Style Studio, where the reader
    // sets the typography that gets written into the file they download.
    if (PRODUCES_EPUB.has(props.slug)) {
      handoffPending.value = true;
      try {
        const { putBook } = await import('../../lib/handoff.js');
        handoffId.value = await putBook({
          blob: out.blob,
          filename: out.filename,
          sourceName: files.value[0]?.name || '',
        });
      } catch {
        // IndexedDB unavailable (private mode, quota). The plain download
        // below still works, so this stays a soft failure.
        handoffId.value = '';
      } finally {
        handoffPending.value = false;
      }
    }
  } catch (e) {
    console.error(e);
    error.value = e?.message || 'Something went wrong converting this file.';
    stage.value = 'file';
  }
}

const canRun = computed(() => {
  if (props.mode === 'cover') return !!coverFile.value;
  if (isMulti.value) return files.value.length >= 2;
  return files.value.length >= 1;
});

const workLines = computed(() =>
  [92, 100, 96, 88, 100, 70].map((w, i) => {
    const lit = (pct.value / 100) * 6 > i;
    return {
      height: '7px',
      width: `${w}%`,
      borderRadius: '2.5px',
      transformOrigin: 'left',
      background: lit ? 'rgba(23,19,14,.75)' : 'rgba(23,19,14,.15)',
      animation: lit ? 'retype .5s ease-out both' : 'none',
      transition: 'background .3s',
    };
  }),
);

</script>

<template>
  <div class="tool-card-shell">
    <!-- ---------- idle ---------- -->
    <template v-if="stage === 'idle'">
      <label for="tool-file" class="dropzone focus-ring" :class="{ dragging }">
        <input
          id="tool-file"
          type="file"
          :accept="accept"
          :multiple="isMulti"
          class="sr-only-file"
          @change="onFileInput"
        />
        <div class="dz-headline">
          <template v-if="dragging">Drop it.</template>
          <template v-else>
            <span class="on-desktop">{{ dropHeadline }}</span>
            <span class="on-mobile">{{ dropHeadlineMobile }}</span>
          </template>
        </div>
        <div class="dz-sub">{{ dropSub }}</div>
      </label>
    </template>

    <!-- ---------- file ---------- -->
    <template v-else-if="stage === 'file'">
      <div class="file-row">
        <span v-for="f in files" :key="f.name" class="filename">{{ f.name }}</span>
        <span v-if="!isMulti" class="filesize">{{ fileSize }}</span>
        <button class="linkish focus-ring-2" @click="clearFile">Choose a different file</button>
      </div>

      <p v-if="error" class="error" role="alert">{{ error }}</p>

      <!-- Segmented controls -->
      <div v-if="options.length" class="options">
        <div v-for="o in options" :key="o.key" class="option">
          <div class="option-label">{{ o.label }}</div>
          <div class="segmented">
            <button
              v-for="(c, i) in o.choices"
              :key="c"
              class="segment focus-ring-inset"
              :class="{ on: choice[o.key] === c, first: i === 0 }"
              @click="choice[o.key] = c"
            >
              {{ c }}
            </button>
          </div>
        </div>
      </div>

      <!-- Metadata editor fields -->
      <div v-if="mode === 'metadata'" class="fields">
        <label class="field">
          <span>Title</span><input v-model="meta.title" class="focus-ring-2" type="text" />
        </label>
        <label class="field">
          <span>Author</span><input v-model="meta.creator" class="focus-ring-2" type="text" />
        </label>
        <label class="field">
          <span>Language</span><input v-model="meta.language" class="focus-ring-2" type="text" />
        </label>
        <label class="field">
          <span>Publisher</span><input v-model="meta.publisher" class="focus-ring-2" type="text" />
        </label>
      </div>

      <!-- Cover picker -->
      <div v-if="mode === 'cover'" class="fields">
        <label class="field">
          <span>New cover image</span>
          <input
            class="focus-ring-2"
            type="file"
            accept="image/png,image/jpeg"
            @change="(e) => (coverFile = e.target.files[0] || null)"
          />
        </label>
      </div>

      <button class="cta desktop-cta focus-ring-ink" :disabled="!canRun" @click="run">
        {{ cta }}
      </button>
    </template>

    <!-- ---------- working ---------- -->
    <template v-else-if="stage === 'working'">
      <div class="working">
        <div class="work-lines">
          <div v-for="(s, i) in workLines" :key="i" :style="s"></div>
        </div>
        <div class="work-pct">re-typesetting · {{ Math.round(pct) }}%</div>
        <div class="bar"><div class="bar-fill" :style="{ width: pct + '%' }"></div></div>
      </div>
    </template>

    <!-- ---------- done ---------- -->
    <template v-else>
      <!-- Validator report -->
      <div v-if="report" class="report">
        <svg
          v-if="report.ok"
          width="44"
          height="44"
          viewBox="0 0 44 44"
          class="tick"
          aria-hidden="true"
        >
          <circle cx="22" cy="22" r="20" fill="none" stroke="#FF2E63" stroke-width="2.5" />
          <path
            d="M14 22.5l6 6 10-12"
            fill="none"
            stroke="#FF2E63"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <div class="done-title">{{ report.ok ? 'This EPUB is valid' : 'Problems found' }}</div>
        <ul class="issues">
          <li v-for="(iss, i) in report.issues" :key="i" :class="iss.level">
            <span class="issue-level">{{ iss.level }}</span>{{ iss.message }}
          </li>
        </ul>
        <button class="linkish center focus-ring-2" @click="clearFile">Check another file</button>
      </div>

      <!-- Download -->
      <div v-else class="done">
        <svg width="44" height="44" viewBox="0 0 44 44" class="tick" aria-hidden="true">
          <circle cx="22" cy="22" r="20" fill="none" stroke="#FF2E63" stroke-width="2.5" />
          <path
            d="M14 22.5l6 6 10-12"
            fill="none"
            stroke="#FF2E63"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <div class="done-title">{{ doneTitle }}</div>
        <div class="done-meta">
          {{ result.filename }} · {{ result.size
          }}<template v-if="result.note"> · {{ result.note }}</template> · never left your device
        </div>
        <!-- For EPUB output, styling is the primary path; the raw download
             stays available for anyone who just wants the file. -->
        <template v-if="producesEpub">
          <a
            v-if="handoffId"
            class="cta download focus-ring-ink"
            :href="`/style-studio?book=${handoffId}`"
          >
            Style it before downloading →
          </a>
          <span v-else-if="handoffPending" class="handoff-note">Preparing your book…</span>

          <a
            class="secondary-dl focus-ring-2"
            :href="result.url"
            :download="result.filename"
            @click="downloaded = true"
          >
            {{ downloaded ? 'Downloaded ✓' : 'Download without styling' }}
          </a>
        </template>

        <a
          v-else
          class="cta download focus-ring-ink"
          :href="result.url"
          :download="result.filename"
          @click="downloaded = true"
        >
          {{ downloaded ? 'Downloaded ✓' : downloadLabel }}
        </a>

        <button class="linkish center focus-ring-2" @click="clearFile">Convert another file</button>
      </div>
    </template>

    <!-- Mobile sticky CTA, `file` state only (README §2 Mobile).
         Rendered in place rather than teleported: <Teleport> produces no SSR
         output, which mismatches on hydration and leaves the island dead.
         `position: fixed` works here because no ancestor establishes a
         containing block (no transform/filter/contain on .tool-card). -->
    <div v-if="stage === 'file'" class="sticky-cta">
      <button class="cta focus-ring-ink" :disabled="!canRun" @click="run">{{ cta }}</button>
    </div>
  </div>
</template>

<style scoped>
/* --- drop zone (mock: `dropZone` in renderVals) --- */
.dropzone {
  position: relative;
  display: block;
  border: 2px dashed rgba(23, 19, 14, 0.3);
  background: transparent;
  border-radius: 12px;
  padding: clamp(26px, 4vw, 42px) 16px;
  text-align: center;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background 0.2s;
}
.dropzone:hover {
  border-color: #17130e;
}
.dropzone.dragging,
.dropzone.dragging:hover {
  border-color: #ff2e63;
  background: rgba(255, 46, 99, 0.05);
}
.dz-headline {
  font-family: 'Instrument Serif', serif;
  font-size: clamp(21px, 2.2vw, 27px);
  letter-spacing: -0.01em;
}
.dz-sub {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12.5px;
  color: #6e675d;
  margin-top: 6px;
}
.on-mobile {
  display: none;
}

/* --- file state --- */
.file-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.filename {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  background: #17130e;
  color: #faf7f2;
  padding: 7px 11px;
  border-radius: 6px;
}
.filesize {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  color: #6e675d;
}
.linkish {
  margin-left: auto;
  background: none;
  border: none;
  font-family: 'Archivo', sans-serif;
  font-size: 13px;
  color: #6e675d;
  cursor: pointer;
  text-decoration: underline;
  min-height: 44px;
  padding: 0 6px;
}
.linkish:hover {
  color: #c41e4f;
}
.linkish.center {
  margin: 10px auto 0;
  font-size: 13.5px;
}

.error {
  margin: 14px 0 0;
  padding: 12px 14px;
  border-radius: 9px;
  background: rgba(179, 38, 30, 0.07);
  border: 1px solid rgba(179, 38, 30, 0.25);
  color: #b3261e;
  font-size: 13.5px;
  line-height: 1.5;
}
/* --- segmented controls (mock: `seg()`) --- */
.options {
  display: flex;
  gap: clamp(16px, 3vw, 36px);
  flex-wrap: wrap;
  margin-top: 22px;
}
.option {
  flex: 1;
  min-width: 200px;
}
.option-label {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}
.segmented {
  display: flex;
  gap: 0;
  border: 1px solid rgba(23, 19, 14, 0.22);
  border-radius: 9px;
  overflow: hidden;
}
.segment {
  flex: 1;
  min-height: 44px;
  padding: 10px 6px;
  border: none;
  cursor: pointer;
  font-family: 'Archivo', sans-serif;
  font-size: 13.5px;
  font-weight: 400;
  background: transparent;
  color: #17130e;
  border-left: 1px solid rgba(23, 19, 14, 0.18);
  transition: background 0.15s;
}
.segment.first {
  border-left: none;
}
.segment.on {
  font-weight: 600;
  background: #17130e;
  color: #faf7f2;
}

/* --- editor fields --- */
.fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr));
  gap: 14px;
  margin-top: 22px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field span {
  font-size: 13px;
  font-weight: 600;
}
.field input {
  font-family: 'Archivo', sans-serif;
  font-size: 14px;
  color: #17130e;
  background: #faf7f2;
  border: 1px solid rgba(23, 19, 14, 0.22);
  border-radius: 9px;
  padding: 11px 12px;
  min-height: 44px;
}

/* --- CTA --- */
.cta {
  margin-top: 24px;
  width: 100%;
  display: block;
  text-align: center;
  background: #c41e4f;
  color: #fff;
  border: none;
  border-radius: 11px;
  padding: 16px;
  font-family: 'Archivo', sans-serif;
  font-size: 16.5px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.12s,
    box-shadow 0.12s;
}
.cta:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(196, 30, 79, 0.35);
}
.cta:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.focus-ring-ink:focus-visible {
  outline: 2px solid #17130e;
  outline-offset: 3px;
}
.cta.download {
  width: min(100%, 340px);
  margin: 18px auto 0;
  color: #fff;
}

.secondary-dl {
  display: inline-block;
  margin: 10px auto 0;
  font-size: 13.5px;
  font-weight: 600;
  color: #17130e;
  border: 1.5px solid rgba(23, 19, 14, 0.25);
  border-radius: 999px;
  padding: 9px 18px;
  min-height: 40px;
  line-height: 22px;
}
.secondary-dl:hover {
  border-color: #ff2e63;
  color: #c41e4f;
}

.handoff-note {
  margin-top: 18px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12.5px;
  color: #6e675d;
}

/* --- working --- */
.working {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 0 6px;
}
.work-lines {
  width: min(100%, 300px);
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.work-pct {
  margin-top: 20px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  color: #6e675d;
}
.bar {
  width: min(100%, 300px);
  height: 3px;
  background: rgba(23, 19, 14, 0.1);
  border-radius: 2px;
  margin-top: 10px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  background: #ff2e63;
  transition: width 0.12s linear;
}

/* --- done --- */
.done,
.report {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0 4px;
  text-align: center;
}
.tick {
  animation: tick 0.45s ease-out both;
}
.done-title {
  font-family: 'Instrument Serif', serif;
  font-size: 26px;
  margin-top: 12px;
}
.done-meta {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12.5px;
  color: #6e675d;
  margin-top: 5px;
}

.issues {
  list-style: none;
  margin: 16px 0 0;
  padding: 0;
  width: 100%;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.issues li {
  font-size: 13.5px;
  line-height: 1.55;
  padding: 10px 12px;
  border-radius: 9px;
  border: 1px solid rgba(23, 19, 14, 0.14);
  background: #faf7f2;
}
.issues li.error {
  border-color: rgba(179, 38, 30, 0.3);
  background: rgba(179, 38, 30, 0.06);
}
.issues li.ok {
  border-color: rgba(27, 127, 77, 0.3);
  background: rgba(27, 127, 77, 0.06);
}
.issue-level {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6e675d;
  margin-right: 8px;
}
.issues li.error .issue-level {
  color: #b3261e;
}
.issues li.ok .issue-level {
  color: #1b7f4d;
}

/* --- mobile --- */
.sticky-cta {
  display: none;
}
@media (max-width: 759.98px) {
  .on-desktop {
    display: none;
  }
  .on-mobile {
    display: inline;
  }
  .desktop-cta {
    display: none;
  }
  .sticky-cta {
    display: block;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
    padding: 10px 16px calc(10px + env(safe-area-inset-bottom));
    background: rgba(250, 247, 242, 0.96);
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(23, 19, 14, 0.14);
  }
  .sticky-cta .cta {
    margin-top: 0;
    padding: 15px;
    font-size: 16px;
  }
}
</style>
