import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { saveScore } from '../../utils/scoreStorage';
import { Play } from 'lucide-react';
import GameStats from '../../components/GameStats';

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e'];

const BuildTower = () => {
    const { reportScore } = useGame();
    const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'finished'>('idle');
    const [blocks, setBlocks] = useState<{width: number, x: number, color: string}[]>([]);
    const [currentBlock, setCurrentBlock] = useState({width: 100, x: 0, direction: 1});
    const [score, setScore] = useState(0);

    // Stacking game. 
    // Block moves left-right. Click to drop.
    // If overlaps, new block is cut. If misses, game over.
    
    useEffect(() => {
        let animationFrame: number;
        if (gameStatus === 'playing') {
            const speed = 2 + (score * 0.4); // Increases by 0.4 px per block
            const update = () => {
                setCurrentBlock(prev => {
                    let nextX = prev.x + prev.direction * speed;
                    if (nextX > 150 || nextX < -150) {
                        return { ...prev, x: prev.x, direction: prev.direction * -1 };
                    }
                    return { ...prev, x: nextX };
                });
                animationFrame = requestAnimationFrame(update);
            };
            animationFrame = requestAnimationFrame(update);
        }
        return () => cancelAnimationFrame(animationFrame);
    }, [gameStatus, score]);

    const handleDrop = () => {
        if (gameStatus !== 'playing') return;
        
        const prevBlock = blocks[blocks.length - 1] || { width: 200, x: 0, color: COLORS[0] };
        
        const overlapLeft = Math.max(prevBlock.x - prevBlock.width/2, currentBlock.x - currentBlock.width/2);
        const overlapRight = Math.min(prevBlock.x + prevBlock.width/2, currentBlock.x + currentBlock.width/2);
        const newWidth = overlapRight - overlapLeft;
        
        if (newWidth <= 0) {
            // Missed completely
            setGameStatus('finished');
            reportScore(score);
            saveScore('build-tower', score);
        } else {
            // Landed
            const newX = overlapLeft + newWidth/2;
            const currentColor = COLORS[(score + 1) % COLORS.length];
            setBlocks([...blocks, { width: newWidth, x: newX, color: currentColor }]);
            
            // Start the next block from the edge, keeping the same direction
            setCurrentBlock({ width: newWidth, x: currentBlock.direction === 1 ? -150 : 150, direction: currentBlock.direction });
            setScore(score + 1);
        }
    };

    const startGame = () => {
        setGameStatus('playing');
        setBlocks([{ width: 200, x: 0, color: COLORS[0] }]); // Base
        setCurrentBlock({ width: 200, x: 0, direction: 1 });
        setScore(0);
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 h-full overflow-hidden" onClick={handleDrop}>
            <h2 className="text-3xl font-display font-bold text-white mb-4 pointer-events-none">Construye la Torre</h2>
            <p className="text-gray-400 mb-8 pointer-events-none">Click para soltar el bloque. ¡Alinéalo bien!</p>
            
            {!gameStatus ? null : gameStatus === 'idle' ? (
               <button onClick={(e) => { e.stopPropagation(); startGame(); }} className="px-8 py-4 bg-neon-purple font-bold rounded-xl pointer-events-auto"><Play className="inline mr-2"/> JUGAR</button>
            ) : (
               <div className="relative w-full h-[500px] flex flex-col-reverse items-center border-b-2 border-white/20">
                   {/* Stacked Blocks */}
                   {blocks.slice(-10).map((b, i) => {
                       const actualIndex = blocks.length > 10 ? blocks.length - 10 + i : i;
                       return (
                           <motion.div 
                               key={actualIndex}
                               layout
                               initial={actualIndex === 0 ? { x: b.x } : { y: -100, x: b.x }}
                               animate={{ y: 0, x: b.x }}
                               transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                               style={{ width: b.width, backgroundColor: b.color }}
                               className="h-8 border border-white/20 flex-shrink-0 z-10"
                           />
                       );
                   })}
                   
                   {/* Moving Block (only when playing) */}
                   {gameStatus === 'playing' && (
                       <div 
                           style={{ 
                               width: currentBlock.width, 
                               transform: `translateX(${currentBlock.x}px)`, 
                               backgroundColor: COLORS[(score + 1) % COLORS.length],
                               bottom: `${Math.min(blocks.length, 10) * 32 + 100}px`
                           }}
                           className="h-8 border border-white/20 absolute z-0"
                       />
                   )}
                   
                   {/* Game Over Overlay */}
                   {gameStatus === 'finished' && (
                       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-xl pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                           <h3 className="text-4xl font-bold text-white mb-2 font-display">¡Torre Caída!</h3>
                           <p className="text-2xl text-gray-300 mb-8">Pisos construidos: <span className="text-neon-blue font-bold">{score}</span></p>
                           <button onClick={startGame} className="px-8 py-4 bg-neon-purple font-bold rounded-xl hover:scale-105 transition-transform"><Play className="inline mr-2"/> REINTENTAR</button>
                       </div>
                   )}
                   
                   <div className="absolute top-4 right-4 pointer-events-none z-20">
                       <GameStats score={score} />
                   </div>
               </div>
            )}
        </div>
    );
};

export default BuildTower;
