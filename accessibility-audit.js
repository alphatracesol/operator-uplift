// Accessibility Audit Utilities for Operator Uplift
// Comprehensive ARIA validation, keyboard navigation, and WCAG compliance checks

const AccessibilityAudit = {
    // WCAG 2.1 AA Compliance Checker
    checkWCAGCompliance() {
        const issues = [];
        
        // Check color contrast
        issues.push(...this.checkColorContrast());
        
        // Check keyboard navigation
        issues.push(...this.checkKeyboardNavigation());
        
        // Check ARIA attributes
        issues.push(...this.checkARIAAttributes());
        
        // Check focus management
        issues.push(...this.checkFocusManagement());
        
        // Check screen reader compatibility
        issues.push(...this.checkScreenReaderCompatibility());
        
        return {
            compliant: issues.length === 0,
            issues: issues,
            score: Math.max(0, 100 - (issues.length * 10))
        };
    },

    // Color Contrast Checker
    checkColorContrast() {
        const issues = [];
        const elements = document.querySelectorAll('*');
        
        elements.forEach(element => {
            const style = window.getComputedStyle(element);
            const backgroundColor = style.backgroundColor;
            const color = style.color;
            
            if (color && backgroundColor) {
                const contrast = this.calculateContrastRatio(color, backgroundColor);
                if (contrast < 4.5) {
                    issues.push({
                        type: 'contrast',
                        element: element,
                        message: `Low color contrast (${contrast.toFixed(2)}:1)`,
                        severity: 'high'
                    });
                }
            }
        });
        
        return issues;
    },

    // Calculate contrast ratio
    calculateContrastRatio(color1, color2) {
        const luminance1 = this.getLuminance(color1);
        const luminance2 = this.getLuminance(color2);
        
        const lighter = Math.max(luminance1, luminance2);
        const darker = Math.min(luminance1, luminance2);
        
        return (lighter + 0.05) / (darker + 0.05);
    },

    // Get luminance of a color
    getLuminance(color) {
        const rgb = this.hexToRgb(color);
        if (!rgb) return 0;
        
        const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    },

    // Convert hex to RGB
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    // Keyboard Navigation Checker
    checkKeyboardNavigation() {
        const issues = [];
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [role="button"], [role="link"], [role="menuitem"]');
        
        interactiveElements.forEach(element => {
            // Check if element is focusable
            if (!element.hasAttribute('tabindex') && !this.isNativelyFocusable(element)) {
                issues.push({
                    type: 'keyboard',
                    element: element,
                    message: 'Interactive element not keyboard accessible',
                    severity: 'high'
                });
            }
            
            // Check for visible focus indicators
            const hasFocusIndicator = this.hasFocusIndicator(element);
            if (!hasFocusIndicator) {
                issues.push({
                    type: 'keyboard',
                    element: element,
                    message: 'No visible focus indicator',
                    severity: 'medium'
                });
            }
        });
        
        return issues;
    },

    // Check if element is natively focusable
    isNativelyFocusable(element) {
        const tagName = element.tagName.toLowerCase();
        const type = element.type;
        
        return (
            tagName === 'button' ||
            tagName === 'a' ||
            tagName === 'input' ||
            tagName === 'select' ||
            tagName === 'textarea' ||
            element.hasAttribute('contenteditable') ||
            element.hasAttribute('tabindex')
        );
    },

    // Check for focus indicators
    hasFocusIndicator(element) {
        const style = window.getComputedStyle(element);
        return (
            style.outline !== 'none' ||
            style.outlineWidth !== '0px' ||
            style.boxShadow !== 'none' ||
            element.classList.contains('focus-visible')
        );
    },

    // ARIA Attributes Checker
    checkARIAAttributes() {
        const issues = [];
        const elementsWithARIA = document.querySelectorAll('[aria-*]');
        
        elementsWithARIA.forEach(element => {
            const ariaAttributes = Array.from(element.attributes)
                .filter(attr => attr.name.startsWith('aria-'));
            
            ariaAttributes.forEach(attr => {
                const isValid = this.validateARIAAttribute(attr.name, attr.value, element);
                if (!isValid) {
                    issues.push({
                        type: 'aria',
                        element: element,
                        message: `Invalid ARIA attribute: ${attr.name}="${attr.value}"`,
                        severity: 'medium'
                    });
                }
            });
        });
        
        return issues;
    },

    // Validate ARIA attribute
    validateARIAAttribute(name, value, element) {
        const validators = {
            'aria-label': (value) => typeof value === 'string' && value.length > 0,
            'aria-labelledby': (value) => {
                const ids = value.split(' ');
                return ids.every(id => document.getElementById(id));
            },
            'aria-describedby': (value) => {
                const ids = value.split(' ');
                return ids.every(id => document.getElementById(id));
            },
            'aria-expanded': (value) => ['true', 'false'].includes(value),
            'aria-hidden': (value) => ['true', 'false'].includes(value),
            'aria-invalid': (value) => ['true', 'false', 'grammar', 'spelling'].includes(value),
            'aria-required': (value) => ['true', 'false'].includes(value),
            'aria-checked': (value) => ['true', 'false', 'mixed'].includes(value),
            'aria-selected': (value) => ['true', 'false'].includes(value),
            'aria-pressed': (value) => ['true', 'false', 'mixed'].includes(value),
            'aria-current': (value) => ['page', 'step', 'location', 'date', 'time', 'true', 'false'].includes(value)
        };
        
        const validator = validators[name];
        return validator ? validator(value) : true;
    },

    // Focus Management Checker
    checkFocusManagement() {
        const issues = [];
        
        // Check for skip links
        const skipLinks = document.querySelectorAll('a[href^="#"]');
        const hasSkipLink = Array.from(skipLinks).some(link => 
            link.textContent.toLowerCase().includes('skip') ||
            link.getAttribute('aria-label')?.toLowerCase().includes('skip')
        );
        
        if (!hasSkipLink) {
            issues.push({
                type: 'focus',
                element: document.body,
                message: 'No skip link found',
                severity: 'medium'
            });
        }
        
        // Check for focus traps in modals
        const modals = document.querySelectorAll('.modal, [role="dialog"]');
        modals.forEach(modal => {
            if (!this.hasFocusTrap(modal)) {
                issues.push({
                    type: 'focus',
                    element: modal,
                    message: 'Modal lacks focus trap',
                    severity: 'high'
                });
            }
        });
        
        return issues;
    },

    // Check for focus trap
    hasFocusTrap(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        return focusableElements.length > 0;
    },

    // Screen Reader Compatibility Checker
    checkScreenReaderCompatibility() {
        const issues = [];
        
        // Check for proper heading structure
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let previousLevel = 0;
        
        headings.forEach(heading => {
            const level = parseInt(heading.tagName.charAt(1));
            if (level > previousLevel + 1) {
                issues.push({
                    type: 'screenreader',
                    element: heading,
                    message: `Heading level skipped: h${previousLevel} to h${level}`,
                    severity: 'medium'
                });
            }
            previousLevel = level;
        });
        
        // Check for alt text on images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.hasAttribute('alt')) {
                issues.push({
                    type: 'screenreader',
                    element: img,
                    message: 'Image missing alt attribute',
                    severity: 'high'
                });
            }
        });
        
        // Check for form labels
        const formControls = document.querySelectorAll('input, select, textarea');
        formControls.forEach(control => {
            if (!this.hasLabel(control)) {
                issues.push({
                    type: 'screenreader',
                    element: control,
                    message: 'Form control missing label',
                    severity: 'high'
                });
            }
        });
        
        return issues;
    },

    // Check if form control has label
    hasLabel(control) {
        const id = control.id;
        if (id) {
            const label = document.querySelector(`label[for="${id}"]`);
            if (label) return true;
        }
        
        const parent = control.parentElement;
        const label = parent.querySelector('label');
        if (label && parent.contains(control)) return true;
        
        return control.hasAttribute('aria-label') || control.hasAttribute('aria-labelledby');
    },

    // Add Accessibility Features
    enhanceAccessibility() {
        this.addSkipLink();
        this.addFocusIndicators();
        this.addARIALabels();
        this.addKeyboardShortcuts();
        this.addLiveRegions();
    },

    // Add skip link
    addSkipLink() {
        if (!document.querySelector('.skip-link')) {
            const skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.textContent = 'Skip to main content';
            skipLink.className = 'skip-link';
            skipLink.style.cssText = `
                position: absolute;
                top: -40px;
                left: 6px;
                background: #000;
                color: #fff;
                padding: 8px;
                text-decoration: none;
                z-index: 10000;
                border-radius: 4px;
            `;
            
            skipLink.addEventListener('focus', () => {
                skipLink.style.top = '6px';
            });
            
            skipLink.addEventListener('blur', () => {
                skipLink.style.top = '-40px';
            });
            
            document.body.insertBefore(skipLink, document.body.firstChild);
        }
    },

    // Add focus indicators
    addFocusIndicators() {
        const style = document.createElement('style');
        style.textContent = `
            .focus-visible {
                outline: 2px solid #f97316 !important;
                outline-offset: 2px !important;
            }
            
            button:focus,
            a:focus,
            input:focus,
            select:focus,
            textarea:focus {
                outline: 2px solid #f97316 !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(style);
    },

    // Add ARIA labels
    addARIALabels() {
        // Add labels to buttons without text
        document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach(button => {
            if (!button.textContent.trim()) {
                const icon = button.querySelector('svg, i');
                if (icon) {
                    button.setAttribute('aria-label', 'Button');
                }
            }
        });
        
        // Add labels to form controls
        document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]').forEach(input => {
            if (!input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
                const placeholder = input.placeholder;
                if (placeholder) {
                    input.setAttribute('aria-label', placeholder);
                }
            }
        });
    },

    // Add keyboard shortcuts
    addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Escape to close modals
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active, [role="dialog"][aria-hidden="false"]');
                if (activeModal) {
                    const closeBtn = activeModal.querySelector('.modal-close, [aria-label*="close"]');
                    if (closeBtn) closeBtn.click();
                }
            }
            
            // Enter/Space for buttons
            if ((e.key === 'Enter' || e.key === ' ') && e.target.hasAttribute('role')) {
                e.preventDefault();
                e.target.click();
            }
        });
    },

    // Add live regions
    addLiveRegions() {
        if (!document.getElementById('live-region')) {
            const liveRegion = document.createElement('div');
            liveRegion.id = 'live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
            document.body.appendChild(liveRegion);
        }
    },

    // Announce to screen readers
    announce(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    },

    // Generate accessibility report
    generateReport() {
        const compliance = this.checkWCAGCompliance();
        
        return {
            timestamp: new Date().toISOString(),
            compliance: compliance,
            recommendations: this.generateRecommendations(compliance.issues),
            score: compliance.score
        };
    },

    // Generate recommendations
    generateRecommendations(issues) {
        const recommendations = [];
        
        issues.forEach(issue => {
            switch (issue.type) {
                case 'contrast':
                    recommendations.push('Increase color contrast to at least 4.5:1 for normal text');
                    break;
                case 'keyboard':
                    recommendations.push('Ensure all interactive elements are keyboard accessible');
                    break;
                case 'aria':
                    recommendations.push('Fix invalid ARIA attributes');
                    break;
                case 'focus':
                    recommendations.push('Improve focus management');
                    break;
                case 'screenreader':
                    recommendations.push('Add proper labels and alt text');
                    break;
            }
        });
        
        return recommendations;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityAudit;
} else {
    window.AccessibilityAudit = AccessibilityAudit;
} 