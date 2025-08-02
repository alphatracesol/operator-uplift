// PWA Enhancer for Operator Uplift
// Comprehensive service worker management, offline functionality, and performance optimizations

const PWAEnhancer = {
    // Service Worker Registration
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                });
                
                // Handle updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });
                
                return registration;
            } catch (error) {
                return null;
            }
        }
        return null;
    },

    // Show update notification
    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <p>New version available!</p>
                <button onclick="PWAEnhancer.updateApp()">Update Now</button>
                <button onclick="this.parentElement.parentElement.remove()">Later</button>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f97316;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        document.body.appendChild(notification);
    },

    // Update app
    async updateApp() {
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
        }
    },

    // Install Prompt Management
    installPrompt: null,

    initInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.installPrompt = e;
            this.showInstallButton();
        });
    },

    showInstallButton() {
        const installBtn = document.createElement('button');
        installBtn.id = 'install-btn';
        installBtn.textContent = 'Install App';
        installBtn.className = 'install-button';
        installBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #f97316;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            z-index: 1000;
            font-weight: 600;
        `;
        
        installBtn.addEventListener('click', () => this.installApp());
        document.body.appendChild(installBtn);
    },

    async installApp() {
        if (this.installPrompt) {
            this.installPrompt.prompt();
            const result = await this.installPrompt.userChoice;
            if (result.outcome === 'accepted') {
                }
            this.installPrompt = null;
            const installBtn = document.getElementById('install-btn');
            if (installBtn) installBtn.remove();
        }
    },

    // Offline Functionality
    initOfflineSupport() {
        // Check online status
        window.addEventListener('online', () => {
            this.hideOfflineIndicator();
            this.syncOfflineData();
        });
        
        window.addEventListener('offline', () => {
            this.showOfflineIndicator();
        });
        
        // Initialize offline data storage
        this.initOfflineStorage();
    },

    showOfflineIndicator() {
        if (!document.getElementById('offline-indicator')) {
            const indicator = document.createElement('div');
            indicator.id = 'offline-indicator';
            indicator.textContent = 'You are offline';
            indicator.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: #ef4444;
                color: white;
                text-align: center;
                padding: 8px;
                z-index: 10000;
                font-weight: 600;
            `;
            document.body.appendChild(indicator);
        }
    },

    hideOfflineIndicator() {
        const indicator = document.getElementById('offline-indicator');
        if (indicator) {
            indicator.remove();
        }
    },

    // Offline Storage
    initOfflineStorage() {
        if ('indexedDB' in window) {
            this.openDB();
        }
    },

    openDB() {
        const request = indexedDB.open('OperatorUpliftDB', 1);
        
        request.onerror = () => {
            };
        
        request.onsuccess = () => {
            this.db = request.result;
            };
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // Create object stores
            if (!db.objectStoreNames.contains('goals')) {
                const goalsStore = db.createObjectStore('goals', { keyPath: 'id' });
                goalsStore.createIndex('userId', 'userId', { unique: false });
            }
            
            if (!db.objectStoreNames.contains('tasks')) {
                const tasksStore = db.createObjectStore('tasks', { keyPath: 'id' });
                tasksStore.createIndex('goalId', 'goalId', { unique: false });
            }
            
            if (!db.objectStoreNames.contains('offlineActions')) {
                const actionsStore = db.createObjectStore('offlineActions', { keyPath: 'id', autoIncrement: true });
                actionsStore.createIndex('timestamp', 'timestamp', { unique: false });
            }
        };
    },

    // Store data offline
    async storeOfflineData(storeName, data) {
        if (!this.db) return;
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    // Get offline data
    async getOfflineData(storeName, key) {
        if (!this.db) return null;
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    // Sync offline data
    async syncOfflineData() {
        if (!this.db) return;
        
        const transaction = this.db.transaction(['offlineActions'], 'readonly');
        const store = transaction.objectStore('offlineActions');
        const request = store.getAll();
        
        request.onsuccess = async () => {
            const actions = request.result;
            for (const action of actions) {
                try {
                    await this.processOfflineAction(action);
                    await this.removeOfflineAction(action.id);
                } catch (error) {
                    }
            }
        };
    },

    // Process offline action
    async processOfflineAction(action) {
        switch (action.type) {
            case 'addGoal':
                // Process goal addition
                break;
            case 'updateGoal':
                // Process goal update
                break;
            case 'addTask':
                // Process task addition
                break;
            default:
                }
    },

    // Remove offline action
    async removeOfflineAction(id) {
        if (!this.db) return;
        
        const transaction = this.db.transaction(['offlineActions'], 'readwrite');
        const store = transaction.objectStore('offlineActions');
        store.delete(id);
    },

    // Background Sync
    async registerBackgroundSync() {
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            const registration = await navigator.serviceWorker.ready;
            
            try {
                await registration.sync.register('background-sync');
                } catch (error) {
                }
        }
    },

    // Push Notifications
    async initPushNotifications() {
        if ('Notification' in window && 'serviceWorker' in navigator) {
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                await this.subscribeToPush();
            }
        }
    },

    async subscribeToPush() {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(VAPID_CONFIG.publicKey)
            });
            
            // Send subscription to server
            await this.sendSubscriptionToServer(subscription);
        } catch (error) {
            }
    },

    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    },

    async sendSubscriptionToServer(subscription) {
        // Send to your server
        },

    // Performance Monitoring
    initPerformanceMonitoring() {
        // Web Vitals
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    this.recordWebVital(entry);
                });
            });
            
            observer.observe({ 
                entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] 
            });
        }
        
        // Resource timing
        this.recordResourceTiming();
    },

    recordWebVital(entry) {
        const metric = {
            name: entry.name,
            value: entry.value || entry.startTime,
            type: entry.entryType,
            timestamp: Date.now()
        };
        
        // Send to analytics
        this.sendMetric(metric);
    },

    recordResourceTiming() {
        if ('performance' in window) {
            const resources = performance.getEntriesByType('resource');
            resources.forEach(resource => {
                if (resource.duration > 3000) { // Slow resources
                    this.sendMetric({
                        name: 'slow-resource',
                        value: resource.duration,
                        url: resource.name,
                        timestamp: Date.now()
                    });
                }
            });
        }
    },

    sendMetric(metric) {
        // Send to your analytics service
        },

    // Cache Management
    async initCacheManagement() {
        if ('caches' in window) {
            this.cacheName = 'operator-uplift-v1';
            await this.cleanupOldCaches();
        }
    },

    async cleanupOldCaches() {
        const cacheNames = await caches.keys();
        const oldCaches = cacheNames.filter(name => name !== this.cacheName);
        
        await Promise.all(
            oldCaches.map(name => caches.delete(name))
        );
    },

    // App Shell Caching
    async cacheAppShell() {
        const appShellFiles = [
            '/',
            '/index.html',
            '/app.html',
            '/manifest.json',
            '/sw.js'
        ];
        
        const cache = await caches.open(this.cacheName);
        await cache.addAll(appShellFiles);
    },

    // Initialize PWA
    async init() {
        // Register service worker
        await this.registerServiceWorker();
        
        // Initialize install prompt
        this.initInstallPrompt();
        
        // Initialize offline support
        this.initOfflineSupport();
        
        // Register background sync
        await this.registerBackgroundSync();
        
        // Initialize push notifications
        await this.initPushNotifications();
        
        // Initialize performance monitoring
        this.initPerformanceMonitoring();
        
        // Initialize cache management
        await this.initCacheManagement();
        
        // Cache app shell
        await this.cacheAppShell();
        
        },

    // Utility functions
    isStandalone() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone === true;
    },

    isOnline() {
        return navigator.onLine;
    },

    // Get app info
    getAppInfo() {
        return {
            isStandalone: this.isStandalone(),
            isOnline: this.isOnline(),
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language
        };
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PWAEnhancer;
} else {
    window.PWAEnhancer = PWAEnhancer;
} 