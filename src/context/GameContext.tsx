import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface GameContextType {
  numPlayers: number;
  currentPlayer: number;
  scores: number[];
  isSetup: boolean;
  gameStatus: 'setup' | 'playing' | 'turn_end' | 'finished';
  setupGame: (numPlayers: number) => void;
  reportScore: (score: number) => void;
  nextTurn: () => void;
  resetGame: () => void;
  exitGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [numPlayers, setNumPlayers] = useState(1);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState<number[]>([0]);
  const [isSetup, setIsSetup] = useState(true);
  const [gameStatus, setGameStatus] = useState<'setup' | 'playing' | 'turn_end' | 'finished'>('playing');

  const setupGame = (n: number) => {
    setNumPlayers(n);
    setCurrentPlayer(1);
    setScores(new Array(n).fill(0));
    setIsSetup(true);
    setGameStatus('playing');
  };

  const reportScore = (score: number) => {
    const newScores = [...scores];
    newScores[currentPlayer - 1] = score;
    setScores(newScores);
    
    // Check if last player
    if (currentPlayer < numPlayers) {
        setGameStatus('turn_end');
    } else {
        setGameStatus('finished');
    }
  };

  const nextTurn = () => {
    if (currentPlayer < numPlayers) {
        setCurrentPlayer(prev => prev + 1);
        setGameStatus('playing');
    }
  };

  const resetGame = () => {
    setCurrentPlayer(1);
    setScores(new Array(numPlayers).fill(0));
    setGameStatus('playing');
  };
  
  const exitGame = () => {
      setIsSetup(true);
      setGameStatus('playing');
      setNumPlayers(1);
      setCurrentPlayer(1);
      setScores([0]);
  };

  return (
    <GameContext.Provider value={{ 
        numPlayers, 
        currentPlayer, 
        scores, 
        isSetup, 
        gameStatus, 
        setupGame, 
        reportScore, 
        nextTurn, 
        resetGame,
        exitGame
    }}>
      {children}
    </GameContext.Provider>
  );
};
