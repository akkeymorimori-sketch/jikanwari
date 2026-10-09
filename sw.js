// がくログ：オフラインでも開けるようにする
const CACHE = 'gakulog-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (req.headers.has('range')) return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // AIやPDF読み込みなど外の通信は触らない

  e.respondWith((async () => {
    // まずネットから最新を取る。取れたら保存しとく
    const net = fetch(req).then(res => {
      if (res.status === 200) {
        const copy = res.clone();
        e.waitUntil(caches.open(CACHE).then(c => c.put(req, copy)));
      }
      return res;
    });
    try {
      // 4秒で来なければ保存版を使う
      return await Promise.race([
        net,
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 4000))
      ]);
    } catch {
      const hit = await caches.match(req) ||
        (req.mode === 'navigate' ? await caches.match('./') : null);
      return hit || net.catch(() => Response.error());
    }
  })());
});
