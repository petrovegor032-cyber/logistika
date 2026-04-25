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

messaging.onBackgroundMessage((payload) => {
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: '/favicon.ico'
    });
});
