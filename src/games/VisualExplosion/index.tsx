import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { saveScore } from '../../utils/scoreStorage';
import { Play } from 'lucide-react';
import GameStats from '../../components/GameStats';

const VisualExplosion = () => {
  const { reportScore } = useGame();
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [items, setItems] = useState<{ id: number; x: number; y: number; life: number }[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (gameStatus === 'playing') {
      const interval = setInterval(() => {
        addItem();
      }, 500); // Add item every 0.5s
      return () => clearInterval(interval);
    }
  }, [gameStatus]);

  const addItem = () => {
    const newItem = {
      id: Date.now() + Math.random(),
      x: Math.random() * (window.innerWidth - 100) + 50,
      y: Math.random() * (window.innerHeight - 200) + 100,
      life: 100
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleItemClick = (id: number) => {
    if (gameStatus !== 'playing') return;
    setItems((prev) => prev.filter((item) => item.id !== id));
    setScore(s => s + 10);
  };

  useEffect(() => {
    if (gameStatus === 'playing') {
      const interval = setInterval(() => {
        setItems((prev) => {
          const next = prev
            .map((item) => ({ ...item, life: item.life - 2 }))
            .filter((item) => item.life > 0);
          
          if (prev.some(item => item.life <= 2)) {
               // Missed one? End the game
               setGameStatus('finished');
          }
          return next;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [gameStatus]);

  const startGame = () => {
    setGameStatus('playing');
    setScore(0);
    setItems([]);
  };

  useEffect(() => {
    if (gameStatus === 'finished') {
       reportScore(score);
       saveScore('visual-explosion', score);
    }
  }, [gameStatus, score, reportScore]);

  return (
    <div className="flex flex-col items-center justify-center p-8 h-full w-full overflow-hidden relative">
      <h2 className="text-3xl font-display font-bold text-white mb-4 z-10 pointer-events-none">Explosión Visual</h2>
      
      {!gameStatus ? null : gameStatus === 'idle' ? (
        <div className="text-center z-20">
            <p className="text-gray-400 mb-8 pointer-events-none text-lg">Haz clic en todos los orbes azules antes de que desaparezcan. ¡Si dejas escapar uno, pierdes!</p>
            <button onClick={startGame} className="px-8 py-4 bg-neon-purple font-bold rounded-xl pointer-events-auto hover:scale-105 transition-transform"><Play className="inline mr-2"/> JUGAR</button>
        </div>
      ) : gameStatus === 'playing' ? (
         <>
         <GameStats score={score} />
         {items.map((item) => (
             <button
               key={item.id}
               onClick={() => handleItemClick(item.id)}
               style={{ 
                   left: item.x, 
                   top: item.y, 
                   opacity: item.life / 100,
                   transform: `scale(${item.life / 100})`
               }}
               className="absolute w-12 h-12 bg-neon-blue rounded-full shadow-[0_0_20px_cyan] hover:scale-110 active:scale-90 transition-transform cursor-pointer border-2 border-white"
             />
         ))}
         </>
      ) : (
         <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center pointer-events-auto">
             <h3 className="text-4xl font-bold text-white mb-2 font-display">¡Orbe Escapado!</h3>
             <p className="text-2xl text-gray-300 mb-8">Puntos Totales: <span className="text-neon-blue font-bold">{score}</span></p>
             <button onClick={startGame} className="px-8 py-4 bg-neon-purple font-bold rounded-xl hover:scale-105 transition-transform"><Play className="inline mr-2"/> VOLVER A JUGAR</button>
         </div>
      )}
    </div>
  );
};

export default VisualExplosion;
