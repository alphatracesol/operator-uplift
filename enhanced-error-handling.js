// Enhanced Error Handling for Operator Uplift
// Comprehensive error handling, validation, and retry mechanisms

const EnhancedErrorHandling = {
    // Enhanced Firebase Error Handling
    async updateUserDataSecure(updates, retryCount = 0) {
        if (!app.state.currentUser) {
            throw new Error("User not authenticated");
        }
        try {
            const validatedUpdates = this.validateUpdates(updates);
            const userRef = doc(db, "users", app.state.currentUser.uid);
            if (this.isCriticalUpdate(updates)) {
                await runTransaction(db, async (transaction) => {
                    const userDoc = await transaction.get(userRef);
                    if (!userDoc.exists()) {
                        throw new Error("User document not found");
                    }
                    const currentData = userDoc.data();
                    const newData = { ...currentData, ...validatedUpdates };
                    if (!this.validateUserData(newData)) {
                        throw new Error("Invalid user data after update");
                    }
                    transaction.update(userRef, validatedUpdates);
                });
            } else {
                await updateDoc(userRef, validatedUpdates);
            }
            Object.assign(app.state.userData, validatedUpdates);
            localStorage.setItem('cachedUserData', JSON.stringify(app.state.userData));
        } catch (error) {
            console.error("Update failed:", error);
            if (error.code === 'permission-denied') {
                app.ui.showToast('Permission denied. Please log in again.', 'error');
                await app.auth.logout();
                throw error;
            } else if (error.code === 'unavailable') {
                app.ui.showToast('Service temporarily unavailable. Please try again.', 'warning');
                this.storeOfflineUpdate(updates);
                throw error;
            } else if (error.code === 'resource-exhausted') {
                app.ui.showToast('Service overloaded. Please try again later.', 'warning');
                throw error;
            }
            if (retryCount < 3 && this.isRetryableError(error)) {
                await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
                return this.updateUserDataSecure(updates, retryCount + 1);
            }
            throw error;
        }
    },

    validateUpdates(updates) {
        const validated = {};
        for (const [key, value] of Object.entries(updates)) {
            if (this.isValidUpdate(key, value)) {
                validated[key] = value;
            } else {
                console.warn(`Invalid update: ${key} = ${value}`);
            }
        }
        return validated;
    },

    isValidUpdate(key, value) {
        // Add validation logic for different update types
        if (key.startsWith('stats.')) {
            return typeof value === 'number' && value >= 0;
        }
        if (key.startsWith('settings.')) {
            return typeof value === 'string' || typeof value === 'boolean';
        }
        return true; // Allow other updates by default
    },

    isCriticalUpdate(updates) {
        const criticalKeys = ['stats.points', 'stats.level', 'stats.energy'];
        return Object.keys(updates).some(key => criticalKeys.includes(key));
    },

    validateUserData(data) {
        // Basic validation for user data structure
        return data && typeof data === 'object' && data.stats && data.settings;
    },

    isRetryableError(error) {
        const retryableCodes = ['unavailable', 'deadline-exceeded', 'resource-exhausted'];
        return retryableCodes.includes(error.code);
    },

    storeOfflineUpdate(updates) {
        try {
            const offlineUpdates = JSON.parse(localStorage.getItem('offlineUpdates') || '[]');
            offlineUpdates.push({
                updates,
                timestamp: new Date().toISOString(),
                retryCount: 0
            });
            localStorage.setItem('offlineUpdates', JSON.stringify(offlineUpdates));
        } catch (error) {
            console.error('Failed to store offline update:', error);
        }
    },

    // Enhanced Event Listener Error Handling
    addSecureEventListener(element, event, handler) {
        const secureHandler = async (...args) => {
            try {
                await handler(...args);
            } catch (error) {
                console.error('Event handler error:', error);
                app.ui.showToast('An error occurred. Please try again.', 'error');
            }
        };
        element.addEventListener(event, secureHandler);
        return () => element.removeEventListener(event, secureHandler);
    },

    // Rate Limiting
    async checkRateLimit(operation = 'default', userId = null) {
        const now = Date.now();
        const windowMs = 60000; // 1 minute
        const maxRequests = {
            ai: 10,
            auth: 5,
            goals: 20,
            default: 30
        };
        
        const key = `rate_limit_${operation}_${userId || 'anonymous'}`;
        const requests = JSON.parse(localStorage.getItem(key) || '[]');
        
        // Remove old requests
        const recentRequests = requests.filter(time => now - time < windowMs);
        
        if (recentRequests.length >= maxRequests[operation]) {
            return {
                allowed: false,
                waitTime: Math.ceil((windowMs - (now - recentRequests[0])) / 1000),
                reason: `${operation} rate limit exceeded`
            };
        }
        
        // Add current request
        recentRequests.push(now);
        localStorage.setItem(key, JSON.stringify(recentRequests));
        
        return { allowed: true };
    },

    // Memory Management
    cleanupEventListeners() {
        const elements = document.querySelectorAll('button, a, input, select, textarea');
        elements.forEach(element => {
            element.replaceWith(element.cloneNode(true));
        });
    },

    // Performance Monitoring
    trackPerformance(operation, startTime) {
        const duration = Date.now() - startTime;
        if (duration > 1000) {
            console.warn(`Slow operation: ${operation} took ${duration}ms`);
        }
        
        // Send to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'timing_complete', {
                name: operation,
                value: duration,
                event_category: 'performance'
            });
        }
    },

    // Error Tracking
    trackError(error, context = {}) {
        const errorData = {
            message: error.message || 'Unknown error',
            stack: error.stack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            userId: app.state.user?.uid || 'anonymous',
            ...context
        };
        
        // Send to monitoring service
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: errorData.message,
                fatal: false,
                custom_map: {
                    error_type: context.type || 'unknown',
                    user_id: errorData.userId
                }
            });
        }
        
        // Store locally for debugging
        this.storeError(errorData);
    },

    storeError(errorData) {
        const errors = JSON.parse(localStorage.getItem('app-errors') || '[]');
        errors.push(errorData);
        if (errors.length > 50) errors.shift(); // Keep last 50 errors
        localStorage.setItem('app-errors', JSON.stringify(errors));
    },

    // Input Validation
    validateInput(input, type) {
        const validators = {
            email: (value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value) && value.length <= 254;
            },
            password: (value) => {
                return value.length >= 8 && value.length <= 128;
            },
            displayName: (value) => {
                return value.length >= 2 && value.length <= 50;
            },
            goalTitle: (value) => {
                return value.length >= 3 && value.length <= 100;
            },
            goalDescription: (value) => {
                return value.length <= 1000;
            }
        };
        
        const validator = validators[type];
        return validator ? validator(input) : true;
    },

    // Sanitization
    sanitizeInput(input, maxLength = 1000) {
        if (!input || typeof input !== 'string') return '';
        
        // Remove null bytes and control characters
        let sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
        
        // Remove script tags and dangerous HTML
        sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
        sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
        sanitized = sanitized.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
        
        // Remove dangerous attributes
        sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
        sanitized = sanitized.replace(/\s*javascript\s*:/gi, '');
        sanitized = sanitized.replace(/\s*data\s*:/gi, '');
        
        // Limit length
        if (sanitized.length > maxLength) {
            sanitized = sanitized.substring(0, maxLength);
        }
        
        return sanitized.trim();
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedErrorHandling;
} else {
    window.EnhancedErrorHandling = EnhancedErrorHandling;
} 