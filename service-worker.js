const CACHE_NAME = "hair-evolution-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./adm.html",
  "./agenda.html",
  "./relatorio.html",
  "./style.css",
  "./script.js",
  "./adm.js",
  "./agenda.js",
  "./supabase.js",
  "./logo.png",
  "./manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
