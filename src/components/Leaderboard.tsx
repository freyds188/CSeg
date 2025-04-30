import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LeaderboardContainer,
  LeaderboardTitle,
  LeaderboardTable,
  LeaderboardHeader,
  LeaderboardRow,
  LeaderboardCell,
  BackButton
} from './styled/GameStyles';
import { LeaderboardEntry } from '../types/gameTypes';

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    // In a real app, this would fetch from an API or database
    // For now, we'll use mock data or localStorage
    const savedLeaderboard = localStorage.getItem('leaderboard');
    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard));
    } else {
      // Mock data for demonstration
      const mockLeaderboard: LeaderboardEntry[] = [
        { username: 'MasterChef', score: 2500, date: '2023-04-15' },
        { username: 'FoodNinja', score: 2200, date: '2023-04-16' },
        { username: 'QuickServer', score: 2100, date: '2023-04-14' },
        { username: 'SpeedCooker', score: 1800, date: '2023-04-13' },
        { username: 'GourmetGuru', score: 1700, date: '2023-04-12' },
        { username: 'RecipeMaster', score: 1500, date: '2023-04-11' },
        { username: 'FoodArtist', score: 1300, date: '2023-04-10' },
        { username: 'ChefSupreme', score: 1200, date: '2023-04-09' },
        { username: 'CookingPro', score: 1000, date: '2023-04-08' },
        { username: 'KitchenKing', score: 900, date: '2023-04-07' },
      ];
      
      setLeaderboard(mockLeaderboard);
      localStorage.setItem('leaderboard', JSON.stringify(mockLeaderboard));
    }
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundImage: 'url("/images/kitchen_bg.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
      }} />
      
      <BackButton onClick={handleBack}>Back</BackButton>
      
      <LeaderboardContainer>
        <LeaderboardTitle>Top Chefs</LeaderboardTitle>
        
        <LeaderboardTable>
          <thead>
            <tr>
              <LeaderboardHeader>#</LeaderboardHeader>
              <LeaderboardHeader>Username</LeaderboardHeader>
              <LeaderboardHeader>Score</LeaderboardHeader>
              <LeaderboardHeader>Date</LeaderboardHeader>
            </tr>
          </thead>
          <tbody>
            {leaderboard
              .sort((a, b) => b.score - a.score)
              .slice(0, 10)
              .map((entry, index) => (
                <LeaderboardRow key={index}>
                  <LeaderboardCell>{index + 1}</LeaderboardCell>
                  <LeaderboardCell>{entry.username}</LeaderboardCell>
                  <LeaderboardCell>{entry.score}</LeaderboardCell>
                  <LeaderboardCell>{entry.date}</LeaderboardCell>
                </LeaderboardRow>
              ))}
          </tbody>
        </LeaderboardTable>
      </LeaderboardContainer>
    </div>
  );
};

export default Leaderboard; 