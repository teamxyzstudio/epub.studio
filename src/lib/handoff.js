/**
 * Carries a converted EPUB from a tool page to Style Studio.
 *
 * The site is a static MPA, so the two pages are separate documents and cannot
 * share a Blob in memory. sessionStorage is out — it is string-only and caps at
 * a few megabytes, while books routinely exceed that. IndexedDB stores the Blob
 * natively at whatever size the browser allows, and nothing leaves the device.
 */

const DB_NAME = 'epub-studio';
const STORE = 'handoff';
const VERSION = 1;

/** Entries older than this are cleaned up on the next write. */
const TTL_MS = 60 * 60 * 1000;

function open() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx(db, mode, fn) {
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const store = t.objectStore(STORE);
    const req = fn(store);
    t.oncomplete = () => resolve(req && req.result);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  });
}

/**
 * Stash a book for Style Studio to pick up.
 * @returns {Promise<string>} the handoff id to pass as ?book=
 */
export async function putBook({ blob, filename, sourceName, title, author, language }) {
  const db = await open();
  const id = `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

  // Opportunistic cleanup so abandoned handoffs don't accumulate.
  await tx(db, 'readwrite', (store) => {
    const cursorReq = store.openCursor();
    cursorReq.onsuccess = () => {
      const cursor = cursorReq.result;
      if (!cursor) return;
      if (Date.now() - (cursor.value.createdAt || 0) > TTL_MS) cursor.delete();
      cursor.continue();
    };
    return cursorReq;
  }).catch(() => {});

  await tx(db, 'readwrite', (store) =>
    store.put({ id, blob, filename, sourceName, title, author, language, createdAt: Date.now() }),
  );
  db.close();
  return id;
}

export async function getBook(id) {
  if (!id) return null;
  try {
    const db = await open();
    const rec = await tx(db, 'readonly', (store) => store.get(id));
    db.close();
    return rec || null;
  } catch {
    return null;
  }
}

export async function deleteBook(id) {
  if (!id) return;
  try {
    const db = await open();
    await tx(db, 'readwrite', (store) => store.delete(id));
    db.close();
  } catch {
    /* nothing to clean up */
  }
}
