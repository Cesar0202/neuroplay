import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { saveScore } from '../../utils/scoreStorage';
import { Play } from 'lucide-react';
import GameStats from '../../components/GameStats';

const FlashMemory = () => {
    const { reportScore } = useGame();
    const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'finished'>('idle');
    const [pattern, setPattern] = useState<number[]>([]);
    const [showing, setShowing] = useState(false);
    const [clicks, setClicks] = useState<number[]>([]);
    const [score, setScore] = useState(0);

    const gridSize = Math.min(6, 3 + Math.floor(score / 3)); // 3x3, 4x4, 5x5, 6x6
    const totalCells = gridSize * gridSize;
    const targetCount = Math.min(totalCells - 1, 3 + Math.floor(score / 2));
    
    const grid = Array(totalCells).fill(false);

    const startRound = (currentScore: number) => {
        const nextGridSize = Math.min(6, 3 + Math.floor(currentScore / 3));
        const nextTotalCells = nextGridSize * nextGridSize;
        const nextTargetCount = Math.min(nextTotalCells - 1, 3 + Math.floor(currentScore / 2));
        
        const newPattern = new Set<number>();
        while(newPattern.size < nextTargetCount) {
            newPattern.add(Math.floor(Math.random() * nextTotalCells));
        }
        setPattern(Array.from(newPattern));
        setShowing(true);
        setClicks([]);
        
        setTimeout(() => setShowing(false), 2000); // 2s memorization
    };

    const handleClick = (index: number) => {
        if (gameStatus !== 'playing' || showing) return;
        
        const isCorrect = pattern.includes(index);
        
        if (isCorrect) {
             if (!clicks.includes(index)) {
                 const newClicks = [...clicks, index];
                 setClicks(newClicks);
                 if (newClicks.length === pattern.length) {
                     setScore(prev => {
                         const nextScore = prev + 1;
                         setTimeout(() => startRound(nextScore), 1000);
                         return nextScore;
                     });
                 }
             }
        } else {
             setGameStatus('finished');
             saveScore('flash-memory', score);
             reportScore(score);
        }
    };

    const startGame = () => {
        setGameStatus('playing');
        setScore(0);
        startRound(0);
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 h-full">
            <h2 className="text-3xl font-display font-bold text-white mb-8">Flash Memory</h2>
            
            {gameStatus === 'playing' && <GameStats score={score} />}
            
            {!gameStatus ? null : gameStatus === 'idle' ? (
               <div className="text-center max-w-md">
                   <p className="text-gray-400 mb-8 text-lg">Memoriza el patrón de cuadros blancos y repítelo. Cada ronda se añadirán más cuadros.</p>
                   <button onClick={startGame} className="px-8 py-4 bg-neon-blue font-bold rounded-xl hover:scale-105 transition-transform"><Play className="inline mr-2"/> JUGAR</button>
               </div>
            ) : (
               <div className="relative w-full max-w-lg flex flex-col items-center mt-8">
                   <div 
                      className="grid gap-4 relative" 
                      style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
                   >
                      {grid.map((_, i) => (
                          <div 
                             key={i}
                             onClick={() => handleClick(i)}
                             className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg transition-colors duration-200 cursor-pointer border border-white/10 ${
                                 showing && pattern.includes(i) ? 'bg-white shadow-[0_0_20px_white]' : 
                                 !showing && clicks.includes(i) ? 'bg-green-500 shadow-green-500/50' : 
                                 'bg-white/5 hover:bg-white/10'
                             }`}
                          />
                      ))}
                      
                      {/* Game Over Overlay */}
                      {gameStatus === 'finished' && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-xl pointer-events-auto w-[300px] h-[300px] -m-[22px]">
                              <h3 className="text-3xl font-bold text-white mb-2 font-display">¡Error!</h3>
                              <p className="text-xl text-gray-300 mb-6">Puntuación: <span className="text-neon-blue font-bold">{score}</span></p>
                              <button onClick={startGame} className="px-6 py-3 bg-neon-purple font-bold rounded-xl hover:scale-105 transition-transform"><Play className="inline mr-2"/> REINTENTAR</button>
                          </div>
                      )}
                   </div>
               </div>
            )}
        </div>
    );
};

export default FlashMemory;
