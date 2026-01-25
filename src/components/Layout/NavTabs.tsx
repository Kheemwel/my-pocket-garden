// Navigation tabs component
import { Component, For } from 'solid-js';

export type TabId = 'garden' | 'shop' | 'inventory' | 'cooking' | 'crafting' | 'settings';

interface NavTab {
  id: TabId;
  label: string;
  icon: string;
}

const TABS: NavTab[] = [
  { id: 'garden', label: 'Garden', icon: '🌻' },
  { id: 'shop', label: 'Shop', icon: '🏪' },
  { id: 'inventory', label: 'Inventory', icon: '📦' },
  { id: 'cooking', label: 'Cooking', icon: '🍳' },
  { id: 'crafting', label: 'Crafting', icon: '🔨' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

interface NavTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export const NavTabs: Component<NavTabsProps> = (props) => {
  return (
    <nav class="nav-tabs">
      <For each={TABS}>
        {(tab) => (
          <button
            class={`nav-tab ${props.activeTab === tab.id ? 'active' : ''}`}
            onClick={() => props.onTabChange(tab.id)}
          >
            <span class="tab-icon">{tab.icon}</span>
            <span class="tab-label">{tab.label}</span>
          </button>
        )}
      </For>
    </nav>
  );
};
