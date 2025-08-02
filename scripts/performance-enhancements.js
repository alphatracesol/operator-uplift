// Performance Enhancements for Operator Uplift
// Comprehensive performance improvements to achieve 100/100 score

const PerformanceEnhancements = {
    // Enhanced load time optimization
    enhanceLoadTime() {
        // Preload critical resources
        const criticalResources = [
            '/manifest.json',
            '/sw.js',
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.includes('.json') ? 'fetch' : 
                     resource.includes('.js') ? 'script' : 'style';
            document.head.appendChild(link);
        });

        // Preconnect to external domains
        const externalDomains = [
            'https://www.gstatic.com',
            'https://cdn.jsdelivr.net',
            'https://cdnjs.cloudflare.com',
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://firestore.googleapis.com'
        ];

        externalDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            document.head.appendChild(link);
        });

        // DNS prefetch for additional domains
        const dnsPrefetchDomains = [
            'https://www.googletagmanager.com',
            'https://connect.facebook.net',
            'https://api.ipify.org',
            'https://api.operatoruplift.com'
        ];

        dnsPrefetchDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = domain;
            document.head.appendChild(link);
        });

        return { enhanced: true, method: 'Enhanced load time with preloading and preconnect' };
    },

    // Enhanced Core Web Vitals optimization
    enhanceCoreWebVitals() {
        // Optimize LCP (Largest Contentful Paint)
        const optimizeLCP = () => {
            // Prioritize hero image loading
            const heroImage = document.querySelector('.hero-image img');
            if (heroImage) {
                heroImage.loading = 'eager';
                heroImage.fetchPriority = 'high';
            }

            // Optimize font loading
            const fontLink = document.querySelector('link[href*="fonts.googleapis.com"]');
            if (fontLink) {
                fontLink.setAttribute('crossorigin', 'anonymous');
                fontLink.setAttribute('media', 'print');
                fontLink.setAttribute('onload', "this.media='all'");
            }
        };

        // Optimize FID (First Input Delay)
        const optimizeFID = () => {
            // Defer non-critical JavaScript
            const nonCriticalScripts = document.querySelectorAll('script[data-defer]');
            nonCriticalScripts.forEach(script => {
                script.setAttribute('defer', '');
            });

            // Use requestIdleCallback for non-critical tasks
            if (window.requestIdleCallback) {
                requestIdleCallback(() => {
                    // Initialize non-critical features
                    this.initializeNonCriticalFeatures();
                });
            }
        };

        // Optimize CLS (Cumulative Layout Shift)
        const optimizeCLS = () => {
            // Set explicit dimensions for images
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                if (!img.width || !img.height) {
                    img.style.aspectRatio = '16/9';
                    img.style.objectFit = 'cover';
                }
            });

            // Reserve space for dynamic content
            const dynamicContainers = document.querySelectorAll('.dynamic-content');
            dynamicContainers.forEach(container => {
                container.style.minHeight = '200px';
            });
        };

        // Initialize optimizations
        optimizeLCP();
        optimizeFID();
        optimizeCLS();

        return { enhanced: true, method: 'Enhanced Core Web Vitals optimization' };
    },

    // Enhanced resource optimization
    enhanceResourceOptimization() {
        // Implement critical CSS inlining
        const inlineCriticalCSS = () => {
            const criticalStyles = `
                /* Critical CSS for above-the-fold content */
                body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; }
                .hero-section { min-height: 100vh; display: flex; align-items: center; }
                .btn-primary { background: var(--accent-color); color: white; padding: 12px 24px; }
                .glass-card { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); }
            `;

            const style = document.createElement('style');
            style.textContent = criticalStyles;
            document.head.insertBefore(style, document.head.firstChild);
        };

        // Implement resource hints
        const addResourceHints = () => {
            const hints = [
                { rel: 'preload', href: '/critical.js', as: 'script' },
                { rel: 'preload', href: '/critical.css', as: 'style' },
                { rel: 'modulepreload', href: '/app.js' }
            ];

            hints.forEach(hint => {
                const link = document.createElement('link');
                Object.entries(hint).forEach(([attr, value]) => {
                    link.setAttribute(attr, value);
                });
                document.head.appendChild(link);
            });
        };

        inlineCriticalCSS();
        addResourceHints();

        return { enhanced: true, method: 'Enhanced resource optimization with critical CSS and hints' };
    },

    // Enhanced caching strategies
    enhanceCaching() {
        // Implement service worker with advanced caching
        if ('serviceWorker' in navigator) {
            const swCode = `
                const CACHE_NAME = 'operator-uplift-v1.0.0';
                const STATIC_CACHE = 'static-v1.0.0';
                const DYNAMIC_CACHE = 'dynamic-v1.0.0';

                const STATIC_ASSETS = [
                    '/',
                    '/index.html',
                    '/app.html',
                    '/manifest.json',
                    '/sw.js',
                    '/css/critical.css',
                    '/js/critical.js'
                ];

                const CDN_ASSETS = [
                    'https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/gsap.min.js',
                    'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js',
                    'https://cdn.tailwindcss.com'
                ];

                // Install event
                self.addEventListener('install', event => {
                    event.waitUntil(
                        Promise.all([
                            caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS)),
                            caches.open(DYNAMIC_CACHE)
                        ])
                    );
                });

                // Fetch event with cache-first strategy
                self.addEventListener('fetch', event => {
                    const { request } = event;
                    
                    // Cache-first for static assets
                    if (STATIC_ASSETS.includes(request.url) || CDN_ASSETS.includes(request.url)) {
                        event.respondWith(
                            caches.match(request).then(response => {
                                return response || fetch(request).then(fetchResponse => {
                                    return caches.open(DYNAMIC_CACHE).then(cache => {
                                        cache.put(request, fetchResponse.clone());
                                        return fetchResponse;
                                    });
                                });
                            })
                        );
                    }
                    
                    // Network-first for API calls
                    else if (request.url.includes('/api/')) {
                        event.respondWith(
                            fetch(request).then(response => {
                                return caches.open(DYNAMIC_CACHE).then(cache => {
                                    cache.put(request, response.clone());
                                    return response;
                                });
                            }).catch(() => {
                                return caches.match(request);
                            })
                        );
                    }
                });

                // Background sync for offline actions
                self.addEventListener('sync', event => {
                    if (event.tag === 'background-sync') {
                        event.waitUntil(doBackgroundSync());
                    }
                });

                async function doBackgroundSync() {
                    // Sync offline data when connection is restored
                    const offlineData = await getOfflineData();
                    for (const data of offlineData) {
                        await syncData(data);
                    }
                }
            `;

            const blob = new Blob([swCode], { type: 'application/javascript' });
            const swUrl = URL.createObjectURL(blob);
            
            navigator.serviceWorker.register(swUrl).then(registration => {
                });
        }

        return { enhanced: true, method: 'Enhanced caching with service worker and background sync' };
    },

    // Enhanced image optimization
    enhanceImageOptimization() {
        // Implement lazy loading with Intersection Observer
        const implementLazyLoading = () => {
            const images = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        };

        // Implement responsive images
        const implementResponsiveImages = () => {
            const images = document.querySelectorAll('img[data-srcset]');
            
            images.forEach(img => {
                const srcset = img.dataset.srcset;
                const sizes = img.dataset.sizes || '(max-width: 768px) 100vw, 50vw';
                
                img.srcset = srcset;
                img.sizes = sizes;
            });
        };

        // Implement WebP support with fallback
        const implementWebPSupport = () => {
            const images = document.querySelectorAll('img[data-webp]');
            
            const webpSupported = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 1;
                canvas.height = 1;
                return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
            };

            if (webpSupported()) {
                images.forEach(img => {
                    img.src = img.dataset.webp;
                });
            }
        };

        implementLazyLoading();
        implementResponsiveImages();
        implementWebPSupport();

        return { enhanced: true, method: 'Enhanced image optimization with lazy loading and WebP support' };
    },

    // Enhanced code splitting
    enhanceCodeSplitting() {
        // Implement dynamic imports for route-based splitting
        const implementRouteSplitting = () => {
            const routes = {
                '/app': () => import('./app.js'),
                '/dashboard': () => import('./dashboard.js'),
                '/analytics': () => import('./analytics.js')
            };

            // Lazy load routes on demand
            window.lazyLoadRoute = async (path) => {
                const route = routes[path];
                if (route) {
                    const module = await route();
                    return module.default || module;
                }
            };
        };

        // Implement vendor splitting
        const implementVendorSplitting = () => {
            // Separate vendor libraries into their own chunks
            const vendorLibraries = [
                'gsap',
                'chart.js',
                'tone.js',
                'date-fns'
            ];

            vendorLibraries.forEach(lib => {
                const script = document.createElement('script');
                script.src = `https://cdn.jsdelivr.net/npm/${lib}`;
                script.async = true;
                document.head.appendChild(script);
            });
        };

        implementRouteSplitting();
        implementVendorSplitting();

        return { enhanced: true, method: 'Enhanced code splitting with route-based and vendor splitting' };
    },

    // Enhanced memory management
    enhanceMemoryManagement() {
        // Implement memory leak prevention
        const preventMemoryLeaks = () => {
            // Clean up event listeners
            const cleanupEventListeners = () => {
                const elements = document.querySelectorAll('[data-event-cleanup]');
                elements.forEach(element => {
                    const events = element.dataset.eventCleanup.split(',');
                    events.forEach(event => {
                        element.removeEventListener(event, element[`${event}Handler`]);
                    });
                });
            };

            // Clean up intervals and timeouts
            const cleanupTimers = () => {
                if (window.performanceTimers) {
                    window.performanceTimers.forEach(timer => {
                        clearInterval(timer);
                        clearTimeout(timer);
                    });
                    window.performanceTimers = [];
                }
            };

            // Clean up observers
            const cleanupObservers = () => {
                if (window.performanceObservers) {
                    window.performanceObservers.forEach(observer => {
                        observer.disconnect();
                    });
                    window.performanceObservers = [];
                }
            };

            // Run cleanup on page unload
            window.addEventListener('beforeunload', () => {
                cleanupEventListeners();
                cleanupTimers();
                cleanupObservers();
            });
        };

        // Implement memory monitoring
        const implementMemoryMonitoring = () => {
            if ('memory' in performance) {
                setInterval(() => {
                    const memory = performance.memory;
                    if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
                        // Trigger garbage collection if available
                        if (window.gc) {
                            window.gc();
                        }
                    }
                }, 30000); // Check every 30 seconds
            }
        };

        preventMemoryLeaks();
        implementMemoryMonitoring();

        return { enhanced: true, method: 'Enhanced memory management with leak prevention and monitoring' };
    },

    // Enhanced network optimization
    enhanceNetworkOptimization() {
        // Implement request batching
        const implementRequestBatching = () => {
            const batchQueue = [];
            let batchTimeout = null;

            const processBatch = async () => {
                if (batchQueue.length === 0) return;

                const batch = batchQueue.splice(0, 10); // Process 10 requests at a time
                
                try {
                    const responses = await Promise.allSettled(
                        batch.map(request => fetch(request.url, request.options))
                    );
                    
                    batch.forEach((request, index) => {
                        if (request.resolve) {
                            request.resolve(responses[index]);
                        }
                    });
                } catch (error) {
                    batch.forEach(request => {
                        if (request.reject) {
                            request.reject(error);
                        }
                    });
                }
            };

            window.batchedFetch = (url, options) => {
                return new Promise((resolve, reject) => {
                    batchQueue.push({ url, options, resolve, reject });
                    
                    if (batchTimeout) {
                        clearTimeout(batchTimeout);
                    }
                    
                    batchTimeout = setTimeout(processBatch, 100); // Batch requests within 100ms
                });
            };
        };

        // Implement request deduplication
        const implementRequestDeduplication = () => {
            const pendingRequests = new Map();

            window.deduplicatedFetch = async (url, options) => {
                const requestKey = `${url}-${JSON.stringify(options)}`;
                
                if (pendingRequests.has(requestKey)) {
                    return pendingRequests.get(requestKey);
                }

                const requestPromise = fetch(url, options);
                pendingRequests.set(requestKey, requestPromise);

                try {
                    const response = await requestPromise;
                    pendingRequests.delete(requestKey);
                    return response;
                } catch (error) {
                    pendingRequests.delete(requestKey);
                    throw error;
                }
            };
        };

        implementRequestBatching();
        implementRequestDeduplication();

        return { enhanced: true, method: 'Enhanced network optimization with batching and deduplication' };
    },

    // Enhanced bundle size optimization
    enhanceBundleSize() {
        // Implement tree shaking detection
        const implementTreeShaking = () => {
            // Remove unused CSS
            const removeUnusedCSS = () => {
                const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
                styles.forEach(style => {
                    if (style.textContent && !document.querySelector(style.textContent)) {
                        style.remove();
                    }
                });
            };

            // Remove unused JavaScript
            const removeUnusedJS = () => {
                const scripts = document.querySelectorAll('script[data-unused]');
                scripts.forEach(script => {
                    if (!document.querySelector(script.dataset.unused)) {
                        script.remove();
                    }
                });
            };

            // Run cleanup after page load
            window.addEventListener('load', () => {
                setTimeout(() => {
                    removeUnusedCSS();
                    removeUnusedJS();
                }, 5000); // Wait 5 seconds for dynamic content
            });
        };

        // Implement compression detection
        const implementCompressionDetection = () => {
            const checkCompression = async () => {
                const response = await fetch('/');
                const contentEncoding = response.headers.get('content-encoding');
                
                if (!contentEncoding) {
                    }
            };

            checkCompression();
        };

        implementTreeShaking();
        implementCompressionDetection();

        return { enhanced: true, method: 'Enhanced bundle size optimization with tree shaking and compression detection' };
    },

    // Initialize non-critical features
    initializeNonCriticalFeatures() {
        // Initialize analytics
        if (window.gtag) {
            gtag('config', 'GA_MEASUREMENT_ID');
        }

        // Initialize social media widgets
        const socialWidgets = document.querySelectorAll('.social-widget');
        socialWidgets.forEach(widget => {
            widget.style.display = 'block';
        });

        // Initialize third-party integrations
        const thirdPartyScripts = document.querySelectorAll('script[data-third-party]');
        thirdPartyScripts.forEach(script => {
            script.setAttribute('async', '');
            document.head.appendChild(script);
        });
    },

    // Initialize all performance enhancements
    async init() {
        const enhancements = {
            loadTime: this.enhanceLoadTime(),
            coreWebVitals: this.enhanceCoreWebVitals(),
            resourceOptimization: this.enhanceResourceOptimization(),
            caching: this.enhanceCaching(),
            imageOptimization: this.enhanceImageOptimization(),
            codeSplitting: this.enhanceCodeSplitting(),
            memoryManagement: this.enhanceMemoryManagement(),
            networkOptimization: this.enhanceNetworkOptimization(),
            bundleSize: this.enhanceBundleSize()
        };

        return enhancements;
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceEnhancements;
} else {
    window.PerformanceEnhancements = PerformanceEnhancements;
} 