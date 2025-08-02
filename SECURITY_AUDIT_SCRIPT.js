// COMPREHENSIVE SECURITY AUDIT SCRIPT
// Checks for any remaining security vulnerabilities before deployment

class SecurityAudit {
    constructor() {
        this.issues = [];
        this.criticalIssues = [];
        this.warnings = [];
    }

    async runFullAudit() {
        console.log('🔒 STARTING COMPREHENSIVE SECURITY AUDIT');
        console.log('========================================\n');

        await this.checkForHardcodedSecrets();
        await this.checkForAPIKeys();
        await this.checkForFirebaseConfig();
        await this.checkForVAPIDKeys();
        await this.checkForPlaceholders();
        await this.checkForExposedCredentials();
        await this.checkForSecurityHeaders();
        await this.checkForCSPConfiguration();
        await this.checkForAuthentication();
        await this.checkForDataExposure();

        this.generateSecurityReport();
    }

    async checkForHardcodedSecrets() {
        console.log('🔍 Checking for hardcoded secrets...');
        
        const secretPatterns = [
            /AIza[A-Za-z0-9_-]{35}/g, // Firebase API keys
            /sk_[A-Za-z0-9]{48}/g, // OpenAI/Stripe secret keys
            /pk_[A-Za-z0-9]{48}/g, // OpenAI/Stripe public keys
            /[A-Za-z0-9]{32,}/g // Generic long strings that might be keys
        ];

        const criticalFiles = [
            'app.html',
            'index.html',
            'netlify.toml',
            'vapid-config.js',
            'pwa-enhancer.js'
        ];

        for (const file of criticalFiles) {
            try {
                const response = await fetch(file);
                const content = await response.text();
                
                for (const pattern of secretPatterns) {
                    const matches = content.match(pattern);
                    if (matches) {
                        this.criticalIssues.push(`CRITICAL: Found potential secret in ${file}: ${matches[0]}`);
                    }
                }
            } catch (error) {
                this.warnings.push(`Warning: Could not read ${file}: ${error.message}`);
            }
        }
    }

