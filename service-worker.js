const CACHE_NAME = "myth-universe-v110";

const ASSETS = [

  "./",
  "./index.html",
  "./manifest.json",

  "./app-data.json",

  "./icon-192.png",
  "./icon-512.png",

  "./group.png",
  "./energy.png",
  "./god_male.png",
  "./god_female.png",
  "./hero_male.png",
  "./hero_female.png",
  "./monster_male.png",
  "./monster_female.png",
  "./titan_male.png",
  "./titan_female.png",
  "./spirit.png",
  "./cosmic.png",
  "./default.png"

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

  // ΜΗΝ cache json

  if (event.request.url.includes("app-data.json")) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(

    caches.match(event.request)
    .then(cached => cached || fetch(event.request))

  );

});