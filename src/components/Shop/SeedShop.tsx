// Seed shop component
import { Component, For, Show, createMemo } from 'solid-js';
import { gameStore } from '../../core/GameStore';
import { shopSystem } from '../../systems/ShopSystem';
import { getSeed } from '../../data/seeds';
import { RestockTimer } from './RestockTimer';

export const SeedShop: Component = () => {
  const stock = () => gameStore.state.shopStock;
  const money = () => gameStore.state.money;
  
  const handleBuy = (seedId: string, quantity: number = 1) => {
    const result = shopSystem.buySeed(seedId, quantity);
    if (!result.success) {
      console.log('Purchase failed:', result.error);
    }
  };
  
  return (
    <div class="seed-shop">
      <div class="shop-header">
        <h3>Seed Shop</h3>
        <RestockTimer />
      </div>
      
      <Show
        when={stock().length > 0}
        fallback={
          <div class="shop-empty">
            <p>The shop is empty right now.</p>
            <p>Check back when it restocks!</p>
          </div>
        }
      >
        <div class="shop-items">
          <For each={stock()}>
            {(item) => {
              const seed = createMemo(() => getSeed(item.seedId));
              const canAfford = createMemo(() => money() >= item.price);
              
              return (
                <div class={`shop-item ${canAfford() ? '' : 'cannot-afford'}`}>
                  <div class="item-info">
                    <span class="item-emoji">{seed()?.emoji || '🌱'}</span>
                    <div class="item-details">
                      <span class="item-name">{seed()?.name}</span>
                      <span class="item-stock">Stock: {item.quantity}</span>
                    </div>
                  </div>
                  
                  <div class="item-actions">
                    <span class="item-price">{item.price} G$</span>
                    <div class="buy-buttons">
                      <button
                        class="buy-btn"
                        onClick={() => handleBuy(item.seedId, 1)}
                        disabled={!canAfford() || item.quantity < 1}
                      >
                        Buy 1
                      </button>
                      <Show when={item.quantity >= 5}>
                        <button
                          class="buy-btn buy-5"
                          onClick={() => handleBuy(item.seedId, 5)}
                          disabled={money() < item.price * 5 || item.quantity < 5}
                        >
                          Buy 5
                        </button>
                      </Show>
                    </div>
                  </div>
                </div>
              );
            }}
          </For>
        </div>
      </Show>
    </div>
  );
};
