import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { saveScore } from '../../utils/scoreStorage';
import GameStats from '../../components/GameStats';

const CatchTheCircle = () => {
    const [circles, setCircles] = useState<{ id: number; x: number; y: number }[]>([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'finished'>('idle');
    const containerRef = useRef<HTMLDivElement>(null);

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

            const spawner = setInterval(() => {
                if (containerRef.current) {
                    const { width, height } = containerRef.current.getBoundingClientRect();
                    const newCircle = {
                        id: Date.now(),
                        x: Math.random() * (width - 60),
                        y: Math.random() * (height - 60),
                    };
                    setCircles((prev) => [...prev, newCircle]);
                    setTimeout(() => setCircles((prev) => prev.filter(c => c.id !== newCircle.id)), 2000);
                }
            }, 800);

            return () => {
                clearInterval(timer);
                clearInterval(spawner);
            };
        }
    }, [gameStatus]);

    useEffect(() => {
        if (gameStatus === 'finished') {
            saveScore('catch-the-circle', score, 'desc');
        }
    }, [gameStatus, score]);

    const handleCatch = (id: number) => {
        setScore((s) => s + 10);
        setCircles((prev) => prev.filter((c) => c.id !== id));
        // Add particle effect/sound here
    };

    const startGame = () => {
        setScore(0);
        setTimeLeft(30);
        setCircles([]);
        setGameStatus('playing');
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 w-full h-full relative overflow-hidden">
            <h2 className="text-3xl font-bold text-white mb-6 z-10 font-display">Atrapa el Círculo</h2>

            {gameStatus === 'idle' && (
                <button onClick={startGame} className="btn-primary w-64 py-4 text-xl z-20">
                    Jugar
                </button>
            )}

            {gameStatus === 'finished' && (
                <div className="z-20 bg-black/60 backdrop-blur-md p-8 rounded-xl text-center border-2 border-white/20">
                    <Target className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-4xl font-bold text-white mb-2">¡Tiempo!</h3>
                    <p className="text-xl text-gray-300 mb-6">Puntuación: <span className="text-yellow-400 font-bold">{score}</span></p>
                    <button onClick={startGame} className="btn-secondary w-full">Modo Reflejos</button>
                </div>
            )}

            <GameStats score={score} time={timeLeft} />

            <div
                ref={containerRef}
                className="absolute inset-0 bg-transparent border-4 border-white/5 rounded-3xl m-4 pointer-events-none"
            >
                {gameStatus === 'playing' && circles.map((circle) => (
                    <motion.div
                        key={circle.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.2, 0.8, 1], rotate: 360 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => handleCatch(circle.id)}
                        className="absolute w-12 h-12 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-full cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.6)] pointer-events-auto hover:brightness-125 hover:scale-110 active:scale-95 flex items-center justify-center"
                        style={{ top: circle.y, left: circle.x }}
                    >
                        <div className="w-4 h-4 bg-white/50 rounded-full blur-[2px]" />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default CatchTheCircle;
