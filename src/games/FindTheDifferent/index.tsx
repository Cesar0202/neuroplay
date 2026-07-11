import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { saveScore } from '../../utils/scoreStorage';
import GameStats from '../../components/GameStats';

const FindTheDifferent = () => {
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [gridSize, setGridSize] = useState(2);
    const [items, setItems] = useState<{ id: number; odd: boolean; color: string }[]>([]);
    const [timeLeft, setTimeLeft] = useState(60);
    const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'finished'>('idle');
    
    // Game logic for generating the grid and odd one out
    const generateGrid = (lvl: number) => {
        const size = Math.min(lvl + 1, 6); // Cap grid size at 6x6
        setGridSize(size);
        
        const hue = Math.random() * 360;
        const baseColor = `hsl(${hue}, 70%, 50%)`;
        // Make diff color closer as level increases to increase difficulty
        const diffAmount = Math.max(10, 50 - lvl * 2); 
        const diffColor = `hsl(${hue + diffAmount}, 70%, 50%)`; 
        
        const count = size * size;
        const oddIndex = Math.floor(Math.random() * count);
        
        const newItems = Array.from({ length: count }).map((_, i) => ({
            id: i,
            odd: i === oddIndex,
            color: i === oddIndex ? diffColor : baseColor
        }));
        
        setItems(newItems);
    };

    useEffect(() => {
        if (gameStatus === 'playing') {
            generateGrid(level);
            const timer = setInterval(() => {
                setTimeLeft((t) => {
                    if (t <= 1) {
                        clearInterval(timer);
                        setGameStatus('finished');
                        return 0;
                    }
                    return t - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [gameStatus, level]);

    useEffect(() => {
        if (gameStatus === 'finished') {
            saveScore('find-the-different', score, 'desc');
        }
    }, [gameStatus, score]);

    const handleItemClick = (isOdd: boolean) => {
        if (gameStatus !== 'playing') return;

        if (isOdd) {
            setScore((s) => s + 100 + (level * 10)); // Bonus for higher levels
            setLevel((l) => l + 1);
        } else {
            setScore((s) => Math.max(0, s - 50));
            // Optional: Penalty time?
        }
    };

    const startGame = () => {
        setScore(0);
        setLevel(1);
        setTimeLeft(60);
        setGameStatus('playing');
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-4 relative">
             {gameStatus === 'idle' ? (
                <div className="flex flex-col items-center">
                    <h2 className="text-3xl font-bold text-white mb-8 font-display">
                        Encuentra el Diferente
                    </h2>
                     <button onClick={startGame} className="btn-primary w-64 py-4 text-xl z-20">
                        Jugar
                    </button>
                    <p className="mt-8 text-gray-400 text-sm animate-pulse">Encuentra el color diferente</p>
                </div>
            ) : gameStatus === 'finished' ? (
                 <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/10 z-20">
                    <div className="text-4xl font-bold text-white mb-2">¡Tiempo!</div>
                    <p className="text-xl text-gray-300 mb-6">Nivel alcanzado: <span className="text-neon-blue font-bold">{level}</span></p>
                    <p className="text-xl text-gray-300 mb-6">Puntuación: <span className="text-yellow-400 font-bold">{score}</span></p>
                    <button onClick={startGame} className="btn-secondary flex items-center gap-2 mx-auto">
                        <RotateCcw className="w-5 h-5" /> Jugar de nuevo
                    </button>
                </motion.div>
            ) : (
                <>
                    <GameStats score={score} time={timeLeft} level={level} />

                    <h2 className="text-3xl font-bold text-white mb-8 mt-12 font-display">
                        Encuentra el Diferente
                    </h2>

                    <motion.div 
                        key={level}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="grid gap-2 bg-white/5 p-4 rounded-xl border border-white/10 shadow-2xl backdrop-blur-md"
                        style={{ 
                            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                            width: 'min(90vw, 500px)',
                            height: 'min(90vw, 500px)'
                        }}
                    >
                        {items.map((item) => (
                            <motion.button
                                key={item.id}
                                whileHover={{ scale: 0.95 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleItemClick(item.odd)}
                                className="w-full h-full rounded-lg shadow-inner transition-colors duration-200"
                                style={{ backgroundColor: item.color }}
                            />
                        ))}
                    </motion.div>
                </>
            )}
        </div>
    );
};

export default FindTheDifferent;
