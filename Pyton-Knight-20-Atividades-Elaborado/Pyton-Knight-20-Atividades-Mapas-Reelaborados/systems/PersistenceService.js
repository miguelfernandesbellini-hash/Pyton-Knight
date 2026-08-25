(function () {
    'use strict';
    let memoryState = null;
    function defaults () { return { schemaVersion: 2, walletCoins: 0, totalXp: 0, completedActivities: [], unlockedMax: 1, rewardedActivities: {}, updatedAt: null }; }
    function normalize (raw) {
        const state = raw && typeof raw === 'object' ? raw : {}; const result = defaults();
        result.walletCoins = Number.isFinite(state.walletCoins) ? Math.max(0, state.walletCoins) : 0;
        result.totalXp = Number.isFinite(state.totalXp) ? Math.max(0, state.totalXp) : 0;
        result.completedActivities = Array.isArray(state.completedActivities) ? [...new Set(state.completedActivities.filter(Number.isInteger))] : [];
        result.unlockedMax = Number.isInteger(state.unlockedMax) ? Math.min(20, Math.max(1, state.unlockedMax)) : 1;
        result.rewardedActivities = state.rewardedActivities && typeof state.rewardedActivities === 'object' ? { ...state.rewardedActivities } : {};
        result.updatedAt = state.updatedAt || null; return result;
    }
    function storageAvailable () { try { return typeof window.localStorage !== 'undefined' && window.localStorage !== null; } catch (error) { return false; } }
    window.PersistenceService = {
        load () { if (!storageAvailable()) { memoryState = normalize(memoryState); return JSON.parse(JSON.stringify(memoryState)); } try { const raw = window.localStorage.getItem(window.GAME_CONSTANTS.STORAGE_KEY); return normalize(raw ? JSON.parse(raw) : null); } catch (error) { return defaults(); } },
        save (state) { const value = normalize(state); value.updatedAt = new Date().toISOString(); if (storageAvailable()) { try { window.localStorage.setItem(window.GAME_CONSTANTS.STORAGE_KEY, JSON.stringify(value)); } catch (error) { memoryState = value; } } else memoryState = value; return JSON.parse(JSON.stringify(value)); },
        resetForTests () { memoryState = defaults(); if (storageAvailable()) window.localStorage.removeItem(window.GAME_CONSTANTS.STORAGE_KEY); return this.load(); }
    };
})();
