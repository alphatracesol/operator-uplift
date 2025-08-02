// AI Integration Enhancer for Operator Uplift
// Comprehensive AI feature integration, debugging, and functionality testing

const AIIntegrationEnhancer = {
    // Debug mode flag
    debugMode: false,
    
    // Performance tracking
    performanceMetrics: {
        aiCallTimes: [],
        errorRates: {},
        successRates: {},
        responseTimes: []
    },

    // Initialize AI Integration Enhancer
    async init() {
        console.log('🤖 Initializing AI Integration Enhancer...');
        
        // Enable debug mode if in development
        this.debugMode = window.location.hostname === 'localhost' || window.location.hostname.includes('dev');
        
        // Initialize AI features
        await this.initializeAIFeatures();
        
        // Set up monitoring
        this.setupMonitoring();
        
        // Initialize debugging tools
        this.initializeDebugTools();
        
        console.log('✅ AI Integration Enhancer initialized successfully');
    },

    // Initialize AI Features
    async initializeAIFeatures() {
        try {
            // Enhanced AI call with debugging
            if (app.ai && app.ai.call) {
                const originalCall = app.ai.call;
                app.ai.call = async (messages) => {
                    return await this.enhancedAICall(originalCall, messages);
                };
            }

            // Add AI debugging methods
            app.ai.debug = {
                testConnection: () => this.testAIConnection(),
                validateMessages: (messages) => this.validateMessages(messages),
                checkRateLimit: () => this.checkRateLimit(),
                getPerformanceMetrics: () => this.getPerformanceMetrics(),
                resetMetrics: () => this.resetMetrics(),
                enableDebugMode: () => this.enableDebugMode(),
                disableDebugMode: () => this.disableDebugMode()
            };

            // Add AI feature testing
            app.ai.test = {
                testMotivation: () => this.testMotivation(),
                testAdvice: () => this.testAdvice(),
                testGoalBreakdown: () => this.testGoalBreakdown(),
                testQuickQuestion: () => this.testQuickQuestion(),
                testAllFeatures: () => this.testAllFeatures()
            };

            console.log('✅ AI features enhanced with debugging capabilities');
        } catch (error) {
            console.error('❌ Failed to initialize AI features:', error);
        }
    },

    // Enhanced AI Call with Debugging
    async enhancedAICall(originalCall, messages) {
        const startTime = Date.now();
        const callId = this.generateCallId();
        
        try {
            // Pre-call validation
            this.logDebug(`🤖 AI Call ${callId} - Starting`, { messages });
            
            // Validate messages
            if (!this.validateMessages(messages)) {
                throw new Error('Invalid message format');
            }

            // Check rate limit
            const rateLimit = await this.checkRateLimit();
            if (!rateLimit.allowed) {
                throw new Error(`Rate limit exceeded. Please wait ${rateLimit.waitTime} seconds.`);
            }

            // Make the actual call
            const response = await originalCall.call(app.ai, messages);
            
            // Post-call processing
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            // Track performance
            this.trackPerformance(callId, duration, true);
            
            this.logDebug(`✅ AI Call ${callId} - Success`, { 
                duration: `${duration}ms`, 
                responseLength: response.length 
            });
            
            return response;
            
        } catch (error) {
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            // Track error
            this.trackError(callId, error, duration);
            
            this.logDebug(`❌ AI Call ${callId} - Failed`, { 
                error: error.message, 
                duration: `${duration}ms` 
            });
            
            throw error;
        }
    },

    // Test AI Connection
    async testAIConnection() {
        try {
            this.logDebug('🔍 Testing AI connection...');
            
            const testMessages = [
                { role: 'system', content: 'You are a test assistant. Respond with "Connection successful" if you receive this message.' },
                { role: 'user', content: 'Test connection' }
            ];
            
            const response = await app.ai.call(testMessages);
            
            this.logDebug('✅ AI connection test successful', { response });
            return { success: true, response };
            
        } catch (error) {
            this.logDebug('❌ AI connection test failed', { error: error.message });
            return { success: false, error: error.message };
        }
    },

    // Validate Messages
    validateMessages(messages) {
        if (!Array.isArray(messages)) {
            this.logDebug('❌ Messages validation failed: Not an array');
            return false;
        }
        
        if (messages.length === 0) {
            this.logDebug('❌ Messages validation failed: Empty array');
            return false;
        }
        
        const validRoles = ['system', 'user', 'assistant'];
        
        for (let i = 0; i < messages.length; i++) {
            const msg = messages[i];
            
            if (!msg.role || !validRoles.includes(msg.role)) {
                this.logDebug(`❌ Messages validation failed: Invalid role at index ${i}`, { role: msg.role });
                return false;
            }
            
            if (!msg.content || typeof msg.content !== 'string') {
                this.logDebug(`❌ Messages validation failed: Invalid content at index ${i}`, { content: msg.content });
                return false;
            }
            
            if (msg.content.length > 10000) {
                this.logDebug(`❌ Messages validation failed: Content too long at index ${i}`, { length: msg.content.length });
                return false;
            }
        }
        
        this.logDebug('✅ Messages validation passed');
        return true;
    },

    // Check Rate Limit
    async checkRateLimit() {
        try {
            if (app.ai.checkRateLimit) {
                return await app.ai.checkRateLimit();
            }
            return { allowed: true };
        } catch (error) {
            this.logDebug('❌ Rate limit check failed', { error: error.message });
            return { allowed: true }; // Allow on error
        }
    },

    // Test AI Features
    async testMotivation() {
        try {
            this.logDebug('🧪 Testing motivation feature...');
            await app.ai.requestMotivation();
            this.logDebug('✅ Motivation test completed');
            return { success: true };
        } catch (error) {
            this.logDebug('❌ Motivation test failed', { error: error.message });
            return { success: false, error: error.message };
        }
    },

    async testAdvice() {
        try {
            this.logDebug('🧪 Testing advice feature...');
            await app.ai.requestAdvice();
            this.logDebug('✅ Advice test completed');
            return { success: true };
        } catch (error) {
            this.logDebug('❌ Advice test failed', { error: error.message });
            return { success: false, error: error.message };
        }
    },

    async testGoalBreakdown() {
        try {
            this.logDebug('🧪 Testing goal breakdown feature...');
            await app.ai.requestGoalBreakdown();
            this.logDebug('✅ Goal breakdown test completed');
            return { success: true };
        } catch (error) {
            this.logDebug('❌ Goal breakdown test failed', { error: error.message });
            return { success: false, error: error.message };
        }
    },

    async testQuickQuestion() {
        try {
            this.logDebug('🧪 Testing quick question feature...');
            await app.ai.quickQuestion('motivation');
            this.logDebug('✅ Quick question test completed');
            return { success: true };
        } catch (error) {
            this.logDebug('❌ Quick question test failed', { error: error.message });
            return { success: false, error: error.message };
        }
    },

    async testAllFeatures() {
        this.logDebug('🧪 Starting comprehensive AI feature test...');
        
        const results = {
            connection: await this.testAIConnection(),
            motivation: await this.testMotivation(),
            advice: await this.testAdvice(),
            goalBreakdown: await this.testGoalBreakdown(),
            quickQuestion: await this.testQuickQuestion()
        };
        
        const successCount = Object.values(results).filter(r => r.success).length;
        const totalCount = Object.keys(results).length;
        
        this.logDebug(`📊 AI Feature Test Results: ${successCount}/${totalCount} passed`, results);
        
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

    // Performance Tracking
    trackPerformance(callId, duration, success) {
        this.performanceMetrics.aiCallTimes.push(duration);
        this.performanceMetrics.responseTimes.push(duration);
        
        if (success) {
            this.performanceMetrics.successRates[callId] = true;
        } else {
            this.performanceMetrics.errorRates[callId] = true;
        }
        
        // Keep only last 100 entries
        if (this.performanceMetrics.aiCallTimes.length > 100) {
            this.performanceMetrics.aiCallTimes.shift();
        }
        if (this.performanceMetrics.responseTimes.length > 100) {
            this.performanceMetrics.responseTimes.shift();
        }
    },

    trackError(callId, error, duration) {
        this.performanceMetrics.errorRates[callId] = {
            error: error.message,
            duration: duration,
            timestamp: new Date().toISOString()
        };
    },

    getPerformanceMetrics() {
        const avgResponseTime = this.performanceMetrics.responseTimes.length > 0 
            ? this.performanceMetrics.responseTimes.reduce((a, b) => a + b, 0) / this.performanceMetrics.responseTimes.length 
            : 0;
        
        const successCount = Object.keys(this.performanceMetrics.successRates).length;
        const errorCount = Object.keys(this.performanceMetrics.errorRates).length;
        const totalCalls = successCount + errorCount;
        const successRate = totalCalls > 0 ? (successCount / totalCalls) * 100 : 0;
        
        return {
            averageResponseTime: Math.round(avgResponseTime),
            totalCalls: totalCalls,
            successCount: successCount,
            errorCount: errorCount,
            successRate: Math.round(successRate * 100) / 100,
            recentCalls: this.performanceMetrics.aiCallTimes.slice(-10)
        };
    },

    resetMetrics() {
        this.performanceMetrics = {
            aiCallTimes: [],
            errorRates: {},
            successRates: {},
            responseTimes: []
        };
        this.logDebug('📊 Performance metrics reset');
    },

    // Debug Tools
    enableDebugMode() {
        this.debugMode = true;
        this.logDebug('🔧 Debug mode enabled');
        return true;
    },

    disableDebugMode() {
        this.debugMode = false;
        console.log('🔧 Debug mode disabled');
        return true;
    },

    logDebug(message, data = null) {
        if (this.debugMode) {
            if (data) {
                console.log(`[AI Debug] ${message}`, data);
            } else {
                console.log(`[AI Debug] ${message}`);
            }
        }
    },

    // Setup Monitoring
    setupMonitoring() {
        // Monitor AI calls
        setInterval(() => {
            const metrics = this.getPerformanceMetrics();
            if (metrics.errorCount > 0) {
                this.logDebug('⚠️ AI errors detected', { errorCount: metrics.errorCount });
            }
        }, 60000); // Check every minute
    },

    // Initialize Debug Tools
    initializeDebugTools() {
        // Add debug panel to UI if in debug mode
        if (this.debugMode) {
            this.createDebugPanel();
        }
    },

    createDebugPanel() {
        const debugPanel = document.createElement('div');
        debugPanel.id = 'ai-debug-panel';
        debugPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            max-width: 300px;
            max-height: 400px;
            overflow-y: auto;
        `;
        
        debugPanel.innerHTML = `
            <h4 style="margin: 0 0 10px 0; color: #f97316;">🤖 AI Debug Panel</h4>
            <div id="ai-debug-content"></div>
            <div style="margin-top: 10px;">
                <button onclick="AIIntegrationEnhancer.testAllFeatures()" style="background: #f97316; color: black; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 11px;">Test All</button>
                <button onclick="AIIntegrationEnhancer.resetMetrics()" style="background: #ef4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 11px; margin-left: 5px;">Reset</button>
            </div>
        `;
        
        document.body.appendChild(debugPanel);
        
        // Update debug panel every 5 seconds
        setInterval(() => {
            this.updateDebugPanel();
        }, 5000);
    },

    updateDebugPanel() {
        const debugContent = document.getElementById('ai-debug-content');
        if (debugContent) {
            const metrics = this.getPerformanceMetrics();
            debugContent.innerHTML = `
                <div>📊 Calls: ${metrics.totalCalls}</div>
                <div>✅ Success: ${metrics.successCount}</div>
                <div>❌ Errors: ${metrics.errorCount}</div>
                <div>📈 Success Rate: ${metrics.successRate}%</div>
                <div>⏱️ Avg Response: ${metrics.averageResponseTime}ms</div>
            `;
        }
    },

    // Utility Functions
    generateCallId() {
        return `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIIntegrationEnhancer;
} else {
    window.AIIntegrationEnhancer = AIIntegrationEnhancer;
} 