self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("hair-cache").then(cache =>
            cache.addAll([
                "index.html",
                "adm.html",
                "agenda.html",
                "relatorio.html",
                "style.css",
                "script.js"
            ])
        )
    );
});

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(resp => resp || fetch(e.request))
    );
});

