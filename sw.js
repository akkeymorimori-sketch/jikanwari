// がくログ：オフラインでも開けるようにする
const CACHE = 'gakulog-v1';

self.addEventListener('install', () => self.skipWaiting());
const retiredCatalog = url => /\/data\/(?:aue|isct|tsukuba|nitech|uec|utokyo|hiroshima|kyoto|kyushu|yamanashi|nagasaki|niigata)-\d{4}\.(?:json|js)$/.test(new URL(url).pathname);
self.addEventListener('activate', e => e.waitUntil((async () => {
  for (const name of await caches.keys()) {
    // 他のアプリ・個人の時間割や写真の保存には触れない。
    if (!name.startsWith('gakulog-')) continue;
    const cache = await caches.open(name);
    for (const request of await cache.keys()) if (retiredCatalog(request.url)) await cache.delete(request);
  }
  await self.clients.claim();
})()));

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (req.headers.has('range')) return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // AIやPDF読み込みなど外の通信は触らない
  // 古い画面からも停止済みデータを再取得・キャッシュ復元させない。
  if (retiredCatalog(req.url)) { e.respondWith(Promise.resolve(new Response('', { status: 410 }))); return; }

  e.respondWith((async () => {
    // まずネットから最新を取る。取れたら保存しとく
    const net = fetch(req).then(res => {
      if (res.status === 200) {
        const copy = res.clone();
        e.waitUntil(caches.open(CACHE).then(async c => {
          // 「app.js?v=150」みたいに ?v= だけ違う古い版は消す（更新のたびに溜まらないように）
          if (url.search) for (const k of await c.keys()) {
            const u = new URL(k.url);
            if (u.pathname === url.pathname && u.search !== url.search) await c.delete(k);
          }
          await c.put(req, copy);
        }));
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
