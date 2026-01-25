// Core game types

export interface ItemStack {
  itemId: string;
  quantity: number;
}

export interface Plant {
  seedId: string;
  plantedAt: number;
  growthTimeMs: number;
}

export interface PlotSlot {
  id: number;
  plant: Plant | null;
}

export interface Plot {
  id: number;
  slots: PlotSlot[];
}

export interface ShopStock {
  seedId: string;
  quantity: number;
  price: number;
}

export interface GameState {
  money: number;
  plots: Plot[];
  currentPlotIndex: number;
  inventory: Record<string, number>;
  selectedSeedId: string | null;
  shopStock: ShopStock[];
  lastShopRestock: number;
  lastSaveTime: number;
}

// Event types
export type GameEvents = {
  'plant:added': { plotId: number; slotId: number; seedId: string; plantedAt: number };
  'plant:harvested': { plotId: number; slotId: number; yields: ItemStack[] };
  'item:added': { itemId: string; quantity: number };
  'item:removed': { itemId: string; quantity: number };
  'money:changed': { amount: number; reason: string };
  'shop:restocked': { availableSeeds: ShopStock[] };
  'recipe:cooked': { recipeId: string; output: ItemStack };
  'item:crafted': { recipeId: string; output: ItemStack };
  'plot:purchased': { plotId: number };
  'game:tick': { timestamp: number };
  'game:loaded': { state: GameState };
  'game:saved': { timestamp: number };
};

export type GameEventKey = keyof GameEvents;
