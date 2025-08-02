// Enhanced Error Messages for Operator Uplift
// Comprehensive error handling with specific, user-friendly messages

const EnhancedErrorMessages = {
    // Error categories and specific messages
    errorTypes: {
        AUTHENTICATION: {
            'auth/user-not-found': 'Account not found. Please check your email or create a new account.',
            'auth/wrong-password': 'Incorrect password. Please try again or reset your password.',
            'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
            'auth/weak-password': 'Password is too weak. Please use at least 8 characters with numbers and symbols.',
            'auth/invalid-email': 'Please enter a valid email address.',
            'auth/too-many-requests': 'Too many failed attempts. Please try again in a few minutes.',
            'auth/network-request-failed': 'Network connection issue. Please check your internet connection.',
            'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
            'auth/cancelled-popup-request': 'Multiple sign-in windows detected. Please close other windows and try again.'
        },
        
        FIREBASE: {
            'permission-denied': 'You don\'t have permission to access this data.',
            'unavailable': 'Service temporarily unavailable. Please try again.',
            'deadline-exceeded': 'Request timed out. Please try again.',
            'resource-exhausted': 'Service quota exceeded. Please try again later.',
            'failed-precondition': 'Operation cannot be completed. Please refresh and try again.',
            'aborted': 'Operation was cancelled. Please try again.',
            'out-of-range': 'Requested data is out of range.',
            'unimplemented': 'This feature is not yet available.',
            'internal': 'Internal server error. Please try again later.',
            'data-loss': 'Data was lost during operation. Please refresh and try again.'
        },
        
        NETWORK: {
            'NETWORK_ERROR': 'Network connection failed. Please check your internet connection.',
            'TIMEOUT_ERROR': 'Request timed out. Please try again.',
            'CORS_ERROR': 'Cross-origin request blocked. Please refresh the page.',
            'DNS_ERROR': 'Unable to connect to server. Please check your connection.',
            'SSL_ERROR': 'Secure connection failed. Please refresh the page.'
        },
        
        VALIDATION: {
            'INVALID_INPUT': 'Please check your input and try again.',
            'REQUIRED_FIELD': 'This field is required.',
            'INVALID_FORMAT': 'Please use the correct format.',
            'LENGTH_EXCEEDED': 'Input is too long. Please shorten it.',
            'INVALID_CHARACTERS': 'Invalid characters detected. Please use only letters, numbers, and basic symbols.'
        },
        
        AI: {
            'AI_SERVICE_UNAVAILABLE': 'AI service is temporarily unavailable. Please try again later.',
            'AI_RATE_LIMIT': 'Too many AI requests. Please wait a moment and try again.',
            'AI_INVALID_REQUEST': 'AI request format is invalid. Please try again.',
            'AI_MODEL_ERROR': 'AI model encountered an error. Please try again.',
            'AI_TIMEOUT': 'AI response timed out. Please try again.'
        },
        
        PWA: {
            'SERVICE_WORKER_ERROR': 'App update failed. Please refresh the page.',
            'CACHE_ERROR': 'Offline data error. Please check your connection.',
            'PUSH_NOTIFICATION_ERROR': 'Push notification setup failed. Please check your browser settings.',
            'INSTALL_ERROR': 'App installation failed. Please try again.'
        }
    },
    
    // Get user-friendly error message
    getErrorMessage(error, context = '') {
        const errorCode = error.code || error.message || 'UNKNOWN_ERROR';
        const errorType = this.getErrorType(errorCode);
        
        // Check for specific error message
        if (this.errorTypes[errorType] && this.errorTypes[errorType][errorCode]) {
            return this.errorTypes[errorType][errorCode];
        }
        
        // Fallback messages
        const fallbackMessages = {
            AUTHENTICATION: 'Authentication error. Please try signing in again.',
            FIREBASE: 'Data operation failed. Please try again.',
            NETWORK: 'Connection error. Please check your internet connection.',
            VALIDATION: 'Input validation failed. Please check your data.',
            AI: 'AI service error. Please try again later.',
            PWA: 'App error. Please refresh the page.',
            UNKNOWN: 'An unexpected error occurred. Please try again.'
        };
        
        return fallbackMessages[errorType] || fallbackMessages.UNKNOWN;
    },
    
    // Determine error type from error code
    getErrorType(errorCode) {
        if (errorCode.startsWith('auth/')) return 'AUTHENTICATION';
        if (errorCode.startsWith('firebase/')) return 'FIREBASE';
        if (errorCode.includes('NETWORK') || errorCode.includes('TIMEOUT') || errorCode.includes('CORS')) return 'NETWORK';
        if (errorCode.includes('VALIDATION') || errorCode.includes('INVALID')) return 'VALIDATION';
        if (errorCode.includes('AI_')) return 'AI';
        if (errorCode.includes('PWA') || errorCode.includes('SERVICE_WORKER')) return 'PWA';
        return 'UNKNOWN';
    },
    
    // Display error message to user
    showError(error, context = '') {
        const message = this.getErrorMessage(error, context);
        const errorType = this.getErrorType(error.code || error.message);
        
        // Create error notification
        this.createErrorNotification(message, errorType);
        
        // Log error for debugging
        // Track error analytics
        this.trackError(error, context);
    },
    
    // Create user-friendly error notification
    createErrorNotification(message, errorType) {
        // Remove existing error notifications
        const existingErrors = document.querySelectorAll('.error-notification');
        existingErrors.forEach(error => error.remove());
        
        // Create new error notification
        const notification = document.createElement('div');
        notification.className = `error-notification error-${errorType.toLowerCase()}`;
        notification.innerHTML = `
            <div class="error-content">
                <div class="error-icon">⚠️</div>
                <div class="error-message">${message}</div>
                <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fee2e2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 16px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto-remove after 8 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 8000);
    },
    
    // Track error for analytics
    trackError(error, context) {
        if (window.gtag) {
            gtag('event', 'error', {
                error_type: this.getErrorType(error.code || error.message),
                error_code: error.code || error.message,
                context: context,
                timestamp: new Date().toISOString()
            });
        }
    },
    
    // Handle async operation with error handling
    async handleAsyncOperation(operation, context = '') {
        try {
            return await operation();
        } catch (error) {
            this.showError(error, context);
            throw error;
        }
    },
    
    // Validate input with specific error messages
    validateInput(value, rules, fieldName = '') {
        const errors = [];
        
        if (rules.required && (!value || value.trim() === '')) {
            errors.push(`${fieldName} is required.`);
        }
        
        if (rules.minLength && value && value.length < rules.minLength) {
            errors.push(`${fieldName} must be at least ${rules.minLength} characters.`);
        }
        
        if (rules.maxLength && value && value.length > rules.maxLength) {
            errors.push(`${fieldName} must be no more than ${rules.maxLength} characters.`);
        }
        
        if (rules.pattern && value && !rules.pattern.test(value)) {
            errors.push(`${fieldName} format is invalid.`);
        }
        
        if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors.push('Please enter a valid email address.');
        }
        
        return errors;
    },
    
    // Initialize enhanced error handling
    init() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.showError(event.error || new Error(event.message), 'Global Error');
        });
        
        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.showError(event.reason, 'Unhandled Promise Rejection');
        });
        
        // Firebase error handler
        if (window.app && app.firestore) {
            const originalUpdateUserData = app.firestore.updateUserData;
            app.firestore.updateUserData = async function(...args) {
                try {
                    return await originalUpdateUserData.apply(this, args);
                } catch (error) {
                    EnhancedErrorMessages.showError(error, 'Firebase Update');
                    throw error;
                }
            };
        }
        
        }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedErrorMessages;
} else {
    window.EnhancedErrorMessages = EnhancedErrorMessages;
} 