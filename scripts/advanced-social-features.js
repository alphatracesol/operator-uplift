// Advanced Social Features for Operator Uplift
// Group challenges, social feed, team goals, community events, and peer accountability

const AdvancedSocialFeatures = {
    // Group Challenges System
    groupChallenges: {
        activeChallenges: [],
        userChallenges: {},
        
        async createChallenge(challengeData) {
            try {
                const challenge = {
                    id: Date.now().toString(),
                    title: challengeData.title,
                    description: challengeData.description,
                    category: challengeData.category,
                    goal: challengeData.goal,
                    reward: challengeData.reward,
                    startDate: new Date(),
                    endDate: new Date(Date.now() + challengeData.duration * 24 * 60 * 60 * 1000),
                    participants: [app.state.currentUser.uid],
                    progress: {},
                    leaderboard: [],
                    status: 'active',
                    createdBy: app.state.currentUser.uid,
                    createdAt: new Date()
                };
                
                // Save to Firestore
                await addDoc(collection(db, 'groupChallenges'), challenge);
                
                // Update local state
                this.activeChallenges.push(challenge);
                this.userChallenges[app.state.currentUser.uid] = challenge.id;
                
                // Notify participants
                await this.notifyChallengeParticipants(challenge);
                
                return challenge;
            } catch (error) {
                throw error;
            }
        },
        
        async joinChallenge(challengeId) {
            try {
                const challengeRef = doc(db, 'groupChallenges', challengeId);
                await updateDoc(challengeRef, {
                    participants: arrayUnion(app.state.currentUser.uid),
                    progress: {
                        [app.state.currentUser.uid]: 0
                    }
                });
                
                // Update local state
                const challenge = this.activeChallenges.find(c => c.id === challengeId);
                if (challenge) {
                    challenge.participants.push(app.state.currentUser.uid);
                    challenge.progress[app.state.currentUser.uid] = 0;
                }
                
                this.userChallenges[app.state.currentUser.uid] = challengeId;
                
                return true;
            } catch (error) {
                throw error;
            }
        },
        
        async updateChallengeProgress(challengeId, progress) {
            try {
                const challengeRef = doc(db, 'groupChallenges', challengeId);
                await updateDoc(challengeRef, {
                    [`progress.${app.state.currentUser.uid}`]: progress
                });
                
                // Update local state
                const challenge = this.activeChallenges.find(c => c.id === challengeId);
                if (challenge) {
                    challenge.progress[app.state.currentUser.uid] = progress;
                    this.updateLeaderboard(challenge);
                }
                
                // Check if challenge is completed
                if (progress >= challenge.goal) {
                    await this.completeChallenge(challengeId);
                }
                
                return true;
            } catch (error) {
                throw error;
            }
        },
        
        updateLeaderboard(challenge) {
            challenge.leaderboard = Object.entries(challenge.progress)
                .map(([userId, progress]) => ({ userId, progress }))
                .sort((a, b) => b.progress - a.progress);
        },
        
        async completeChallenge(challengeId) {
            try {
                const challengeRef = doc(db, 'groupChallenges', challengeId);
                await updateDoc(challengeRef, {
                    status: 'completed',
                    completedAt: new Date()
                });
                
                // Update local state
                const challenge = this.activeChallenges.find(c => c.id === challengeId);
                if (challenge) {
                    challenge.status = 'completed';
                    challenge.completedAt = new Date();
                }
                
                // Distribute rewards
                await this.distributeChallengeRewards(challenge);
                
                return true;
            } catch (error) {
                throw error;
            }
        },
        
        async distributeChallengeRewards(challenge) {
            const participants = challenge.participants;
            const rewardPerPerson = Math.floor(challenge.reward / participants.length);
            
            for (const userId of participants) {
                try {
                    const userRef = doc(db, 'users', userId);
                    await updateDoc(userRef, {
                        'stats.essence': increment(rewardPerPerson)
                    });
                } catch (error) {
                    }
            }
        },
        
        async notifyChallengeParticipants(challenge) {
            // Send notifications to potential participants
            const message = `New group challenge: ${challenge.title}. Join now to earn ${challenge.reward} Essence!`;
            
            // This would integrate with a notification system
            }
    },
    
    // Social Feed System
    socialFeed: {
        posts: [],
        userPosts: {},
        
        async createPost(postData) {
            try {
                const post = {
                    id: Date.now().toString(),
                    userId: app.state.currentUser.uid,
                    userName: app.state.userData.displayName,
                    type: postData.type, // 'goal_completed', 'milestone', 'motivation', 'question'
                    content: postData.content,
                    goalId: postData.goalId,
                    goalTitle: postData.goalTitle,
                    likes: [],
                    comments: [],
                    createdAt: new Date(),
                    visibility: postData.visibility || 'public' // 'public', 'friends', 'private'
                };
                
                // Save to Firestore
                await addDoc(collection(db, 'socialFeed'), post);
                
                // Update local state
                this.posts.unshift(post);
                if (!this.userPosts[app.state.currentUser.uid]) {
                    this.userPosts[app.state.currentUser.uid] = [];
                }
                this.userPosts[app.state.currentUser.uid].push(post);
                
                return post;
            } catch (error) {
                throw error;
            }
        },
        
        async likePost(postId) {
            try {
                const postRef = doc(db, 'socialFeed', postId);
                await updateDoc(postRef, {
                    likes: arrayUnion(app.state.currentUser.uid)
                });
                
                // Update local state
                const post = this.posts.find(p => p.id === postId);
                if (post && !post.likes.includes(app.state.currentUser.uid)) {
                    post.likes.push(app.state.currentUser.uid);
                }
                
                return true;
            } catch (error) {
                throw error;
            }
        },
        
        async unlikePost(postId) {
            try {
                const postRef = doc(db, 'socialFeed', postId);
                await updateDoc(postRef, {
                    likes: arrayRemove(app.state.currentUser.uid)
                });
                
                // Update local state
                const post = this.posts.find(p => p.id === postId);
                if (post) {
                    post.likes = post.likes.filter(id => id !== app.state.currentUser.uid);
                }
                
                return true;
            } catch (error) {
                throw error;
            }
        },
        
        async addComment(postId, commentText) {
            try {
                const comment = {
                    id: Date.now().toString(),
                    userId: app.state.currentUser.uid,
                    userName: app.state.userData.displayName,
                    text: commentText,
                    createdAt: new Date()
                };
                
                const postRef = doc(db, 'socialFeed', postId);
                await updateDoc(postRef, {
                    comments: arrayUnion(comment)
                });
                
                // Update local state
                const post = this.posts.find(p => p.id === postId);
                if (post) {
                    post.comments.push(comment);
                }
                
                return comment;
            } catch (error) {
                throw error;
            }
        },
        
        async getFeedPosts(limit = 20) {
            try {
                const feedQuery = query(
                    collection(db, 'socialFeed'),
                    where('visibility', 'in', ['public', 'friends']),
                    orderBy('createdAt', 'desc'),
                    limit(limit)
                );
                
                const snapshot = await getDocs(feedQuery);
                const posts = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                // Update local state
                this.posts = posts;
                
                return posts;
            } catch (error) {
                throw error;
            }
        },
        
        async getUserPosts(userId) {
            try {
                const userPostsQuery = query(
                    collection(db, 'socialFeed'),
                    where('userId', '==', userId),
                    orderBy('createdAt', 'desc')
                );
                
                const snapshot = await getDocs(userPostsQuery);
                const posts = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                // Update local state
                this.userPosts[userId] = posts;
                
                return posts;
            } catch (error) {
                throw error;
            }
        }
    },
    
    // Team Goals System
    teamGoals: {
        teams: [],
        userTeams: {},
        
        async createTeam(teamData) {
            try {
                const team = {
                    id: Date.now().toString(),
                    name: teamData.name,
                    description: teamData.description,
                    ownerId: app.state.currentUser.uid,
                    members: [app.state.currentUser.uid],
                    goals: [],
                    createdAt: new Date(),
                    settings: {
                        privacy: teamData.privacy || 'public', // 'public', 'private', 'invite_only'
                        allowMemberGoals: teamData.allowMemberGoals || true,
                        requireApproval: teamData.requireApproval || false
                    }
                };
                
                // Save to Firestore
                await addDoc(collection(db, 'teams'), team);
                
                // Update local state
                this.teams.push(team);
                if (!this.userTeams[app.state.currentUser.uid]) {
                    this.userTeams[app.state.currentUser.uid] = [];
                }
                this.userTeams[app.state.currentUser.uid].push(team.id);
                
                return team;
            } catch (error) {
                throw error;
            }
        },
        
        async addTeamGoal(teamId, goalData) {
            try {
                const teamGoal = {
                    id: Date.now().toString(),
                    teamId: teamId,
                    title: goalData.title,
                    description: goalData.description,
                    category: goalData.category,
                    difficulty: goalData.difficulty,
                    duration: goalData.duration,
                    tasks: goalData.tasks,
                    assignedTo: goalData.assignedTo || [],
                    progress: {},
                    status: 'active',
                    createdAt: new Date(),
                    createdBy: app.state.currentUser.uid
                };
                
                // Save to Firestore
                await addDoc(collection(db, 'teamGoals'), teamGoal);
                
                // Update team goals
                const teamRef = doc(db, 'teams', teamId);
                await updateDoc(teamRef, {
                    goals: arrayUnion(teamGoal.id)
                });
                
                // Update local state
                const team = this.teams.find(t => t.id === teamId);
                if (team) {
                    team.goals.push(teamGoal.id);
                }
                
                return teamGoal;
            } catch (error) {
                throw error;
            }
        },
        
        async updateTeamGoalProgress(goalId, progress) {
            try {
                const goalRef = doc(db, 'teamGoals', goalId);
                await updateDoc(goalRef, {
                    [`progress.${app.state.currentUser.uid}`]: progress
                });
                
                // Check if goal is completed
                const goal = await getDoc(goalRef);
                const goalData = goal.data();
                
                if (goalData && this.isGoalCompleted(goalData)) {
                    await this.completeTeamGoal(goalId);
                }
                
                return true;
            } catch (error) {
                throw error;
            }
        },
        
        isGoalCompleted(goalData) {
            const totalProgress = Object.values(goalData.progress || {}).reduce((sum, p) => sum + p, 0);
            const requiredProgress = goalData.tasks?.length || 1;
            return totalProgress >= requiredProgress;
        },
        
        async completeTeamGoal(goalId) {
            try {
                const goalRef = doc(db, 'teamGoals', goalId);
                await updateDoc(goalRef, {
                    status: 'completed',
                    completedAt: new Date()
                });
                
                // Distribute rewards to team members
                const goal = await getDoc(goalRef);
                const goalData = goal.data();
                
                if (goalData) {
                    await this.distributeTeamGoalRewards(goalData);
                }
                
                return true;
            } catch (error) {
                throw error;
            }
        },
        
        async distributeTeamGoalRewards(goalData) {
            const team = this.teams.find(t => t.id === goalData.teamId);
            if (!team) return;
            
            const rewardPerMember = Math.floor(100 / team.members.length); // Base reward
            
            for (const memberId of team.members) {
                try {
                    const userRef = doc(db, 'users', memberId);
                    await updateDoc(userRef, {
                        'stats.essence': increment(rewardPerMember)
                    });
                } catch (error) {
                    }
            }
        },
        
        async inviteToTeam(teamId, userEmail) {
            try {
                const invitation = {
                    id: Date.now().toString(),
                    teamId: teamId,
                    inviterId: app.state.currentUser.uid,
                    inviterName: app.state.userData.displayName,
                    inviteeEmail: userEmail,
                    status: 'pending',
                    createdAt: new Date()
                };
                
                // Save invitation to Firestore
                await addDoc(collection(db, 'teamInvitations'), invitation);
                
                // Send notification (would integrate with notification system)
                return invitation;
            } catch (error) {
                throw error;
            }
        }
    },
    
    // Community Events System
    communityEvents: {
        events: [],
        userEvents: {},
        
        async createEvent(eventData) {
            try {
                const event = {
                    id: Date.now().toString(),
                    title: eventData.title,
                    description: eventData.description,
                    type: eventData.type, // 'workshop', 'challenge', 'meetup', 'webinar'
                    startDate: eventData.startDate,
                    endDate: eventData.endDate,
                    location: eventData.location, // 'virtual', 'physical', 'hybrid'
                    maxParticipants: eventData.maxParticipants,
                    participants: [app.state.currentUser.uid],
                    organizerId: app.state.currentUser.uid,
                    organizerName: app.state.userData.displayName,
                    status: 'upcoming',
                    createdAt: new Date()
                };
                
                // Save to Firestore
                await addDoc(collection(db, 'communityEvents'), event);
                
                // Update local state
                this.events.push(event);
                if (!this.userEvents[app.state.currentUser.uid]) {
                    this.userEvents[app.state.currentUser.uid] = [];
                }
                this.userEvents[app.state.currentUser.uid].push(event.id);
                
                return event;
            } catch (error) {
                throw error;
            }
        },
        
        async joinEvent(eventId) {
            try {
                const eventRef = doc(db, 'communityEvents', eventId);
                const eventDoc = await getDoc(eventRef);
                const eventData = eventDoc.data();
                
                if (!eventData) {
                    throw new Error('Event not found');
                }
                
                if (eventData.participants.length >= eventData.maxParticipants) {
                    throw new Error('Event is full');
                }
                
                await updateDoc(eventRef, {
                    participants: arrayUnion(app.state.currentUser.uid)
                });
                
                // Update local state
                const event = this.events.find(e => e.id === eventId);
                if (event && !event.participants.includes(app.state.currentUser.uid)) {
                    event.participants.push(app.state.currentUser.uid);
                }
                
                return true;
            } catch (error) {
                throw error;
            }
        },
        
        async getUpcomingEvents(limit = 10) {
            try {
                const eventsQuery = query(
                    collection(db, 'communityEvents'),
                    where('startDate', '>', new Date()),
                    where('status', '==', 'upcoming'),
                    orderBy('startDate', 'asc'),
                    limit(limit)
                );
                
                const snapshot = await getDocs(eventsQuery);
                const events = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                // Update local state
                this.events = events;
                
                return events;
            } catch (error) {
                throw error;
            }
        }
    },
    
    // Peer Accountability System
    peerAccountability: {
        accountabilityPartners: {},
        checkIns: {},
        
        async findAccountabilityPartner(preferences) {
            try {
                // Find users with similar goals or interests
                const usersQuery = query(
                    collection(db, 'users'),
                    where('settings.accountabilityEnabled', '==', true),
                    limit(10)
                );
                
                const snapshot = await getDocs(usersQuery);
                const potentialPartners = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(user => user.id !== app.state.currentUser.uid);
                
                // Match based on preferences
                const matches = this.matchAccountabilityPartners(potentialPartners, preferences);
                
                return matches;
            } catch (error) {
                throw error;
            }
        },
        
        matchAccountabilityPartners(users, preferences) {
            return users.map(user => {
                let score = 0;
                
                // Category match
                if (preferences.categories && user.preferences?.categories) {
                    const commonCategories = preferences.categories.filter(cat => 
                        user.preferences.categories.includes(cat)
                    );
                    score += commonCategories.length * 10;
                }
                
                // Time zone compatibility
                if (preferences.timeZone && user.preferences?.timeZone) {
                    const timeZoneDiff = Math.abs(preferences.timeZone - user.preferences.timeZone);
                    if (timeZoneDiff <= 2) score += 20;
                    else if (timeZoneDiff <= 4) score += 10;
                }
                
                // Activity level match
                if (preferences.activityLevel && user.preferences?.activityLevel) {
                    if (preferences.activityLevel === user.preferences.activityLevel) {
                        score += 15;
                    }
                }
                
                return { user, score };
            }).sort((a, b) => b.score - a.score);
        },
        
        async sendAccountabilityRequest(partnerId, message) {
            try {
                const request = {
                    id: Date.now().toString(),
                    fromUserId: app.state.currentUser.uid,
                    fromUserName: app.state.userData.displayName,
                    toUserId: partnerId,
                    message: message,
                    status: 'pending',
                    createdAt: new Date()
                };
                
                // Save to Firestore
                await addDoc(collection(db, 'accountabilityRequests'), request);
                
                // Send notification
                return request;
            } catch (error) {
                throw error;
            }
        },
        
        async acceptAccountabilityRequest(requestId) {
            try {
                const requestRef = doc(db, 'accountabilityRequests', requestId);
                await updateDoc(requestRef, {
                    status: 'accepted',
                    acceptedAt: new Date()
                });
                
                // Create accountability partnership
                const request = await getDoc(requestRef);
                const requestData = request.data();
                
                if (requestData) {
                    await this.createAccountabilityPartnership(requestData);
                }
                
                return true;
            } catch (error) {
                throw error;
            }
        },
        
        async createAccountabilityPartnership(requestData) {
            const partnership = {
                id: Date.now().toString(),
                user1Id: requestData.fromUserId,
                user2Id: requestData.toUserId,
                startDate: new Date(),
                status: 'active',
                checkInFrequency: 'daily', // 'daily', 'weekly', 'custom'
                lastCheckIn: null
            };
            
            // Save to Firestore
            await addDoc(collection(db, 'accountabilityPartnerships'), partnership);
            
            // Update local state
            this.accountabilityPartners[requestData.fromUserId] = requestData.toUserId;
            this.accountabilityPartners[requestData.toUserId] = requestData.fromUserId;
            
            return partnership;
        },
        
        async submitCheckIn(partnershipId, checkInData) {
            try {
                const checkIn = {
                    id: Date.now().toString(),
                    partnershipId: partnershipId,
                    userId: app.state.currentUser.uid,
                    userName: app.state.userData.displayName,
                    progress: checkInData.progress,
                    challenges: checkInData.challenges,
                    nextSteps: checkInData.nextSteps,
                    mood: checkInData.mood,
                    createdAt: new Date()
                };
                
                // Save to Firestore
                await addDoc(collection(db, 'accountabilityCheckIns'), checkIn);
                
                // Update partnership
                const partnershipRef = doc(db, 'accountabilityPartnerships', partnershipId);
                await updateDoc(partnershipRef, {
                    lastCheckIn: new Date()
                });
                
                // Update local state
                if (!this.checkIns[partnershipId]) {
                    this.checkIns[partnershipId] = [];
                }
                this.checkIns[partnershipId].push(checkIn);
                
                return checkIn;
            } catch (error) {
                throw error;
            }
        }
    },
    
    // Initialize all social features
    async init() {
        // Initialize all subsystems
        this.groupChallenges.activeChallenges = [];
        this.groupChallenges.userChallenges = {};
        
        this.socialFeed.posts = [];
        this.socialFeed.userPosts = {};
        
        this.teamGoals.teams = [];
        this.teamGoals.userTeams = {};
        
        this.communityEvents.events = [];
        this.communityEvents.userEvents = {};
        
        this.peerAccountability.accountabilityPartners = {};
        this.peerAccountability.checkIns = {};
        
        // Set up real-time listeners
        this.setupRealTimeListeners();
        
        },
    
    setupRealTimeListeners() {
        // Listen for new group challenges
        onSnapshot(collection(db, 'groupChallenges'), (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const challenge = { id: change.doc.id, ...change.doc.data() };
                    this.groupChallenges.activeChallenges.push(challenge);
                }
            });
        });
        
        // Listen for new social feed posts
        onSnapshot(collection(db, 'socialFeed'), (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const post = { id: change.doc.id, ...change.doc.data() };
                    this.socialFeed.posts.unshift(post);
                }
            });
        });
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedSocialFeatures;
} else {
    window.AdvancedSocialFeatures = AdvancedSocialFeatures;
} 