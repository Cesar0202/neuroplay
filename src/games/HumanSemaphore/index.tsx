import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { saveScore } from '../../utils/scoreStorage';
import { Play } from 'lucide-react';

const HumanSemaphore = () => {
    const { reportScore } = useGame();
    const [isPlaying, setIsPlaying] = useState(false);
    const [color, setColor] = useState<'red' | 'yellow' | 'green'>('red');
    const [reactionTime, setReactionTime] = useState<number | null>(null);
    const [startTime, setStartTime] = useState<number | null>(null);

    const startGame = () => {
        setIsPlaying(true);
        setColor('red');
        setReactionTime(null);
        setStartTime(null);
        setTimeout(() => changeColor(), 2000 + Math.random() * 3000);
    };

    const changeColor = () => {
        setColor('yellow');
        setTimeout(() => {
            setColor('green');
            setStartTime(Date.now());
        }, 300);
    };

    const handleClick = () => {
        if (!isPlaying || !startTime) return;
        const endTime = Date.now();
        const time = endTime - startTime;
        setReactionTime(time);
        
        saveScore('human-semaphore', 1000 - time);
        reportScore(1000 - time);
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 h-full">
            <h2 className="text-3xl font-display font-bold text-white mb-4">Semáforo Humano</h2>
            <p className="text-gray-400 mb-8 pointer-events-none text-center">Haz clic en el semáforo lo más rápido que puedas en cuanto se ponga <span className="text-green-500 font-bold">VERDE</span>.</p>

            {!isPlaying ? (
                <button onClick={startGame} className="px-8 py-4 bg-neon-blue font-bold rounded-xl hover:scale-105 transition-transform"><Play className="inline mr-2" /> REACCIONA</button>
            ) : (
                <div 
                    onClick={handleClick}
                    className={`w-64 h-64 rounded-full border-8 border-white/20 transition-all duration-200 cursor-pointer shadow-[0_0_50px_rgba(255,255,255,0.2)] ${
                        color === 'red' ? 'bg-red-500 shadow-red-500/50' :
                        color === 'yellow' ? 'bg-yellow-400 shadow-yellow-400/50' :
                        'bg-green-500 shadow-green-500/50 scale-110'
                    }`}
                >
                    {reactionTime && (
                        <div className="flex flex-col items-center justify-center h-full text-black font-bold text-3xl animate-in fade-in zoom-in">
                            {reactionTime} ms
                            <button onClick={startGame} className="mt-4 px-4 py-2 bg-white/20 rounded-lg text-sm uppercase">Reintentar</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HumanSemaphore;
