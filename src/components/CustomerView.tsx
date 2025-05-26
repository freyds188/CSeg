import React, { useState, useEffect } from 'react';
import {
  CustomerCard,
  CustomerOrder,
  OrderImage,
  PatienceBar,
  PatienceFill,
  ServeButton
} from './styled/GameStyles';
import { Customer, Recipe } from '../types/gameTypes';
import { useGame } from '../contexts/GameContext';
import styled from 'styled-components';
import { playSound, SOUNDS } from '../utils/soundUtils';
import { 
  pixelFont, 
  pixelBorder, 
  pixelButton, 
  pixelCard, 
  pixelProgressBar,
  pixelImageContainer,
  pixelTitle,
  pixelContainer
} from '../utils/pixelArtStyles';

const CustomerContainer = styled.div`
  ${pixelContainer}
  padding: 0.5rem;
`;

const CustomerHeader = styled.h2`
  ${pixelTitle}
  color: #ff8303;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  text-align: center;
`;

const EnhancedCustomerCard = styled(CustomerCard)`
  ${pixelCard}
  position: relative;
  transform: translateY(0);
  transition: all 0.3s ease;
  border-left: 4px solid #e94560;
  overflow: hidden;
  image-rendering: pixelated;
  background-color: #16213e;
  padding: 1.5rem;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

const EnhancedOrderImage = styled(OrderImage)`
  ${pixelImageContainer}
  transition: transform 0.3s ease;
  image-rendering: pixelated;
  width: 80px;
  height: 80px;
  border: 4px solid #000;
  background-color: #0f3460;
  padding: 0.5rem;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const OrderDetailsWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const OrderNameText = styled.h3`
  margin: 0;
  color: #ff8303;
  font-size: 1.2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.3);
`;

const OrderDescription = styled.p`
  margin: 0;
  color: #fff;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const TimeRemaining = styled.small<{ urgency: 'low' | 'medium' | 'high' }>`
  ${pixelFont}
  color: ${props => 
    props.urgency === 'high' ? '#f44336' : 
    props.urgency === 'medium' ? '#ff9800' : 
    '#4caf50'
  };
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-weight: ${props => props.urgency === 'high' ? 'bold' : 'normal'};
  font-size: 1rem;
`;

const EnhancedPatienceBar = styled(PatienceBar)`
  ${pixelProgressBar}
  margin-top: 0.8rem;
`;

const EnhancedServeButton = styled(ServeButton)`
  ${pixelButton}
  margin-top: 1rem;
  width: 100%;
`;

const EmptyMessage = styled.p`
  ${pixelFont}
  color: #000;
  text-align: center;
  padding: 2rem;
  background-color: rgba(0, 0, 0, 0.05);
  border: 4px solid #000;
`;

const RushHourAlert = styled.div`
  ${pixelFont}
  background-color: rgba(244, 67, 54, 0.2);
  color: #ff8303;
  padding: 0.5rem 1rem;
  border: 4px solid #000;
  margin-bottom: 1rem;
  text-align: center;
  animation: pulse 1s infinite;
  font-weight: bold;
  
  @keyframes pulse {
    0% { opacity: 0.8; }
    50% { opacity: 1; }
    100% { opacity: 0.8; }
  }
`;

const UrgencyIndicator = styled.span<{ urgency: 'low' | 'medium' | 'high' }>`
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid #000;
  background-color: ${props => 
    props.urgency === 'high' ? '#f44336' : 
    props.urgency === 'medium' ? '#ff9800' : 
    '#4caf50'
  };
  margin-right: 0.5rem;
  vertical-align: middle;
  image-rendering: pixelated;
`;

interface CustomerViewProps {
  customers: Customer[];
}

const CustomerView: React.FC<CustomerViewProps> = ({ customers }) => {
  const { cookingState, serveDish } = useGame();
  const { cookingComplete, currentRecipe } = cookingState;
  const [showRushHour, setShowRushHour] = useState(false);
  
  // Detect rush hour (when 3 or more customers arrive within 5 seconds)
  useEffect(() => {
    if (customers.filter(c => !c.served).length >= 3) {
      setShowRushHour(true);
      const timer = setTimeout(() => setShowRushHour(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [customers]);

  const canServeDish = cookingComplete && currentRecipe;
  
  const getUrgencyLevel = (timeRemaining: number): 'low' | 'medium' | 'high' => {
    if (timeRemaining <= 10) return 'high';
    if (timeRemaining <= 20) return 'medium';
    return 'low';
  };

  return (
    <CustomerContainer>
      <CustomerHeader>Customers</CustomerHeader>
      {showRushHour && (
        <RushHourAlert>Rush Hour! Multiple customers arriving! 🔥</RushHourAlert>
      )}
      {customers.length === 0 ? (
        <EmptyMessage>No customers at the moment. They will arrive soon!</EmptyMessage>
      ) : (
        customers
          .filter(customer => !customer.served)
          .map(customer => {
            const urgency = getUrgencyLevel(customer.timeRemaining);
            
            return (
              <EnhancedCustomerCard key={customer.id}>
                <CustomerOrder>
                  <EnhancedOrderImage src={customer.order.image} alt={customer.order.name} />
                  <OrderDetailsWrapper>
                    <OrderNameText>
                      <UrgencyIndicator urgency={urgency} />
                      {customer.order.name}
                    </OrderNameText>
                    <OrderDescription>
                      {customer.order.description || `A delicious ${customer.order.name.toLowerCase()} made with fresh ingredients`}
                    </OrderDescription>
                    <TimeRemaining urgency={urgency}>
                      {urgency === 'high' ? '⚠️ ' : ''}
                      Time remaining: {customer.timeRemaining}s
                    </TimeRemaining>
                  </OrderDetailsWrapper>
                </CustomerOrder>
                
                <EnhancedPatienceBar>
                  <PatienceFill patience={customer.patience} />
                </EnhancedPatienceBar>
                
                <EnhancedServeButton
                  onClick={() => {
                    if (canServeDish) {
                      playSound(SOUNDS.CLICK);
                      serveDish(customer.id);
                    }
                  }}
                  disabled={!canServeDish}
                >
                  {canServeDish ? 'Serve Dish' : 'Cooking...'}
                </EnhancedServeButton>
              </EnhancedCustomerCard>
            );
          })
      )}
    </CustomerContainer>
  );
};

export default CustomerView; 