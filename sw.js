const CACHE_NAME = "te-review-public-v4";
const OFFLINE_PAGE = "/offline.html";
const PUBLIC_SHELL = new Set([
  "/",
  "/index.html",
  "/phrases.html",
  "/pricing.html",
  OFFLINE_PAGE,
  "/manifest.webmanifest",
  "/src/styles.css",
  "/src/hub.js",
  "/src/phrases.js",
  "/src/pwa.js",
  "/src/store.js",
  "/src/data.js",
  "/src/audio.js",
  "/src/config.js",
  "/src/effects.js",
  "/src/i18n.js",
  "/src/plans.js",
  "/src/pricing.js",
  "/src/supabase.js",
  "/src/data/legacy-lessons.json",
  "/src/data/legacy-additions.json",
  "/assets/app-icon-192.png"
]);
const OFFLINE_NAVIGATION = new Set(["/", "/index.html", "/phrases", "/phrases.html", "/plans", "/pricing.html"]);

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll([...PUBLIC_SHELL])));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key.startsWith("te-review-public-") && key !== CACHE_NAME)
        .map((key) => caches.delete(key)),
    )),
    self.clients.claim(),
  ]));
});

const isPublicStaticRequest = (request, url) => {
  if (request.method !== "GET" || url.origin !== self.location.origin) return false;
  if (request.headers.has("authorization") || request.cache === "no-store") return false;
  return PUBLIC_SHELL.has(url.pathname);
};

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(async () => {
      if (OFFLINE_NAVIGATION.has(url.pathname)) {
        const shell = url.pathname === "/phrases" ? "/phrases.html"
          : url.pathname === "/plans" ? "/pricing.html"
            : url.pathname;
        const cached = await caches.match(shell);
        if (cached) return cached;
      }
      return caches.match(OFFLINE_PAGE);
    }));
    return;
  }

  if (!isPublicStaticRequest(request, url)) return;
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok && response.type === "basic") {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
    }
    return response;
  })));
});
