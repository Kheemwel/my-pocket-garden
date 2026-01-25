// Main inventory component
import { Component, For, Show, createSignal, createMemo } from 'solid-js';
import { gameStore } from '../../core/GameStore';
import { inventorySystem, type SortOption, type SortDirection } from '../../systems/InventorySystem';
import { ItemStack } from './ItemStack';
import { InventoryTabs, type TabCategory } from './InventoryTabs';

export const Inventory: Component = () => {
  const [activeTab, setActiveTab] = createSignal<TabCategory>('all');
  const [sortBy, setSortBy] = createSignal<SortOption>('name');
  const [sortDir, setSortDir] = createSignal<SortDirection>('asc');
  
  // Reactive inventory items
  const items = createMemo(() => {
    // Access inventory to create dependency
    const _ = gameStore.state.inventory;
    const filtered = inventorySystem.getItemsByCategory(activeTab());
    return inventorySystem.sortItems(filtered, sortBy(), sortDir());
  });
  
  // Category counts for tabs
  const categoryCounts = createMemo(() => {
    const _ = gameStore.state.inventory;
    return {
      all: inventorySystem.getAllItems().length,
      seed: inventorySystem.getItemsByCategory('seed').length,
      crop: inventorySystem.getItemsByCategory('crop').length,
      food: inventorySystem.getItemsByCategory('food').length,
      crafted: inventorySystem.getItemsByCategory('crafted').length,
    };
  });
  
  const totalValue = createMemo(() => {
    const _ = gameStore.state.inventory;
    return inventorySystem.getTotalValue();
  });
  
  const toggleSort = (option: SortOption) => {
    if (sortBy() === option) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDir('asc');
    }
  };
  
  return (
    <div class="inventory">
      <div class="inventory-header">
        <h3>Inventory</h3>
        <span class="total-value">Total value: {totalValue()} G$</span>
      </div>
      
      <InventoryTabs
        activeTab={activeTab()}
        onTabChange={setActiveTab}
        counts={categoryCounts()}
      />
      
      <div class="inventory-sort">
        <span class="sort-label">Sort by:</span>
        <button
          class={`sort-btn ${sortBy() === 'name' ? 'active' : ''}`}
          onClick={() => toggleSort('name')}
        >
          Name {sortBy() === 'name' && (sortDir() === 'asc' ? '↑' : '↓')}
        </button>
        <button
          class={`sort-btn ${sortBy() === 'quantity' ? 'active' : ''}`}
          onClick={() => toggleSort('quantity')}
        >
          Qty {sortBy() === 'quantity' && (sortDir() === 'asc' ? '↑' : '↓')}
        </button>
        <button
          class={`sort-btn ${sortBy() === 'value' ? 'active' : ''}`}
          onClick={() => toggleSort('value')}
        >
          Value {sortBy() === 'value' && (sortDir() === 'asc' ? '↑' : '↓')}
        </button>
      </div>
      
      <div class="inventory-items">
        <Show
          when={items().length > 0}
          fallback={
            <div class="inventory-empty">
              <p>No items in this category</p>
            </div>
          }
        >
          <For each={items()}>
            {(item) => (
              <ItemStack item={item} showSellButton={true} />
            )}
          </For>
        </Show>
      </div>
    </div>
  );
};
