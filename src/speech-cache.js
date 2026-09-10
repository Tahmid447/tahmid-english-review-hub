// Small, device-local audio cache. It contains no progress or profile data.
// Each account has its own keys, and eviction caps ALL accounts together.
const DB_NAME = "te-review-speech-v1";
const MAX_BYTES = 8 * 1024 * 1024;
const MAX_ENTRIES = 160;
const MAX_AGE = 7 * 86400000;
let dbPromise;
const database = () => {
  if (typeof indexedDB === "undefined") return Promise.resolve(null);
  return dbPromise ||= new Promise((resolve) => {
    const open = indexedDB.open(DB_NAME, 1);
    open.onupgradeneeded = () => open.result.createObjectStore("clips", { keyPath: "key" });
    open.onsuccess = () => resolve(open.result);
    open.onerror = open.onblocked = () => resolve(null);
  });
};
const digest = async (key) => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(key)))].map(x => x.toString(16).padStart(2, "0")).join("");
export async function readSpeechClip(key) {
  try {
    const db = await database(); if (!db) return null;
    const id = await digest(key);
    return await new Promise((resolve) => {
      const request = db.transaction("clips").objectStore("clips").get(id);
      request.onsuccess = () => resolve(request.result?.created > Date.now() - MAX_AGE ? request.result.blob : null);
      request.onerror = () => resolve(null);
    });
  } catch { return null; }
}
let writeQueue = Promise.resolve();
export function saveSpeechClip(key, blob) {
  writeQueue = writeQueue.catch(() => {}).then(async () => {
    if (!blob || blob.size > MAX_BYTES / 4) return;
    const db = await database(); if (!db) return;
    const id = await digest(key);
    await new Promise((resolve, reject) => {
      const tx = db.transaction("clips", "readwrite"); const store = tx.objectStore("clips");
      store.put({ key: id, blob, created: Date.now(), bytes: blob.size });
      const all = store.getAll();
      all.onsuccess = () => {
        let bytes = 0, count = 0;
        all.result.sort((a,b) => b.created - a.created).forEach(row => {
          bytes += row.bytes; count += 1;
          if (row.created < Date.now() - MAX_AGE || bytes > MAX_BYTES || count > MAX_ENTRIES) store.delete(row.key);
        });
      };
      tx.oncomplete = resolve; tx.onerror = () => reject(tx.error);
    });
  }).catch(() => {});
  return writeQueue;
}
