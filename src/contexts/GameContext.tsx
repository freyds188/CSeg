import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GameState, Recipe, Customer, Equipment, CookingState, Ingredient } from '../types/gameTypes';
import { initialRecipes, initialEquipment } from '../utils/gameData';
import { playSound, SOUNDS } from '../utils/soundUtils';

// Initial game state
const initialGameState: GameState = {
  money: 100,
  score: 0,
  day: 1,
  level: 1,
  customers: [],
  inventory: {
    rice: 20,
    egg: 20,
    bacon: 20,
    ham: 20,
    garlic: 20,
    oil: 20,
    pepper: 20,
    tomato: 20,
  },
  recipes: initialRecipes,
  unlockedRecipes: ['yangChow', 'baconSilog'],
  equipment: initialEquipment,
};

// Initial cooking state
const initialCookingState: CookingState = {
  currentRecipe: null,
  addedIngredients: [],
  ingredientsInPan: [],
  cookingProgress: 0,
  cookingComplete: false,
  cookingStarted: false,
  remainingTime: 0,
  isDragging: false,
  draggedIngredient: null,
};

interface GameContextProps {
  gameState: GameState;
  cookingState: CookingState;
  startGame: () => void;
  selectRecipe: (recipeId: string) => void;
  addIngredient: (ingredientId: string) => void;
  startCooking: () => void;
  serveDish: (customerId: string) => void;
  buyIngredient: (ingredientId: string, quantity: number) => void;
  buyEquipment: (equipmentId: string) => void;
  resetCooking: () => void;
  endDay: () => void;
  startDragging: (ingredient: Ingredient) => void;
  stopDragging: () => void;
  moveIngredient: (x: number, y: number) => void;
  dropIngredientInPan: (x: number, y: number) => void;
  removeIngredientFromPan: (ingredientId: string) => void;
}

// Create the context
const GameContext = createContext<GameContextProps | undefined>(undefined);

