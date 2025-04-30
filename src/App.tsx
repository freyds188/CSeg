import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import MainMenu from './components/MainMenu';
import Tutorial from './components/Tutorial';
import Leaderboard from './components/Leaderboard';
import GamePage from './pages/GamePage';
import ShopPage from './pages/ShopPage';
import SoundControls from './components/SoundControls';
import './App.css';

const App: React.FC = () => {
  return (
    <GameProvider>
      <Router>
        <SoundControls />
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/shop" element={<ShopPage />} />
        </Routes>
      </Router>
    </GameProvider>
  );
};

export default App;
