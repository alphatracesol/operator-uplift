// AI Agents Configuration for Operator Uplift
// Enhanced with psychological frameworks and adaptive personality system

class AIAgentManager {
    constructor() {
        this.personalities = {
            mentor: {
                name: 'Wise Mentor',
                description: 'Focuses on long-term growth and learning',
                communicationStyle: 'thoughtful, educational, gentle',
                strengths: ['wisdom', 'patience', 'guidance'],
                psychologicalApproach: 'Maslow\'s Self-Actualization focus',
                temperamentAlignment: ['melancholic', 'phlegmatic'],
                color: '#9D00FF'
            },
            coach: {
                name: 'Energetic Coach',
                description: 'Creates immediate action momentum',
                communicationStyle: 'enthusiastic, dynamic, motivating',
                strengths: ['energy', 'motivation', 'achievement'],
                psychologicalApproach: 'Immediate momentum and confidence building',
                temperamentAlignment: ['sanguine', 'choleric'],
                color: '#f97316'
            },
            strategist: {
                name: 'Systematic Strategist',
                description: 'Optimizes for efficiency and effectiveness',
                communicationStyle: 'analytical, systematic, logical',
                strengths: ['analysis', 'optimization', 'planning'],
                psychologicalApproach: 'Data-driven and methodical progress',
                temperamentAlignment: ['melancholic', 'phlegmatic'],
                color: '#28a745'
            },
            companion: {
                name: 'Supportive Companion',
                description: 'Provides gentle, empathetic guidance',
                communicationStyle: 'gentle, supportive, understanding',
                strengths: ['empathy', 'support', 'safety'],
                psychologicalApproach: 'Emotional safety and sustainable progress',
                temperamentAlignment: ['phlegmatic', 'sanguine'],
                color: '#007BFF'
            },
            commander: {
                name: 'Decisive Commander',
                description: 'Provides clear, authoritative direction',
                communicationStyle: 'direct, authoritative, commanding',
                strengths: ['leadership', 'direction', 'control'],
                psychologicalApproach: 'Clear decisions and immediate action',
                temperamentAlignment: ['choleric', 'melancholic'],
                color: '#E0115F'
            }
        };

        this.userProfiles = {
            // Maslow's Hierarchy of Needs integration
            needsLevels: {
                basic: { level: 1, focus: 'Safety and Security', triggers: ['fear', 'uncertainty'] },
                belonging: { level: 2, focus: 'Connection and Community', triggers: ['loneliness', 'isolation'] },
                esteem: { level: 3, focus: 'Achievement and Recognition', triggers: ['failure', 'inadequacy'] },
                selfActualization: { level: 4, focus: 'Growth and Purpose', triggers: ['stagnation', 'meaninglessness'] }
            },

            // Four Temperaments integration
            temperaments: {
                choleric: {
                    traits: ['decisive', 'ambitious', 'leader', 'impatient'],
                    motivation: 'achievement and control',
                    communication: 'direct and authoritative',
                    stressResponse: 'aggressive action',
                    idealAgent: 'commander'
                },
                melancholic: {
                    traits: ['analytical', 'perfectionist', 'thoughtful', 'sensitive'],
                    motivation: 'excellence and understanding',
                    communication: 'detailed and thoughtful',
                    stressResponse: 'withdrawal and analysis',
                    idealAgent: 'strategist'
                },
                sanguine: {
                    traits: ['enthusiastic', 'social', 'optimistic', 'impulsive'],
                    motivation: 'connection and excitement',
                    communication: 'energetic and engaging',
                    stressResponse: 'seeking support',
                    idealAgent: 'coach'
                },
                phlegmatic: {
                    traits: ['calm', 'patient', 'diplomatic', 'indecisive'],
                    motivation: 'harmony and stability',
                    communication: 'gentle and supportive',
                    stressResponse: 'avoidance and patience',
                    idealAgent: 'companion'
                }
            }
        };

        // Initialize prompt manager if available
        this.promptManager = window.AIPromptManager ? new window.AIPromptManager() : null;
    }

