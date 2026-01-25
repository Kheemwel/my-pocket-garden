// Craft card component - compact grid version
import { Component, For, Show, createMemo } from 'solid-js';
import { gameStore } from '../../core/GameStore';
import { craftingSystem } from '../../systems/CraftingSystem';
import { getItem } from '../../data/items';
import type { Recipe } from '../../data/recipes';

interface CraftCardProps {
  recipe: Recipe;
  onCraft: (times: number) => void;
}

export const CraftCard: Component<CraftCardProps> = (props) => {
  const ingredientStatus = createMemo(() => {
    const _ = gameStore.state.inventory;
    return craftingSystem.getIngredientStatus(props.recipe.id);
  });
  
  const canCraft = createMemo(() => {
    const _ = gameStore.state.inventory;
    return craftingSystem.canCraft(props.recipe.id);
  });
  
  const maxCraftCount = createMemo(() => {
    const _ = gameStore.state.inventory;
    return craftingSystem.getMaxCraftCount(props.recipe.id);
  });
  
  const outputItem = createMemo(() => getItem(props.recipe.output.itemId));
  
  return (
    <div class={`craft-card compact ${canCraft() ? 'can-craft' : 'cannot-craft'}`}>
      <div class="craft-header">
        <span class="craft-emoji">{props.recipe.emoji}</span>
        <div class="craft-info">
          <span class="craft-name">{props.recipe.name}</span>
          <span class="craft-output-preview">
            {outputItem()?.emoji} {outputItem()?.sellPrice} G$
          </span>
        </div>
        <Show when={maxCraftCount() > 0}>
          <span class="craft-max">x{maxCraftCount()}</span>
        </Show>
      </div>
      
      <div class="craft-materials compact">
        <For each={ingredientStatus()}>
          {(ing) => (
            <span class={`mat-compact ${ing.hasEnough ? 'has-enough' : 'missing'}`}>
              {ing.emoji}{ing.available}/{ing.required}
            </span>
          )}
        </For>
      </div>
      
      <div class="craft-actions">
        <button
          class="craft-btn"
          onClick={() => props.onCraft(1)}
          disabled={!canCraft()}
        >
          1x
        </button>
        <Show when={maxCraftCount() >= 5}>
          <button
            class="craft-btn"
            onClick={() => props.onCraft(5)}
            disabled={maxCraftCount() < 5}
          >
            5x
          </button>
        </Show>
        <button
          class="craft-btn max"
          onClick={() => props.onCraft(maxCraftCount())}
          disabled={!canCraft()}
        >
          All
        </button>
      </div>
    </div>
  );
};
