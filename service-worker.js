self.addEventListener("install", event => {
    self.skipWaiting()
})

self.addEventListener("activate", event => {
    event.waitUntil(self.clients.claim())
})

self.addEventListener("fetch", event => {

    // ΠΑΝΤΑ από network
    event.respondWith(
        fetch(event.request).catch(() => {
            return new Response("offline")
        })
    )

})