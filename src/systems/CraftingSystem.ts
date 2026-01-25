// Crafting system for making items from crops and other materials
import { gameStore } from '../core/GameStore';
import { eventBus } from '../core/EventBus';
import { getCraftingRecipes, getRecipe, type Recipe } from '../data/recipes';
import { inventorySystem } from './InventorySystem';
import { getItem } from '../data/items';

export const craftingSystem = {
  // Get all crafting recipes
  getRecipes(): Recipe[] {
    return getCraftingRecipes();
  },
  
  // Check if player can craft a recipe
  canCraft(recipeId: string): boolean {
    const recipe = getRecipe(recipeId);
    if (!recipe || recipe.type !== 'crafting') {
      return false;
    }
    
    return inventorySystem.hasItems(recipe.ingredients);
  },
  
  // Get max times recipe can be crafted with current inventory
  getMaxCraftCount(recipeId: string): number {
    const recipe = getRecipe(recipeId);
    if (!recipe) return 0;
    
    let maxCount = Infinity;
    for (const ing of recipe.ingredients) {
      const available = gameStore.getItemCount(ing.itemId);
      const possible = Math.floor(available / ing.quantity);
      maxCount = Math.min(maxCount, possible);
    }
    
    return maxCount === Infinity ? 0 : maxCount;
  },
  
  // Craft a recipe
  craft(recipeId: string, times: number = 1): { success: boolean; error?: string; crafted?: number } {
    const recipe = getRecipe(recipeId);
    if (!recipe) {
      return { success: false, error: 'Unknown recipe' };
    }
    
    if (recipe.type !== 'crafting') {
      return { success: false, error: 'Not a crafting recipe' };
    }
    
    const maxCount = this.getMaxCraftCount(recipeId);
    const craftCount = Math.min(times, maxCount);
    
    if (craftCount <= 0) {
      return { success: false, error: 'Missing materials' };
    }
    
    // Remove ingredients (multiplied by craft count)
    const ingredientsToRemove = recipe.ingredients.map(ing => ({
      itemId: ing.itemId,
      quantity: ing.quantity * craftCount
    }));
    
    if (!inventorySystem.removeItems(ingredientsToRemove)) {
      return { success: false, error: 'Failed to consume materials' };
    }
    
    // Add output (multiplied by craft count)
    gameStore.addItem(recipe.output.itemId, recipe.output.quantity * craftCount);
    
    // Emit event
    eventBus.emit('item:crafted', { 
      recipeId, 
      output: { ...recipe.output, quantity: recipe.output.quantity * craftCount }
    });
    
    return { success: true, crafted: craftCount };
  },
  
  // Get available recipes (that can be crafted)
  getAvailableRecipes(): Recipe[] {
    return this.getRecipes().filter(recipe => this.canCraft(recipe.id));
  },
  
  // Get ingredient status for a recipe
  getIngredientStatus(recipeId: string): Array<{
    itemId: string;
    name: string;
    emoji: string;
    required: number;
    available: number;
    hasEnough: boolean;
  }> {
    const recipe = getRecipe(recipeId);
    if (!recipe) return [];
    
    return recipe.ingredients.map(ing => {
      const item = getItem(ing.itemId);
      const available = gameStore.getItemCount(ing.itemId);
      
      return {
        itemId: ing.itemId,
        name: item?.name || ing.itemId,
        emoji: item?.emoji || '❓',
        required: ing.quantity,
        available,
        hasEnough: available >= ing.quantity,
      };
    });
  },
};
