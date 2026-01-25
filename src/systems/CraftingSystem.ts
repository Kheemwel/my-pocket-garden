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
  
  // Craft a recipe
  craft(recipeId: string): { success: boolean; error?: string } {
    const recipe = getRecipe(recipeId);
    if (!recipe) {
      return { success: false, error: 'Unknown recipe' };
    }
    
    if (recipe.type !== 'crafting') {
      return { success: false, error: 'Not a crafting recipe' };
    }
    
    // Check ingredients
    if (!inventorySystem.hasItems(recipe.ingredients)) {
      return { success: false, error: 'Missing materials' };
    }
    
    // Remove ingredients
    if (!inventorySystem.removeItems(recipe.ingredients)) {
      return { success: false, error: 'Failed to consume materials' };
    }
    
    // Add output
    gameStore.addItem(recipe.output.itemId, recipe.output.quantity);
    
    // Emit event
    eventBus.emit('item:crafted', { 
      recipeId, 
      output: recipe.output 
    });
    
    return { success: true };
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
