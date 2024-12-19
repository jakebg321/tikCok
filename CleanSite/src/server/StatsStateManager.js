// src/server/StatsStateManager.js

// Use window to persist the instance across hot reloads
const getGlobalInstance = () => {
    if (typeof window !== 'undefined') {
        if (!window.__statsManagerInstance) {
            console.log('[StatsManager] Creating new global instance');
            window.__statsManagerInstance = new StatsStateManager();
        }
        return window.__statsManagerInstance;
    }
    return null;
};

class StatsStateManager {
    constructor() {
        // Check if we already have an instance in the global scope
        if (typeof window !== 'undefined' && window.__statsManagerInstance) {
            return window.__statsManagerInstance;
        }

        
        this.DEBUG = true;
        this.initialized = false;
        this.initializeStats();
    }

    initializeStats() {
        if (this.initialized) return;
        
        
        this.baseTimestamp = new Date('2024-12-01').getTime();
        this.baseStats = {
            videos: 421,
            views: 43300000,
            likes: 23100,
            successRate: 85
        };

        this.rates = {
            videosPerSecond: 0.05,
            viewsPerSecond: 1200,
            likesPerSecond: 8
        };

        this.currentStats = this.calculateCurrentStats();
        this.initialized = true;
        
    }

    debug(message, data) {
        if (this.DEBUG) {
            if (data) console.log(data);
        }
    }

    calculateCurrentStats() {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - this.baseTimestamp) / 1000);

        const stats = {
            videos: Math.floor(this.baseStats.videos + (elapsedSeconds * this.rates.videosPerSecond)),
            views: Math.floor(this.baseStats.views + (elapsedSeconds * this.rates.viewsPerSecond)),
            likes: Math.floor(this.baseStats.likes + (elapsedSeconds * this.rates.likesPerSecond)),
            successRate: Math.min(98, this.baseStats.successRate + (elapsedSeconds * 0.0001))
        };

        return stats;
    }

    getStats() {
        if (!this.initialized) {
            this.initializeStats();
        }
        this.currentStats = this.calculateCurrentStats();
        const result = {
            ...this.currentStats,
            formattedStats: this.getFormattedStats()
        };
        return result;
    }

    getFormattedStats() {
        const formatter = new Intl.NumberFormat('en-US', {
            notation: 'compact',
            maximumFractionDigits: 1
        });

        return {
            videos: formatter.format(this.currentStats.videos),
            views: formatter.format(this.currentStats.views),
            likes: formatter.format(this.currentStats.likes),
            successRate: this.currentStats.successRate.toFixed(1) + '%'
        };
    }

    // Add method to get change rates for trends
    getTrends() {
        return {
            videos: ((this.currentStats.videos / 1000) * 0.1).toFixed(1),
            views: '5.2',
            likes: '4.8',
            successRate: (this.currentStats.successRate / 100).toFixed(1)
        };
    }
}

// Export a singleton instance using the window object for persistence
export const statsManager = getGlobalInstance() || new StatsStateManager();