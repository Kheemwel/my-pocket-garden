// Offline progress calculator
import type { GameState, Plot } from '../core/types';
import { SHOP_RESTOCK_INTERVAL } from '../core/GameStore';

export interface OfflineProgressResult {
  plantsReadyToHarvest: number;
  shopRestocksOccurred: number;
  timeOfflineMs: number;
}

// Calculate and apply offline progress to game state
export function calculateOfflineProgress(
  savedState: GameState,
  currentTime: number = Date.now()
): { updatedState: GameState; result: OfflineProgressResult } {
  const timeOfflineMs = currentTime - savedState.lastSaveTime;
  
  if (timeOfflineMs <= 0) {
    return {
      updatedState: savedState,
      result: {
        plantsReadyToHarvest: 0,
        shopRestocksOccurred: 0,
        timeOfflineMs: 0,
      },
    };
  }
  
  // Count plants that became ready during offline time
  let plantsReadyToHarvest = 0;
  
  // Update plant growth - plants continue growing while offline
  const updatedPlots: Plot[] = savedState.plots.map(plot => ({
    ...plot,
    slots: plot.slots.map(slot => {
      if (!slot.plant) return slot;
      
      const plant = slot.plant;
      const timeElapsed = currentTime - plant.plantedAt;
      const wasReady = timeElapsed - timeOfflineMs >= plant.growthTimeMs;
      const isNowReady = timeElapsed >= plant.growthTimeMs;
      
      // Count newly ready plants
      if (!wasReady && isNowReady) {
        plantsReadyToHarvest++;
      }
      
      // Plant data stays the same - we calculate remaining time dynamically
      return slot;
    }),
  }));
  
  // Calculate how many shop restocks occurred
  const timeSinceLastRestock = currentTime - savedState.lastShopRestock;
  const shopRestocksOccurred = Math.floor(timeSinceLastRestock / SHOP_RESTOCK_INTERVAL);
  
  // Update last restock time if restocks occurred
  const updatedLastRestock = shopRestocksOccurred > 0
    ? savedState.lastShopRestock + (shopRestocksOccurred * SHOP_RESTOCK_INTERVAL)
    : savedState.lastShopRestock;
  
  const updatedState: GameState = {
    ...savedState,
    plots: updatedPlots,
    lastShopRestock: updatedLastRestock,
    lastSaveTime: currentTime,
    // Clear shop stock if restock occurred - will be repopulated
    shopStock: shopRestocksOccurred > 0 ? [] : savedState.shopStock,
  };
  
  return {
    updatedState,
    result: {
      plantsReadyToHarvest,
      shopRestocksOccurred,
      timeOfflineMs,
    },
  };
}

// Format offline time for display
export function formatOfflineTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}
