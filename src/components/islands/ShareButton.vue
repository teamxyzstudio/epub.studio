<script setup>
/**
 * Share button — copies the canonical URL to the clipboard.
 *
 * Its own tiny island so it can sit inline in the byline. (An earlier version
 * used <Teleport> from the article island; Teleport renders nothing during
 * Astro's SSR pass, which produces a hydration mismatch and silently leaves
 * the whole island un-hydrated.)
 */
import { computed, onBeforeUnmount, ref } from 'vue';

const copied = ref(false);
const failed = ref(false);
let timer;

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    copied.value = true;
    failed.value = false;
  } catch {
    // Clipboard API needs a secure context and permission. Don't claim success.
    failed.value = true;
  }
  clearTimeout(timer);
  timer = setTimeout(() => {
    copied.value = false;
    failed.value = false;
  }, 1600);
}

onBeforeUnmount(() => clearTimeout(timer));

const label = computed(() => {
  if (copied.value) return 'Link copied ✓';
  if (failed.value) return 'Copy failed';
  return 'Share';
});
</script>

<template>
  <button class="share focus-ring-2" @click="copyLink">{{ label }}</button>
</template>

<style scoped>
.share {
  min-height: 40px;
  padding: 8px 14px;
  border: 1.5px solid rgba(23, 19, 14, 0.22);
  border-radius: 999px;
  background: none;
  font-family: 'Archivo', sans-serif;
  font-size: 12.5px;
  font-weight: 600;
  color: #17130e;
  cursor: pointer;
  white-space: nowrap;
}
.share:hover {
  border-color: #ff2e63;
  color: #ff2e63;
}
</style>
