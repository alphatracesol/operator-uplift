// AI Module for Operator Uplift
// Enhanced with DeepSeek integration and psychological frameworks

class AIManager {
    constructor() {
        this.providers = {
            deepseek: {
                name: 'DeepSeek',
                model: 'deepseek-ai/deepseek-coder-v2-lite-instruct',
                endpoint: 'https://api-inference.huggingface.co/models/deepseek-ai/deepseek-coder-v2-lite-instruct',
                available: true,
                free: true,
                priority: 1
            },
            gemini: {
                name: 'Gemini',
                endpoint: '/.netlify/functions/ai-proxy',
                available: false,
                free: false,
                priority: 2
            },
            claude: {
                name: 'Claude',
                endpoint: '/.netlify/functions/ai-proxy',
                available: false,
                free: false,
                priority: 3
            },
            perplexity: {
                name: 'Perplexity',
                endpoint: '/.netlify/functions/ai-proxy',
                available: false,
                free: false,
                priority: 4
            }
        };
        
        this.personalities = new Map();
        this.prompts = new Map();
        this.conversationHistory = [];
        this.isInitialized = false;
        this.userProfile = null;
        this.currentPersonality = 'mentor';
        
        // DeepSeek configuration
        this.deepseekConfig = {
            maxTokens: 1000,
            temperature: 0.7,
            topP: 0.9,
            frequencyPenalty: 0.1,
            presencePenalty: 0.1
        };
        
        this.init();
    }
    
    init() {
        this.setupPersonalities();
        this.setupPrompts();
        this.setupProviders();
        this.loadUserProfile();
        this.isInitialized = true;
        console.log('🤖 AI Manager initialized with DeepSeek integration');
    }
    
    // Load user profile from localStorage or Firebase
    loadUserProfile() {
        try {
            const stored = localStorage.getItem('operatorUplift_userProfile');
            if (stored) {
                this.userProfile = JSON.parse(stored);
                this.currentPersonality = this.userProfile.preferredPersonality || 'mentor';
            }
        } catch (error) {
            console.warn('Failed to load user profile:', error);
            this.userProfile = this.createDefaultProfile();
        }
    }
    
    // Save user profile
    saveUserProfile() {
        try {
            localStorage.setItem('operatorUplift_userProfile', JSON.stringify(this.userProfile));
        } catch (error) {
            console.warn('Failed to save user profile:', error);
        }
    }
    
    // Create default user profile
    createDefaultProfile() {
        return {
            name: 'User',
            preferredPersonality: 'mentor',
            temperament: 'sanguine',
            needsLevel: 'esteem',
            motivationStyle: 'achievement',
            goals: [],
            preferences: {
                responseLength: 'medium',
                formality: 'casual',
                focus: 'practical'
            }
        };
    }
    
    // Provider Setup
    setupProviders() {
        // Check for environment variables or API keys
        this.checkProviderAvailability();
    }
    
    // Check which providers are available
    checkProviderAvailability() {
        // DeepSeek is always available (free tier)
        this.providers.deepseek.available = true;
        
        // Check for paid providers (would be set via environment variables)
        const hasGeminiKey = typeof process !== 'undefined' && process.env.GEMINI_API_KEY;
        const hasClaudeKey = typeof process !== 'undefined' && process.env.CLAUDE_API_KEY;
        const hasPerplexityKey = typeof process !== 'undefined' && process.env.PERPLEXITY_API_KEY;
        
        this.providers.gemini.available = !!hasGeminiKey;
        this.providers.claude.available = !!hasClaudeKey;
        this.providers.perplexity.available = !!hasPerplexityKey;
    }
    
