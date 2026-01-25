// Inventory category tabs
import { Component, For } from 'solid-js';
import type { ItemCategory } from '../../data/items';

type TabCategory = ItemCategory | 'all';

interface Tab {
  id: TabCategory;
  label: string;
  emoji: string;
}

const TABS: Tab[] = [
  { id: 'all', label: 'All', emoji: '📦' },
  { id: 'seed', label: 'Seeds', emoji: '🌱' },
  { id: 'crop', label: 'Crops', emoji: '🥕' },
  { id: 'food', label: 'Food', emoji: '🍳' },
  { id: 'crafted', label: 'Crafted', emoji: '🎁' },
];

interface InventoryTabsProps {
  activeTab: TabCategory;
  onTabChange: (tab: TabCategory) => void;
  counts?: Record<TabCategory, number>;
}

export const InventoryTabs: Component<InventoryTabsProps> = (props) => {
  return (
    <div class="inventory-tabs">
      <For each={TABS}>
        {(tab) => (
          <button
            class={`inv-tab ${props.activeTab === tab.id ? 'active' : ''}`}
            onClick={() => props.onTabChange(tab.id)}
          >
            <span class="tab-emoji">{tab.emoji}</span>
            <span class="tab-label">{tab.label}</span>
            {props.counts && props.counts[tab.id] > 0 && (
              <span class="tab-count">{props.counts[tab.id]}</span>
            )}
          </button>
        )}
      </For>
    </div>
  );
};

export type { TabCategory };
