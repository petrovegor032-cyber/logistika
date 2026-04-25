// ========== firebase-messaging-sw.js ==========
// ПОЛНОСТЬЮ ЗАМЕНИТЬ ФАЙЛ

importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Конфигурация Firebase (скопирована из index.html)
firebase.initializeApp({
    apiKey: "AIzaSyCCIY9lL15FpypsI310HCuTxQSwkpCpuiE",
    authDomain: "audiozvonok-b340d.firebaseapp.com",
    databaseURL: "https://audiozvonok-b340d-default-rtdb.firebaseio.com",
    projectId: "audiozvonok-b340d",
    storageBucket: "audiozvonok-b340d.firebasestorage.app",
    messagingSenderId: "172196854367",
    appId: "1:172196854367:web:116450d75c8377cae139ea"
});

const messaging = firebase.messaging();

// Обработка фоновых сообщений
messaging.onBackgroundMessage((payload) => {
    console.log('[SW] Фоновое сообщение:', payload);
    
    const notificationTitle = payload.notification?.title || 'Новое сообщение';
    const notificationOptions = {
        body: payload.notification?.body || 'У вас новое сообщение',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        data: payload.data,
        requireInteraction: true,
        vibrate: [200, 100, 200],
        silent: false
    };
    
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Клик по уведомлению:', event);
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                if (clientList.length > 0) {
                    return clientList[0].focus();
                }
                return clients.openWindow('/');
            })
    );
});

// Service Worker установка и активация
self.addEventListener('install', (event) => {
    console.log('[SW] Установлен');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Активирован');
    event.waitUntil(clients.claim());
});
