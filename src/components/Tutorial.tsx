import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TutorialContainer,
  TutorialBox,
  TutorialTitle,
  TutorialText,
  Button,
  BackButton
} from './styled/GameStyles';

interface TutorialStep {
  title: string;
  content: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Welcome to Bacsi Frenzy!",
    content: "You are running a food stall in front of a school. Your goal is to serve delicious food to students as quickly as possible to earn money and build your reputation."
  },
  {
    title: "Recipe Selection",
    content: "First, select a recipe from the menu. Each recipe requires specific ingredients and has its own cooking time and price."
  },
  {
    title: "Ingredient Management",
    content: "Add ingredients to the pan in the correct order. You need to manage your inventory carefully as ingredients cost money to restock."
  },
  {
    title: "Cooking Process",
    content: "Once all ingredients are added, start cooking the dish. Pay attention to the cooking time - don't let the food burn!"
  },
  {
    title: "Serving Customers",
    content: "Customers have limited patience. Serve them quickly with the correct dish to maximize your satisfaction rating and earn more points."
  },
  {
    title: "Upgrades",
    content: "As you earn money, you can upgrade your equipment to cook faster and unlock new recipes to attract more customers."
  },
  {
    title: "Game Progression",
    content: "Each day brings new challenges with more customers and higher expectations. Keep up with the demand to become the best food stall in town!"
  }
];

const Tutorial: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <TutorialContainer>
      <BackButton onClick={handleBack}>Back</BackButton>
      <TutorialBox>
        <TutorialTitle>{tutorialSteps[currentStep].title}</TutorialTitle>
        <TutorialText>{tutorialSteps[currentStep].content}</TutorialText>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            onClick={handlePrevious} 
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          
          <Button 
            primary 
            onClick={handleNext}
          >
            {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </TutorialBox>
    </TutorialContainer>
  );
};

export default Tutorial; 