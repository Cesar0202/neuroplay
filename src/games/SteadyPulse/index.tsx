import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { saveScore } from '../../utils/scoreStorage';
import { Play } from 'lucide-react';
import GameStats from '../../components/GameStats';

const SteadyPulse = () => {
  const { reportScore } = useGame();
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [target, setTarget] = useState({ x: 50, y: 50 }); // % position
  const speed = 0.5;
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);

  useEffect(() => {
    if (gameStatus === 'playing') {
      const interval = setInterval(() => {
        // Move target randomly
        const nextX = Math.max(10, Math.min(90, target.x + (Math.random() - 0.5) * 10 * speed));
        const nextY = Math.max(10, Math.min(90, target.y + (Math.random() - 0.5) * 10 * speed));
        setTarget({ x: nextX, y: nextY });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [gameStatus, target, speed]);

  const handleHover = () => {
    if (gameStatus === 'playing') {
      setScore((prev) => prev + 1);
      setCombo((prev) => Math.min(100, prev + 1));
    }
  };

  const handleLeave = () => {
    if (gameStatus === 'playing') {
      setCombo(0);
    }
  };

  const startGame = () => {
    setGameStatus('playing');
    setScore(0);
    setCombo(0);
    setTarget({ x: 50, y: 50 });
    
    // Play for 15 seconds, but capture current score via functional state or by storing a ref
    setTimeout(() => {
      setGameStatus('finished');
      setScore(finalScore => {
          reportScore(finalScore);
          saveScore('steady-pulse', finalScore);
          return finalScore;
      });
    }, 15000); 
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 h-full w-full relative overflow-hidden bg-black/20">
      <h2 className={`text-3xl font-display font-bold text-white mb-4 z-10 pointer-events-none transition-opacity duration-300 ${gameStatus === 'playing' ? 'opacity-10' : 'opacity-100'}`}>Pulso Firme</h2>
      <p className={`text-gray-400 mb-8 z-10 pointer-events-none transition-opacity duration-300 ${gameStatus === 'playing' ? 'opacity-10' : 'opacity-100'}`}>Mantén el cursor DENTRO del círculo.</p>

      {!gameStatus ? null : gameStatus === 'idle' ? (
        <button onClick={startGame} className="px-8 py-4 bg-neon-purple font-bold rounded-xl z-20 pointer-events-auto hover:scale-105 transition-transform"><Play className="inline mr-2"/> JUGAR</button>
      ) : (
        <>
          {gameStatus === 'playing' && <GameStats score={score} />}
          {gameStatus === 'playing' && <div className="absolute top-24 right-8 sm:top-24 sm:right-8 text-xl font-mono text-neon-blue pointer-events-none">Combo: {combo}x</div>}
          
          <div
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
            onMouseMove={handleHover} // Continuous check
            style={{ 
                left: `${target.x}%`, 
                top: `${target.y}%`,
                transform: 'translate(-50%, -50%)',
                width: `${100 - combo/2}px`, // Shrinks as you do better!
                height: `${100 - combo/2}px`
            }}
            className={`absolute rounded-full border-[2px] border-white/80 bg-white/5 transition-all duration-75 flex items-center justify-center overflow-hidden backdrop-blur-md ${gameStatus === 'playing' ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'}`}
          >
             {/* Clean outer dashed ring */}
             <div className="absolute inset-1 border-[2px] border-dashed border-white/40 rounded-full"></div>
             
             {/* Center core */}
             <div className="w-4 h-4 bg-neon-blue rounded-full z-10" />
             
             {/* Minimal Crosshairs */}
             <div className="absolute w-full h-[2px] bg-white/20"></div>
             <div className="absolute h-full w-[2px] bg-white/20"></div>
          </div>

          {gameStatus === 'finished' && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-xl pointer-events-auto">
                  <h3 className="text-4xl font-bold text-white mb-2 font-display">¡Tiempo Agotado!</h3>
                  <p className="text-2xl text-gray-300 mb-8">Puntos Totales: <span className="text-neon-blue font-bold">{score}</span></p>
                  <button onClick={startGame} className="px-8 py-4 bg-neon-purple font-bold rounded-xl hover:scale-105 transition-transform"><Play className="inline mr-2"/> VOLVER A JUGAR</button>
              </div>
          )}
        </>
      )}
    </div>
  );
};

export default SteadyPulse;
