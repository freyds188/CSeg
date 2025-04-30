import React, { useRef, useState, useEffect } from 'react';
import {
  Stove,
  Pan,
  Button,
  ProgressBar,
  ProgressFill,
  IngredientsArea,
  Ingredient,
  IngredientImage,
  IngredientName,
  RecipeSelection,
  RecipeCard,
  RecipeImage,
  RecipeName
} from './styled/GameStyles';
import { useGame } from '../contexts/GameContext';
import styled from 'styled-components';
import { Ingredient as IngredientType } from '../types/gameTypes';
import { playSound, SOUNDS } from '../utils/soundUtils';

const DraggableIngredient = styled.div<{ 
  available: boolean, 
  isDragging: boolean,
  position?: { x: number, y: number }
}>`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background-color: ${(props) => (props.available ? '#e94560' : '#888')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.available ? 'grab' : 'not-allowed')};
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  box-shadow: ${(props) => props.isDragging ? '0 8px 16px rgba(0, 0, 0, 0.3)' : '0 2px 5px rgba(0, 0, 0, 0.2)'};
  transform: ${(props) => props.isDragging ? 'scale(1.1)' : 'scale(1)'};
  opacity: ${(props) => props.isDragging ? '0.8' : '1'};
  z-index: ${(props) => props.isDragging ? '100' : '1'};
  position: ${(props) => props.position ? 'absolute' : 'relative'};
  top: ${(props) => props.position ? `${props.position.y}%` : 'auto'};
  left: ${(props) => props.position ? `${props.position.x}%` : 'auto'};
  transform-origin: center;
  
  &:hover {
    transform: ${(props) => (props.available && !props.isDragging) ? 'scale(1.05)' : props.isDragging ? 'scale(1.1)' : 'none'};
    box-shadow: ${(props) => (props.available && !props.isDragging) ? '0 5px 10px rgba(0, 0, 0, 0.2)' : props.isDragging ? '0 8px 16px rgba(0, 0, 0, 0.3)' : 'none'};
  }
`;

const PanArea = styled(Pan)`
  cursor: pointer;
  width: 220px;
  height: 220px;
  transform: translate(-50%, -50%);
  overflow: visible;
  border-radius: 50%;
  position: relative;
  transition: transform 0.3s ease-in-out;
  background-color: #444;
  border: 8px solid #777;
  background-image: none;
  
  &:hover {
    transform: translate(-50%, -50%) scale(1.02);
  }
  
  &::after {
    content: 'PAN';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #999;
    font-weight: bold;
    font-size: 1.5rem;
  }
`;

const EnhancedStove = styled(Stove)`
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  height: 400px;
  margin-bottom: 2rem;
  position: relative;
  background-color: #333;
  background-image: none;
  border-radius: 12px;
  border: 2px solid #555;
  
  &::after {
    content: 'STOVE';
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    color: #999;
    font-weight: bold;
    font-size: 1.5rem;
  }
`;

const IngredientInPan = styled(DraggableIngredient)`
  width: 50px;
  height: 50px;
  position: absolute;
  cursor: pointer;
  transform: translate(-50%, -50%);
  z-index: 10;
  
  &:hover {
    transform: scale(1.2);
    z-index: 20;
  }
`;

const InstructionsCard = styled.div`
  background-color: #16213e;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const InstructionStep = styled.li<{ completed: boolean }>`
  margin: 0.5rem 0;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: ${props => props.completed ? 'rgba(76, 175, 80, 0.1)' : 'transparent'};
  color: ${props => props.completed ? '#4caf50' : 'white'};
  display: flex;
  align-items: center;
  
  &::before {
    content: ${props => props.completed ? '"✓"' : '"•"'};
    margin-right: 0.5rem;
    font-weight: bold;
  }
`;

const RecipeTitle = styled.h2`
  color: #ff8303;
  margin-bottom: 1rem;
  font-size: 1.8rem;
`;

const AnimatedProgressFill = styled(ProgressFill)`
  background: linear-gradient(90deg, #ff8303 0%, #e94560 100%);
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% {
      opacity: 0.8;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.8;
    }
  }
`;

const EnhancedRecipeSelection = styled(RecipeSelection)`
  gap: 1.5rem;
`;

const EnhancedRecipeCard = styled(RecipeCard)`
  transition: all 0.3s ease-in-out;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  
  &:hover {
    box-shadow: ${(props) => (props.unlocked ? '0 10px 20px rgba(255, 131, 3, 0.3)' : 'none')};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, #ff8303, #e94560);
    transform: ${(props) => (props.unlocked ? 'scaleX(1)' : 'scaleX(0)')};
    transform-origin: left;
    transition: transform 0.3s ease-in-out;
  }
