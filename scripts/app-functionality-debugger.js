// App Functionality Debugger for Operator Uplift
// Comprehensive app feature testing, debugging, and functionality enhancement

const AppFunctionalityDebugger = {
    // Debug mode flag
    debugMode: false,
    
    // Test results storage
    testResults: {
        authentication: {},
        goals: {},
        habits: {},
        focus: {},
        analytics: {},
        community: {},
        gamification: {},
        ui: {},
        firebase: {},
        performance: {}
    },

    // Initialize App Functionality Debugger
    async init() {
        // Enable debug mode if in development
        this.debugMode = window.location.hostname === 'localhost' || window.location.hostname.includes('dev');
        
        // Initialize debugging tools
        this.initializeDebugTools();
        
        // Set up monitoring
        this.setupMonitoring();
        
        // Add debug methods to app object
        this.addDebugMethods();
        
        },

    // Add Debug Methods to App Object
    addDebugMethods() {
        if (!app.debug) {
            app.debug = {};
        }
        
        app.debug = {
            ...app.debug,
            testAllFeatures: () => this.testAllFeatures(),
            testAuthentication: () => this.testAuthentication(),
            testGoals: () => this.testGoals(),
            testHabits: () => this.testHabits(),
            testFocus: () => this.testFocus(),
            testAnalytics: () => this.testAnalytics(),
            testCommunity: () => this.testCommunity(),
            testGamification: () => this.testGamification(),
            testUI: () => this.testUI(),
            testFirebase: () => this.testFirebase(),
            testPerformance: () => this.testPerformance(),
            getTestResults: () => this.getTestResults(),
            resetTestResults: () => this.resetTestResults(),
            enableDebugMode: () => this.enableDebugMode(),
            disableDebugMode: () => this.disableDebugMode(),
            showDebugPanel: () => this.showDebugPanel(),
            hideDebugPanel: () => this.hideDebugPanel()
        };
    },

    // Test All Features
    async testAllFeatures() {
        this.logDebug('🧪 Starting comprehensive app feature test...');
        
        const results = {
            authentication: await this.testAuthentication(),
            goals: await this.testGoals(),
            habits: await this.testHabits(),
            focus: await this.testFocus(),
            analytics: await this.testAnalytics(),
            community: await this.testCommunity(),
            gamification: await this.testGamification(),
            ui: await this.testUI(),
            firebase: await this.testFirebase(),
            performance: await this.testPerformance()
        };
        
        this.testResults = results;
        
        const successCount = Object.values(results).filter(r => r.success).length;
        const totalCount = Object.keys(results).length;
        
        this.logDebug(`📊 App Feature Test Results: ${successCount}/${totalCount} passed`, results);
        
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

    // Test Authentication
    async testAuthentication() {
        try {
            this.logDebug('🔐 Testing authentication...');
            
            const tests = {
                userLoaded: !!app.state.currentUser,
                userDataLoaded: !!app.state.userData,
                authMethods: !!app.auth,
                logoutMethod: !!app.auth.logout,
                getAuthToken: !!app.auth.getAuthToken
            };
            
            const allPassed = Object.values(tests).every(Boolean);
            
            this.logDebug('✅ Authentication test completed', { tests, allPassed });
            return { success: allPassed, tests };
            
        } catch (error) {
            this.logDebug('❌ Authentication test failed', { error: error.message });
            return { success: false, error: error.message };
        }
    },

    // Test Goals
    async testGoals() {
        try {
            this.logDebug('🎯 Testing goals system...');
            
            const tests = {
                goalsObject: !!app.goals,
                createGoal: !!app.goals.createGoal,
                updateGoal: !!app.goals.updateGoal,
                deleteGoal: !!app.goals.deleteGoal,
                localGoals: !!app.state.localGoals,
                goalsUI: !!document.getElementById('goal-list')
            };
            
            const allPassed = Object.values(tests).every(Boolean);
            
            this.logDebug('✅ Goals test completed', { tests, allPassed });
            return { success: allPassed, tests };
            
        } catch (error) {
            this.logDebug('❌ Goals test failed', { error: error.message });
            return { success: false, error: error.message };
        }
    },

    // Test Habits
    async testHabits() {
        try {
            this.logDebug('🔄 Testing habits system...');
            
            const tests = {
                habitsObject: !!app.habits,
                addHabit: !!app.habits.addHabit,
                completeHabit: !!app.habits.completeHabit,
                renderHabits: !!app.habits.renderHabits,
                habitsData: !!app.state.userData?.habits,
                habitsUI: !!document.getElementById('habits-view')
            };
            
            const allPassed = Object.values(tests).every(Boolean);
            
            this.logDebug('✅ Habits test completed', { tests, allPassed });
            return { success: allPassed, tests };
            
        } catch (error) {
            this.logDebug('❌ Habits test failed', { error: error.message });
            return { success: false, error: error.message };
        }
    },

    // Test Focus
    async testFocus() {
        try {
            this.logDebug('🎯 Testing focus system...');
            
            const tests = {
                focusObject: !!app.focus,
                startSession: !!app.focus.startSession,
                endSession: !!app.focus.endSession,
                focusSessions: !!app.state.userData?.focusSessions,
                focusUI: !!document.getElementById('focus-view')
            };
            
            const allPassed = Object.values(tests).every(Boolean);
            
            this.logDebug('✅ Focus test completed', { tests, allPassed });
            return { success: allPassed, tests };
            
        } catch (error) {
            this.logDebug('❌ Focus test failed', { error: error.message });
            return { success: false, error: error.message };
        }
    },

    // Test Analytics
    async testAnalytics() {
        try {
            this.logDebug('📊 Testing analytics system...');
            
            const tests = {
                analyticsObject: !!app.analytics,
                trackEvent: !!app.analytics.trackEvent,
                trackGoal: !!app.analytics.trackGoal,
                analyticsData: !!app.state.userData?.stats,
                analyticsUI: !!document.getElementById('analytics-view')
            };
            
            const allPassed = Object.values(tests).every(Boolean);
            
            this.logDebug('✅ Analytics test completed', { tests, allPassed });
            return { success: allPassed, tests };
            
        } catch (error) {
            this.logDebug('❌ Analytics test failed', { error: error.message });
            return { success: false, error: error.message };
        }
    },

    // Test Community
    async testCommunity() {
        try {
            this.logDebug('👥 Testing community system...');
            
            const tests = {
                communityObject: !!app.community,
                joinChallenge: !!app.community.joinChallenge,
                shareProgress: !!app.community.shareProgress,
                communityData: !!app.state.userData?.friends,
                communityUI: !!document.getElementById('community-view')
            };
            
            const allPassed = Object.values(tests).every(Boolean);
            
            this.logDebug('✅ Community test completed', { tests, allPassed });
            return { success: allPassed, tests };
            
        } catch (error) {
            this.logDebug('❌ Community test failed', { error: error.message });
            return { success: false, error: error.message };
        }
    },

    // Test Gamification
    async testGamification() {
        try {
            this.logDebug('🎮 Testing gamification system...');
            
            const tests = {
                gamificationObject: !!app.gamification,
                addPoints: !!app.gamification.addPoints,
                levelUp: !!app.gamification.levelUp,
                unlockAchievement: !!app.gamification.unlockAchievement,
                gamificationData: !!app.state.userData?.stats?.level,
                gamificationUI: !!document.getElementById('dashboard-view')
            };
            
            const allPassed = Object.values(tests).every(Boolean);
            
            this.logDebug('✅ Gamification test completed', { tests, allPassed });
            return { success: allPassed, tests };
            
        } catch (error) {
            this.logDebug('❌ Gamification test failed', { error: error.message });
            return { success: false, error: error.message };
        }
    },

    // Test UI
    async testUI() {
        try {
            this.logDebug('🎨 Testing UI system...');
            
            const tests = {
                uiObject: !!app.ui,
                showToast: !!app.ui.showToast,
                showConfirm: !!app.ui.showConfirm,
                update: !!app.ui.update,
                renderDashboard: !!app.ui.renderDashboard,
                mainContainer: !!document.getElementById('app-container'),
                sidebar: !!document.getElementById('sidebar'),
                header: !!document.getElementById('app-header')
            };
            
            const allPassed = Object.values(tests).every(Boolean);
            
            this.logDebug('✅ UI test completed', { tests, allPassed });
            return { success: allPassed, tests };
            
        } catch (error) {
            this.logDebug('❌ UI test failed', { error: error.message });
            return { success: false, error: error.message };
        }
    },

    // Test Firebase
    async testFirebase() {
        try {
            this.logDebug('🔥 Testing Firebase system...');
            
            const tests = {
                firebaseObject: !!app.firestore,
                updateUserData: !!app.firestore.updateUserData,
                listenForUserData: !!app.firestore.listenForUserData,
                dbConnection: !!db,
                authConnection: !!auth,
                firebaseConfig: !!app.state.firebaseReady
            };
            
            const allPassed = Object.values(tests).every(Boolean);
            
            this.logDebug('✅ Firebase test completed', { tests, allPassed });
            return { success: allPassed, tests };
            
        } catch (error) {
            this.logDebug('❌ Firebase test failed', { error: error.message });
            return { success: false, error: error.message };
        }
    },

    // Test Performance
    async testPerformance() {
        try {
            this.logDebug('⚡ Testing performance...');
            
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            const domContentLoaded = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
            
            const tests = {
                loadTime: loadTime < 3000, // Less than 3 seconds
                domContentLoaded: domContentLoaded < 2000, // Less than 2 seconds
                memoryUsage: performance.memory ? performance.memory.usedJSHeapSize < 50000000 : true, // Less than 50MB
                networkRequests: performance.getEntriesByType('resource').length < 50, // Less than 50 requests
                performanceObserver: 'PerformanceObserver' in window
            };
            
            const allPassed = Object.values(tests).every(Boolean);
            
            this.logDebug('✅ Performance test completed', { 
                tests, 
                allPassed, 
                metrics: { loadTime, domContentLoaded } 
            });
            return { success: allPassed, tests, metrics: { loadTime, domContentLoaded } };
            
        } catch (error) {
            this.logDebug('❌ Performance test failed', { error: error.message });
            return { success: false, error: error.message };
        }
    },

    // Get Test Results
    getTestResults() {
        return this.testResults;
    },

    // Reset Test Results
    resetTestResults() {
        this.testResults = {
            authentication: {},
            goals: {},
            habits: {},
            focus: {},
            analytics: {},
            community: {},
            gamification: {},
            ui: {},
            firebase: {},
            performance: {}
        };
        this.logDebug('📊 Test results reset');
    },

    // Debug Tools
    enableDebugMode() {
        this.debugMode = true;
        this.logDebug('🔧 Debug mode enabled');
        this.showDebugPanel();
        return true;
    },

    disableDebugMode() {
        this.debugMode = false;
        this.hideDebugPanel();
        return true;
    },

    logDebug(message, data = null) {
        if (this.debugMode) {
            if (data) {
                } else {
                }
        }
    },

    // Setup Monitoring
    setupMonitoring() {
        // Monitor app state changes
        setInterval(() => {
            this.monitorAppState();
        }, 30000); // Check every 30 seconds
    },

    monitorAppState() {
        const state = {
            userLoaded: !!app.state.currentUser,
            userDataLoaded: !!app.state.userData,
            activeView: app.state.activeView,
            firebaseReady: app.state.firebaseReady,
            goalsCount: Object.keys(app.state.localGoals || {}).length,
            habitsCount: Object.keys(app.state.userData?.habits || {}).length
        };
        
        this.logDebug('📊 App state monitoring', state);
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
        debugPanel.id = 'app-debug-panel';
        debugPanel.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            max-width: 350px;
            max-height: 500px;
            overflow-y: auto;
        `;
        
        debugPanel.innerHTML = `
            <h4 style="margin: 0 0 10px 0; color: #f97316;">🔧 App Debug Panel</h4>
            <div id="app-debug-content"></div>
            <div style="margin-top: 10px;">
                <button onclick="AppFunctionalityDebugger.testAllFeatures()" style="background: #f97316; color: black; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 11px;">Test All</button>
                <button onclick="AppFunctionalityDebugger.resetTestResults()" style="background: #ef4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 11px; margin-left: 5px;">Reset</button>
                <button onclick="AppFunctionalityDebugger.hideDebugPanel()" style="background: #6b7280; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 11px; margin-left: 5px;">Hide</button>
            </div>
        `;
        
        document.body.appendChild(debugPanel);
        
        // Update debug panel every 10 seconds
        setInterval(() => {
            this.updateDebugPanel();
        }, 10000);
    },

    updateDebugPanel() {
        const debugContent = document.getElementById('app-debug-content');
        if (debugContent) {
            const state = {
                userLoaded: !!app.state.currentUser,
                userDataLoaded: !!app.state.userData,
                activeView: app.state.activeView,
                firebaseReady: app.state.firebaseReady,
                goalsCount: Object.keys(app.state.localGoals || {}).length,
                habitsCount: Object.keys(app.state.userData?.habits || {}).length
            };
            
            debugContent.innerHTML = `
                <div>👤 User: ${state.userLoaded ? 'Loaded' : 'Not Loaded'}</div>
                <div>📊 Data: ${state.userDataLoaded ? 'Loaded' : 'Not Loaded'}</div>
                <div>🎯 View: ${state.activeView || 'None'}</div>
                <div>🔥 Firebase: ${state.firebaseReady ? 'Ready' : 'Not Ready'}</div>
                <div>🎯 Goals: ${state.goalsCount}</div>
                <div>🔄 Habits: ${state.habitsCount}</div>
            `;
        }
    },

    showDebugPanel() {
        let debugPanel = document.getElementById('app-debug-panel');
        if (!debugPanel) {
            this.createDebugPanel();
        } else {
            debugPanel.style.display = 'block';
        }
    },

    hideDebugPanel() {
        const debugPanel = document.getElementById('app-debug-panel');
        if (debugPanel) {
            debugPanel.style.display = 'none';
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppFunctionalityDebugger;
} else {
    window.AppFunctionalityDebugger = AppFunctionalityDebugger;
} 