// api/send-notification.js
import admin from 'firebase-admin';
import fetch from 'node-fetch';

// Инициализация Firebase Admin SDK (выполнится один раз при запуске функции)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
}

export default async function handler(req, res) {
    // 1. Разрешаем только POST-запросы и устанавливаем CORS-заголовки
    res.setHeader('Access-Control-Allow-Origin', 'https://petrovegor032-cyber.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { userId, title, body } = req.body;

    if (!userId || !title || !body) {
        return res.status(400).json({ error: 'Missing required fields: userId, title, body' });
    }

    try {
        // 2. Получаем токен пользователя из Realtime Database
        const tokenSnapshot = await admin.database()
            .ref(`fcm_tokens/${userId}`)
            .once('value');
        
        const tokens = [];
        tokenSnapshot.forEach(child => {
            if (child.val()?.token) tokens.push(child.val().token);
        });

        if (tokens.length === 0) {
            return res.status(404).json({ error: 'No FCM tokens found for user' });
        }

        // 3. Отправляем уведомления через FCM
        const serverKey = process.env.FCM_SERVER_KEY;
        const notificationPromises = tokens.map(token => 
            fetch('https://fcm.googleapis.com/fcm/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `key=${serverKey}`,
                },
                body: JSON.stringify({
                    to: token,
                    notification: { title, body, icon: '/favicon.ico' },
                    webpush: { fcm_options: { link: 'https://petrovegor032-cyber.github.io/logistika/' } }
                })
            })
        );

        const results = await Promise.all(notificationPromises);
        const successCount = results.filter(r => r.ok).length;
        
        res.status(200).json({ success: true, message: `Sent to ${successCount} devices` });
    } catch (error) {
        console.error('Send error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