    // Analyze user profile and determine optimal personality
    analyzeUserProfile(userData) {
        const analysis = {
            temperament: this.determineTemperament(userData),
            needsLevel: this.calculateNeedsLevel(userData),
            motivationPatterns: this.analyzeMotivationPatterns(userData),
            psychologicalBarriers: this.identifyPsychologicalBarriers(userData),
            optimalPersonality: null,
            confidence: 0
        };

        // Determine optimal AI personality based on analysis
        analysis.optimalPersonality = this.determinePersonality(analysis);
        analysis.confidence = this.calculateConfidence(analysis);

        return analysis;
    }

    // Determine user's temperament based on behavior patterns
    determineTemperament(userData) {
        const patterns = {
            choleric: 0,
            melancholic: 0,
            sanguine: 0,
            phlegmatic: 0
        };

        // Analyze goal completion patterns
        const completionRate = userData.stats.completedGoals / Math.max(userData.stats.totalGoals, 1);
        if (completionRate > 0.8) patterns.choleric += 2; // High achiever
        if (completionRate < 0.3) patterns.phlegmatic += 2; // More patient

        // Analyze streak patterns
        const streak = userData.stats.currentStreak;
        if (streak > 14) patterns.sanguine += 2; // Enthusiastic maintainer
        if (streak === 0) patterns.melancholic += 1; // Perfectionist who stops when imperfect

        // Analyze goal complexity
        const goals = userData.goals || [];
        const avgTasks = goals.reduce((sum, goal) => sum + (Object.keys(goal.tasks || {}).length), 0) / Math.max(goals.length, 1);
        if (avgTasks > 5) patterns.melancholic += 2; // Complex, analytical goals
        if (avgTasks < 2) patterns.choleric += 1; // Quick, decisive goals

        // Analyze energy patterns
        const energy = userData.stats.energy.value;
        if (energy > 80) patterns.sanguine += 1; // High energy
        if (energy < 30) patterns.phlegmatic += 1; // Calm, patient

        // Return dominant temperament
        const maxScore = Math.max(...Object.values(patterns));
        const dominant = Object.keys(patterns).find(key => patterns[key] === maxScore);
        
        return {
            type: dominant,
            scores: patterns,
            confidence: maxScore / 6 // Normalize confidence
        };
    }

    // Calculate user's current needs level (Maslow's hierarchy)
    calculateNeedsLevel(userData) {
        const stats = userData.stats;
        const level = stats.level;
        const streak = stats.currentStreak;
        const completionRate = stats.completedGoals / Math.max(stats.totalGoals, 1);

        if (level < 3 || streak === 0) {
            return { level: 'basic', focus: 'Safety and Security', priority: 'high' };
        } else if (level < 7 || completionRate < 0.5) {
            return { level: 'belonging', focus: 'Connection and Achievement', priority: 'medium' };
        } else if (level < 12 || completionRate < 0.8) {
            return { level: 'esteem', focus: 'Recognition and Mastery', priority: 'medium' };
        } else {
            return { level: 'selfActualization', focus: 'Growth and Purpose', priority: 'low' };
        }
    }

    // Analyze motivation patterns
    analyzeMotivationPatterns(userData) {
        const patterns = {
            achievement: 0,
            learning: 0,
            connection: 0,
            control: 0
        };

        // Analyze goal categories
        const goals = userData.goals || [];
        const categories = goals.map(g => g.category).filter(Boolean);
        
        categories.forEach(category => {
            if (['career', 'fitness', 'productivity'].includes(category)) patterns.achievement += 1;
            if (['learning', 'skill', 'education'].includes(category)) patterns.learning += 1;
            if (['social', 'relationship', 'community'].includes(category)) patterns.connection += 1;
            if (['organization', 'planning', 'management'].includes(category)) patterns.control += 1;
        });

        return patterns;
    }

    // Identify psychological barriers
    identifyPsychologicalBarriers(userData) {
        const barriers = [];
        const stats = userData.stats;

        if (stats.currentStreak === 0) barriers.push('loss_of_momentum');
        if (stats.energy.value < 30) barriers.push('low_energy');
        if (stats.completedGoals === 0) barriers.push('fear_of_failure');
        if (stats.completedGoals / Math.max(stats.totalGoals, 1) < 0.3) barriers.push('perfectionism');
        if (Object.keys(userData.goals || {}).length === 0) barriers.push('uncertainty');

        return barriers;
    }

