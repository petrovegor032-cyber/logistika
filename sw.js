// ========== sw.js (простой Service Worker для fallback) ==========
// СОЗДАТЬ ЭТОТ ФАЙЛ В КОРНЕ ПРОЕКТА

self.addEventListener('install', (event) => {
    console.log('[SW] Установлен');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Активирован');
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Простой fetch handler
    event.respondWith(fetch(event.request));
});

self.addEventListener('push', (event) => {
    console.log('[SW] Push получено:', event);
    const data = event.data?.json() || {};
    const title = data.title || 'Новое уведомление';
    const options = {
        body: data.body || '',
        icon: '/favicon.ico',
        badge: '/favicon.ico'
    };
    event.waitUntil(self.registration.showNotification(title, options));
});
