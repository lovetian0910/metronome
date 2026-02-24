const CACHE_VERSION = 'v1';
const CACHE_NAME = 'metronome-' + CACHE_VERSION;

// Local assets to precache during install
const PRECACHE_URLS = [
  './',
  'index.html',
  'gif.html',
  'spine.html',
  'scheduler-worker.js',
  'gifuct-js.esm.js',
  'spine-webgl.js',
  'zhoushen_compressed.glb',
  'ezgif-589a1d8d6982a35b.gif',
  'panda/panda.json',
  'panda/panda.atlas',
  'panda/panda.png'
];

// Install: precache local assets
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(PRECACHE_URLS);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// Activate: clean up old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) {
          return key.startsWith('metronome-') && key !== CACHE_NAME;
        }).map(function(key) {
          return caches.delete(key);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Fetch: cache first, network fallback; cache CDN responses on the fly
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;

      return fetch(event.request).then(function(response) {
        // Only cache successful GET requests
        if (!response || response.status !== 200 || event.request.method !== 'GET') {
          return response;
        }

        // Cache CDN resources (Three.js, DRACO decoder) on the fly
        var url = event.request.url;
        if (url.indexOf('cdn.jsdelivr.net') !== -1 || url.indexOf('gstatic.com/draco') !== -1) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clone);
          });
        }

        return response;
      });
    })
  );
});
