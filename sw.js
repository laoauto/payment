// ອັນນີ້ເປັນ Service Worker ແບບພື້ນຖານ - ເຮັດໃຫ້ browser ຮູ້ວ່ານີ້ແມ່ນ "ແອັບ" ແທ້ໆ
// ແລະ ຊ່ວຍໃຫ້ໄອຄອນ + ໜ້າຈໍ splash ໂຫລດໄດ້ໄວຂຶ້ນ ເມື່ອເປີດຈາກ Home Screen
const CACHE_NAME = 'my-finance-tracker-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first ສຳລັບການໂຫລດປົກກະຕິ (ຂໍ້ມູນຕ້ອງໃໝ່ສະເໝີ), fallback ໄປ cache ຖ້າອອບໄລນ໌
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
