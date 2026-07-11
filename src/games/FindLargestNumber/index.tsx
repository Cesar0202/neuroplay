import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { saveScore } from '../../utils/scoreStorage';
import GameStats from '../../components/GameStats';

const FindLargestNumber = () => {
    const { reportScore } = useGame();
    const [isPlaying, setIsPlaying] = useState(false);
    const [numbers, setNumbers] = useState<number[]>([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);

    const generateNumbers = () => {
        const newNumbers = Array.from({ length: 9 }, () => Math.floor(Math.random() * 100));
        setNumbers(newNumbers);
    };

    const startGame = () => {
        setIsPlaying(true);
        setScore(0);
        setTimeLeft(30);
        generateNumbers();
    };

    const handleNumberClick = (number: number) => {
        if (!isPlaying) return;
        
        const maxNumber = Math.max(...numbers);
        if (number === maxNumber) {
            setScore(score + 10);
            generateNumbers();
        } else {
            // Penalty
            // Add visual feedback
            setScore(Math.max(0, score - 5));
        }
    };

    useEffect(() => {
        if (isPlaying) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setIsPlaying(false);
                        saveScore('find-largest', score);
                        reportScore(score);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isPlaying]);

    return (
        <div className="flex flex-col items-center justify-center p-8 h-full">
            <h2 className="text-3xl font-display font-bold text-white mb-8">Encuentra el Mayor</h2>
            
            {!isPlaying ? (
                <div className="text-center">
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">Selecciona el número más grande de la cuadrícula lo más rápido posible.</p>
                    <button 
                        onClick={startGame}
                        className="px-8 py-4 bg-neon-blue text-black font-bold rounded-xl hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                    >
                        COMENZAR
                    </button>
                    {score > 0 && <div className="mt-8 text-2xl font-bold text-neon-purple">Puntuación: {score}</div>}
                </div>
            ) : (
                <>
                    <GameStats score={score} time={timeLeft} />

                    <div className="grid grid-cols-3 gap-4 w-full max-w-md mt-8">
                        <AnimatePresence mode="popLayout">
                            {numbers.map((num, idx) => (
                                <motion.button
                                    key={`${idx}-${num}`}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    layout
                                    onClick={() => handleNumberClick(num)}
                                    className="aspect-square bg-white/5 border border-white/10 rounded-2xl text-4xl font-bold text-white hover:bg-white/10 hover:border-neon-purple transition-colors flex items-center justify-center shadow-lg"
                                >
                                    {num}
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </div>
                </>
            )}
        </div>
    );
};

export default FindLargestNumber;
