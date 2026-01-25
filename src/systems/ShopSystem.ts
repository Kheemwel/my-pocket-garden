// Shop system for buying seeds and plots
import { gameStore } from '../core/GameStore';
import { SEEDS } from '../data/seeds';
import { getNextPlotPrice, canBuyMorePlots, SHOP_CONFIG } from '../data/shop';
import type { ShopStock } from '../core/types';

// Helper function for random integer
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const shopSystem = {
  // Restock the shop with random seeds
  restockShop(): ShopStock[] {
    const stock: ShopStock[] = [];
    
    // Filter seeds that pass the chance check
    const availableSeeds = SEEDS.filter(seed => Math.random() < seed.shopChance);
    
    // Limit to max seed types
    const selectedSeeds = availableSeeds.slice(0, SHOP_CONFIG.maxSeedTypes);
    
    // Generate stock for each seed
    selectedSeeds.forEach(seed => {
      stock.push({
        seedId: seed.id,
        quantity: randomInt(seed.shopStockMin, seed.shopStockMax),
        price: seed.buyPrice,
      });
    });
    
    // Update the store
    gameStore.setShopStock(stock);
    
    return stock;
  },
  
  // Buy seeds from shop
  buySeed(seedId: string, quantity: number = 1): { success: boolean; error?: string } {
    const stockItem = gameStore.state.shopStock.find(s => s.seedId === seedId);
    
    if (!stockItem) {
      return { success: false, error: 'Item not in stock' };
    }
    
    if (stockItem.quantity < quantity) {
      return { success: false, error: 'Not enough stock' };
    }
    
    const totalCost = stockItem.price * quantity;
    
    if (gameStore.state.money < totalCost) {
      return { success: false, error: 'Not enough money' };
    }
    
    const success = gameStore.buyFromShop(seedId, quantity);
    
    return { success };
  },
  
  // Buy a new plot
  buyPlot(): { success: boolean; error?: string; plotId?: number } {
    const currentPlotCount = gameStore.state.plots.length;
    
    if (!canBuyMorePlots(currentPlotCount)) {
      return { success: false, error: 'Maximum plots reached' };
    }
    
    const price = getNextPlotPrice(currentPlotCount);
    if (price === null) {
      return { success: false, error: 'No more plots available' };
    }
    
    if (gameStore.state.money < price) {
      return { success: false, error: 'Not enough money' };
    }
    
    // Spend money and add plot
    if (!gameStore.spendMoney(price, 'buy plot')) {
      return { success: false, error: 'Transaction failed' };
    }
    
    const plotId = gameStore.addPlot();
    
    return { success: true, plotId };
  },
  
  // Get current shop stock
  getStock(): ShopStock[] {
    return gameStore.state.shopStock;
  },
  
  // Check if shop needs initial stock
  needsInitialStock(): boolean {
    return gameStore.state.shopStock.length === 0;
  },
  
  // Get next plot price
  getNextPlotPrice(): number | null {
    return getNextPlotPrice(gameStore.state.plots.length);
  },
  
  // Check if can buy more plots
  canBuyMorePlots(): boolean {
    return canBuyMorePlots(gameStore.state.plots.length);
  },
  
  // Check if can afford next plot
  canAffordNextPlot(): boolean {
    const price = this.getNextPlotPrice();
    if (price === null) return false;
    return gameStore.state.money >= price;
  },
};
