import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { saveScore } from '../../utils/scoreStorage';
import GameStats from '../../components/GameStats';

type Direction = 'left' | 'right' | 'up' | 'down';

const LeftRightGame = () => {
  const { reportScore } = useGame();
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState<Direction>('left');
  const [timer, setTimer] = useState(60);

  const getRandomDirection = (current?: Direction): Direction => {
    const dirs: Direction[] = ['left', 'right', 'up', 'down'];
    const available = current ? dirs.filter(d => d !== current) : dirs;
    return available[Math.floor(Math.random() * available.length)];
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimer(60);
    setTarget(getRandomDirection());
  };

  const handleClick = (direction: Direction, currentTarget: Direction, currentlyPlaying: boolean) => {
    if (!currentlyPlaying) return;
    
    if (direction === currentTarget) {
      setScore(s => s + 10);
      setTarget(getRandomDirection(currentTarget));
    } else {
      setScore(s => Math.max(0, s - 5));
      // Visual penalty feedback
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleClick('left', target, isPlaying);
      if (e.key === 'ArrowRight') handleClick('right', target, isPlaying);
      if (e.key === 'ArrowUp') handleClick('up', target, isPlaying);
      if (e.key === 'ArrowDown') handleClick('down', target, isPlaying);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, target]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setTimer((prev) => {
           if (prev <= 1) {
              clearInterval(interval);
              setIsPlaying(false);
              saveScore('left-right', score);
              reportScore(score);
              return 0;
           }
           return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <div className="game-container flex flex-col items-center justify-center p-8 text-center h-full space-y-8">
      <h2 className="text-3xl font-display font-bold text-white mb-4">Dirección Correcta</h2>
      
      {!isPlaying ? (
         <div className="text-center">
             <p className="text-gray-400 mb-8">Pulsa la tecla o el botón correspondiente a la flecha iluminada.</p>
             <button onClick={startGame} className="px-8 py-4 bg-neon-purple rounded-xl font-bold">JUGAR</button>
         </div>
      ) : (
         <>
             <GameStats score={score} time={timer} />
             
             <div className="grid grid-cols-3 gap-4 mt-8">
                 {/* UP */}
                 <div className="col-start-2 flex justify-center">
                     <button 
                        onClick={() => handleClick('up', target, isPlaying)}
                        className={`p-8 border-4 rounded-3xl transition-all duration-100 transform active:scale-95 ${target === 'up' ? 'border-green-400 bg-green-400/20' : 'border-white/10 hover:border-white/30 text-gray-600'}`}
                     >
                         <ArrowUp className={`w-16 h-16 ${target === 'up' ? 'text-white' : 'text-gray-500'}`} />
                     </button>
                 </div>
                 
                 {/* LEFT */}
                 <div className="col-start-1 row-start-2 flex justify-center">
                     <button 
                        onClick={() => handleClick('left', target, isPlaying)}
                        className={`p-8 border-4 rounded-3xl transition-all duration-100 transform active:scale-95 ${target === 'left' ? 'border-neon-blue bg-neon-blue/20' : 'border-white/10 hover:border-white/30 text-gray-600'}`}
                     >
                         <ArrowLeft className={`w-16 h-16 ${target === 'left' ? 'text-white' : 'text-gray-500'}`} />
                     </button>
                 </div>
                 
                 <div className="col-start-2 row-start-2 flex items-center justify-center">
                     <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
                 </div>

                 {/* RIGHT */}
                 <div className="col-start-3 row-start-2 flex justify-center">
                     <button 
                        onClick={() => handleClick('right', target, isPlaying)}
                         className={`p-8 border-4 rounded-3xl transition-all duration-100 transform active:scale-95 ${target === 'right' ? 'border-neon-purple bg-neon-purple/20' : 'border-white/10 hover:border-white/30 text-gray-600'}`}
                     >
                         <ArrowRight className={`w-16 h-16 ${target === 'right' ? 'text-white' : 'text-gray-500'}`} />
                     </button>
                 </div>

                 {/* DOWN */}
                 <div className="col-start-2 row-start-3 flex justify-center">
                     <button 
                        onClick={() => handleClick('down', target, isPlaying)}
                        className={`p-8 border-4 rounded-3xl transition-all duration-100 transform active:scale-95 ${target === 'down' ? 'border-yellow-400 bg-yellow-400/20' : 'border-white/10 hover:border-white/30 text-gray-600'}`}
                     >
                         <ArrowDown className={`w-16 h-16 ${target === 'down' ? 'text-white' : 'text-gray-500'}`} />
                     </button>
                 </div>
             </div>
             
             <p className="text-gray-500 text-sm mt-8">Usa las teclas direccionales (↑ ↓ ← →) del teclado</p>
         </>
      )}
    </div>
  );
};

export default LeftRightGame;
