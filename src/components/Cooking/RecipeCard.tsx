// Recipe card component
import { Component, For, createMemo } from 'solid-js';
import { gameStore } from '../../core/GameStore';
import { cookingSystem } from '../../systems/CookingSystem';
import { getItem } from '../../data/items';
import type { Recipe } from '../../data/recipes';

interface RecipeCardProps {
  recipe: Recipe;
  onCook: () => void;
}

export const RecipeCard: Component<RecipeCardProps> = (props) => {
  const ingredientStatus = createMemo(() => {
    // Subscribe to inventory changes
    const _ = gameStore.state.inventory;
    return cookingSystem.getIngredientStatus(props.recipe.id);
  });
  
  const canCook = createMemo(() => {
    const _ = gameStore.state.inventory;
    return cookingSystem.canCook(props.recipe.id);
  });
  
  const outputItem = createMemo(() => getItem(props.recipe.output.itemId));
  
  return (
    <div class={`recipe-card ${canCook() ? 'can-cook' : 'cannot-cook'}`}>
      <div class="recipe-header">
        <span class="recipe-emoji">{props.recipe.emoji}</span>
        <div class="recipe-info">
          <span class="recipe-name">{props.recipe.name}</span>
          <span class="recipe-description">{props.recipe.description}</span>
        </div>
      </div>
      
      <div class="recipe-ingredients">
        <span class="ingredients-label">Ingredients:</span>
        <div class="ingredients-list">
          <For each={ingredientStatus()}>
            {(ing) => (
              <div class={`ingredient ${ing.hasEnough ? 'has-enough' : 'missing'}`}>
                <span class="ing-emoji">{ing.emoji}</span>
                <span class="ing-name">{ing.name}</span>
                <span class="ing-count">
                  {ing.available}/{ing.required}
                </span>
              </div>
            )}
          </For>
        </div>
      </div>
      
      <div class="recipe-output">
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
        class="cook-btn"
        onClick={props.onCook}
        disabled={!canCook()}
      >
        {canCook() ? 'Cook' : 'Missing Ingredients'}
      </button>
    </div>
  );
};
