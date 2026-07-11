import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { saveScore } from '../../utils/scoreStorage';
import { Play } from 'lucide-react';
import GameStats from '../../components/GameStats';

const DynamicMaze = () => {
    const { reportScore } = useGame();
    const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'finished'>('idle');
    const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
    const [goalPosition, setGoalPosition] = useState({ x: 9, y: 9 });
    const [grid, setGrid] = useState<number[][]>([]);
    const [score, setScore] = useState(0);

  const gridSize = 10;

  useEffect(() => {
    if (gameStatus === 'playing') {
      const interval = setInterval(generateMaze, 3000); // Change maze every 3 seconds
      return () => clearInterval(interval);
    }
  }, [gameStatus]);

  const generateMaze = () => {
    const newGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
    // Random walls
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (Math.random() > 0.7) newGrid[r][c] = 1; // Wall
      }
    }
    // Ensure player and goal are free
    newGrid[playerPosition.y][playerPosition.x] = 0;
    newGrid[goalPosition.y][goalPosition.x] = 0;
    
    setGrid(newGrid);
  };

  const movePlayer = (dx: number, dy: number) => {
    const newX = Math.max(0, Math.min(gridSize - 1, playerPosition.x + dx));
    const newY = Math.max(0, Math.min(gridSize - 1, playerPosition.y + dy));

    if (grid[newY][newX] === 0) {
      setPlayerPosition({ x: newX, y: newY });
      if (newX === goalPosition.x && newY === goalPosition.y) {
        setScore(score + 500);
        // Next level
        setPlayerPosition({ x: 0, y: 0 });
        setGoalPosition({ x: Math.floor(Math.random()*gridSize), y: Math.floor(Math.random()*gridSize) });
        generateMaze();
      }
    } else if (grid[newY][newX] === 1) {
      // Hit a wall! Game Over
      setGameStatus('finished');
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus !== 'playing') return;
      if (e.key === 'ArrowUp') movePlayer(0, -1);
      if (e.key === 'ArrowDown') movePlayer(0, 1);
      if (e.key === 'ArrowLeft') movePlayer(-1, 0);
      if (e.key === 'ArrowRight') movePlayer(1, 0);
  };

  useEffect(() => {
     window.addEventListener('keydown', handleKeyDown);
     return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStatus, playerPosition, grid]); // Updates when player moves

  const startGame = () => {
    setGameStatus('playing');
    setScore(0);
    setPlayerPosition({ x: 0, y: 0 });
    setGoalPosition({ x: 9, y: 9 });
    generateMaze();
  };

  useEffect(() => {
    if (gameStatus === 'finished') {
       reportScore(score);
       saveScore('dynamic-maze', score);
    }
  }, [gameStatus, score, reportScore]);

  return (
    <div className="flex flex-col items-center justify-center p-8 h-full relative">
      <h2 className="text-3xl font-display font-bold text-white mb-4">Laberinto Dinámico</h2>
      <p className="text-gray-400 mb-4">Usa las flechas para llegar a la meta. ¡Cuidado, las paredes cambian!</p>
      
      {gameStatus === 'playing' && <GameStats score={score} />}

      {!gameStatus ? null : gameStatus === 'idle' ? (
         <button onClick={startGame} className="px-8 py-4 bg-neon-blue font-bold rounded-xl hover:scale-105 transition-transform"><Play className="inline mr-2"/> JUGAR</button>
      ) : (
         <div className="relative">
             
             {gameStatus === 'finished' && (
                 <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-lg">
                     <h3 className="text-4xl font-bold text-white mb-2 font-display">¡Juego Terminado!</h3>
                     <p className="text-2xl text-gray-300 mb-8">Puntos Totales: <span className="text-neon-blue font-bold">{score}</span></p>
                     <button onClick={startGame} className="px-8 py-4 bg-neon-purple font-bold rounded-xl hover:scale-105 transition-transform"><Play className="inline mr-2"/> VOLVER A JUGAR</button>
                 </div>
             )}

             <div className="bg-black border border-white/20 p-3 rounded-xl shadow-2xl">
                 <div className="grid grid-cols-10 gap-1.5 w-[500px] h-[500px]">
                    {grid.map((row, r) => (
                         row.map((cell, c) => {
                            let color = 'bg-gray-800'; // Floor
                            if (cell === 1) color = 'bg-red-500'; // Wall
                            if (r === playerPosition.y && c === playerPosition.x) color = 'bg-neon-blue'; // Player
                            if (r === goalPosition.y && c === goalPosition.x) color = 'bg-green-500'; // Goal
                            
                            return (
                                <div key={`${r}-${c}`} className={`w-full h-full rounded-sm transition-colors duration-300 ${color}`} />
                            );
                        })
                    ))}
                 </div>
                 {gameStatus === 'playing' && (
                     <button 
                         onClick={() => setGameStatus('finished')} 
                         className="block mx-auto mt-6 text-gray-400 hover:text-red-400 underline"
                     >
                         Terminar Partida
                     </button>
                 )}
             </div>
         </div>
      )}
    </div>
  );
};

export default DynamicMaze;
