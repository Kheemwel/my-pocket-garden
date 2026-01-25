// Cooking system for making food from crops
import { gameStore } from '../core/GameStore';
import { eventBus } from '../core/EventBus';
import { getCookingRecipes, getRecipe, type Recipe } from '../data/recipes';
import { inventorySystem } from './InventorySystem';
import { getItem } from '../data/items';

export const cookingSystem = {
  // Get all cooking recipes
  getRecipes(): Recipe[] {
    return getCookingRecipes();
  },
  
  // Check if player can cook a recipe
  canCook(recipeId: string): boolean {
    const recipe = getRecipe(recipeId);
    if (!recipe || recipe.type !== 'cooking') {
      return false;
    }
    
    return inventorySystem.hasItems(recipe.ingredients);
  },
  
  // Get max times recipe can be cooked with current inventory
  getMaxCookCount(recipeId: string): number {
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
  
  // Cook a recipe
  cook(recipeId: string, times: number = 1): { success: boolean; error?: string; cooked?: number } {
    const recipe = getRecipe(recipeId);
    if (!recipe) {
      return { success: false, error: 'Unknown recipe' };
    }
    
    if (recipe.type !== 'cooking') {
      return { success: false, error: 'Not a cooking recipe' };
    }
    
    const maxCount = this.getMaxCookCount(recipeId);
    const cookCount = Math.min(times, maxCount);
    
    if (cookCount <= 0) {
      return { success: false, error: 'Missing ingredients' };
    }
    
    // Remove ingredients (multiplied by cook count)
    const ingredientsToRemove = recipe.ingredients.map(ing => ({
      itemId: ing.itemId,
      quantity: ing.quantity * cookCount
    }));
    
    if (!inventorySystem.removeItems(ingredientsToRemove)) {
      return { success: false, error: 'Failed to consume ingredients' };
    }
    
    // Add output (multiplied by cook count)
    gameStore.addItem(recipe.output.itemId, recipe.output.quantity * cookCount);
    
    // Emit event
    eventBus.emit('recipe:cooked', { 
      recipeId, 
      output: { ...recipe.output, quantity: recipe.output.quantity * cookCount }
    });
    
    return { success: true, cooked: cookCount };
  },
  
  // Get available recipes (that can be cooked)
  getAvailableRecipes(): Recipe[] {
    return this.getRecipes().filter(recipe => this.canCook(recipe.id));
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
