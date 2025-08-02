// UI Module for Operator Uplift
// Handles all user interface components, modals, toasts, and animations

class UIManager {
    constructor() {
        this.modals = new Map();
        this.toasts = [];
        this.animations = new Map();
        this.theme = 'dark';
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadTheme();
        this.setupAnimations();
        this.isInitialized = true;
        
        }
    
    // Modal Management
    showModal(title, content, actions = []) {
        const modalId = `modal-${Date.now()}`;
        const modal = this.createModal(title, content, actions, modalId);
        
        document.body.appendChild(modal);
        this.modals.set(modalId, modal);
        
        // Animate in
        requestAnimationFrame(() => {
            modal.classList.add('modal-visible');
        });
        
        // Focus management
        const firstInput = modal.querySelector('input, button, select, textarea');
        if (firstInput) firstInput.focus();
        
        return modalId;
    }
    
    createModal(title, content, actions, modalId) {
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-container">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    <button class="modal-close" onclick="app.ui.closeModal('${modalId}')">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <div class="modal-content">
                    ${content}
                </div>
                ${actions.length > 0 ? `
                    <div class="modal-actions">
                        ${actions.map((action, index) => `
                            <button class="btn ${action.primary ? 'btn-primary' : 'btn-secondary'}" 
                                    onclick="app.ui.handleModalAction('${modalId}', ${index})">
                                ${action.text}
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
        
        // Add event listeners
        modal.querySelector('.modal-backdrop').addEventListener('click', () => {
            this.closeModal(modalId);
        });
        
        // Keyboard support
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal(modalId);
            }
        });
        
        return modal;
    }
    
    closeModal(modalId) {
        const modal = this.modals.get(modalId);
        if (!modal) return;
        
        modal.classList.remove('modal-visible');
        
        setTimeout(() => {
            modal.remove();
            this.modals.delete(modalId);
        }, 300);
    }
    
    handleModalAction(modalId, actionIndex) {
        const modal = this.modals.get(modalId);
        if (!modal) return;
        
        const actions = modal.querySelectorAll('.modal-actions .btn');
        const action = actions[actionIndex];
        
        if (action && action.onclick) {
            action.onclick();
        }
    }
    
    // Toast Notifications
    showToast(message, type = 'info', duration = 5000) {
        const toast = this.createToast(message, type);
        document.body.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('toast-visible');
        });
        
        // Auto remove
        setTimeout(() => {
            this.removeToast(toast);
        }, duration);
        
        this.toasts.push(toast);
        return toast;
    }
    
    createToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${icons[type] || icons.info}</span>
                <span class="toast-message">${message}</span>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            </button>
        `;
        
        return toast;
    }
    
    removeToast(toast) {
        toast.classList.remove('toast-visible');
        setTimeout(() => {
            toast.remove();
            const index = this.toasts.indexOf(toast);
            if (index > -1) {
                this.toasts.splice(index, 1);
            }
        }, 300);
    }
    
    // Loading States
    showLoading(message = 'Loading...', overlay = false) {
        if (overlay) {
            return this.showLoadingOverlay(message);
        }
        
        const loading = document.createElement('div');
        loading.className = 'loading-spinner';
        loading.innerHTML = `
            <div class="spinner"></div>
            <span class="loading-text">${message}</span>
        `;
        
        document.body.appendChild(loading);
        return loading;
    }
    
    hideLoading(loadingElement) {
        if (loadingElement) {
            loadingElement.remove();
        }
    }
    
    showLoadingOverlay(message = 'Loading...') {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="spinner"></div>
                <span class="loading-text">${message}</span>
            </div>
        `;
        
        document.body.appendChild(overlay);
        return overlay;
    }
    
    // Theme Management
    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        this.saveTheme();
        
        // Track analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'theme_change', {
                theme: this.theme
            });
        }
    }
    
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        document.body.setAttribute('data-theme', this.theme);
    }
    
    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.theme = savedTheme;
        this.applyTheme();
    }
    
    saveTheme() {
        localStorage.setItem('theme', this.theme);
    }
    
    // Animations
    setupAnimations() {
        // Fade in animation
        this.animations.set('fadeIn', (element, duration = 300) => {
            element.style.opacity = '0';
            element.style.transition = `opacity ${duration}ms ease-in-out`;
            
            requestAnimationFrame(() => {
                element.style.opacity = '1';
            });
        });
        
        // Slide in animation
        this.animations.set('slideIn', (element, direction = 'up', duration = 300) => {
            const transforms = {
                up: 'translateY(20px)',
                down: 'translateY(-20px)',
                left: 'translateX(20px)',
                right: 'translateX(-20px)'
            };
            
            element.style.transform = transforms[direction] || transforms.up;
            element.style.opacity = '0';
            element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
            
            requestAnimationFrame(() => {
                element.style.transform = 'translate(0, 0)';
                element.style.opacity = '1';
            });
        });
        
        // Scale animation
        this.animations.set('scaleIn', (element, duration = 300) => {
            element.style.transform = 'scale(0.9)';
            element.style.opacity = '0';
            element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
            
            requestAnimationFrame(() => {
                element.style.transform = 'scale(1)';
                element.style.opacity = '1';
            });
        });
    }
    
    animate(element, animationType, duration) {
        const animation = this.animations.get(animationType);
        if (animation) {
            animation(element, duration);
        }
    }
    
    // Form Validation
    validateForm(formElement) {
        const inputs = formElement.querySelectorAll('input, select, textarea');
        const errors = [];
        
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                errors.push(`${input.name || input.id} is required`);
                this.showFieldError(input, 'This field is required');
            } else if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    errors.push('Please enter a valid email address');
                    this.showFieldError(input, 'Please enter a valid email address');
                }
            } else {
                this.clearFieldError(input);
            }
        });
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    showFieldError(input, message) {
        this.clearFieldError(input);
        
        input.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        input.parentNode.appendChild(errorElement);
    }
    
    clearFieldError(input) {
        input.classList.remove('error');
        const errorElement = input.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    // Responsive Utilities
    isMobile() {
        return window.innerWidth < 768;
    }
    
    isTablet() {
        return window.innerWidth >= 768 && window.innerWidth < 1024;
    }
    
    isDesktop() {
        return window.innerWidth >= 1024;
    }
    
    // Accessibility
    setupAccessibility() {
        // Skip to main content
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Focus management
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }
    
    // Event Listeners
    setupEventListeners() {
        // Theme toggle
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-theme-toggle]')) {
                this.toggleTheme();
            }
        });
        
        // Close modals on backdrop click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) {
                const modal = e.target.closest('.modal-overlay');
                if (modal) {
                    this.closeModal(modal.id);
                }
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Escape to close modals
            if (e.key === 'Escape') {
                const openModals = document.querySelectorAll('.modal-overlay.modal-visible');
                if (openModals.length > 0) {
                    this.closeModal(openModals[openModals.length - 1].id);
                }
            }
        });
    }
    
    // Utility Methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Cleanup
    destroy() {
        // Close all modals
        this.modals.forEach((modal, id) => {
            this.closeModal(id);
        });
        
        // Remove all toasts
        this.toasts.forEach(toast => {
            toast.remove();
        });
        
        this.modals.clear();
        this.toasts = [];
        this.animations.clear();
    }
}

// Export the UIManager class
export default UIManager; 