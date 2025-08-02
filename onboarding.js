/**
 * Operator Uplift - Enhanced Onboarding System
 * Interactive tutorial and setup guide for new users
 */

class OnboardingSystem {
    constructor() {
        this.currentStep = 0;
        this.totalSteps = 8;
        this.userPreferences = {};
        this.isActive = false;
        this.overlay = null;
        this.tooltip = null;
        this.progressBar = null;
        
        this.steps = [
            {
                id: 'welcome',
                title: 'Welcome to Operator Uplift',
                description: 'Your AI-powered journey to self-progression starts here. Let\'s get you set up in just a few minutes.',
                target: null,
                position: 'center'
            },
            {
                id: 'goal-setting',
                title: 'Set Your First Goal',
                description: 'What would you like to achieve? We\'ll help you break it down into manageable steps.',
                target: '#goal-input',
                position: 'bottom'
            },
            {
                id: 'ai-mentor',
                title: 'Meet Your AI Mentor',
                description: 'Your personal AI coach is here to guide you, provide insights, and keep you motivated.',
                target: '#ai-mentor-widget',
                position: 'left'
            },
            {
                id: 'gamification',
                title: 'Earn Essence & Achievements',
                description: 'Complete tasks to earn Essence points and unlock achievements. Track your progress visually.',
                target: '#stats-grid',
                position: 'top'
            },
            {
                id: 'dashboard',
                title: 'Your Personal Dashboard',
                description: 'Everything you need to track progress, view insights, and stay motivated in one place.',
                target: '#main-content',
                position: 'center'
            },
            {
                id: 'navigation',
                title: 'Navigate Your Journey',
                description: 'Use the sidebar to switch between different views: Goals, Calendar, Analytics, and more.',
                target: '#sidebar',
                position: 'right'
            },
            {
                id: 'preferences',
                title: 'Customize Your Experience',
                description: 'Set your preferences for notifications, themes, and AI mentor personality.',
                target: '#app-header',
                position: 'bottom'
            },
            {
                id: 'complete',
                title: 'You\'re All Set!',
                description: 'Welcome to the Operator Uplift community. Your journey to self-progression begins now.',
                target: null,
                position: 'center'
            }
        ];
        
        this.init();
    }
    
    init() {
        this.createOverlay();
        this.createTooltip();
        this.createProgressBar();
        this.bindEvents();
        
        // Check if user has completed onboarding
        if (!localStorage.getItem('onboarding-completed')) {
            this.start();
        }
    }
    
    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.id = 'onboarding-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(4px);
            z-index: 9998;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        `;
        document.body.appendChild(this.overlay);
    }
    
    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.id = 'onboarding-tooltip';
        this.tooltip.style.cssText = `
            position: absolute;
            background: var(--card-bg-glass);
            border: 1px solid var(--border-glass);
            border-radius: 12px;
            padding: 1.5rem;
            max-width: 320px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(12px);
            z-index: 10000;
            opacity: 0;
            transform: scale(0.95);
            transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
            pointer-events: none;
        `;
        document.body.appendChild(this.tooltip);
    }
    
    createProgressBar() {
        this.progressBar = document.createElement('div');
        this.progressBar.id = 'onboarding-progress';
        this.progressBar.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 200px;
            height: 4px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
            z-index: 10001;
            overflow: hidden;
        `;
        
