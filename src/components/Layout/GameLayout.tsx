// Main game layout component
import { Component, Show, createSignal, onMount, onCleanup } from 'solid-js';
import { MoneyDisplay } from '../UI/MoneyDisplay';
import { SeedSelector } from '../UI/SeedSelector';
import { NavTabs, type TabId } from './NavTabs';
import { Garden } from '../Garden/Garden';
import { Shop } from '../Shop/Shop';
import { Inventory } from '../Inventory/Inventory';
import { CookingStation } from '../Cooking/CookingStation';
import { CraftingStation } from '../Crafting/CraftingStation';
import { SettingsPanel } from '../Settings/SettingsPanel';
import { timeManager } from '../../core/TimeManager';
import { saveManager } from '../../persistence/SaveManager';
import { shopSystem } from '../../systems/ShopSystem';

export const GameLayout: Component = () => {
  const [activeTab, setActiveTab] = createSignal<TabId>('garden');
  const [isLoaded, setIsLoaded] = createSignal(false);
  
  onMount(() => {
    // Initialize save manager and load game
    const loadResult = saveManager.init();
    
    // If no save or shop is empty, restock
    if (!loadResult.success || shopSystem.needsInitialStock()) {
      shopSystem.restockShop();
    }
    
    // Start the time manager
    timeManager.start();
    
    setIsLoaded(true);
  });
  
  onCleanup(() => {
    // Stop time manager and save on cleanup
    timeManager.stop();
    saveManager.save();
  });
  
  return (
    <div class="game-layout">
      <header class="game-header">
        <h1 class="game-title">
          <span>🌷</span>
          My Pocket Garden
        </h1>
        <MoneyDisplay />
      </header>
      
      <NavTabs activeTab={activeTab()} onTabChange={setActiveTab} />
      
      <main class="game-content">
        <Show when={isLoaded()} fallback={<div>Loading...</div>}>
          <Show when={activeTab() === 'garden'}>
            <Garden />
          </Show>
          
          <Show when={activeTab() === 'shop'}>
            <Shop />
          </Show>
          
          <Show when={activeTab() === 'inventory'}>
            <Inventory />
          </Show>
          
          <Show when={activeTab() === 'cooking'}>
            <CookingStation />
          </Show>
          
          <Show when={activeTab() === 'crafting'}>
            <CraftingStation />
          </Show>
          
          <Show when={activeTab() === 'settings'}>
            <SettingsPanel />
          </Show>
        </Show>
      </main>
      
      {/* Seed selector shown on garden tab */}
      <Show when={activeTab() === 'garden'}>
        <SeedSelector />
      </Show>
    </div>
  );
};
