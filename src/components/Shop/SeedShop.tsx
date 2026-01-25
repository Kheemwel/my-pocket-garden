// Seed shop component
import { Component, For, Show, createMemo, createSignal } from 'solid-js';
import { gameStore } from '../../core/GameStore';
import { shopSystem } from '../../systems/ShopSystem';
import { getSeed } from '../../data/seeds';
import { RestockTimer } from './RestockTimer';

export const SeedShop: Component = () => {
  const [bulkAmount, setBulkAmount] = createSignal(1);
  
  const stock = createMemo(() => shopSystem.getAllSeedsWithStock());
  const money = () => gameStore.state.money;
  
  const handleBuy = (seedId: string, quantity: number = 1) => {
    const result = shopSystem.buySeed(seedId, quantity);
    if (!result.success) {
      console.log('Purchase failed:', result.error);
    }
  };
  
  const handleBuyMax = (seedId: string, price: number, available: number) => {
    const maxAffordable = Math.floor(money() / price);
    const maxBuyable = Math.min(maxAffordable, available);
    if (maxBuyable > 0) {
      handleBuy(seedId, maxBuyable);
    }
  };
  
  return (
    <div class="seed-shop">
      <div class="shop-header">
        <h3>Seeds</h3>
        <RestockTimer />
      </div>
      
      <div class="bulk-controls">
        <span class="bulk-label">Bulk:</span>
        <button class={`bulk-btn ${bulkAmount() === 1 ? 'active' : ''}`} onClick={() => setBulkAmount(1)}>1</button>
        <button class={`bulk-btn ${bulkAmount() === 5 ? 'active' : ''}`} onClick={() => setBulkAmount(5)}>5</button>
        <button class={`bulk-btn ${bulkAmount() === 10 ? 'active' : ''}`} onClick={() => setBulkAmount(10)}>10</button>
        <button class={`bulk-btn ${bulkAmount() === 25 ? 'active' : ''}`} onClick={() => setBulkAmount(25)}>25</button>
      </div>
      
      <div class="shop-grid">
        <For each={stock()}>
          {(item) => {
            const seed = createMemo(() => getSeed(item.seedId));
            const canAffordOne = createMemo(() => money() >= item.price);
            const canAffordBulk = createMemo(() => money() >= item.price * bulkAmount());
            const hasStock = () => item.quantity > 0;
            const hasBulkStock = () => item.quantity >= bulkAmount();
            
            return (
              <div class={`shop-card ${!hasStock() ? 'out-of-stock' : canAffordOne() ? '' : 'cannot-afford'}`}>
                <div class="shop-card-header">
                  <span class="shop-emoji">{seed()?.growingEmoji || '🌱'}</span>
                  <span class="shop-stock">{item.quantity}</span>
                </div>
                <span class="shop-name">{seed()?.name.replace(' Seeds', '')}</span>
                <span class="shop-price">{item.price} G$</span>
                <div class="shop-actions">
                  <button
                    class="shop-buy-btn"
                    onClick={() => handleBuy(item.seedId, bulkAmount())}
                    disabled={!canAffordBulk() || !hasBulkStock()}
                  >
                    {bulkAmount()}x
                  </button>
                  <button
                    class="shop-buy-btn max"
                    onClick={() => handleBuyMax(item.seedId, item.price, item.quantity)}
                    disabled={!canAffordOne() || !hasStock()}
                  >
                    Max
                  </button>
                </div>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
};