`;

const TimeIndicator = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-align: center;
  margin: 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

// Add this mapping for ingredient colors
const ingredientColors = {
  rice: '#EFEFEF',
  egg: '#FFF6C2',
  bacon: '#FF9B87',
  ham: '#FF7A7A',
  garlic: '#F5F5DC',
  oil: '#FFFACD',
  pepper: '#444444',
  tomato: '#FF6347'
};

// Extended ingredient type with color
interface ExtendedIngredient extends IngredientType {
  color: string;
}

const IngredientDisplay: React.FC<{
  ingredient: IngredientType;
  onClick?: () => void;
  style?: React.CSSProperties;
}> = ({ ingredient, onClick, style }) => {
  const extendedIngredient = ingredient as unknown as ExtendedIngredient;
  
  return (
    <div
      className="ingredient-display"
      onClick={onClick}
      style={{
        width: "50px",
        height: "50px",
        borderRadius: "10px",
        backgroundColor: extendedIngredient.color || '#CCCCCC',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "5px",
        cursor: onClick ? "pointer" : "default",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        overflow: "hidden",
        ...style,
      }}
    >
      {ingredient.image ? (
        <img 
          src={ingredient.image} 
          alt={ingredient.name}
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover" 
          }}
        />
      ) : (
        <div style={{ fontWeight: "bold", color: "#FFF", textShadow: "1px 1px 1px rgba(0, 0, 0, 0.5)" }}>
          {ingredient.name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

const CookingAreaComponent: React.FC = () => {
  const { 
    gameState, 
    cookingState, 
    selectRecipe, 
    addIngredient, 
    startCooking, 
    resetCooking,
    // New drag and drop functions
    startDragging,
    stopDragging,
    moveIngredient,
    dropIngredientInPan,
    removeIngredientFromPan
  } = useGame();
  
  const { recipes, inventory, unlockedRecipes } = gameState;
  const { 
    currentRecipe, 
    addedIngredients, 
    ingredientsInPan,
    cookingProgress, 
    cookingStarted, 
    cookingComplete, 
    remainingTime,
    isDragging,
    draggedIngredient
  } = cookingState;

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const panRef = useRef<HTMLDivElement>(null);
  const stoveRef = useRef<HTMLDivElement>(null);

  // Ingredients for the UI - updated with image references
  const ingredients: ExtendedIngredient[] = [
    { id: 'rice', name: 'Rice', image: '/images/ingredients/rice.png', color: ingredientColors.rice },
    { id: 'egg', name: 'Egg', image: '/images/ingredients/egg.png', color: ingredientColors.egg },
    { id: 'bacon', name: 'Bacon', image: '/images/ingredients/bacon.png', color: ingredientColors.bacon },
    { id: 'ham', name: 'Ham', image: '/images/ingredients/ham.png', color: ingredientColors.ham },
    { id: 'garlic', name: 'Garlic', image: '/images/ingredients/garlic.png', color: ingredientColors.garlic },
    { id: 'oil', name: 'Oil', image: '/images/ingredients/oil.png', color: ingredientColors.oil },
    { id: 'pepper', name: 'Pepper', image: '/images/ingredients/pepper.png', color: ingredientColors.pepper },
    { id: 'tomato', name: 'Tomato', image: '', color: ingredientColors.tomato },
  ];

  // Handle mouse movement for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && draggedIngredient) {
        setMousePosition({ x: e.clientX, y: e.clientY });
        moveIngredient(e.clientX, e.clientY);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging && draggedIngredient && panRef.current) {
        const panRect = panRef.current.getBoundingClientRect();
        const isOverPan = 
          e.clientX >= panRect.left &&
          e.clientX <= panRect.right &&
          e.clientY >= panRect.top &&
          e.clientY <= panRect.bottom;

        if (isOverPan) {
          // Calculate relative position within the pan (as percentage)
          const relX = ((e.clientX - panRect.left) / panRect.width) * 100;
          const relY = ((e.clientY - panRect.top) / panRect.height) * 100;
          dropIngredientInPan(relX, relY);
        } else {
          stopDragging();
        }
      } else {
        stopDragging();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, draggedIngredient, moveIngredient, dropIngredientInPan, stopDragging]);

  // Handle ingredient drag start
  const handleDragStart = (ingredient: ExtendedIngredient, e: React.MouseEvent) => {
    if (inventory[ingredient.id] > 0 && !cookingStarted && !cookingComplete) {
      startDragging(ingredient);
      setMousePosition({ x: e.clientX, y: e.clientY });
    }
  };

  // Handle click on ingredient in pan
  const handleIngredientInPanClick = (ingredientId: string) => {
    if (!cookingStarted && !cookingComplete) {
      removeIngredientFromPan(ingredientId);
    }
  };

  // Recipe selection view
  if (!currentRecipe) {
    return (
      <div>
        <RecipeTitle>Select a Recipe</RecipeTitle>
        <EnhancedRecipeSelection>
          {recipes.map(recipe => {
            const isUnlocked = unlockedRecipes.includes(recipe.id);
            return (
              <EnhancedRecipeCard 
                key={recipe.id} 
                unlocked={isUnlocked}
                onClick={() => {
                  if (isUnlocked) {
                    playSound(SOUNDS.CLICK);
                    selectRecipe(recipe.id);
                  }
                }}
              >
                <RecipeImage src={recipe.image} alt={recipe.name} />
                <RecipeName>{recipe.name}</RecipeName>
                {!isUnlocked && (
                  <div style={{ color: '#ccc', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    Locked
                  </div>
                )}
              </EnhancedRecipeCard>
            );
          })}
        </EnhancedRecipeSelection>
      </div>
    );
  }

  // Cooking view
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <RecipeTitle>Cooking: {currentRecipe.name}</RecipeTitle>
        <Button onClick={() => {
          playSound(SOUNDS.CLICK);
          resetCooking();
        }}>Select Different Recipe</Button>
      </div>

      {/* Recipe instructions */}
      <InstructionsCard>
        <h3 style={{ marginBottom: '1rem' }}>Recipe Instructions</h3>
        <ol>
          {currentRecipe.steps.map((step, index) => (
            <InstructionStep 
              key={index} 
              completed={cookingComplete || (cookingStarted && index === 0)}
            >
              {step}
            </InstructionStep>
          ))}
        </ol>
      </InstructionsCard>

      {/* Timer and progress */}
      {cookingStarted && (
        <div>
          <TimeIndicator>
            {cookingComplete ? 'Ready to Serve!' : `Time Remaining: ${remainingTime}s`}
          </TimeIndicator>
          <ProgressBar>
            <AnimatedProgressFill progress={cookingProgress} />
          </ProgressBar>
        </div>
      )}

      {/* Cooking UI */}
      <EnhancedStove ref={stoveRef}>
        <PanArea ref={panRef}>
          {ingredientsInPan.map((ingredient, index) => (
            <IngredientInPan
              key={`${ingredient.id}-${index}`}
              available={true}
              isDragging={false}
              position={ingredient.position}
              onClick={() => handleIngredientInPanClick(ingredient.id)}
            >
              {ingredient.image ? (
                <img 
                  src={ingredient.image} 
                  alt={ingredient.name} 
                  style={{ 
                    width: '40px', 
                    height: '40px',
                    objectFit: 'cover',
                    borderRadius: '8px' 
                  }}
                />
              ) : (
                <div style={{ fontWeight: "bold", color: "#FFF", textShadow: "1px 1px 1px rgba(0, 0, 0, 0.5)" }}>
                  {ingredient.name.charAt(0).toUpperCase()}
                </div>
              )}
            </IngredientInPan>
          ))}
        </PanArea>
      </EnhancedStove>

      {/* Status message */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '1.5rem', 
        color: cookingComplete ? '#4caf50' : 'white',
        fontWeight: 'bold',
        fontSize: '1.2rem'
      }}>
        {cookingComplete ? (
          <div>Dish is ready to serve! 🎉</div>
        ) : cookingStarted ? (
          <div>Cooking in progress... 🔥</div>
        ) : (
          <div>Drag ingredients to the pan 👨‍🍳</div>
        )}
      </div>

      {/* Ingredients selection */}
      {!cookingStarted && !cookingComplete && (
        <>
          <IngredientsArea>
            {ingredients.map(ingredient => {
              const inventoryCount = inventory[ingredient.id] || 0;
              const isNeeded = currentRecipe.ingredients.includes(ingredient.id);
              const isAdded = addedIngredients.includes(ingredient.id);
              const addedCount = addedIngredients.filter(id => id === ingredient.id).length;
              const available = inventoryCount > 0 && isNeeded && (addedCount < currentRecipe.ingredients.filter(id => id === ingredient.id).length);
              
              return (
                <DraggableIngredient 
                  key={ingredient.id}
                  available={available}
                  isDragging={isDragging && draggedIngredient?.id === ingredient.id}
                  onMouseDown={(e) => available && handleDragStart(ingredient, e)}
                >
                  <IngredientDisplay ingredient={ingredient} />
                </DraggableIngredient>
              );
            })}
          </IngredientsArea>

          {/* Start cooking button */}
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <Button 
              primary
              onClick={() => {
                playSound(SOUNDS.CLICK);
                startCooking();
              }}
              disabled={!currentRecipe.ingredients.every(
                ingredientId => addedIngredients.includes(ingredientId)
              )}
              style={{ 
                padding: '1rem 2rem', 
                fontSize: '1.2rem',
                boxShadow: '0 4px 8px rgba(255, 131, 3, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              Start Cooking
            </Button>
          </div>
        </>
      )}

      {/* Visual cue for dragged ingredient */}
      {isDragging && draggedIngredient && (
        <DraggableIngredient
          available={true}
          isDragging={true}
          style={{
            position: 'fixed',
            left: mousePosition.x - 40,
            top: mousePosition.y - 40,
            pointerEvents: 'none',
            backgroundColor: draggedIngredient.image ? 'transparent' : (draggedIngredient as unknown as ExtendedIngredient)?.color || '#CCC',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: '2px solid #fff',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden'
          }}
        >
          {draggedIngredient.image ? (
            <img 
              src={draggedIngredient.image} 
              alt={draggedIngredient.name} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover' 
              }}
            />
          ) : (
            <div style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
              {draggedIngredient.name}
            </div>
          )}
        </DraggableIngredient>
      )}
    </div>
  );
};

export default CookingAreaComponent; 