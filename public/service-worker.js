var staticCachName = 'Map-v1'
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCachName).then(function (cache) {
      return cache.addAll(
        [
         '/',
         'src/MapContainer.js',
         'src/search.css',
         'src/index.js',
         'src/Search.js',
         'src/App.js',
         'src/App.css',
       ]
     );
    })
  );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
          return response || fetch(event.request).then(function(response) {
            return caches.open(staticCachName).then(function(cache) {
              cache.put(event.request, response.clone());
              return response;
            });
        })
      }));
});
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cachName) {
          return cachName.startsWith('Map-v1') && cachName !== staticCachName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
})
