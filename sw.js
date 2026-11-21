/* ===========================================================
   영광 커넥트 (Glory Connect) — 서비스워커
   Copyright (c) 2026 songtanglorychurch. All rights reserved.
   개발 : visionspeaker

   ※ 이 파일은 일부러 아무것도 저장(캐시)하지 않습니다.
      저장해 두면 앱을 고쳐도 예전 화면이 계속 보이는 사고가 납니다.
      그래서 들어온 요청을 그대로 인터넷으로 넘기기만 합니다.
      (인터넷이 끊기면 지금과 똑같이 안 열립니다 — 달라지는 것이 없습니다)

      이 파일이 있어야 안드로이드에서 「홈 화면에 추가」 설치창을
      띄울 수 있어서 만들어 둔 것입니다. 그 외의 일은 하지 않습니다.
   =========================================================== */

self.addEventListener('install', function () {
  self.skipWaiting();                 /* 새 것이 나오면 바로 바꿔 낀다 */
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (ks) {         /* 혹시 예전에 남은 저장분이 있으면 지운다 */
      return Promise.all(ks.map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;      /* 보내기(POST)는 손대지 않는다 */
  /* (2026-11-21) 앱 화면(index.html) 자체는 매번 «새 것인지» 물어보고 받는다.
     GitHub 가 화면 파일을 10분씩 저장해 두게 해서, 고친 직후에 예전 화면이 열리던 것을 막는다.
     바뀐 게 없으면 「그대로」라는 짧은 답만 오므로 느려지지 않는다.
     문제가 생기면(주소 넘김·오류) 예전 방식 그대로 받는다 — 앱이 안 열리는 일은 없다. */
  if (e.request.mode === 'navigate' && new URL(e.request.url).origin === self.location.origin) {
    e.respondWith(
      fetch(e.request.url, { cache: 'no-cache', credentials: 'same-origin' })
        .then(function (r) { return (r.ok && !r.redirected) ? r : fetch(e.request); })
        .catch(function () { return fetch(e.request); })
    );
    return;
  }
  e.respondWith(fetch(e.request));             /* 저장 없이 그대로 통과 */
});
