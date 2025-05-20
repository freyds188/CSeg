import { Recipe, Equipment } from '../types/gameTypes';

// Initial recipe data
export const initialRecipes: Recipe[] = [
  {
    id: 'yangChow',
    name: 'Yang Chow',
    image: '/images/recipes/yangchow.png',
    unlocked: true,
    ingredients: ['rice', 'egg', 'garlic', 'ham'],
    steps: [
      'Heat oil in the pan',
      'Add garlic and stir until golden brown',
      'Add rice and mix well',
      'Add the ham and mix',
      'Add the beaten egg and mix well',
      'Serve hot'
    ],
    cookingTime: 10,
    price: 50,
  },
  {
    id: 'baconSilog',
    name: 'Bacon Silog',
    image: '/images/recipes/baconsilog.png',
    unlocked: true,
    ingredients: ['rice', 'egg', 'bacon'],
    steps: [
      'Cook rice in the pan',
      'Fry bacon until crispy',
      'Fry egg sunny side up',
      'Serve together on a plate'
    ],
    cookingTime: 10,
    price: 45,
  },
  {
    id: 'hamSilog',
    name: 'Ham Silog',
    image: '/images/recipes/hamsilog.png',
    unlocked: false,
    ingredients: ['rice', 'egg', 'ham', 'garlic'],
    steps: [
      'Cook rice in the pan',
      'Fry ham until slightly crispy',
      'Add minced garlic for flavor',
      'Fry egg sunny side up',
      'Serve together on a plate'
    ],
    cookingTime: 10,
    price: 40,
  },
  {
    id: 'burgerSilog',
    name: 'Burger Silog',
    image: '/images/recipes/burgersilog.png',
    unlocked: false,
    ingredients: ['rice', 'egg', 'bacon', 'pepper'],
    steps: [
      'Cook rice in the pan',
      'Shape bacon into a patty',
      'Season with pepper',
      'Fry the patty until well-done',
      'Fry egg sunny side up',
      'Serve together on a plate'
    ],
    cookingTime: 10,
    price: 55,
  },
];

// Initial equipment data
export const initialEquipment: Equipment[] = [
  {
    id: 'basicStove',
    name: 'Basic Stove',
    image: '/images/equipment/basic_stove.png',
    level: 1,
    speedBoost: 0,
    unlocked: true,
    price: 0,
  },
  {
    id: 'betterStove',
    name: 'Better Stove',
    image: '/images/equipment/better_stove.png',
    level: 2,
    speedBoost: 10,
    unlocked: false,
    price: 300,
  },
  {
    id: 'advancedStove',
    name: 'Advanced Stove',
    image: '/images/equipment/advanced_stove.png',
    level: 3,
    speedBoost: 25,
    unlocked: false,
    price: 800,
  },
  {
    id: 'proStove',
    name: 'Professional Stove',
    image: '/images/equipment/pro_stove.png',
    level: 4,
    speedBoost: 50,
    unlocked: false,
    price: 2000,
  },
]; 