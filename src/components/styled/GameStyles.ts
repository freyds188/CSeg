import styled from 'styled-components';

// Main game container
export const GameContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #1a1a2e;
  overflow: hidden;
`;

// Header
export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #16213e;
  color: white;
`;

// Main content area
export const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 1rem;
  position: relative;
`;

// Button styles
export const Button = styled.button<{ primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background-color: ${(props) => (props.primary ? '#ff8303' : '#e94560')};
  color: white;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    background-color: #888;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// Menu container
export const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 2rem;
  background-image: url('/images/kitchen_bg.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }
`;

// Menu title
export const Title = styled.h1`
  font-size: 4rem;
  color: white;
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 0 0 10px rgba(255, 131, 3, 0.8);
  z-index: 2;
  position: relative;
`;

// Menu buttons container
export const MenuButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 300px;
  z-index: 2;
  position: relative;
`;

// Menu button
export const MenuButton = styled(Button)`
  width: 100%;
  padding: 1rem;
  font-size: 1.5rem;
  background-color: #ff8303;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #ff9e3f;
  }
`;

// Game grid
export const GameGrid = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: 1fr;
  gap: 1rem;
  height: 100%;
`;

// Cooking area
export const CookingArea = styled.div`
  grid-column: 1;
  background-color: #0f3460;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

// Customer area
export const CustomerArea = styled.div`
  grid-column: 2;
  background-color: #0f3460;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

// Stove
export const Stove = styled.div`
  background-image: url('/images/stove.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height: 300px;
  position: relative;
  margin-bottom: 1rem;
`;

// Pan
export const Pan = styled.div`
  width: 150px;
  height: 150px;
  background-image: url('/images/pan.png');
  background-size: contain;
  background-repeat: no-repeat;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

// Ingredients area
export const IngredientsArea = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

// Ingredient
export const Ingredient = styled.div<{ available: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background-color: ${(props) => (props.available ? '#e94560' : '#888')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.available ? 'pointer' : 'not-allowed')};
  transition: all 0.2s ease-in-out;
  
  &:hover {
    transform: ${(props) => (props.available ? 'scale(1.05)' : 'none')};
  }
`;

// Ingredient image
export const IngredientImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: contain;
`;

// Ingredient name
export const IngredientName = styled.span`
  font-size: 0.8rem;
  color: white;
  text-align: center;
  margin-top: 0.5rem;
`;

// Customer card
export const CustomerCard = styled.div`
  background-color: #16213e;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

// Customer order
export const CustomerOrder = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Order image
export const OrderImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: contain;
  border-radius: 4px;
  background-color: #0f3460;
`;

// Order details
export const OrderDetails = styled.div`
  flex: 1;
`;

// Order name
export const OrderName = styled.h3`
  margin: 0;
  color: white;
  font-size: 1rem;
`;

// Patience bar
export const PatienceBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #333;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

// Patience fill
export const PatienceFill = styled.div<{ patience: number }>`
  height: 100%;
  width: ${(props) => props.patience}%;
  background-color: ${(props) => {
    if (props.patience > 60) return '#4caf50';
    if (props.patience > 30) return '#ff9800';
    return '#f44336';
  }};
  transition: width 0.3s ease-in-out;
`;

// Serve button
export const ServeButton = styled(Button)`
  margin-top: 0.5rem;
  width: 100%;
`;

// Recipe selection
export const RecipeSelection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

// Recipe card
export const RecipeCard = styled.div<{ unlocked: boolean }>`
  background-color: #16213e;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: ${(props) => (props.unlocked ? 'pointer' : 'not-allowed')};
  opacity: ${(props) => (props.unlocked ? 1 : 0.5)};
  transition: all 0.2s ease-in-out;
  
  &:hover {
    transform: ${(props) => (props.unlocked ? 'translateY(-5px)' : 'none')};
    box-shadow: ${(props) => (props.unlocked ? '0 5px 15px rgba(0, 0, 0, 0.3)' : 'none')};
  }
`;

// Recipe image
export const RecipeImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 8px;
  background-color: #0f3460;
  margin-bottom: 0.5rem;
`;

// Recipe name
export const RecipeName = styled.h3`
  margin: 0;
  color: white;
  font-size: 1rem;
  text-align: center;
`;

// Progress bar
export const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background-color: #333;
  border-radius: 6px;
  overflow: hidden;
  margin: 1rem 0;
`;

// Progress fill
export const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  width: ${(props) => props.progress}%;
  background-color: #ff8303;
  transition: width 0.3s ease-in-out;
`;

// Leaderboard container
export const LeaderboardContainer = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: #16213e;
  border-radius: 12px;
  padding: 1.5rem;
  z-index: 2;
  position: relative;
`;

// Leaderboard title
export const LeaderboardTitle = styled.h2`
  color: white;
  text-align: center;
  margin-bottom: 1.5rem;
`;

// Leaderboard table
export const LeaderboardTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

// Leaderboard header
export const LeaderboardHeader = styled.th`
  color: white;
  text-align: left;
  padding: 0.5rem;
  border-bottom: 2px solid #ff8303;
`;

// Leaderboard row
export const LeaderboardRow = styled.tr`
  &:nth-child(odd) {
    background-color: rgba(255, 131, 3, 0.1);
  }
`;

// Leaderboard cell
export const LeaderboardCell = styled.td`
  color: white;
  padding: 0.5rem;
`;

// Back button
export const BackButton = styled(Button)`
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 3;
`;

// Tutorial container
export const TutorialContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

// Tutorial box
export const TutorialBox = styled.div`
  width: 80%;
  max-width: 600px;
  background-color: #16213e;
  border-radius: 12px;
  padding: 2rem;
  color: white;
`;

// Tutorial title
export const TutorialTitle = styled.h2`
  color: #ff8303;
  margin-bottom: 1rem;
`;

// Tutorial text
export const TutorialText = styled.p`
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

// Game over container
export const GameOverContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

// Game over box
export const GameOverBox = styled.div`
  width: 80%;
  max-width: 500px;
  background-color: #16213e;
  border-radius: 12px;
  padding: 2rem;
  color: white;
  text-align: center;
`;

// Game over title
export const GameOverTitle = styled.h2`
  color: #ff8303;
  margin-bottom: 1rem;
  font-size: 2rem;
`;

// Game over score
export const GameOverScore = styled.p`
  font-size: 3rem;
  color: #ff8303;
  margin: 1.5rem 0;
`;

// Game over buttons
export const GameOverButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`; 