        const progressFill = document.createElement('div');
        progressFill.style.cssText = `
            height: 100%;
            background: linear-gradient(90deg, var(--accent-color), var(--accent-color-light));
            border-radius: 2px;
            transition: width 0.3s ease;
            width: 0%;
        `;
        this.progressBar.appendChild(progressFill);
        document.body.appendChild(this.progressBar);
    }
    
    bindEvents() {
        // Skip button
        document.addEventListener('click', (e) => {
            if (e.target.matches('#onboarding-skip')) {
                this.skip();
            }
        });
        
        // Next button
        document.addEventListener('click', (e) => {
            if (e.target.matches('#onboarding-next')) {
                this.next();
            }
        });
        
        // Previous button
        document.addEventListener('click', (e) => {
            if (e.target.matches('#onboarding-prev')) {
                this.previous();
            }
        });
        
        // Escape key to skip
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isActive) {
                this.skip();
            }
        });
    }
    
    start() {
        this.isActive = true;
        this.currentStep = 0;
        this.showStep(0);
        
        // Add skip button to header
        this.addSkipButton();
    }
    
    showStep(stepIndex) {
        const step = this.steps[stepIndex];
        if (!step) return;
        
        // Update progress
        const progress = ((stepIndex + 1) / this.totalSteps) * 100;
        this.progressBar.querySelector('div').style.width = `${progress}%`;
        
        // Show overlay
        this.overlay.style.opacity = '1';
        this.overlay.style.pointerEvents = 'auto';
        
        // Position tooltip
        this.positionTooltip(step);
        
        // Update tooltip content
        this.updateTooltipContent(step, stepIndex);
        
        // Show tooltip
        this.tooltip.style.opacity = '1';
        this.tooltip.style.transform = 'scale(1)';
        this.tooltip.style.pointerEvents = 'auto';
        
        // Highlight target element
        if (step.target) {
            this.highlightElement(step.target);
        }
    }
    
    positionTooltip(step) {
        if (!step.target) {
            // Center tooltip for welcome and complete steps
            this.tooltip.style.top = '50%';
            this.tooltip.style.left = '50%';
            this.tooltip.style.transform = 'translate(-50%, -50%) scale(0.95)';
            return;
        }
        
        const target = document.querySelector(step.target);
        if (!target) {
            // Fallback to center if target not found
            this.tooltip.style.top = '50%';
            this.tooltip.style.left = '50%';
            this.tooltip.style.transform = 'translate(-50%, -50%) scale(0.95)';
            return;
        }
        
        const rect = target.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        
        let top, left;
        
        switch (step.position) {
            case 'top':
                top = rect.top - tooltipRect.height - 20;
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                break;
            case 'bottom':
                top = rect.bottom + 20;
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                break;
            case 'left':
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                left = rect.left - tooltipRect.width - 20;
                break;
            case 'right':
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                left = rect.right + 20;
                break;
            default:
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        }
        
        // Ensure tooltip stays within viewport
        top = Math.max(20, Math.min(top, window.innerHeight - tooltipRect.height - 20));
        left = Math.max(20, Math.min(left, window.innerWidth - tooltipRect.width - 20));
        
        this.tooltip.style.top = `${top}px`;
        this.tooltip.style.left = `${left}px`;
    }
    
    updateTooltipContent(step, stepIndex) {
        const isFirst = stepIndex === 0;
        const isLast = stepIndex === this.totalSteps - 1;
        
        this.tooltip.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-color);">
                    ${step.title}
                </h3>
                <p style="color: var(--text-muted-color); line-height: 1.5;">
                    ${step.description}
                </p>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 0.875rem; color: var(--text-muted-color);">
                    Step ${stepIndex + 1} of ${this.totalSteps}
                </div>
                
                <div style="display: flex; gap: 0.5rem;">
                    ${!isFirst ? '<button id="onboarding-prev" class="btn btn-outline btn-sm">Previous</button>' : ''}
                    ${isLast ? 
                        '<button id="onboarding-next" class="btn btn-primary btn-sm">Get Started</button>' : 
                        '<button id="onboarding-next" class="btn btn-primary btn-sm">Next</button>'
                    }
                </div>
            </div>
        `;
    }
    
    highlightElement(selector) {
        // Remove previous highlights
        document.querySelectorAll('.onboarding-highlight').forEach(el => {
            el.classList.remove('onboarding-highlight');
        });
        
        const target = document.querySelector(selector);
        if (target) {
            target.classList.add('onboarding-highlight');
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    addSkipButton() {
        const skipButton = document.createElement('button');
        skipButton.id = 'onboarding-skip';
        skipButton.textContent = 'Skip Tutorial';
        skipButton.className = 'btn btn-outline btn-sm';
        skipButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10002;
        `;
        document.body.appendChild(skipButton);
    }
    
    next() {
        if (this.currentStep < this.totalSteps - 1) {
            this.currentStep++;
            this.showStep(this.currentStep);
        } else {
            this.complete();
        }
    }
    
    previous() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showStep(this.currentStep);
        }
    }
    
    skip() {
        this.complete();
    }
    
    complete() {
        this.isActive = false;
        
        // Hide all elements
        this.overlay.style.opacity = '0';
        this.overlay.style.pointerEvents = 'none';
        
        this.tooltip.style.opacity = '0';
        this.tooltip.style.transform = 'scale(0.95)';
        this.tooltip.style.pointerEvents = 'none';
        
        this.progressBar.style.opacity = '0';
        
        // Remove skip button
        const skipButton = document.getElementById('onboarding-skip');
        if (skipButton) {
            skipButton.remove();
        }
        
        // Remove highlights
        document.querySelectorAll('.onboarding-highlight').forEach(el => {
            el.classList.remove('onboarding-highlight');
        });
        
        // Mark as completed
        localStorage.setItem('onboarding-completed', 'true');
        
        // Show completion message
        this.showCompletionMessage();
    }
    
    showCompletionMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--card-bg-glass);
            border: 1px solid var(--border-glass);
            border-radius: 8px;
            padding: 1rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(12px);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        message.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="color: var(--secondary-color); font-size: 1.25rem;">🎉</span>
                <span style="color: var(--text-color); font-weight: 500;">Welcome to Operator Uplift!</span>
            </div>
        `;
        
        document.body.appendChild(message);
        
        // Animate in
        setTimeout(() => {
            message.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            message.style.transform = 'translateX(100%)';
            setTimeout(() => {
                message.remove();
            }, 300);
        }, 5000);
    }
    
    // Method to restart onboarding (for testing or user preference)
    restart() {
        localStorage.removeItem('onboarding-completed');
        this.start();
    }
}

// Add CSS for highlighted elements
const onboardingStyles = document.createElement('style');
onboardingStyles.textContent = `
    .onboarding-highlight {
        position: relative;
        z-index: 9999;
        box-shadow: 0 0 0 4px var(--accent-color-glow), 0 0 20px var(--accent-color-glow);
        border-radius: 8px;
        animation: onboarding-pulse 2s infinite;
    }
    
    @keyframes onboarding-pulse {
        0%, 100% { box-shadow: 0 0 0 4px var(--accent-color-glow), 0 0 20px var(--accent-color-glow); }
        50% { box-shadow: 0 0 0 6px var(--accent-color-glow), 0 0 30px var(--accent-color-glow); }
    }
    
    #onboarding-tooltip .btn {
        font-size: 0.875rem;
        padding: 0.5rem 1rem;
    }
    
    #onboarding-tooltip .btn-outline {
        background: transparent;
        border: 1px solid var(--border-glass);
        color: var(--text-color);
    }
    
    #onboarding-tooltip .btn-outline:hover {
        background: rgba(255, 255, 255, 0.1);
    }
`;
document.head.appendChild(onboardingStyles);

// Initialize onboarding system
let onboardingSystem;

// Export for use in main app
window.OnboardingSystem = OnboardingSystem;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        onboardingSystem = new OnboardingSystem();
    });
} else {
    onboardingSystem = new OnboardingSystem();
} 