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
  // Restock the shop - stacks new stock with existing stock
  restockShop(): ShopStock[] {
    const currentStock = [...gameStore.state.shopStock];
    
    // Create a map of existing stock for easy lookup
    const stockMap = new Map<string, ShopStock>();
    currentStock.forEach(item => {
      stockMap.set(item.seedId, { ...item });
    });
    
    // For each seed, check if it passes the chance check and add stock
    SEEDS.forEach(seed => {
      if (Math.random() < seed.shopChance) {
        const addedQuantity = randomInt(seed.shopStockMin, seed.shopStockMax);
        
        if (stockMap.has(seed.id)) {
          // Stack with existing stock
          const existing = stockMap.get(seed.id)!;
          existing.quantity += addedQuantity;
        } else {
          // Add new stock entry
          stockMap.set(seed.id, {
            seedId: seed.id,
            quantity: addedQuantity,
            price: seed.buyPrice,
          });
        }
      }
    });
    
    // Convert map back to array
    const stock = Array.from(stockMap.values());
    
    // Update the store
    gameStore.setShopStock(stock);
    
    return stock;
  },
  
  // Initialize shop with all seeds (0 quantity for those not in stock)
  initializeShop(): ShopStock[] {
    const currentStock = gameStore.state.shopStock;
    const stockMap = new Map<string, ShopStock>();
    
    // First, add existing stock
    currentStock.forEach(item => {
      stockMap.set(item.seedId, { ...item });
    });
    
    // Ensure all seeds are represented (with 0 quantity if not in stock)
    SEEDS.forEach(seed => {
      if (!stockMap.has(seed.id)) {
        stockMap.set(seed.id, {
          seedId: seed.id,
          quantity: 0,
          price: seed.buyPrice,
        });
      }
    });
    
    const stock = Array.from(stockMap.values());
    gameStore.setShopStock(stock);
    return stock;
  },
  
  // Get all seeds with their stock status (for display)
  getAllSeedsWithStock(): ShopStock[] {
    const stockMap = new Map<string, ShopStock>();
    
    // Add current stock
    gameStore.state.shopStock.forEach(item => {
      stockMap.set(item.seedId, { ...item });
    });
    
    // Ensure all seeds are represented
    SEEDS.forEach(seed => {
      if (!stockMap.has(seed.id)) {
        stockMap.set(seed.id, {
          seedId: seed.id,
          quantity: 0,
          price: seed.buyPrice,
        });
      }
    });
    
    return Array.from(stockMap.values());
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
