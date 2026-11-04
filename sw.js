/* Offline support: every app file is cached on install and served from the cache.
   Bump VERSION on each deploy so phones pick up the new files. */
const VERSION='gym-0.3.6';
const SHELL=['./','index.html','manifest.webmanifest','icons/icon-180.png','icons/icon-192.png','icons/icon-512.png','vendor/zxing/zxing-reader.js','vendor/zxing/zxing_reader.wasm'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL.map(u=>new Request(u,{cache:'reload'}))).then(()=>c.add(new Request('sw.js',{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;
 const u=new URL(r.url);if(u.origin!==location.origin)return; /* GitHub and Open Food Facts go straight to the network */
 if(r.mode==='navigate'){e.respondWith(caches.match('index.html',{ignoreSearch:true}).then(m=>m||fetch(r)));return}
 e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp))}return res})));
});
