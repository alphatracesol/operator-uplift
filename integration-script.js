// Comprehensive Integration Script for Operator Uplift
// This script integrates all enhanced security, error handling, and performance features

(function() {
    'use strict';

    // Wait for the app object to be available
    function waitForApp() {
        if (window.app) {
            integrateEnhancedFeatures();
        } else {
            setTimeout(waitForApp, 100);
        }
    }

    function integrateEnhancedFeatures() {
        console.log('Integrating enhanced features...');

        // Add enhanced error handling
        if (window.EnhancedErrorHandling) {
            app.enhancedErrorHandling = EnhancedErrorHandling;
            
            // Add to utils
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
        }

        // Add security utilities
        if (window.SecurityUtils) {
            app.securityUtils = SecurityUtils;
        }

        // Add accessibility audit
        if (window.AccessibilityAudit) {
            app.accessibilityAudit = AccessibilityAudit;
        }

        // Add PWA enhancer
        if (window.PWAEnhancer) {
            app.pwaEnhancer = PWAEnhancer;
        }

        // Replace existing updateUserData with secure version
        if (app.firestore && app.utils.secureUpdate) {
            const originalUpdateUserData = app.firestore.updateUserData;
            app.firestore.updateUserData = app.utils.secureUpdate;
            app.firestore.updateUserDataOriginal = originalUpdateUserData; // Keep original for fallback
        }

        // Add enhanced event listener handling
        if (app.eventListeners && app.utils.addSecureEventListener) {
            const originalInit = app.eventListeners.init;
            app.eventListeners.init = function() {
                // Call original init
                originalInit.call(this);
                
                // Add secure event listeners for critical operations
                this.addSecureEventListeners();
            };

            app.eventListeners.addSecureEventListeners = function() {
                // Add secure event listeners for AI chat
                const aiChatSend = document.getElementById('ai-chat-send');
                if (aiChatSend && app.utils.addSecureEventListener) {
                    app.utils.addSecureEventListener(aiChatSend, 'click', async () => {
                        const input = document.getElementById('ai-chat-input');
                        const message = input.value.trim();
                        if (!message) return;
                        
                        // Validate input
                        if (!app.utils.validateInput(message, 'goalDescription')) {
                            app.ui.showToast('Invalid message format', 'error');
                            return;
                        }
                        
                        // Check rate limit
                        const rateLimit = await app.utils.checkRateLimit('ai');
                        if (!rateLimit.allowed) {
                            app.ui.showToast(`Rate limit exceeded. Please wait ${rateLimit.waitTime} seconds.`, 'warning');
                            return;
                        }
                        
                        app.ui.addChatMessage('user', message);
                        input.value = '';
                        
                        try {
                            const response = await app.ai.call([
                                { role: 'system', content: 'You are a helpful AI mentor. Provide concise, helpful responses.' },
                                { role: 'user', content: message }
                            ]);
                            app.ui.addChatMessage('assistant', response);
                        } catch (error) {
                            app.utils.trackError(error, { context: 'ai_chat' });
                            app.ui.addChatMessage('assistant', 'Sorry, I\'m unable to respond right now. Please try again later.');
                            app.ui.showToast('AI service temporarily unavailable', 'warning');
                        }
                    });
                }

                // Add secure event listeners for goal creation
                const goalForm = document.getElementById('goal-form');
                if (goalForm && app.utils.addSecureEventListener) {
                    app.utils.addSecureEventListener(goalForm, 'submit', async (e) => {
                        e.preventDefault();
                        
                        const formData = new FormData(goalForm);
                        const title = formData.get('title');
                        const description = formData.get('description');
                        
                        // Validate inputs
                        if (!app.utils.validateInput(title, 'goalTitle')) {
                            app.ui.showToast('Invalid goal title', 'error');
                            return;
                        }
                        
                        if (!app.utils.validateInput(description, 'goalDescription')) {
                            app.ui.showToast('Invalid goal description', 'error');
                            return;
                        }
                        
                        // Sanitize inputs
                        const sanitizedTitle = app.utils.sanitizeInput(title);
                        const sanitizedDescription = app.utils.sanitizeInput(description);
                        
                        // Create goal with sanitized data
                        try {
                            await app.goals.createGoal({
                                title: sanitizedTitle,
                                description: sanitizedDescription,
                                category: formData.get('category')
                            });
                        } catch (error) {
                            app.utils.trackError(error, { context: 'goal_creation' });
                            app.ui.showToast('Failed to create goal', 'error');
                        }
                    });
                }
            };
        }

        // Add performance monitoring
        if (app.utils.trackPerformance) {
            // Monitor app initialization
            const initStartTime = Date.now();
            const originalInit = app.init;
            app.init = async function() {
                try {
                    await originalInit.call(this);
                    app.utils.trackPerformance('app_initialization', initStartTime);
                } catch (error) {
                    app.utils.trackError(error, { context: 'app_initialization' });
                    throw error;
                }
            };
        }

        // Add error tracking to global error handlers
        if (app.utils.trackError) {
            window.addEventListener('error', (e) => {
                app.utils.trackError(e.error, { type: 'runtime', url: e.filename, line: e.lineno });
            });
            
            window.addEventListener('unhandledrejection', (e) => {
                app.utils.trackError(e.reason, { type: 'promise' });
            });
        }

        // Initialize enhanced features
        initializeEnhancedFeatures();
        
        console.log('Enhanced features integrated successfully');
    }

    function initializeEnhancedFeatures() {
        // Initialize accessibility audit
        if (app.accessibilityAudit) {
            app.accessibilityAudit.enhanceAccessibility();
            const auditResult = app.accessibilityAudit.checkWCAGCompliance();
            if (!auditResult.compliant) {
                console.warn('Accessibility issues found:', auditResult.issues);
            }
        }

        // Initialize PWA features
        if (app.pwaEnhancer) {
            app.pwaEnhancer.init().catch(error => {
                console.error('PWA initialization failed:', error);
            });
        }

        // Initialize security monitoring
        if (app.securityUtils) {
            console.log('Security utilities initialized');
        }
    }

    // Start integration when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForApp);
    } else {
        waitForApp();
    }
})(); 