// Typed EventBus for cross-system communication
import type { GameEvents, GameEventKey } from './types';

type EventCallback<K extends GameEventKey> = (data: GameEvents[K]) => void;

class GameEventBus {
  private listeners: Map<GameEventKey, Set<EventCallback<any>>> = new Map();

  on<K extends GameEventKey>(event: K, callback: EventCallback<K>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  off<K extends GameEventKey>(event: K, callback: EventCallback<K>): void {
    this.listeners.get(event)?.delete(callback);
  }

  emit<K extends GameEventKey>(event: K, data: GameEvents[K]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  once<K extends GameEventKey>(event: K, callback: EventCallback<K>): () => void {
    const wrapper: EventCallback<K> = (data) => {
      this.off(event, wrapper);
      callback(data);
    };
    return this.on(event, wrapper);
  }

  clear(): void {
    this.listeners.clear();
  }
}

// Singleton instance
export const eventBus = new GameEventBus();
export type { GameEventBus };
