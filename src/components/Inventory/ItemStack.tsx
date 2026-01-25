// Single item stack display - compact grid version
import { Component, Show, createSignal } from 'solid-js';
import type { InventoryItem } from '../../systems/InventorySystem';
import { inventorySystem } from '../../systems/InventorySystem';

interface ItemStackProps {
  item: InventoryItem;
  showSellButton?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

export const ItemStack: Component<ItemStackProps> = (props) => {
  const [showActions, setShowActions] = createSignal(false);
  
  const handleSell = (e: MouseEvent, quantity: number) => {
    e.stopPropagation();
    inventorySystem.sellItem(props.item.itemId, quantity);
  };
  
  const toggleActions = (e: MouseEvent) => {
    e.stopPropagation();
    setShowActions(s => !s);
  };
  
  return (
    <div 
      class={`item-card ${props.selected ? 'selected' : ''} ${props.onClick ? 'clickable' : ''}`}
      onClick={props.onClick}
    >
      <div class="item-card-header">
        <span class="item-emoji">{props.item.definition.emoji}</span>
        <span class="item-quantity">{props.item.quantity}</span>
      </div>
      <span class="item-name">{props.item.definition.name.replace(' Seeds', '')}</span>
      <span class="item-value">{props.item.definition.sellPrice} G$</span>
      
      <Show when={props.showSellButton}>
        <Show 
          when={showActions()}
          fallback={
            <button class="sell-toggle" onClick={toggleActions}>Sell</button>
          }
        >
          <div class="sell-actions">
            <button class="sell-btn" onClick={(e) => handleSell(e, 1)}>1</button>
            <Show when={props.item.quantity >= 10}>
              <button class="sell-btn" onClick={(e) => handleSell(e, 10)}>10</button>
            </Show>
            <button class="sell-btn all" onClick={(e) => handleSell(e, props.item.quantity)}>All</button>
          </div>
        </Show>
      </Show>
    </div>
  );
};
