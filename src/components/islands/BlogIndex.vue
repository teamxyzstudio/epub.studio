<script setup>
/**
 * Blog listing: category chips, featured card, post grid, "Older posts".
 *
 * Rendered on the server with cat='All' and the first page expanded, so the
 * static HTML already contains every card the crawler needs — the island only
 * takes over the filtering once hydrated.
 */
import { computed, ref } from 'vue';

const props = defineProps({
  posts: { type: Array, required: true },
  featured: { type: Object, default: null },
  categories: { type: Array, required: true },
  pageSize: { type: Number, default: 9 },
});

const cat = ref('All');
const shown = ref(props.pageSize);

const chips = computed(() => ['All', ...props.categories]);

function select(c) {
  cat.value = c;
  shown.value = props.pageSize;
}

const filtered = computed(() =>
  cat.value === 'All' ? props.posts : props.posts.filter((p) => p.category === cat.value),
);

const visible = computed(() => filtered.value.slice(0, shown.value));

// The featured card is hidden unless its own category is in view.
const showFeatured = computed(
  () => props.featured && (cat.value === 'All' || cat.value === props.featured.category),
);

const hasMore = computed(() => filtered.value.length > shown.value);
</script>

<template>
  <div class="chips">
    <button
      v-for="c in chips"
      :key="c"
      class="chip focus-ring-2"
      :class="{ on: cat === c }"
      @click="select(c)"
    >
      {{ c }}
    </button>
  </div>

  <a v-if="showFeatured" :href="featured.href" class="featured focus-ring-2">
    <div class="featured-copy">
      <div class="featured-meta">
        <span class="badge-featured">Featured</span>
        <span>{{ featured.category }}</span>
        <span>·</span>
        <span>{{ featured.readTime }} read</span>
        <span>·</span>
        <span class="who">
          <img
            v-if="featured.author.photo"
            class="who-avatar"
            :src="featured.author.photo"
            alt=""
            width="20"
            height="20"
            loading="lazy"
            decoding="async"
          />
          <span v-else class="who-avatar who-initial" aria-hidden="true">{{
            featured.author.initial
          }}</span>
          {{ featured.author.name }}
        </span>
      </div>
      <div class="featured-title">{{ featured.title }}</div>
      <p>{{ featured.excerpt }}</p>
      <div class="featured-cta">Read the guide →</div>
    </div>
    <div class="featured-art" :class="{ 'has-img': featured.image }" aria-hidden="true">
      <img
        v-if="featured.image"
        class="featured-img"
        :src="featured.image"
        alt=""
        width="1200"
        height="630"
        loading="lazy"
        decoding="async"
      />
      <div v-else class="art-row">
        <div class="book book-epub">
          <span style="height: 5px; width: 70%; background: rgba(23, 19, 14, 0.6)"></span>
          <span style="height: 3.5px; width: 100%; background: rgba(23, 19, 14, 0.25)"></span>
          <span style="height: 3.5px; width: 92%; background: rgba(23, 19, 14, 0.25)"></span>
          <span style="height: 3.5px; width: 97%; background: rgba(23, 19, 14, 0.25)"></span>
        </div>
        <div class="book book-pdf">
          <span style="height: 5px; width: 50%; background: #20242a"></span>
          <span style="height: 3.5px; width: 100%; background: rgba(23, 19, 14, 0.3)"></span>
          <span style="height: 3.5px; width: 100%; background: rgba(23, 19, 14, 0.3)"></span>
          <span style="height: 3.5px; width: 100%; background: rgba(23, 19, 14, 0.3)"></span>
          <span style="height: 3.5px; width: 40%; background: rgba(23, 19, 14, 0.3)"></span>
        </div>
        <div class="book book-mobi">
          <span style="height: 5px; width: 65%; background: #c9d1d9"></span>
          <span style="height: 3.5px; width: 95%; background: rgba(201, 209, 217, 0.5)"></span>
          <span style="height: 3.5px; width: 88%; background: rgba(201, 209, 217, 0.5)"></span>
          <span style="height: 3.5px; width: 92%; background: rgba(201, 209, 217, 0.5)"></span>
        </div>
      </div>
    </div>
  </a>

  <div class="grid">
    <a v-for="p in visible" :key="p.href" :href="p.href" class="card focus-ring-2">
      <!-- Branded card as thumbnail. alt="" — it repeats the title the card
           already shows as text, so reading it out would be a duplicate. -->
      <img
        v-if="p.image"
        class="card-img"
        :src="p.image"
        alt=""
        width="1200"
        height="630"
        loading="lazy"
        decoding="async"
      />
      <div class="card-meta">
        <span class="cat">{{ p.category }}</span><span>{{ p.readTime }}</span>
      </div>
      <div class="card-title">{{ p.title }}</div>
      <p>{{ p.excerpt }}</p>
      <!-- The listing showed no byline at all; posts have named humans behind
           them and the card is where most readers decide to trust one. Plain
           text, not a link: the whole card is already an <a>, and an author
           link inside it would be a nested anchor. -->
      <div class="card-byline">
        <img
          v-if="p.author.photo"
          class="who-avatar"
          :src="p.author.photo"
          alt=""
          width="24"
          height="24"
          loading="lazy"
          decoding="async"
        />
        <span v-else class="who-avatar who-initial" aria-hidden="true">{{ p.author.initial }}</span>
        <span class="card-author">{{ p.author.name }}</span>
      </div>
      <div class="card-foot"><span>{{ p.date }}</span><span class="read">Read →</span></div>
    </a>
  </div>

  <p v-if="!visible.length" class="empty">Nothing filed under “{{ cat }}” yet.</p>

  <div v-if="hasMore" class="older-wrap">
    <button class="older focus-ring-2" @click="shown += pageSize">Older posts</button>
  </div>
