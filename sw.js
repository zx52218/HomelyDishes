/* ============================================================
 *  暖屋食光 · Service Worker
 *  策略：安装时预缓存核心文件；运行时缓存优先 + 网络回退；
 *  导航请求先网络后回退缓存，保证首页永远可打开；
 *  更新版本只需改下方 CACHE 版本号。
 * ============================================================ */
const CACHE = 'warmhouse-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-180.png'
];

/* ---------- 安装：预缓存核心资源 ---------- */
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

/* ---------- 激活：清理旧版本缓存 ---------- */
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* ---------- 请求拦截 ---------- */
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // 仅处理同源请求，跨域(如图标 CDN)放行
  if (new URL(req.url).origin !== location.origin) return;

  // 页面导航：网络优先，失败回退缓存首页
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put('./index.html', copy));
        return res;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // 静态资源：缓存优先，未命中则网络并写入缓存
  e.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res && (res.status === 200 || res.type === 'basic')) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});