// Garden system for planting and harvesting
import { gameStore } from '../core/GameStore';
import { timeManager } from '../core/TimeManager';
import { getSeed, getRandomYield } from '../data/seeds';
import type { ItemStack } from '../core/types';

export const gardenSystem = {
  // Plant a seed in a slot
  plantSeed(plotId: number, slotId: number, seedId: string): boolean {
    const seed = getSeed(seedId);
    if (!seed) {
      console.error(`Unknown seed: ${seedId}`);
      return false;
    }
    
    return gameStore.plantSeed(plotId, slotId, seedId, seed.growthTimeMs);
  },
  
  // Check if a plant is ready to harvest
  isReadyToHarvest(plotId: number, slotId: number): boolean {
    const plot = gameStore.state.plots[plotId];
    if (!plot) return false;
    
    const slot = plot.slots[slotId];
    if (!slot?.plant) return false;
    
    return timeManager.isPlantReady(slot.plant.plantedAt, slot.plant.growthTimeMs);
  },
  
  // Get time remaining for a plant
  getTimeRemaining(plotId: number, slotId: number): number {
    const plot = gameStore.state.plots[plotId];
    if (!plot) return 0;
    
    const slot = plot.slots[slotId];
    if (!slot?.plant) return 0;
    
    return timeManager.getPlantTimeRemaining(slot.plant.plantedAt, slot.plant.growthTimeMs);
  },
  
  // Get formatted time remaining
  getFormattedTimeRemaining(plotId: number, slotId: number): string {
    const remaining = this.getTimeRemaining(plotId, slotId);
    return timeManager.formatTimeRemaining(remaining);
  },
  
  // Harvest a plant
  harvestPlant(plotId: number, slotId: number): ItemStack[] | null {
    const plot = gameStore.state.plots[plotId];
    if (!plot) return null;
    
    const slot = plot.slots[slotId];
    if (!slot?.plant) return null;
    
    // Check if ready
    if (!this.isReadyToHarvest(plotId, slotId)) {
      return null;
    }
    
    // Get the seed info to determine yield
    const seed = getSeed(slot.plant.seedId);
    if (!seed) return null;
    
    // Calculate yield
    const yieldAmount = getRandomYield(seed);
    const yields: ItemStack[] = [
      { itemId: seed.yieldItemId, quantity: yieldAmount }
    ];
    
    // Perform harvest
    const success = gameStore.harvestPlant(plotId, slotId, yields);
    
    return success ? yields : null;
  },
  
  // Get growth progress as percentage (0-100)
  getGrowthProgress(plotId: number, slotId: number): number {
    const plot = gameStore.state.plots[plotId];
    if (!plot) return 0;
    
    const slot = plot.slots[slotId];
    if (!slot?.plant) return 0;
    
    const { plantedAt, growthTimeMs } = slot.plant;
    const elapsed = Date.now() - plantedAt;
    const progress = Math.min(100, (elapsed / growthTimeMs) * 100);
    
    return Math.floor(progress);
  },
  
  // Quick plant - plant selected seed in first available slot
  quickPlant(plotId: number): { slotId: number; success: boolean } | null {
    const selectedSeedId = gameStore.state.selectedSeedId;
    if (!selectedSeedId) return null;
    
    const plot = gameStore.state.plots[plotId];
    if (!plot) return null;
    
    // Find first empty slot
    const emptySlot = plot.slots.find(slot => slot.plant === null);
    if (!emptySlot) return null;
    
    const success = this.plantSeed(plotId, emptySlot.id, selectedSeedId);
    return { slotId: emptySlot.id, success };
  },
  
  // Harvest all ready plants in a plot
  harvestAll(plotId: number): ItemStack[] {
    const plot = gameStore.state.plots[plotId];
    if (!plot) return [];
    
    const allYields: ItemStack[] = [];
    
    plot.slots.forEach(slot => {
      if (slot.plant && this.isReadyToHarvest(plotId, slot.id)) {
        const yields = this.harvestPlant(plotId, slot.id);
        if (yields) {
          allYields.push(...yields);
        }
      }
    });
    
    return allYields;
  },
  
  // Count ready plants in a plot
  countReadyPlants(plotId: number): number {
    const plot = gameStore.state.plots[plotId];
    if (!plot) return 0;
    
    return plot.slots.filter(slot => 
      slot.plant && this.isReadyToHarvest(plotId, slot.id)
    ).length;
  },
  
  // Count empty slots in a plot
  countEmptySlots(plotId: number): number {
    const plot = gameStore.state.plots[plotId];
    if (!plot) return 0;
    
    return plot.slots.filter(slot => slot.plant === null).length;
  },
  
  // Count growing plants in a plot
  countGrowingPlants(plotId: number): number {
    const plot = gameStore.state.plots[plotId];
    if (!plot) return 0;
    
    return plot.slots.filter(slot => 
      slot.plant && !this.isReadyToHarvest(plotId, slot.id)
    ).length;
  },
};
