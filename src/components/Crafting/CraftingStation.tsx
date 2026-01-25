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
  
  const handleCraft = (recipeId: string, times: number) => {
    const result = craftingSystem.craft(recipeId, times);
    if (result.success) {
      console.log('Crafted:', recipeId, 'x', result.crafted);
    } else {
      console.log('Craft failed:', result.error);
    }
  };
  
  return (
    <div class="crafting-station">
      <div class="station-header">
        <h3>Crafting</h3>
        <span class="available-recipes">{availableCount()} available</span>
      </div>
      
      <div class="recipes-grid compact">
        <For each={recipes()}>
          {(recipe) => (
            <CraftCard
              recipe={recipe}
              onCraft={(times) => handleCraft(recipe.id, times)}
            />
          )}
        </For>
      </div>
    </div>
  );
};
