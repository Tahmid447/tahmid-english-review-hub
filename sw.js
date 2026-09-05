const CACHE_NAME = "te-review-public-v23";
const OFFLINE_PAGE = "/offline.html";
const PUBLIC_SHELL = new Set([
  "/",
  "/index.html",
  "/phrases.html",
  "/learn.html",
  "/pricing.html",
  "/music-credits.html",
  OFFLINE_PAGE,
  "/manifest.webmanifest",
  "/src/styles.css",
  "/src/hub.js",
  "/src/phrases.js",
  "/src/learn.js",
  "/src/learn.css",
  "/src/curriculum-visuals.js",
  "/src/curriculum-visuals.css",
  "/src/curriculum-api.js",
  "/src/student-visibility.js",
  "/src/student-shell.js",
  "/src/pwa.js",
  "/src/store.js",
  "/src/study-music.js",
  "/src/data.js",
  "/src/lesson-source.js",
  "/src/lesson-guide-targets.js",
  "/src/audio.js",
  "/src/speech-contract.js",
  "/src/curriculum-audio.js",
  "/src/curriculum-access.js",
  "/src/phonics-visuals.js",
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
const OFFLINE_NAVIGATION = new Set(["/", "/index.html", "/phrases", "/phrases.html", "/learn", "/learn.html", "/words", "/phonics", "/plans", "/pricing.html", "/music-credits", "/music-credits.html"]);

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
          : ["/learn", "/words", "/phonics"].includes(url.pathname) ? "/learn.html"
          : url.pathname === "/plans" ? "/pricing.html"
            : url.pathname === "/music-credits" ? "/music-credits.html"
            : url.pathname;
        const cached = await caches.match(shell);
        if (cached) return cached;
      }
      return caches.match(OFFLINE_PAGE);
    }));
    return;
  }

  if (!isPublicStaticRequest(request, url)) return;
  event.respondWith(fetch(request).then((response) => {
    if (response.ok && response.type === "basic") {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
    }
    return response;
  }).catch(() => caches.match(request, { ignoreSearch: true })));
});
