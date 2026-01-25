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
  
  const handleCook = (recipeId: string) => {
    const result = cookingSystem.cook(recipeId);
    if (result.success) {
      console.log('Cooked:', recipeId);
    } else {
      console.log('Cook failed:', result.error);
    }
  };
  
  return (
    <div class="cooking-station">
      <div class="station-header">
        <h3>Cooking</h3>
        <span class="available-recipes">
          {availableCount()} recipe{availableCount() !== 1 ? 's' : ''} available
        </span>
      </div>
      
      <div class="recipes-grid">
        <For each={recipes()}>
          {(recipe) => (
            <RecipeCard
              recipe={recipe}
              onCook={() => handleCook(recipe.id)}
            />
          )}
        </For>
      </div>
    </div>
  );
};
