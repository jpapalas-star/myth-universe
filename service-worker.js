const CACHE_NAME = "myth-universe-v9";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];


self.addEventListener("install", event => {

  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => cache.addAll(ASSETS))
  );

  self.skipWaiting();

});


self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(keys =>
      Promise.all(
        keys.map(k =>
          k !== CACHE_NAME
            ? caches.delete(k)
            : null
        )
      )
    )

  );

  self.clients.claim();

});


self.addEventListener("fetch", event => {

  // ❗ μην κάνεις cache το json

  if (event.request.url.includes("app-data.json")) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(

    caches.match(event.request)
    .then(cached => cached || fetch(event.request))

  );

});
