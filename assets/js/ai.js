// AI Module for Operator Uplift
// Handles AI integrations, prompt management, and personality systems

class AIManager {
    constructor() {
        this.providers = {
            gemini: null,
            claude: null,
            grok: null,
            perplexity: null
        };
        this.personalities = new Map();
        this.prompts = new Map();
        this.conversationHistory = [];
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        this.setupPersonalities();
        this.setupPrompts();
        this.setupProviders();
        this.isInitialized = true;
        
        console.log('🤖 AI Manager initialized');
    }
    
    // Provider Setup
    setupProviders() {
        // Initialize AI providers (these would be configured with actual API keys)
        this.providers = {
            gemini: {
                name: 'Gemini',
                endpoint: '/api/ai/gemini',
                available: true
            },
            claude: {
                name: 'Claude',
                endpoint: '/api/ai/claude',
                available: true
            },
            grok: {
                name: 'Grok',
                endpoint: '/api/ai/grok',
                available: true
            },
            perplexity: {
                name: 'Perplexity',
                endpoint: '/api/ai/perplexity',
                available: true
            }
        };
    }
    
    // Personality System
    setupPersonalities() {
        const personalities = {
            mentor: {
                name: 'Mentor',
                description: 'Wise and experienced guide',
                traits: ['patient', 'encouraging', 'knowledgeable'],
                style: 'formal',
                prompts: {
                    greeting: 'Hello! I\'m here to guide you on your journey. What would you like to work on today?',
                    motivation: 'Remember, every step forward is progress. Let\'s break this down into manageable pieces.',
                    advice: 'Based on my experience, here\'s what I recommend...'
                }
            },
            coach: {
                name: 'Coach',
                description: 'Energetic and motivating trainer',
                traits: ['energetic', 'motivating', 'direct'],
                style: 'casual',
                prompts: {
                    greeting: 'Hey there! Ready to crush some goals today? Let\'s get after it!',
                    motivation: 'You\'ve got this! Time to push through and make it happen!',
                    advice: 'Here\'s the game plan - let\'s execute this step by step!'
                }
            },
            strategist: {
                name: 'Strategist',
                description: 'Analytical and systematic planner',
                traits: ['analytical', 'systematic', 'detail-oriented'],
                style: 'professional',
                prompts: {
                    greeting: 'Good day. I\'m here to help you develop a strategic approach to your objectives.',
                    motivation: 'Let\'s analyze the situation and create a systematic plan for success.',
                    advice: 'From a strategic perspective, here\'s my analysis and recommendation...'
                }
            },
            companion: {
                name: 'Companion',
                description: 'Friendly and supportive friend',
                traits: ['friendly', 'supportive', 'empathetic'],
                style: 'conversational',
                prompts: {
                    greeting: 'Hi friend! How are you feeling today? I\'m here to support you!',
                    motivation: 'I believe in you! Let\'s tackle this together, one step at a time.',
                    advice: 'From one friend to another, here\'s what I think might help...'
                }
            },
            commander: {
                name: 'Commander',
                description: 'Direct and authoritative leader',
                traits: ['direct', 'authoritative', 'decisive'],
                style: 'commanding',
                prompts: {
                    greeting: 'Attention! I\'m here to lead you to victory. State your mission.',
                    motivation: 'Soldier, you have the skills. Now execute with precision and determination!',
                    advice: 'This is your mission briefing. Follow these orders for success.'
                }
            }
        };
        
        Object.entries(personalities).forEach(([key, personality]) => {
            this.personalities.set(key, personality);
        });
    }
    
    // Prompt Management
    setupPrompts() {
        const prompts = {
            goalCreation: {
                title: 'Goal Creation',
                template: `Create a SMART goal based on the following information:
                - User's ambition: {ambition}
                - Current situation: {situation}
                - Timeframe: {timeframe}
                - Personality type: {personality}
                
                Please provide:
                1. A specific, measurable goal
                2. Key milestones
                3. Potential obstacles and solutions
                4. Motivation strategies
                5. Success metrics`,
                variables: ['ambition', 'situation', 'timeframe', 'personality']
            },
            taskBreakdown: {
                title: 'Task Breakdown',
                template: `Break down the following goal into actionable tasks:
                - Goal: {goal}
                - Deadline: {deadline}
                - User's energy level: {energy}
                - Available time: {time}
                
                Please provide:
                1. Prioritized task list
                2. Time estimates for each task
                3. Dependencies between tasks
                4. Energy level recommendations
                5. Progress tracking suggestions`,
                variables: ['goal', 'deadline', 'energy', 'time']
            },
            motivation: {
                title: 'Motivation',
                template: `Provide motivation and encouragement for:
                - Current challenge: {challenge}
                - User's progress: {progress}
                - Personality type: {personality}
                - Current mood: {mood}
                
                Please provide:
                1. Personalized encouragement
                2. Progress acknowledgment
                3. Next steps recommendation
                4. Overcoming obstacles advice
                5. Success visualization`,
                variables: ['challenge', 'progress', 'personality', 'mood']
            },
            analysis: {
                title: 'Progress Analysis',
                template: `Analyze the user's progress and provide insights:
                - Goals completed: {completedGoals}
                - Current progress: {currentProgress}
                - Time spent: {timeSpent}
                - Energy usage: {energyUsage}
                - Achievements: {achievements}
                
                Please provide:
                1. Progress summary
                2. Pattern analysis
                3. Improvement suggestions
                4. Celebration points
                5. Next phase recommendations`,
                variables: ['completedGoals', 'currentProgress', 'timeSpent', 'energyUsage', 'achievements']
            }
        };
        
        Object.entries(prompts).forEach(([key, prompt]) => {
            this.prompts.set(key, prompt);
        });
    }
    
