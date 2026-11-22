// 푸시 알림 받기 (서비스 워커). 앱이 꺼져 있을 때 온 푸시를 폰 알림으로 띄우고, 누르면 그 모임을 열어요.
// 내 정보 > '푸시 알림 받기'를 켤 때 등록돼요. 보내는 쪽은 functions/index.js (새 모임 · 참석 · 불참만).

// 앱이 열려 있을 때 띄운 알림(data.link)을 누르면 그 주소로 (파이어베이스가 띄운 알림은 아래 SDK가 처리)
self.addEventListener("notificationclick", e => {
  const d = (e.notification && e.notification.data) || {};
  if (d.FCM_MSG || !d.link) return;
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    const w = list.find(c => c.url.split("#")[0] === d.link.split("#")[0]);
    if (w) return w.navigate(d.link).then(c => (c || w).focus()).catch(() => w.focus());
    return clients.openWindow(d.link);
  }));
});

self.window = self;   // firebase-config.js가 window.FIREBASE_CONFIG에 써요
importScripts(
  "https://cdnjs.cloudflare.com/ajax/libs/firebase/10.12.2/firebase-app-compat.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/firebase/10.12.2/firebase-messaging-compat.min.js",
  "firebase-config.js"
);
firebase.initializeApp(self.FIREBASE_CONFIG);
firebase.messaging();   // notification이 담긴 푸시는 SDK가 알아서 띄우고, 누르면 fcmOptions.link를 열어요

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
