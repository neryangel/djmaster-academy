/**
 * Service Worker for DJMaster Academy
 * Handles offline functionality, caching strategies, and background sync
 */

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `djmaster-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `djmaster-dynamic-${CACHE_VERSION}`;
const API_CACHE = `djmaster-api-${CACHE_VERSION}`;

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/styles.css',
];

// Asset file extensions for cache-first strategy
const STATIC_EXTENSIONS = [
  '.js',
  '.css',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.svg',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.ico',
];

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Failed to cache some assets:', err);
        return cache.addAll(['/offline.html']);
      });
    })
  );
  self.skipWaiting();
});

/**
 * Activate event - cleanup old caches
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          const isOldVersion =
            (cacheName.startsWith('djmaster-') && !cacheName.includes(CACHE_VERSION)) ||
            (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== API_CACHE);

          if (isOldVersion) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

/**
 * Helper: Check if URL is a static asset
 */
function isStaticAsset(url) {
  try {
    const urlObj = new URL(url);
    return STATIC_EXTENSIONS.some((ext) => urlObj.pathname.endsWith(ext));
  } catch {
    return false;
  }
}

/**
 * Helper: Check if URL is an API call
 */
function isApiCall(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.startsWith('/api/');
  } catch {
    return false;
  }
}

/**
 * Cache-first strategy for static assets
 */
function cacheFirstStrategy(request) {
  return caches.match(request).then((response) => {
    if (response) {
      return response;
    }

    return fetch(request).then((response) => {
      if (!response || response.status !== 200 || response.type === 'error') {
        return response;
      }

      const responseToCache = response.clone();
      caches.open(DYNAMIC_CACHE).then((cache) => {
        cache.put(request, responseToCache);
      });

      return response;
    });
  });
}

/**
 * Network-first strategy for API calls and HTML
 */
function networkFirstStrategy(request) {
  return fetch(request)
    .then((response) => {
      if (!response || response.status !== 200) {
        return response;
      }

      const responseToCache = response.clone();
      caches.open(isApiCall(request.url) ? API_CACHE : DYNAMIC_CACHE).then((cache) => {
        cache.put(request, responseToCache);
      });

      return response;
    })
    .catch(() => {
      // Return cached version or offline page
      return caches.match(request).then((response) => {
        return response || caches.match('/offline.html');
      });
    });
}

/**
 * Fetch event - route requests to appropriate strategy
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = request.url;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API calls: network-first
  if (isApiCall(url)) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Static assets: cache-first
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // HTML pages: network-first
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Default: network-first
  event.respondWith(networkFirstStrategy(request));
});

/**
 * Handle messages from clients
 */
self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith('djmaster-')) {
            return caches.delete(cacheName);
          }
        })
      );
    });
  }
});

/**
 * Periodic background sync (if supported)
 */
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'sync-progress') {
      event.waitUntil(syncUserProgress());
    }
  });
}

/**
 * Helper: Sync user progress with server
 */
async function syncUserProgress() {
  try {
    // In a real app, would sync progress data from IndexedDB to server
    console.log('Syncing user progress...');
  } catch (error) {
    console.error('Failed to sync progress:', error);
  }
}
