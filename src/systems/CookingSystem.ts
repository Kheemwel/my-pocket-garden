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
  
  // Cook a recipe
  cook(recipeId: string): { success: boolean; error?: string } {
    const recipe = getRecipe(recipeId);
    if (!recipe) {
      return { success: false, error: 'Unknown recipe' };
    }
    
    if (recipe.type !== 'cooking') {
      return { success: false, error: 'Not a cooking recipe' };
    }
    
    // Check ingredients
    if (!inventorySystem.hasItems(recipe.ingredients)) {
      return { success: false, error: 'Missing ingredients' };
    }
    
    // Remove ingredients
    if (!inventorySystem.removeItems(recipe.ingredients)) {
      return { success: false, error: 'Failed to consume ingredients' };
    }
    
    // Add output
    gameStore.addItem(recipe.output.itemId, recipe.output.quantity);
    
    // Emit event
    eventBus.emit('recipe:cooked', { 
      recipeId, 
      output: recipe.output 
    });
    
    return { success: true };
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
