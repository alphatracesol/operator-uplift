// Authentication Module for Operator Uplift
// Handles user authentication, profile management, and security

import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    deleteUser,
    sendEmailVerification,
    sendPasswordResetEmail,
    onAuthStateChanged,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';

import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc,
    serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

class AuthManager {
    constructor() {
        this.auth = getAuth();
        this.db = getFirestore();
        this.user = null;
        this.isInitialized = false;
        this.listeners = [];
        
        this.init();
    }
    
    init() {
        // Listen for auth state changes
        onAuthStateChanged(this.auth, (user) => {
            this.user = user;
            this.isInitialized = true;
            
            if (user) {
                this.onUserSignIn(user);
            } else {
                this.onUserSignOut();
            }
            
            // Notify listeners
            this.listeners.forEach(listener => listener(user));
        });
    }
    
    // User registration
    async register(email, password, displayName = '') {
        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;
            
            // Update profile
            if (displayName) {
                await updateProfile(user, { displayName });
            }
            
            // Send verification email
            await sendEmailVerification(user);
            
            // Create user document
            await this.createUserDocument(user);
            
            return { success: true, user };
        } catch (error) {
            return { success: false, error: this.handleAuthError(error) };
        }
    }
    
    // User login
    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            return { success: false, error: this.handleAuthError(error) };
        }
    }
    
    // User logout
    async logout() {
        try {
            await signOut(this.auth);
            return { success: true };
        } catch (error) {
            return { success: false, error: this.handleAuthError(error) };
        }
    }
    
    // Password reset
    async resetPassword(email) {
        try {
            await sendPasswordResetEmail(this.auth, email);
            return { success: true };
        } catch (error) {
            return { success: false, error: this.handleAuthError(error) };
        }
    }
    
    // Delete account
    async deleteAccount() {
        try {
            if (this.user) {
                await deleteUser(this.user);
                return { success: true };
            }
            return { success: false, error: 'No user logged in' };
        } catch (error) {
            return { success: false, error: this.handleAuthError(error) };
        }
    }
    
    // Create user document in Firestore
    async createUserDocument(user) {
        const userDoc = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            profile: {
                bio: '',
                goals: [],
                preferences: {
                    theme: 'dark',
                    notifications: true,
                    privacy: 'public'
                }
            },
            stats: {
                level: 1,
                experience: 0,
                essence: 100,
                energy: 100,
                streak: 0,
                achievements: [],
                goalsCompleted: 0,
                tasksCompleted: 0
            },
            quota: {
                ai_credits: 100,
                requests: 0,
                last_reset: new Date().toISOString()
            }
        };
        
        await setDoc(doc(this.db, 'users', user.uid), userDoc);
    }
    
    // Update user profile
    async updateProfile(updates) {
        try {
            if (!this.user) throw new Error('No user logged in');
            
            // Update Firebase Auth profile
            if (updates.displayName || updates.photoURL) {
                await updateProfile(this.user, updates);
            }
            
            // Update Firestore document
            await updateDoc(doc(this.db, 'users', this.user.uid), {
                ...updates,
                lastUpdated: serverTimestamp()
            });
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // Get user data
    async getUserData() {
        try {
            if (!this.user) return null;
            
            const userDoc = await getDoc(doc(this.db, 'users', this.user.uid));
            return userDoc.exists() ? userDoc.data() : null;
        } catch (error) {
            return null;
        }
    }
    
    // Check if user is verified
    isEmailVerified() {
        return this.user ? this.user.emailVerified : false;
    }
    
    // Check if user is logged in
    isLoggedIn() {
        return !!this.user;
    }
    
    // Get current user
    getCurrentUser() {
        return this.user;
    }
    
    // Add auth state listener
    onAuthStateChange(callback) {
        this.listeners.push(callback);
        
        // Return unsubscribe function
        return () => {
            const index = this.listeners.indexOf(callback);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }
    
    // Handle auth state changes
    onUserSignIn(user) {
        // Update last login
        updateDoc(doc(this.db, 'users', user.uid), {
            lastLogin: serverTimestamp()
        }).catch(console.error);
        
        // Track analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'login', {
                method: 'email'
            });
        }
    }
    
    onUserSignOut() {
        // Track analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'logout');
        }
    }
    
    // Handle Firebase auth errors
    handleAuthError(error) {
        switch (error.code) {
            case 'auth/user-not-found':
                return 'No account found with this email address.';
            case 'auth/wrong-password':
                return 'Incorrect password. Please try again.';
            case 'auth/email-already-in-use':
                return 'An account with this email already exists.';
            case 'auth/weak-password':
                return 'Password should be at least 6 characters long.';
            case 'auth/invalid-email':
                return 'Please enter a valid email address.';
            case 'auth/too-many-requests':
                return 'Too many failed attempts. Please try again later.';
            case 'auth/network-request-failed':
                return 'Network error. Please check your connection.';
            case 'auth/requires-recent-login':
                return 'Please log in again to perform this action.';
            default:
                return error.message || 'An error occurred. Please try again.';
        }
    }
    
    // Security utilities
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        return input.replace(/[<>]/g, '');
    }
    
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    validatePassword(password) {
        return password.length >= 6;
    }
    
    // Session management
    getSessionData() {
        return {
            user: this.user,
            isVerified: this.isEmailVerified(),
            lastActivity: new Date().toISOString()
        };
    }
    
    // Export user data (GDPR compliance)
    async exportUserData() {
        try {
            if (!this.user) throw new Error('No user logged in');
            
            const userData = await this.getUserData();
            const exportData = {
                user: {
                    uid: this.user.uid,
                    email: this.user.email,
                    displayName: this.user.displayName,
                    emailVerified: this.user.emailVerified,
                    createdAt: this.user.metadata.creationTime,
                    lastSignIn: this.user.metadata.lastSignInTime
                },
                profile: userData?.profile || {},
                stats: userData?.stats || {},
                exportDate: new Date().toISOString()
            };
            
            return { success: true, data: exportData };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// Export the AuthManager class
export default AuthManager; 