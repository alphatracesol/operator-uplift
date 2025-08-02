// Advanced Gamification Features for Operator Uplift
// Seasonal events, character customization, skill trees, battle pass system, and achievement tournaments

const AdvancedGamification = {
    // Seasonal Events System
    seasonalEvents: {
        activeEvents: [],
        userEvents: {},
        eventTemplates: {
            newYear: {
                id: 'new_year_resolution',
                name: 'New Year Resolution Rush',
                description: 'Start the year strong with focused goal setting',
                startDate: new Date(new Date().getFullYear(), 0, 1),
                endDate: new Date(new Date().getFullYear(), 0, 31),
                rewards: { essence: 500, xp: 1000, badge: 'resolution_master' },
                challenges: [
                    { id: 'set_5_goals', name: 'Set 5 Goals', target: 5, reward: 100 },
                    { id: 'complete_3_goals', name: 'Complete 3 Goals', target: 3, reward: 200 },
                    { id: '7_day_streak', name: '7-Day Streak', target: 7, reward: 150 }
                ]
            },
            springCleaning: {
                id: 'spring_cleaning',
                name: 'Spring Cleaning Challenge',
                description: 'Clean up your goals and habits for a fresh start',
                startDate: new Date(new Date().getFullYear(), 2, 20),
                endDate: new Date(new Date().getFullYear(), 5, 20),
                rewards: { essence: 400, xp: 800, badge: 'spring_fresh' },
                challenges: [
                    { id: 'organize_goals', name: 'Organize Goals', target: 10, reward: 100 },
                    { id: 'break_habits', name: 'Break Bad Habits', target: 3, reward: 150 },
                    { id: 'new_routines', name: 'Create New Routines', target: 5, reward: 150 }
                ]
            },
            summerProductivity: {
                id: 'summer_productivity',
                name: 'Summer Productivity Sprint',
                description: 'Maintain momentum during the summer months',
                startDate: new Date(new Date().getFullYear(), 5, 21),
                endDate: new Date(new Date().getFullYear(), 8, 22),
                rewards: { essence: 600, xp: 1200, badge: 'summer_warrior' },
                challenges: [
                    { id: 'outdoor_goals', name: 'Outdoor Goals', target: 5, reward: 200 },
                    { id: 'morning_routine', name: 'Morning Routine', target: 30, reward: 300 },
                    { id: 'skill_development', name: 'Skill Development', target: 3, reward: 100 }
                ]
            },
            fallFocus: {
                id: 'fall_focus',
                name: 'Fall Focus Festival',
                description: 'Harvest your goals and prepare for winter',
                startDate: new Date(new Date().getFullYear(), 8, 23),
                endDate: new Date(new Date().getFullYear(), 11, 20),
                rewards: { essence: 450, xp: 900, badge: 'harvest_master' },
                challenges: [
                    { id: 'review_goals', name: 'Review Goals', target: 10, reward: 150 },
                    { id: 'plan_ahead', name: 'Plan Ahead', target: 5, reward: 200 },
                    { id: 'gratitude_practice', name: 'Gratitude Practice', target: 21, reward: 100 }
                ]
            },
            winterReflection: {
                id: 'winter_reflection',
                name: 'Winter Reflection & Planning',
                description: 'Reflect on the year and plan for the next',
                startDate: new Date(new Date().getFullYear(), 11, 21),
                endDate: new Date(new Date().getFullYear(), 11, 31),
                rewards: { essence: 700, xp: 1400, badge: 'year_end_champion' },
                challenges: [
                    { id: 'year_review', name: 'Year Review', target: 1, reward: 300 },
                    { id: 'goal_planning', name: 'Goal Planning', target: 10, reward: 200 },
                    { id: 'achievement_celebration', name: 'Achievement Celebration', target: 5, reward: 200 }
                ]
            }
        },
        
        async initializeSeasonalEvents() {
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth();
            const currentDay = currentDate.getDate();
            
            // Determine current season and active events
            let activeEvent = null;
            
            if (currentMonth === 0) { // January
                activeEvent = this.eventTemplates.newYear;
            } else if (currentMonth >= 2 && currentMonth <= 5) { // Spring
                activeEvent = this.eventTemplates.springCleaning;
            } else if (currentMonth >= 5 && currentMonth <= 8) { // Summer
                activeEvent = this.eventTemplates.summerProductivity;
            } else if (currentMonth >= 8 && currentMonth <= 11) { // Fall
                activeEvent = this.eventTemplates.fallFocus;
            } else if (currentMonth === 11 && currentDay >= 21) { // Winter
                activeEvent = this.eventTemplates.winterReflection;
            }
            
            if (activeEvent && this.isEventActive(activeEvent)) {
                await this.activateEvent(activeEvent);
            }
        },
        
        isEventActive(event) {
            const now = new Date();
            return now >= event.startDate && now <= event.endDate;
        },
        
        async activateEvent(eventTemplate) {
            try {
                const event = {
                    ...eventTemplate,
                    participants: [],
                    leaderboard: [],
                    status: 'active',
                    createdAt: new Date()
                };
                
                // Save to Firestore
                await addDoc(collection(db, 'seasonalEvents'), event);
                
                // Update local state
                this.activeEvents.push(event);
                
                // Notify users
                await this.notifyEventStart(event);
                
                return event;
            } catch (error) {
                console.error('Error activating seasonal event:', error);
                throw error;
            }
        },
        
        async joinSeasonalEvent(eventId) {
            try {
                const eventRef = doc(db, 'seasonalEvents', eventId);
                await updateDoc(eventRef, {
                    participants: arrayUnion(app.state.currentUser.uid)
                });
                
                // Update local state
                const event = this.activeEvents.find(e => e.id === eventId);
                if (event && !event.participants.includes(app.state.currentUser.uid)) {
                    event.participants.push(app.state.currentUser.uid);
                }
                
                this.userEvents[app.state.currentUser.uid] = eventId;
                
                return true;
            } catch (error) {
                console.error('Error joining seasonal event:', error);
                throw error;
            }
        },
        
        async updateEventProgress(eventId, challengeId, progress) {
            try {
                const eventRef = doc(db, 'seasonalEvents', eventId);
                await updateDoc(eventRef, {
                    [`progress.${app.state.currentUser.uid}.${challengeId}`]: progress
                });
                
                // Check for challenge completion
                const event = this.activeEvents.find(e => e.id === eventId);
                if (event) {
                    const challenge = event.challenges.find(c => c.id === challengeId);
                    if (challenge && progress >= challenge.target) {
                        await this.completeEventChallenge(eventId, challengeId);
                    }
                }
                
                return true;
            } catch (error) {
                console.error('Error updating event progress:', error);
                throw error;
            }
        },
        
        async completeEventChallenge(eventId, challengeId) {
            try {
                const event = this.activeEvents.find(e => e.id === eventId);
                const challenge = event.challenges.find(c => c.id === challengeId);
                
                if (challenge) {
                    // Award rewards
                    await this.awardEventRewards(challenge.reward);
                    
                    // Update user progress
                    const userRef = doc(db, 'users', app.state.currentUser.uid);
                    await updateDoc(userRef, {
                        'stats.essence': increment(challenge.reward),
                        'stats.xp': increment(challenge.reward * 2)
                    });
                    
                    // Show notification
                    app.ui.showToast(`Challenge completed! +${challenge.reward} Essence`, 'success');
                }
                
                return true;
            } catch (error) {
                console.error('Error completing event challenge:', error);
                throw error;
            }
        },
        
        async notifyEventStart(event) {
            const message = `🎉 New seasonal event: ${event.name}! Join now to earn exclusive rewards!`;
            console.log('Event notification:', message);
            // This would integrate with the notification system
        }
    },
    
    // Character Customization System
    characterCustomization: {
        userCharacters: {},
        availableItems: {
            avatars: [
                { id: 'default', name: 'Default Avatar', cost: 0, rarity: 'common' },
                { id: 'achiever', name: 'Achiever', cost: 1000, rarity: 'rare' },
                { id: 'explorer', name: 'Explorer', cost: 1500, rarity: 'epic' },
                { id: 'master', name: 'Master', cost: 5000, rarity: 'legendary' }
            ],
            backgrounds: [
                { id: 'default', name: 'Default Background', cost: 0, rarity: 'common' },
                { id: 'mountain', name: 'Mountain Peak', cost: 500, rarity: 'rare' },
                { id: 'ocean', name: 'Ocean Waves', cost: 750, rarity: 'epic' },
                { id: 'space', name: 'Space Explorer', cost: 2000, rarity: 'legendary' }
            ],
            frames: [
                { id: 'none', name: 'No Frame', cost: 0, rarity: 'common' },
                { id: 'bronze', name: 'Bronze Frame', cost: 100, rarity: 'common' },
                { id: 'silver', name: 'Silver Frame', cost: 300, rarity: 'rare' },
                { id: 'gold', name: 'Gold Frame', cost: 1000, rarity: 'epic' },
                { id: 'diamond', name: 'Diamond Frame', cost: 5000, rarity: 'legendary' }
            ],
            effects: [
                { id: 'none', name: 'No Effect', cost: 0, rarity: 'common' },
                { id: 'glow', name: 'Glow Effect', cost: 200, rarity: 'rare' },
                { id: 'sparkle', name: 'Sparkle Effect', cost: 500, rarity: 'epic' },
                { id: 'rainbow', name: 'Rainbow Trail', cost: 1500, rarity: 'legendary' }
            ]
        },
        
        async getUserCharacter(userId) {
            try {
                const userRef = doc(db, 'users', userId);
                const userDoc = await getDoc(userRef);
                const userData = userDoc.data();
                
                if (userData.character) {
                    this.userCharacters[userId] = userData.character;
                    return userData.character;
                } else {
                    // Create default character
                    const defaultCharacter = {
                        avatar: 'default',
                        background: 'default',
                        frame: 'none',
                        effect: 'none',
                        unlockedItems: ['default', 'none'],
                        customizationPoints: 0
                    };
                    
                    await this.saveUserCharacter(userId, defaultCharacter);
                    return defaultCharacter;
                }
            } catch (error) {
                console.error('Error getting user character:', error);
                throw error;
            }
        },
        
        async saveUserCharacter(userId, character) {
            try {
                const userRef = doc(db, 'users', userId);
                await updateDoc(userRef, {
                    character: character
                });
                
                this.userCharacters[userId] = character;
                return true;
            } catch (error) {
                console.error('Error saving user character:', error);
                throw error;
            }
        },
        
        async purchaseItem(userId, itemType, itemId) {
            try {
                const item = this.availableItems[itemType].find(i => i.id === itemId);
                if (!item) {
                    throw new Error('Item not found');
                }
                
                const userData = await app.firestore.getUserData(userId);
                if (userData.stats.essence < item.cost) {
                    throw new Error('Insufficient Essence');
                }
                
                // Deduct cost
                await app.firestore.updateUserData({
                    'stats.essence': increment(-item.cost)
                });
                
                // Add to unlocked items
                const character = this.userCharacters[userId] || await this.getUserCharacter(userId);
                if (!character.unlockedItems.includes(itemId)) {
                    character.unlockedItems.push(itemId);
                }
                
                // Save updated character
                await this.saveUserCharacter(userId, character);
                
                app.ui.showToast(`Item purchased: ${item.name}`, 'success');
                return true;
            } catch (error) {
                console.error('Error purchasing item:', error);
                throw error;
            }
        },
        
        async equipItem(userId, itemType, itemId) {
            try {
                const character = this.userCharacters[userId] || await this.getUserCharacter(userId);
                
                if (!character.unlockedItems.includes(itemId)) {
                    throw new Error('Item not unlocked');
                }
                
                character[itemType] = itemId;
                await this.saveUserCharacter(userId, character);
                
                app.ui.showToast(`Item equipped: ${itemId}`, 'success');
                return true;
            } catch (error) {
                console.error('Error equipping item:', error);
                throw error;
            }
        }
    },
    
    // Skill Trees System
    skillTrees: {
        trees: {
            productivity: {
                name: 'Productivity Mastery',
                description: 'Unlock productivity skills and techniques',
                skills: {
                    timeManagement: {
                        name: 'Time Management',
                        description: 'Improve your time management skills',
                        cost: 100,
                        prerequisites: [],
                        effects: { timeEfficiency: 0.1 }
                    },
                    focusMastery: {
                        name: 'Focus Mastery',
                        description: 'Enhance your ability to maintain focus',
                        cost: 200,
                        prerequisites: ['timeManagement'],
                        effects: { focusDuration: 0.2 }
                    },
                    deepWork: {
                        name: 'Deep Work',
                        description: 'Master the art of deep work',
                        cost: 500,
                        prerequisites: ['focusMastery'],
                        effects: { deepWorkEfficiency: 0.3 }
                    }
                }
            },
            health: {
                name: 'Health & Wellness',
                description: 'Develop healthy habits and routines',
                skills: {
                    morningRoutine: {
                        name: 'Morning Routine',
                        description: 'Establish a powerful morning routine',
                        cost: 150,
                        prerequisites: [],
                        effects: { morningEnergy: 0.15 }
                    },
                    exerciseHabit: {
                        name: 'Exercise Habit',
                        description: 'Build a consistent exercise routine',
                        cost: 300,
                        prerequisites: ['morningRoutine'],
                        effects: { physicalEnergy: 0.25 }
                    },
                    nutritionAwareness: {
                        name: 'Nutrition Awareness',
                        description: 'Develop healthy eating habits',
                        cost: 400,
                        prerequisites: ['exerciseHabit'],
                        effects: { mentalClarity: 0.2 }
                    }
                }
            },
            learning: {
                name: 'Learning & Growth',
                description: 'Accelerate your learning and development',
                skills: {
                    speedReading: {
                        name: 'Speed Reading',
                        description: 'Learn to read faster and retain more',
                        cost: 200,
                        prerequisites: [],
                        effects: { readingSpeed: 0.3 }
                    },
                    memoryTechniques: {
                        name: 'Memory Techniques',
                        description: 'Master memory improvement techniques',
                        cost: 350,
                        prerequisites: ['speedReading'],
                        effects: { memoryRetention: 0.25 }
                    },
                    skillAcquisition: {
                        name: 'Skill Acquisition',
                        description: 'Learn new skills more efficiently',
                        cost: 600,
                        prerequisites: ['memoryTechniques'],
                        effects: { learningSpeed: 0.4 }
                    }
                }
            }
        },
        userSkills: {},
        
        async getUserSkills(userId) {
            try {
                const userRef = doc(db, 'users', userId);
                const userDoc = await getDoc(userRef);
                const userData = userDoc.data();
                
                if (userData.skills) {
                    this.userSkills[userId] = userData.skills;
                    return userData.skills;
                } else {
                    // Initialize empty skills
                    const emptySkills = {
                        unlocked: [],
                        skillPoints: 0,
                        treeProgress: {}
                    };
                    
                    await this.saveUserSkills(userId, emptySkills);
                    return emptySkills;
                }
            } catch (error) {
                console.error('Error getting user skills:', error);
                throw error;
            }
        },
        
        async saveUserSkills(userId, skills) {
            try {
                const userRef = doc(db, 'users', userId);
                await updateDoc(userRef, {
                    skills: skills
                });
                
                this.userSkills[userId] = skills;
                return true;
            } catch (error) {
                console.error('Error saving user skills:', error);
                throw error;
            }
        },
        
        async unlockSkill(userId, treeName, skillId) {
            try {
                const skill = this.trees[treeName].skills[skillId];
                if (!skill) {
                    throw new Error('Skill not found');
                }
                
                const userSkills = this.userSkills[userId] || await this.getUserSkills(userId);
                
                // Check prerequisites
                for (const prereq of skill.prerequisites) {
                    if (!userSkills.unlocked.includes(prereq)) {
                        throw new Error(`Prerequisite skill ${prereq} not unlocked`);
                    }
                }
                
                // Check skill points
                if (userSkills.skillPoints < skill.cost) {
                    throw new Error('Insufficient skill points');
                }
                
                // Unlock skill
                userSkills.unlocked.push(skillId);
                userSkills.skillPoints -= skill.cost;
                
                // Update tree progress
                if (!userSkills.treeProgress[treeName]) {
                    userSkills.treeProgress[treeName] = 0;
                }
                userSkills.treeProgress[treeName] += 1;
                
                await this.saveUserSkills(userId, userSkills);
                
                app.ui.showToast(`Skill unlocked: ${skill.name}`, 'success');
                return true;
            } catch (error) {
                console.error('Error unlocking skill:', error);
                throw error;
            }
        },
        
        async awardSkillPoints(userId, points) {
            try {
                const userSkills = this.userSkills[userId] || await this.getUserSkills(userId);
                userSkills.skillPoints += points;
                
                await this.saveUserSkills(userId, userSkills);
                
                app.ui.showToast(`+${points} Skill Points earned!`, 'success');
                return true;
            } catch (error) {
                console.error('Error awarding skill points:', error);
                throw error;
            }
        }
    },
    
    // Battle Pass System
    battlePass: {
        currentSeason: {
            id: 'season_1',
            name: 'Foundation Season',
            startDate: new Date(new Date().getFullYear(), 0, 1),
            endDate: new Date(new Date().getFullYear(), 11, 31),
            tiers: 50,
            rewards: {
                free: [
                    { tier: 1, type: 'essence', amount: 100 },
                    { tier: 5, type: 'avatar', itemId: 'season_1_free' },
                    { tier: 10, type: 'skill_points', amount: 50 },
                    { tier: 15, type: 'background', itemId: 'season_1_free' },
                    { tier: 20, type: 'essence', amount: 500 },
                    { tier: 25, type: 'frame', itemId: 'bronze' },
                    { tier: 30, type: 'skill_points', amount: 100 },
                    { tier: 35, type: 'essence', amount: 1000 },
                    { tier: 40, type: 'effect', itemId: 'glow' },
                    { tier: 45, type: 'skill_points', amount: 150 },
                    { tier: 50, type: 'avatar', itemId: 'season_1_champion' }
                ],
                premium: [
                    { tier: 1, type: 'essence', amount: 200 },
                    { tier: 5, type: 'avatar', itemId: 'season_1_premium' },
                    { tier: 10, type: 'skill_points', amount: 100 },
                    { tier: 15, type: 'background', itemId: 'season_1_premium' },
                    { tier: 20, type: 'essence', amount: 1000 },
                    { tier: 25, type: 'frame', itemId: 'silver' },
                    { tier: 30, type: 'skill_points', amount: 200 },
                    { tier: 35, type: 'essence', amount: 2000 },
                    { tier: 40, type: 'effect', itemId: 'sparkle' },
                    { tier: 45, type: 'skill_points', amount: 300 },
                    { tier: 50, type: 'avatar', itemId: 'season_1_legend' }
                ]
            }
        },
        userProgress: {},
        
        async getUserBattlePassProgress(userId) {
            try {
                const userRef = doc(db, 'users', userId);
                const userDoc = await getDoc(userRef);
                const userData = userDoc.data();
                
                if (userData.battlePass) {
                    this.userProgress[userId] = userData.battlePass;
                    return userData.battlePass;
                } else {
                    // Initialize battle pass progress
                    const progress = {
                        currentTier: 1,
                        experience: 0,
                        experienceToNext: 1000,
                        premium: false,
                        claimedRewards: [],
                        seasonId: this.currentSeason.id
                    };
                    
                    await this.saveBattlePassProgress(userId, progress);
                    return progress;
                }
            } catch (error) {
                console.error('Error getting battle pass progress:', error);
                throw error;
            }
        },
        
        async saveBattlePassProgress(userId, progress) {
            try {
                const userRef = doc(db, 'users', userId);
                await updateDoc(userRef, {
                    battlePass: progress
                });
                
                this.userProgress[userId] = progress;
                return true;
            } catch (error) {
                console.error('Error saving battle pass progress:', error);
                throw error;
            }
        },
        
        async awardBattlePassExperience(userId, experience) {
            try {
                const progress = this.userProgress[userId] || await this.getUserBattlePassProgress(userId);
                progress.experience += experience;
                
                // Check for tier ups
                while (progress.experience >= progress.experienceToNext && progress.currentTier < this.currentSeason.tiers) {
                    await this.tierUp(userId, progress);
                }
                
                await this.saveBattlePassProgress(userId, progress);
                
                app.ui.showToast(`+${experience} Battle Pass XP!`, 'success');
                return true;
            } catch (error) {
                console.error('Error awarding battle pass experience:', error);
                throw error;
            }
        },
        
        async tierUp(userId, progress) {
            progress.currentTier += 1;
            progress.experience -= progress.experienceToNext;
            progress.experienceToNext = Math.floor(progress.experienceToNext * 1.1); // Increase XP requirement
            
            // Check for rewards
            const freeReward = this.currentSeason.rewards.free.find(r => r.tier === progress.currentTier);
            if (freeReward) {
                await this.claimReward(userId, freeReward, 'free');
            }
            
            if (progress.premium) {
                const premiumReward = this.currentSeason.rewards.premium.find(r => r.tier === progress.currentTier);
                if (premiumReward) {
                    await this.claimReward(userId, premiumReward, 'premium');
                }
            }
            
            app.ui.showToast(`🎉 Battle Pass Tier ${progress.currentTier} unlocked!`, 'success');
        },
        
        async claimReward(userId, reward, type) {
            try {
                const progress = this.userProgress[userId];
                const rewardId = `${type}_${reward.tier}`;
                
                if (progress.claimedRewards.includes(rewardId)) {
                    return false; // Already claimed
                }
                
                // Award the reward
                switch (reward.type) {
                    case 'essence':
                        await app.firestore.updateUserData({
                            'stats.essence': increment(reward.amount)
                        });
                        break;
                    case 'skill_points':
                        await this.skillTrees.awardSkillPoints(userId, reward.amount);
                        break;
                    case 'avatar':
                    case 'background':
                    case 'frame':
                    case 'effect':
                        await this.characterCustomization.purchaseItem(userId, reward.type, reward.itemId);
                        break;
                }
                
                // Mark as claimed
                progress.claimedRewards.push(rewardId);
                await this.saveBattlePassProgress(userId, progress);
                
                app.ui.showToast(`Reward claimed: ${reward.type}`, 'success');
                return true;
            } catch (error) {
                console.error('Error claiming reward:', error);
                throw error;
            }
        },
        
        async purchasePremiumPass(userId) {
            try {
                const cost = 1000; // 1000 Essence for premium pass
                const userData = await app.firestore.getUserData(userId);
                
                if (userData.stats.essence < cost) {
                    throw new Error('Insufficient Essence');
                }
                
                // Deduct cost
                await app.firestore.updateUserData({
                    'stats.essence': increment(-cost)
                });
                
                // Upgrade to premium
                const progress = this.userProgress[userId] || await this.getUserBattlePassProgress(userId);
                progress.premium = true;
                
                await this.saveBattlePassProgress(userId, progress);
                
                app.ui.showToast('Premium Battle Pass activated!', 'success');
                return true;
            } catch (error) {
                console.error('Error purchasing premium pass:', error);
                throw error;
            }
        }
    },
    
    // Achievement Tournaments
    achievementTournaments: {
        activeTournaments: [],
        userTournaments: {},
        
        async createTournament(tournamentData) {
            try {
                const tournament = {
                    id: Date.now().toString(),
                    name: tournamentData.name,
                    description: tournamentData.description,
                    type: tournamentData.type, // 'speed', 'endurance', 'accuracy', 'creativity'
                    startDate: tournamentData.startDate,
                    endDate: tournamentData.endDate,
                    maxParticipants: tournamentData.maxParticipants || 100,
                    participants: [app.state.currentUser.uid],
                    leaderboard: [],
                    rewards: tournamentData.rewards,
                    criteria: tournamentData.criteria,
                    status: 'upcoming',
                    createdBy: app.state.currentUser.uid,
                    createdAt: new Date()
                };
                
                // Save to Firestore
                await addDoc(collection(db, 'achievementTournaments'), tournament);
                
                // Update local state
                this.activeTournaments.push(tournament);
                
                return tournament;
            } catch (error) {
                console.error('Error creating tournament:', error);
                throw error;
            }
        },
        
        async joinTournament(tournamentId) {
            try {
                const tournamentRef = doc(db, 'achievementTournaments', tournamentId);
                await updateDoc(tournamentRef, {
                    participants: arrayUnion(app.state.currentUser.uid)
                });
                
                // Update local state
                const tournament = this.activeTournaments.find(t => t.id === tournamentId);
                if (tournament && !tournament.participants.includes(app.state.currentUser.uid)) {
                    tournament.participants.push(app.state.currentUser.uid);
                }
                
                this.userTournaments[app.state.currentUser.uid] = tournamentId;
                
                return true;
            } catch (error) {
                console.error('Error joining tournament:', error);
                throw error;
            }
        },
        
        async updateTournamentScore(tournamentId, score) {
            try {
                const tournamentRef = doc(db, 'achievementTournaments', tournamentId);
                await updateDoc(tournamentRef, {
                    [`scores.${app.state.currentUser.uid}`]: score
                });
                
                // Update leaderboard
                const tournament = this.activeTournaments.find(t => t.id === tournamentId);
                if (tournament) {
                    tournament.scores = tournament.scores || {};
                    tournament.scores[app.state.currentUser.uid] = score;
                    this.updateTournamentLeaderboard(tournament);
                }
                
                return true;
            } catch (error) {
                console.error('Error updating tournament score:', error);
                throw error;
            }
        },
        
        updateTournamentLeaderboard(tournament) {
            tournament.leaderboard = Object.entries(tournament.scores || {})
                .map(([userId, score]) => ({ userId, score }))
                .sort((a, b) => b.score - a.score);
        },
        
        async endTournament(tournamentId) {
            try {
                const tournamentRef = doc(db, 'achievementTournaments', tournamentId);
                await updateDoc(tournamentRef, {
                    status: 'completed',
                    completedAt: new Date()
                });
                
                // Distribute rewards
                const tournament = this.activeTournaments.find(t => t.id === tournamentId);
                if (tournament) {
                    await this.distributeTournamentRewards(tournament);
                }
                
                return true;
            } catch (error) {
                console.error('Error ending tournament:', error);
                throw error;
            }
        },
        
        async distributeTournamentRewards(tournament) {
            const topParticipants = tournament.leaderboard.slice(0, 3);
            
            for (let i = 0; i < topParticipants.length; i++) {
                const participant = topParticipants[i];
                const reward = tournament.rewards[i] || tournament.rewards[0];
                
                try {
                    const userRef = doc(db, 'users', participant.userId);
                    await updateDoc(userRef, {
                        'stats.essence': increment(reward.essence || 0),
                        'stats.xp': increment(reward.xp || 0)
                    });
                    
                    // Award special badge
                    if (reward.badge) {
                        await this.awardTournamentBadge(participant.userId, reward.badge);
                    }
                } catch (error) {
                    console.error(`Error distributing reward to ${participant.userId}:`, error);
                }
            }
        },
        
        async awardTournamentBadge(userId, badgeId) {
            try {
                const userRef = doc(db, 'users', userId);
                await updateDoc(userRef, {
                    badges: arrayUnion(badgeId)
                });
                
                console.log(`Tournament badge ${badgeId} awarded to ${userId}`);
            } catch (error) {
                console.error('Error awarding tournament badge:', error);
            }
        }
    },
    
    // Initialize all gamification features
    async init() {
        console.log('🎮 Initializing Advanced Gamification Features...');
        
        // Initialize all subsystems
        await this.seasonalEvents.initializeSeasonalEvents();
        
        this.characterCustomization.userCharacters = {};
        
        this.skillTrees.userSkills = {};
        
        this.battlePass.userProgress = {};
        
        this.achievementTournaments.activeTournaments = [];
        this.achievementTournaments.userTournaments = {};
        
        // Set up periodic updates
        this.setupPeriodicUpdates();
        
        console.log('✅ Advanced Gamification Features initialized');
    },
    
    setupPeriodicUpdates() {
        // Update seasonal events daily
        setInterval(async () => {
            await this.seasonalEvents.initializeSeasonalEvents();
        }, 24 * 60 * 60 * 1000); // Every 24 hours
        
        // Award battle pass experience for daily activities
        setInterval(async () => {
            if (app.state.currentUser) {
                // Award XP for daily login
                await this.battlePass.awardBattlePassExperience(app.state.currentUser.uid, 50);
            }
        }, 24 * 60 * 60 * 1000); // Every 24 hours
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedGamification;
} else {
    window.AdvancedGamification = AdvancedGamification;
} 