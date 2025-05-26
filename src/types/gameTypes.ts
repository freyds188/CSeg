export interface Ingredient {
  id: string;
  name: string;
  image: string;
  position?: { x: number; y: number };
}

export interface Recipe {
  id: string;
  name: string;
  image: string;
  description?: string;
  unlocked: boolean;
  ingredients: string[];
  steps: string[];
  cookingTime: number;
  price: number;
}

export interface Customer {
  id: string;
  order: Recipe;
  patience: number;
  satisfaction: number;
  timeRemaining: number;
  served: boolean;
}

export interface GameState {
  money: number;
  score: number;
  day: number;
  level: number;
  customers: Customer[];
  inventory: Record<string, number>;
  recipes: Recipe[];
  unlockedRecipes: string[];
  equipment: Equipment[];
}

export interface Equipment {
  id: string;
  name: string;
  image: string;
  level: number;
  speedBoost: number;
  unlocked: boolean;
  price: number;
}

export interface CookingState {
  currentRecipe: Recipe | null;
  addedIngredients: string[];
  ingredientsInPan: Ingredient[];
  cookingProgress: number;
  cookingComplete: boolean;
  cookingStarted: boolean;
  remainingTime: number;
  isDragging: boolean;
  draggedIngredient: Ingredient | null;
}

export interface User {
  username: string;
  highScore: number;
}

export interface LeaderboardEntry {
  username: string;
  score: number;
  date: string;
} 