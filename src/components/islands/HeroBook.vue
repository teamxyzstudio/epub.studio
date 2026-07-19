<script setup>
/**
 * The "living book": a 340x300 card that morphs between three ebook formats
 * on a timer, with a format ticker underneath.
 *
 * Every value below is lifted from `fmts` / `heroCard` / `heroTitle` /
 * `heroLines` in mocks/Home.dc.html renderVals().
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps({
  cycleSeconds: { type: Number, default: 3.8 },
});

const fmts = [
  {
    bg: '#FFFDF9',
    pad: '30px 28px',
    rad: '8px',
    bar: 'rgba(23,19,14,.72)',
    shadow: '0 1px 0 rgba(23,19,14,.1), 0 12px 32px rgba(23,19,14,.08)',
    border: '1px solid rgba(23,19,14,.16)',
    widths: [58, 100, 93, 97, 86, 99, 91, 64],
    align: 'flex-start',
  },
  {
    bg: '#FFFFFF',
    pad: '42px 38px',
    rad: '2px',
    bar: '#20242a',
    shadow: '0 2px 0 rgba(23,19,14,.14), 0 16px 40px rgba(23,19,14,.12)',
    border: '1px solid rgba(23,19,14,.22)',
    widths: [46, 100, 100, 100, 100, 100, 100, 38],
    align: 'flex-start',
  },
  {
    bg: '#15181C',
    pad: '34px 26px',
    rad: '20px',
    bar: '#C9D1D9',
    shadow: '0 0 0 7px #2A2E35, 0 18px 44px rgba(23,19,14,.25)',
    border: '1px solid #000',
    widths: [52, 96, 100, 90, 98, 84, 95, 58],
    align: 'flex-start',
  },
];

const fmt = ref(0);
let timer = null;

onMounted(() => {
  // README: respect prefers-reduced-motion by freezing the animation.
  const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (rm.matches) return;
  timer = setInterval(() => {
    fmt.value = (fmt.value + 1) % 3;
  }, props.cycleSeconds * 1000);
});

onBeforeUnmount(() => clearInterval(timer));

const f = computed(() => fmts[fmt.value]);

const EASE = 'all 1s cubic-bezier(.4,0,.2,1)';

const cardStyle = computed(() => ({
  width: 'min(100%,340px)',
  height: '300px',
  display: 'flex',
  flexDirection: 'column',
  gap: '13px',
  alignItems: f.value.align,
  background: f.value.bg,
  padding: f.value.pad,
  borderRadius: f.value.rad,
  boxShadow: f.value.shadow,
  border: f.value.border,
  transition: EASE,
  overflow: 'hidden',
}));

const titleStyle = computed(() => ({
  height: '13px',
  width: `${f.value.widths[0]}%`,
  background: f.value.bar,
  borderRadius: '3px',
  marginBottom: '6px',
  transition: EASE,
}));

const lineStyles = computed(() =>
  f.value.widths.slice(1).map((w, i) => ({
    height: '7px',
    width: `${w}%`,
    background: f.value.bar,
    opacity: String(0.85 - i * 0.02),
    borderRadius: '2.5px',
    transition: EASE,
    transitionDelay: `${i * 55}ms`,
  })),
);

const seg = (i) =>
  fmt.value === i
    ? { color: '#FF2E63', fontWeight: 500, transition: 'color .4s' }
    : { color: '#6E675D', transition: 'color .4s' };
</script>

<template>
  <div class="hero-book">
    <div :style="cardStyle" aria-hidden="true">
      <div :style="titleStyle"></div>
      <div v-for="(s, i) in lineStyles" :key="i" :style="s"></div>
    </div>
    <div class="ticker">
      <span :style="seg(0)">.epub</span><span>→</span><span :style="seg(1)">.pdf</span
      ><span>→</span><span :style="seg(2)">.azw3</span>
    </div>
  </div>
</template>

<style scoped>
.hero-book {
  flex: 0 1 400px;
  min-width: 260px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.ticker {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  color: #6e675d;
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