    // Personality System with Psychological Frameworks
    setupPersonalities() {
        const personalities = {
            mentor: {
                name: 'Wise Mentor',
                description: 'Focuses on long-term growth and learning',
                communicationStyle: 'thoughtful, educational, gentle',
                strengths: ['wisdom', 'patience', 'guidance'],
                psychologicalApproach: 'Maslow\'s Self-Actualization focus',
                temperamentAlignment: ['melancholic', 'phlegmatic'],
                color: '#9D00FF',
                prompts: {
                    greeting: 'Hello! I\'m here to guide you on your journey of self-improvement. What would you like to work on today?',
                    motivation: 'Remember, every step forward is progress. Let\'s break this down into manageable pieces.',
                    advice: 'Based on my experience, here\'s what I recommend...',
                    goalBreakdown: 'Let\'s analyze your goal systematically and create a step-by-step plan.',
                    encouragement: 'You\'re making excellent progress. Keep moving forward with confidence.'
                }
            },
            coach: {
                name: 'Energetic Coach',
                description: 'Creates immediate action momentum',
                communicationStyle: 'enthusiastic, dynamic, motivating',
                strengths: ['energy', 'motivation', 'achievement'],
                psychologicalApproach: 'Immediate momentum and confidence building',
                temperamentAlignment: ['sanguine', 'choleric'],
                color: '#f97316',
                prompts: {
                    greeting: 'Hey there! Ready to crush some goals today? Let\'s get after it!',
                    motivation: 'You\'ve got this! Time to push through and make it happen!',
                    advice: 'Here\'s the game plan - let\'s execute this step by step!',
                    goalBreakdown: 'Let\'s break this goal into action steps you can tackle right now!',
                    encouragement: 'That\'s the spirit! Keep that energy up and you\'ll reach your goals!'
                }
            },
            strategist: {
                name: 'Systematic Strategist',
                description: 'Optimizes for efficiency and effectiveness',
                communicationStyle: 'analytical, systematic, logical',
                strengths: ['analysis', 'optimization', 'planning'],
                psychologicalApproach: 'Data-driven and methodical progress',
                temperamentAlignment: ['melancholic', 'phlegmatic'],
                color: '#28a745',
                prompts: {
                    greeting: 'Good day. I\'m here to help you develop a strategic approach to your objectives.',
                    motivation: 'Let\'s analyze the situation and create a systematic plan for success.',
                    advice: 'From a strategic perspective, here\'s my analysis and recommendation...',
                    goalBreakdown: 'Let\'s create a systematic breakdown of your goal with clear milestones.',
                    encouragement: 'Your systematic approach is paying off. Continue with this methodical strategy.'
                }
            },
            companion: {
                name: 'Supportive Companion',
                description: 'Provides gentle, empathetic guidance',
                communicationStyle: 'gentle, supportive, understanding',
                strengths: ['empathy', 'support', 'safety'],
                psychologicalApproach: 'Emotional safety and sustainable progress',
                temperamentAlignment: ['phlegmatic', 'sanguine'],
                color: '#007BFF',
                prompts: {
                    greeting: 'Hi friend! How are you feeling today? I\'m here to support you!',
                    motivation: 'I believe in you! Let\'s tackle this together, one step at a time.',
                    advice: 'From one friend to another, here\'s what I think might help...',
                    goalBreakdown: 'Let\'s work through this together and make it feel manageable.',
                    encouragement: 'You\'re doing great! Remember to be kind to yourself along the way.'
                }
            },
            commander: {
                name: 'Decisive Commander',
                description: 'Provides clear, authoritative direction',
                communicationStyle: 'direct, authoritative, commanding',
                strengths: ['leadership', 'direction', 'control'],
                psychologicalApproach: 'Clear decisions and immediate action',
                temperamentAlignment: ['choleric', 'melancholic'],
                color: '#E0115F',
                prompts: {
                    greeting: 'Attention! I\'m here to help you achieve your objectives. What\'s your mission?',
                    motivation: 'Focus! You have the capability. Now execute with precision.',
                    advice: 'Here\'s your directive - follow this plan and you will succeed.',
                    goalBreakdown: 'Mission breakdown: Here are your objectives and timeline.',
                    encouragement: 'Excellent execution! Maintain this level of performance.'
                }
            }
        };
        
        this.personalities = new Map(Object.entries(personalities));
    }
    
    // Enhanced Prompt System
    setupPrompts() {
        const prompts = {
            // Goal-related prompts
            goalBreakdown: {
                system: 'You are an expert goal-setting coach. Break down goals into specific, actionable tasks.',
                user: 'Goal: {goal}\nCategory: {category}\nCurrent Level: {level}\n\nBreak this down into 3-5 specific, actionable tasks.',
                context: 'Consider the user\'s current level and provide tasks that are challenging but achievable.'
            },
            motivation: {
                system: 'You are a motivational coach. Provide inspiring, personalized motivation.',
                user: 'User: {name}\nCurrent Level: {level}\nStreak: {streak} days\nGoals: {goals}\n\nProvide motivation.',
                context: 'Use the user\'s name, level, and streak to create personalized motivation.'
            },
            advice: {
                system: 'You are a productivity expert. Provide practical, actionable advice.',
                user: 'User: {name}\nCurrent Situation: {situation}\n\nProvide actionable advice.',
                context: 'Focus on practical, implementable advice that the user can act on immediately.'
            },
            companionship: {
                system: 'You are a supportive AI companion. Provide empathetic, helpful responses.',
                user: '{message}',
                context: 'Be supportive, understanding, and helpful while maintaining appropriate boundaries.'
            },
            personalityAssessment: {
                system: 'You are a psychological assessment expert. Analyze user responses to determine personality traits.',
                user: 'Assessment responses: {responses}\n\nAnalyze and provide personality insights.',
                context: 'Focus on temperament, motivation style, and communication preferences.'
            }
        };
        
        this.prompts = new Map(Object.entries(prompts));
    }
    
