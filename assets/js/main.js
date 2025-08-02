/**
 * Operator Uplift - Main JavaScript Entry Point
 * Initializes all modules and handles application startup
 */

// Import all modules
import './ai.js';
import './ui.js';
import './auth.js';
import './ai-agents.js';
import './ai-prompts.js';

// Import CSS
import '../css/main.css';

/**
 * Main Application Class
 */
class OperatorUplift {
    constructor() {
        this.isInitialized = false;
        this.modules = {};
        this.config = {
            debug: process.env.NODE_ENV === 'development',
            version: '1.0.0',
            buildDate: new Date().toISOString()
        };
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            // Check for service worker support
            if ('serviceWorker' in navigator) {
                await this.registerServiceWorker();
            }

            // Initialize modules
            await this.initializeModules();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize UI
            await this.initializeUI();
            
            // Mark as initialized
            this.isInitialized = true;
            
            // Dispatch ready event
            window.dispatchEvent(new CustomEvent('operatorUpliftReady'));
            
        } catch (error) {
            this.handleInitializationError(error);
        }
    }

    /**
     * Register service worker
     */
    async registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            // Handle service worker updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New service worker available
                        this.showUpdateNotification();
                    }
                });
            });
            
        } catch (error) {
            }
    }

    /**
     * Initialize all modules
     */
    async initializeModules() {
        const modules = [
            { name: 'auth', init: () => window.app?.auth?.init?.() },
            { name: 'ui', init: () => window.app?.ui?.init?.() },
            { name: 'ai', init: () => window.app?.ai?.init?.() }
        ];

        for (const module of modules) {
            try {
                if (module.init) {
                    await module.init();
                    this.modules[module.name] = true;
                    }
            } catch (error) {
                }
        }
    }

    /**
     * Set up global event listeners
     */
    setupEventListeners() {
        // Handle online/offline status
        window.addEventListener('online', () => {
            this.handleOnlineStatus(true);
        });

        window.addEventListener('offline', () => {
            this.handleOnlineStatus(false);
        });

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.handlePageHidden();
            } else {
                this.handlePageVisible();
            }
        });

        // Handle beforeunload
        window.addEventListener('beforeunload', (event) => {
            this.handleBeforeUnload(event);
        });

        // Handle errors
        window.addEventListener('error', (event) => {
            this.handleError(event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.handleUnhandledRejection(event.reason);
        });
    }

    /**
     * Initialize UI components
     */
    async initializeUI() {
        try {
            // Initialize theme
            this.initializeTheme();
            
            // Initialize particles if available
            if (window.tsParticles) {
                await this.initializeParticles();
            }
            
            // Initialize animations
            this.initializeAnimations();
            
            // Show loading screen
            this.hideLoadingScreen();
            
        } catch (error) {
            }
    }

    /**
     * Initialize theme system
     */
    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Theme toggle functionality
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                
                // Dispatch theme change event
                window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
            });
        }
    }

    /**
     * Initialize particles
     */
    async initializeParticles() {
        try {
            await window.tsParticles.load('tsparticles', {
                particles: {
                    number: {
                        value: 50,
                        density: {
                            enable: true,
                            value_area: 800
                        }
                    },
                    color: {
                        value: '#f97316'
                    },
                    shape: {
                        type: 'circle'
                    },
                    opacity: {
                        value: 0.5,
                        random: false
                    },
                    size: {
                        value: 3,
                        random: true
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#f97316',
                        opacity: 0.4,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: 'none',
                        random: false,
                        straight: false,
                        out_mode: 'out',
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: {
                            enable: true,
                            mode: 'repulse'
                        },
                        onclick: {
                            enable: true,
                            mode: 'push'
                        },
                        resize: true
                    }
                },
                retina_detect: true
            });
            
            } catch (error) {
            }
    }

    /**
     * Initialize animations
     */
    initializeAnimations() {
        // Add fade-in animation to cards
        const cards = document.querySelectorAll('.card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        });

        cards.forEach(card => observer.observe(card));
    }

    /**
     * Hide loading screen
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
        }
    }

    /**
     * Handle online status changes
     */
    handleOnlineStatus(isOnline) {
        const statusIndicator = document.getElementById('connection-status');
        if (statusIndicator) {
            statusIndicator.textContent = isOnline ? '🌐 Online' : '📴 Offline';
            statusIndicator.className = isOnline ? 'online' : 'offline';
        }

        // Sync data when back online
        if (isOnline && window.app?.firestore) {
            window.app.firestore.syncOfflineData();
        }
    }

    /**
     * Handle page visibility changes
     */
    handlePageHidden() {
        // Save current state
        if (window.app?.firestore) {
            window.app.firestore.saveCurrentState();
        }
    }

    handlePageVisible() {
        // Refresh data if needed
        if (window.app?.firestore) {
            window.app.firestore.refreshData();
        }
    }

    /**
     * Handle before unload
     */
    handleBeforeUnload(event) {
        // Save any unsaved data
        if (window.app?.firestore) {
            window.app.firestore.saveCurrentState();
        }
    }

    /**
     * Handle errors
     */
    handleError(error) {
        // Log to analytics if available
        if (window.gtag) {
            window.gtag('event', 'exception', {
                description: error.message,
                fatal: false
            });
        }
    }

    /**
     * Handle unhandled promise rejections
     */
    handleUnhandledRejection(reason) {
        // Log to analytics if available
        if (window.gtag) {
            window.gtag('event', 'exception', {
                description: reason.toString(),
                fatal: false
            });
        }
    }

    /**
     * Show update notification
     */
    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <p>🔄 New version available</p>
                <button onclick="location.reload()">Update Now</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 10000);
    }

    /**
     * Handle initialization errors
     */
    handleInitializationError(error) {
        // Show error message to user
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <h2>⚠️ Initialization Error</h2>
            <p>Failed to load Operator Uplift. Please refresh the page.</p>
            <button onclick="location.reload()">Refresh Page</button>
        `;
        
        document.body.appendChild(errorDiv);
    }

    /**
     * Get application status
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            modules: this.modules,
            config: this.config,
            online: navigator.onLine
        };
    }
}

// Create global instance
window.operatorUplift = new OperatorUplift();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.operatorUplift.init();
    });
} else {
    window.operatorUplift.init();
}

// Export for module systems
export default window.operatorUplift; 