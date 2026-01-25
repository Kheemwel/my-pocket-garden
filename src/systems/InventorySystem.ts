// Inventory system for managing items
import { gameStore } from '../core/GameStore';
import { getItem, type ItemCategory, type ItemDefinition } from '../data/items';

export type SortOption = 'name' | 'quantity' | 'value';
export type SortDirection = 'asc' | 'desc';

export interface InventoryItem {
  itemId: string;
  quantity: number;
  definition: ItemDefinition;
}

export const inventorySystem = {
  // Get all inventory items with their definitions
  getAllItems(): InventoryItem[] {
    const inventory = gameStore.state.inventory;
    const items: InventoryItem[] = [];
    
    for (const [itemId, quantity] of Object.entries(inventory)) {
      if (quantity > 0) {
        const definition = getItem(itemId);
        if (definition) {
          items.push({ itemId, quantity, definition });
        }
      }
    }
    
    return items;
  },
  
  // Get items filtered by category
  getItemsByCategory(category: ItemCategory | 'all'): InventoryItem[] {
    const allItems = this.getAllItems();
    
    if (category === 'all') {
      return allItems;
    }
    
    return allItems.filter(item => item.definition.category === category);
  },
  
  // Sort items
  sortItems(
    items: InventoryItem[],
    sortBy: SortOption,
    direction: SortDirection = 'asc'
  ): InventoryItem[] {
    const sorted = [...items];
    
    sorted.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.definition.name.localeCompare(b.definition.name);
          break;
        case 'quantity':
          comparison = a.quantity - b.quantity;
          break;
        case 'value':
          comparison = a.definition.sellPrice - b.definition.sellPrice;
          break;
      }
      
      return direction === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  },
  
  // Sell an item
  sellItem(itemId: string, quantity: number = 1): { success: boolean; earnings?: number; error?: string } {
    const definition = getItem(itemId);
    if (!definition) {
      return { success: false, error: 'Unknown item' };
    }
    
    const currentQuantity = gameStore.getItemCount(itemId);
    if (currentQuantity < quantity) {
      return { success: false, error: 'Not enough items' };
    }
    
    const earnings = definition.sellPrice * quantity;
    
    // Remove items and add money
    if (!gameStore.removeItem(itemId, quantity)) {
      return { success: false, error: 'Failed to remove item' };
    }
    
    gameStore.addMoney(earnings, `sell ${quantity}x ${definition.name}`);
    
    return { success: true, earnings };
  },
  
  // Get total inventory value
  getTotalValue(): number {
    const items = this.getAllItems();
    return items.reduce((total, item) => {
      return total + (item.definition.sellPrice * item.quantity);
    }, 0);
  },
  
  // Get item count by category
  getCountByCategory(category: ItemCategory): number {
    const items = this.getItemsByCategory(category);
    return items.reduce((total, item) => total + item.quantity, 0);
  },
  
  // Check if player has required items (for recipes)
  hasItems(requirements: { itemId: string; quantity: number }[]): boolean {
    return requirements.every(req => 
      gameStore.hasItem(req.itemId, req.quantity)
    );
  },
  
  // Remove multiple items (for recipes)
  removeItems(items: { itemId: string; quantity: number }[]): boolean {
    // First check all items are available
    if (!this.hasItems(items)) {
      return false;
    }
    
    // Then remove them
    items.forEach(item => {
      gameStore.removeItem(item.itemId, item.quantity);
    });
    
    return true;
  },
  
  // Get seeds in inventory (for seed selector)
  getSeeds(): InventoryItem[] {
    return this.getItemsByCategory('seed');
  },
};
