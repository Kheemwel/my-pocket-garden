// Crafting station component
import { Component, For, createMemo } from 'solid-js';
import { gameStore } from '../../core/GameStore';
import { craftingSystem } from '../../systems/CraftingSystem';
import { CraftCard } from './CraftCard';

export const CraftingStation: Component = () => {
  const recipes = createMemo(() => craftingSystem.getRecipes());
  
  const availableCount = createMemo(() => {
    const _ = gameStore.state.inventory;
    return craftingSystem.getAvailableRecipes().length;
  });
  
  const handleCraft = (recipeId: string) => {
    const result = craftingSystem.craft(recipeId);
    if (result.success) {
      console.log('Crafted:', recipeId);
    } else {
      console.log('Craft failed:', result.error);
    }
  };
  
  return (
    <div class="crafting-station">
      <div class="station-header">
        <h3>Crafting</h3>
        <span class="available-recipes">
          {availableCount()} recipe{availableCount() !== 1 ? 's' : ''} available
        </span>
      </div>
      
      <div class="recipes-grid">
        <For each={recipes()}>
          {(recipe) => (
            <CraftCard
              recipe={recipe}
              onCraft={() => handleCraft(recipe.id)}
            />
          )}
        </For>
      </div>
    </div>
  );
};
