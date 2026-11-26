/* Service worker: cache-first, chạy offline hoàn toàn. VER viết dạng VER='x.y.z' (dấu nháy ĐƠN) để index.html đọc được. */
const VER='1.1.0',APP='be-to-mau',C=APP+'-'+VER,
A=['./','./index.html'],                       // bắt buộc có, thiếu là install thất bại
X=['./manifest.webmanifest','./bm-icon-180.png','./bm-icon-192.png','./bm-icon-512.png','./bm-icon-maskable-512.png']; // thiếu cũng không sao
const rq=u=>new Request(u,{cache:'reload'});   // bỏ qua HTTP cache khi precache
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(async c=>{await c.addAll(A.map(rq));await Promise.allSettled(X.map(u=>c.add(rq(u))))})));
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||r.cache==='no-store'||new URL(r.url).origin!==location.origin)return;
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(x=>x||fetch(r).then(res=>{if(res.status===200){const k=res.clone();e.waitUntil(caches.open(C).then(c=>c.put(r,k)))}return res})
    .catch(()=>r.mode==='navigate'?caches.match('./index.html'):Response.error())))});