    // Main AI call method with DeepSeek integration
    async sendMessage(message, options = {}) {
        if (!this.isInitialized) {
            throw new Error('AI Manager not initialized');
        }
        
        const personality = options.personality || this.currentPersonality;
        const context = options.context || {};
        const history = options.history || this.getConversationHistory(5);
        
        try {
            // Prepare the message with personality and context
            const preparedMessage = this.prepareMessage(message, personality, context, history);
            
            // Try DeepSeek first (free)
            let response = await this.callDeepSeek(preparedMessage);
            
            // If DeepSeek fails, try fallback providers
            if (!response) {
                response = await this.callFallbackProviders(preparedMessage);
            }
            
            // If all providers fail, use mock response
            if (!response) {
                response = this.generateMockResponse(message, personality);
            }
            
            // Add to conversation history
            this.addToHistory(message, response, personality);
            
            // Update user profile based on interaction
            this.updateUserProfile(message, response, personality);
            
            return response;
            
        } catch (error) {
            console.error('AI call failed:', error);
            return this.generateMockResponse(message, personality);
        }
    }
    
    // DeepSeek API call
    async callDeepSeek(messages) {
        try {
            const response = await fetch(this.providers.deepseek.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getHuggingFaceToken()}`
                },
                body: JSON.stringify({
                    inputs: this.formatMessagesForDeepSeek(messages),
                    parameters: this.deepseekConfig
                })
            });
            
            if (!response.ok) {
                throw new Error(`DeepSeek API error: ${response.status}`);
            }
            
            const data = await response.json();
            return this.parseDeepSeekResponse(data);
            
        } catch (error) {
            console.warn('DeepSeek call failed:', error);
            return null;
        }
    }
    
    // Get Hugging Face token (from environment or localStorage)
    getHuggingFaceToken() {
        // In production, this would come from environment variables
        // For now, we'll use a placeholder - in real deployment, set HF_TOKEN
        return process?.env?.HF_TOKEN || localStorage.getItem('hf_token') || 'hf_demo_token';
    }
    
    // Format messages for DeepSeek
    formatMessagesForDeepSeek(messages) {
        return messages.map(msg => {
            if (msg.role === 'system') {
                return `[INST] ${msg.content} [/INST]`;
            } else if (msg.role === 'user') {
                return `[INST] ${msg.content} [/INST]`;
            } else {
                return msg.content;
            }
        }).join('\n');
    }
    
    // Parse DeepSeek response
    parseDeepSeekResponse(data) {
        if (data && data[0] && data[0].generated_text) {
            return data[0].generated_text.trim();
        }
        return null;
    }
    
    // Fallback to other providers
    async callFallbackProviders(messages) {
        const availableProviders = Object.entries(this.providers)
            .filter(([key, provider]) => provider.available && !provider.free && key !== 'deepseek')
            .sort((a, b) => a[1].priority - b[1].priority);
        
        for (const [key, provider] of availableProviders) {
            try {
                const response = await this.callAIProvider(key, messages);
                if (response) return response;
            } catch (error) {
                console.warn(`${provider.name} call failed:`, error);
                continue;
            }
        }
        
        return null;
    }
    
    // Call specific AI provider
    async callAIProvider(providerKey, messages) {
        const provider = this.providers[providerKey];
        if (!provider || !provider.available) {
            throw new Error(`Provider ${providerKey} not available`);
        }
        
        // This would be implemented for paid providers
        // For now, return null to trigger fallback
        return null;
    }
    
    // Generate mock response when all providers fail
    generateMockResponse(message, personality) {
        const personalityData = this.personalities.get(personality);
        if (!personalityData) return 'I\'m here to help! What would you like to work on?';
        
        const responses = {
            mentor: [
                'I understand you\'re looking for guidance. Let\'s approach this thoughtfully.',
                'Every challenge is an opportunity for growth. What specific aspect would you like to focus on?',
                'I\'m here to support your journey. What\'s on your mind today?'
            ],
            coach: [
                'Let\'s get fired up and tackle this together! What\'s your game plan?',
                'You\'ve got the power to make this happen! What\'s your next move?',
                'Time to show what you\'re made of! What are we working on?'
            ],
            strategist: [
                'Let\'s analyze this systematically. What are your main objectives?',
                'I\'m here to help you optimize your approach. What\'s your current situation?',
                'Let\'s create a strategic plan. What are you trying to achieve?'
            ],
            companion: [
                'Hey friend! I\'m here to support you. What\'s going on?',
                'I believe in you! Let\'s work through this together.',
                'You\'re not alone in this. What can I help you with today?'
            ],
            commander: [
                'Attention! I\'m ready to help you achieve your objectives. What\'s your mission?',
                'Focus! I\'m here to provide direction. What are your goals?',
                'Let\'s get this done! What\'s your current situation?'
            ]
        };
        
        const personalityResponses = responses[personality] || responses.mentor;
        return personalityResponses[Math.floor(Math.random() * personalityResponses.length)];
    }
    
    // Prepare message with personality and context
    prepareMessage(message, personality, context, history) {
        const personalityData = this.personalities.get(personality);
        const systemPrompt = this.buildSystemPrompt(personality, context);
        
        const messages = [
            { role: 'system', content: systemPrompt }
        ];
        
        // Add conversation history
        history.forEach(entry => {
            messages.push({ role: 'user', content: entry.user });
            messages.push({ role: 'assistant', content: entry.ai });
        });
        
        // Add current message
        messages.push({ role: 'user', content: message });
        
        return messages;
    }
    
    // Build system prompt with personality and context
    buildSystemPrompt(personality, context) {
        const personalityData = this.personalities.get(personality);
        if (!personalityData) return 'You are a helpful AI assistant.';
        
        const userContext = this.userProfile ? `
User Profile:
- Name: ${this.userProfile.name}
- Preferred Personality: ${this.userProfile.preferredPersonality}
- Temperament: ${this.userProfile.temperament}
- Needs Level: ${this.userProfile.needsLevel}
- Motivation Style: ${this.userProfile.motivationStyle}
` : '';
        
        return `You are ${personalityData.name}, an AI ${personalityData.description}.

Communication Style: ${personalityData.communicationStyle}
Strengths: ${personalityData.strengths.join(', ')}
Psychological Approach: ${personalityData.psychologicalApproach}

${userContext}

Context: ${context.description || 'General conversation'}

Respond in the style of ${personalityData.name}, being ${personalityData.communicationStyle}. Keep responses concise but helpful.`;
    }
    
    // Add to conversation history
    addToHistory(userMessage, aiResponse, personality) {
        this.conversationHistory.push({
            user: userMessage,
            ai: aiResponse,
            personality: personality,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 20 conversations
        if (this.conversationHistory.length > 20) {
            this.conversationHistory = this.conversationHistory.slice(-20);
        }
    }
    
    // Get conversation history
    getConversationHistory(limit = 10) {
        return this.conversationHistory.slice(-limit);
    }
    
    // Clear conversation history
    clearConversationHistory() {
        this.conversationHistory = [];
    }
    
    // Update user profile based on interaction
    updateUserProfile(message, response, personality) {
        if (!this.userProfile) {
            this.userProfile = this.createDefaultProfile();
        }
        
        // Update preferred personality if user seems to respond well
        this.userProfile.preferredPersonality = personality;
        
        // Save updated profile
        this.saveUserProfile();
    }
    
    // Personality assessment
    async assessPersonality(responses) {
        const assessmentPrompt = this.prompts.get('personalityAssessment');
        if (!assessmentPrompt) return null;
        
        const messages = [
            { role: 'system', content: assessmentPrompt.system },
            { role: 'user', content: assessmentPrompt.user.replace('{responses}', JSON.stringify(responses)) }
        ];
        
        try {
            const analysis = await this.sendMessage(messages, { personality: 'strategist' });
            return this.parsePersonalityAnalysis(analysis);
        } catch (error) {
            console.error('Personality assessment failed:', error);
            return null;
        }
    }
    
    // Parse personality analysis
    parsePersonalityAnalysis(analysis) {
        // Simple parsing - in a real implementation, this would be more sophisticated
        const result = {
            temperament: 'sanguine',
            needsLevel: 'esteem',
            motivationStyle: 'achievement',
            communicationPreference: 'casual'
        };
        
        if (analysis.includes('analytical') || analysis.includes('thoughtful')) {
            result.temperament = 'melancholic';
        } else if (analysis.includes('energetic') || analysis.includes('enthusiastic')) {
            result.temperament = 'sanguine';
        } else if (analysis.includes('calm') || analysis.includes('patient')) {
            result.temperament = 'phlegmatic';
        } else if (analysis.includes('decisive') || analysis.includes('direct')) {
            result.temperament = 'choleric';
        }
        
        return result;
    }
    
    // Quick question methods
    async quickQuestion(type, context = {}) {
        const prompt = this.prompts.get(type);
        if (!prompt) {
            throw new Error(`Unknown prompt type: ${type}`);
        }
        
        const userProfile = this.userProfile || this.createDefaultProfile();
        const message = prompt.user
            .replace('{name}', userProfile.name)
            .replace('{level}', context.level || '1')
            .replace('{streak}', context.streak || '0')
            .replace('{goals}', context.goals || 'No goals set')
            .replace('{situation}', context.situation || 'General inquiry');
        
        const messages = [
            { role: 'system', content: prompt.system },
            { role: 'user', content: message }
        ];
        
        return await this.sendMessage(messages, { personality: this.currentPersonality });
    }
    
    // Convenience methods
    async requestMotivation() {
        return await this.quickQuestion('motivation');
    }
    
    async requestAdvice() {
        return await this.quickQuestion('advice');
    }
    
    async requestGoalBreakdown(goal) {
        return await this.quickQuestion('goalBreakdown', { goal: goal.title, category: goal.category });
    }
    
    // Get personality info
    getPersonality(key) {
        return this.personalities.get(key);
    }
    
    // Get all personalities
    getAllPersonalities() {
        return Array.from(this.personalities.entries()).map(([key, value]) => ({
            key,
            ...value
        }));
    }
    
    // Set personality
    setPersonality(key) {
        if (this.personalities.has(key)) {
            this.currentPersonality = key;
            if (this.userProfile) {
                this.userProfile.preferredPersonality = key;
                this.saveUserProfile();
            }
            return true;
        }
        return false;
    }
    
    // Get provider info
    getProvider(key) {
        return this.providers[key];
    }
    
    // Get all providers
    getAllProviders() {
        return Object.entries(this.providers).map(([key, value]) => ({
            key,
            ...value
        }));
    }
    
    // Set provider availability
    setProviderAvailability(key, available) {
        if (this.providers[key]) {
            this.providers[key].available = available;
            return true;
        }
        return false;
    }
    
    // Utility methods
    sanitizeInput(input) {
        return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    
    validateMessage(message) {
        return message && 
               typeof message === 'string' && 
               message.length > 0 && 
               message.length <= 10000;
    }
    
    // Track AI usage
    trackAIUsage(provider, personality, messageLength) {
        const usage = {
            provider,
            personality,
            messageLength,
            timestamp: new Date().toISOString()
        };
        
        // Store usage in localStorage
        try {
            const usageHistory = JSON.parse(localStorage.getItem('ai_usage_history') || '[]');
            usageHistory.push(usage);
            
            // Keep only last 100 entries
            if (usageHistory.length > 100) {
                usageHistory.splice(0, usageHistory.length - 100);
            }
            
            localStorage.setItem('ai_usage_history', JSON.stringify(usageHistory));
        } catch (error) {
            console.warn('Failed to track AI usage:', error);
        }
    }
    
    // Handle AI errors
    handleAIError(error) {
        console.error('AI Error:', error);
        
        // Log error for debugging
        const errorLog = {
            error: error.message,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };
        
        try {
            const errorHistory = JSON.parse(localStorage.getItem('ai_error_history') || '[]');
            errorHistory.push(errorLog);
            
            // Keep only last 50 errors
            if (errorHistory.length > 50) {
                errorHistory.splice(0, errorHistory.length - 50);
            }
            
            localStorage.setItem('ai_error_history', JSON.stringify(errorHistory));
        } catch (e) {
            console.warn('Failed to log AI error:', e);
        }
        
        return 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.';
    }
    
    // Cleanup
    destroy() {
        this.conversationHistory = [];
        this.isInitialized = false;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIManager;
} else {
    window.AIManager = AIManager;
} 