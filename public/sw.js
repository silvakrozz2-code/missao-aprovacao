// Rede primeiro (sempre a versão nova quando há internet); cópia em cache para abrir offline.
const C = "missao-react-v2";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== C).map((x) => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || (u.origin !== location.origin && !u.hostname.includes("fonts.g")) || u.pathname.startsWith("/entrar") || u.pathname.startsWith("/api/")) return;
  e.respondWith(fetch(e.request).then((r) => { if (!r.ok || r.redirected || r.type === "opaqueredirect") return r; const cp = r.clone(); caches.open(C).then((c) => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request).then((r) => r || caches.match("/"))));
});
