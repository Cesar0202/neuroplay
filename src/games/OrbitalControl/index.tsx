import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { saveScore } from '../../utils/scoreStorage';
import { Play } from 'lucide-react';
import GameStats from '../../components/GameStats';

const OrbitalControl = () => {
    const { reportScore } = useGame();
    const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'finished'>('idle');
    const [angle, setAngle] = useState(0);
    const [radius, setRadius] = useState(100);
    // User tries to keep radius stable? Or avoid object?
    // "Mantén un objeto girando estable". Typically means keep it within a band.
    
    // Mechanics: object naturally drifts out/in. User presses key to push it in/out.
    // Let's say: Drifts OUT. Key press pulls IN.
    
    const [score, setScore] = useState(0);
    const [health, setHealth] = useState(100);

    useEffect(() => {
        if(gameStatus === 'playing') {
            const interval = requestAnimationFrame(loop);
            return () => cancelAnimationFrame(interval);
        }
    }, [gameStatus, radius]);

    const loop = () => {
        setAngle((prev) => (prev + 2) % 360);
        
        // Drift outward
        const drift = 0.5 + (score * 0.001);
        let newR = radius + drift;
        
        // Check bounds (Example: stable zone 80-120)
        if (newR < 50 || newR > 150) {
            setHealth((prev) => prev - 1);
        } else {
            setScore((prev) => prev + 1);
        }
        
        if (health <= 0) {
            setGameStatus('finished');
            reportScore(score);
            saveScore('orbital-control', score);
        }
        
        setRadius(newR);
    };

    const handlePull = () => {
        if (gameStatus === 'playing') {
            setRadius((prev) => Math.max(0, prev - 15));
        }
    };

    const startGame = () => {
        setGameStatus('playing');
        setScore(0);
        setHealth(100);
        setRadius(100);
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 h-full relative overflow-hidden" onMouseDown={handlePull} onTouchStart={handlePull}>
            <h2 className="text-3xl font-display font-bold text-white mb-4 z-10 pointer-events-none">Control Orbital</h2>
            <p className="text-gray-400 mb-8 z-10 pointer-events-none">Haz click/tap para atraer el orbe hacia el centro. Mantenlo en la zona verde.</p>
            
            {gameStatus === 'playing' && <GameStats score={score} />}

            {!gameStatus ? null : gameStatus === 'idle' ? (
                <button onClick={startGame} className="px-8 py-4 bg-neon-blue font-bold rounded-xl z-20 pointer-events-auto hover:scale-105 transition-transform"><Play className="inline mr-2"/> JUGAR</button>
            ) : (
                <div className="flex flex-col items-center z-10">
                    <div className="relative w-80 h-80 flex items-center justify-center bg-black/50 rounded-full border border-white/10 mb-8">
                        {/* Safe Zone */}
                        <div className="absolute w-[200px] h-[200px] rounded-full border-4 border-green-500/30 bg-green-500/5 pointer-events-none"></div>
                        
                        {/* Core */}
                        <div className="absolute w-12 h-12 bg-white rounded-full shadow-[0_0_30px_white] pointer-events-none"></div>
                        
                        {/* Orb */}
                        <div 
                            className="absolute w-6 h-6 bg-neon-purple rounded-full shadow-[0_0_15px_purple] pointer-events-none"
                            style={{
                                transform: `rotate(${angle}deg) translateX(${radius}px)`
                            }}
                        ></div>
                        
                        {/* Game Over Overlay */}
                        {gameStatus === 'finished' && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-full pointer-events-auto">
                                <h3 className="text-2xl font-bold text-white mb-2 font-display">¡Fuera de Órbita!</h3>
                                <p className="text-lg text-gray-300 mb-4">Puntos: <span className="text-neon-blue font-bold">{score}</span></p>
                                <button onClick={(e) => { e.stopPropagation(); startGame(); }} className="px-6 py-2 bg-neon-purple font-bold rounded-xl hover:scale-105 transition-transform">REINTENTAR</button>
                            </div>
                        )}
                    </div>
                    
                    {gameStatus === 'playing' && (
                        <div className="w-64">
                            <div className="flex justify-between text-sm text-gray-400 mb-1">
                                <span>Estabilidad</span>
                                <span>{health}%</span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-300 ${health > 50 ? 'bg-green-500' : health > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                    style={{ width: `${health}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrbitalControl;