// Create a provider component
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [cookingState, setCookingState] = useState<CookingState>(initialCookingState);

  // Load saved game state
  useEffect(() => {
    const savedGameState = localStorage.getItem('gameState');
    if (savedGameState) {
      setGameState(JSON.parse(savedGameState));
    }
  }, []);

  // Save game state when it changes
  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }, [gameState]);

  // Generate a random customer order
  const generateCustomer = (): Customer => {
    const availableRecipes = gameState.recipes.filter(recipe => 
      gameState.unlockedRecipes.includes(recipe.id)
    );
    const randomRecipe = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
    
    return {
      id: Math.random().toString(36).substring(2, 9),
      order: randomRecipe,
      patience: 100,
      satisfaction: 100,
      timeRemaining: 30, // seconds (reduced from 60)
      served: false,
    };
  };

  // Customer generation and patience timer
  useEffect(() => {
    if (gameState.customers.length < gameState.level + 4) {
      const customerId = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          customers: [...prev.customers, generateCustomer()]
        }));
        
        // Play customer arrival sound
        playSound(SOUNDS.CUSTOMER_ARRIVE, 0.7);
      }, 1000 / gameState.level); // Spawn customers much faster (reduced from 10000)

      return () => clearInterval(customerId);
    }
  }, [gameState.customers, gameState.level]);

  // Occasionally spawn multiple customers at once (rush hour)
  useEffect(() => {
    const rushHourId = setInterval(() => {
      // 20% chance of a rush hour with multiple customers
      if (Math.random() < 0.2 && gameState.day > 1) {
        const customersToAdd = Math.min(3, gameState.level + 4 - gameState.customers.length);
        
        if (customersToAdd > 0) {
          setGameState(prev => {
            const newCustomers = Array(customersToAdd).fill(null).map(() => generateCustomer());
            return {
              ...prev,
              customers: [...prev.customers, ...newCustomers]
            };
          });
          
          // Play rush hour sound
          playSound(SOUNDS.RUSH_HOUR, 0.8);
        }
      }
    }, 30000); // Check for rush hour every 30 seconds
    
    return () => clearInterval(rushHourId);
  }, [gameState.customers.length, gameState.day, gameState.level]);

  // Update customer patience
  useEffect(() => {
    const patienceId = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        customers: prev.customers.map(customer => {
          if (!customer.served) {
            const timeRemaining = customer.timeRemaining - 1;
            const patience = Math.max(0, timeRemaining > 0 ? customer.patience - 2 : 0);
            
            return {
              ...customer,
              timeRemaining,
              patience,
            };
          }
          return customer;
        }),
      }));
    }, 1000);

    return () => clearInterval(patienceId);
  }, []);

  // Update cooking progress
  useEffect(() => {
    if (cookingState.cookingStarted && !cookingState.cookingComplete && cookingState.currentRecipe) {
      const cookingId = setInterval(() => {
        setCookingState(prev => {
          const progress = prev.cookingProgress + (1 / prev.currentRecipe!.cookingTime) * 100;
          const remainingTime = Math.max(0, prev.remainingTime - 1);
          const complete = progress >= 100;
          
          if (complete) {
            clearInterval(cookingId);
            playSound(SOUNDS.COOKING_COMPLETE, 0.8);
          }
          
          return {
            ...prev,
            cookingProgress: Math.min(progress, 100),
            cookingComplete: complete,
            remainingTime,
          };
        });
      }, 1000);

      return () => clearInterval(cookingId);
    }
  }, [cookingState.cookingStarted, cookingState.cookingComplete, cookingState.currentRecipe]);

  // Game functions
  const startGame = () => {
    setGameState(initialGameState);
    setCookingState(initialCookingState);
  };

  const selectRecipe = (recipeId: string) => {
    const recipe = gameState.recipes.find(r => r.id === recipeId);
    if (recipe) {
      setCookingState({
        ...initialCookingState,
        currentRecipe: recipe,
        remainingTime: recipe.cookingTime,
      });
    }
  };

  const addIngredient = (ingredientId: string) => {
    if (gameState.inventory[ingredientId] > 0 && cookingState.currentRecipe) {
      // Update inventory
      setGameState(prev => ({
        ...prev,
        inventory: {
          ...prev.inventory,
          [ingredientId]: prev.inventory[ingredientId] - 1,
        },
      }));

      // Find the ingredient details
      const ingredientDetails = {
        id: ingredientId,
        name: ingredientId.charAt(0).toUpperCase() + ingredientId.slice(1),
        image: `/images/ingredients/${ingredientId}.png`,
        position: { x: Math.random() * 100, y: Math.random() * 100 } // Random position in pan
      };

      // Update cooking state
      setCookingState(prev => ({
        ...prev,
        addedIngredients: [...prev.addedIngredients, ingredientId],
        ingredientsInPan: [...prev.ingredientsInPan, ingredientDetails],
      }));
    }
  };

  const startCooking = () => {
    if (cookingState.currentRecipe) {
      // Check if all ingredients are added
      const allIngredientsAdded = cookingState.currentRecipe.ingredients.every(
        ingredientId => cookingState.addedIngredients.includes(ingredientId)
      );

      if (allIngredientsAdded) {
        setCookingState(prev => ({
          ...prev,
          cookingStarted: true,
        }));
        
        // Play cooking start sound
        playSound(SOUNDS.COOKING_START, 0.7);
      }
    }
  };

  const serveDish = (customerId: string) => {
    if (cookingState.cookingComplete && cookingState.currentRecipe) {
      // Find the customer
      const customer = gameState.customers.find(c => c.id === customerId);
      
      if (customer && !customer.served) {
        // Calculate satisfaction based on recipe correctness and timing
        const satisfactionBonus = Math.max(0, customer.patience);
        const correctRecipe = customer.order.id === cookingState.currentRecipe.id;
        const finalSatisfaction = correctRecipe ? satisfactionBonus : 0;
        
        // Update customer status
        setGameState(prev => {
          const updatedCustomers = prev.customers.map(c => 
            c.id === customerId 
              ? { ...c, served: true, satisfaction: finalSatisfaction } 
              : c
          );
          
          // Calculate money and score
          const moneyEarned = correctRecipe ? cookingState.currentRecipe!.price : 0;
          const scoreEarned = finalSatisfaction;
          
          return {
            ...prev,
            customers: updatedCustomers,
            money: prev.money + moneyEarned,
            score: prev.score + scoreEarned,
          };
        });
        
        // Reset cooking state
        resetCooking();
        
        // Play customer served sound
        playSound(SOUNDS.CUSTOMER_SERVED, 0.7);
      }
    }
  };

  const buyIngredient = (ingredientId: string, quantity: number) => {
    const ingredientPrice = 5; // Base price per ingredient
    const totalCost = ingredientPrice * quantity;
    
    if (gameState.money >= totalCost) {
      setGameState(prev => ({
        ...prev,
        money: prev.money - totalCost,
        inventory: {
          ...prev.inventory,
          [ingredientId]: (prev.inventory[ingredientId] || 0) + quantity,
        },
      }));
    }
  };

  const buyEquipment = (equipmentId: string) => {
    const equipment = gameState.equipment.find(e => e.id === equipmentId);
    
    if (equipment && !equipment.unlocked && gameState.money >= equipment.price) {
      setGameState(prev => {
        const updatedEquipment = prev.equipment.map(e => 
          e.id === equipmentId ? { ...e, unlocked: true } : e
        );
        
        return {
          ...prev,
          money: prev.money - equipment.price,
          equipment: updatedEquipment,
        };
      });
    }
  };

  const resetCooking = () => {
    setCookingState(initialCookingState);
  };

  const endDay = () => {
    // Calculate end of day stats
    const servedCustomers = gameState.customers.filter(c => c.served);
    const totalSatisfaction = servedCustomers.reduce((sum, c) => sum + c.satisfaction, 0);
    const averageSatisfaction = servedCustomers.length > 0 
      ? totalSatisfaction / servedCustomers.length 
      : 0;
    
    // Unlock new recipes based on performance
    let newUnlockedRecipes = [...gameState.unlockedRecipes];
    
    if (averageSatisfaction > 80 && gameState.day % 3 === 0) {
      const lockedRecipes = gameState.recipes.filter(r => !r.unlocked);
      if (lockedRecipes.length > 0) {
        const recipeToUnlock = lockedRecipes[0].id;
        newUnlockedRecipes.push(recipeToUnlock);
      }
    }
    
    // Update game state for next day
    setGameState(prev => ({
      ...prev,
      day: prev.day + 1,
      level: Math.floor(prev.day / 5) + 1,
      customers: [],
      unlockedRecipes: newUnlockedRecipes,
    }));
    
    // Reset cooking state
    resetCooking();
  };

  // New drag and drop functions
  const startDragging = (ingredient: Ingredient) => {
    setCookingState(prev => ({
      ...prev,
      isDragging: true,
      draggedIngredient: ingredient
    }));
  };

  const stopDragging = () => {
    setCookingState(prev => ({
      ...prev,
      isDragging: false,
      draggedIngredient: null
    }));
  };

  const moveIngredient = (x: number, y: number) => {
    if (cookingState.draggedIngredient) {
      setCookingState(prev => ({
        ...prev,
        draggedIngredient: {
          ...prev.draggedIngredient!,
          position: { x, y }
        }
      }));
    }
  };

  const dropIngredientInPan = (x: number, y: number) => {
    if (cookingState.draggedIngredient && gameState.inventory[cookingState.draggedIngredient.id] > 0) {
      // Update inventory
      setGameState(prev => ({
        ...prev,
        inventory: {
          ...prev.inventory,
          [cookingState.draggedIngredient!.id]: prev.inventory[cookingState.draggedIngredient!.id] - 1,
        },
      }));

      // Add to pan with position
      setCookingState(prev => {
        const droppedIngredient = {
          ...prev.draggedIngredient!,
          position: { x, y }
        };
        
        // Play ingredient drop sound
        playSound(SOUNDS.INGREDIENT_DROP, 0.6);
        
        return {
          ...prev,
          ingredientsInPan: [...prev.ingredientsInPan, droppedIngredient],
          addedIngredients: [...prev.addedIngredients, droppedIngredient.id],
          isDragging: false,
          draggedIngredient: null
        };
      });
    }
  };

  const removeIngredientFromPan = (ingredientId: string) => {
    setCookingState(prev => {
      const updatedIngredientsInPan = prev.ingredientsInPan.filter(ing => ing.id !== ingredientId);
      const updatedAddedIngredients = prev.addedIngredients.filter(id => id !== ingredientId);
      
      return {
        ...prev,
        ingredientsInPan: updatedIngredientsInPan,
        addedIngredients: updatedAddedIngredients
      };
    });
    
    // Return ingredient to inventory
    setGameState(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        [ingredientId]: (prev.inventory[ingredientId] || 0) + 1,
      },
    }));
  };

  const value = {
    gameState,
    cookingState,
    startGame,
    selectRecipe,
    addIngredient,
    startCooking,
    serveDish,
    buyIngredient,
    buyEquipment,
    resetCooking,
    endDay,
    startDragging,
    stopDragging,
    moveIngredient,
    dropIngredientInPan,
    removeIngredientFromPan
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// Create a custom hook to use the context
export const useGame = (): GameContextProps => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 