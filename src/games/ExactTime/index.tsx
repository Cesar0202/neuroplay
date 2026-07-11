import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { saveScore } from '../../utils/scoreStorage';

const ExactTimeGame = () => {
  const { reportScore } = useGame();
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [targetTime, setTargetTime] = useState(10.00);
  const intervalRef = useRef<number | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const startGame = () => {
    const newTarget = Math.floor(Math.random() * 15) + 1;
    setTargetTime(newTarget);
    setIsPlaying(true);
    setTime(0);
    setResult(null);
    const startTime = Date.now();
    intervalRef.current = window.setInterval(() => {
      setTime((Date.now() - startTime) / 1000);
    }, 10);
  };

  const stopGame = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    
    // Calculate score
    const diff = Math.abs(targetTime - time);
    // Score Formula: 1000 points max, loose 100 points per 0.1s off
    // If diff is 0, score 1000. 
    // If diff is 0.1, score 1000 - 100 = 900.
    // If diff > 1.0, score 0.
    let score = Math.max(0, Math.round(1000 - (diff * 1000)));

    setResult(`Tiempo: ${time.toFixed(3)}s. Diferencia: ${diff.toFixed(3)}s`);
    saveScore('exact-time', score);
    reportScore(score);
  };

  useEffect(() => {
     setTargetTime(Math.floor(Math.random() * 15) + 1);
     return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
     };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center h-full">
      <h2 className="text-3xl font-display font-bold text-white mb-8">Tiempo Exacto</h2>
      <p className="text-gray-400 mb-8">Detén el cronómetro exactamente en <span className="text-neon-blue font-bold">{targetTime.toFixed(3)} segundos</span>.</p>

      <div className="relative mb-12">
        <div className="text-6xl font-mono font-bold text-white tracking-widest bg-white/5 p-8 rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
           {time.toFixed(3)} s
        </div>
      </div>

      <div className="space-y-4">
        {!isPlaying && !result && (
          <button
            onClick={startGame}
            className="flex items-center px-8 py-4 bg-neon-blue text-black font-bold rounded-xl hover:bg-cyan-300 transition-all"
          >
            <Play className="w-5 h-5 mr-2" />
            Comenzar
          </button>
        )}

        {isPlaying && (
          <button
            onClick={stopGame}
            className="flex items-center px-8 py-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-400 transition-all animate-pulse"
          >
            <Pause className="w-5 h-5 mr-2" />
            DETENER
          </button>
        )}

        {result && (
          <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="text-2xl font-bold text-neon-purple mb-4">{result}</div>
             <button
               onClick={startGame}
               className="flex items-center px-6 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
             >
               <RefreshCw className="w-5 h-5 mr-2" />
               Intentar de nuevo
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExactTimeGame;
