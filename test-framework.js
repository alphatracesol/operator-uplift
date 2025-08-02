/**
 * Operator Uplift - Testing Framework
 * Essential test suite for quality assurance
 */

class TestFramework {
    constructor() {
        this.results = { passed: 0, failed: 0, total: 0 };
        this.init();
    }
    
    init() {
        this.createTestUI();
        this.runEssentialTests();
    }
    
    createTestUI() {
        const panel = document.createElement('div');
        panel.id = 'test-panel';
        panel.style.cssText = `
            position: fixed; top: 20px; right: 20px; width: 280px;
            background: var(--card-bg-glass); border: 1px solid var(--border-glass);
            border-radius: 12px; padding: 1rem; z-index: 10000;
            backdrop-filter: blur(12px); font-family: var(--font-family);
        `;
        
        panel.innerHTML = `
            <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem;">🧪 Test Results</h3>
            <div id="test-summary">Running tests...</div>
            <div id="test-details" style="margin-top: 1rem; font-size: 0.875rem;"></div>
        `;
        
        document.body.appendChild(panel);
    }
    
    async runEssentialTests() {
        const tests = [
            { name: 'DOM Ready', test: () => this.testDOMReady() },
            { name: 'CSS Variables', test: () => this.testCSSVariables() },
            { name: 'Local Storage', test: () => this.testLocalStorage() },
            { name: 'Event System', test: () => this.testEventSystem() },
            { name: 'Performance', test: () => this.testPerformance() }
        ];
        
        for (const test of tests) {
            try {
                const result = await test.test();
                this.updateResults(result);
                this.updateUI(test.name, result);
            } catch (error) {
                this.updateResults({ passed: false, error: error.message });
                this.updateUI(test.name, { passed: false, error: error.message });
            }
        }
        
        this.finalizeResults();
    }
    
    testDOMReady() {
        return { passed: document.readyState === 'complete', message: 'DOM fully loaded' };
    }
    
    testCSSVariables() {
        const requiredVars = ['--accent-color', '--bg-color', '--text-color'];
        const missing = requiredVars.filter(varName => !getComputedStyle(document.documentElement).getPropertyValue(varName));
        
        return {
            passed: missing.length === 0,
            message: missing.length === 0 ? 'All CSS variables present' : `Missing: ${missing.join(', ')}`
        };
    }
    
    testLocalStorage() {
        try {
            localStorage.setItem('test', 'value');
            const value = localStorage.getItem('test');
            localStorage.removeItem('test');
            
            return { passed: value === 'value', message: 'Local storage working' };
        } catch (error) {
            return { passed: false, message: 'Local storage not available' };
        }
    }
    
    testEventSystem() {
        let eventFired = false;
        const testEvent = new CustomEvent('test-event', { detail: { test: true } });
        
        document.addEventListener('test-event', () => { eventFired = true; });
        document.dispatchEvent(testEvent);
        
        return { passed: eventFired, message: 'Custom events working' };
    }
    
    testPerformance() {
        const start = performance.now();
        // Simulate some work
        for (let i = 0; i < 1000; i++) {
            Math.random();
        }
        const duration = performance.now() - start;
        
        return { passed: duration < 10, message: `Performance: ${duration.toFixed(2)}ms` };
    }
    
    updateResults(result) {
        this.results.total++;
        if (result.passed) {
            this.results.passed++;
        } else {
            this.results.failed++;
        }
    }
    
    updateUI(testName, result) {
        const details = document.getElementById('test-details');
        const status = result.passed ? '✅' : '❌';
        const color = result.passed ? 'var(--secondary-color)' : 'var(--danger-color)';
        
        details.innerHTML += `
            <div style="margin-bottom: 0.5rem; color: ${color};">
                ${status} ${testName}: ${result.message}
            </div>
        `;
    }
    
    finalizeResults() {
        const summary = document.getElementById('test-summary');
        const passRate = Math.round((this.results.passed / this.results.total) * 100);
        const color = this.results.failed === 0 ? 'var(--secondary-color)' : 'var(--danger-color)';
        
        summary.innerHTML = `
            <div style="color: ${color}; font-weight: 600;">
                ${passRate}% Pass Rate (${this.results.passed}/${this.results.total})
            </div>
        `;
    }
}

// Initialize test framework
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new TestFramework());
} else {
    new TestFramework();
} 