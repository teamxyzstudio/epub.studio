<script setup>
/**
 * Reading-progress bar + scroll-spy table of contents.
 *
 * Both are driven by one scroll listener. Neither uses <Teleport>: Teleport
 * emits nothing during Astro's SSR pass, so the client vdom has more children
 * than the server HTML, hydration mismatches, and the island never actually
 * comes alive. The progress fill is positioned `fixed` directly under the 60px
 * header instead, which lands in exactly the same place as the mock's
 * in-header bar.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps({
  toc: { type: Array, default: () => [] },
  tools: { type: Array, default: () => [] },
});

const progress = ref(0);
const active = ref(props.toc[0]?.id || '');

/**
 * Measured synchronously in the passive scroll handler rather than deferred to
 * requestAnimationFrame. The work is three getBoundingClientRect reads and no
 * writes, so there is nothing to batch — and rAF never fires in a background
 * tab, which would leave the bar stale until the tab was refocused.
 */
function measure() {
  const d = document.documentElement;
  const max = d.scrollHeight - d.clientHeight;
  progress.value = max > 0 ? Math.min(1, d.scrollTop / max) : 0;

  // Last heading whose top has passed the 140px line wins — the mock's rule,
  // so the highlight tracks the section you are actually reading.
  let current = props.toc[0]?.id || '';
  for (const t of props.toc) {
    const el = document.getElementById(t.id);
    if (el && el.getBoundingClientRect().top < 140) current = t.id;
  }
  active.value = current;
}

onMounted(() => {
  window.addEventListener('scroll', measure, { passive: true });
  window.addEventListener('resize', measure);
  measure();
});
onBeforeUnmount(() => {
  window.removeEventListener('scroll', measure);
  window.removeEventListener('resize', measure);
});
</script>

<template>
  <div class="progress-fill" :style="{ width: progress * 100 + '%' }" aria-hidden="true"></div>

  <aside class="toc-aside">
    <div class="toc-kicker">On this page</div>
    <nav class="toc" aria-label="On this page">
      <a
        v-for="t in toc"
        :key="t.id"
        :href="'#' + t.id"
        class="toc-link focus-ring-2"
        :class="{ on: active === t.id }"
        >{{ t.label }}</a
      >
    </nav>

    <div v-if="tools.length" class="tools-card">
      <div class="tools-title">Tools mentioned</div>
      <div class="tools-list">
        <a v-for="t in tools" :key="t.href" :href="t.href" class="focus-ring-2">
          <span class="arrow">→</span> {{ t.name }}
        </a>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* Sits on the static 3px track rendered inside the sticky header. */
.progress-fill {
  position: fixed;
  top: 60px;
  left: 0;
  height: 3px;
  background: #ff2e63;
  z-index: 41;
  transition: width 0.1s linear;
}

.toc-aside {
  flex: none;
  width: 250px;
  position: sticky;
  top: 88px;
}

.toc-kicker {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6e675d;
  margin-bottom: 12px;
}

.toc {
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-left: 1px solid rgba(23, 19, 14, 0.14);
}
.toc-link {
  padding: 7px 0 7px 14px;
  font-size: 13px;
  line-height: 1.4;
  color: #454037;
  font-weight: 400;
  border-left: 2px solid transparent;
  margin-left: -1.5px;
  transition:
    color 0.15s,
    border-color 0.15s;
}
.toc-link:hover {
  color: #c41e4f;
}
.toc-link.on {
  /* Pink Ink for the 13px label (AA); the accent bar stays Electric Pink. */
  color: #c41e4f;
  font-weight: 600;
  border-left-color: #ff2e63;
}

.tools-card {
  margin-top: 28px;
  border: 1px solid rgba(23, 19, 14, 0.16);
  border-radius: 12px;
  padding: 16px;
  background: #fffdf9;
}
.tools-title {
  font-size: 13.5px;
  font-weight: 600;
  margin-bottom: 4px;
}
.tools-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}
.tools-list a {
  font-size: 13px;
  color: #17130e;
}
.arrow {
  color: #ff2e63;
}

/* Sidebar is desktop-only (mock wraps the aside in sc-if isDesktop). */
@media (max-width: 759.98px) {
  .toc-aside {
    display: none;
  }
}
</style>
