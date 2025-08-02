// Diagnostic script for Netlify deployment issues
console.log('🔍 Operator Uplift - Netlify Diagnostic');

// Check if basic JavaScript is working
console.log('✅ Basic JavaScript execution - Working');

// Check if DOM is accessible
if (typeof document !== 'undefined') {
    console.log('✅ DOM access - Working');
} else {
    console.log('❌ DOM access - Failed');
}

// Check if fetch is available
if (typeof fetch !== 'undefined') {
    console.log('✅ Fetch API - Available');
} else {
    console.log('❌ Fetch API - Not available');
}

// Test Netlify functions
async function testNetlifyFunctions() {
    try {
        console.log('🔧 Testing Netlify functions...');
        
        // Test config function
        const configResponse = await fetch('/.netlify/functions/config');
        if (configResponse.ok) {
            const configData = await configResponse.json();
            console.log('✅ Config function - Working', configData);
        } else {
            console.log('❌ Config function - Failed', configResponse.status);
        }
        
        // Test AI proxy function
        const aiResponse = await fetch('/.netlify/functions/ai-proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ test: true })
        });
        if (aiResponse.ok) {
            console.log('✅ AI proxy function - Working');
        } else {
            console.log('❌ AI proxy function - Failed', aiResponse.status);
        }
        
    } catch (error) {
        console.log('❌ Netlify functions test failed:', error.message);
    }
}

// Test Firebase configuration
function testFirebaseConfig() {
    try {
        if (typeof firebase !== 'undefined') {
            console.log('✅ Firebase SDK - Loaded');
        } else {
            console.log('❌ Firebase SDK - Not loaded');
        }
    } catch (error) {
        console.log('❌ Firebase test failed:', error.message);
    }
}

// Test script loading
function testScriptLoading() {
    const scripts = [
        'scripts/security-utils.js',
        'scripts/accessibility-audit.js',
        'scripts/pwa-enhancer.js'
    ];
    
    scripts.forEach(script => {
        const scriptElement = document.querySelector(`script[src="${script}"]`);
        if (scriptElement) {
            console.log(`✅ ${script} - Loaded`);
        } else {
            console.log(`❌ ${script} - Not found`);
        }
    });
}

// Run diagnostics when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runDiagnostics);
} else {
    runDiagnostics();
}

function runDiagnostics() {
    console.log('🚀 Running full diagnostics...');
    
    testScriptLoading();
    testFirebaseConfig();
    testNetlifyFunctions();
    
    console.log('📊 Diagnostic complete - Check console for results');
}

// Export for manual testing
window.OperatorUpliftDiagnostic = {
    testNetlifyFunctions,
    testFirebaseConfig,
    testScriptLoading,
    runDiagnostics
}; 