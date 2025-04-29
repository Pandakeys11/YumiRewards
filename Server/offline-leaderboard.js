// Offline Leaderboard Manager
export class OfflineLeaderboard {
    constructor() {
        this.leaderboardKey = 'yumi_offline_leaderboard';
        this.initializeLeaderboard();
    }

    initializeLeaderboard() {
        if (!localStorage.getItem(this.leaderboardKey)) {
            localStorage.setItem(this.leaderboardKey, JSON.stringify([]));
        }
    }

    getLeaderboard() {
        return JSON.parse(localStorage.getItem(this.leaderboardKey)) || [];
    }

    saveLeaderboard(leaderboard) {
        localStorage.setItem(this.leaderboardKey, JSON.stringify(leaderboard));
    }

    // Check if username exists
    isUsernameTaken(username) {
        const leaderboard = this.getLeaderboard();
        return leaderboard.some(entry => entry.username.toLowerCase() === username.toLowerCase());
    }

    // Add or update player score
    updatePlayerScore(playerData) {
        const leaderboard = this.getLeaderboard();
        const existingIndex = leaderboard.findIndex(
            entry => entry.username.toLowerCase() === playerData.username.toLowerCase()
        );

        if (existingIndex === -1) {
            // New player
            leaderboard.push({
                username: playerData.username,
                score: playerData.score,
                rounds: playerData.rounds,
                timeSurvived: playerData.timeSurvived,
                xp: playerData.xp,
                xpLevel: playerData.xpLevel,
                bonusOpportunities: playerData.bonusOpportunities,
                coins: playerData.coins,
                lastPlayed: new Date().toISOString(),
                profilePic: playerData.profilePic || 'assets/images/default-profile.png'
            });
        } else {
            // Update existing player
            const existingPlayer = leaderboard[existingIndex];
            leaderboard[existingIndex] = {
                ...existingPlayer,
                score: Math.max(existingPlayer.score, playerData.score),
                rounds: Math.max(existingPlayer.rounds, playerData.rounds),
                timeSurvived: Math.max(existingPlayer.timeSurvived || 0, playerData.timeSurvived),
                xp: Math.max(existingPlayer.xp || 0, playerData.xp),
                xpLevel: Math.max(existingPlayer.xpLevel || 1, playerData.xpLevel),
                bonusOpportunities: (existingPlayer.bonusOpportunities || 0) + playerData.bonusOpportunities,
                coins: (existingPlayer.coins || 0) + playerData.coins,
                lastPlayed: new Date().toISOString(),
                profilePic: playerData.profilePic || existingPlayer.profilePic
            };
        }

        // Sort leaderboard by score
        leaderboard.sort((a, b) => {
            const aScore = (a.rounds * 0.6) + (a.score * 0.0003) + (a.timeSurvived * 0.001);
            const bScore = (b.rounds * 0.6) + (b.score * 0.0003) + (b.timeSurvived * 0.001);
            return bScore - aScore;
        });

        this.saveLeaderboard(leaderboard);
        return leaderboard;
    }

    // Get player stats
    getPlayerStats(username) {
        const leaderboard = this.getLeaderboard();
        return leaderboard.find(entry => entry.username.toLowerCase() === username.toLowerCase()) || null;
    }

    // Get top players
    getTopPlayers(limit = 10) {
        const leaderboard = this.getLeaderboard();
        return leaderboard.slice(0, limit);
    }

    // Delete player
    deletePlayer(username) {
        const leaderboard = this.getLeaderboard();
        const filteredLeaderboard = leaderboard.filter(
            entry => entry.username.toLowerCase() !== username.toLowerCase()
        );
        this.saveLeaderboard(filteredLeaderboard);
        return filteredLeaderboard;
    }

    // Clear all data
    clearLeaderboard() {
        localStorage.removeItem(this.leaderboardKey);
        this.initializeLeaderboard();
    }

    // Format player stats for display
    formatPlayerStats(stats) {
        if (!stats) return null;
        return {
            username: stats.username,
            score: stats.score.toLocaleString(),
            rounds: stats.rounds,
            timeSurvived: `${stats.timeSurvived}s`,
            xp: stats.xp.toLocaleString(),
            xpLevel: stats.xpLevel,
            coins: stats.coins.toLocaleString(),
            lastPlayed: new Date(stats.lastPlayed).toLocaleDateString(),
            profilePic: stats.profilePic
        };
    }
}

// Export a singleton instance
export const offlineLeaderboard = new OfflineLeaderboard(); 