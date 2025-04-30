import React, { useState, useEffect } from 'react';
import {
  CustomerCard,
  CustomerOrder,
  OrderImage,
  OrderDetails,
  OrderName,
  PatienceBar,
  PatienceFill,
  ServeButton
} from './styled/GameStyles';
import { Customer } from '../types/gameTypes';
import { useGame } from '../contexts/GameContext';
import styled from 'styled-components';
import { playSound, SOUNDS } from '../utils/soundUtils';

// Enhanced styling components
const CustomerContainer = styled.div`
  padding: 0.5rem;
`;

const CustomerHeader = styled.h2`
  color: #ff8303;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const EnhancedCustomerCard = styled(CustomerCard)`
  position: relative;
  transform: translateY(0);
  transition: all 0.3s ease;
  border-left: 4px solid #e94560;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255, 131, 3, 0.1) 0%, transparent 100%);
    pointer-events: none;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const EnhancedOrderImage = styled(OrderImage)`
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const TimeRemaining = styled.small<{ urgency: 'low' | 'medium' | 'high' }>`
  color: ${props => 
    props.urgency === 'high' ? '#f44336' : 
    props.urgency === 'medium' ? '#ff9800' : 
    '#aaa'
  };
  display: block;
  margin-top: 0.3rem;
  font-weight: ${props => props.urgency === 'high' ? 'bold' : 'normal'};
`;

const EnhancedPatienceBar = styled(PatienceBar)`
  height: 10px;
  border-radius: 5px;
  margin-top: 0.8rem;
  background-color: rgba(0, 0, 0, 0.2);
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const EnhancedServeButton = styled(ServeButton)`
  margin-top: 1rem;
  transition: all 0.3s ease;
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
  
  &:not(:disabled):hover::after {
    left: 100%;
  }
  
  &:disabled {
    opacity: 0.5;
  }
`;

const EmptyMessage = styled.p`
  color: white;
  text-align: center;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  font-style: italic;
`;

const RushHourAlert = styled.div`
  background-color: rgba(244, 67, 54, 0.2);
  color: #ff8303;
  padding: 0.5rem 1rem;
  border-radius: 4px;
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
  border-radius: 50%;
  background-color: ${props => 
    props.urgency === 'high' ? '#f44336' : 
    props.urgency === 'medium' ? '#ff9800' : 
    '#4caf50'
  };
  margin-right: 0.5rem;
  vertical-align: middle;
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
                  <OrderDetails>
                    <OrderName>
                      <UrgencyIndicator urgency={urgency} />
                      {customer.order.name}
                    </OrderName>
                    <TimeRemaining urgency={urgency}>
                      {urgency === 'high' ? '⚠️ ' : ''}
                      Time remaining: {customer.timeRemaining}s
                    </TimeRemaining>
                  </OrderDetails>
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