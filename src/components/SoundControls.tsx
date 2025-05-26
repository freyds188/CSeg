import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { setMuted, startBackgroundMusic, pauseBackgroundMusic, playSound, SOUNDS } from '../utils/soundUtils';
import { pixelButton, pixelFont } from '../utils/pixelArtStyles';

const SoundControlsContainer = styled.div`
  position: fixed;
  top: 1rem;
  right: 20rem; 
  display: flex;
  gap: 0.5rem;
  z-index: 1000;
  background-color: rgba(22, 33, 62, 0.9);
  padding: 0.5rem;
  border-radius: 8px;
  border: 4px solid #000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  
  /* Adjust position for mobile */
  @media (max-width: 768px) {
    top: auto;
    bottom: 1rem;
    right: 1rem;
  }
`;

const SoundButton = styled.button<{ active: boolean }>`
  ${pixelButton}
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 4px solid #000;
  background-color: ${props => props.active ? '#ff8303' : '#333'};
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0;
  margin: 0;
  
  &:hover {
    transform: translateY(-2px);
    background-color: ${props => props.active ? '#e94560' : '#444'};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const SoundControls: React.FC = () => {
  const [soundOn, setSoundOn] = useState(true);
  const [musicOn, setMusicOn] = useState(true);
  
  // Initialize background music
  useEffect(() => {
    if (musicOn) {
      startBackgroundMusic();
    }
    
    return () => {
      pauseBackgroundMusic();
    };
  }, []);
  
  // Toggle sound effects
  const toggleSound = () => {
    const newState = !soundOn;
    setSoundOn(newState);
    setMuted(!newState);
    
    // Play a click sound if we're turning sound on
    if (newState) {
      playSound(SOUNDS.CLICK, 0.5);
    }
  };
  
  // Toggle background music
  const toggleMusic = () => {
    const newState = !musicOn;
    setMusicOn(newState);
    
    if (newState) {
      startBackgroundMusic();
      playSound(SOUNDS.CLICK, 0.5);
    } else {
      pauseBackgroundMusic();
    }
  };
  
  return (
    <SoundControlsContainer>
      <SoundButton 
        active={soundOn} 
        onClick={toggleSound}
        title={soundOn ? "Mute sound effects" : "Unmute sound effects"}
      >
        {soundOn ? '🔊' : '🔇'}
      </SoundButton>
      
      <SoundButton 
        active={musicOn} 
        onClick={toggleMusic}
        title={musicOn ? "Turn off background music" : "Turn on background music"}
      >
        {musicOn ? '🎵' : '🎵'}
      </SoundButton>
    </SoundControlsContainer>
  );
};

export default SoundControls; 