    // Determine optimal AI personality based on analysis
    determinePersonality(profile) {
        const temperament = profile.temperament.type;
        const needsLevel = profile.needsLevel.level;
        const barriers = profile.psychologicalBarriers;

        // Map temperament to ideal agent
        const temperamentMap = {
            choleric: 'commander',
            melancholic: 'strategist',
            sanguine: 'coach',
            phlegmatic: 'companion'
        };

        let optimal = temperamentMap[temperament];

        // Adjust based on needs level
        if (needsLevel === 'basic' && barriers.includes('fear_of_failure')) {
            optimal = 'companion'; // Need emotional safety
        } else if (needsLevel === 'esteem' && barriers.includes('perfectionism')) {
            optimal = 'mentor'; // Need wisdom and perspective
        } else if (needsLevel === 'selfActualization') {
            optimal = 'mentor'; // Focus on growth and learning
        }

        // Adjust based on specific barriers
        if (barriers.includes('loss_of_momentum')) {
            optimal = 'coach'; // Need energy and motivation
        } else if (barriers.includes('uncertainty')) {
            optimal = 'strategist'; // Need clear planning
        }

        return optimal;
    }

    // Calculate confidence in personality recommendation
    calculateConfidence(analysis) {
        let confidence = 0.5; // Base confidence

        // Higher confidence if temperament is clear
        confidence += analysis.temperament.confidence * 0.3;

        // Higher confidence if needs level is clear
        if (analysis.needsLevel.priority === 'high') confidence += 0.2;

        // Lower confidence if many barriers
        confidence -= analysis.psychologicalBarriers.length * 0.1;

        return Math.max(0.1, Math.min(1.0, confidence));
    }

    // Get personalized prompt for specific interaction
    getPersonalizedPrompt(context, userData, interactionType = 'taskBreakdown') {
        if (!this.promptManager) {
            return this.getBasePrompt(context, 'mentor'); // Fallback
        }

        // Analyze user profile
        const profile = this.analyzeUserProfile(userData);
        const personality = profile.optimalPersonality;

        // Generate personalized prompt
        switch (interactionType) {
            case 'taskBreakdown':
                return this.promptManager.getTaskBreakdownPrompt(context, personality, userData);
            case 'motivation':
                return this.promptManager.getMotivationPrompt(context, personality, userData);
            case 'advice':
                return this.promptManager.getAdvicePrompt(context, personality, userData);
            case 'goalOptimization':
                return this.promptManager.getGoalOptimizationPrompt(personality, userData);
            case 'personalityAnalysis':
                return this.promptManager.getPersonalityAnalysisPrompt(userData);
            case 'adaptiveResponse':
                return this.promptManager.getAdaptiveResponsePrompt(
                    context.currentContext,
                    context.userState,
                    context.recentInteraction,
                    context.psychologicalNeeds,
                    personality,
                    userData
                );
            default:
                return this.getBasePrompt(context, personality);
        }
    }

    // Fallback base prompt system
    getBasePrompt(context, personality) {
        const basePrompts = {
            mentor: `As a wise mentor, provide thoughtful guidance focused on long-term growth and learning. Consider the user's journey and provide educational insights.`,
            coach: `As an energetic coach, create immediate action momentum! Use dynamic language that builds confidence and celebrates progress.`,
            strategist: `As a systematic strategist, provide analytical guidance focused on efficiency and optimization. Use data-driven insights and logical progression.`,
            companion: `As a supportive companion, provide gentle, empathetic guidance. Focus on emotional safety and sustainable progress.`,
            commander: `As a decisive commander, provide clear, authoritative direction. Focus on immediate action and taking control.`
        };

        return basePrompts[personality] || basePrompts.mentor;
    }

    // Get user context for AI interactions
    getUserContext(userData) {
        return {
            level: userData.stats.level,
            streak: userData.stats.currentStreak,
            energy: userData.stats.energy.value,
            points: userData.stats.points,
            goals: Object.keys(userData.goals || {}).length,
            completedGoals: userData.stats.completedGoals,
            characterStats: userData.characterStats || {},
            recentActivity: this.getRecentActivity(userData),
            psychologicalProfile: this.analyzeUserProfile(userData)
        };
    }

