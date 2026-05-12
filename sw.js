// Service Worker — HorasExtra CMRM
const CACHE_NAME = 'horasextra-v1.2.6';
const STATIC_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './css/registo.css',
  './js/calculator.js',
  './js/history.js',
  './js/irs-tables.js',
  './js/registo.js',
  './js/storage.js',
  './js/ui.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://cdn.jsdelivr.net/npm/beercss@4.0.21/dist/cdn/beer.min.css',
  'https://cdn.jsdelivr.net/npm/beercss@4.0.21/dist/cdn/beer.min.js',
  'https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600;700;800&display=swap',
  'https://fonts.googleapis.com/icon?family=Material+Icons'
];

// ── Install: cache static assets ──────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        STATIC_ASSETS.map(url =>
          cache.add(url).catch(err => console.warn('Cache miss:', url, err))
        )
      );
    }).then(() => self.skipWaiting()) // take over immediately
  );
});

// ── Activate: clean old caches, notify clients ────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
      .then(() => {
        // Notify all open tabs that a new version is now active
        return self.clients.matchAll({ type: 'window' }).then(clients => {
          clients.forEach(client => client.postMessage({ type: 'SW_UPDATED' }));
        });
      })
  );
});

// ── Message: allow client to trigger skipWaiting ──
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ── Fetch: cache-first for static, network-first for API ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (event.request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // Network-first for Firebase/Firestore (future cloud sync)
  if (url.hostname.includes('firestore.googleapis.com') ||
      url.hostname.includes('firebase.googleapis.com')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for everything else (offline-first)
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        if (response && response.status === 200 && response.type !== 'opaque') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// ── Background sync placeholder ────────────────────
self.addEventListener('sync', event => {
  if (event.tag === 'sync-calculations') {
    event.waitUntil(syncToCloud());
  }
});

async function syncToCloud() {
  console.log('Background sync triggered — Firestore sync pending implementation');
}
