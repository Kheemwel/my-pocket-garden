// Recipe card component - compact grid version
import { Component, For, Show, createMemo } from 'solid-js';
import { gameStore } from '../../core/GameStore';
import { cookingSystem } from '../../systems/CookingSystem';
import { getItem } from '../../data/items';
import type { Recipe } from '../../data/recipes';

interface RecipeCardProps {
  recipe: Recipe;
  onCook: (times: number) => void;
}

export const RecipeCard: Component<RecipeCardProps> = (props) => {
  const ingredientStatus = createMemo(() => {
    const _ = gameStore.state.inventory;
    return cookingSystem.getIngredientStatus(props.recipe.id);
  });
  
  const canCook = createMemo(() => {
    const _ = gameStore.state.inventory;
    return cookingSystem.canCook(props.recipe.id);
  });
  
  const maxCookCount = createMemo(() => {
    const _ = gameStore.state.inventory;
    return cookingSystem.getMaxCookCount(props.recipe.id);
  });
  
  const outputItem = createMemo(() => getItem(props.recipe.output.itemId));
  
  return (
    <div class={`recipe-card compact ${canCook() ? 'can-cook' : 'cannot-cook'}`}>
      <div class="recipe-header">
        <span class="recipe-emoji">{props.recipe.emoji}</span>
        <div class="recipe-info">
          <span class="recipe-name">{props.recipe.name}</span>
          <span class="recipe-output-preview">
            {outputItem()?.emoji} {outputItem()?.sellPrice} G$
          </span>
        </div>
        <Show when={maxCookCount() > 0}>
          <span class="recipe-max">x{maxCookCount()}</span>
        </Show>
      </div>
      
      <div class="recipe-ingredients compact">
        <For each={ingredientStatus()}>
          {(ing) => (
            <span class={`ing-compact ${ing.hasEnough ? 'has-enough' : 'missing'}`}>
              {ing.emoji}{ing.available}/{ing.required}
            </span>
          )}
        </For>
      </div>
      
      <div class="recipe-actions">
        <button
          class="cook-btn"
          onClick={() => props.onCook(1)}
          disabled={!canCook()}
        >
          1x
        </button>
        <Show when={maxCookCount() >= 5}>
          <button
            class="cook-btn"
            onClick={() => props.onCook(5)}
            disabled={maxCookCount() < 5}
          >
            5x
          </button>
        </Show>
        <button
          class="cook-btn max"
          onClick={() => props.onCook(maxCookCount())}
          disabled={!canCook()}
        >
          All
        </button>
      </div>
    </div>
  );
};
