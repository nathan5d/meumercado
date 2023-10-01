const CACHE_NAME = "meumercado-v1";
const CACHE_TIME = 5 * 24 * 60 * 60 * 1000; // 5 dias em milissegundos

const urlsToCache = [
    "/",
    "/meumercado/",
    "/meumercado/assets/css/style.css",
    "/meumercado/vendor/bulma/css/bulma.min.css",
    "/meumercado/vendor/jquery/dist/jquery.min.js",
    "/meumercado/assets/images/Appicon.png",
    
    
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
                    // Enviar uma mensagem para a página principal
                    self.clients.matchAll().then((clients) => {
                        clients.forEach((client) => {
                            client.postMessage({ type: "offline" });
                        });
                    });

                    // Retornar uma resposta vazia
                    return new Response('', {
                        status: 503,
                        statusText: 'Serviço Indisponível',
                    });
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
