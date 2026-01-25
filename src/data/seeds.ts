// Seed definitions with growth times and yields

export interface SeedDefinition {
  id: string;
  name: string;
  emoji: string;
  growingEmoji: string;  // Emoji shown while growing
  growthTimeMs: number;
  buyPrice: number;
  yieldItemId: string;
  yieldMin: number;
  yieldMax: number;
  shopChance: number;    // 0-1, probability of appearing in shop
  shopStockMin: number;
  shopStockMax: number;
}

// All seeds in the game
export const SEEDS: SeedDefinition[] = [
  {
    id: 'seed_tomato',
    name: 'Tomato Seeds',
    emoji: '🌱',
    growingEmoji: '🍅',
    growthTimeMs: 30 * 1000,  // 30 seconds
    buyPrice: 5,
    yieldItemId: 'crop_tomato',
    yieldMin: 1,
    yieldMax: 3,
    shopChance: 0.9,
    shopStockMin: 5,
    shopStockMax: 15,
  },
  {
    id: 'seed_carrot',
    name: 'Carrot Seeds',
    emoji: '🌱',
    growingEmoji: '🥕',
    growthTimeMs: 45 * 1000,  // 45 seconds
    buyPrice: 8,
    yieldItemId: 'crop_carrot',
    yieldMin: 1,
    yieldMax: 2,
    shopChance: 0.85,
    shopStockMin: 3,
    shopStockMax: 10,
  },
  {
    id: 'seed_wheat',
    name: 'Wheat Seeds',
    emoji: '🌱',
    growingEmoji: '🌾',
    growthTimeMs: 20 * 1000,  // 20 seconds
    buyPrice: 3,
    yieldItemId: 'crop_wheat',
    yieldMin: 2,
    yieldMax: 4,
    shopChance: 0.95,
    shopStockMin: 10,
    shopStockMax: 25,
  },
  {
    id: 'seed_strawberry',
    name: 'Strawberry Seeds',
    emoji: '🌱',
    growingEmoji: '🍓',
    growthTimeMs: 60 * 1000,  // 1 minute
    buyPrice: 20,
    yieldItemId: 'crop_strawberry',
    yieldMin: 2,
    yieldMax: 5,
    shopChance: 0.6,
    shopStockMin: 2,
    shopStockMax: 8,
  },
  {
    id: 'seed_pumpkin',
    name: 'Pumpkin Seeds',
    emoji: '🌱',
    growingEmoji: '🎃',
    growthTimeMs: 180 * 1000,  // 3 minutes
    buyPrice: 35,
    yieldItemId: 'crop_pumpkin',
    yieldMin: 1,
    yieldMax: 2,
    shopChance: 0.4,
    shopStockMin: 1,
    shopStockMax: 5,
  },
  {
    id: 'seed_corn',
    name: 'Corn Seeds',
    emoji: '🌱',
    growingEmoji: '🌽',
    growthTimeMs: 90 * 1000,  // 1.5 minutes
    buyPrice: 12,
    yieldItemId: 'crop_corn',
    yieldMin: 2,
    yieldMax: 3,
    shopChance: 0.75,
    shopStockMin: 4,
    shopStockMax: 12,
  },
  {
    id: 'seed_potato',
    name: 'Potato Seeds',
    emoji: '🌱',
    growingEmoji: '🥔',
    growthTimeMs: 75 * 1000,  // 1.25 minutes
    buyPrice: 10,
    yieldItemId: 'crop_potato',
    yieldMin: 2,
    yieldMax: 4,
    shopChance: 0.8,
    shopStockMin: 5,
    shopStockMax: 15,
  },
  {
    id: 'seed_lettuce',
    name: 'Lettuce Seeds',
    emoji: '🌱',
    growingEmoji: '🥬',
    growthTimeMs: 25 * 1000,  // 25 seconds
    buyPrice: 4,
    yieldItemId: 'crop_lettuce',
    yieldMin: 1,
    yieldMax: 2,
    shopChance: 0.9,
    shopStockMin: 8,
    shopStockMax: 20,
  },
  {
    id: 'seed_sunflower',
    name: 'Sunflower Seeds',
    emoji: '🌱',
    growingEmoji: '🌻',
    growthTimeMs: 120 * 1000,  // 2 minutes
    buyPrice: 25,
    yieldItemId: 'crop_sunflower',
    yieldMin: 1,
    yieldMax: 3,
    shopChance: 0.5,
    shopStockMin: 2,
    shopStockMax: 6,
  },
  {
    id: 'seed_rose',
    name: 'Rose Seeds',
    emoji: '🌱',
    growingEmoji: '🌹',
    growthTimeMs: 300 * 1000,  // 5 minutes
    buyPrice: 50,
    yieldItemId: 'crop_rose',
    yieldMin: 1,
    yieldMax: 2,
    shopChance: 0.3,
    shopStockMin: 1,
    shopStockMax: 3,
  },
];

// Helper functions
export function getSeed(seedId: string): SeedDefinition | undefined {
  return SEEDS.find(s => s.id === seedId);
}

export function getSeedByIndex(index: number): SeedDefinition | undefined {
  return SEEDS[index];
}

export function getAllSeeds(): SeedDefinition[] {
  return SEEDS;
}

// Get random yield amount for a seed
export function getRandomYield(seed: SeedDefinition): number {
  return Math.floor(Math.random() * (seed.yieldMax - seed.yieldMin + 1)) + seed.yieldMin;
}
