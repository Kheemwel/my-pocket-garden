// Inventory category tabs - compact version
import { Component, For } from 'solid-js';
import type { ItemCategory } from '../../data/items';

type TabCategory = ItemCategory | 'all';

interface Tab {
  id: TabCategory;
  emoji: string;
}

const TABS: Tab[] = [
  { id: 'all', emoji: '📦' },
  { id: 'seed', emoji: '🌱' },
  { id: 'crop', emoji: '🥕' },
  { id: 'food', emoji: '🍳' },
  { id: 'crafted', emoji: '🎁' },
];

interface InventoryTabsProps {
  activeTab: TabCategory;
  onTabChange: (tab: TabCategory) => void;
  counts?: Record<TabCategory, number>;
}

export const InventoryTabs: Component<InventoryTabsProps> = (props) => {
  return (
    <div class="inventory-tabs compact">
      <For each={TABS}>
        {(tab) => (
          <button
            class={`inv-tab ${props.activeTab === tab.id ? 'active' : ''}`}
            onClick={() => props.onTabChange(tab.id)}
            title={tab.id}
          >
            <span class="tab-emoji">{tab.emoji}</span>
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
