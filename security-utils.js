// Security Utilities for Operator Uplift
// Comprehensive input validation, sanitization, and security functions

const SecurityUtils = {
    // Input Validation
    validateEmail(email) {
        if (!email || typeof email !== 'string') return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length <= 254;
    },

    validatePassword(password) {
        if (!password || typeof password !== 'string') return false;
        return password.length >= 8 && password.length <= 128;
    },

    validateDisplayName(name) {
        if (!name || typeof name !== 'string') return false;
        const sanitized = this.sanitizeInput(name, 50);
        return sanitized.length >= 2 && sanitized.length <= 50;
    },

    validateGoalTitle(title) {
        if (!title || typeof title !== 'string') return false;
        const sanitized = this.sanitizeInput(title, 100);
        return sanitized.length >= 3 && sanitized.length <= 100;
    },

    validateGoalDescription(description) {
        if (!description || typeof description !== 'string') return false;
        const sanitized = this.sanitizeInput(description, 1000);
        return sanitized.length <= 1000;
    },

    validateTaskDescription(description) {
        if (!description || typeof description !== 'string') return false;
        const sanitized = this.sanitizeInput(description, 500);
        return sanitized.length <= 500;
    },

    // Input Sanitization
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
    },

    // AI Message Validation
    validateAIMessages(messages) {
        if (!Array.isArray(messages)) return false;
        if (messages.length === 0 || messages.length > 50) return false;
        
        return messages.every(msg => {
            if (!msg || typeof msg !== 'object') return false;
            if (!msg.role || !['system', 'user', 'assistant'].includes(msg.role)) return false;
            if (!msg.content || typeof msg.content !== 'string') return false;
            if (msg.content.length > 4000) return false;
            return true;
        });
    },

    // URL Sanitization
    sanitizeURL(url) {
        if (!url || typeof url !== 'string') return '';
        
        try {
            const parsed = new URL(url);
            if (!['http:', 'https:'].includes(parsed.protocol)) return '';
            return parsed.toString();
        } catch {
            return '';
        }
    },

    // CSS Sanitization
    sanitizeCSS(css) {
        if (!css || typeof css !== 'string') return '';
        
        // Remove dangerous CSS properties
        const dangerousProps = [
            'expression', 'javascript:', 'vbscript:', 'data:', 'url(',
            'behavior', 'binding', 'filter', 'background-image'
        ];
        
        let sanitized = css;
        dangerousProps.forEach(prop => {
            const regex = new RegExp(prop, 'gi');
            sanitized = sanitized.replace(regex, '');
        });
        
        return sanitized.substring(0, 1000);
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

    // CSRF Protection
    generateCSRFToken() {
        const token = crypto.getRandomValues(new Uint8Array(32))
            .reduce((acc, val) => acc + val.toString(16).padStart(2, '0'), '');
        sessionStorage.setItem('csrf_token', token);
        return token;
    },

    validateCSRFToken(token) {
        const storedToken = sessionStorage.getItem('csrf_token');
        return token === storedToken;
    },

    // XSS Protection
    escapeHTML(str) {
        if (!str || typeof str !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    // Content Security Policy
    validateCSPHeader(header) {
        const requiredDirectives = ['default-src', 'script-src', 'style-src'];
        const directives = header.split(';').map(d => d.trim().split(' ')[0]);
        return requiredDirectives.every(directive => directives.includes(directive));
    },

    // Secure Headers
    getSecureHeaders() {
        return {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
        };
    },

    // Input Validation with Error Messages
    validateWithErrors(input, type) {
        const validators = {
            email: {
                validate: this.validateEmail,
                error: 'Please enter a valid email address'
            },
            password: {
                validate: this.validatePassword,
                error: 'Password must be at least 8 characters long'
            },
            displayName: {
                validate: this.validateDisplayName,
                error: 'Display name must be 2-50 characters long'
            },
            goalTitle: {
                validate: this.validateGoalTitle,
                error: 'Goal title must be 3-100 characters long'
            },
            goalDescription: {
                validate: this.validateGoalDescription,
                error: 'Goal description must be 1000 characters or less'
            }
        };

        const validator = validators[type];
        if (!validator) {
            return { valid: false, error: 'Unknown validation type' };
        }

        return {
            valid: validator.validate(input),
            error: validator.error
        };
    },

    // Secure Random Generation
    generateSecureId() {
        return crypto.getRandomValues(new Uint8Array(16))
            .reduce((acc, val) => acc + val.toString(16).padStart(2, '0'), '');
    },

    // Hash Generation
    async hashString(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    // Session Security
    validateSession() {
        const sessionData = sessionStorage.getItem('session_data');
        if (!sessionData) return false;
        
        try {
            const session = JSON.parse(sessionData);
            const now = Date.now();
            
            // Check if session is expired (24 hours)
            if (now - session.created > 24 * 60 * 60 * 1000) {
                sessionStorage.removeItem('session_data');
                return false;
            }
            
            return true;
        } catch {
            sessionStorage.removeItem('session_data');
            return false;
        }
    },

    // Secure Storage
    secureSet(key, value) {
        try {
            const encrypted = btoa(JSON.stringify(value));
            localStorage.setItem(key, encrypted);
            return true;
        } catch (error) {
            console.error('Secure storage error:', error);
            return false;
        }
    },

    secureGet(key) {
        try {
            const encrypted = localStorage.getItem(key);
            if (!encrypted) return null;
            return JSON.parse(atob(encrypted));
        } catch (error) {
            console.error('Secure retrieval error:', error);
            return null;
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityUtils;
} else {
    window.SecurityUtils = SecurityUtils;
} 