/**
 * Operator Uplift - Enhanced AI Mentor System
 * Advanced AI-powered coaching and guidance system
 */

class EnhancedAIMentor {
    constructor() {
        this.conversationHistory = [];
        this.userProfile = {};
        this.personality = 'motivational';
        this.context = {};
        this.isTyping = false;
        this.typingSpeed = 50; // ms per character
        
        this.personalities = {
            motivational: {
                name: 'Motivational Coach',
                traits: ['encouraging', 'energetic', 'goal-focused'],
                greeting: 'Hey there, champion! Ready to crush some goals today? 💪',
                style: 'enthusiastic and encouraging'
            },
            analytical: {
                name: 'Strategic Advisor',
                traits: ['logical', 'data-driven', 'systematic'],
                greeting: 'Hello! Let\'s analyze your progress and optimize your strategy. 📊',
                style: 'methodical and analytical'
            },
            supportive: {
                name: 'Supportive Guide',
                traits: ['empathetic', 'patient', 'understanding'],
                greeting: 'Hi there! I\'m here to support you on your journey. How are you feeling today? 🤗',
                style: 'caring and supportive'
            },
            challenging: {
                name: 'Challenge Master',
                traits: ['direct', 'pushing', 'growth-focused'],
                greeting: 'What\'s your next challenge? Let\'s push your limits! 🔥',
                style: 'direct and challenging'
            }
        };
        
        this.goalTemplates = [
            {
                category: 'Fitness',
                goals: [
                    'Build a consistent workout routine',
                    'Improve cardiovascular endurance',
                    'Build strength and muscle',
                    'Develop flexibility and mobility',
                    'Establish healthy eating habits'
                ]
            },
            {
                category: 'Productivity',
                goals: [
                    'Master time management skills',
                    'Develop a morning routine',
                    'Improve focus and concentration',
                    'Learn to prioritize effectively',
                    'Build better work habits'
                ]
            },
            {
                category: 'Learning',
                goals: [
                    'Learn a new skill or language',
                    'Read more books regularly',
                    'Take an online course',
                    'Develop critical thinking',
                    'Expand knowledge in your field'
                ]
            },
            {
                category: 'Personal Development',
                goals: [
                    'Build self-confidence',
                    'Improve communication skills',
                    'Develop emotional intelligence',
                    'Practice mindfulness and meditation',
                    'Build better relationships'
                ]
            },
            {
                category: 'Career',
                goals: [
                    'Advance in your career',
                    'Develop leadership skills',
                    'Build professional network',
                    'Learn new technologies',
                    'Improve work-life balance'
                ]
            }
        ];
        
        this.init();
    }
    
    init() {
        this.loadUserProfile();
        this.setupEventListeners();
        this.initializeConversation();
    }
    
    loadUserProfile() {
        const savedProfile = localStorage.getItem('ai-mentor-profile');
        if (savedProfile) {
            this.userProfile = JSON.parse(savedProfile);
        } else {
            this.userProfile = {
                name: 'Operator',
                experience: 'beginner',
                preferences: {
                    personality: 'motivational',
                    communicationStyle: 'casual',
                    goalCategories: [],
                    notificationPreferences: 'moderate'
                },
                stats: {
                    goalsCompleted: 0,
                    totalEssence: 0,
                    streakDays: 0,
                    averageCompletionRate: 0
                },
                goals: [],
                achievements: []
            };
        }
        
        this.personality = this.userProfile.preferences.personality || 'motivational';
    }
    
    setupEventListeners() {
        // Listen for goal completion events
        document.addEventListener('goalCompleted', (e) => {
            this.handleGoalCompletion(e.detail);
        });
        
        // Listen for streak updates
        document.addEventListener('streakUpdated', (e) => {
            this.handleStreakUpdate(e.detail);
        });
        
        // Listen for achievement unlocks
        document.addEventListener('achievementUnlocked', (e) => {
            this.handleAchievementUnlock(e.detail);
        });
    }
    
    initializeConversation() {
        const greeting = this.personalities[this.personality].greeting;
        this.addMessage('mentor', greeting, 'greeting');
        
        // Add initial suggestions
        setTimeout(() => {
            this.suggestInitialActions();
        }, 2000);
    }
    
