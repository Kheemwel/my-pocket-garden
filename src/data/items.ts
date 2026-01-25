// Item definitions for all game items

export type ItemCategory = 'seed' | 'crop' | 'food' | 'crafted';

export interface ItemDefinition {
  id: string;
  name: string;
  emoji: string;
  category: ItemCategory;
  sellPrice: number;
  description: string;
}

// All items in the game
export const ITEMS: Record<string, ItemDefinition> = {
  // Seeds
  seed_tomato: {
    id: 'seed_tomato',
    name: 'Tomato Seeds',
    emoji: '🌱',
    category: 'seed',
    sellPrice: 2,
    description: 'Plant these to grow juicy tomatoes.',
  },
  seed_carrot: {
    id: 'seed_carrot',
    name: 'Carrot Seeds',
    emoji: '🌱',
    category: 'seed',
    sellPrice: 3,
    description: 'Plant these to grow crunchy carrots.',
  },
  seed_wheat: {
    id: 'seed_wheat',
    name: 'Wheat Seeds',
    emoji: '🌱',
    category: 'seed',
    sellPrice: 1,
    description: 'Plant these to grow golden wheat.',
  },
  seed_strawberry: {
    id: 'seed_strawberry',
    name: 'Strawberry Seeds',
    emoji: '🌱',
    category: 'seed',
    sellPrice: 8,
    description: 'Plant these to grow sweet strawberries.',
  },
  seed_pumpkin: {
    id: 'seed_pumpkin',
    name: 'Pumpkin Seeds',
    emoji: '🌱',
    category: 'seed',
    sellPrice: 15,
    description: 'Plant these to grow big pumpkins.',
  },
  seed_corn: {
    id: 'seed_corn',
    name: 'Corn Seeds',
    emoji: '🌱',
    category: 'seed',
    sellPrice: 5,
    description: 'Plant these to grow tall corn stalks.',
  },
  seed_potato: {
    id: 'seed_potato',
    name: 'Potato Seeds',
    emoji: '🌱',
    category: 'seed',
    sellPrice: 4,
    description: 'Plant these to grow hearty potatoes.',
  },
  seed_lettuce: {
    id: 'seed_lettuce',
    name: 'Lettuce Seeds',
    emoji: '🌱',
    category: 'seed',
    sellPrice: 2,
    description: 'Plant these to grow fresh lettuce.',
  },
  seed_sunflower: {
    id: 'seed_sunflower',
    name: 'Sunflower Seeds',
    emoji: '🌱',
    category: 'seed',
    sellPrice: 10,
    description: 'Plant these to grow beautiful sunflowers.',
  },
  seed_rose: {
    id: 'seed_rose',
    name: 'Rose Seeds',
    emoji: '🌱',
    category: 'seed',
    sellPrice: 20,
    description: 'Plant these to grow lovely roses.',
  },
  
  // Crops
  crop_tomato: {
    id: 'crop_tomato',
    name: 'Tomato',
    emoji: '🍅',
    category: 'crop',
    sellPrice: 8,
    description: 'A ripe, juicy tomato.',
  },
  crop_carrot: {
    id: 'crop_carrot',
    name: 'Carrot',
    emoji: '🥕',
    category: 'crop',
    sellPrice: 10,
    description: 'A fresh, crunchy carrot.',
  },
  crop_wheat: {
    id: 'crop_wheat',
    name: 'Wheat',
    emoji: '🌾',
    category: 'crop',
    sellPrice: 4,
    description: 'Golden stalks of wheat.',
  },
  crop_strawberry: {
    id: 'crop_strawberry',
    name: 'Strawberry',
    emoji: '🍓',
    category: 'crop',
    sellPrice: 25,
    description: 'A sweet, red strawberry.',
  },
  crop_pumpkin: {
    id: 'crop_pumpkin',
    name: 'Pumpkin',
    emoji: '🎃',
    category: 'crop',
    sellPrice: 50,
    description: 'A big, orange pumpkin.',
  },
  crop_corn: {
    id: 'crop_corn',
    name: 'Corn',
    emoji: '🌽',
    category: 'crop',
    sellPrice: 15,
    description: 'A golden ear of corn.',
  },
  crop_potato: {
    id: 'crop_potato',
    name: 'Potato',
    emoji: '🥔',
    category: 'crop',
    sellPrice: 12,
    description: 'A hearty potato.',
  },
  crop_lettuce: {
    id: 'crop_lettuce',
    name: 'Lettuce',
    emoji: '🥬',
    category: 'crop',
    sellPrice: 6,
    description: 'Fresh, crispy lettuce.',
  },
  crop_sunflower: {
    id: 'crop_sunflower',
    name: 'Sunflower',
    emoji: '🌻',
    category: 'crop',
    sellPrice: 30,
    description: 'A bright, cheerful sunflower.',
  },
  crop_rose: {
    id: 'crop_rose',
    name: 'Rose',
    emoji: '🌹',
    category: 'crop',
    sellPrice: 60,
    description: 'A beautiful red rose.',
  },
  
  // Foods
  food_bread: {
    id: 'food_bread',
    name: 'Bread',
    emoji: '🍞',
    category: 'food',
    sellPrice: 20,
    description: 'Freshly baked bread.',
  },
  food_salad: {
    id: 'food_salad',
    name: 'Garden Salad',
    emoji: '🥗',
    category: 'food',
    sellPrice: 35,
    description: 'A fresh garden salad.',
  },
  food_soup: {
    id: 'food_soup',
    name: 'Vegetable Soup',
    emoji: '🍲',
    category: 'food',
    sellPrice: 45,
    description: 'Warm, hearty vegetable soup.',
  },
  food_pie: {
    id: 'food_pie',
    name: 'Pumpkin Pie',
    emoji: '🥧',
    category: 'food',
    sellPrice: 120,
    description: 'Delicious pumpkin pie.',
  },
  food_jam: {
    id: 'food_jam',
    name: 'Strawberry Jam',
    emoji: '🫙',
    category: 'food',
    sellPrice: 80,
    description: 'Sweet strawberry jam.',
  },
  food_popcorn: {
    id: 'food_popcorn',
    name: 'Popcorn',
    emoji: '🍿',
    category: 'food',
    sellPrice: 40,
    description: 'Buttery popcorn.',
  },
  food_fries: {
    id: 'food_fries',
    name: 'French Fries',
    emoji: '🍟',
    category: 'food',
    sellPrice: 35,
    description: 'Crispy french fries.',
  },
  food_sandwich: {
    id: 'food_sandwich',
    name: 'Veggie Sandwich',
    emoji: '🥪',
    category: 'food',
    sellPrice: 55,
    description: 'A tasty veggie sandwich.',
  },
  
  // Crafted items
  crafted_bouquet: {
    id: 'crafted_bouquet',
    name: 'Flower Bouquet',
    emoji: '💐',
    category: 'crafted',
    sellPrice: 150,
    description: 'A beautiful flower bouquet.',
  },
  crafted_basket: {
    id: 'crafted_basket',
    name: 'Gift Basket',
    emoji: '🧺',
    category: 'crafted',
    sellPrice: 200,
    description: 'A lovely gift basket filled with goodies.',
  },
  crafted_wreath: {
    id: 'crafted_wreath',
    name: 'Harvest Wreath',
    emoji: '🎀',
    category: 'crafted',
    sellPrice: 180,
    description: 'A decorative harvest wreath.',
  },
  crafted_potpourri: {
    id: 'crafted_potpourri',
    name: 'Rose Potpourri',
    emoji: '🌸',
    category: 'crafted',
    sellPrice: 100,
    description: 'Fragrant rose potpourri.',
  },
  crafted_scarecrow: {
    id: 'crafted_scarecrow',
    name: 'Scarecrow',
    emoji: '🧸',
    category: 'crafted',
    sellPrice: 250,
    description: 'A friendly garden scarecrow.',
  },
};

// Helper functions
export function getItem(itemId: string): ItemDefinition | undefined {
  return ITEMS[itemId];
}

export function getItemsByCategory(category: ItemCategory): ItemDefinition[] {
  return Object.values(ITEMS).filter(item => item.category === category);
}

export function getAllItems(): ItemDefinition[] {
  return Object.values(ITEMS);
}
