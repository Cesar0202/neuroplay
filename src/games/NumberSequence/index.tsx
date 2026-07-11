import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { saveScore } from '../../utils/scoreStorage';
import { Play } from 'lucide-react';
import GameStats from '../../components/GameStats';

const NumberSequence = () => {
    const { reportScore } = useGame();
    const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'finished'>('idle');
    const [pattern, setPattern] = useState<number[]>([]);
    const [answer, setAnswer] = useState(0);
    const [options, setOptions] = useState<number[]>([]);
    const [score, setScore] = useState(0);

    const generateSequence = () => {
        // Types: Arithmetic, Geometric, Fibonacci
        const type = Math.floor(Math.random() * 3);
        const start = Math.floor(Math.random() * 10) + 1;
        const length = 4;
        let seq: number[] = [];
        let correctValue = 0;

        if (type === 0) {
            // Arithmetic (add diff)
            const diff = Math.floor(Math.random() * 5) + 1;
            seq = Array.from({length}, (_, i) => start + (i * diff));
            correctValue = start + (length * diff);
        } else if (type === 1) {
            // Geometric (multiply ratio)
            const ratio = Math.floor(Math.random() * 2) + 2; // 2 or 3
            let curr = start;
            for(let i=0; i<length; i++) {
                seq.push(curr);
                curr *= ratio;
            }
            correctValue = curr;
        } else {
             // Fibonacci-like
             const s1 = Math.floor(Math.random() * 5) + 1;
             const s2 = Math.floor(Math.random() * 5) + 1;
             seq.push(s1, s2);
             for(let i=2; i<length; i++) {
                 seq.push(seq[i-1] + seq[i-2]);
             }
             correctValue = seq[length-1] + seq[length-2];
        }
        
        setAnswer(correctValue);
        setPattern(seq);

        // Options
        const opts = new Set<number>();
        opts.add(correctValue);
        while(opts.size < 4) {
            const wrong = correctValue + (Math.floor(Math.random() * 20) - 10);
            if (wrong !== correctValue && wrong > 0) opts.add(wrong);
        }
        setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
    };

    const handleOptionSelect = (val: number) => {
        if (val === answer) {
            setScore(score + 100);
            generateSequence();
        } else {
            setScore(Math.max(0, score - 50));
        }
    };

    const startGame = () => {
        setGameStatus('playing');
        setScore(0);
        generateSequence();
    };

    useEffect(() => {
        if (gameStatus === 'finished') {
            reportScore(score);
            saveScore('number-sequence', score);
        }
    }, [gameStatus, score, reportScore]);

    return (
        <div className="flex flex-col items-center justify-center p-8 h-full relative">
            <h2 className="text-3xl font-display font-bold text-white mb-4">Secuencia Numérica</h2>

            {gameStatus === 'playing' && <GameStats score={score} />}

            {!gameStatus ? null : gameStatus === 'idle' ? (
                <div className="text-center z-20">
                    <p className="text-gray-400 mb-8 pointer-events-none text-center max-w-md mx-auto">Descubre el patrón (suma, multiplicación o Fibonacci) y elige el número que falta para continuar la secuencia.</p>
                    <button onClick={startGame} className="px-8 py-4 bg-neon-purple font-bold rounded-xl hover:scale-105 transition-transform"><Play className="inline mr-2" /> JUGAR</button>
                </div>
            ) : gameStatus === 'playing' ? (
                <div className="w-full max-w-md text-center mt-12">
                    <div className="flex justify-center space-x-2 mb-12">
                        {pattern.map((num, i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                className="w-16 h-16 flex items-center justify-center bg-white/10 rounded-xl text-xl font-bold text-white border border-white/20"
                            >
                                {num}
                            </motion.div>
                        ))}
                        <div className="w-16 h-16 flex items-center justify-center bg-neon-blue/20 rounded-xl text-xl font-bold text-neon-blue border border-neon-blue border-dashed animate-pulse">
                            ?
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleOptionSelect(opt)}
                                className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-xl font-bold text-white transition-all shadow-md active:scale-95"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={() => setGameStatus('finished')} 
                        className="block mx-auto mt-12 text-gray-400 hover:text-red-400 underline"
                    >
                        Terminar Partida
                    </button>
                </div>
            ) : (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center pointer-events-auto">
                    <h3 className="text-4xl font-bold text-white mb-2 font-display">¡Juego Terminado!</h3>
                    <p className="text-2xl text-gray-300 mb-8">Puntos Totales: <span className="text-neon-purple font-bold">{score}</span></p>
                    <button onClick={startGame} className="px-8 py-4 bg-neon-purple font-bold rounded-xl hover:scale-105 transition-transform"><Play className="inline mr-2"/> VOLVER A JUGAR</button>
                </div>
            )}
        </div>
    );
};

export default NumberSequence;
