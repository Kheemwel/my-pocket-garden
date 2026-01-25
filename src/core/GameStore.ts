// Central game state store using SolidJS reactivity
import { createSignal, createEffect, batch } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import type { GameState, Plot, PlotSlot, ShopStock, ItemStack } from './types';
import { eventBus } from './EventBus';

// Constants
export const SLOTS_PER_PLOT = 25;
export const SHOP_RESTOCK_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Create an empty plot with 25 slots
function createEmptyPlot(id: number): Plot {
  const slots: PlotSlot[] = [];
  for (let i = 0; i < SLOTS_PER_PLOT; i++) {
    slots.push({ id: i, plant: null });
  }
  return { id, slots };
}

// Initial game state
function getInitialState(): GameState {
  return {
    money: 100,
    plots: [createEmptyPlot(0)],
    currentPlotIndex: 0,
    inventory: {
      'seed_tomato': 5,
      'seed_carrot': 3,
    },
    selectedSeedId: null,
    shopStock: [],
    lastShopRestock: 0,
    lastSaveTime: Date.now(),
  };
}

// Create the store
const [state, setState] = createStore<GameState>(getInitialState());

// Derived signals for common queries
const [currentPlot, setCurrentPlot] = createSignal<Plot>(state.plots[0]);

// Update current plot when index changes
createEffect(() => {
  const plot = state.plots[state.currentPlotIndex];
  if (plot) {
    setCurrentPlot(plot);
  }
});

// Game store actions
export const gameStore = {
  // Getters
  get state() { return state; },
  get currentPlot() { return currentPlot; },
  
  // Money actions
  addMoney(amount: number, reason: string = 'unknown') {
    setState('money', m => m + amount);
    eventBus.emit('money:changed', { amount, reason });
  },
  
  spendMoney(amount: number, reason: string = 'purchase'): boolean {
    if (state.money < amount) return false;
    setState('money', m => m - amount);
    eventBus.emit('money:changed', { amount: -amount, reason });
    return true;
  },
  
  // Inventory actions
  addItem(itemId: string, quantity: number = 1) {
    setState('inventory', itemId, (current = 0) => current + quantity);
    eventBus.emit('item:added', { itemId, quantity });
  },
  
  removeItem(itemId: string, quantity: number = 1): boolean {
    const current = state.inventory[itemId] || 0;
    if (current < quantity) return false;
    
    setState('inventory', itemId, c => c - quantity);
    if (state.inventory[itemId] === 0) {
      setState('inventory', produce(inv => {
        delete inv[itemId];
      }));
    }
    eventBus.emit('item:removed', { itemId, quantity });
    return true;
  },
  
  hasItem(itemId: string, quantity: number = 1): boolean {
    return (state.inventory[itemId] || 0) >= quantity;
  },
  
  getItemCount(itemId: string): number {
    return state.inventory[itemId] || 0;
  },
  
  // Seed selection
  selectSeed(seedId: string | null) {
    setState('selectedSeedId', seedId);
  },
  
  // Plot actions
  setCurrentPlotIndex(index: number) {
    if (index >= 0 && index < state.plots.length) {
      setState('currentPlotIndex', index);
    }
  },
  
  addPlot(): number {
    const newPlotId = state.plots.length;
    setState('plots', plots => [...plots, createEmptyPlot(newPlotId)]);
    eventBus.emit('plot:purchased', { plotId: newPlotId });
    return newPlotId;
  },
  
  // Plant actions
  plantSeed(plotId: number, slotId: number, seedId: string, growthTimeMs: number): boolean {
    const plot = state.plots[plotId];
    if (!plot) return false;
    
    const slot = plot.slots[slotId];
    if (!slot || slot.plant !== null) return false;
    
    // Check if player has the seed
    if (!this.hasItem(seedId)) return false;
    
    // Remove seed from inventory
    this.removeItem(seedId);
    
    const plantedAt = Date.now();
    setState('plots', plotId, 'slots', slotId, 'plant', {
      seedId,
      plantedAt,
      growthTimeMs,
    });
    
    eventBus.emit('plant:added', { plotId, slotId, seedId, plantedAt });
    return true;
  },
  
  harvestPlant(plotId: number, slotId: number, yields: ItemStack[]): boolean {
    const plot = state.plots[plotId];
    if (!plot) return false;
    
    const slot = plot.slots[slotId];
    if (!slot || !slot.plant) return false;
    
    // Add harvested items to inventory
    yields.forEach(item => {
      this.addItem(item.itemId, item.quantity);
    });
    
    // Clear the slot
    setState('plots', plotId, 'slots', slotId, 'plant', null);
    
    eventBus.emit('plant:harvested', { plotId, slotId, yields });
    return true;
  },
  
  // Shop actions
  setShopStock(stock: ShopStock[]) {
    setState('shopStock', stock);
    setState('lastShopRestock', Date.now());
    eventBus.emit('shop:restocked', { availableSeeds: stock });
  },
  
  buyFromShop(seedId: string, quantity: number = 1): boolean {
    const stockItem = state.shopStock.find(s => s.seedId === seedId);
    if (!stockItem || stockItem.quantity < quantity) return false;
    
    const totalCost = stockItem.price * quantity;
    if (!this.spendMoney(totalCost, `buy ${seedId}`)) return false;
    
    // Add seeds to inventory
    this.addItem(seedId, quantity);
    
    // Reduce shop stock (keep items even with 0 quantity)
    setState('shopStock', stock => 
      stock.map(s => s.seedId === seedId 
        ? { ...s, quantity: s.quantity - quantity }
        : s
      )
    );
    
    return true;
  },
  
  // Save/Load
  getSerializableState(): GameState {
    return JSON.parse(JSON.stringify(state));
  },
  
  loadState(newState: GameState) {
    batch(() => {
      setState('money', newState.money);
      setState('plots', newState.plots);
      setState('currentPlotIndex', newState.currentPlotIndex);
      setState('inventory', newState.inventory);
      setState('selectedSeedId', newState.selectedSeedId);
      setState('shopStock', newState.shopStock);
      setState('lastShopRestock', newState.lastShopRestock);
      setState('lastSaveTime', newState.lastSaveTime);
    });
    eventBus.emit('game:loaded', { state: newState });
  },
  
  resetState() {
    this.loadState(getInitialState());
  },
  
  updateLastSaveTime() {
    setState('lastSaveTime', Date.now());
  },
};

export { state as gameState };
