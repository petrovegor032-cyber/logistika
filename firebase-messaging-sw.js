// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

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

// Паттерны вибрации
const VIBRATION_PATTERNS = {
    default: [200, 100, 200],           // обычное уведомление
    call: [500, 200, 500, 200, 1000],   // входящий звонок
    urgent: [300, 100, 300, 100, 300]   // срочное
};

messaging.onBackgroundMessage((payload) => {
    console.log('[SW] Фоновое сообщение:', payload);
    
    // Определяем тип уведомления
    let pattern = VIBRATION_PATTERNS.default;
    if (payload.data?.type === 'call') {
        pattern = VIBRATION_PATTERNS.call;
    } else if (payload.data?.type === 'urgent') {
        pattern = VIBRATION_PATTERNS.urgent;
    }
    
    const title = payload.notification?.title || 'Новое сообщение';
    const options = {
        body: payload.notification?.body || 'У вас новое сообщение',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        vibrate: pattern,                    // 👈 вибрация
        sound: '/sounds/notification.mp3',   // звук (если есть файл)
        requireInteraction: true,            // не исчезает само
        silent: false,
        data: payload.data
    };
    
    self.registration.showNotification(title, options);
});

// Клик по уведомлению
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    // Дополнительная вибрация при клике
    event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
            if (clientList.length > 0) {
                return clientList[0].focus();
            }
            return clients.openWindow('/');
        })
    );
});
