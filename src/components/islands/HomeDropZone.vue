<script setup>
/**
 * Homepage drop zone. The whole page is the drag target (window listeners),
 * matching `_over` / `_leave` / `_drop` in mocks/Home.dc.html.
 *
 * The desktop/mobile headline swap is done with CSS rather than JS so the
 * static HTML is already correct before hydration.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps({
  /** [{ ext: 'epub', tools: [{ n, href }] }] flattened to a lookup map. */
  suggestionMap: { type: Object, required: true },
});

const dragging = ref(false);
const fileName = ref(null);

const onOver = (e) => {
  e.preventDefault();
  if (!dragging.value) dragging.value = true;
};
const onLeave = (e) => {
  if (!e.relatedTarget) dragging.value = false;
};
const onDrop = (e) => {
  e.preventDefault();
  const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
  dragging.value = false;
  if (f) fileName.value = f.name;
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
});

const onFileInput = (e) => {
  const f = e.target.files && e.target.files[0];
  if (f) fileName.value = f.name;
};

const ext = computed(() =>
  fileName.value ? (fileName.value.split('.').pop() || '').toLowerCase() : '',
);

const suggestions = computed(() => props.suggestionMap[ext.value] || []);

const suggestLabel = computed(() => {
  if (!fileName.value) return '';
  return suggestions.value.length
    ? `Looks like ${ext.value.toUpperCase()} — try:`
    : `We don’t recognize .${ext.value} — pick a tool below.`;
});
</script>

<template>
  <label
    for="hero-file"
    class="dropzone focus-ring"
    :class="{ dragging }"
    :aria-label="'Choose a file to convert'"
  >
    <input
      id="hero-file"
      type="file"
      class="sr-only-file"
      @change="onFileInput"
    />
    <div class="headline">
      <template v-if="dragging">Drop it.</template>
      <template v-else>
        <span class="on-desktop">Drop a file anywhere on this page</span>
        <span class="on-mobile">Tap to choose a file</span>
      </template>
    </div>
    <div class="sub">
      <template v-if="dragging">we’ll take it from here</template>
      <template v-else
        >.epub · .pdf · .docx · .mobi · .azw3 · .txt · .md · .html · .fb2 · .cbz</template
      >
    </div>
  </label>

  <div v-if="fileName" class="picked">
    <span class="chip">{{ fileName }}</span>
    <span class="label">{{ suggestLabel }}</span>
    <a v-for="s in suggestions" :key="s.href" :href="s.href" class="pill focus-ring">{{ s.n }}</a>
  </div>
</template>

<style scoped>
.dropzone {
  position: relative;
  display: block;
  margin-top: clamp(26px, 3.5vw, 44px);
  border: 2px dashed rgba(23, 19, 14, 0.3);
  background: #fffdf9;
  border-radius: 14px;
  padding: clamp(26px, 4vw, 44px) clamp(16px, 3vw, 40px);
  text-align: center;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background 0.2s,
    transform 0.2s;
  transform: none;
}
.dropzone:hover {
  border-color: #17130e;
}
/* Declared after :hover so the drag state wins at equal specificity. */
.dropzone.dragging,
.dropzone.dragging:hover {
  border-color: #ff2e63;
  background: rgba(255, 46, 99, 0.05);
  transform: scale(1.01);
}

.headline {
  font-family: 'Instrument Serif', serif;
  font-size: clamp(22px, 2.4vw, 30px);
  letter-spacing: -0.01em;
}

.sub {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12.5px;
  color: #6e675d;
  margin-top: 6px;
}

.on-mobile {
  display: none;
}
@media (max-width: 759.98px) {
  .on-desktop {
    display: none;
  }
  .on-mobile {
    display: inline;
  }
}

.picked {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
}

.chip {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  background: #17130e;
  color: #faf7f2;
  padding: 6px 10px;
  border-radius: 6px;
}

.label {
  font-size: 13.5px;
  color: #6e675d;
}

.pill {
  font-size: 13.5px;
  font-weight: 600;
  border: 1.5px solid #ff2e63;
  color: #c41e4f;
  padding: 6px 12px;
  border-radius: 999px;
}
.pill:hover {
  background: #c41e4f;
  color: #fff;
}
</style>
