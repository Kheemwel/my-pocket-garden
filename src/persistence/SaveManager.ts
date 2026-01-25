// Save manager for game persistence
import type { GameState } from '../core/types';
import { gameStore } from '../core/GameStore';
import { eventBus } from '../core/EventBus';
import { calculateOfflineProgress, formatOfflineTime, type OfflineProgressResult } from './OfflineProgress';

const STORAGE_KEY = 'pocket-garden-save';
const AUTO_SAVE_INTERVAL = 30 * 1000; // 30 seconds

class SaveManagerClass {
  private autoSaveInterval: number | null = null;
  
  // Initialize save manager
  init() {
    const loadResult = this.load();
    this.startAutoSave();
    this.setupEventListeners();
    return loadResult;
  }
  
  private setupEventListeners() {
    eventBus.on('plant:harvested', () => this.save());
    eventBus.on('plot:purchased', () => this.save());
    eventBus.on('recipe:cooked', () => this.save());
    eventBus.on('item:crafted', () => this.save());
  }
  
  // Start auto-save interval
  startAutoSave() {
    if (this.autoSaveInterval !== null) return;
    
    this.autoSaveInterval = window.setInterval(() => {
      this.save();
    }, AUTO_SAVE_INTERVAL);
    
    // Also save when window closes
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.save();
      });
    }
  }
  
  // Stop auto-save
  stopAutoSave() {
    if (this.autoSaveInterval !== null) {
      window.clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }
  
  // Save game to localStorage
  save(): boolean {
    try {
      gameStore.updateLastSaveTime();
      const state = gameStore.getSerializableState();
      const json = JSON.stringify(state);
      localStorage.setItem(STORAGE_KEY, json);
      eventBus.emit('game:saved', { timestamp: Date.now() });
      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  }
  
  // Load game from localStorage
  load(): { success: boolean; offlineProgress?: OfflineProgressResult } {
    try {
      const json = localStorage.getItem(STORAGE_KEY);
      if (!json) {
        return { success: false };
      }
      
      const savedState: GameState = JSON.parse(json);
      const { updatedState, result: offlineResult } = calculateOfflineProgress(savedState);
      gameStore.loadState(updatedState);
      
      if (offlineResult.timeOfflineMs > 1000) {
        console.log(`Welcome back! You were away for ${formatOfflineTime(offlineResult.timeOfflineMs)}`);
        if (offlineResult.plantsReadyToHarvest > 0) {
          console.log(`${offlineResult.plantsReadyToHarvest} plant(s) are ready to harvest!`);
        }
      }
      
      return { success: true, offlineProgress: offlineResult };
    } catch (error) {
      console.error('Failed to load game:', error);
      return { success: false };
    }
  }
  
  // Reset game to initial state
  reset(): boolean {
    try {
      localStorage.removeItem(STORAGE_KEY);
      gameStore.resetState();
      return true;
    } catch (error) {
      console.error('Failed to reset game:', error);
      return false;
    }
  }
  
  // Export save as JSON file
  exportSave(): void {
    try {
      this.save();
      const state = gameStore.getSerializableState();
      const json = JSON.stringify(state, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `pocket-garden-save-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export save:', error);
    }
  }
  
  // Import save from JSON file
  importSave(file: File): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const json = e.target?.result as string;
          const state: GameState = JSON.parse(json);
          
          if (!this.validateState(state)) {
            resolve({ success: false, error: 'Invalid save file format' });
            return;
          }
          
          const { updatedState } = calculateOfflineProgress(state);
          gameStore.loadState(updatedState);
          this.save();
          
          resolve({ success: true });
        } catch (error) {
          resolve({ success: false, error: 'Failed to parse save file' });
        }
      };
      
      reader.onerror = () => {
        resolve({ success: false, error: 'Failed to read file' });
      };
      
      reader.readAsText(file);
    });
  }
  
  // Validate that state has required fields
  private validateState(state: unknown): state is GameState {
    if (typeof state !== 'object' || state === null) return false;
    const s = state as Record<string, unknown>;
    return (
      typeof s.money === 'number' &&
      Array.isArray(s.plots) &&
      typeof s.inventory === 'object' &&
      typeof s.currentPlotIndex === 'number'
    );
  }
  
  // Check if a save exists
  hasSave(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }
}

export const saveManager = new SaveManagerClass();
