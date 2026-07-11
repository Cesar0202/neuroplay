import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { saveScore } from '../../utils/scoreStorage';

const HumanTimer = () => {
  const { reportScore } = useGame();
  const [isPlaying, setIsPlaying] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [targetTime, setTargetTime] = useState(60);

  useEffect(() => {
    setTargetTime(Math.floor(Math.random() * 51) + 10);
  }, []);

  const startGame = () => {
    setIsPlaying(true);
    setResult(null);
    setElapsed(0);
    setStartTime(Date.now());
  };

  const stopTimer = () => {
    if (startTime) {
      const now = Date.now();
      const time = (now - startTime) / 1000;
      setElapsed(time);
      setIsPlaying(false);
      
      const diff = Math.abs(targetTime - time);
      let score = Math.max(0, Math.round(1000 - diff * 200)); // Stricter? 1s off = -200pts. 5s off = 0.
      
      setResult(`Tiempo: ${time.toFixed(3)}s. Diferencia: ${diff.toFixed(3)}s`);
      saveScore('human-timer', score);
      reportScore(score);
    }
  };

  const restartGame = () => {
    setTargetTime(Math.floor(Math.random() * 51) + 10);
    setResult(null);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center h-full max-w-lg mx-auto">
      <h2 className="text-3xl font-display font-bold text-white mb-2">Cronómetro Humano</h2>
      
      <div className="my-8">
        <p className="text-gray-400 text-sm mb-2">Detén el reloj exactamente en:</p>
        <div className="text-6xl font-black text-neon-purple">
          {targetTime}s
        </div>
      </div>

      {!isPlaying && !result && (
        <button
          onClick={startGame}
          className="w-48 h-48 rounded-full border-4 border-neon-blue flex flex-col items-center justify-center bg-neon-blue/10 hover:bg-neon-blue/20 transition-all font-bold text-xl text-white"
        >
          <Timer className="w-12 h-12 mb-2" />
          INICIAR
        </button>
      )}

      {isPlaying && (
        <div className="relative w-full flex flex-col items-center">
            {/* Fake loader or timer that disappears */}
            <TimerHidingInfo startTime={startTime!} />
            
            <button
                onClick={stopTimer}
                className="mt-12 w-48 h-48 rounded-full border-4 border-red-500 flex flex-col items-center justify-center bg-red-500/10 hover:bg-red-500/20 transition-all font-bold text-xl text-white animate-pulse"
            >
                <span className="text-3xl">STOP</span>
            </button>
        </div>
      )}

      {result && (
        <div className="animate-in fade-in zoom-in duration-300">
           <div className="text-4xl font-mono text-white font-bold mb-4">{elapsed.toFixed(3)}s</div>
           <p className="text-neon-purple text-lg mb-8">{result}</p>
           <button
             onClick={restartGame}
             className="px-8 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-colors"
           >
             Intentar de nuevo
           </button>
        </div>
      )}
    </div>
  );
};

// Component to handle the "disappearing" timer visual
const TimerHidingInfo = ({ startTime }: { startTime: number }) => {
    const [displayTime, setDisplayTime] = useState('0.00');
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const diff = (now - startTime) / 1000;
            setDisplayTime(diff.toFixed(2));
            
            if (diff > 5) {
                setVisible(false);
            }
        }, 50);
        return () => clearInterval(interval);
    }, [startTime]);

    return (
        <div className={`text-6xl font-mono font-bold transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0 blur-xl'}`}>
            {displayTime}
        </div>
    );
};

export default HumanTimer;