</template>

<style scoped>
/* --- Category chips --- */
.chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: clamp(22px, 3vw, 32px) 0 clamp(18px, 2.5vw, 28px);
}
.chip {
  min-height: 40px;
  padding: 8px 15px;
  border-radius: 999px;
  border: 1.5px solid rgba(23, 19, 14, 0.2);
  background: transparent;
  color: #17130e;
  font-family: 'Archivo', sans-serif;
  font-size: 13px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.15s;
}
.chip.on {
  border-color: #c41e4f;
  background: #c41e4f;
  color: #fff;
  font-weight: 600;
}

/* --- Featured card --- */
.featured {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(18px, 3vw, 36px);
  background: #fffdf9;
  border: 1px solid rgba(23, 19, 14, 0.16);
  border-radius: 16px;
  padding: clamp(18px, 3vw, 32px);
  margin-bottom: clamp(20px, 3vw, 32px);
  color: #17130e;
  transition: border-color 0.15s;
}
.featured:hover {
  border-color: #ff2e63;
  color: #17130e;
}
.featured-copy {
  flex: 1 1 320px;
  min-width: 260px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.featured-meta {
  display: flex;
  gap: 10px;
  align-items: center;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11.5px;
  color: #6e675d;
  margin-bottom: 10px;
}
.badge-featured {
  background: rgba(255, 46, 99, 0.1);
  color: #c41e4f;
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: 500;
}
.featured-title {
  font-family: 'Instrument Serif', serif;
  font-size: clamp(26px, 3vw, 38px);
  line-height: 1.1;
  letter-spacing: -0.01em;
  margin-bottom: 10px;
  text-wrap: balance;
}
.featured-copy p {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: #6e675d;
  max-width: 56ch;
  text-wrap: pretty;
}
.featured-cta {
  margin-top: 14px;
  font-size: 13.5px;
  font-weight: 600;
  color: #c41e4f;
}

.featured-art {
  flex: 1 1 260px;
  min-width: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1ebe1;
  border-radius: 10px;
  padding: 28px 20px;
}
/* When the post has a branded card, it fills the art panel edge to edge. */
.featured-art.has-img {
  padding: 0;
  background: transparent;
  overflow: hidden;
  align-self: stretch;
}
.featured-img {
  width: 100%;
  height: 100%;
  min-height: 200px;
  object-fit: cover;
  display: block;
  border-radius: 10px;
  border: 1px solid rgba(23, 19, 14, 0.12);
}
.art-row {
  display: flex;
  gap: 14px;
  align-items: flex-end;
}
.book {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.book span {
  border-radius: 2px;
}
.book-epub {
  width: 64px;
  height: 88px;
  background: #fffdf9;
  border: 1px solid rgba(23, 19, 14, 0.2);
  border-radius: 4px;
  box-shadow: 0 6px 16px rgba(23, 19, 14, 0.1);
  padding: 12px 9px;
}
.book-pdf {
  width: 72px;
  height: 100px;
  background: #fff;
  border: 1px solid rgba(23, 19, 14, 0.25);
  border-radius: 2px;
  box-shadow: 0 8px 20px rgba(23, 19, 14, 0.12);
  padding: 14px 10px;
}
.book-mobi {
  width: 60px;
  height: 92px;
  background: #15181c;
  border-radius: 10px;
  box-shadow:
    0 0 0 4px #2a2e35,
    0 8px 20px rgba(23, 19, 14, 0.2);
  padding: 12px 9px;
}

/* --- Post grid --- */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
  gap: 14px;
}
.card {
  display: flex;
  flex-direction: column;
  background: #fffdf9;
  border: 1px solid rgba(23, 19, 14, 0.14);
  border-radius: 12px;
  padding: 20px;
  color: #17130e;
  transition:
    border-color 0.15s,
    transform 0.15s;
}
.card:hover {
  border-color: #ff2e63;
  transform: translateY(-2px);
  color: #17130e;
}
/* Thumbnail bleeds to the card edges above the padded content. */
.card-img {
  width: calc(100% + 40px);
  height: auto;
  margin: -20px -20px 14px;
  display: block;
  border-radius: 11px 11px 0 0;
  border-bottom: 1px solid rgba(23, 19, 14, 0.1);
}
.card-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  color: #6e675d;
  margin-bottom: 10px;
}
.cat {
  background: rgba(23, 19, 14, 0.07);
  padding: 2.5px 7px;
  border-radius: 4px;
}
.card-title {
  font-family: 'Instrument Serif', serif;
  font-size: 22px;
  line-height: 1.18;
  letter-spacing: -0.01em;
  margin-bottom: 8px;
  text-wrap: balance;
}
.card p {
  margin: 0 0 14px;
  font-size: 13.5px;
  line-height: 1.55;
  color: #6e675d;
  text-wrap: pretty;
}
.who {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.who-avatar {
  border-radius: 50%;
  flex: none;
  object-fit: cover;
}
.who-initial {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: #17130e;
  color: #faf7f2;
  font-size: 10px;
  font-weight: 600;
}

.card-byline {
  margin-top: auto;
  padding-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.card-byline .who-avatar {
  width: 24px;
  height: 24px;
}
.card-byline .who-initial {
  font-size: 11px;
}
.card-author {
  font-size: 12.5px;
  font-weight: 600;
  color: #17130e;
}

.card-foot {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #6e675d;
}
.read {
  font-weight: 600;
  color: #c41e4f;
}

.empty {
  font-size: 14px;
  color: #6e675d;
  margin: 24px 0 0;
}

/* --- Older posts --- */
.older-wrap {
  display: flex;
  justify-content: center;
  margin-top: clamp(24px, 3vw, 36px);
}
.older {
  min-height: 48px;
  padding: 12px 28px;
  border: 1.5px solid rgba(23, 19, 14, 0.25);
  border-radius: 999px;
  background: none;
  font-family: 'Archivo', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #17130e;
  cursor: pointer;
}
.older:hover {
  border-color: #ff2e63;
  color: #c41e4f;
}

</style>
