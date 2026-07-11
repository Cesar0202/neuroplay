import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { saveScore } from '../../utils/scoreStorage';
import GameStats from '../../components/GameStats';

type Operation = {
    term1: number;
    term2: number;
    operator: '+' | '-' | '*' | '/';
    answer: number;
};

const FastMath = () => {
    const [operation, setOperation] = useState<Operation | null>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'finished'>('idle');

    useEffect(() => {
        if (gameStatus === 'playing') {
            generateOperation();
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

    useEffect(() => {
        if (gameStatus === 'finished') {
            saveScore('fast-math', score, 'desc');
        }
    }, [gameStatus, score]);

    const generateOperation = () => {
        const ops = ['+', '-', '*', '/'] as const;
        const op = ops[Math.floor(Math.random() * ops.length)];
        
        let term1 = 0;
        let term2 = 0;
        let answer = 0;

        if (op === '+' || op === '-') {
            term1 = Math.floor(Math.random() * 101); // 0 to 100
            term2 = Math.floor(Math.random() * 101);
            if (term1 < term2) {
                const temp = term1;
                term1 = term2;
                term2 = temp;
            }
            if (op === '+') answer = term1 + term2;
            if (op === '-') answer = term1 - term2;
        } else if (op === '*') {
            // One number is 2-99, the other is 2-9. First number is always the larger one.
            let a = Math.floor(Math.random() * 98) + 2;
            let b = Math.floor(Math.random() * 8) + 2;
            if (a < b) {
                const temp = a;
                a = b;
                b = temp;
            }
            term1 = a;
            term2 = b;
            answer = term1 * term2;
        } else if (op === '/') {
            // Generate exact division. Divisor (term2) is 1-digit (2-9), quotient (answer) is 2-99
            let b = Math.floor(Math.random() * 8) + 2;
            let q = Math.floor(Math.random() * 50) + 2;
            term2 = b;
            answer = q;
            term1 = term2 * answer; 
            // term1 is guaranteed to be >= term2 because answer >= 2
        }

        setOperation({ term1, term2, operator: op, answer });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setUserAnswer(val);
        const num = parseInt(val, 10);
        if (!isNaN(num) && num === operation?.answer) {
            setScore((s) => s + 10);
            generateOperation();
            setUserAnswer('');
        }
    };

    const startGame = () => {
        setScore(0);
        setTimeLeft(60);
        setGameStatus('playing');
        setUserAnswer('');
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full max-w-lg mx-auto text-white p-8">
            <h2 className="text-3xl font-bold text-white mb-6 font-display">Matemática Veloz</h2>

            <GameStats score={score} time={timeLeft} />

            {gameStatus === 'idle' && (
                <button onClick={startGame} className="btn-primary w-full py-4 text-xl">
                    Comenzar Juego
                </button>
            )}

            {gameStatus === 'playing' && operation && (
                <div className="w-full text-center flex flex-col items-center justify-center py-12">
                    <motion.div 
                        key={`${operation.term1}-${operation.operator}-${operation.term2}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-[6rem] font-black mb-16 tracking-tighter font-display"
                    >
                        {operation.term1} <span className="text-[#6366F1]">{operation.operator}</span> {operation.term2}
                    </motion.div>
                    
                    <input
                        type="number"
                        value={userAnswer}
                        onChange={handleInputChange}
                        className="w-48 bg-transparent border-b-2 border-[#4C4C4C] text-center text-5xl p-4 focus:outline-none focus:border-white transition-colors placeholder:text-gray-600 font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="?"
                        autoFocus
                    />
                </div>
            )}

            {gameStatus === 'finished' && (
                <div className="bg-white/10 p-8 rounded-2xl w-full text-center backdrop-blur-md border border-white/10">
                    <h3 className="text-4xl font-bold mb-2">¡Tiempo!</h3>
                    <p className="text-2xl mb-6">Puntuación Final: <span className="text-yellow-400">{score}</span></p>
                    <button onClick={startGame} className="btn-secondary w-full">
                        <RotateCcw className="inline-block mr-2" /> Reintentar
                    </button>
                </div>
            )}
        </div>
    );
};

export default FastMath;
