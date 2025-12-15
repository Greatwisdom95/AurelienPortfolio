// Service Worker for Aurelien Portfolio
const CACHE_NAME = 'aurelien-portfolio-v2';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';
const PRECACHE_CACHE = 'precache-v2';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE && key !== PRECACHE_CACHE)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Allow the app to ask the SW to precache assets (videos/images/docs) in the background.
// This is intentionally best-effort (large video files may fail on some devices/networks).
self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || data.type !== 'PRECACHE_URLS' || !Array.isArray(data.urls)) return;

  event.waitUntil(
    caches.open(PRECACHE_CACHE).then(async (cache) => {
      // Cache sequentially to reduce network spikes.
      for (const url of data.urls) {
        try {
          const req = new Request(url, { cache: 'reload' });
          const existing = await cache.match(req);
          if (existing) continue;
          const res = await fetch(req);
          // Avoid caching partial responses.
          if (res && res.ok && res.status === 200) {
            await cache.put(req, res.clone());
          }
        } catch (_) {
          // Best-effort: ignore failures.
        }
      }
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests except fonts
  if (url.origin !== location.origin && !url.hostname.includes('fonts')) {
    return;
  }

  // Videos: Cache-first strategy with range request support
  if (request.url.includes('/assets/videos/')) {
    // Range requests are commonly used by <video> for seeking/streaming.
    // Caching them without special handling can break playback, so bypass cache.
    if (request.headers.has('range')) {
      event.respondWith(fetch(request));
      return;
    }
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        try {
          const networkResponse = await fetch(request);
          // Only cache full responses (avoid caching partial 206 responses).
          if (networkResponse.ok && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          return new Response('Video unavailable', { status: 503 });
        }
      })
    );
    return;
  }

  // Images: Cache-first
  if (request.url.includes('/assets/Images/') || request.destination === 'image') {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        try {
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          return new Response('Image unavailable', { status: 503 });
        }
      })
    );
    return;
  }

  // Fonts: Cache-first with long expiry
  if (request.url.includes('fonts.googleapis.com') || request.url.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        cache.put(request, networkResponse.clone());
        return networkResponse;
      })
    );
    return;
  }

  // JS/CSS: Stale-while-revalidate
  if (request.url.includes('/assets/') && (request.url.endsWith('.js') || request.url.endsWith('.css'))) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Default: Network-first
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && request.url.startsWith(location.origin)) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
