import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GameContainer,
  Header,
  MainContent,
  GameGrid,
  CookingArea as CookingAreaStyled,
  CustomerArea as CustomerAreaStyled,
  Button
} from '../components/styled/GameStyles';
import CookingAreaComponent from '../components/CookingArea';
import CustomerView from '../components/CustomerView';
import { useGame } from '../contexts/GameContext';
import styled from 'styled-components';

// Enhanced styling components
const EnhancedGameContainer = styled(GameContainer)`
  background: linear-gradient(180deg, #1a1a2e 0%, #0f3460 100%);
`;

const EnhancedHeader = styled(Header)`
  background-color: rgba(22, 33, 62, 0.9);
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  padding: 1rem 2rem;
  border-bottom: 1px solid rgba(255, 131, 3, 0.2);
`;

const GameStats = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatLabel = styled.span`
  font-size: 0.8rem;
  color: #aaa;
`;

const StatValue = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
`;

const EnhancedButton = styled(Button)`
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const ShopButton = styled(EnhancedButton)`
  background-color: #4267B2;
  margin-right: 1rem;
  
  &:hover {
    background-color: #365899;
  }
`;

const EndDayButton = styled(EnhancedButton)`
  background: linear-gradient(to right, #ff8303, #e94560);
  margin-right: 1rem;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }
  
  &:hover::after {
    left: 100%;
  }
`;

const ExitButton = styled(EnhancedButton)`
  background-color: rgba(255, 255, 255, 0.1);
  color: #e94560;
  border: 1px solid rgba(233, 69, 96, 0.5);
  
  &:hover {
    background-color: rgba(233, 69, 96, 0.1);
    border-color: #e94560;
  }
`;

const EnhancedCookingArea = styled(CookingAreaStyled)`
  background-color: rgba(15, 52, 96, 0.8);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
`;

const EnhancedCustomerArea = styled(CustomerAreaStyled)`
  background-color: rgba(15, 52, 96, 0.8);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
`;

const EnhancedMainContent = styled(MainContent)`
  padding: 1.5rem;
`;

const DayNotification = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(15, 52, 96, 0.9);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  text-align: center;
  opacity: ${props => props.visible ? 1 : 0};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  transition: opacity 0.5s ease, visibility 0.5s ease;
  z-index: 100;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 131, 3, 0.3);
`;

const DayNumber = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: #ff8303;
  margin-bottom: 1rem;
`;

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const { gameState, endDay } = useGame();
  const { money, score, day, customers } = gameState;
  const [showEndDay, setShowEndDay] = useState(false);
  const [showDayNotification, setShowDayNotification] = useState(false);

  // Show end day button when all customers are served
  useEffect(() => {
    if (customers.length > 0 && customers.every(c => c.served)) {
      setShowEndDay(true);
    } else {
      setShowEndDay(false);
    }
  }, [customers]);

  // Show day notification on initial load
  useEffect(() => {
    setShowDayNotification(true);
    const timer = setTimeout(() => {
      setShowDayNotification(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleEndDay = () => {
    endDay();
    // Show day notification
    setShowDayNotification(true);
    setTimeout(() => {
      setShowDayNotification(false);
    }, 2000);
  };

  const handleExit = () => {
    navigate('/');
  };

  const handleShop = () => {
    navigate('/shop');
  };

  return (
    <EnhancedGameContainer>
      <EnhancedHeader>
        <GameStats>
          <StatItem>
            <StatLabel>Day</StatLabel>
            <StatValue>{day}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Money</StatLabel>
            <StatValue>${money}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Score</StatLabel>
            <StatValue>{score}</StatValue>
          </StatItem>
        </GameStats>
        <div>
          <ShopButton onClick={handleShop}>
            🛒 Shop
          </ShopButton>
          {showEndDay && (
            <EndDayButton primary onClick={handleEndDay}>
              🌙 End Day
            </EndDayButton>
          )}
          <ExitButton onClick={handleExit}>
            Exit
          </ExitButton>
        </div>
      </EnhancedHeader>

      <EnhancedMainContent>
        <GameGrid>
          <EnhancedCookingArea>
            <CookingAreaComponent />
          </EnhancedCookingArea>
          
          <EnhancedCustomerArea>
            <CustomerView customers={customers} />
          </EnhancedCustomerArea>
        </GameGrid>
      </EnhancedMainContent>

      {/* Day notification */}
      <DayNotification visible={showDayNotification}>
        <DayNumber>Day {day}</DayNumber>
        <p style={{ color: 'white', fontSize: '1.2rem' }}>Let's get cooking!</p>
      </DayNotification>
    </EnhancedGameContainer>
  );
};

export default GamePage; 