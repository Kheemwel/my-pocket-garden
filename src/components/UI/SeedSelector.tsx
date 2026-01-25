// Seed selector floating panel
import { Component, For, Show, createSignal, createMemo } from 'solid-js';
import { gameStore } from '../../core/GameStore';
import { inventorySystem } from '../../systems/InventorySystem';
import { getSeed } from '../../data/seeds';

export const SeedSelector: Component = () => {
  const [isOpen, setIsOpen] = createSignal(false);
  
  const seeds = createMemo(() => {
    // Subscribe to inventory changes
    const _ = gameStore.state.inventory;
    return inventorySystem.getSeeds();
  });
  
  const selectedSeedId = () => gameStore.state.selectedSeedId;
  
  const handleSelectSeed = (seedId: string) => {
    if (selectedSeedId() === seedId) {
      // Deselect if clicking the same seed
      gameStore.selectSeed(null);
    } else {
      gameStore.selectSeed(seedId);
    }
  };
  
  const handleClearSelection = () => {
    gameStore.selectSeed(null);
  };
  
  const selectedSeedInfo = createMemo(() => {
    const seedId = selectedSeedId();
    if (!seedId) return null;
    return getSeed(seedId);
  });
  
  return (
    <>
      {/* Toggle button */}
      <button
        class={`seed-selector-toggle ${selectedSeedId() ? 'has-selection' : ''}`}
        onClick={() => setIsOpen(o => !o)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          'border-radius': '50%',
          'font-size': '24px',
          'background-color': selectedSeedId() ? 'var(--accent-green)' : 'var(--bg-card)',
          'box-shadow': 'var(--shadow-lg)',
          'z-index': '99',
        }}
      >
        {selectedSeedInfo()?.emoji || '🌱'}
      </button>
      
      {/* Selector panel */}
      <Show when={isOpen()}>
        <div class="seed-selector">
          <div class="seed-selector-header">
            <span class="seed-selector-title">Select Seed to Plant</span>
            <button class="close-selector" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>
          
          <Show
            when={seeds().length > 0}
            fallback={
              <div class="no-seeds">
                <p>No seeds in inventory</p>
                <p>Buy some from the shop!</p>
              </div>
            }
          >
            <div class="seeds-list">
              <For each={seeds()}>
                {(item) => {
                  const seedInfo = createMemo(() => getSeed(item.itemId));
                  const isSelected = () => selectedSeedId() === item.itemId;
                  
                  return (
                    <div
                      class={`seed-option ${isSelected() ? 'selected' : ''}`}
                      onClick={() => handleSelectSeed(item.itemId)}
                    >
                      <span class="seed-emoji">{seedInfo()?.growingEmoji || '🌱'}</span>
                      <span class="seed-name">{item.definition.name.replace(' Seeds', '')}</span>
                      <span class="seed-count">x{item.quantity}</span>
                    </div>
                  );
                }}
              </For>
            </div>
            
            <Show when={selectedSeedId()}>
              <button
                class="clear-selection-btn"
                onClick={handleClearSelection}
                style={{
                  'margin-top': 'var(--space-md)',
                  'width': '100%',
                  'background-color': 'var(--bg-secondary)',
                }}
              >
                Clear Selection
              </button>
            </Show>
          </Show>
        </div>
      </Show>
    </>
  );
};
