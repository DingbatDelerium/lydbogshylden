// Gemmer kun appens skal. Lydfilerne gemmes af siden selv i "lydbogshylden-lyd-v1".
const CACHE = 'lydbogshylden-app-v1';
const ASSETS = ['./', './index.html', './manifest.json', './katalog.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k.startsWith('lydbogshylden-app-') && k !== CACHE).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (new URL(e.request.url).origin !== location.origin) return; // lyd fra archive.org går udenom
  e.respondWith(
    fetch(e.request).then(r => {
      const kopi = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, kopi));
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
