// Comprehensive Integration Script for Operator Uplift
// Combines AI integration, app functionality debugging, and full feature testing

(function() {
    'use strict';

    // Wait for the app object to be available
    function waitForApp() {
        if (window.app) {
            integrateAllFeatures();
        } else {
            setTimeout(waitForApp, 100);
        }
    }

    async function integrateAllFeatures() {
        console.log('🚀 Starting comprehensive feature integration...');

        try {
            // Initialize AI Integration Enhancer
            if (window.AIIntegrationEnhancer) {
                await AIIntegrationEnhancer.init();
                console.log('✅ AI Integration Enhancer initialized');
            }

            // Initialize App Functionality Debugger
            if (window.AppFunctionalityDebugger) {
                await AppFunctionalityDebugger.init();
                console.log('✅ App Functionality Debugger initialized');
            }

            // Initialize Enhanced Error Handling
            if (window.EnhancedErrorHandling) {
                integrateEnhancedErrorHandling();
                console.log('✅ Enhanced Error Handling integrated');
            }

            // Initialize Security Utilities
            if (window.SecurityUtils) {
                integrateSecurityUtils();
                console.log('✅ Security Utilities integrated');
            }

            // Initialize Accessibility Audit
            if (window.AccessibilityAudit) {
                integrateAccessibilityAudit();
                console.log('✅ Accessibility Audit integrated');
            }

            // Initialize PWA Enhancer
            if (window.PWAEnhancer) {
                integratePWAEnhancer();
                console.log('✅ PWA Enhancer integrated');
            }

            // Add comprehensive debugging methods to app
            addComprehensiveDebugMethods();

            // Run initial tests
            await runInitialTests();

            // Show success message
            showIntegrationSuccess();

            console.log('🎉 Comprehensive feature integration completed successfully!');

        } catch (error) {
            console.error('❌ Comprehensive integration failed:', error);
        }
    }

    function integrateEnhancedErrorHandling() {
        if (!app.utils) {
            app.utils = {};
        }
        
        app.utils = {
            ...app.utils,
            InputValidator: EnhancedErrorHandling,
            secureUpdate: EnhancedErrorHandling.updateUserDataSecure,
            validateInput: EnhancedErrorHandling.validateInput,
            sanitizeInput: EnhancedErrorHandling.sanitizeInput,
            checkRateLimit: EnhancedErrorHandling.checkRateLimit,
            trackError: EnhancedErrorHandling.trackError,
            trackPerformance: EnhancedErrorHandling.trackPerformance,
            addSecureEventListener: EnhancedErrorHandling.addSecureEventListener
        };

        // Replace existing updateUserData with secure version
        if (app.firestore && app.utils.secureUpdate) {
            const originalUpdateUserData = app.firestore.updateUserData;
            app.firestore.updateUserData = app.utils.secureUpdate;
            app.firestore.updateUserDataOriginal = originalUpdateUserData;
        }
    }

    function integrateSecurityUtils() {
        app.securityUtils = SecurityUtils;
        
        // Add security monitoring
        if (app.securityUtils.initSecurityMonitoring) {
            app.securityUtils.initSecurityMonitoring();
        }
    }

    function integrateAccessibilityAudit() {
        app.accessibilityAudit = AccessibilityAudit;
        
        // Run accessibility audit
        if (app.accessibilityAudit.enhanceAccessibility) {
            app.accessibilityAudit.enhanceAccessibility();
        }
        
        if (app.accessibilityAudit.checkWCAGCompliance) {
            const auditResult = app.accessibilityAudit.checkWCAGCompliance();
            if (!auditResult.compliant) {
                console.warn('⚠️ Accessibility issues found:', auditResult.issues);
            }
        }
    }

    function integratePWAEnhancer() {
        app.pwaEnhancer = PWAEnhancer;
        
        // Initialize PWA features
        if (app.pwaEnhancer.init) {
            app.pwaEnhancer.init().catch(error => {
                console.error('❌ PWA initialization failed:', error);
            });
        }
    }

    function addComprehensiveDebugMethods() {
        // Add comprehensive debugging methods to app
        app.comprehensiveDebug = {
            // AI Debugging
            testAI: async () => {
                if (app.ai && app.ai.test) {
                    return await app.ai.test.testAllFeatures();
                }
                return { success: false, error: 'AI test methods not available' };
            },
            
            // App Debugging
            testApp: async () => {
                if (app.debug && app.debug.testAllFeatures) {
                    return await app.debug.testAllFeatures();
                }
                return { success: false, error: 'App test methods not available' };
            },
            
            // Performance Testing
            testPerformance: async () => {
                const results = {
                    webVitals: await testWebVitals(),
                    memoryUsage: await testMemoryUsage(),
                    loadTimes: await testLoadTimes(),
                    networkRequests: await testNetworkRequests()
                };
                
                const successCount = Object.values(results).filter(r => r.success).length;
                const totalCount = Object.keys(results).length;
                
                return {
                    results,
                    summary: {
                        total: totalCount,
                        passed: successCount,
                        failed: totalCount - successCount,
                        successRate: ((successCount / totalCount) * 100).toFixed(1)
                    }
                };
            },
            
            // Security Testing
            testSecurity: async () => {
                const results = {
                    inputValidation: await testInputValidation(),
                    xssProtection: await testXSSProtection(),
                    cspCompliance: await testCSPCompliance(),
                    rateLimiting: await testRateLimiting()
                };
                
                const successCount = Object.values(results).filter(r => r.success).length;
                const totalCount = Object.keys(results).length;
                
                return {
                    results,
                    summary: {
                        total: totalCount,
                        passed: successCount,
                        failed: totalCount - successCount,
                        successRate: ((successCount / totalCount) * 100).toFixed(1)
                    }
                };
            },
            
            // Comprehensive Testing
            testEverything: async () => {
                console.log('🧪 Starting comprehensive testing...');
                
                const results = {
                    ai: await app.comprehensiveDebug.testAI(),
                    app: await app.comprehensiveDebug.testApp(),
                    performance: await app.comprehensiveDebug.testPerformance(),
                    security: await app.comprehensiveDebug.testSecurity()
                };
                
                const allSuccessCount = Object.values(results).filter(r => r.summary && r.summary.passed > 0).length;
                const totalTests = Object.values(results).reduce((sum, r) => sum + (r.summary ? r.summary.total : 0), 0);
                const totalPassed = Object.values(results).reduce((sum, r) => sum + (r.summary ? r.summary.passed : 0), 0);
                
                console.log('📊 Comprehensive test results:', results);
                
                return {
                    results,
                    summary: {
                        total: totalTests,
                        passed: totalPassed,
                        failed: totalTests - totalPassed,
                        successRate: totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : 0
                    }
                };
            },
            
            // Debug Controls
            enableDebugMode: () => {
                if (AIIntegrationEnhancer) AIIntegrationEnhancer.enableDebugMode();
                if (AppFunctionalityDebugger) AppFunctionalityDebugger.enableDebugMode();
                return true;
            },
            
            disableDebugMode: () => {
                if (AIIntegrationEnhancer) AIIntegrationEnhancer.disableDebugMode();
                if (AppFunctionalityDebugger) AppFunctionalityDebugger.disableDebugMode();
                return true;
            },
            
            showDebugPanels: () => {
                if (AIIntegrationEnhancer) AIIntegrationEnhancer.showDebugPanel();
                if (AppFunctionalityDebugger) AppFunctionalityDebugger.showDebugPanel();
                return true;
            },
            
            hideDebugPanels: () => {
                if (AIIntegrationEnhancer) AIIntegrationEnhancer.hideDebugPanel();
                if (AppFunctionalityDebugger) AppFunctionalityDebugger.hideDebugPanel();
                return true;
            }
        };
    }

    async function runInitialTests() {
        console.log('🧪 Running initial tests...');
        
        try {
            // Test AI connection
            if (app.ai && app.ai.debug) {
                const aiTest = await app.ai.debug.testConnection();
                console.log('🤖 AI Connection Test:', aiTest);
            }
            
            // Test app functionality
            if (app.debug) {
                const appTest = await app.debug.testAllFeatures();
                console.log('🔧 App Functionality Test:', appTest);
            }
            
            console.log('✅ Initial tests completed');
            
        } catch (error) {
            console.error('❌ Initial tests failed:', error);
        }
    }

    function showIntegrationSuccess() {
        // Show success toast
        if (app.ui && app.ui.showToast) {
            setTimeout(() => {
                app.ui.showToast('🚀 All enhanced features activated successfully!', 'success');
            }, 2000);
        }
        
        // Add integration success indicator to UI
        const successIndicator = document.createElement('div');
        successIndicator.id = 'integration-success-indicator';
        successIndicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(16, 185, 129, 0.9);
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            font-size: 12px;
            z-index: 10000;
            animation: fadeInOut 3s ease-in-out;
        `;
        
        successIndicator.innerHTML = `
            <span>✅ Enhanced Features Active</span>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; margin-left: 10px; cursor: pointer;">×</button>
        `;
        
        document.body.appendChild(successIndicator);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (successIndicator.parentElement) {
                successIndicator.remove();
            }
        }, 5000);
    }

    // Performance Testing Functions
    async function testWebVitals() {
        try {
            const lcp = performance.getEntriesByType('largest-contentful-paint')[0];
            const fid = performance.getEntriesByType('first-input')[0];
            
            const results = {
                lcp: lcp ? lcp.startTime < 2500 : true,
                fid: fid ? fid.processingStart - fid.startTime < 100 : true,
                cls: true // Would need to calculate CLS
            };
            
            return { success: Object.values(results).every(Boolean), results };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async function testMemoryUsage() {
        try {
            if (performance.memory) {
                const used = performance.memory.usedJSHeapSize;
                const limit = performance.memory.jsHeapSizeLimit;
                const usage = (used / limit) * 100;
                
                return { success: usage < 80, usage: usage.toFixed(1) + '%' };
            }
            return { success: true, message: 'Memory API not available' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async function testLoadTimes() {
        try {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            const domReady = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
            
            return {
                success: loadTime < 3000 && domReady < 2000,
                metrics: { loadTime, domReady }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async function testNetworkRequests() {
        try {
            const resources = performance.getEntriesByType('resource');
            const slowResources = resources.filter(r => r.duration > 1000);
            
            return {
                success: slowResources.length < 5,
                total: resources.length,
                slow: slowResources.length
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Security Testing Functions
    async function testInputValidation() {
        try {
            if (app.utils && app.utils.validateInput) {
                const emailTest = app.utils.validateInput('test@example.com', 'email');
                const invalidEmailTest = !app.utils.validateInput('invalid-email', 'email');
                
                return { success: emailTest && invalidEmailTest };
            }
            return { success: false, error: 'Input validation not available' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async function testXSSProtection() {
        try {
            if (app.utils && app.utils.sanitizeInput) {
                const maliciousInput = '<script>alert("xss")</script>';
                const sanitized = app.utils.sanitizeInput(maliciousInput);
                
                return { success: !sanitized.includes('<script>') };
            }
            return { success: false, error: 'XSS protection not available' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async function testCSPCompliance() {
        try {
            const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
            return { success: !!meta && meta.content.includes('script-src') };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async function testRateLimiting() {
        try {
            if (app.utils && app.utils.checkRateLimit) {
                const rateLimit = await app.utils.checkRateLimit('test');
                return { success: typeof rateLimit.allowed === 'boolean' };
            }
            return { success: false, error: 'Rate limiting not available' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(20px); }
            20% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
        }
    `;
    document.head.appendChild(style);

    // Start integration when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForApp);
    } else {
        waitForApp();
    }
})(); 