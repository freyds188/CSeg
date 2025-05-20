import { css } from 'styled-components';

// Pixel art font
export const pixelFont = css`
  font-family: 'Press Start 2P', 'Courier New', monospace;
  image-rendering: pixelated;
`;

// Pixel art border
export const pixelBorder = css`
  border: 4px solid #000;
  box-shadow: 
    4px 4px 0 #000,
    -4px -4px 0 #fff,
    -4px 4px 0 #fff,
    4px -4px 0 #fff;
`;

// Pixel art button style
export const pixelButton = css`
  ${pixelFont}
  ${pixelBorder}
  background: #fff;
  color: #000;
  padding: 8px 16px;
  cursor: pointer;
  position: relative;
  transition: transform 0.1s;
  
  &:active {
    transform: translate(2px, 2px);
    box-shadow: 
      2px 2px 0 #000,
      -2px -2px 0 #fff,
      -2px 2px 0 #fff,
      2px -2px 0 #fff;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

// Pixel art card style
export const pixelCard = css`
  ${pixelBorder}
  background: #fff;
  padding: 16px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 4px;
    left: 4px;
    right: 4px;
    bottom: 4px;
    border: 2px solid #000;
    pointer-events: none;
  }
`;

// Pixel art progress bar
export const pixelProgressBar = css`
  ${pixelBorder}
  background: #fff;
  height: 20px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 4px;
    left: 4px;
    right: 4px;
    bottom: 4px;
    border: 2px solid #000;
    pointer-events: none;
  }
`;

// Pixel art image container
export const pixelImageContainer = css`
  ${pixelBorder}
  background: #fff;
  padding: 4px;
  image-rendering: pixelated;
  
  img {
    image-rendering: pixelated;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

// Pixel art title
export const pixelTitle = css`
  ${pixelFont}
  color: #000;
  text-shadow: 2px 2px 0 #fff;
  margin-bottom: 16px;
`;

// Pixel art container
export const pixelContainer = css`
  ${pixelBorder}
  background: #fff;
  padding: 16px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 4px;
    left: 4px;
    right: 4px;
    bottom: 4px;
    border: 2px solid #000;
    pointer-events: none;
  }
`; 