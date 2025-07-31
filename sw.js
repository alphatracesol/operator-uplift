// Enhanced Service Worker for Operator Uplift
// Version: 2.0 - Production Ready

const CACHE_NAME = 'operator-uplift-v2.0';
const STATIC_CACHE = 'static-v2.0';
const DYNAMIC_CACHE = 'dynamic-v2.0';
const API_CACHE = 'api-v2.0';

// Cache strategies
const CACHE_STRATEGIES = {
    'static': 'cache-first',
    'dynamic': 'stale-while-revalidate',
    'api': 'network-first',
    'images': 'stale-while-revalidate'
};

// URLs to cache immediately
const urlsToCache = [
    '/',
    '/test.html',
    '/Operator_Uplift_Complete.html',
    '/manifest.json',
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.min.js',
    'https://cdn.jsdelivr.net/npm/tsparticles@2.12.0/tsparticles.bundle.min.js',
    'https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/gsap.min.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('🚀 Service Worker installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('📦 Caching static assets');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('✅ Static assets cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Cache installation failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('🔄 Service Worker activating...');
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE && 
                            cacheName !== API_CACHE) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    const strategy = getCacheStrategy(url);
    
    console.log(`📡 Fetch: ${url.pathname} (${strategy})`);
    
    switch (strategy) {
        case 'cache-first':
            event.respondWith(cacheFirst(event.request));
            break;
        case 'network-first':
            event.respondWith(networkFirst(event.request));
            break;
        case 'stale-while-revalidate':
            event.respondWith(staleWhileRevalidate(event.request));
            break;
        default:
            event.respondWith(networkOnly(event.request));
    }
});

// Cache strategies implementation
async function cacheFirst(request) {
    // Skip caching for chrome-extension URLs
    if (request.url.startsWith('chrome-extension://')) {
        return fetch(request);
    }
    
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        console.log('📦 Serving from cache:', request.url);
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('❌ Network failed for cache-first:', error);
        return new Response('Offline content not available', { status: 503 });
    }
}

async function networkFirst(request) {
    // Skip caching for chrome-extension URLs
    if (request.url.startsWith('chrome-extension://')) {
        return fetch(request);
    }
    
    const cache = await caches.open(API_CACHE);
    
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('🌐 Network failed, trying cache:', error);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            console.log('📦 Serving API from cache:', request.url);
            return cachedResponse;
        }
        
        return new Response('API offline', { status: 503 });
    }
}

async function staleWhileRevalidate(request) {
    // Skip caching for chrome-extension URLs
    if (request.url.startsWith('chrome-extension://')) {
        return fetch(request);
    }
    
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(error => {
        console.error('❌ Network failed for stale-while-revalidate:', error);
    });
    
    return cachedResponse || fetchPromise;
}

async function networkOnly(request) {
    try {
        return await fetch(request);
    } catch (error) {
        console.error('❌ Network failed:', error);
        return new Response('Offline', { status: 503 });
    }
}

// Determine cache strategy based on URL
function getCacheStrategy(url) {
    // Static assets
    if (url.pathname.includes('.js') || 
        url.pathname.includes('.css') || 
        url.pathname.includes('.woff') ||
        url.pathname.includes('.woff2') ||
        url.pathname.includes('.ttf')) {
        return 'cache-first';
    }
    
    // Images
    if (url.pathname.includes('.jpg') || 
        url.pathname.includes('.jpeg') || 
        url.pathname.includes('.png') || 
        url.pathname.includes('.gif') || 
        url.pathname.includes('.svg') ||
        url.pathname.includes('.webp')) {
        return 'stale-while-revalidate';
    }
    
    // API calls
    if (url.pathname.includes('/api/') || 
        url.hostname.includes('firebase') ||
        url.hostname.includes('googleapis')) {
        return 'network-first';
    }
    
    // HTML pages
    if (url.pathname.endsWith('.html') || url.pathname === '/') {
        return 'stale-while-revalidate';
    }
    
    // Default to network-first for unknown types
    return 'network-first';
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('🔄 Background sync triggered:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Sync offline data when connection is restored
        const offlineData = await getOfflineData();
        
        for (const data of offlineData) {
            try {
                await syncOfflineAction(data);
            } catch (error) {
                console.error('❌ Failed to sync offline action:', error);
            }
        }
        
        console.log('✅ Background sync completed');
    } catch (error) {
        console.error('❌ Background sync failed:', error);
    }
}

// Get offline data from IndexedDB
async function getOfflineData() {
    // This would integrate with the app's IndexedDB storage
    return [];
}

// Sync offline action to server
async function syncOfflineAction(data) {
    // Implementation would depend on the specific action type
    console.log('🔄 Syncing offline action:', data);
}

// Push notification handling
self.addEventListener('push', (event) => {
    console.log('📱 Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'New notification from Operator Uplift',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Open App',
                icon: '/icon-192x192.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/icon-192x192.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Operator Uplift', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    console.log('👆 Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/Operator_Uplift_Complete.html')
        );
    }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
    console.log('💬 Message received in SW:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(DYNAMIC_CACHE)
                .then(cache => cache.addAll(event.data.urls))
        );
    }
});

// Error handling
self.addEventListener('error', (event) => {
    console.error('❌ Service Worker error:', event.error);
});

// Unhandled rejection handling
self.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Service Worker unhandled rejection:', event.reason);
});

console.log('🚀 Enhanced Service Worker loaded successfully!'); 