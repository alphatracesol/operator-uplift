// COMPREHENSIVE PRODUCTION TEST SCRIPT
// Tests all components, security, and identifies gaps before Netlify deployment

class ComprehensiveProductionTest {
    constructor() {
        this.results = {
            security: { passed: 0, failed: 0, issues: [] },
            functionality: { passed: 0, failed: 0, issues: [] },
            performance: { passed: 0, failed: 0, issues: [] },
            accessibility: { passed: 0, failed: 0, issues: [] },
            deployment: { passed: 0, failed: 0, issues: [] }
        };
        this.criticalIssues = [];
    }

    async runAllTests() {
        await this.testSecurity();
        await this.testFunctionality();
        await this.testPerformance();
        await this.testAccessibility();
        await this.testDeployment();
        await this.testPlaceholders();
        await this.testConfiguration();
        await this.testIntegration();

        this.generateReport();
    }

    async testSecurity() {
        // Test for placeholder API keys
        const placeholderPatterns = [
            /YOUR_/g,
            /your_/g,
            /placeholder/g,
            /REPLACE_WITH/g
        ];

        // Check critical files for placeholders
        const criticalFiles = [
            'app.html',
            'pwa-enhancer.js',
            'vapid-config.js',
            'netlify/functions/ai-proxy.js'
        ];

        for (const file of criticalFiles) {
            try {
                const response = await fetch(file);
                const content = await response.text();
                
                for (const pattern of placeholderPatterns) {
                    const matches = content.match(pattern);
                    if (matches) {
                        this.results.security.failed++;
                        this.results.security.issues.push(`CRITICAL: Found placeholder in ${file}: ${matches.join(', ')}`);
                        this.criticalIssues.push(`SECURITY: Placeholder found in ${file}`);
                    }
                }
            } catch (error) {
                this.results.security.failed++;
                this.results.security.issues.push(`Error reading ${file}: ${error.message}`);
            }
        }

        // Test CSP headers
        const cspHeaders = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (!cspHeaders) {
            this.results.security.failed++;
            this.results.security.issues.push('CRITICAL: No CSP headers found');
            this.criticalIssues.push('SECURITY: Missing CSP headers');
        } else {
            this.results.security.passed++;
        }

        // Test for secure headers
        const secureHeaders = [
            'X-Content-Type-Options',
            'X-Frame-Options',
            'X-XSS-Protection'
        ];

        for (const header of secureHeaders) {
            const meta = document.querySelector(`meta[http-equiv="${header}"]`);
            if (!meta) {
                this.results.security.failed++;
                this.results.security.issues.push(`Missing security header: ${header}`);
            } else {
                this.results.security.passed++;
            }
        }
    }

    async testFunctionality() {
        // Test core app components
        const coreComponents = [
            'app',
            'app.state',
            'app.auth',
            'app.firestore',
            'app.goals',
            'app.ui',
            'app.gamification',
            'app.ai'
        ];

        for (const component of coreComponents) {
            try {
                const exists = eval(`typeof ${component} !== 'undefined'`);
                if (exists) {
                    this.results.functionality.passed++;
                } else {
                    this.results.functionality.failed++;
                    this.results.functionality.issues.push(`Missing core component: ${component}`);
                    this.criticalIssues.push(`FUNCTIONALITY: Missing ${component}`);
                }
            } catch (error) {
                this.results.functionality.failed++;
                this.results.functionality.issues.push(`Error testing ${component}: ${error.message}`);
            }
        }

        // Test Firebase configuration
        if (typeof firebase !== 'undefined') {
            this.results.functionality.passed++;
        } else {
            this.results.functionality.failed++;
            this.results.functionality.issues.push('Firebase not loaded');
            this.criticalIssues.push('FUNCTIONALITY: Firebase not loaded');
        }

        // Test service worker
        if ('serviceWorker' in navigator) {
            this.results.functionality.passed++;
        } else {
            this.results.functionality.failed++;
            this.results.functionality.issues.push('Service Worker not supported');
        }
    }

