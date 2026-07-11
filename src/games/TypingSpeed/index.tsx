import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Keyboard } from 'lucide-react';
import { saveScore } from '../../utils/scoreStorage';
import GameStats from '../../components/GameStats';

import { WORDS } from './words';

const TypingSpeed = () => {
    const [word, setWord] = useState('');
    const [input, setInput] = useState('');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'finished'>('idle');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (gameStatus === 'playing') {
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
    }, [gameStatus]);

    // Save score when game finishes
    useEffect(() => {
        if (gameStatus === 'finished') {
            saveScore('typing-speed', score, 'desc');
        }
    }, [gameStatus, score]);

    const startGame = () => {
        setScore(0);
        setTimeLeft(30);
        setGameStatus('playing');
        setWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
        setInput('');
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInput(val);

        if (val.trim().toLowerCase() === word.toLowerCase()) {
            setScore((s) => s + 10);
            setWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
            setInput('');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full max-w-2xl mx-auto text-white p-8">
            <h2 className="text-3xl font-bold text-white mb-6 font-display">
                Velocidad de Escritura
            </h2>
            
            <GameStats score={score} time={timeLeft} />

            {gameStatus === 'idle' && (
                <button onClick={startGame} className="btn-primary w-full py-4 text-xl">
                    Comenzar Test
                </button>
            )}

            {gameStatus === 'playing' && (
                <div className="w-full text-center flex flex-col items-center justify-center py-12">
                    <motion.div 
                        key={word}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-[5rem] font-bold mb-32 tracking-widest text-white font-display"
                    >
                        {word}
                    </motion.div>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={handleInput}
                        className="w-full max-w-lg bg-transparent border-b-2 border-[#4C4C4C] text-center text-4xl p-4 focus:outline-none focus:border-white transition-colors placeholder:text-gray-600 font-mono"
                        placeholder="Escribe aquí..."
                        autoFocus
                    />
                </div>
            )}

            {gameStatus === 'finished' && (
                <div className="bg-white/10 p-8 rounded-2xl w-full text-center backdrop-blur-md border border-white/10">
                    <h3 className="text-4xl font-bold mb-2">¡Tiempo Agotado!</h3>
                    <p className="text-2xl mb-6">Puntuación Final: <span className="text-neon-blue">{score}</span></p>
                    <p className="text-gray-400 mb-8">PPM Estimadas: {Math.round(score / 5)}</p>
                    <button onClick={startGame} className="btn-secondary w-full flex items-center justify-center gap-2">
                        <RotateCcw className="w-5 h-5" /> Reintentar
                    </button>
                </div>
            )}
        </div>
    );
};

export default TypingSpeed;
