const CACHE_NAME = "meumercado-v2";
const CACHE_TIME = 5 * 24 * 60 * 60 * 1000; // 5 dias em milissegundos

const urlsToCache = [
    "/meumercado/",
    "/meumercado/index.html",
    "/meumercado/vendor/bulma/css/bulma.min.css",
    "/meumercado/vendor/jquery/dist/jquery.min.js",

    "/meumercado/assets/style.css",
    "/meumercado/assets/images/AppIcon.png",
    // Adicione outros recursos que deseja cachear aqui
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response;
            }

            return fetch(event.request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const cacheCopy = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, cacheCopy);
                            });
                    }
                    return networkResponse;
                })
                .catch(() => {
                    // Aqui, você pode retornar um fallback do cache ou uma mensagem de erro
                    return caches.match('fallback.html'); // Você precisa ter um arquivo fallback.html no cache
                });
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => {
                        return (
                            cacheName.startsWith("intervalo-flex-cache-") &&
                            cacheName !== CACHE_NAME
                        );
                    })
                    .map((cacheName) => {
                        return caches.delete(cacheName);
                    })
            );
        })
    );
});
