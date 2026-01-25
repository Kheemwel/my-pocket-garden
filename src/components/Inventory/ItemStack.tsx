// Single item stack display
import { Component, Show } from 'solid-js';
import type { InventoryItem } from '../../systems/InventorySystem';
import { inventorySystem } from '../../systems/InventorySystem';

interface ItemStackProps {
  item: InventoryItem;
  showSellButton?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

export const ItemStack: Component<ItemStackProps> = (props) => {
  const handleSell = (e: MouseEvent, quantity: number) => {
    e.stopPropagation();
    inventorySystem.sellItem(props.item.itemId, quantity);
  };
  
  return (
    <div 
      class={`item-stack ${props.selected ? 'selected' : ''} ${props.onClick ? 'clickable' : ''}`}
      onClick={props.onClick}
    >
      <div class="item-icon">
        <span class="item-emoji">{props.item.definition.emoji}</span>
        <span class="item-quantity">{props.item.quantity}</span>
      </div>
      
      <div class="item-info">
        <span class="item-name">{props.item.definition.name}</span>
        <span class="item-value">{props.item.definition.sellPrice} G$ each</span>
      </div>
      
      <Show when={props.showSellButton}>
        <div class="item-actions">
          <button
            class="sell-btn"
            onClick={(e) => handleSell(e, 1)}
          >
            Sell 1
          </button>
          <Show when={props.item.quantity >= 10}>
            <button
              class="sell-btn sell-10"
              onClick={(e) => handleSell(e, 10)}
            >
              Sell 10
            </button>
          </Show>
          <Show when={props.item.quantity > 1}>
            <button
              class="sell-btn sell-all"
              onClick={(e) => handleSell(e, props.item.quantity)}
            >
              Sell All
            </button>
          </Show>
        </div>
      </Show>
    </div>
  );
};