    async sendMessage(message, context = {}) {
        if (this.isTyping) return;
        
        // Add user message to history
        this.addMessage('user', message, 'user-input');
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Prepare context for AI
            const aiContext = {
                userProfile: this.userProfile,
                personality: this.personalities[this.personality],
                conversationHistory: this.conversationHistory.slice(-5), // Last 5 messages
                currentGoals: this.getCurrentGoals(),
                recentAchievements: this.getRecentAchievements(),
                ...context
            };
            
            // Generate AI response
            const response = await this.generateAIResponse(message, aiContext);
            
            // Hide typing indicator and show response
            this.hideTypingIndicator();
            this.addMessage('mentor', response.content, response.type, response.actions);
            
            // Update user profile based on interaction
            this.updateUserProfile(message, response);
            
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('mentor', 'I apologize, but I\'m having trouble processing that right now. Could you try rephrasing?', 'error');
        }
    }
    
    async generateAIResponse(message, context) {
        // Enhanced AI response generation with personality and context
        const response = {
            content: '',
            type: 'general',
            actions: []
        };
        
        // Analyze message intent
        const intent = this.analyzeIntent(message);
        
        // Generate response based on intent and personality
        switch (intent.type) {
            case 'goal-setting':
                response.content = this.generateGoalSettingResponse(intent, context);
                response.type = 'goal-suggestion';
                response.actions = this.generateGoalActions(intent);
                break;
                
            case 'progress-check':
                response.content = this.generateProgressResponse(context);
                response.type = 'progress-report';
                response.actions = this.generateProgressActions(context);
                break;
                
            case 'motivation':
                response.content = this.generateMotivationalResponse(context);
                response.type = 'motivation';
                break;
                
            case 'help':
                response.content = this.generateHelpResponse(intent, context);
                response.type = 'help';
                break;
                
            case 'celebration':
                response.content = this.generateCelebrationResponse(context);
                response.type = 'celebration';
                break;
                
            default:
                response.content = this.generateGeneralResponse(message, context);
                response.type = 'general';
        }
        
        return response;
    }
    
    analyzeIntent(message) {
        const lowerMessage = message.toLowerCase();
        
        // Goal setting patterns
        if (lowerMessage.includes('goal') || lowerMessage.includes('achieve') || lowerMessage.includes('want to')) {
            return { type: 'goal-setting', category: this.extractGoalCategory(lowerMessage) };
        }
        
        // Progress check patterns
        if (lowerMessage.includes('progress') || lowerMessage.includes('how am i') || lowerMessage.includes('status')) {
            return { type: 'progress-check' };
        }
        
        // Motivation patterns
        if (lowerMessage.includes('motivated') || lowerMessage.includes('tired') || lowerMessage.includes('stuck')) {
            return { type: 'motivation' };
        }
        
        // Help patterns
        if (lowerMessage.includes('help') || lowerMessage.includes('how to') || lowerMessage.includes('what should')) {
            return { type: 'help', topic: this.extractHelpTopic(lowerMessage) };
        }
        
        // Celebration patterns
        if (lowerMessage.includes('completed') || lowerMessage.includes('finished') || lowerMessage.includes('done')) {
            return { type: 'celebration' };
        }
        
        return { type: 'general' };
    }
    
    generateGoalSettingResponse(intent, context) {
        const personality = this.personalities[this.personality];
        const suggestions = this.getGoalSuggestions(intent.category);
        
        switch (this.personality) {
            case 'motivational':
                return `Awesome! Setting goals is the first step to greatness! 🎯\n\nHere are some powerful goals to consider:\n${suggestions.map(s => `• ${s}`).join('\n')}\n\nWhich one resonates with you? Let's make it happen! 💪`;
                
            case 'analytical':
                return `Excellent! Goal setting requires strategic thinking. 📊\n\nBased on your profile, here are some well-structured goals:\n${suggestions.map(s => `• ${s}`).join('\n')}\n\nLet's analyze which aligns best with your current objectives.`;
                
            case 'supportive':
                return `That's wonderful! Setting goals shows you're ready for positive change. 🤗\n\nHere are some gentle, achievable goals to consider:\n${suggestions.map(s => `• ${s}`).join('\n')}\n\nTake your time choosing what feels right for you.`;
                
            case 'challenging':
                return `Good! Now let's set some REAL goals that will push you! 🔥\n\nHere are some challenging but achievable goals:\n${suggestions.map(s => `• ${s}`).join('\n')}\n\nWhich one will you commit to? No excuses!`;
        }
    }
    
    generateProgressResponse(context) {
        const stats = context.userProfile.stats;
        const personality = this.personalities[this.personality];
        
        const progressText = `
📈 **Your Progress Report:**

🎯 Goals Completed: ${stats.goalsCompleted}
⚡ Total Essence: ${stats.totalEssence}
🔥 Current Streak: ${stats.streakDays} days
📊 Completion Rate: ${stats.averageCompletionRate}%
        `;
        
        switch (this.personality) {
            case 'motivational':
                return `${progressText}\n\nYou're absolutely crushing it! Keep that momentum going! 🚀`;
                
            case 'analytical':
                return `${progressText}\n\nYour data shows consistent improvement. Let's optimize for even better results.`;
                
            case 'supportive':
                return `${progressText}\n\nYou're doing great! Every step forward is progress worth celebrating. 🌟`;
                
            case 'challenging':
                return `${progressText}\n\nGood progress, but I know you can do even better. What's your next challenge?`;
        }
    }
    
    generateMotivationalResponse(context) {
        const motivationalQuotes = [
            "The only way to do great work is to love what you do. - Steve Jobs",
            "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
            "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
            "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
            "The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt"
        ];
        
        const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
        
        switch (this.personality) {
            case 'motivational':
                return `Remember this: "${randomQuote}"\n\nYou've got this! Every challenge is an opportunity to grow stronger! 💪`;
                
            case 'analytical':
                return `Let's break this down: "${randomQuote}"\n\nAnalyze what's holding you back and create a systematic plan to overcome it.`;
                
            case 'supportive':
                return `It's okay to feel this way. "${randomQuote}"\n\nTake a deep breath and remember: you're stronger than you think. 🤗`;
                
            case 'challenging':
                return `"${randomQuote}"\n\nStop making excuses! Get up and get moving! The only person stopping you is YOU! 🔥`;
        }
    }
    
    generateHelpResponse(intent, context) {
        const helpTopics = {
            'goal-setting': 'To set a goal, simply tell me what you want to achieve. I\'ll help you break it down into manageable steps!',
            'motivation': 'When you\'re feeling unmotivated, try breaking your goal into smaller tasks, or focus on the progress you\'ve already made.',
            'progress': 'I can help you track your progress! Just ask me "How am I doing?" or "Show my progress" anytime.',
            'achievements': 'Complete tasks and goals to earn Essence points and unlock achievements. Keep your streak going for bonus rewards!'
        };
        
        const topic = intent.topic || 'general';
        const helpText = helpTopics[topic] || 'I\'m here to help! You can ask me about goal setting, motivation, progress tracking, or achievements.';
        
        return `Here's how I can help: ${helpText}\n\nWhat specific area would you like to focus on?`;
    }
    
    generateCelebrationResponse(context) {
        const celebrations = [
            "🎉 INCREDIBLE! You did it! That's what I'm talking about!",
            "🏆 CHAMPION! Another goal conquered! You're unstoppable!",
            "🌟 AMAZING! You've proven once again that you can achieve anything!",
            "🚀 FANTASTIC! You're building momentum like a rocket!",
            "💎 BRILLIANT! You're turning your dreams into reality!"
        ];
        
        const randomCelebration = celebrations[Math.floor(Math.random() * celebrations.length)];
        
        return `${randomCelebration}\n\nYou've earned bonus Essence points for this achievement! Keep up the incredible work! ⚡`;
    }
    
    generateGeneralResponse(message, context) {
        const personality = this.personalities[this.personality];
        
        switch (this.personality) {
            case 'motivational':
                return "I love your energy! Let's keep pushing forward together! What's on your mind? 💪";
                
            case 'analytical':
                return "I'm here to help you optimize your approach. What would you like to work on today?";
                
            case 'supportive':
                return "I'm here for you! How can I support you on your journey today? 🤗";
                
            case 'challenging':
                return "Time to get serious! What challenge are you ready to tackle today? 🔥";
        }
    }
    
    getGoalSuggestions(category = null) {
        if (category) {
            const template = this.goalTemplates.find(t => 
                t.category.toLowerCase().includes(category) || 
                category.includes(t.category.toLowerCase())
            );
            return template ? template.goals.slice(0, 3) : this.getRandomGoals(3);
        }
        
        return this.getRandomGoals(3);
    }
    
    getRandomGoals(count = 3) {
        const allGoals = this.goalTemplates.flatMap(t => t.goals);
        const shuffled = allGoals.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
    
    extractGoalCategory(message) {
        const categories = this.goalTemplates.map(t => t.category.toLowerCase());
        return categories.find(cat => message.includes(cat)) || null;
    }
    
    extractHelpTopic(message) {
        const topics = ['goal-setting', 'motivation', 'progress', 'achievements'];
        return topics.find(topic => message.includes(topic)) || null;
    }
    
    generateGoalActions(intent) {
        return [
            { type: 'button', text: 'Set Fitness Goal', action: 'set-goal', category: 'fitness' },
            { type: 'button', text: 'Set Productivity Goal', action: 'set-goal', category: 'productivity' },
            { type: 'button', text: 'Set Learning Goal', action: 'set-goal', category: 'learning' }
        ];
    }
    
    generateProgressActions(context) {
        return [
            { type: 'button', text: 'View Detailed Stats', action: 'view-stats' },
            { type: 'button', text: 'Set New Goal', action: 'set-goal' },
            { type: 'button', text: 'Get Motivation', action: 'get-motivation' }
        ];
    }
    
    addMessage(sender, content, type, actions = []) {
        const message = {
            id: Date.now(),
            sender,
            content,
            type,
            actions,
            timestamp: new Date().toISOString()
        };
        
        this.conversationHistory.push(message);
        this.displayMessage(message);
        
        // Save conversation history (keep last 50 messages)
        if (this.conversationHistory.length > 50) {
            this.conversationHistory = this.conversationHistory.slice(-50);
        }
        
        localStorage.setItem('ai-mentor-conversation', JSON.stringify(this.conversationHistory));
    }
    
    displayMessage(message) {
        const container = document.getElementById('ai-mentor-messages') || this.createMessageContainer();
        
        const messageElement = document.createElement('div');
        messageElement.className = `ai-message ${message.sender}-message ${message.type}-message`;
        messageElement.innerHTML = `
            <div class="message-content">
                <div class="message-text">${this.formatMessageContent(message.content)}</div>
                ${message.actions.length > 0 ? this.renderActions(message.actions) : ''}
            </div>
            <div class="message-timestamp">${this.formatTimestamp(message.timestamp)}</div>
        `;
        
        container.appendChild(messageElement);
        container.scrollTop = container.scrollHeight;
        
        // Add typing animation for mentor messages
        if (message.sender === 'mentor') {
            this.animateTyping(messageElement);
        }
    }
    
    createMessageContainer() {
        const container = document.createElement('div');
        container.id = 'ai-mentor-messages';
        container.className = 'ai-messages-container';
        container.style.cssText = `
            max-height: 400px;
            overflow-y: auto;
            padding: 1rem;
            background: var(--card-bg-glass);
            border-radius: 8px;
            margin-bottom: 1rem;
        `;
        
        const mentorWidget = document.getElementById('ai-mentor-widget');
        if (mentorWidget) {
            mentorWidget.appendChild(container);
        }
        
        return container;
    }
    
    formatMessageContent(content) {
        // Convert markdown-like formatting to HTML
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/🎯|⚡|🔥|📊|🤗|💪|🚀|🌟|🏆|💎/g, '<span class="emoji">$&</span>');
    }
    
    renderActions(actions) {
        if (actions.length === 0) return '';
        
        const actionsHtml = actions.map(action => {
            if (action.type === 'button') {
                return `<button class="ai-action-btn" data-action="${action.action}" data-category="${action.category || ''}">${action.text}</button>`;
            }
            return '';
        }).join('');
        
        return `<div class="message-actions">${actionsHtml}</div>`;
    }
    
    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    animateTyping(messageElement) {
        const textElement = messageElement.querySelector('.message-text');
        const originalText = textElement.innerHTML;
        textElement.innerHTML = '';
        
        let index = 0;
        const typeWriter = () => {
            if (index < originalText.length) {
                textElement.innerHTML += originalText.charAt(index);
                index++;
                setTimeout(typeWriter, this.typingSpeed);
            }
        };
        
        typeWriter();
    }
    
    showTypingIndicator() {
        this.isTyping = true;
        const container = document.getElementById('ai-mentor-messages') || this.createMessageContainer();
        
        const typingElement = document.createElement('div');
        typingElement.id = 'typing-indicator';
        typingElement.className = 'ai-message mentor-message typing-message';
        typingElement.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        container.appendChild(typingElement);
        container.scrollTop = container.scrollHeight;
    }
    
    hideTypingIndicator() {
        this.isTyping = false;
        const typingElement = document.getElementById('typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }
    
    suggestInitialActions() {
        const suggestions = [
            "What goal would you like to work on today?",
            "How can I help you stay motivated?",
            "Would you like to check your progress?",
            "Need help with anything specific?"
        ];
        
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        this.addMessage('mentor', randomSuggestion, 'suggestion');
    }
    
    handleGoalCompletion(goalData) {
        const celebration = this.generateCelebrationResponse({ goal: goalData });
        this.addMessage('mentor', celebration, 'celebration');
        
        // Update user profile
        this.userProfile.stats.goalsCompleted++;
        this.userProfile.stats.totalEssence += goalData.essence || 10;
        this.saveUserProfile();
    }
    
    handleStreakUpdate(streakData) {
        if (streakData.days > this.userProfile.stats.streakDays) {
            this.addMessage('mentor', `🔥 NEW STREAK RECORD! ${streakData.days} days and counting! You're on fire! 🔥`, 'achievement');
        }
        
        this.userProfile.stats.streakDays = streakData.days;
        this.saveUserProfile();
    }
    
    handleAchievementUnlock(achievementData) {
        this.addMessage('mentor', `🏆 ACHIEVEMENT UNLOCKED: ${achievementData.name}! ${achievementData.description}`, 'achievement');
        
        this.userProfile.achievements.push(achievementData);
        this.saveUserProfile();
    }
    
    updateUserProfile(message, response) {
        // Update communication preferences based on interaction
        if (response.type === 'goal-suggestion') {
            this.userProfile.preferences.goalCategories.push(response.category);
        }
        
        this.saveUserProfile();
    }
    
    saveUserProfile() {
        localStorage.setItem('ai-mentor-profile', JSON.stringify(this.userProfile));
    }
    
    getCurrentGoals() {
        // This would integrate with the main app's goal system
        return this.userProfile.goals || [];
    }
    
    getRecentAchievements() {
        return this.userProfile.achievements.slice(-3) || [];
    }
    
    changePersonality(newPersonality) {
        if (this.personalities[newPersonality]) {
            this.personality = newPersonality;
            this.userProfile.preferences.personality = newPersonality;
            this.saveUserProfile();
            
            const personality = this.personalities[newPersonality];
            this.addMessage('mentor', `Personality changed to ${personality.name}! ${personality.greeting}`, 'personality-change');
        }
    }
    
    getPersonalityOptions() {
        return Object.keys(this.personalities).map(key => ({
            key,
            ...this.personalities[key]
        }));
    }
}

// Add enhanced AI mentor styles
const aiMentorStyles = document.createElement('style');
aiMentorStyles.textContent = `
    .ai-messages-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .ai-message {
        display: flex;
        flex-direction: column;
        max-width: 80%;
    }
    
    .user-message {
        align-self: flex-end;
        background: var(--accent-color);
        color: white;
        border-radius: 12px 12px 4px 12px;
        padding: 0.75rem 1rem;
    }
    
    .mentor-message {
        align-self: flex-start;
        background: var(--card-bg-glass);
        border: 1px solid var(--border-glass);
        border-radius: 12px 12px 12px 4px;
        padding: 0.75rem 1rem;
    }
    
    .message-content {
        margin-bottom: 0.5rem;
    }
    
    .message-text {
        line-height: 1.5;
        white-space: pre-line;
    }
    
    .message-timestamp {
        font-size: 0.75rem;
        color: var(--text-muted-color);
        align-self: flex-end;
    }
    
    .message-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.75rem;
        flex-wrap: wrap;
    }
    
    .ai-action-btn {
        background: var(--accent-color);
        color: white;
        border: none;
        border-radius: 6px;
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .ai-action-btn:hover {
        background: var(--accent-color-light);
        transform: translateY(-1px);
    }
    
    .typing-dots {
        display: flex;
        gap: 4px;
        padding: 0.5rem;
    }
    
    .typing-dots span {
        width: 8px;
        height: 8px;
        background: var(--text-muted-color);
        border-radius: 50%;
        animation: typing-bounce 1.4s infinite ease-in-out;
    }
    
    .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
    .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
    
    @keyframes typing-bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
    }
    
    .emoji {
        font-size: 1.1em;
        display: inline-block;
        animation: emoji-bounce 0.6s ease-in-out;
    }
    
    @keyframes emoji-bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    
    .celebration-message {
        background: linear-gradient(135deg, var(--accent-color), var(--accent-color-light));
        color: white;
        animation: celebration-pulse 2s ease-in-out;
    }
    
    @keyframes celebration-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    .achievement-message {
        background: linear-gradient(135deg, var(--secondary-color), #059669);
        color: white;
        border: 2px solid var(--secondary-color);
    }
    
    .personality-change-message {
        background: linear-gradient(135deg, var(--info-color), #1d4ed8);
        color: white;
    }
`;

document.head.appendChild(aiMentorStyles);

// Initialize enhanced AI mentor
let enhancedAIMentor;

// Export for use in main app
window.EnhancedAIMentor = EnhancedAIMentor;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        enhancedAIMentor = new EnhancedAIMentor();
    });
} else {
    enhancedAIMentor = new EnhancedAIMentor();
} 