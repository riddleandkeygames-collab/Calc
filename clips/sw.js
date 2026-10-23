const CACHE = 'clips-v21';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'cloth.mp4', 'cloth.jpg', 'towel.mp4', 'towel.jpg', 'board.mp4', 'board.jpg', 'card-7h.png', 'station.mp4', 'station.jpg', 'station-track.json', 'cardm.mp4', 'cardm.jpg', 'cardm-track.json', 'cardf.mp4', 'cardf.jpg', 'cardf-track.json', 'shelf.mp4', 'shelf.jpg'].concat(['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces', 'circle', 'cross', 'waves', 'square', 'star'].map(n => 'sym/' + n + '.png')).concat(['rose', 'carrot', 'chair', 'eiffel', 'dog', 'hammer', 'apple', 'cat', 'house', 'boat', 'fish', 'car', 'tree', 'smiley', 'scribble', 'rocket', 'alien', 'ufo', 'rabbit', 'stickman', 'glass', 'bottle', 'ball', 'umbrella'].map(n => 'doodle/' + n + '.png')).concat(Array.from({ length: 53 }, (_, i) => 'faces/' + String(i + 1).padStart(2, '0') + '.jpg'));
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('clips-') && k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Ask the internet first so updates arrive; use the saved copy offline (videos and the marker font included).
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request, { cache: 'no-store' }).then(r => {
    const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
  }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
