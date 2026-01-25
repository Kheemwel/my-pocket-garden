// Craft card component
import { Component, For, createMemo } from 'solid-js';
import { gameStore } from '../../core/GameStore';
import { craftingSystem } from '../../systems/CraftingSystem';
import { getItem } from '../../data/items';
import type { Recipe } from '../../data/recipes';

interface CraftCardProps {
  recipe: Recipe;
  onCraft: () => void;
}

export const CraftCard: Component<CraftCardProps> = (props) => {
  const ingredientStatus = createMemo(() => {
    // Subscribe to inventory changes
    const _ = gameStore.state.inventory;
    return craftingSystem.getIngredientStatus(props.recipe.id);
  });
  
  const canCraft = createMemo(() => {
    const _ = gameStore.state.inventory;
    return craftingSystem.canCraft(props.recipe.id);
  });
  
  const outputItem = createMemo(() => getItem(props.recipe.output.itemId));
  
  return (
    <div class={`craft-card ${canCraft() ? 'can-craft' : 'cannot-craft'}`}>
      <div class="craft-header">
        <span class="craft-emoji">{props.recipe.emoji}</span>
        <div class="craft-info">
          <span class="craft-name">{props.recipe.name}</span>
          <span class="craft-description">{props.recipe.description}</span>
        </div>
      </div>
      
      <div class="craft-materials">
        <span class="materials-label">Materials:</span>
        <div class="materials-list">
          <For each={ingredientStatus()}>
            {(ing) => (
              <div class={`material ${ing.hasEnough ? 'has-enough' : 'missing'}`}>
                <span class="mat-emoji">{ing.emoji}</span>
                <span class="mat-name">{ing.name}</span>
                <span class="mat-count">
                  {ing.available}/{ing.required}
                </span>
              </div>
            )}
          </For>
        </div>
      </div>
      
      <div class="craft-output">
        <span class="output-label">Creates:</span>
        <div class="output-item">
          <span class="output-emoji">{outputItem()?.emoji}</span>
          <span class="output-name">
            {props.recipe.output.quantity}x {outputItem()?.name}
          </span>
          <span class="output-value">
            ({outputItem()?.sellPrice} G$ each)
          </span>
        </div>
      </div>
      
      <button
        class="craft-btn"
        onClick={props.onCraft}
        disabled={!canCraft()}
      >
        {canCraft() ? 'Craft' : 'Missing Materials'}
      </button>
    </div>
  );
};
