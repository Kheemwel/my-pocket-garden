// Cooking station component
import { Component, For, createMemo } from 'solid-js';
import { gameStore } from '../../core/GameStore';
import { cookingSystem } from '../../systems/CookingSystem';
import { RecipeCard } from './RecipeCard';

export const CookingStation: Component = () => {
  const recipes = createMemo(() => cookingSystem.getRecipes());
  
  const availableCount = createMemo(() => {
    const _ = gameStore.state.inventory;
    return cookingSystem.getAvailableRecipes().length;
  });
  
  const handleCook = (recipeId: string, times: number) => {
    const result = cookingSystem.cook(recipeId, times);
    if (result.success) {
      console.log('Cooked:', recipeId, 'x', result.cooked);
    } else {
      console.log('Cook failed:', result.error);
    }
  };
  
  return (
    <div class="cooking-station">
      <div class="station-header">
        <h3>Cooking</h3>
        <span class="available-recipes">{availableCount()} available</span>
      </div>
      
      <div class="recipes-grid compact">
        <For each={recipes()}>
          {(recipe) => (
            <RecipeCard
              recipe={recipe}
              onCook={(times) => handleCook(recipe.id, times)}
            />
          )}
        </For>
      </div>
    </div>
  );
};
