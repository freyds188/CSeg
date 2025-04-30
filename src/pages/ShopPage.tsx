import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GameContainer,
  Header,
  MainContent,
  Button,
  RecipeCard,
  RecipeImage,
  RecipeName
} from '../components/styled/GameStyles';
import { useGame } from '../contexts/GameContext';

const ShopPage: React.FC = () => {
  const navigate = useNavigate();
  const { gameState, buyIngredient, buyEquipment } = useGame();
  const { money, inventory, equipment } = gameState;
  const [activeTab, setActiveTab] = useState<'ingredients' | 'equipment'>('ingredients');

  // Ingredients data
  const ingredients = [
    { id: 'rice', name: 'Rice', image: '/images/ingredients/rice.png', price: 5 },
    { id: 'egg', name: 'Egg', image: '/images/ingredients/egg.png', price: 5 },
    { id: 'bacon', name: 'Bacon', image: '/images/ingredients/bacon.png', price: 8 },
    { id: 'ham', name: 'Ham', image: '/images/ingredients/ham.png', price: 8 },
    { id: 'garlic', name: 'Garlic', image: '/images/ingredients/garlic.png', price: 3 },
    { id: 'oil', name: 'Oil', image: '/images/ingredients/oil.png', price: 4 },
    { id: 'pepper', name: 'Pepper', image: '/images/ingredients/pepper.png', price: 3 },
    { id: 'tomato', name: 'Tomato', image: '/images/ingredients/tomato.png', price: 5 },
  ];

  const handleBuyIngredient = (ingredientId: string) => {
    buyIngredient(ingredientId, 10);
  };

  const handleBuyEquipment = (equipmentId: string) => {
    buyEquipment(equipmentId);
  };

  const handleBack = () => {
    navigate('/game');
  };

  return (
    <GameContainer>
      <Header>
        <div>
          <span>Money: ${money}</span>
        </div>
        <Button onClick={handleBack}>Back to Game</Button>
      </Header>

      <MainContent>
        {/* Shop tabs */}
        <div style={{ display: 'flex', marginBottom: '1rem' }}>
          <Button 
            style={{ 
              flex: 1, 
              borderRadius: '8px 0 0 8px',
              backgroundColor: activeTab === 'ingredients' ? '#ff8303' : '#e94560'
            }}
            onClick={() => setActiveTab('ingredients')}
          >
            Ingredients
          </Button>
          <Button 
            style={{ 
              flex: 1, 
              borderRadius: '0 8px 8px 0',
              backgroundColor: activeTab === 'equipment' ? '#ff8303' : '#e94560'
            }}
            onClick={() => setActiveTab('equipment')}
          >
            Equipment
          </Button>
        </div>

        {/* Ingredients section */}
        {activeTab === 'ingredients' && (
          <div>
            <h2 style={{ color: 'white', marginBottom: '1rem' }}>Buy Ingredients</h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
              gap: '1rem' 
            }}>
              {ingredients.map(ingredient => (
                <div 
                  key={ingredient.id}
                  style={{
                    backgroundColor: '#16213e',
                    borderRadius: '8px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <img 
                    src={ingredient.image} 
                    alt={ingredient.name} 
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      objectFit: 'contain',
                      marginBottom: '0.5rem'
                    }} 
                  />
                  <h3 style={{ color: 'white', margin: '0 0 0.5rem 0' }}>
                    {ingredient.name}
                  </h3>
                  <p style={{ color: '#aaa', margin: '0 0 0.5rem 0' }}>
                    In stock: {inventory[ingredient.id] || 0}
                  </p>
                  <p style={{ color: 'white', margin: '0 0 1rem 0' }}>
                    Price: ${ingredient.price}/unit
                  </p>
                  <Button 
                    onClick={() => handleBuyIngredient(ingredient.id)}
                    disabled={money < ingredient.price * 10}
                  >
                    Buy 10 for ${ingredient.price * 10}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Equipment section */}
        {activeTab === 'equipment' && (
          <div>
            <h2 style={{ color: 'white', marginBottom: '1rem' }}>Buy Equipment</h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
              gap: '1rem' 
            }}>
              {equipment.map(item => (
                <RecipeCard 
                  key={item.id} 
                  unlocked={!item.unlocked}
                  style={{ opacity: 1 }}
                >
                  <RecipeImage src={item.image} alt={item.name} />
                  <RecipeName>{item.name}</RecipeName>
                  
                  <div style={{ color: 'white', margin: '0.5rem 0' }}>
                    {item.unlocked ? (
                      <span style={{ color: '#4caf50' }}>Owned</span>
                    ) : (
                      <>
                        <p>Price: ${item.price}</p>
                        <p>Speed Boost: +{item.speedBoost}%</p>
                        <Button 
                          primary
                          onClick={() => handleBuyEquipment(item.id)}
                          disabled={money < item.price}
                          style={{ marginTop: '0.5rem' }}
                        >
                          Buy
                        </Button>
                      </>
                    )}
                  </div>
                </RecipeCard>
              ))}
            </div>
          </div>
        )}
      </MainContent>
    </GameContainer>
  );
};

export default ShopPage; 