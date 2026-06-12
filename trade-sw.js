const SW_VERSION = '2.0';
const CACHE_NAME = 'trade-v' + SW_VERSION;
const PRECACHE = ['./', './home-trade.html', './chart.umd.js', './trade-manifest.json', './trade-icon-192.png', './trade-icon-512.png'];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE_NAME).then(function(c) { return c.addAll(PRECACHE); }));
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(names) {
    return Promise.all(names.filter(function(n) { return n !== CACHE_NAME; }).map(function(n) { return caches.delete(n); }));
  }));
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  if (e.request.url.includes('yahoo') || e.request.url.includes('corsproxy')) {
    e.respondWith(fetch(e.request).catch(function() { return new Response('{}', {headers: {'Content-Type': 'application/json'}}); }));
    return;
  }
  e.respondWith(caches.match(e.request).then(function(r) { return r || fetch(e.request); }));
});
