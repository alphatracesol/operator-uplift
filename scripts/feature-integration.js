// Feature Integration Script for Operator Uplift
// Integrates all advanced features into the main application

const FeatureIntegration = {
    // Initialize all advanced features
    async init() {
        try {
            // Initialize AI features
            if (window.AIRecommendationEngine) {
                await AIRecommendationEngine.init();
                }
            
            // Initialize social features
            if (window.AdvancedSocialFeatures) {
                await AdvancedSocialFeatures.init();
                }
            
            // Initialize gamification features
            if (window.AdvancedGamification) {
                await AdvancedGamification.init();
                }
            
            // Integrate with main app
            this.integrateWithMainApp();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize UI components
            this.initializeUIComponents();
            
            } catch (error) {
            }
    },
    
    // Integrate features with main app
    integrateWithMainApp() {
        if (!window.app) {
            return;
        }
        
        // Add AI features to main app
        if (window.AIRecommendationEngine) {
            app.aiRecommendations = AIRecommendationEngine;
        }
        
        // Add social features to main app
        if (window.AdvancedSocialFeatures) {
            app.social = AdvancedSocialFeatures;
        }
        
        // Add gamification features to main app
        if (window.AdvancedGamification) {
            app.gamification = AdvancedGamification;
        }
        
        // Extend existing app methods
        this.extendAppMethods();
    },
    
    // Extend existing app methods with new functionality
    extendAppMethods() {
        // Extend goal creation with AI recommendations
        if (app.goals && app.goals.createGoal) {
            const originalCreateGoal = app.goals.createGoal;
            app.goals.createGoal = async function(goalData) {
                // Get AI recommendations before creating goal
                if (app.aiRecommendations) {
                    const recommendations = await app.aiRecommendations.generateGoalRecommendations(app.state.currentUser.uid);
                    if (recommendations.length > 0) {
                        app.ui.showToast(`AI Tip: ${recommendations[0].reason}`, 'info');
                    }
                }
                
                // Create goal with prediction
                const goal = await originalCreateGoal.call(this, goalData);
                
                // Predict completion likelihood
                if (app.aiRecommendations && goal) {
                    const behavior = await app.aiRecommendations.analyzeUserBehavior(app.state.currentUser.uid);
                    const prediction = await app.aiRecommendations.predictGoalCompletion(goal, behavior);
                    
                    if (prediction.probability < 50) {
                        app.ui.showToast(`Goal difficulty: ${prediction.probability}% success rate. Consider adjusting.`, 'warning');
                    } else {
                        app.ui.showToast(`Goal prediction: ${prediction.probability}% success rate!`, 'success');
                    }
                }
                
                return goal;
            };
        }
        
        // Extend goal completion with social features
        if (app.goals && app.goals.completeGoal) {
            const originalCompleteGoal = app.goals.completeGoal;
            app.goals.completeGoal = async function(goalId) {
                const result = await originalCompleteGoal.call(this, goalId);
                
                // Create social post about completion
                if (app.social && result) {
                    const goal = app.state.localGoals[goalId];
                    if (goal) {
                        await app.social.socialFeed.createPost({
                            type: 'goal_completed',
                            content: `Just completed: ${goal.title}! 🎉`,
                            goalId: goalId,
                            goalTitle: goal.title,
                            visibility: 'public'
                        });
                    }
                }
                
                // Award battle pass experience
                if (app.gamification && app.gamification.battlePass) {
                    await app.gamification.battlePass.awardBattlePassExperience(app.state.currentUser.uid, 100);
                }
                
                // Award skill points
                if (app.gamification && app.gamification.skillTrees) {
                    await app.gamification.skillTrees.awardSkillPoints(app.state.currentUser.uid, 10);
                }
                
                return result;
            };
        }
        
        // Extend user data updates with character customization
        if (app.firestore && app.firestore.updateUserData) {
            const originalUpdateUserData = app.firestore.updateUserData;
            app.firestore.updateUserData = async function(updates) {
                const result = await originalUpdateUserData.call(this, updates);
                
                // Update character customization if needed
                if (app.gamification && app.gamification.characterCustomization) {
                    const character = await app.gamification.characterCustomization.getUserCharacter(app.state.currentUser.uid);
                    // Character updates can be triggered by level ups, achievements, etc.
                }
                
                return result;
            };
        }
    },
    
    // Set up event listeners for new features
    setupEventListeners() {
        // Listen for goal creation to trigger AI recommendations
        document.addEventListener('goalCreated', async (event) => {
            if (app.aiRecommendations) {
                const recommendations = await app.aiRecommendations.generateGoalRecommendations(app.state.currentUser.uid);
                this.displayRecommendations(recommendations);
            }
        });
        
        // Listen for goal completion to trigger social features
        document.addEventListener('goalCompleted', async (event) => {
            if (app.social) {
                // Auto-create social post
                const goal = event.detail.goal;
                await app.social.socialFeed.createPost({
                    type: 'goal_completed',
                    content: `Achievement unlocked: ${goal.title}! 🏆`,
                    goalId: goal.id,
                    goalTitle: goal.title,
                    visibility: 'public'
                });
            }
        });
        
        // Listen for streak updates to trigger gamification
        document.addEventListener('streakUpdated', async (event) => {
            if (app.gamification) {
                const streak = event.detail.streak;
                
                // Award battle pass experience for streaks
                if (streak >= 7) {
                    await app.gamification.battlePass.awardBattlePassExperience(app.state.currentUser.uid, 50);
                }
                
                // Check for seasonal event progress
                if (app.gamification.seasonalEvents) {
                    const activeEvents = app.gamification.seasonalEvents.activeEvents;
                    for (const event of activeEvents) {
                        if (event.challenges.some(c => c.id === '7_day_streak')) {
                            await app.gamification.seasonalEvents.updateEventProgress(event.id, '7_day_streak', 1);
                        }
                    }
                }
            }
        });
    },
    
    // Initialize UI components for new features
    initializeUIComponents() {
        // Add AI recommendations panel
        this.createAIRecommendationsPanel();
        
        // Add social feed panel
        this.createSocialFeedPanel();
        
        // Add gamification dashboard
        this.createGamificationDashboard();
        
        // Add character customization panel
        this.createCharacterCustomizationPanel();
    },
    
    // Create AI recommendations panel
    createAIRecommendationsPanel() {
        const panel = document.createElement('div');
        panel.id = 'ai-recommendations-panel';
        panel.className = 'ai-panel glass-card';
        panel.innerHTML = `
            <div class="panel-header">
                <h3>🤖 AI Recommendations</h3>
                <button class="refresh-btn" onclick="FeatureIntegration.refreshRecommendations()">🔄</button>
            </div>
            <div class="recommendations-list" id="recommendations-list">
                <div class="loading">Loading recommendations...</div>
            </div>
        `;
        
        // Add to main content area
        const mainContent = document.querySelector('.main-content') || document.body;
        mainContent.appendChild(panel);
        
        // Load initial recommendations
        this.loadRecommendations();
    },
    
    // Create social feed panel
    createSocialFeedPanel() {
        const panel = document.createElement('div');
        panel.id = 'social-feed-panel';
        panel.className = 'social-panel glass-card';
        panel.innerHTML = `
            <div class="panel-header">
                <h3>🌐 Community Feed</h3>
                <button class="new-post-btn" onclick="FeatureIntegration.showNewPostModal()">📝</button>
            </div>
            <div class="feed-content" id="social-feed-content">
                <div class="loading">Loading feed...</div>
            </div>
        `;
        
        // Add to main content area
        const mainContent = document.querySelector('.main-content') || document.body;
        mainContent.appendChild(panel);
        
        // Load initial feed
        this.loadSocialFeed();
    },
    
    // Create gamification dashboard
    createGamificationDashboard() {
        const dashboard = document.createElement('div');
        dashboard.id = 'gamification-dashboard';
        dashboard.className = 'gamification-panel glass-card';
        dashboard.innerHTML = `
            <div class="panel-header">
                <h3>🎮 Gamification</h3>
                <div class="gamification-tabs">
                    <button class="tab-btn active" onclick="FeatureIntegration.switchGamificationTab('battle-pass')">Battle Pass</button>
                    <button class="tab-btn" onclick="FeatureIntegration.switchGamificationTab('skills')">Skills</button>
                    <button class="tab-btn" onclick="FeatureIntegration.switchGamificationTab('events')">Events</button>
                </div>
            </div>
            <div class="gamification-content" id="gamification-content">
                <div class="loading">Loading gamification...</div>
            </div>
        `;
        
        // Add to main content area
        const mainContent = document.querySelector('.main-content') || document.body;
        mainContent.appendChild(dashboard);
        
        // Load initial gamification content
        this.loadGamificationContent('battle-pass');
    },
    
    // Create character customization panel
    createCharacterCustomizationPanel() {
        const panel = document.createElement('div');
        panel.id = 'character-customization-panel';
        panel.className = 'customization-panel glass-card';
        panel.innerHTML = `
            <div class="panel-header">
                <h3>👤 Character Customization</h3>
                <button class="close-btn" onclick="FeatureIntegration.closeCustomizationPanel()">✕</button>
            </div>
            <div class="customization-content" id="customization-content">
                <div class="character-preview">
                    <div class="avatar-preview" id="avatar-preview"></div>
                    <div class="character-stats">
                        <div class="stat">Level: <span id="character-level">1</span></div>
                        <div class="stat">Essence: <span id="character-essence">0</span></div>
                        <div class="stat">Skill Points: <span id="character-skill-points">0</span></div>
                    </div>
                </div>
                <div class="customization-options">
                    <div class="option-group">
                        <h4>Avatar</h4>
                        <div class="option-list" id="avatar-options"></div>
                    </div>
                    <div class="option-group">
                        <h4>Background</h4>
                        <div class="option-list" id="background-options"></div>
                    </div>
                    <div class="option-group">
                        <h4>Frame</h4>
                        <div class="option-list" id="frame-options"></div>
                    </div>
                    <div class="option-group">
                        <h4>Effects</h4>
                        <div class="option-list" id="effect-options"></div>
                    </div>
                </div>
            </div>
        `;
        
        // Initially hidden
        panel.style.display = 'none';
        
        // Add to main content area
        const mainContent = document.querySelector('.main-content') || document.body;
        mainContent.appendChild(panel);
    },
    
    // Load AI recommendations
    async loadRecommendations() {
        try {
            if (!app.aiRecommendations || !app.state.currentUser) return;
            
            const recommendations = await app.aiRecommendations.generateGoalRecommendations(app.state.currentUser.uid);
            this.displayRecommendations(recommendations);
        } catch (error) {
            }
    },
    
    // Display AI recommendations
    displayRecommendations(recommendations) {
        const container = document.getElementById('recommendations-list');
        if (!container) return;
        
        if (recommendations.length === 0) {
            container.innerHTML = '<div class="no-recommendations">No recommendations available yet. Create some goals to get started!</div>';
            return;
        }
        
        container.innerHTML = recommendations.map(rec => `
            <div class="recommendation-item">
                <div class="recommendation-type">${this.getRecommendationIcon(rec.type)}</div>
                <div class="recommendation-content">
                    <div class="recommendation-reason">${rec.reason}</div>
                    <div class="recommendation-confidence">Confidence: ${Math.round(rec.confidence * 100)}%</div>
                </div>
            </div>
        `).join('');
    },
    
    // Get recommendation icon
    getRecommendationIcon(type) {
        const icons = {
            category: '📂',
            difficulty: '🎯',
            timing: '⏰'
        };
        return icons[type] || '💡';
    },
    
    // Load social feed
    async loadSocialFeed() {
        try {
            if (!app.social || !app.state.currentUser) return;
            
            const posts = await app.social.socialFeed.getFeedPosts(10);
            this.displaySocialFeed(posts);
        } catch (error) {
            }
    },
    
    // Display social feed
    displaySocialFeed(posts) {
        const container = document.getElementById('social-feed-content');
        if (!container) return;
        
        if (posts.length === 0) {
            container.innerHTML = '<div class="no-posts">No posts yet. Be the first to share your achievements!</div>';
            return;
        }
        
        container.innerHTML = posts.map(post => `
            <div class="social-post">
                <div class="post-header">
                    <div class="post-author">${post.userName}</div>
                    <div class="post-time">${this.formatTime(post.createdAt)}</div>
                </div>
                <div class="post-content">${post.content}</div>
                <div class="post-actions">
                    <button class="like-btn" onclick="FeatureIntegration.likePost('${post.id}')">
                        👍 ${post.likes?.length || 0}
                    </button>
                    <button class="comment-btn" onclick="FeatureIntegration.showCommentModal('${post.id}')">
                        💬 ${post.comments?.length || 0}
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    // Load gamification content
    async loadGamificationContent(tab) {
        try {
            const container = document.getElementById('gamification-content');
            if (!container) return;
            
            switch (tab) {
                case 'battle-pass':
                    await this.loadBattlePassContent(container);
                    break;
                case 'skills':
                    await this.loadSkillsContent(container);
                    break;
                case 'events':
                    await this.loadEventsContent(container);
                    break;
            }
        } catch (error) {
            }
    },
    
    // Load battle pass content
    async loadBattlePassContent(container) {
        if (!app.gamification || !app.state.currentUser) return;
        
        const progress = await app.gamification.battlePass.getUserBattlePassProgress(app.state.currentUser.uid);
        
        container.innerHTML = `
            <div class="battle-pass-content">
                <div class="battle-pass-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(progress.experience / progress.experienceToNext) * 100}%"></div>
                    </div>
                    <div class="progress-text">
                        Tier ${progress.currentTier} - ${progress.experience}/${progress.experienceToNext} XP
                    </div>
                </div>
                <div class="battle-pass-tiers">
                    ${this.generateBattlePassTiers(progress)}
                </div>
                ${!progress.premium ? `
                    <button class="premium-btn" onclick="FeatureIntegration.purchasePremiumPass()">
                        Upgrade to Premium - 1000 Essence
                    </button>
                ` : ''}
            </div>
        `;
    },
    
    // Generate battle pass tiers
    generateBattlePassTiers(progress) {
        const tiers = [];
        for (let i = 1; i <= Math.min(progress.currentTier + 5, 50); i++) {
            const isUnlocked = i <= progress.currentTier;
            const isCurrent = i === progress.currentTier;
            
            tiers.push(`
                <div class="tier-item ${isUnlocked ? 'unlocked' : ''} ${isCurrent ? 'current' : ''}">
                    <div class="tier-number">${i}</div>
                    <div class="tier-reward">🎁</div>
                </div>
            `);
        }
        return tiers.join('');
    },
    
    // Load skills content
    async loadSkillsContent(container) {
        if (!app.gamification || !app.state.currentUser) return;
        
        const skills = await app.gamification.skillTrees.getUserSkills(app.state.currentUser.uid);
        
        container.innerHTML = `
            <div class="skills-content">
                <div class="skills-header">
                    <h4>Skill Points: ${skills.skillPoints}</h4>
                </div>
                <div class="skill-trees">
                    ${this.generateSkillTrees(skills)}
                </div>
            </div>
        `;
    },
    
    // Generate skill trees
    generateSkillTrees(skills) {
        const trees = app.gamification.skillTrees.trees;
        return Object.keys(trees).map(treeKey => {
            const tree = trees[treeKey];
            const treeSkills = Object.keys(tree.skills).map(skillKey => {
                const skill = tree.skills[skillKey];
                const isUnlocked = skills.unlocked.includes(skillKey);
                const canUnlock = skills.skillPoints >= skill.cost && 
                    skill.prerequisites.every(prereq => skills.unlocked.includes(prereq));
                
                return `
                    <div class="skill-item ${isUnlocked ? 'unlocked' : ''} ${canUnlock ? 'can-unlock' : ''}">
                        <div class="skill-name">${skill.name}</div>
                        <div class="skill-cost">${skill.cost} SP</div>
                        ${canUnlock && !isUnlocked ? `
                            <button class="unlock-btn" onclick="FeatureIntegration.unlockSkill('${treeKey}', '${skillKey}')">
                                Unlock
                            </button>
                        ` : ''}
                    </div>
                `;
            }).join('');
            
            return `
                <div class="skill-tree">
                    <h5>${tree.name}</h5>
                    <div class="skill-list">${treeSkills}</div>
                </div>
            `;
        }).join('');
    },
    
    // Load events content
    async loadEventsContent(container) {
        if (!app.gamification) return;
        
        const events = app.gamification.seasonalEvents.activeEvents;
        
        container.innerHTML = `
            <div class="events-content">
                <h4>Active Events</h4>
                ${events.length === 0 ? 
                    '<div class="no-events">No active events at the moment.</div>' :
                    events.map(event => `
                        <div class="event-item">
                            <div class="event-name">${event.name}</div>
                            <div class="event-description">${event.description}</div>
                            <div class="event-progress">
                                ${this.generateEventProgress(event)}
                            </div>
                        </div>
                    `).join('')
                }
            </div>
        `;
    },
    
    // Generate event progress
    generateEventProgress(event) {
        // This would show user's progress in the event
        return `<div class="event-status">Active until ${event.endDate.toLocaleDateString()}</div>`;
    },
    
    // Utility functions
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return date.toLocaleDateString();
    },
    
    // Public methods for UI interaction
    async refreshRecommendations() {
        await this.loadRecommendations();
    },
    
    async showNewPostModal() {
        // Implementation for new post modal
        },
    
    async switchGamificationTab(tab) {
        // Update active tab
        document.querySelectorAll('.gamification-tabs .tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // Load content
        await this.loadGamificationContent(tab);
    },
    
    async likePost(postId) {
        if (!app.social) return;
        
        try {
            await app.social.socialFeed.likePost(postId);
            await this.loadSocialFeed(); // Refresh feed
        } catch (error) {
            }
    },
    
    async showCommentModal(postId) {
        // Implementation for comment modal
        },
    
    async purchasePremiumPass() {
        if (!app.gamification || !app.state.currentUser) return;
        
        try {
            await app.gamification.battlePass.purchasePremiumPass(app.state.currentUser.uid);
            await this.loadGamificationContent('battle-pass'); // Refresh content
        } catch (error) {
            app.ui.showToast('Failed to purchase premium pass', 'error');
        }
    },
    
    async unlockSkill(treeName, skillId) {
        if (!app.gamification || !app.state.currentUser) return;
        
        try {
            await app.gamification.skillTrees.unlockSkill(app.state.currentUser.uid, treeName, skillId);
            await this.loadGamificationContent('skills'); // Refresh content
        } catch (error) {
            app.ui.showToast('Failed to unlock skill', 'error');
        }
    },
    
    closeCustomizationPanel() {
        const panel = document.getElementById('character-customization-panel');
        if (panel) {
            panel.style.display = 'none';
        }
    }
};

// Initialize features when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for main app to be ready
    const checkAppReady = setInterval(() => {
        if (window.app && app.state.currentUser) {
            clearInterval(checkAppReady);
            FeatureIntegration.init();
        }
    }, 100);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FeatureIntegration;
} else {
    window.FeatureIntegration = FeatureIntegration;
} 