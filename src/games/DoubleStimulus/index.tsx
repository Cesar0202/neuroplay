import { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { saveScore } from '../../utils/scoreStorage';
import GameStats from '../../components/GameStats';

const DoubleStimulus = () => {
    const { reportScore } = useGame();
    const [isPlaying, setIsPlaying] = useState(false);
    const [color, setColor] = useState<'red' | 'blue' | 'green'>('blue');
    const [symbol, setSymbol] = useState<'square' | 'circle' | 'triangle'>('circle');
    const [feedback, setFeedback] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [round, setRound] = useState(0);

    const START_TIME = 2000;
    const colors = ['red', 'blue', 'green'];
    const symbols = ['square', 'circle', 'triangle'];

    useEffect(() => {
        if (isPlaying) {
            const shapeTimer = setTimeout(() => {
                setFeedback(null);
                setColor(colors[Math.floor(Math.random() * colors.length)] as any);
                setSymbol(symbols[Math.floor(Math.random() * symbols.length)] as any);
                setRound(r => r + 1);
            }, 800); // Shape changes every 0.8s if no reaction! Fast pace!
            return () => clearTimeout(shapeTimer);
        }
    }, [isPlaying, round]);

    useEffect(() => {
        if (isPlaying && timeLeft > 0) {
             const timeInterval = setInterval(() => {
                 setTimeLeft(t => {
                     if (t <= 1) {
                         setIsPlaying(false);
                         return 0;
                     }
                     return t - 1;
                 });
             }, 1000);
             return () => clearInterval(timeInterval);
        } else if (timeLeft === 0 && !isPlaying && score > 0) {
             // Only report score once when time is up
             reportScore(score);
             saveScore('double-stimulus', score);
        }
    }, [isPlaying, timeLeft]);

    const handleReaction = () => {
        if (!isPlaying) return;

        // Condition: Blue Circle
        if (color === 'blue' && symbol === 'circle') {
             setScore(prev => prev + 100);
             setFeedback('¡Correcto!');
        } else {
             setScore(prev => Math.max(0, prev - 50));
             setFeedback('¡Incorrecto!');
        }
        
        // Immediately advance to next shape to prevent spam clicking
        setColor(colors[Math.floor(Math.random() * colors.length)] as any);
        setSymbol(symbols[Math.floor(Math.random() * symbols.length)] as any);
        setRound(r => r + 1);
    };

    const startGame = () => {
        setIsPlaying(true);
        setScore(0);
        setTimeLeft(30);
        setRound(0);
        // Start with a random shape instead of always blue circle
        setColor(colors[Math.floor(Math.random() * colors.length)] as any);
        setSymbol(symbols[Math.floor(Math.random() * symbols.length)] as any);
        setFeedback(null);
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 h-full">
            <h2 className="text-3xl font-display font-bold text-white mb-4">Doble Estímulo</h2>
            <p className="text-gray-400 mb-8">Reacciona SOLO si ves un <span className="text-blue-500 font-bold">CÍRCULO AZUL</span>.</p>

            {!isPlaying && timeLeft === 30 ? (
                <button onClick={startGame} className="px-8 py-4 bg-neon-purple font-bold rounded-xl"><Play className="inline mr-2"/> JUGAR</button>
            ) : timeLeft === 0 ? (
                <div className="flex flex-col items-center bg-black/50 p-8 rounded-2xl border border-white/10">
                    <h3 className="text-3xl font-bold text-white mb-2 font-display">¡Tiempo!</h3>
                    <p className="text-xl text-gray-300 mb-8">Puntos Totales: <span className="text-neon-blue font-bold">{score}</span></p>
                    <button onClick={startGame} className="px-8 py-4 bg-neon-purple font-bold rounded-xl hover:scale-105 transition-transform"><Play className="inline mr-2"/> VOLVER A JUGAR</button>
                </div>
            ) : (
                <div onClick={handleReaction} className="cursor-pointer flex flex-col items-center">
                    <div className="mb-4 text-xl font-mono text-neon-blue">Tiempo: {timeLeft}s</div>
                    
                    <div 
                        className={`w-48 h-48 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] ${
                            color === 'red' ? 'bg-red-500' : color === 'blue' ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                        style={{
                            borderRadius: symbol === 'circle' ? '50%' : '0%',
                            clipPath: symbol === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none'
                        }}
                    >
                    </div>

                    <div className={`text-2xl mt-8 font-bold text-center h-8 transition-opacity ${feedback ? 'opacity-100' : 'opacity-0'} ${feedback === '¡Correcto!' ? 'text-green-400' : 'text-red-500'}`}>
                        {feedback || 'Esperando...'}
                    </div>

                    <GameStats score={score} />
                    <button onClick={() => { setIsPlaying(false); setTimeLeft(0); }} className="block mx-auto mt-8 text-white underline hover:text-red-400">Terminar</button>
                </div>
            )}
        </div>
    );
};

export default DoubleStimulus;
