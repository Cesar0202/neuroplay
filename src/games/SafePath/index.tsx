import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { saveScore } from '../../utils/scoreStorage';
import { Play, AlertOctagon } from 'lucide-react';
import GameStats from '../../components/GameStats';
import { safePathMaps } from './maps';

const SafePath = () => {
    const { reportScore } = useGame();
    const [gameState, setGameState] = useState<'start' | 'countdown' | 'playing' | 'won' | 'lost'>('start');
    const [score, setScore] = useState(0);
    const [countdown, setCountdown] = useState(5);
    const [currentMap, setCurrentMap] = useState(safePathMaps[0]);

    useEffect(() => {
        if (gameState === 'countdown') {
            if (countdown > 0) {
                const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
                return () => clearTimeout(timer);
            } else {
                setGameState('playing');
            }
        }
    }, [gameState, countdown]);

    const startGame = () => {
        setGameState('countdown');
        setCountdown(5);
        setScore(0);
        const randomIndex = Math.floor(Math.random() * safePathMaps.length);
        setCurrentMap(safePathMaps[randomIndex]);
    };

    const handleWallEnter = () => {
        if (gameState === 'playing') {
            setGameState('lost');
            // Play sound
            reportScore(0);
        }
    };

    const handleEndEnter = () => {
        if (gameState === 'playing') {
            setGameState('won');
            const finalScore = 1000;
            setScore(finalScore);
            saveScore('safe-path', finalScore);
            reportScore(finalScore);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 h-full">
            <h2 className="text-3xl font-display font-bold text-white mb-4">Camino Seguro</h2>
            <p className="text-gray-400 mb-8">Lleva el cursor desde el inicio (verde) hasta el final (morado) sin tocar las paredes rojas.</p>

            <div className="relative w-full max-w-lg aspect-square bg-gray-900 border-4 border-gray-700 rounded-xl overflow-hidden cursor-crosshair">
                
                {gameState === 'start' && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
                        <button onClick={startGame} className="px-8 py-4 bg-neon-blue font-bold rounded-xl hover:scale-105 transition-transform">
                            <Play className="inline mr-2"/> JUGAR
                        </button>
                    </div>
                )}

                {gameState === 'countdown' && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 pointer-events-none">
                        <div className="text-8xl font-bold text-white">
                            {countdown}
                        </div>
                        <div className="text-white mt-8 font-bold text-xl text-center max-w-xs">
                            ¡Lleva el cursor al círculo verde parpadeante!
                        </div>
                    </div>
                )}

                {gameState === 'lost' && (
                    <div className="absolute inset-0 bg-red-900/90 flex flex-col items-center justify-center z-20 animate-in fade-in zoom-in">
                        <AlertOctagon className="w-16 h-16 text-red-500 mb-4" />
                        <h3 className="text-3xl font-bold text-white mb-2">¡Chocaste!</h3>
                        <button onClick={() => setGameState('start')} className="mt-4 px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20">
                            Reintentar
                        </button>
                    </div>
                )}

                {gameState === 'won' && (
                    <div className="absolute inset-0 bg-green-900/90 flex flex-col items-center justify-center z-20 animate-in fade-in zoom-in">
                        <h3 className="text-3xl font-bold text-white mb-2">¡Meta Alcanzada!</h3>
                        <GameStats score={score} />
                        <button onClick={() => setGameState('start')} className="mt-4 px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20">
                            Jugar de Nuevo
                        </button>
                    </div>
                )}
                
                {/* SVG Maze */}
                <svg className="w-full h-full pointer-events-auto" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    {/* Walls - Background is safe? No, background logic. 
                        Let's make walls distinct elements. 
                        Usually easier: Everything is wall except path.
                        Or: Background is wall, Path is safe.
                        If background is wall (red), onMouseEnter on background = loss.
                        Path (black/safe) onMouseEnter = safe.
                        Actually, bubbling. If mouse is on Path, it triggers Path enter. If on background, triggers background enter.
                        So: Container has onMouseEnter = Lose.
                        Path has onMouseEnter = StopPropagation? No, mousemove.
                        
                        Better: SVG Path with thick stroke = Safe zone.
                        If mouse leaves Path, trigger loss.
                        So Container = Loss.
                        Path element = Safe.
                    */}
                    
                    {/* Danger Zone (Background) */}
                    <rect 
                        x="0" y="0" width="100" height="100" 
                        fill="#333" 
                        onMouseEnter={handleWallEnter}
                        className="cursor-none"
                    />

                    {/* Safe Path */}
                    <path 
                        d={currentMap.path}
                        fill="none" 
                        stroke="#000" 
                        strokeWidth="12" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        onMouseEnter={(e) => e.stopPropagation()} 
                    />
                    
                    {/* Visual Path (overlay on top to hide trigger quirks if needed) */}
                     <path 
                        d={currentMap.path}
                        fill="none" 
                        stroke="#111" 
                        strokeWidth="10" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="pointer-events-none"
                    />

                    {/* Start Zone */}
                    {gameState === 'countdown' && (
                        <circle cx={currentMap.start.cx} cy={currentMap.start.cy} r="6" fill="#4ade80" className="animate-ping pointer-events-none" opacity="0.5" />
                    )}
                    <circle cx={currentMap.start.cx} cy={currentMap.start.cy} r="4" fill="#4ade80" className="pointer-events-none" />
                    
                    {/* End Zone */}
                    <circle 
                        cx={currentMap.end.cx} cy={currentMap.end.cy} r="5" 
                        fill="#c084fc" 
                        onMouseEnter={(e) => { e.stopPropagation(); handleEndEnter(); }}
                        className="cursor-pointer"
                    />

                </svg>
                
                {/* Overlay text instructions if playing */}
                <div className="absolute bottom-2 left-2 text-xs text-gray-500 pointer-events-none">
                    Start: Green | End: Purple
                </div>
            </div>
        </div>
    );
};

export default SafePath;
