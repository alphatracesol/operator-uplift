// Performance Optimizer for Operator Uplift
// Comprehensive performance optimization and monitoring

const PerformanceOptimizer = {
    // Performance metrics
    metrics: {
        loadTime: 0,
        domReady: 0,
        firstPaint: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        firstInputDelay: 0,
        cumulativeLayoutShift: 0,
        memoryUsage: 0,
        networkRequests: 0,
        slowResources: []
    },

    // Initialize Performance Optimizer
    async init() {
        // Set up performance monitoring
        this.setupPerformanceMonitoring();
        
        // Optimize existing resources
        this.optimizeResources();
        
        // Set up lazy loading
        this.setupLazyLoading();
        
        // Optimize images
        this.optimizeImages();
        
        // Set up caching
        this.setupCaching();
        
        // Monitor performance
        this.startPerformanceMonitoring();
        
        },

    // Setup Performance Monitoring
    setupPerformanceMonitoring() {
        // Monitor Web Vitals
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.largestContentfulPaint = lastEntry.startTime;
                this.logPerformance('LCP', lastEntry.startTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
                    this.logPerformance('FID', this.metrics.firstInputDelay);
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift
            const clsObserver = new PerformanceObserver((list) => {
                let clsValue = 0;
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                this.metrics.cumulativeLayoutShift = clsValue;
                this.logPerformance('CLS', clsValue);
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }

        // Monitor resource loading
        this.monitorResourceLoading();
    },

    // Monitor Resource Loading
    monitorResourceLoading() {
        const resources = performance.getEntriesByType('resource');
        this.metrics.networkRequests = resources.length;
        
        // Find slow resources
        this.metrics.slowResources = resources.filter(resource => resource.duration > 1000);
        
        if (this.metrics.slowResources.length > 0) {
            }
    },

    // Optimize Resources
    optimizeResources() {
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Defer non-critical resources
        this.deferNonCriticalResources();
        
        // Optimize CSS delivery
        this.optimizeCSSDelivery();
        
        // Optimize JavaScript loading
        this.optimizeJavaScriptLoading();
    },

    // Preload Critical Resources
    preloadCriticalResources() {
        const criticalResources = [
            '/manifest.json',
            '/sw.js',
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.includes('.css') ? 'style' : 'fetch';
            document.head.appendChild(link);
        });
    },

    // Defer Non-Critical Resources
    deferNonCriticalResources() {
        // Defer non-critical JavaScript
        const nonCriticalScripts = [
            'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js',
            'https://cdn.jsdelivr.net/npm/tsparticles@2.12.0/tsparticles.bundle.min.js'
        ];

        nonCriticalScripts.forEach(script => {
            const scriptElement = document.querySelector(`script[src="${script}"]`);
            if (scriptElement) {
                scriptElement.setAttribute('defer', 'true');
            }
        });
    },

    // Optimize CSS Delivery
    optimizeCSSDelivery() {
        // Inline critical CSS
        const criticalCSS = `
            :root {
                --accent-color: #f97316;
                --bg-color: #0a0a0a;
                --text-color: #e5e7eb;
            }
            body {
                font-family: 'Inter', sans-serif;
                background-color: var(--bg-color);
                color: var(--text-color);
                margin: 0;
                padding: 0;
            }
            .hidden { display: none !important; }
        `;

        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.insertBefore(style, document.head.firstChild);
    },

    // Optimize JavaScript Loading
    optimizeJavaScriptLoading() {
        // Use async loading for non-critical scripts
        const asyncScripts = [
            'https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/gsap.min.js',
            'https://cdn.jsdelivr.net/npm/tone@14.7.77/build/Tone.js'
        ];

        asyncScripts.forEach(script => {
            const scriptElement = document.querySelector(`script[src="${script}"]`);
            if (scriptElement) {
                scriptElement.setAttribute('async', 'true');
            }
        });
    },

    // Setup Lazy Loading
    setupLazyLoading() {
        // Lazy load images
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

        // Lazy load components
        this.lazyLoadComponents();
    },

    // Lazy Load Components
    lazyLoadComponents() {
        const components = document.querySelectorAll('[data-lazy-component]');
        const componentObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const component = entry.target;
                    this.loadComponent(component);
                    observer.unobserve(component);
                }
            });
        });

        components.forEach(component => componentObserver.observe(component));
    },

    // Load Component
    async loadComponent(component) {
        const componentType = component.dataset.lazyComponent;
        
        try {
            switch (componentType) {
                case 'chart':
                    await this.loadChartComponent(component);
                    break;
                case 'analytics':
                    await this.loadAnalyticsComponent(component);
                    break;
                case 'gamification':
                    await this.loadGamificationComponent(component);
                    break;
                default:
                    }
        } catch (error) {
            }
    },

    // Load Chart Component
    async loadChartComponent(component) {
        // Load Chart.js if not already loaded
        if (!window.Chart) {
            await this.loadScript('https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js');
        }
        
        // Initialize chart
        const ctx = component.querySelector('canvas');
        if (ctx) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                    datasets: [{
                        label: 'Progress',
                        data: [12, 19, 3, 5, 2],
                        borderColor: '#f97316'
                    }]
                }
            });
        }
    },

    // Load Analytics Component
    async loadAnalyticsComponent(component) {
        // Load analytics data
        const analyticsData = await this.fetchAnalyticsData();
        component.innerHTML = this.renderAnalytics(analyticsData);
    },

    // Load Gamification Component
    async loadGamificationComponent(component) {
        // Load gamification features
        component.innerHTML = this.renderGamification();
    },

    // Load Script
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    },

    // Optimize Images
    optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Add loading="lazy" for images below the fold
            if (!this.isAboveTheFold(img)) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add srcset for responsive images
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
            
            // Add alt text for accessibility
            if (!img.alt) {
                img.alt = 'Image';
            }
        });
    },

    // Check if element is above the fold
    isAboveTheFold(element) {
        const rect = element.getBoundingClientRect();
        return rect.top < window.innerHeight;
    },

    // Setup Caching
    setupCaching() {
        // Set cache headers for static resources
        this.setCacheHeaders();
        
        // Implement service worker caching
        this.setupServiceWorkerCaching();
        
        // Setup browser caching
        this.setupBrowserCaching();
    },

    // Set Cache Headers
    setCacheHeaders() {
        // This would be implemented on the server side
        // For now, we'll use meta tags for cache control
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Cache-Control';
        meta.content = 'public, max-age=31536000';
        document.head.appendChild(meta);
    },

    // Setup Service Worker Caching
    setupServiceWorkerCaching() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    })
                .catch(error => {
                    });
        }
    },

    // Setup Browser Caching
    setupBrowserCaching() {
        // Use localStorage for caching
        this.cacheData = {
            set: (key, value, ttl = 3600000) => {
                const item = {
                    value: value,
                    timestamp: Date.now(),
                    ttl: ttl
                };
                localStorage.setItem(key, JSON.stringify(item));
            },
            get: (key) => {
                const item = localStorage.getItem(key);
                if (!item) return null;
                
                const data = JSON.parse(item);
                if (Date.now() - data.timestamp > data.ttl) {
                    localStorage.removeItem(key);
                    return null;
                }
                
                return data.value;
            }
        };
    },

    // Start Performance Monitoring
    startPerformanceMonitoring() {
        // Monitor performance every 30 seconds
        setInterval(() => {
            this.updatePerformanceMetrics();
        }, 30000);

        // Monitor memory usage
        if (performance.memory) {
            setInterval(() => {
                this.metrics.memoryUsage = performance.memory.usedJSHeapSize;
                this.logPerformance('Memory Usage', this.metrics.memoryUsage);
            }, 60000);
        }
    },

    // Update Performance Metrics
    updatePerformanceMetrics() {
        // Update load time
        this.metrics.loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        this.metrics.domReady = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
        
        // Log performance metrics
        this.logPerformance('Load Time', this.metrics.loadTime);
        this.logPerformance('DOM Ready', this.metrics.domReady);
    },

    // Log Performance
    logPerformance(metric, value) {
        const threshold = this.getPerformanceThreshold(metric);
        const status = value <= threshold ? '✅' : '⚠️';
        
        `);
        
        // Send to analytics if available
        if (window.gtag) {
            gtag('event', 'performance', {
                metric: metric,
                value: value,
                threshold: threshold
            });
        }
    },

    // Get Performance Threshold
    getPerformanceThreshold(metric) {
        const thresholds = {
            'LCP': 2500,
            'FID': 100,
            'CLS': 0.1,
            'Load Time': 3000,
            'DOM Ready': 2000,
            'Memory Usage': 50000000
        };
        
        return thresholds[metric] || 1000;
    },

    // Get Performance Report
    getPerformanceReport() {
        return {
            metrics: this.metrics,
            score: this.calculatePerformanceScore(),
            recommendations: this.getPerformanceRecommendations()
        };
    },

    // Calculate Performance Score
    calculatePerformanceScore() {
        let score = 100;
        
        // Deduct points for poor performance
        if (this.metrics.largestContentfulPaint > 2500) score -= 20;
        if (this.metrics.firstInputDelay > 100) score -= 20;
        if (this.metrics.cumulativeLayoutShift > 0.1) score -= 20;
        if (this.metrics.loadTime > 3000) score -= 20;
        if (this.metrics.slowResources.length > 5) score -= 20;
        
        return Math.max(0, score);
    },

    // Get Performance Recommendations
    getPerformanceRecommendations() {
        const recommendations = [];
        
        if (this.metrics.largestContentfulPaint > 2500) {
            recommendations.push('Optimize largest contentful paint by reducing image sizes and improving server response times');
        }
        
        if (this.metrics.firstInputDelay > 100) {
            recommendations.push('Reduce JavaScript execution time to improve first input delay');
        }
        
        if (this.metrics.cumulativeLayoutShift > 0.1) {
            recommendations.push('Fix layout shifts by setting explicit dimensions for images and other elements');
        }
        
        if (this.metrics.slowResources.length > 0) {
            recommendations.push(`Optimize ${this.metrics.slowResources.length} slow resources`);
        }
        
        return recommendations;
    },

    // Fetch Analytics Data
    async fetchAnalyticsData() {
        // This would fetch real analytics data
        return {
            totalGoals: 150,
            completedGoals: 120,
            successRate: 80,
            averageCompletionTime: 7
        };
    },

    // Render Analytics
    renderAnalytics(data) {
        return `
            <div class="analytics-dashboard">
                <h3>Analytics Overview</h3>
                <div class="analytics-grid">
                    <div class="analytics-card">
                        <h4>Total Goals</h4>
                        <p>${data.totalGoals}</p>
                    </div>
                    <div class="analytics-card">
                        <h4>Completed</h4>
                        <p>${data.completedGoals}</p>
                    </div>
                    <div class="analytics-card">
                        <h4>Success Rate</h4>
                        <p>${data.successRate}%</p>
                    </div>
                </div>
            </div>
        `;
    },

    // Render Gamification
    renderGamification() {
        return `
            <div class="gamification-panel">
                <h3>Your Progress</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 75%"></div>
                </div>
                <p>Level 5 - 75% to next level</p>
            </div>
        `;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
} else {
    window.PerformanceOptimizer = PerformanceOptimizer;
} 