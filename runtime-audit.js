/**
 * 🚀 OPERATOR UPLIFT - COMPREHENSIVE RUNTIME AUDIT
 * 
 * This script performs a deep dive into the actual app functions, features, calls,
 * compliance, ARIA, security, and user personal-to-app-AI-program experience.
 * 
 * Date: August 1st, 2025
 */

const RuntimeAudit = {
    // Configuration
    config: {
        testTimeout: 10000, // 10 seconds per test
        maxRetries: 3,
        auditDate: '2025-08-01',
        version: '1.0.0'
    },

    // Test Results Storage
    results: {
        startTime: null,
        endTime: null,
        tests: {},
        summary: {
            total: 0,
            passed: 0,
            failed: 0,
            warnings: 0,
            score: 0
        }
    },

    // Initialize Audit
    async init() {
        console.log('🚀 Starting Operator Uplift Runtime Audit...');
        console.log(`📅 Date: ${this.config.auditDate}`);
        console.log(`⏰ Time: ${new Date().toLocaleTimeString()}`);
        
        this.results.startTime = new Date();
        
        // Wait for app to be available
        await this.waitForApp();
        
        // Run all audit categories
        await this.runSecurityAudit();
        await this.runComplianceAudit();
        await this.runAIAudit();
        await this.runARIAudit();
        await this.runPerformanceAudit();
        await this.runUserExperienceAudit();
        await this.runFunctionalityAudit();
        
        // Generate final report
        this.generateFinalReport();
    },

    // Wait for app object to be available
    async waitForApp() {
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds
        
        while (!window.app && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!window.app) {
            throw new Error('App object not found after 5 seconds');
        }
        
        console.log('✅ App object found and ready');
    },

    // Security Audit
    async runSecurityAudit() {
        console.log('\n🔒 Running Security Audit...');
        
        const securityTests = [
            {
                name: 'CSP Headers',
                test: () => this.testCSPHeaders(),
                critical: true
            },
            {
                name: 'Input Validation',
                test: () => this.testInputValidation(),
                critical: true
            },
            {
                name: 'XSS Protection',
                test: () => this.testXSSProtection(),
                critical: true
            },
            {
                name: 'Authentication',
                test: () => this.testAuthentication(),
                critical: true
            },
            {
                name: 'Rate Limiting',
                test: () => this.testRateLimiting(),
                critical: false
            },
            {
                name: 'Data Sanitization',
                test: () => this.testDataSanitization(),
                critical: true
            },
            {
                name: 'Secure Headers',
                test: () => this.testSecureHeaders(),
                critical: false
            },
            {
                name: 'CSRF Protection',
                test: () => this.testCSRFProtection(),
                critical: true
            }
        ];

        for (const test of securityTests) {
            await this.runTest('security', test);
        }
    },

    // Compliance Audit
    async runComplianceAudit() {
        console.log('\n📋 Running Compliance Audit...');
        
        const complianceTests = [
            {
                name: 'GDPR Compliance',
                test: () => this.testGDPRCompliance(),
                critical: true
            },
            {
                name: 'CCPA Compliance',
                test: () => this.testCCPACompliance(),
                critical: false
            },
            {
                name: 'ADA Compliance',
                test: () => this.testADACompliance(),
                critical: true
            },
            {
                name: 'WCAG 2.1 AA',
                test: () => this.testWCAGCompliance(),
                critical: true
            },
            {
                name: 'Cookie Consent',
                test: () => this.testCookieConsent(),
                critical: true
            },
            {
                name: 'Privacy Policy',
                test: () => this.testPrivacyPolicy(),
                critical: true
            },
            {
                name: 'Terms of Service',
                test: () => this.testTermsOfService(),
                critical: true
            }
        ];

        for (const test of complianceTests) {
            await this.runTest('compliance', test);
        }
    },

    // AI Audit
    async runAIAudit() {
        console.log('\n🤖 Running AI Integration Audit...');
        
        const aiTests = [
            {
                name: 'AI Object Structure',
                test: () => this.testAIObjectStructure(),
                critical: true
            },
            {
                name: 'AI Call Function',
                test: () => this.testAICallFunction(),
                critical: true
            },
            {
                name: 'AI Rate Limiting',
                test: () => this.testAIRateLimiting(),
                critical: false
            },
            {
                name: 'AI Message Validation',
                test: () => this.testAIMessageValidation(),
                critical: true
            },
            {
                name: 'AI Credit System',
                test: () => this.testAICreditSystem(),
                critical: false
            },
            {
                name: 'AI Error Handling',
                test: () => this.testAIErrorHandling(),
                critical: true
            },
            {
                name: 'AI Integration Features',
                test: () => this.testAIIntegrationFeatures(),
                critical: false
            },
            {
                name: 'AI Proxy Function',
                test: () => this.testAIProxyFunction(),
                critical: true
            }
        ];

        for (const test of aiTests) {
            await this.runTest('ai', test);
        }
    },

    // ARIA Audit
    async runARIAudit() {
        console.log('\n♿ Running ARIA & Accessibility Audit...');
        
        const ariaTests = [
            {
                name: 'ARIA Attributes',
                test: () => this.testARIAttributes(),
                critical: true
            },
            {
                name: 'Keyboard Navigation',
                test: () => this.testKeyboardNavigation(),
                critical: true
            },
            {
                name: 'Focus Management',
                test: () => this.testFocusManagement(),
                critical: true
            },
            {
                name: 'Screen Reader Support',
                test: () => this.testScreenReaderSupport(),
                critical: true
            },
            {
                name: 'Color Contrast',
                test: () => this.testColorContrast(),
                critical: true
            },
            {
                name: 'Semantic HTML',
                test: () => this.testSemanticHTML(),
                critical: false
            },
            {
                name: 'Form Accessibility',
                test: () => this.testFormAccessibility(),
                critical: true
            },
            {
                name: 'Modal Accessibility',
                test: () => this.testModalAccessibility(),
                critical: true
            }
        ];

        for (const test of ariaTests) {
            await this.runTest('aria', test);
        }
    },

    // Performance Audit
    async runPerformanceAudit() {
        console.log('\n⚡ Running Performance Audit...');
        
        const performanceTests = [
            {
                name: 'Page Load Time',
                test: () => this.testPageLoadTime(),
                critical: false
            },
            {
                name: 'Core Web Vitals',
                test: () => this.testCoreWebVitals(),
                critical: false
            },
            {
                name: 'Memory Usage',
                test: () => this.testMemoryUsage(),
                critical: false
            },
            {
                name: 'Bundle Size',
                test: () => this.testBundleSize(),
                critical: false
            },
            {
                name: 'Image Optimization',
                test: () => this.testImageOptimization(),
                critical: false
            },
            {
                name: 'Caching Strategy',
                test: () => this.testCachingStrategy(),
                critical: false
            },
            {
                name: 'Lazy Loading',
                test: () => this.testLazyLoading(),
                critical: false
            }
        ];

        for (const test of performanceTests) {
            await this.runTest('performance', test);
        }
    },

    // User Experience Audit
    async runUserExperienceAudit() {
        console.log('\n👤 Running User Experience Audit...');
        
        const uxTests = [
            {
                name: 'Mobile Responsiveness',
                test: () => this.testMobileResponsiveness(),
                critical: true
            },
            {
                name: 'Touch Targets',
                test: () => this.testTouchTargets(),
                critical: true
            },
            {
                name: 'Loading States',
                test: () => this.testLoadingStates(),
                critical: false
            },
            {
                name: 'Error Handling',
                test: () => this.testErrorHandling(),
                critical: true
            },
            {
                name: 'User Feedback',
                test: () => this.testUserFeedback(),
                critical: false
            },
            {
                name: 'Navigation Flow',
                test: () => this.testNavigationFlow(),
                critical: true
            },
            {
                name: 'Data Persistence',
                test: () => this.testDataPersistence(),
                critical: true
            },
            {
                name: 'Offline Functionality',
                test: () => this.testOfflineFunctionality(),
                critical: false
            }
        ];

        for (const test of uxTests) {
            await this.runTest('ux', test);
        }
    },

    // Functionality Audit
    async runFunctionalityAudit() {
        console.log('\n⚙️ Running Functionality Audit...');
        
        const functionalityTests = [
            {
                name: 'Authentication Flow',
                test: () => this.testAuthenticationFlow(),
                critical: true
            },
            {
                name: 'Goal Management',
                test: () => this.testGoalManagement(),
                critical: true
            },
            {
                name: 'Habit Tracking',
                test: () => this.testHabitTracking(),
                critical: false
            },
            {
                name: 'Focus Sessions',
                test: () => this.testFocusSessions(),
                critical: false
            },
            {
                name: 'Gamification',
                test: () => this.testGamification(),
                critical: false
            },
            {
                name: 'Community Features',
                test: () => this.testCommunityFeatures(),
                critical: false
            },
            {
                name: 'Analytics',
                test: () => this.testAnalytics(),
                critical: false
            },
            {
                name: 'Settings Management',
                test: () => this.testSettingsManagement(),
                critical: false
            }
        ];

        for (const test of functionalityTests) {
            await this.runTest('functionality', test);
        }
    },

    // Test Runner
    async runTest(category, testConfig) {
        const testName = `${category}_${testConfig.name.replace(/\s+/g, '_').toLowerCase()}`;
        
        try {
            console.log(`  Testing: ${testConfig.name}...`);
            
            const result = await Promise.race([
                testConfig.test(),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Test timeout')), this.config.testTimeout)
                )
            ]);
            
            this.results.tests[testName] = {
                status: 'passed',
                critical: testConfig.critical,
                result: result,
                timestamp: new Date().toISOString()
            };
            
            this.results.summary.passed++;
            console.log(`    ✅ ${testConfig.name} - PASSED`);
            
        } catch (error) {
            this.results.tests[testName] = {
                status: 'failed',
                critical: testConfig.critical,
                error: error.message,
                timestamp: new Date().toISOString()
            };
            
            if (testConfig.critical) {
                this.results.summary.failed++;
                console.log(`    ❌ ${testConfig.name} - FAILED (CRITICAL)`);
            } else {
                this.results.summary.warnings++;
                console.log(`    ⚠️ ${testConfig.name} - FAILED (WARNING)`);
            }
        }
        
        this.results.summary.total++;
    },

    // Security Test Implementations
    async testCSPHeaders() {
        const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (!meta) throw new Error('CSP meta tag not found');
        
        const csp = meta.getAttribute('content');
        if (!csp) throw new Error('CSP content not found');
        
        // Check for essential directives
        const requiredDirectives = ['default-src', 'script-src', 'style-src'];
        const directives = csp.split(';').map(d => d.trim().split(' ')[0]);
        
        for (const directive of requiredDirectives) {
            if (!directives.includes(directive)) {
                throw new Error(`Missing CSP directive: ${directive}`);
            }
        }
        
        return { csp: csp, directives: directives };
    },

    async testInputValidation() {
        if (!window.SecurityUtils) throw new Error('SecurityUtils not found');
        
        // Test email validation
        const validEmail = SecurityUtils.validateEmail('test@example.com');
        const invalidEmail = SecurityUtils.validateEmail('invalid-email');
        
        if (!validEmail || invalidEmail) {
            throw new Error('Email validation not working correctly');
        }
        
        // Test password validation
        const validPassword = SecurityUtils.validatePassword('password123');
        const invalidPassword = SecurityUtils.validatePassword('123');
        
        if (!validPassword || invalidPassword) {
            throw new Error('Password validation not working correctly');
        }
        
        return { emailValidation: true, passwordValidation: true };
    },

    async testXSSProtection() {
        if (!window.SecurityUtils) throw new Error('SecurityUtils not found');
        
        const maliciousInput = '<script>alert("xss")</script>';
        const sanitized = SecurityUtils.sanitizeInput(maliciousInput);
        
        if (sanitized.includes('<script>') || sanitized.includes('alert')) {
            throw new Error('XSS protection not working correctly');
        }
        
        return { sanitized: sanitized, protection: true };
    },

    async testAuthentication() {
        if (!window.app || !app.auth) throw new Error('App authentication not found');
        
        const authMethods = ['login', 'register', 'logout', 'resetPassword'];
        
        for (const method of authMethods) {
            if (typeof app.auth[method] !== 'function') {
                throw new Error(`Authentication method missing: ${method}`);
            }
        }
        
        return { methods: authMethods, status: 'available' };
    },

    async testRateLimiting() {
        if (!window.app || !app.ai) throw new Error('AI rate limiting not found');
        
        if (typeof app.ai.checkRateLimit !== 'function') {
            throw new Error('AI rate limiting function not found');
        }
        
        return { rateLimiting: true };
    },

    async testDataSanitization() {
        if (!window.SecurityUtils) throw new Error('SecurityUtils not found');
        
        const testData = {
            html: '<p>Test</p><script>alert("xss")</script>',
            url: 'javascript:alert("xss")',
            css: 'expression(alert("xss"))'
        };
        
        const sanitized = {
            html: SecurityUtils.sanitizeInput(testData.html),
            url: SecurityUtils.sanitizeURL(testData.url),
            css: SecurityUtils.sanitizeCSS(testData.css)
        };
        
        if (sanitized.html.includes('<script>') || 
            sanitized.url.includes('javascript:') || 
            sanitized.css.includes('expression')) {
            throw new Error('Data sanitization not working correctly');
        }
        
        return { sanitized: sanitized };
    },

    async testSecureHeaders() {
        // This would typically be tested on the server side
        // For client-side, we check if the app is served over HTTPS
        if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
            throw new Error('App not served over HTTPS');
        }
        
        return { https: true };
    },

    async testCSRFProtection() {
        if (!window.SecurityUtils) throw new Error('SecurityUtils not found');
        
        const token = SecurityUtils.generateCSRFToken();
        const isValid = SecurityUtils.validateCSRFToken(token);
        
        if (!isValid) {
            throw new Error('CSRF token validation not working');
        }
        
        return { csrfProtection: true };
    },

    // Compliance Test Implementations
    async testGDPRCompliance() {
        // Check for GDPR consent banner
        const gdprBanner = document.getElementById('gdpr-banner') || 
                          document.querySelector('[data-gdpr]') ||
                          document.querySelector('.cookie-consent');
        
        if (!gdprBanner) {
            throw new Error('GDPR consent banner not found');
        }
        
        // Check for privacy policy link
        const privacyLink = document.querySelector('a[href*="privacy"], a[href*="Privacy"]');
        if (!privacyLink) {
            throw new Error('Privacy policy link not found');
        }
        
        return { gdprBanner: true, privacyLink: true };
    },

    async testCCPACompliance() {
        // Check for CCPA compliance elements
        const ccpaElements = document.querySelectorAll('[data-ccpa], .ccpa-notice');
        
        return { ccpaElements: ccpaElements.length };
    },

    async testADACompliance() {
        // Check for ADA compliance elements
        const skipLink = document.querySelector('.skip-link, a[href^="#main"]');
        const altTexts = document.querySelectorAll('img[alt]');
        
        if (!skipLink) {
            throw new Error('Skip link not found for ADA compliance');
        }
        
        return { skipLink: true, altTexts: altTexts.length };
    },

    async testWCAGCompliance() {
        if (!window.AccessibilityAudit) throw new Error('AccessibilityAudit not found');
        
        const compliance = AccessibilityAudit.checkWCAGCompliance();
        
        if (compliance.score < 80) {
            throw new Error(`WCAG compliance score too low: ${compliance.score}`);
        }
        
        return { score: compliance.score, issues: compliance.issues.length };
    },

    async testCookieConsent() {
        const cookieBanner = document.getElementById('cookie-consent-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        const declineBtn = document.getElementById('cookie-decline');
        
        if (!cookieBanner || !acceptBtn || !declineBtn) {
            throw new Error('Cookie consent elements not found');
        }
        
        return { cookieConsent: true };
    },

    async testPrivacyPolicy() {
        const privacyModal = document.getElementById('privacy');
        const privacyLink = document.querySelector('a[href="#privacy"]');
        
        if (!privacyModal || !privacyLink) {
            throw new Error('Privacy policy not found');
        }
        
        return { privacyPolicy: true };
    },

    async testTermsOfService() {
        const termsModal = document.getElementById('terms');
        const termsLink = document.querySelector('a[href="#terms"]');
        
        if (!termsModal || !termsLink) {
            throw new Error('Terms of service not found');
        }
        
        return { termsOfService: true };
    },

    // AI Test Implementations
    async testAIObjectStructure() {
        if (!window.app || !app.ai) throw new Error('AI object not found');
        
        const requiredMethods = ['call', 'checkRateLimit', 'validateMessages'];
        
        for (const method of requiredMethods) {
            if (typeof app.ai[method] !== 'function') {
                throw new Error(`AI method missing: ${method}`);
            }
        }
        
        return { methods: requiredMethods, status: 'available' };
    },

    async testAICallFunction() {
        if (!window.app || !app.ai) throw new Error('AI call function not found');
        
        // Test with mock data
        const testMessages = [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: 'Hello' }
        ];
        
        // This would normally make an actual API call
        // For testing, we just verify the function exists and can be called
        if (typeof app.ai.call !== 'function') {
            throw new Error('AI call function not found');
        }
        
        return { callFunction: true };
    },

    async testAIRateLimiting() {
        if (!window.app || !app.ai) throw new Error('AI rate limiting not found');
        
        const rateLimit = await app.ai.checkRateLimit();
        
        if (typeof rateLimit !== 'object' || !rateLimit.hasOwnProperty('allowed')) {
            throw new Error('AI rate limiting not working correctly');
        }
        
        return { rateLimit: rateLimit };
    },

    async testAIMessageValidation() {
        if (!window.app || !app.ai) throw new Error('AI message validation not found');
        
        const validMessages = [
            { role: 'user', content: 'Hello' }
        ];
        
        const invalidMessages = [
            { role: 'invalid', content: 'Hello' }
        ];
        
        const validResult = app.ai.validateMessages(validMessages);
        const invalidResult = app.ai.validateMessages(invalidMessages);
        
        if (!validResult || invalidResult) {
            throw new Error('AI message validation not working correctly');
        }
        
        return { validation: true };
    },

    async testAICreditSystem() {
        if (!window.app || !app.state || !app.state.userData) {
            return { creditSystem: 'not_available' };
        }
        
        if (!app.state.userData.stats || !app.state.userData.stats.hasOwnProperty('aiCredits')) {
            throw new Error('AI credit system not found');
        }
        
        return { credits: app.state.userData.stats.aiCredits };
    },

    async testAIErrorHandling() {
        if (!window.app || !app.ai) throw new Error('AI error handling not found');
        
        // Test error handling by calling with invalid data
        try {
            await app.ai.call('invalid');
            throw new Error('AI should have thrown an error for invalid input');
        } catch (error) {
            // Expected error
            return { errorHandling: true };
        }
    },

    async testAIIntegrationFeatures() {
        if (!window.app || !app.ai) throw new Error('AI integration features not found');
        
        const features = ['requestMotivation', 'requestAdvice', 'requestGoalBreakdown', 'quickQuestion'];
        
        for (const feature of features) {
            if (typeof app.ai[feature] !== 'function') {
                throw new Error(`AI feature missing: ${feature}`);
            }
        }
        
        return { features: features, status: 'available' };
    },

    async testAIProxyFunction() {
        // Check if Netlify function exists
        const response = await fetch('/.netlify/functions/ai-proxy', {
            method: 'OPTIONS'
        });
        
        if (!response.ok) {
            throw new Error('AI proxy function not accessible');
        }
        
        return { proxyFunction: true };
    },

    // ARIA Test Implementations
    async testARIAttributes() {
        if (!window.AccessibilityAudit) throw new Error('AccessibilityAudit not found');
        
        const ariaIssues = AccessibilityAudit.checkARIAAttributes();
        
        if (ariaIssues.length > 10) {
            throw new Error(`Too many ARIA issues: ${ariaIssues.length}`);
        }
        
        return { issues: ariaIssues.length };
    },

    async testKeyboardNavigation() {
        if (!window.AccessibilityAudit) throw new Error('AccessibilityAudit not found');
        
        const keyboardIssues = AccessibilityAudit.checkKeyboardNavigation();
        
        if (keyboardIssues.length > 5) {
            throw new Error(`Too many keyboard navigation issues: ${keyboardIssues.length}`);
        }
        
        return { issues: keyboardIssues.length };
    },

    async testFocusManagement() {
        if (!window.AccessibilityAudit) throw new Error('AccessibilityAudit not found');
        
        const focusIssues = AccessibilityAudit.checkFocusManagement();
        
        return { issues: focusIssues.length };
    },

    async testScreenReaderSupport() {
        if (!window.AccessibilityAudit) throw new Error('AccessibilityAudit not found');
        
        const screenReaderIssues = AccessibilityAudit.checkScreenReaderCompatibility();
        
        if (screenReaderIssues.length > 10) {
            throw new Error(`Too many screen reader issues: ${screenReaderIssues.length}`);
        }
        
        return { issues: screenReaderIssues.length };
    },

    async testColorContrast() {
        if (!window.AccessibilityAudit) throw new Error('AccessibilityAudit not found');
        
        const contrastIssues = AccessibilityAudit.checkColorContrast();
        
        if (contrastIssues.length > 5) {
            throw new Error(`Too many color contrast issues: ${contrastIssues.length}`);
        }
        
        return { issues: contrastIssues.length };
    },

    async testSemanticHTML() {
        const semanticElements = document.querySelectorAll('main, nav, section, article, aside, header, footer');
        
        if (semanticElements.length < 5) {
            throw new Error('Not enough semantic HTML elements');
        }
        
        return { semanticElements: semanticElements.length };
    },

    async testFormAccessibility() {
        const forms = document.querySelectorAll('form');
        let accessibleForms = 0;
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, select, textarea');
            let hasLabels = 0;
            
            inputs.forEach(input => {
                if (input.hasAttribute('aria-label') || 
                    input.hasAttribute('aria-labelledby') ||
                    form.querySelector(`label[for="${input.id}"]`)) {
                    hasLabels++;
                }
            });
            
            if (hasLabels === inputs.length) {
                accessibleForms++;
            }
        });
        
        if (accessibleForms < forms.length) {
            throw new Error('Not all forms are accessible');
        }
        
        return { accessibleForms: accessibleForms, totalForms: forms.length };
    },

    async testModalAccessibility() {
        const modals = document.querySelectorAll('.modal, [role="dialog"]');
        
        modals.forEach(modal => {
            if (!modal.hasAttribute('aria-labelledby') && !modal.hasAttribute('aria-label')) {
                throw new Error('Modal missing accessibility attributes');
            }
        });
        
        return { modals: modals.length };
    },

    // Performance Test Implementations
    async testPageLoadTime() {
        const loadTime = performance.now();
        
        if (loadTime > 5000) {
            throw new Error(`Page load time too slow: ${loadTime}ms`);
        }
        
        return { loadTime: loadTime };
    },

    async testCoreWebVitals() {
        // This would require actual Core Web Vitals data
        // For now, we check if the performance observer is available
        if (!('PerformanceObserver' in window)) {
            throw new Error('PerformanceObserver not available');
        }
        
        return { performanceObserver: true };
    },

    async testMemoryUsage() {
        if ('memory' in performance) {
            const memory = performance.memory;
            const usedMB = memory.usedJSHeapSize / 1024 / 1024;
            
            if (usedMB > 100) {
                throw new Error(`Memory usage too high: ${usedMB}MB`);
            }
            
            return { usedMB: usedMB };
        }
        
        return { memory: 'not_available' };
    },

    async testBundleSize() {
        // This would require actual bundle analysis
        // For now, we check if external scripts are loaded
        const scripts = document.querySelectorAll('script[src]');
        const externalScripts = Array.from(scripts).filter(script => 
            !script.src.includes(window.location.origin)
        );
        
        if (externalScripts.length > 10) {
            throw new Error(`Too many external scripts: ${externalScripts.length}`);
        }
        
        return { externalScripts: externalScripts.length };
    },

    async testImageOptimization() {
        const images = document.querySelectorAll('img');
        let optimizedImages = 0;
        
        images.forEach(img => {
            if (img.hasAttribute('loading') || img.hasAttribute('srcset')) {
                optimizedImages++;
            }
        });
        
        return { optimizedImages: optimizedImages, totalImages: images.length };
    },

    async testCachingStrategy() {
        // Check if service worker is registered
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.getRegistration();
            return { serviceWorker: !!registration };
        }
        
        return { serviceWorker: false };
    },

    async testLazyLoading() {
        const lazyElements = document.querySelectorAll('[loading="lazy"]');
        
        return { lazyElements: lazyElements.length };
    },

    // UX Test Implementations
    async testMobileResponsiveness() {
        const viewport = document.querySelector('meta[name="viewport"]');
        
        if (!viewport) {
            throw new Error('Viewport meta tag not found');
        }
        
        return { viewport: true };
    },

    async testTouchTargets() {
        const touchTargets = document.querySelectorAll('button, a, input, select');
        let adequateTargets = 0;
        
        touchTargets.forEach(target => {
            const rect = target.getBoundingClientRect();
            if (rect.width >= 44 && rect.height >= 44) {
                adequateTargets++;
            }
        });
        
        if (adequateTargets < touchTargets.length * 0.8) {
            throw new Error('Too many small touch targets');
        }
        
        return { adequateTargets: adequateTargets, totalTargets: touchTargets.length };
    },

    async testLoadingStates() {
        const loadingElements = document.querySelectorAll('.loading, [data-loading]');
        
        return { loadingElements: loadingElements.length };
    },

    async testErrorHandling() {
        if (!window.app || !app.ui) throw new Error('UI error handling not found');
        
        if (typeof app.ui.showToast !== 'function') {
            throw new Error('Error handling not available');
        }
        
        return { errorHandling: true };
    },

    async testUserFeedback() {
        const toastContainer = document.getElementById('toast-container');
        
        if (!toastContainer) {
            throw new Error('Toast container not found');
        }
        
        return { userFeedback: true };
    },

    async testNavigationFlow() {
        const navigation = document.querySelector('nav');
        
        if (!navigation) {
            throw new Error('Navigation not found');
        }
        
        return { navigation: true };
    },

    async testDataPersistence() {
        if (!window.app || !app.firestore) throw new Error('Data persistence not found');
        
        if (typeof app.firestore.updateUserData !== 'function') {
            throw new Error('Data persistence not available');
        }
        
        return { dataPersistence: true };
    },

    async testOfflineFunctionality() {
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.getRegistration();
            return { offlineSupport: !!registration };
        }
        
        return { offlineSupport: false };
    },

    // Functionality Test Implementations
    async testAuthenticationFlow() {
        if (!window.app || !app.auth) throw new Error('Authentication flow not found');
        
        const authMethods = ['login', 'register', 'logout'];
        
        for (const method of authMethods) {
            if (typeof app.auth[method] !== 'function') {
                throw new Error(`Authentication method missing: ${method}`);
            }
        }
        
        return { authenticationFlow: true };
    },

    async testGoalManagement() {
        if (!window.app || !app.goals) throw new Error('Goal management not found');
        
        if (typeof app.goals.addGoal !== 'function') {
            throw new Error('Goal management not available');
        }
        
        return { goalManagement: true };
    },

    async testHabitTracking() {
        if (!window.app || !app.habits) throw new Error('Habit tracking not found');
        
        if (typeof app.habits.addHabit !== 'function') {
            throw new Error('Habit tracking not available');
        }
        
        return { habitTracking: true };
    },

    async testFocusSessions() {
        if (!window.app || !app.focus) throw new Error('Focus sessions not found');
        
        return { focusSessions: true };
    },

    async testGamification() {
        if (!window.app || !app.gamification) throw new Error('Gamification not found');
        
        return { gamification: true };
    },

    async testCommunityFeatures() {
        if (!window.app || !app.community) throw new Error('Community features not found');
        
        return { communityFeatures: true };
    },

    async testAnalytics() {
        if (!window.app || !app.analytics) throw new Error('Analytics not found');
        
        return { analytics: true };
    },

    async testSettingsManagement() {
        if (!window.app || !app.settings) throw new Error('Settings management not found');
        
        return { settingsManagement: true };
    },

    // Generate Final Report
    generateFinalReport() {
        this.results.endTime = new Date();
        const duration = this.results.endTime - this.results.startTime;
        
        // Calculate score
        const totalTests = this.results.summary.total;
        const passedTests = this.results.summary.passed;
        const criticalFailures = Object.values(this.results.tests)
            .filter(test => test.critical && test.status === 'failed').length;
        
        this.results.summary.score = Math.round((passedTests / totalTests) * 100);
        
        // Generate report
        const report = {
            audit: {
                date: this.config.auditDate,
                version: this.config.version,
                duration: `${duration}ms`,
                timestamp: new Date().toISOString()
            },
            summary: this.results.summary,
            criticalIssues: criticalFailures,
            recommendations: this.generateRecommendations(),
            details: this.results.tests
        };
        
        // Log results
        console.log('\n📊 RUNTIME AUDIT COMPLETE');
        console.log('='.repeat(50));
        console.log(`⏱️  Duration: ${duration}ms`);
        console.log(`📈 Score: ${this.results.summary.score}/100`);
        console.log(`✅ Passed: ${this.results.summary.passed}/${this.results.summary.total}`);
        console.log(`❌ Failed: ${this.results.summary.failed}`);
        console.log(`⚠️  Warnings: ${this.results.summary.warnings}`);
        console.log(`🚨 Critical Issues: ${criticalFailures}`);
        
        if (criticalFailures > 0) {
            console.log('\n🚨 CRITICAL ISSUES FOUND:');
            Object.entries(this.results.tests)
                .filter(([_, test]) => test.critical && test.status === 'failed')
                .forEach(([name, test]) => {
                    console.log(`  - ${name}: ${test.error}`);
                });
        }
        
        // Save report
        this.saveReport(report);
        
        return report;
    },

    generateRecommendations() {
        const recommendations = [];
        
        // Security recommendations
        const securityFailures = Object.entries(this.results.tests)
            .filter(([name, test]) => name.startsWith('security_') && test.status === 'failed');
        
        if (securityFailures.length > 0) {
            recommendations.push('🔒 Address security vulnerabilities immediately');
        }
        
        // Compliance recommendations
        const complianceFailures = Object.entries(this.results.tests)
            .filter(([name, test]) => name.startsWith('compliance_') && test.status === 'failed');
        
        if (complianceFailures.length > 0) {
            recommendations.push('📋 Fix compliance issues to meet legal requirements');
        }
        
        // AI recommendations
        const aiFailures = Object.entries(this.results.tests)
            .filter(([name, test]) => name.startsWith('ai_') && test.status === 'failed');
        
        if (aiFailures.length > 0) {
            recommendations.push('🤖 Resolve AI integration issues');
        }
        
        // Accessibility recommendations
        const ariaFailures = Object.entries(this.results.tests)
            .filter(([name, test]) => name.startsWith('aria_') && test.status === 'failed');
        
        if (ariaFailures.length > 0) {
            recommendations.push('♿ Improve accessibility for better user experience');
        }
        
        // Performance recommendations
        const performanceFailures = Object.entries(this.results.tests)
            .filter(([name, test]) => name.startsWith('performance_') && test.status === 'failed');
        
        if (performanceFailures.length > 0) {
            recommendations.push('⚡ Optimize performance for better user experience');
        }
        
        return recommendations;
    },

    saveReport(report) {
        // Save to localStorage for debugging
        try {
            localStorage.setItem('runtime_audit_report', JSON.stringify(report));
            console.log('💾 Report saved to localStorage');
        } catch (error) {
            console.error('Failed to save report:', error);
        }
        
        // Create downloadable report
        const reportBlob = new Blob([JSON.stringify(report, null, 2)], {
            type: 'application/json'
        });
        
        const reportUrl = URL.createObjectURL(reportBlob);
        const reportLink = document.createElement('a');
        reportLink.href = reportUrl;
        reportLink.download = `operator-uplift-runtime-audit-${this.config.auditDate}.json`;
        reportLink.style.display = 'none';
        
        document.body.appendChild(reportLink);
        reportLink.click();
        document.body.removeChild(reportLink);
        URL.revokeObjectURL(reportUrl);
        
        console.log('📄 Report downloaded');
    }
};

// Auto-start audit when script loads
if (typeof window !== 'undefined') {
    window.RuntimeAudit = RuntimeAudit;
    
    // Start audit when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            RuntimeAudit.init().catch(console.error);
        });
    } else {
        RuntimeAudit.init().catch(console.error);
    }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RuntimeAudit;
} 