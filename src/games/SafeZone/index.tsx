import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { saveScore } from '../../utils/scoreStorage';
import { Lock, Unlock, Play } from 'lucide-react';
import GameStats from '../../components/GameStats';

const SafeZone = () => {
    const { reportScore } = useGame();
    const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'finished'>('idle');
    const [zoneState, setZoneState] = useState<'safe' | 'danger'>('safe');
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (gameStatus === 'playing') {
            const interval = setInterval(() => {
                setZoneState((prev) => (prev === 'safe' ? 'danger' : 'safe'));
                // Adding a bit of unpredictability to danger duration
                setTimeout(() => setZoneState('danger'), Math.random() * 2000 + 1000);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [gameStatus]);

    const handleMouseMove = () => {
        if (zoneState === 'danger' && gameStatus === 'playing') {
             // Moved when not safe!
             setGameStatus('finished');
             saveScore('safe-zone', score);
             reportScore(score);
        } else if (gameStatus === 'playing') {
             setScore((prev) => prev + 1); // Score increases while moving in safe zone
        }
    };

    const startGame = () => {
        setGameStatus('playing');
        setScore(0);
        setZoneState('safe');
    };

    return (
        <div 
            className={`flex flex-col items-center justify-center p-8 h-full w-full transition-colors duration-500 ${zoneState === 'danger' && gameStatus === 'playing' ? 'bg-red-900/50' : 'bg-green-900/50'} relative`}
            onMouseMove={gameStatus === 'playing' ? handleMouseMove : undefined}
        >
            <h2 className="text-3xl font-display font-bold text-white mb-8 z-10 pointer-events-none">Zona Segura</h2>
            <p className="text-gray-300 mb-8 z-10 pointer-events-none">Muévete SOLO cuando esté VERDE (Seguro).</p>

            {gameStatus === 'playing' && <GameStats score={score} />}

            {!gameStatus ? null : gameStatus === 'idle' ? (
                <button onClick={startGame} className="px-8 py-4 bg-neon-blue font-bold rounded-xl z-20 pointer-events-auto hover:scale-105 transition-transform"><Play className="inline mr-2"/> JUGAR</button>
            ) : gameStatus === 'playing' ? (
                <div className="text-center pointer-events-none z-10">
                    <div className="text-6xl font-black mb-4 animate-pulse">
                        {zoneState === 'safe' ? <Unlock className="w-24 h-24 text-green-400 mx-auto drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]" /> : <Lock className="w-24 h-24 text-red-500 mx-auto drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />}
                    </div>
                    <div className="text-6xl text-white font-mono mt-8">{score}</div>
                </div>
            ) : (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center pointer-events-auto">
                    <div className="mb-6"><Lock className="w-24 h-24 text-red-500 mx-auto drop-shadow-[0_0_30px_red]" /></div>
                    <h3 className="text-4xl font-bold text-white mb-2 font-display">¡Te moviste!</h3>
                    <p className="text-2xl text-gray-300 mb-8">Puntos Totales: <span className="text-neon-blue font-bold">{score}</span></p>
                    <button onClick={startGame} className="px-8 py-4 bg-neon-purple font-bold rounded-xl hover:scale-105 transition-transform"><Play className="inline mr-2"/> VOLVER A JUGAR</button>
                </div>
            )}
        </div>
    );
};

export default SafeZone;
