const IMAGE_FILES = [
  "calendar1.webp",
  "calendar2.webp",
  "calendar3.webp",
  "calendar4.webp",
  "common1.webp",
  "common2.webp",
  "common3_1.webp",
  "common3_2.webp",
  "common4.webp",
  "common5.webp",
  "empty.webp",
  "exercise1.webp",
  "exercise2.webp",
  "exercise3.webp",
  "exercise3_1.webp",
  "exercise3_2.webp",
  "exercise3_3.webp",
  "exercise4.webp",
  "exercise5.webp",
  "exercise6.webp",
  "flag1.webp",
  "flag2.webp",
  "food1.webp",
  "food2.webp",
  "food3.webp",
  "food4.webp",
  "food5.webp",
  "food6.webp",
  "logo1.webp",
  "logo2.webp",
  "logo3.webp",
  "money1.webp",
  "money2.webp",
  "money3.webp",
  "money4.webp",
  "setting3.webp",
  "setting4.webp",
  "sleep1.webp",
  "sleep2.webp",
  "sleep3.webp",
  "sleep4.webp",
  "smile1.webp",
  "smile2.webp",
  "smile3.webp",
  "smile4.webp",
  "smile5.webp",
  "today1.webp",
  "user1.webp"
];

// 이미지 URL 리스트 생성
const IMAGE_URLS = IMAGE_FILES.map((file) => (
  `https://storage.googleapis.com/jungho-bucket/LIFECHANGE/IMAGE/main/${file}`
));
const IMAGE_FILE_SET = new Set(IMAGE_FILES);
const CACHE_NAME = `LIFECHANGE_IMAGE_CACHE_V1`;

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        IMAGE_URLS.map((url) => {
          return fetch(url, { cache: 'no-store' })
            .then(res => {
              if (res && res.status === 200) {
                return cache.put(url, res);
              }
            })
            .catch(err => {
              console.error('Failed to cache image:', url, err);
            });
        })
      );
    })
  );
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
    .then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if(cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      return self.clients.claim();
    })
  );
});
self.addEventListener('fetch', (event) => {
  try {
    const urlObj = new URL(event.request.url);
    const filename = urlObj.pathname.split('/').pop();
    if (IMAGE_FILE_SET.has(filename)) {
      event.respondWith(
        caches.match(event.request).then((res) => {
          if (res) {
            return res;
          }
          return fetch(event.request, { cache: 'no-store' }).then((response) => {
            if(response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          })
        })
      );
    }
  }
  catch (error) {
    console.error('Service Worker fetch error:', error);
  }
});