    async testPerformance() {
        // Test Core Web Vitals
        if ('PerformanceObserver' in window) {
            this.results.performance.passed++;
        } else {
            this.results.performance.failed++;
            this.results.performance.issues.push('PerformanceObserver not supported');
        }

        // Test resource loading
        const resources = performance.getEntriesByType('resource');
        const slowResources = resources.filter(r => r.duration > 3000);
        
        if (slowResources.length === 0) {
            this.results.performance.passed++;
        } else {
            this.results.performance.failed++;
            this.results.performance.issues.push(`${slowResources.length} slow resources detected`);
        }

        // Test bundle size
        const totalSize = resources.reduce((sum, r) => sum + r.transferSize, 0);
        if (totalSize < 5000000) { // 5MB limit
            this.results.performance.passed++;
        } else {
            this.results.performance.failed++;
            this.results.performance.issues.push(`Bundle size too large: ${(totalSize / 1000000).toFixed(2)}MB`);
        }
    }

    async testAccessibility() {
        // Test ARIA attributes
        const elementsWithoutAria = document.querySelectorAll('button, input, select, textarea').length;
        const elementsWithAria = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby]').length;
        
        if (elementsWithAria > 0) {
            this.results.accessibility.passed++;
        } else {
            this.results.accessibility.failed++;
            this.results.accessibility.issues.push('No ARIA attributes found');
        }

        // Test alt text for images
        const images = document.querySelectorAll('img');
        const imagesWithAlt = document.querySelectorAll('img[alt]').length;
        
        if (imagesWithAlt === images.length) {
            this.results.accessibility.passed++;
        } else {
            this.results.accessibility.failed++;
            this.results.accessibility.issues.push(`${images.length - imagesWithAlt} images missing alt text`);
        }

