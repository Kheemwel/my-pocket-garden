// Recipe definitions for cooking and crafting

export interface RecipeIngredient {
  itemId: string;
  quantity: number;
}

export interface Recipe {
  id: string;
  name: string;
  emoji: string;
  type: 'cooking' | 'crafting';
  ingredients: RecipeIngredient[];
  output: {
    itemId: string;
    quantity: number;
  };
  description: string;
}

// All recipes in the game
export const RECIPES: Recipe[] = [
  // Cooking recipes
  {
    id: 'recipe_bread',
    name: 'Bread',
    emoji: '🍞',
    type: 'cooking',
    ingredients: [
      { itemId: 'crop_wheat', quantity: 3 },
    ],
    output: { itemId: 'food_bread', quantity: 1 },
    description: 'Bake wheat into delicious bread.',
  },
  {
    id: 'recipe_salad',
    name: 'Garden Salad',
    emoji: '🥗',
    type: 'cooking',
    ingredients: [
      { itemId: 'crop_lettuce', quantity: 2 },
      { itemId: 'crop_tomato', quantity: 1 },
      { itemId: 'crop_carrot', quantity: 1 },
    ],
    output: { itemId: 'food_salad', quantity: 1 },
    description: 'Mix fresh vegetables into a healthy salad.',
  },
  {
    id: 'recipe_soup',
    name: 'Vegetable Soup',
    emoji: '🍲',
    type: 'cooking',
    ingredients: [
      { itemId: 'crop_potato', quantity: 2 },
      { itemId: 'crop_carrot', quantity: 2 },
      { itemId: 'crop_tomato', quantity: 1 },
    ],
    output: { itemId: 'food_soup', quantity: 1 },
    description: 'Cook a warm pot of vegetable soup.',
  },
  {
    id: 'recipe_pie',
    name: 'Pumpkin Pie',
    emoji: '🥧',
    type: 'cooking',
    ingredients: [
      { itemId: 'crop_pumpkin', quantity: 2 },
      { itemId: 'crop_wheat', quantity: 2 },
    ],
    output: { itemId: 'food_pie', quantity: 1 },
    description: 'Bake a delicious pumpkin pie.',
  },
  {
    id: 'recipe_jam',
    name: 'Strawberry Jam',
    emoji: '🫙',
    type: 'cooking',
    ingredients: [
      { itemId: 'crop_strawberry', quantity: 4 },
    ],
    output: { itemId: 'food_jam', quantity: 1 },
    description: 'Make sweet strawberry jam.',
  },
  {
    id: 'recipe_popcorn',
    name: 'Popcorn',
    emoji: '🍿',
    type: 'cooking',
    ingredients: [
      { itemId: 'crop_corn', quantity: 3 },
    ],
    output: { itemId: 'food_popcorn', quantity: 1 },
    description: 'Pop some corn for a tasty snack.',
  },
  {
    id: 'recipe_fries',
    name: 'French Fries',
    emoji: '🍟',
    type: 'cooking',
    ingredients: [
      { itemId: 'crop_potato', quantity: 3 },
    ],
    output: { itemId: 'food_fries', quantity: 1 },
    description: 'Fry potatoes into crispy fries.',
  },
  {
    id: 'recipe_sandwich',
    name: 'Veggie Sandwich',
    emoji: '🥪',
    type: 'cooking',
    ingredients: [
      { itemId: 'food_bread', quantity: 1 },
      { itemId: 'crop_lettuce', quantity: 1 },
      { itemId: 'crop_tomato', quantity: 1 },
    ],
    output: { itemId: 'food_sandwich', quantity: 1 },
    description: 'Make a hearty veggie sandwich.',
  },
  
  // Crafting recipes
  {
    id: 'recipe_bouquet',
    name: 'Flower Bouquet',
    emoji: '💐',
    type: 'crafting',
    ingredients: [
      { itemId: 'crop_rose', quantity: 3 },
      { itemId: 'crop_sunflower', quantity: 2 },
    ],
    output: { itemId: 'crafted_bouquet', quantity: 1 },
    description: 'Arrange flowers into a beautiful bouquet.',
  },
  {
    id: 'recipe_basket',
    name: 'Gift Basket',
    emoji: '🧺',
    type: 'crafting',
    ingredients: [
      { itemId: 'crop_strawberry', quantity: 3 },
      { itemId: 'food_jam', quantity: 1 },
      { itemId: 'food_bread', quantity: 1 },
    ],
    output: { itemId: 'crafted_basket', quantity: 1 },
    description: 'Create a lovely gift basket.',
  },
  {
    id: 'recipe_wreath',
    name: 'Harvest Wreath',
    emoji: '🎀',
    type: 'crafting',
    ingredients: [
      { itemId: 'crop_wheat', quantity: 5 },
      { itemId: 'crop_sunflower', quantity: 2 },
      { itemId: 'crop_pumpkin', quantity: 1 },
    ],
    output: { itemId: 'crafted_wreath', quantity: 1 },
    description: 'Craft a decorative harvest wreath.',
  },
  {
    id: 'recipe_potpourri',
    name: 'Rose Potpourri',
    emoji: '🌸',
    type: 'crafting',
    ingredients: [
      { itemId: 'crop_rose', quantity: 5 },
    ],
    output: { itemId: 'crafted_potpourri', quantity: 1 },
    description: 'Dry roses into fragrant potpourri.',
  },
  {
    id: 'recipe_scarecrow',
    name: 'Scarecrow',
    emoji: '🧸',
    type: 'crafting',
    ingredients: [
      { itemId: 'crop_wheat', quantity: 8 },
      { itemId: 'crop_pumpkin', quantity: 1 },
      { itemId: 'crop_corn', quantity: 4 },
    ],
    output: { itemId: 'crafted_scarecrow', quantity: 1 },
    description: 'Build a friendly scarecrow.',
  },
];

// Helper functions
export function getRecipe(recipeId: string): Recipe | undefined {
  return RECIPES.find(r => r.id === recipeId);
}

export function getCookingRecipes(): Recipe[] {
  return RECIPES.filter(r => r.type === 'cooking');
}

export function getCraftingRecipes(): Recipe[] {
  return RECIPES.filter(r => r.type === 'crafting');
}

export function getAllRecipes(): Recipe[] {
  return RECIPES;
}
