// Enhanced Security Headers for Operator Uplift
// Additional security headers for enhanced protection

const EnhancedSecurityHeaders = {
    // Enhanced security headers configuration
    headers: {
        // Content Security Policy - Enhanced
        'Content-Security-Policy': [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
            "https://www.gstatic.com",
            "https://cdn.jsdelivr.net",
            "https://cdnjs.cloudflare.com",
            "https://www.googletagmanager.com",
            "https://connect.facebook.net",
            "https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/gsap.min.js",
            "https://cdn.jsdelivr.net/npm/tsparticles@2.12.0/tsparticles.bundle.min.js",
            "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js",
            "https://cdn.jsdelivr.net/npm/tone@14.7.77/build/Tone.js",
            "https://cdn.jsdelivr.net/npm/date-fns@2.30.0/index.min.js",
            "blob:",
            "wss://api.operatoruplift.com",
            "style-src 'self' 'unsafe-inline'",
            "https://fonts.googleapis.com",
            "https://cdn.tailwindcss.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https:",
            "https://images.pexels.com",
            "https://placehold.co",
            "blob:",
            "connect-src 'self'",
            "https://firestore.googleapis.com",
            "https://identitytoolkit.googleapis.com",
            "https://fcm.googleapis.com",
            "https://www.googletagmanager.com",
            "https://connect.facebook.net",
            "https://api.ipify.org",
            "https://api.operatoruplift.com",
            "wss://api.operatoruplift.com",
            "frame-src 'self' https://www.facebook.com",
            "worker-src 'self' blob:",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'self'",
            "upgrade-insecure-requests",
            "require-trusted-types-for 'script'",
            "trusted-types 'default'"
        ].join('; '),
        
        // X-Content-Type-Options
        'X-Content-Type-Options': 'nosniff',
        
        // X-Frame-Options
        'X-Frame-Options': 'DENY',
        
        // X-XSS-Protection
        'X-XSS-Protection': '1; mode=block',
        
        // Referrer Policy
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        
        // Permissions Policy - Enhanced
        'Permissions-Policy': [
            'camera=()',
            'microphone=()',
            'geolocation=()',
            'payment=()',
            'usb=()',
            'magnetometer=()',
            'gyroscope=()',
            'accelerometer=()',
            'ambient-light-sensor=()',
            'autoplay=()',
            'encrypted-media=()',
            'fullscreen=()',
            'picture-in-picture=()',
            'publickey-credentials-get=()',
            'screen-wake-lock=()',
            'sync-xhr=()',
            'web-share=()',
            'xr-spatial-tracking=()'
        ].join(', '),
        
        // Strict Transport Security - Enhanced
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        
        // Cross-Origin Embedder Policy
        'Cross-Origin-Embedder-Policy': 'require-corp',
        
        // Cross-Origin Opener Policy
        'Cross-Origin-Opener-Policy': 'same-origin',
        
        // Cross-Origin Resource Policy
        'Cross-Origin-Resource-Policy': 'same-origin',
        
        // Origin-Agent-Cluster
        'Origin-Agent-Cluster': '?1',
        
        // Clear-Site-Data (for logout)
        'Clear-Site-Data': '"cache", "cookies", "storage"',
        
        // Feature Policy (legacy support)
        'Feature-Policy': [
            'camera none',
            'microphone none',
            'geolocation none',
            'payment none',
            'usb none'
        ].join('; ')
    },
    
    // Apply security headers to response
    applyHeaders(response) {
        Object.entries(this.headers).forEach(([header, value]) => {
            response.setHeader(header, value);
        });
        return response;
    },
    
    // Get headers for Netlify configuration
    getNetlifyHeaders() {
        return Object.entries(this.headers).map(([header, value]) => ({
            [header]: value
        }));
    },
    
    // Validate security headers
    validateHeaders(headers) {
        const requiredHeaders = [
            'X-Content-Type-Options',
            'X-Frame-Options',
            'X-XSS-Protection',
            'Referrer-Policy',
            'Permissions-Policy'
        ];
        
        const missingHeaders = requiredHeaders.filter(header => !headers[header]);
        return {
            valid: missingHeaders.length === 0,
            missing: missingHeaders
        };
    },
    
    // Generate security report
    generateSecurityReport() {
        return {
            timestamp: new Date().toISOString(),
            headers: this.headers,
            validation: this.validateHeaders(this.headers),
            recommendations: this.getSecurityRecommendations()
        };
    },
    
    // Get security recommendations
    getSecurityRecommendations() {
        return [
            'Enable HTTPS for all connections',
            'Implement rate limiting',
            'Use secure session management',
            'Regular security audits',
            'Monitor for security vulnerabilities',
            'Keep dependencies updated',
            'Implement proper logging',
            'Use environment variables for secrets'
        ];
    },
    
    // Initialize enhanced security headers
    init() {
        // Apply headers to current page if possible
        if (typeof document !== 'undefined') {
            this.applyMetaTags();
        }
        
        },
    
    // Apply security meta tags
    applyMetaTags() {
        const head = document.head;
        
        // Remove existing security meta tags
        const existingTags = head.querySelectorAll('meta[http-equiv*="Content-Security-Policy"], meta[http-equiv*="X-Content-Type-Options"], meta[http-equiv*="X-Frame-Options"], meta[http-equiv*="X-XSS-Protection"], meta[http-equiv*="Referrer-Policy"], meta[http-equiv*="Permissions-Policy"]');
        existingTags.forEach(tag => tag.remove());
        
        // Add enhanced security meta tags
        Object.entries(this.headers).forEach(([header, value]) => {
            if (header !== 'Strict-Transport-Security' && header !== 'Cross-Origin-Embedder-Policy' && header !== 'Cross-Origin-Opener-Policy' && header !== 'Cross-Origin-Resource-Policy' && header !== 'Origin-Agent-Cluster' && header !== 'Clear-Site-Data' && header !== 'Feature-Policy') {
                const meta = document.createElement('meta');
                meta.setAttribute('http-equiv', header);
                meta.setAttribute('content', value);
                head.appendChild(meta);
            }
        });
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedSecurityHeaders;
} else {
    window.EnhancedSecurityHeaders = EnhancedSecurityHeaders;
} 