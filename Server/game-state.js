import { analytics } from './firebase-config.js';
import { logEvent } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

// Game State Enum
export const GameState = {
    START: 'start',
    PLAYING: 'playing',
    PAUSED: 'paused',
    CUTSCENE: 'cutscene',
    GAME_OVER: 'game_over'
};

// Feature Tracking
export const GameFeatures = {
    // Core Game Features
    CORE: {
        MOVEMENT: 'player_movement',
        SHOOTING: 'shooting_mechanics',
        COLLISION: 'collision_detection',
        SCORING: 'scoring_system',
        LIVES: 'lives_system',
        LEVELS: 'level_progression'
    },
    
    // Power-ups and Items
    POWERUPS: {
        AUTO_FIRE: 'auto_fire',
        SHIELD: 'shield',
        BOMB: 'bomb',
        COINS: 'coin_collection'
    },
    
    // UI Features
    UI: {
        LEADERBOARD: 'leaderboard',
        PROFILE: 'user_profile',
        BACKPACK: 'backpack_system',
        ACHIEVEMENTS: 'achievements'
    },
    
    // Online Features
    ONLINE: {
        SCORE_SUBMISSION: 'score_submission',
        PROFILE_SYNC: 'profile_sync',
        LEADERBOARD_SYNC: 'leaderboard_sync'
    }
};

// Game State Manager
export class GameStateManager {
    constructor() {
        this.currentState = GameState.START;
        this.features = new Set();
        this.gameObjects = {
            bubbles: [],
            projectiles: [],
            drops: [],
            particles: [],
            explosions: [],
            speechBubbles: [],
            paddle: null,
            companion: null
        };
        this.gameStats = {
            score: 0,
            lives: 3,
            level: 1,
            combo: 0,
            roundTimeRemaining: 25,
            difficultyFactor: 1.0,
            coinsCollected: 0,
            xp: 0,
            xpLevel: 1
        };
        this.powerUps = {
            speedBoostActive: false,
            shieldActive: false,
            weaponBoostActive: false,
            spreadShotActive: false,
            slowMotionActive: false,
            paddleInvulnerable: false
        };
        this.initializeFeatures();
    }

    initializeFeatures() {
        // Initialize all core features
        Object.values(GameFeatures.CORE).forEach(feature => {
            this.features.add(feature);
        });
        
        // Initialize UI features
        Object.values(GameFeatures.UI).forEach(feature => {
            this.features.add(feature);
        });
        
        // Initialize online features
        Object.values(GameFeatures.ONLINE).forEach(feature => {
            this.features.add(feature);
        });
    }

    updateState(newState) {
        this.currentState = newState;
        this.trackStateChange(newState);
        return this.currentState;
    }

    resetGame() {
        // Reset game objects
        this.gameObjects = {
            bubbles: [],
            projectiles: [],
            drops: [],
            particles: [],
            explosions: [],
            speechBubbles: [],
            paddle: this.gameObjects.paddle, // Preserve paddle but reset its properties
            companion: null
        };

        // Reset game stats
        this.gameStats = {
            score: 0,
            lives: 3,
            level: 1,
            combo: 0,
            roundTimeRemaining: 25,
            difficultyFactor: 1.0,
            coinsCollected: 0,
            xp: 0,
            xpLevel: 1
        };

        // Reset power-ups
        this.resetPowerUps();

        // Update state
        this.updateState(GameState.PLAYING);
    }

    resetPowerUps() {
        this.powerUps = {
            speedBoostActive: false,
            shieldActive: false,
            weaponBoostActive: false,
            spreadShotActive: false,
            slowMotionActive: false,
            paddleInvulnerable: false
        };
    }

    getDifficulty() {
        if (this.gameStats.level < 10) {
            return { name: "Easy", factor: 1.0 };
        } else if (this.gameStats.level < 20) {
            return { name: "Medium", factor: 1.1 };
        } else {
            return { name: "Hard", factor: 1.2 };
        }
    }

    getState() {
        return this.currentState;
    }

    enableFeature(feature) {
        this.features.add(feature);
        this.trackFeatureEnable(feature);
    }

    disableFeature(feature) {
        this.features.delete(feature);
        this.trackFeatureDisable(feature);
    }

    isFeatureEnabled(feature) {
        return this.features.has(feature);
    }

    // Analytics Tracking
    trackStateChange(state) {
        logEvent(analytics, 'game_state_change', {
            state: state
        });
    }

    trackFeatureEnable(feature) {
        logEvent(analytics, 'feature_enable', {
            feature: feature
        });
    }

    trackFeatureDisable(feature) {
        logEvent(analytics, 'feature_disable', {
            feature: feature
        });
    }

    trackScore(score) {
        logEvent(analytics, 'score_update', {
            score: score
        });
    }

    trackLevelComplete(level) {
        logEvent(analytics, 'level_complete', {
            level: level
        });
    }

    trackPowerUpCollect(powerUpType) {
        logEvent(analytics, 'powerup_collect', {
            powerup_type: powerUpType
        });
    }

    trackGameOver(finalScore) {
        logEvent(analytics, 'game_over', {
            final_score: finalScore
        });
    }
}

// Export a singleton instance
export const gameStateManager = new GameStateManager(); 