    // Get recent activity summary
    getRecentActivity(userData) {
        const dailyCompletions = userData.stats.dailyCompletions || {};
        const today = new Date().toISOString().split('T')[0];
        const todayCompletions = dailyCompletions[today] || 0;
        
        const last7Days = Object.keys(dailyCompletions).sort().slice(-7);
        const weeklyTotal = last7Days.reduce((sum, date) => sum + (dailyCompletions[date] || 0), 0);
        
        return {
            today: todayCompletions,
            weekly: weeklyTotal,
            average: weeklyTotal / 7,
            trend: this.calculateTrend(dailyCompletions)
        };
    }

    // Calculate activity trend
    calculateTrend(dailyCompletions) {
        const dates = Object.keys(dailyCompletions).sort();
        if (dates.length < 2) return 'stable';
        
        const recent = dates.slice(-3);
        const older = dates.slice(-6, -3);
        
        const recentAvg = recent.reduce((sum, date) => sum + (dailyCompletions[date] || 0), 0) / recent.length;
        const olderAvg = older.reduce((sum, date) => sum + (dailyCompletions[date] || 0), 0) / older.length;
        
        if (recentAvg > olderAvg * 1.2) return 'increasing';
        if (recentAvg < olderAvg * 0.8) return 'decreasing';
        return 'stable';
    }

    // Calculate goal complexity
    calculateGoalComplexity(goals) {
        if (!goals || Object.keys(goals).length === 0) return 'none';
        
        const totalTasks = Object.values(goals).reduce((sum, goal) => 
            sum + Object.keys(goal.tasks || {}).length, 0);
        const avgTasks = totalTasks / Object.keys(goals).length;
        
        if (avgTasks < 3) return 'simple';
        if (avgTasks < 7) return 'moderate';
        return 'complex';
    }

    // Analyze feedback response patterns
    analyzeFeedbackResponse(userData) {
        const patterns = {
            responsiveness: 0,
            consistency: 0,
            adaptability: 0
        };

        // Analyze how user responds to different AI personalities
        const settings = userData.settings || {};
        const currentStyle = settings.motivationalStyle || 'mentor';
        
        // This would be enhanced with actual feedback data
        patterns.responsiveness = 0.7; // Placeholder
        patterns.consistency = 0.8; // Placeholder
        patterns.adaptability = 0.6; // Placeholder

        return patterns;
    }

    // Get preferred categories based on user behavior
    getPreferredCategories(goals) {
        if (!goals) return [];
        
        const categories = Object.values(goals).map(g => g.category).filter(Boolean);
        const categoryCount = {};
        
        categories.forEach(cat => {
            categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        });
        
        return Object.entries(categoryCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([category]) => category);
    }

    // Adapt personality based on user feedback and behavior
    adaptPersonality(userData, currentContext) {
        const profile = this.analyzeUserProfile(userData);
        const currentPersonality = profile.optimalPersonality;
        
        // Analyze if current personality is working
        const feedback = this.analyzeFeedbackResponse(userData);
        const recentActivity = this.getRecentActivity(userData);
        
        // If user is struggling, try a different approach
        if (recentActivity.trend === 'decreasing' && recentActivity.today === 0) {
            const alternatives = {
                mentor: 'coach',
                coach: 'companion',
                companion: 'strategist',
                strategist: 'commander',
                commander: 'mentor'
            };
            
            return alternatives[currentPersonality] || currentPersonality;
        }
        
        return currentPersonality;
    }

    // Get personality information for UI
    getPersonalityInfo(personality) {
        return this.personalities[personality] || this.personalities.mentor;
    }

    // Get all available personalities
    getAllPersonalities() {
        return Object.keys(this.personalities).map(key => ({
            id: key,
            ...this.personalities[key]
        }));
    }

    // Validate user data for AI analysis
    validateUserData(userData) {
        const required = ['stats', 'goals', 'settings'];
        const missing = required.filter(field => !userData[field]);
        
        if (missing.length > 0) {
            return false;
        }
        
        return true;
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIAgentManager;
} else {
    window.AIAgentManager = AIAgentManager;
} 