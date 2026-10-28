// Service worker: offline-first app shell with stale-while-revalidate.
const CACHE = 'russkiy-v9';
const CORE = [
  './', './index.html', './manifest.webmanifest', './css/styles.css',
  './js/app.js', './js/util.js', './js/state.js', './js/srs.js', './js/audio.js',
  './js/gamify.js', './js/content.js', './js/exercises.js', './js/keyboard.js',
  './js/session.js', './js/generate.js', './js/coach.js', './js/shop.js', './js/views/shop.js', './js/views/inventory.js',
  './js/views/home.js', './js/views/learn.js', './js/views/lesson.js', './js/views/review.js',
  './js/views/alphabet.js', './js/views/homework.js', './js/views/profile.js', './js/views/settings.js',
  './data/alphabet.js', './data/units/index.js', './data/units/u0.js', './data/units/u1.js', './data/units/u2.js',
  './icons/icon.svg'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  // Network first (so updates show up immediately), cache as the offline fallback.
  e.respondWith(
    caches.open(CACHE).then(async cache => {
      try {
        const res = await fetch(e.request, { cache: 'no-cache' }); // always revalidate so updates land on the next open
        if (res.ok) cache.put(e.request, res.clone());
        return res;
      } catch {
        return (await cache.match(e.request)) || (await cache.match('./index.html'));
      }
    })
  );
});
