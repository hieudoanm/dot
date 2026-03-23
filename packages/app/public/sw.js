self.addEventListener('install', (event) => {
  console.info('event', event);
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.info('event', event);
  self.clients.claim();
});

self.addEventListener('fetch', () => {
  // Basic pass-through
});
