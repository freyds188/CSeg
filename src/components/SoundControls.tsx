import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { setMuted, startBackgroundMusic, pauseBackgroundMusic, playSound, SOUNDS } from '../utils/soundUtils';

const SoundControlsContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 1000;
`;

const SoundButton = styled.button<{ active: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: ${props => props.active ? '#ff8303' : '#333'};
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: scale(1.1);
    background-color: ${props => props.active ? '#e94560' : '#444'};
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