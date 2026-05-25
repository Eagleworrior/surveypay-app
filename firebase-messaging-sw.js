// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCJxSae246Rh-8xc7loxOULiOHfSJjJDIU",
  projectId: "omnisuite-4f4f7",
  messagingSenderId: "53135596216",
  appId: "1:53135596216:web:45b90079f9b50a17e8724d"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const title = payload.notification?.title || 'Notification';
  const options = {
    body: payload.notification?.body || '',
    data: payload.data || {}
  };
  self.registration.showNotification(title, options);
});