        // Test keyboard navigation
        const focusableElements = document.querySelectorAll('button, input, select, textarea, a, [tabindex]');
        if (focusableElements.length > 0) {
            this.results.accessibility.passed++;
        } else {
            this.results.accessibility.failed++;
            this.results.accessibility.issues.push('No focusable elements found');
        }
    }

    async testDeployment() {
        // Test Netlify configuration
        try {
            const response = await fetch('netlify.toml');
            if (response.ok) {
                this.results.deployment.passed++;
            } else {
                this.results.deployment.failed++;
                this.results.deployment.issues.push('netlify.toml not found');
                this.criticalIssues.push('DEPLOYMENT: Missing netlify.toml');
            }
        } catch (error) {
            this.results.deployment.failed++;
            this.results.deployment.issues.push(`Error reading netlify.toml: ${error.message}`);
        }

        // Test manifest.json
        try {
            const response = await fetch('manifest.json');
            if (response.ok) {
                const manifest = await response.json();
                if (manifest.name && manifest.short_name) {
                    this.results.deployment.passed++;
                } else {
                    this.results.deployment.failed++;
                    this.results.deployment.issues.push('manifest.json missing required fields');
                }
            } else {
                this.results.deployment.failed++;
                this.results.deployment.issues.push('manifest.json not found');
            }
        } catch (error) {
            this.results.deployment.failed++;
            this.results.deployment.issues.push(`Error reading manifest.json: ${error.message}`);
        }

        // Test service worker
        try {
            const response = await fetch('sw.js');
            if (response.ok) {
                this.results.deployment.passed++;
            } else {
                this.results.deployment.failed++;
                this.results.deployment.issues.push('sw.js not found');
            }
        } catch (error) {
            this.results.deployment.failed++;
            this.results.deployment.issues.push(`Error reading sw.js: ${error.message}`);
        }
    }

    async testPlaceholders() {
        const placeholderPatterns = [
            /coming soon/i,
            /not implemented/i,
            /TODO/i,
            /FIXME/i,
            /XXX/i,
            /HACK/i
        ];

        // Test main HTML files
        const htmlFiles = [
            'index.html',
            'app.html',
            'MVP Launch Page.html',
            'press-release.html'
        ];

        for (const file of htmlFiles) {
            try {
                const response = await fetch(file);
                const content = await response.text();
                
                for (const pattern of placeholderPatterns) {
                    const matches = content.match(pattern);
                    if (matches) {
                        this.criticalIssues.push(`PLACEHOLDER: Found "${matches[0]}" in ${file}`);
                    }
                }
            } catch (error) {
                this.criticalIssues.push(`ERROR: Could not read ${file}: ${error.message}`);
            }
        }
    }

    async testConfiguration() {
        // Test environment variables documentation
        try {
            const response = await fetch('ENVIRONMENT_VARIABLES.md');
            if (response.ok) {
                this.results.deployment.passed++;
            } else {
                this.results.deployment.failed++;
                this.results.deployment.issues.push('ENVIRONMENT_VARIABLES.md not found');
            }
        } catch (error) {
            this.results.deployment.failed++;
            this.results.deployment.issues.push(`Error reading ENVIRONMENT_VARIABLES.md: ${error.message}`);
        }

        // Test deployment guide
        try {
            const response = await fetch('MULTI_AI_DEPLOYMENT_GUIDE.md');
            if (response.ok) {
                this.results.deployment.passed++;
            } else {
                this.results.deployment.failed++;
                this.results.deployment.issues.push('MULTI_AI_DEPLOYMENT_GUIDE.md not found');
            }
        } catch (error) {
            this.results.deployment.failed++;
            this.results.deployment.issues.push(`Error reading MULTI_AI_DEPLOYMENT_GUIDE.md: ${error.message}`);
        }
    }

    async testIntegration() {
        // Test AI proxy function
        try {
            const response = await fetch('netlify/functions/ai-proxy.js');
            if (response.ok) {
                this.results.functionality.passed++;
            } else {
                this.results.functionality.failed++;
                this.results.functionality.issues.push('AI proxy function not found');
                this.criticalIssues.push('INTEGRATION: Missing AI proxy function');
            }
        } catch (error) {
            this.results.functionality.failed++;
            this.results.functionality.issues.push(`Error reading AI proxy: ${error.message}`);
        }

        // Test package.json for Netlify functions
        try {
            const response = await fetch('netlify/functions/package.json');
            if (response.ok) {
                this.results.deployment.passed++;
            } else {
                this.results.deployment.failed++;
                this.results.deployment.issues.push('Netlify functions package.json not found');
            }
        } catch (error) {
            this.results.deployment.failed++;
            this.results.deployment.issues.push(`Error reading functions package.json: ${error.message}`);
        }
    }

    generateReport() {
        let totalPassed = 0;
        let totalFailed = 0;

        for (const [category, results] of Object.entries(this.results)) {
            const total = results.passed + results.failed;
            const percentage = total > 0 ? ((results.passed / total) * 100).toFixed(1) : 0;
            
            }:`);
            if (results.issues.length > 0) {
                results.issues.forEach(issue => );
            }

            totalPassed += results.passed;
            totalFailed += results.failed;
        }

        if (this.criticalIssues.length === 0) {
            } else {
            this.criticalIssues.forEach(issue => );
        }

        const overallTotal = totalPassed + totalFailed;
        const overallPercentage = overallTotal > 0 ? ((totalPassed / overallTotal) * 100).toFixed(1) : 0;

        if (this.criticalIssues.length === 0 && overallPercentage >= 90) {
            } else {
            }

        // Save results to localStorage for debugging
        localStorage.setItem('comprehensiveTestResults', JSON.stringify({
            results: this.results,
            criticalIssues: this.criticalIssues,
            timestamp: new Date().toISOString()
        }));
    }
}

// Run the comprehensive test
const test = new ComprehensiveProductionTest();
test.runAllTests(); 