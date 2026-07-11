import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { X, Trophy, User } from 'lucide-react';
import { GameProvider, useGame } from '../context/GameContext';
import { getHighScores, type GameScore } from '../utils/scoreStorage';
interface GameLayoutProps {
  children?: React.ReactNode;
}

const GameHUD = () => {
    const navigate = useNavigate();
    const { currentPlayer, scores, exitGame } = useGame();
    
    // Mock stats for HUD - effectively just showing level or score of current player
    const currentScore = scores[currentPlayer - 1] || 0;

    return (
      <header className="relative z-50 flex items-center justify-between px-6 py-4 bg-[#121212] border-b border-[#2C2C2C]">
        
        {/* Left: Stats */}
        <div className="flex items-center space-x-6 text-sm font-bold tracking-wider text-gray-300">
          {/* Turn Token */}
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-[#1E1E1E] border border-[#2C2C2C]">
             <User className="w-4 h-4" />
             <span>Jugador</span>
          </div>

          <div className="flex items-center space-x-2 hidden sm:flex">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span>{currentScore.toLocaleString()}</span>
          </div>
        </div>

        {/* Center: Game Title (Optional) */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
             <span className="text-gray-500 text-xs uppercase font-bold tracking-[0.2em] hidden sm:block">
                 Modo Solitario
             </span>
        </div>

        {/* Right: Exit */}
        <button 
          onClick={() => {
              exitGame();
              navigate('/');
          }}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#1E1E1E] text-gray-400 hover:text-white border border-[#2C2C2C] hover:bg-[#2C2C2C] transition-all"
        >
          <span className="text-xs uppercase font-bold tracking-wider">Salir</span>
          <X className="w-4 h-4" />
        </button>
      </header>
    );
};

const GameLayoutContent: React.FC<GameLayoutProps> = ({ children }) => {
  const location = useLocation();
  // Extract gameId from URL path like "/play/simon-says"
  const gameId = location.pathname.split('/').pop() || '';
  const [highScores, setHighScores] = useState<GameScore[]>([]);

  useEffect(() => {
     const fetchScores = () => {
         setHighScores(getHighScores(gameId));
     };
     fetchScores(); // Initial fetch

     window.addEventListener('scoresUpdated', fetchScores);
     return () => window.removeEventListener('scoresUpdated', fetchScores);
  }, [gameId]);

  return (
    <div className="relative w-full h-screen bg-[#121212] overflow-hidden flex flex-col">
      <GameHUD />
      
      {/* Main Game Area */}
      <main className="flex-1 relative z-10 flex p-4 gap-4 max-w-[1400px] w-full mx-auto">
        {/* Game Container */}
        <div className="flex-1 h-full rounded-xl bg-[#1E1E1E] relative overflow-hidden shadow-2xl">
          <div className="relative w-full h-full p-6">
             <div className="w-full h-full opacity-100">
                {children || <Outlet />}
             </div>
          </div>
        </div>
        
        {/* Leaderboard Sidebar */}
        <div className="w-80 h-full bg-[#1E1E1E] rounded-xl border border-[#2C2C2C] hidden lg:flex flex-col overflow-hidden shadow-xl">
            <div className="p-4 bg-[#252525] border-b border-[#2C2C2C] flex items-center justify-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h3 className="text-white font-bold tracking-wider">MEJORES PUNTAJES</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {highScores.length === 0 ? (
                    <div className="text-gray-500 text-center text-sm mt-8 px-4">Aún no hay puntuaciones.<br/>¡Juega para ser el primero!</div>
                ) : (
                    highScores.map((score, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-[#181818] p-3 rounded-lg border border-[#2C2C2C]">
                            <div className="flex items-center space-x-3">
                                <span className={`font-bold w-6 text-center ${idx === 0 ? 'text-yellow-500 text-lg' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-amber-600' : 'text-gray-500'}`}>
                                    #{idx + 1}
                                </span>
                                <div className="text-xs text-gray-400">
                                    {new Date(score.date).toLocaleDateString()}
                                </div>
                            </div>
                            <span className="font-mono text-neon-blue font-bold text-lg">{score.score}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
      </main>
    </div>
  );
};

const GameLayout: React.FC<GameLayoutProps> = (props) => {
    return (
        <GameProvider>
            <GameLayoutContent {...props} />
        </GameProvider>
    );
};

export default GameLayout;
