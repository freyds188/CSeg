import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Title, 
  MenuButtonsContainer, 
  MenuButton 
} from './styled/GameStyles';
import { useGame } from '../contexts/GameContext';

const MainMenu: React.FC = () => {
  const navigate = useNavigate();
  const { startGame } = useGame();
  const [showTutorial, setShowTutorial] = useState(false);

  const handleStartGame = () => {
    startGame();
    navigate('/game');
  };

  const handleContinue = () => {
    navigate('/game');
  };

  const handleHowToPlay = () => {
    navigate('/tutorial');
  };

  const handleLeaderboard = () => {
    navigate('/leaderboard');
  };

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'linear-gradient(to bottom, #1a1a2e, #16213e)',
      position: 'relative',
      padding: '2rem',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7))',
        zIndex: 1,
      }} />
      
      <Title>BACSI FRENZY</Title>
      <MenuButtonsContainer>
        <MenuButton onClick={handleStartGame}>Start</MenuButton>
        <MenuButton onClick={handleContinue}>Continue</MenuButton>
        <MenuButton onClick={handleHowToPlay}>How to Play</MenuButton>
        <MenuButton onClick={handleLeaderboard}>Leaderboard</MenuButton>
      </MenuButtonsContainer>
    </div>
  );
};

export default MainMenu; 