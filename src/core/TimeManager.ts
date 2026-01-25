// Time manager for game ticks and offline progress
import { createSignal, type Accessor } from 'solid-js';
import { eventBus } from './EventBus';
import { gameStore, SHOP_RESTOCK_INTERVAL } from './GameStore';

const TICK_INTERVAL = 1000; // 1 second

// Create signals outside the class
const [lastTick, setLastTick] = createSignal(Date.now());

class TimeManagerClass {
  private tickInterval: number | null = null;
  
  get lastTick(): Accessor<number> {
    return lastTick;
  }
  
  start() {
    if (this.tickInterval !== null) return;
    
    this.tickInterval = window.setInterval(() => this.tick(), TICK_INTERVAL);
    console.log('TimeManager started');
  }
  
  stop() {
    if (this.tickInterval !== null) {
      window.clearInterval(this.tickInterval);
      this.tickInterval = null;
      console.log('TimeManager stopped');
    }
  }
  
  private tick() {
    const now = Date.now();
    setLastTick(now);
    
    eventBus.emit('game:tick', { timestamp: now });
    this.checkShopRestock(now);
  }
  
  private checkShopRestock(now: number) {
    const lastRestock = gameStore.state.lastShopRestock;
    if (now - lastRestock >= SHOP_RESTOCK_INTERVAL) {
      import('../systems/ShopSystem').then(({ shopSystem }) => {
        shopSystem.restockShop();
      });
    }
  }
  
  getPlantTimeRemaining(plantedAt: number, growthTimeMs: number): number {
    const elapsed = Date.now() - plantedAt;
    return Math.max(0, growthTimeMs - elapsed);
  }
  
  isPlantReady(plantedAt: number, growthTimeMs: number): boolean {
    return this.getPlantTimeRemaining(plantedAt, growthTimeMs) === 0;
  }
  
  formatTimeRemaining(ms: number): string {
    if (ms <= 0) return 'Ready!';
    
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / 60000) % 60;
    const hours = Math.floor(ms / 3600000);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  
  getTimeUntilRestock(): number {
    const lastRestock = gameStore.state.lastShopRestock;
    const nextRestock = lastRestock + SHOP_RESTOCK_INTERVAL;
    return Math.max(0, nextRestock - Date.now());
  }
}

export const timeManager = new TimeManagerClass();
