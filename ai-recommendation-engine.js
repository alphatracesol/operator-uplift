// AI Recommendation Engine for Operator Uplift
// Machine learning-based goal suggestions and predictive analytics

const AIRecommendationEngine = {
    userBehaviorPatterns: {},
    goalSuccessRates: {},
    categoryPreferences: {},
    
    async analyzeUserBehavior(userId) {
        try {
            const userData = await app.firestore.getUserData(userId);
            const goals = await app.firestore.getUserGoals(userId);
            
            // Analyze completion patterns
            const completionRates = this.calculateCompletionRates(goals);
            const categoryPerformance = this.analyzeCategoryPerformance(goals);
            const timePatterns = this.analyzeTimePatterns(goals);
            const difficultyPreferences = this.analyzeDifficultyPreferences(goals);
            
            this.userBehaviorPatterns[userId] = {
                completionRates,
                categoryPerformance,
                timePatterns,
                difficultyPreferences,
                lastUpdated: new Date()
            };
            
            return this.userBehaviorPatterns[userId];
        } catch (error) {
            console.error('Error analyzing user behavior:', error);
            return null;
        }
    },
    
    calculateCompletionRates(goals) {
        const rates = {};
        goals.forEach(goal => {
            if (!rates[goal.category]) {
                rates[goal.category] = { completed: 0, total: 0 };
            }
            rates[goal.category].total++;
            if (goal.isCompleted) {
                rates[goal.category].completed++;
            }
        });
        
        // Calculate percentages
        Object.keys(rates).forEach(category => {
            rates[category].percentage = (rates[category].completed / rates[category].total) * 100;
        });
        
        return rates;
    },
    
    analyzeCategoryPerformance(goals) {
        const performance = {};
        goals.forEach(goal => {
            if (!performance[goal.category]) {
                performance[goal.category] = {
                    totalGoals: 0,
                    completedGoals: 0,
                    averageDifficulty: 0,
                    averageDuration: 0
                };
            }
            
            performance[goal.category].totalGoals++;
            if (goal.isCompleted) {
                performance[goal.category].completedGoals++;
            }
            
            performance[goal.category].averageDifficulty += goal.difficulty || 3;
            performance[goal.category].averageDuration += goal.duration || 30;
        });
        
        // Calculate averages
        Object.keys(performance).forEach(category => {
            const cat = performance[category];
            cat.averageDifficulty = cat.averageDifficulty / cat.totalGoals;
            cat.averageDuration = cat.averageDuration / cat.totalGoals;
            cat.successRate = (cat.completedGoals / cat.totalGoals) * 100;
        });
        
        return performance;
    },
    
    analyzeTimePatterns(goals) {
        const patterns = {
            dayOfWeek: {},
            timeOfDay: {},
            seasonality: {}
        };
        
        goals.forEach(goal => {
            const createdAt = new Date(goal.createdAt);
            const dayOfWeek = createdAt.getDay();
            const hourOfDay = createdAt.getHours();
            const month = createdAt.getMonth();
            
            // Day of week patterns
            if (!patterns.dayOfWeek[dayOfWeek]) {
                patterns.dayOfWeek[dayOfWeek] = { created: 0, completed: 0 };
            }
            patterns.dayOfWeek[dayOfWeek].created++;
            if (goal.isCompleted) {
                patterns.dayOfWeek[dayOfWeek].completed++;
            }
            
            // Time of day patterns
            const timeSlot = hourOfDay < 12 ? 'morning' : hourOfDay < 17 ? 'afternoon' : 'evening';
            if (!patterns.timeOfDay[timeSlot]) {
                patterns.timeOfDay[timeSlot] = { created: 0, completed: 0 };
            }
            patterns.timeOfDay[timeSlot].created++;
            if (goal.isCompleted) {
                patterns.timeOfDay[timeSlot].completed++;
            }
            
            // Seasonal patterns
            const season = month < 3 ? 'winter' : month < 6 ? 'spring' : month < 9 ? 'summer' : 'fall';
            if (!patterns.seasonality[season]) {
                patterns.seasonality[season] = { created: 0, completed: 0 };
            }
            patterns.seasonality[season].created++;
            if (goal.isCompleted) {
                patterns.seasonality[season].completed++;
            }
        });
        
        return patterns;
    },
    
    analyzeDifficultyPreferences(goals) {
        const preferences = {
            easy: { created: 0, completed: 0 },
            medium: { created: 0, completed: 0 },
            hard: { created: 0, completed: 0 }
        };
        
        goals.forEach(goal => {
            const difficulty = goal.difficulty || 3;
            let category;
            
            if (difficulty <= 2) category = 'easy';
            else if (difficulty <= 4) category = 'medium';
            else category = 'hard';
            
            preferences[category].created++;
            if (goal.isCompleted) {
                preferences[category].completed++;
            }
        });
        
        // Calculate success rates
        Object.keys(preferences).forEach(cat => {
            const pref = preferences[cat];
            pref.successRate = pref.created > 0 ? (pref.completed / pref.created) * 100 : 0;
        });
        
        return preferences;
    },
    
    async generateGoalRecommendations(userId) {
        const behavior = await this.analyzeUserBehavior(userId);
        if (!behavior) return [];
        
        const recommendations = [];
        
        // Category-based recommendations
        const bestCategory = Object.keys(behavior.categoryPerformance)
            .sort((a, b) => behavior.categoryPerformance[b].successRate - behavior.categoryPerformance[a].successRate)[0];
        
        if (bestCategory) {
            recommendations.push({
                type: 'category',
                category: bestCategory,
                reason: `You have a ${behavior.categoryPerformance[bestCategory].successRate.toFixed(1)}% success rate in ${bestCategory} goals`,
                confidence: behavior.categoryPerformance[bestCategory].successRate / 100
            });
        }
        
        // Difficulty-based recommendations
        const bestDifficulty = Object.keys(behavior.difficultyPreferences)
            .sort((a, b) => behavior.difficultyPreferences[b].successRate - behavior.difficultyPreferences[a].successRate)[0];
        
        if (bestDifficulty) {
            recommendations.push({
                type: 'difficulty',
                difficulty: bestDifficulty,
                reason: `You excel at ${bestDifficulty} difficulty goals`,
                confidence: behavior.difficultyPreferences[bestDifficulty].successRate / 100
            });
        }
        
        // Time-based recommendations
        const bestTimeSlot = Object.keys(behavior.timePatterns.timeOfDay)
            .sort((a, b) => {
                const aRate = behavior.timePatterns.timeOfDay[a].created > 0 ? 
                    behavior.timePatterns.timeOfDay[a].completed / behavior.timePatterns.timeOfDay[a].created : 0;
                const bRate = behavior.timePatterns.timeOfDay[b].created > 0 ? 
                    behavior.timePatterns.timeOfDay[b].completed / behavior.timePatterns.timeOfDay[b].created : 0;
                return bRate - aRate;
            })[0];
        
        if (bestTimeSlot) {
            recommendations.push({
                type: 'timing',
                timeSlot: bestTimeSlot,
                reason: `You're most productive during ${bestTimeSlot}`,
                confidence: 0.8
            });
        }
        
        return recommendations;
    },
    
    async predictGoalCompletion(goalData, userBehavior) {
        const features = this.extractFeatures(goalData, userBehavior);
        const prediction = this.calculateCompletionProbability(features);
        
        return {
            probability: prediction.probability,
            confidence: prediction.confidence,
            factors: prediction.factors,
            recommendations: prediction.recommendations
        };
    },
    
    extractFeatures(goalData, userBehavior) {
        return {
            category: goalData.category,
            difficulty: goalData.difficulty || 3,
            duration: goalData.duration || 30,
            userCategorySuccessRate: userBehavior?.categoryPerformance?.[goalData.category]?.successRate || 50,
            userDifficultySuccessRate: this.getDifficultySuccessRate(goalData.difficulty, userBehavior),
            goalComplexity: this.calculateGoalComplexity(goalData),
            timeOfYear: this.getTimeOfYearFactor(),
            userExperience: userBehavior?.completionRates ? 
                Object.values(userBehavior.completionRates).reduce((sum, rate) => sum + rate.percentage, 0) / 
                Object.keys(userBehavior.completionRates).length : 50
        };
    },
    
    getDifficultySuccessRate(difficulty, userBehavior) {
        if (!userBehavior?.difficultyPreferences) return 50;
        
        const diff = difficulty <= 2 ? 'easy' : difficulty <= 4 ? 'medium' : 'hard';
        return userBehavior.difficultyPreferences[diff]?.successRate || 50;
    },
    
    calculateGoalComplexity(goalData) {
        let complexity = 0;
        
        // Task count factor
        complexity += (goalData.tasks?.length || 1) * 10;
        
        // Duration factor
        complexity += Math.min(goalData.duration || 30, 365) / 10;
        
        // Difficulty factor
        complexity += (goalData.difficulty || 3) * 15;
        
        return Math.min(complexity, 100);
    },
    
    getTimeOfYearFactor() {
        const month = new Date().getMonth();
        const day = new Date().getDate();
        
        // New Year motivation boost
        if (month === 0 && day <= 31) return 1.2;
        
        // Spring motivation
        if (month >= 2 && month <= 4) return 1.1;
        
        // Summer slump
        if (month >= 5 && month <= 7) return 0.9;
        
        // Fall productivity
        if (month >= 8 && month <= 10) return 1.05;
        
        // Holiday season
        if (month === 11) return 0.95;
        
        return 1.0;
    },
    
    calculateCompletionProbability(features) {
        let probability = 50; // Base probability
        
        // Category success rate impact
        probability += (features.userCategorySuccessRate - 50) * 0.3;
        
        // Difficulty success rate impact
        probability += (features.userDifficultySuccessRate - 50) * 0.2;
        
        // Goal complexity impact (inverse relationship)
        probability -= (features.goalComplexity - 50) * 0.1;
        
        // User experience impact
        probability += (features.userExperience - 50) * 0.15;
        
        // Time of year impact
        probability *= features.timeOfYear;
        
        // Ensure probability is within bounds
        probability = Math.max(5, Math.min(95, probability));
        
        const confidence = this.calculateConfidence(features);
        const factors = this.identifyKeyFactors(features);
        const recommendations = this.generateOptimizationRecommendations(features);
        
        return {
            probability: Math.round(probability),
            confidence: Math.round(confidence),
            factors,
            recommendations
        };
    },
    
    calculateConfidence(features) {
        let confidence = 70; // Base confidence
        
        // Higher confidence with more user data
        if (features.userExperience > 0) confidence += 10;
        if (features.userCategorySuccessRate > 0) confidence += 10;
        if (features.userDifficultySuccessRate > 0) confidence += 10;
        
        return Math.min(confidence, 95);
    },
    
    identifyKeyFactors(features) {
        const factors = [];
        
        if (features.userCategorySuccessRate > 70) {
            factors.push('Strong performance in this category');
        } else if (features.userCategorySuccessRate < 30) {
            factors.push('Challenging category for you');
        }
        
        if (features.userDifficultySuccessRate > 70) {
            factors.push('You excel at this difficulty level');
        } else if (features.userDifficultySuccessRate < 30) {
            factors.push('This difficulty level may be challenging');
        }
        
        if (features.goalComplexity > 70) {
            factors.push('High complexity goal');
        } else if (features.goalComplexity < 30) {
            factors.push('Simple, achievable goal');
        }
        
        if (features.timeOfYear > 1.1) {
            factors.push('Favorable time of year for motivation');
        } else if (features.timeOfYear < 0.9) {
            factors.push('Challenging time of year for motivation');
        }
        
        return factors;
    },
    
    generateOptimizationRecommendations(features) {
        const recommendations = [];
        
        if (features.goalComplexity > 70) {
            recommendations.push('Consider breaking this goal into smaller sub-goals');
        }
        
        if (features.userCategorySuccessRate < 30) {
            recommendations.push('Start with a simpler goal in this category to build confidence');
        }
        
        if (features.userDifficultySuccessRate < 30) {
            recommendations.push('Try a lower difficulty level to increase success probability');
        }
        
        if (features.timeOfYear < 0.9) {
            recommendations.push('Set extra reminders and accountability during this challenging period');
        }
        
        return recommendations;
    },
    
    async init() {
        console.log('🤖 Initializing AI Recommendation Engine...');
        this.userBehaviorPatterns = {};
        
        // Set up periodic analysis
        setInterval(async () => {
            if (app.state.currentUser) {
                await this.analyzeUserBehavior(app.state.currentUser.uid);
            }
        }, 24 * 60 * 60 * 1000); // Every 24 hours
        
        console.log('✅ AI Recommendation Engine initialized');
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIRecommendationEngine;
} else {
    window.AIRecommendationEngine = AIRecommendationEngine;
} 