    async checkForAPIKeys() {
        console.log('🔑 Checking for exposed API keys...');
        
        const apiKeyPatterns = [
            /apiKey.*["'][A-Za-z0-9_-]+["']/g,
            /API_KEY.*["'][A-Za-z0-9_-]+["']/g,
            /key.*["'][A-Za-z0-9_-]{20,}["']/g
        ];

        const files = [
            'app.html',
            'index.html',
            'MVP Launch Page.html',
            'press-release.html'
        ];

        for (const file of files) {
            try {
                const response = await fetch(file);
                const content = await response.text();
                
                for (const pattern of apiKeyPatterns) {
                    const matches = content.match(pattern);
                    if (matches) {
                        this.criticalIssues.push(`CRITICAL: Found API key pattern in ${file}: ${matches[0]}`);
                    }
                }
            } catch (error) {
                this.warnings.push(`Warning: Could not read ${file}: ${error.message}`);
            }
        }
    }

    async checkForFirebaseConfig() {
        console.log('🔥 Checking Firebase configuration...');
        
        const firebasePatterns = [
            /firebaseConfig.*=.*{/g,
            /apiKey.*["'][A-Za-z0-9_-]+["']/g,
            /projectId.*["'][A-Za-z0-9_-]+["']/g
        ];

        try {
            const response = await fetch('app.html');
            const content = await response.text();
            
            for (const pattern of firebasePatterns) {
                const matches = content.match(pattern);
                if (matches) {
                    this.criticalIssues.push(`CRITICAL: Found Firebase config pattern in app.html: ${matches[0]}`);
                }
            }
        } catch (error) {
            this.warnings.push(`Warning: Could not read app.html: ${error.message}`);
        }
    }

    async checkForVAPIDKeys() {
        console.log('📱 Checking VAPID configuration...');
        
        const vapidPatterns = [
            /VAPID.*["'][A-Za-z0-9_-]+["']/g,
            /publicKey.*["'][A-Za-z0-9_-]+["']/g,
            /privateKey.*["'][A-Za-z0-9_-]+["']/g
        ];

        const files = ['vapid-config.js', 'pwa-enhancer.js', 'app.html'];

        for (const file of files) {
            try {
                const response = await fetch(file);
                const content = await response.text();
                
                for (const pattern of vapidPatterns) {
                    const matches = content.match(pattern);
                    if (matches) {
                        this.criticalIssues.push(`CRITICAL: Found VAPID key pattern in ${file}: ${matches[0]}`);
                    }
                }
            } catch (error) {
                this.warnings.push(`Warning: Could not read ${file}: ${error.message}`);
            }
        }
    }

    async checkForPlaceholders() {
        console.log('🔍 Checking for placeholder values...');
        
        const placeholderPatterns = [
            /YOUR_/g,
            /your_/g,
            /placeholder/g,
            /REPLACE_WITH/g,
            /TODO.*API/g,
            /FIXME.*key/g
        ];

        const files = [
            'app.html',
            'index.html',
            'netlify.toml',
            'vapid-config.js'
        ];

        for (const file of files) {
            try {
                const response = await fetch(file);
                const content = await response.text();
                
                for (const pattern of placeholderPatterns) {
                    const matches = content.match(pattern);
                    if (matches) {
                        this.issues.push(`ISSUE: Found placeholder in ${file}: ${matches.join(', ')}`);
                    }
                }
            } catch (error) {
                this.warnings.push(`Warning: Could not read ${file}: ${error.message}`);
            }
        }
    }

    async checkForExposedCredentials() {
        console.log('🔐 Checking for exposed credentials...');
        
        const credentialPatterns = [
            /password.*["'][A-Za-z0-9]+["']/g,
            /secret.*["'][A-Za-z0-9]+["']/g,
            /token.*["'][A-Za-z0-9]+["']/g,
            /credential.*["'][A-Za-z0-9]+["']/g
        ];

        const files = ['app.html', 'index.html'];

        for (const file of files) {
            try {
                const response = await fetch(file);
                const content = await response.text();
                
                for (const pattern of credentialPatterns) {
                    const matches = content.match(pattern);
                    if (matches) {
                        this.criticalIssues.push(`CRITICAL: Found credential pattern in ${file}: ${matches[0]}`);
                    }
                }
            } catch (error) {
                this.warnings.push(`Warning: Could not read ${file}: ${error.message}`);
            }
        }
    }

    async checkForSecurityHeaders() {
        console.log('🛡️ Checking security headers...');
        
        const cspHeader = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (!cspHeader) {
            this.criticalIssues.push('CRITICAL: No CSP header found');
        } else {
            console.log('✅ CSP header found');
        }

        const securityHeaders = [
            'X-Content-Type-Options',
            'X-Frame-Options',
            'X-XSS-Protection'
        ];

        for (const header of securityHeaders) {
            const meta = document.querySelector(`meta[http-equiv="${header}"]`);
            if (!meta) {
                this.issues.push(`ISSUE: Missing security header: ${header}`);
            } else {
                console.log(`✅ ${header} found`);
            }
        }
    }

    async checkForCSPConfiguration() {
        console.log('🔒 Checking CSP configuration...');
        
        const cspHeader = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (cspHeader) {
            const csp = cspHeader.getAttribute('content');
            
            // Check for required CSP directives
            const requiredDirectives = [
                'default-src',
                'script-src',
                'style-src',
                'img-src'
            ];

            for (const directive of requiredDirectives) {
                if (!csp.includes(directive)) {
                    this.issues.push(`ISSUE: Missing CSP directive: ${directive}`);
                }
            }

            // Check for unsafe-inline
            if (csp.includes('unsafe-inline')) {
                this.warnings.push('WARNING: CSP contains unsafe-inline');
            }
        }
    }

    async checkForAuthentication() {
        console.log('🔐 Checking authentication configuration...');
        
        // Check if Firebase auth is properly configured
        if (typeof firebase !== 'undefined') {
            console.log('✅ Firebase loaded');
        } else {
            this.issues.push('ISSUE: Firebase not loaded');
        }

        // Check for auth token handling
        try {
            const response = await fetch('app.html');
            const content = await response.text();
            
            if (content.includes('getAuthToken') && content.includes('Authorization')) {
                console.log('✅ Auth token handling found');
            } else {
                this.issues.push('ISSUE: Auth token handling not found');
            }
        } catch (error) {
            this.warnings.push(`Warning: Could not check auth: ${error.message}`);
        }
    }

    async checkForDataExposure() {
        console.log('📊 Checking for data exposure...');
        
        const exposurePatterns = [
            /console\.log.*apiKey/g,
            /console\.log.*password/g,
            /console\.log.*secret/g,
            /alert.*apiKey/g,
            /alert.*password/g
        ];

        const files = ['app.html', 'index.html'];

        for (const file of files) {
            try {
                const response = await fetch(file);
                const content = await response.text();
                
                for (const pattern of exposurePatterns) {
                    const matches = content.match(pattern);
                    if (matches) {
                        this.criticalIssues.push(`CRITICAL: Found data exposure in ${file}: ${matches[0]}`);
                    }
                }
            } catch (error) {
                this.warnings.push(`Warning: Could not read ${file}: ${error.message}`);
            }
        }
    }

    generateSecurityReport() {
        console.log('\n📊 SECURITY AUDIT RESULTS');
        console.log('=========================\n');

        if (this.criticalIssues.length === 0) {
            console.log('🎉 NO CRITICAL SECURITY ISSUES FOUND!');
        } else {
            console.log('🚨 CRITICAL SECURITY ISSUES:');
            this.criticalIssues.forEach(issue => console.log(`  ❌ ${issue}`));
        }

        if (this.issues.length === 0) {
            console.log('✅ NO SECURITY ISSUES FOUND!');
        } else {
            console.log('\n⚠️ SECURITY ISSUES:');
            this.issues.forEach(issue => console.log(`  ⚠️ ${issue}`));
        }

        if (this.warnings.length > 0) {
            console.log('\n💡 WARNINGS:');
            this.warnings.forEach(warning => console.log(`  💡 ${warning}`));
        }

        console.log('\n📈 SECURITY SCORE:');
        const totalChecks = 10;
        const criticalScore = this.criticalIssues.length === 0 ? 100 : 0;
        const issueScore = Math.max(0, 100 - (this.issues.length * 10));
        const overallScore = Math.round((criticalScore + issueScore) / 2);
        
        console.log(`  Critical Issues: ${this.criticalIssues.length === 0 ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`  Security Issues: ${this.issues.length === 0 ? '✅ PASS' : '⚠️ NEEDS ATTENTION'}`);
        console.log(`  Overall Score: ${overallScore}/100`);

        if (overallScore >= 90) {
            console.log('\n🎉 SECURITY AUDIT PASSED! Ready for production deployment.');
        } else {
            console.log('\n🚨 SECURITY AUDIT FAILED! Fix issues before deployment.');
        }

        // Save results to localStorage
        localStorage.setItem('securityAuditResults', JSON.stringify({
            criticalIssues: this.criticalIssues,
            issues: this.issues,
            warnings: this.warnings,
            score: overallScore,
            timestamp: new Date().toISOString()
        }));
    }
}

// Run the security audit
const audit = new SecurityAudit();
audit.runFullAudit(); 