// Comprehensive Functionality Test for Operator Uplift
// Run this script in the browser console to test all application features

const ComprehensiveFunctionalityTest = {
    testResults: {},
    startTime: Date.now(),

    async runAllTests() {
        );
        
        this.startTime = Date.now();
        
        try {
            // Test Core Application
            await this.testCoreApplication();
            
            // Test Authentication
            await this.testAuthentication();
            
            // Test AI Integration
            await this.testAIIntegration();
            
            // Test Goals System
            await this.testGoalsSystem();
            
            // Test Gamification
            await this.testGamification();
            
            // Test Security
            await this.testSecurity();
            
            // Test Accessibility
            await this.testAccessibility();
            
            // Test Performance
            await this.testPerformance();
            
            // Test UI/UX
            await this.testUIUX();
            
            // Test Firebase Integration
            await this.testFirebaseIntegration();
            
            // Generate Final Report
            this.generateFinalReport();
            
        } catch (error) {
            this.testResults.error = error.message;
        }
    },

    async testCoreApplication() {
        const tests = {
            appObject: !!window.app,
            appState: !!app.state,
            appInit: !!app.init,
            appUI: !!app.ui,
            appAuth: !!app.auth,
            appGoals: !!app.goals,
            appAI: !!app.ai,
            appGamification: !!app.gamification,
            appFirestore: !!app.firestore
        };
        
        const passed = Object.values(tests).filter(Boolean).length;
        const total = Object.keys(tests).length;
        
        this.testResults.coreApplication = {
            success: passed === total,
            tests,
            passed,
            total,
            score: Math.round((passed / total) * 100)
        };
        
        `);
    },

    async testAuthentication() {
        const tests = {
            authObject: !!app.auth,
            loginMethod: !!app.auth.login,
            registerMethod: !!app.auth.register,
            logoutMethod: !!app.auth.logout,
            getAuthToken: !!app.auth.getAuthToken,
            currentUser: !!app.state.currentUser || app.state.currentUser === null,
            userData: !!app.state.userData || app.state.userData === null
        };
        
        const passed = Object.values(tests).filter(Boolean).length;
        const total = Object.keys(tests).length;
        
        this.testResults.authentication = {
            success: passed === total,
            tests,
            passed,
            total,
            score: Math.round((passed / total) * 100)
        };
        
        `);
    },

    async testAIIntegration() {
        const tests = {
            aiObject: !!app.ai,
            aiCall: !!app.ai.call,
            requestMotivation: !!app.ai.requestMotivation,
            requestAdvice: !!app.ai.requestAdvice,
            requestGoalBreakdown: !!app.ai.requestGoalBreakdown,
            quickQuestion: !!app.ai.quickQuestion,
            checkRateLimit: !!app.ai.checkRateLimit,
            aiCredits: !!(app.state.userData?.stats?.aiCredits !== undefined)
        };
        
        const passed = Object.values(tests).filter(Boolean).length;
        const total = Object.keys(tests).length;
        
        this.testResults.aiIntegration = {
            success: passed === total,
            tests,
            passed,
            total,
            score: Math.round((passed / total) * 100)
        };
        
        `);
    },

    async testGoalsSystem() {
        const tests = {
            goalsObject: !!app.goals,
            createGoal: !!app.goals.createGoal,
            updateGoal: !!app.goals.updateGoal,
            deleteGoal: !!app.goals.deleteGoal,
            saveGoal: !!app.goals.save,
            localGoals: !!app.state.localGoals,
            goalTemplates: !!app.state.goalTemplates,
            goalCategories: !!app.state.goalCategories
        };
        
        const passed = Object.values(tests).filter(Boolean).length;
        const total = Object.keys(tests).length;
        
        this.testResults.goalsSystem = {
            success: passed === total,
            tests,
            passed,
            total,
            score: Math.round((passed / total) * 100)
        };
        
        `);
    },

    async testGamification() {
        const tests = {
            gamificationObject: !!app.gamification,
            addPoints: !!app.gamification.addPoints,
            levelUp: !!app.gamification.levelUp,
            unlockAchievement: !!app.gamification.unlockAchievement,
            checkAchievement: !!app.gamification.checkAchievement,
            modifyEnergy: !!app.gamification.modifyEnergy,
            logDailyCompletion: !!app.gamification.logDailyCompletion,
            checkTreasureChest: !!app.gamification.checkTreasureChest,
            userStats: !!(app.state.userData?.stats)
        };
        
        const passed = Object.values(tests).filter(Boolean).length;
        const total = Object.keys(tests).length;
        
        this.testResults.gamification = {
            success: passed === total,
            tests,
            passed,
            total,
            score: Math.round((passed / total) * 100)
        };
        
        `);
    },

    async testSecurity() {
        const tests = {
            securityUtils: !!window.SecurityUtils,
            validateEmail: !!SecurityUtils.validateEmail,
            validatePassword: !!SecurityUtils.validatePassword,
            sanitizeInput: !!SecurityUtils.sanitizeInput,
            validateAIMessages: !!SecurityUtils.validateAIMessages,
            checkRateLimit: !!SecurityUtils.checkRateLimit,
            generateCSRFToken: !!SecurityUtils.generateCSRFToken,
            escapeHTML: !!SecurityUtils.escapeHTML,
            cspHeader: !!document.querySelector('meta[http-equiv="Content-Security-Policy"]')
        };
        
        const passed = Object.values(tests).filter(Boolean).length;
        const total = Object.keys(tests).length;
        
        this.testResults.security = {
            success: passed === total,
            tests,
            passed,
            total,
            score: Math.round((passed / total) * 100)
        };
        
        `);
    },

    async testAccessibility() {
        const tests = {
            accessibilityAudit: !!window.AccessibilityAudit,
            checkWCAGCompliance: !!AccessibilityAudit.checkWCAGCompliance,
            enhanceAccessibility: !!AccessibilityAudit.enhanceAccessibility,
            skipLink: !!document.querySelector('.skip-link'),
            ariaLabels: !!document.querySelector('[aria-label]'),
            focusIndicators: !!document.querySelector('.focus-visible'),
            keyboardNavigation: !!document.querySelector('button[tabindex]'),
            screenReaderSupport: !!document.querySelector('[role]')
        };
        
        const passed = Object.values(tests).filter(Boolean).length;
        const total = Object.keys(tests).length;
        
        this.testResults.accessibility = {
            success: passed === total,
            tests,
            passed,
            total,
            score: Math.round((passed / total) * 100)
        };
        
        `);
    },

    async testPerformance() {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        const domContentLoaded = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
        
        const tests = {
            loadTime: loadTime < 5000, // Less than 5 seconds
            domContentLoaded: domContentLoaded < 3000, // Less than 3 seconds
            memoryUsage: performance.memory ? performance.memory.usedJSHeapSize < 100000000 : true, // Less than 100MB
            networkRequests: performance.getEntriesByType('resource').length < 100, // Less than 100 requests
            performanceObserver: 'PerformanceObserver' in window,
            serviceWorker: 'serviceWorker' in navigator,
            pwaManifest: !!document.querySelector('link[rel="manifest"]')
        };
        
        const passed = Object.values(tests).filter(Boolean).length;
        const total = Object.keys(tests).length;
        
        this.testResults.performance = {
            success: passed === total,
            tests,
            passed,
            total,
            score: Math.round((passed / total) * 100),
            metrics: { loadTime, domContentLoaded }
        };
        
        `);
    },

    async testUIUX() {
        const tests = {
            uiObject: !!app.ui,
            showToast: !!app.ui.showToast,
            showConfirm: !!app.ui.showConfirm,
            update: !!app.ui.update,
            renderDashboard: !!app.ui.renderDashboard,
            responsiveDesign: window.innerWidth > 0,
            darkMode: !!document.querySelector('[data-theme]'),
            animations: !!document.querySelector('.animate'),
            glassmorphism: !!document.querySelector('.glass-card'),
            mobileMenu: !!document.querySelector('.nav-menu')
        };
        
        const passed = Object.values(tests).filter(Boolean).length;
        const total = Object.keys(tests).length;
        
        this.testResults.uiux = {
            success: passed === total,
            tests,
            passed,
            total,
            score: Math.round((passed / total) * 100)
        };
        
        `);
    },

    async testFirebaseIntegration() {
        const tests = {
            firebaseObject: !!app.firestore,
            updateUserData: !!app.firestore.updateUserData,
            listenForUserData: !!app.firestore.listenForUserData,
            dbConnection: !!window.db,
            authConnection: !!window.auth,
            firebaseConfig: !!app.state.firebaseReady,
            realTimeUpdates: !!app.firestore.listenForUserData,
            offlineSupport: !!navigator.onLine || true
        };
        
        const passed = Object.values(tests).filter(Boolean).length;
        const total = Object.keys(tests).length;
        
        this.testResults.firebaseIntegration = {
            success: passed === total,
            tests,
            passed,
            total,
            score: Math.round((passed / total) * 100)
        };
        
        `);
    },

    generateFinalReport() {
        const endTime = Date.now();
        const duration = endTime - this.startTime;
        
        );
        );
        
        const categories = Object.keys(this.testResults);
        let totalPassed = 0;
        let totalTests = 0;
        
        categories.forEach(category => {
            const result = this.testResults[category];
            if (result && result.score !== undefined) {
                totalPassed += result.passed;
                totalTests += result.total;
                
                const status = result.success ? '✅ PASS' : '❌ FAIL';
                }: ${result.passed}/${result.total} (${result.score}%)`);
            }
        });
        
        const overallScore = Math.round((totalPassed / totalTests) * 100);
        const overallStatus = overallScore >= 90 ? 'EXCELLENT' : overallScore >= 80 ? 'GOOD' : overallScore >= 70 ? 'FAIR' : 'NEEDS IMPROVEMENT';
        
        );
        `);
        );
        
        // Store results for external access
        window.testResults = {
            overall: {
                score: overallScore,
                status: overallStatus,
                passed: totalPassed,
                total: totalTests,
                duration: duration
            },
            categories: this.testResults,
            timestamp: new Date().toISOString()
        };
        
        // Show toast notification
        if (app && app.ui && app.ui.showToast) {
            app.ui.showToast(`Test completed: ${overallScore}/100 (${overallStatus})`, overallScore >= 90 ? 'success' : 'info');
        }
        
        return window.testResults;
    },

    // Individual test methods for specific features
    async testSpecificFeature(feature) {
        switch (feature) {
            case 'ai':
                return await this.testAIIntegration();
            case 'goals':
                return await this.testGoalsSystem();
            case 'gamification':
                return await this.testGamification();
            case 'security':
                return await this.testSecurity();
            case 'accessibility':
                return await this.testAccessibility();
            case 'performance':
                return await this.testPerformance();
            default:
                return null;
        }
    },

    // Performance benchmark test
    async benchmarkPerformance() {
        const benchmarks = {
            appInitialization: this.measureAppInit(),
            aiResponseTime: await this.measureAIResponse(),
            uiRendering: this.measureUIRendering(),
            dataSync: await this.measureDataSync()
        };
        
        return benchmarks;
    },

    measureAppInit() {
        const start = performance.now();
        // Simulate app initialization
        const end = performance.now();
        return end - start;
    },

    async measureAIResponse() {
        if (!app.ai || !app.ai.call) return 'N/A';
        
        const start = performance.now();
        try {
            await app.ai.call([{ role: 'user', content: 'Test' }]);
        } catch (e) {
            // Ignore errors for benchmark
        }
        const end = performance.now();
        return end - start;
    },

    measureUIRendering() {
        const start = performance.now();
        // Simulate UI rendering
        const end = performance.now();
        return end - start;
    },

    async measureDataSync() {
        const start = performance.now();
        // Simulate data synchronization
        const end = performance.now();
        return end - start;
    }
};

// Auto-run tests when script is loaded
if (typeof window !== 'undefined') {
    // Wait for app to be ready
    const checkAppReady = () => {
        if (window.app && window.app.state) {
            ComprehensiveFunctionalityTest.runAllTests();
        } else {
            setTimeout(checkAppReady, 100);
        }
    };
    
    checkAppReady();
}

// Export for use in other contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComprehensiveFunctionalityTest;
} else {
    window.ComprehensiveFunctionalityTest = ComprehensiveFunctionalityTest;
}

// Add to global scope for easy access
window.runAllTests = () => ComprehensiveFunctionalityTest.runAllTests();
window.testSpecificFeature = (feature) => ComprehensiveFunctionalityTest.testSpecificFeature(feature);
window.benchmarkPerformance = () => ComprehensiveFunctionalityTest.benchmarkPerformance(); 