    // AI Communication
    async sendMessage(message, options = {}) {
        const {
            provider = 'gemini',
            personality = 'mentor',
            context = '',
            history = this.conversationHistory.slice(-5)
        } = options;
        
        try {
            // Check quota
            if (window.app && window.app.quotaManager) {
                const quotaCheck = await window.app.quotaManager.checkQuota();
                if (!quotaCheck.available) {
                    throw new Error('Daily AI limit reached. Please try again tomorrow.');
                }
            }
            
            // Prepare the message
            const preparedMessage = this.prepareMessage(message, personality, context, history);
            
            // Send to AI provider
            const response = await this.callAIProvider(provider, preparedMessage);
            
            // Consume quota
            if (window.app && window.app.quotaManager) {
                await window.app.quotaManager.consumeCredits(1);
            }
            
            // Add to conversation history
            this.addToHistory(message, response, personality);
            
            return {
                success: true,
                response,
                personality,
                provider
            };
            
        } catch (error) {
            console.error('AI communication error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    prepareMessage(message, personality, context, history) {
        const personalityData = this.personalities.get(personality);
        const systemPrompt = this.buildSystemPrompt(personalityData, context);
        
        return {
            messages: [
                { role: 'system', content: systemPrompt },
                ...history.map(h => ({
                    role: h.role,
                    content: h.content
                })),
                { role: 'user', content: message }
            ],
            personality,
            context
        };
    }
    
    buildSystemPrompt(personality, context) {
        return `You are ${personality.name}, a ${personality.description} in the Operator Uplift platform.

Your traits: ${personality.traits.join(', ')}
Your communication style: ${personality.style}

Context: ${context}

Guidelines:
- Stay in character as ${personality.name}
- Provide helpful, actionable advice
- Be encouraging and supportive
- Use the personality's communication style
- Keep responses concise but comprehensive
- Focus on practical steps and solutions

${personality.prompts.greeting}`;
    }
    
    async callAIProvider(provider, message) {
        const providerConfig = this.providers[provider];
        if (!providerConfig || !providerConfig.available) {
            throw new Error(`Provider ${provider} is not available`);
        }
        
        // This would make an actual API call to the AI provider
        // For now, we'll simulate a response
        return this.simulateAIResponse(message, provider);
    }
    
    simulateAIResponse(message, provider) {
        // Simulate AI response for development/testing
        const responses = {
            gemini: "I understand your request. Let me help you with that...",
            claude: "Based on what you've shared, here's my perspective...",
            grok: "Interesting challenge! Here's what I think...",
            perplexity: "Let me analyze this situation for you..."
        };
        
        return responses[provider] || "I'm here to help you achieve your goals!";
    }
    
    // Prompt Generation
    generatePrompt(promptType, variables) {
        const prompt = this.prompts.get(promptType);
        if (!prompt) {
            throw new Error(`Prompt type '${promptType}' not found`);
        }
        
        let content = prompt.template;
        
        // Replace variables
        Object.entries(variables).forEach(([key, value]) => {
            content = content.replace(new RegExp(`{${key}}`, 'g'), value);
        });
        
        return {
            title: prompt.title,
            content,
            variables: prompt.variables
        };
    }
    
    // Conversation Management
    addToHistory(userMessage, aiResponse, personality) {
        this.conversationHistory.push({
            role: 'user',
            content: userMessage,
            timestamp: new Date().toISOString(),
            personality
        });
        
        this.conversationHistory.push({
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date().toISOString(),
            personality
        });
        
        // Keep only last 20 messages
        if (this.conversationHistory.length > 20) {
            this.conversationHistory = this.conversationHistory.slice(-20);
        }
    }
    
    getConversationHistory(limit = 10) {
        return this.conversationHistory.slice(-limit);
    }
    
    clearConversationHistory() {
        this.conversationHistory = [];
    }
    
    // Personality Management
    getPersonality(key) {
        return this.personalities.get(key);
    }
    
    getAllPersonalities() {
        return Array.from(this.personalities.entries()).map(([key, personality]) => ({
            key,
            ...personality
        }));
    }
    
    setPersonality(key, personality) {
        this.personalities.set(key, personality);
    }
    
    // Provider Management
    getProvider(key) {
        return this.providers[key];
    }
    
    getAllProviders() {
        return Object.entries(this.providers).map(([key, provider]) => ({
            key,
            ...provider
        }));
    }
    
    setProviderAvailability(key, available) {
        if (this.providers[key]) {
            this.providers[key].available = available;
        }
    }
    
    // Utility Methods
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        return input.replace(/[<>]/g, '').trim();
    }
    
    validateMessage(message) {
        if (!message || typeof message !== 'string') {
            return { valid: false, error: 'Message must be a non-empty string' };
        }
        
        if (message.length > 1000) {
            return { valid: false, error: 'Message too long (max 1000 characters)' };
        }
        
        return { valid: true };
    }
    
    // Analytics
    trackAIUsage(provider, personality, messageLength) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'ai_interaction', {
                provider,
                personality,
                message_length: messageLength,
                event_category: 'ai'
            });
        }
    }
    
    // Error Handling
    handleAIError(error) {
        console.error('AI Error:', error);
        
        // Track error
        if (typeof gtag !== 'undefined') {
            gtag('event', 'ai_error', {
                error_message: error.message,
                event_category: 'error'
            });
        }
        
        return {
            success: false,
            error: 'AI service temporarily unavailable. Please try again later.',
            details: error.message
        };
    }
    
    // Cleanup
    destroy() {
        this.conversationHistory = [];
        this.personalities.clear();
        this.prompts.clear();
    }
}

// Export the AIManager class
export default AIManager; 