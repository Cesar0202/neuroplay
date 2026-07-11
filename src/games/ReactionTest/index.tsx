import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, AlertCircle, RotateCcw } from 'lucide-react';
import { saveScore } from '../../utils/scoreStorage';

type GameState = 'start' | 'waiting' | 'ready' | 'result' | 'early';

const ReactionTest = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [attempts, setAttempts] = useState<number[]>([]);
  
  const timerRef = useRef<number | null>(null);

  const startGame = () => {
    setGameState('waiting');
    const randomDelay = Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds
    
    timerRef.current = window.setTimeout(() => {
      setGameState('ready');
      setStartTime(Date.now());
    }, randomDelay);
  };

  const handleClick = () => {
    if (gameState === 'waiting') {
      if (timerRef.current) clearTimeout(timerRef.current);
      setGameState('early');
      return;
    }

    if (gameState === 'ready') {
      const endTime = Date.now();
      const time = endTime - startTime;
      setReactionTime(time);
      const newAttempts = [...attempts, time];
      setAttempts(newAttempts);
      setGameState('result');
      saveScore('reaction-test', time, 'asc');
    }
  };



  const average = attempts.length > 0 
    ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length) 
    : 0;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      
      {/* Game Area */}
      <motion.div 
        className={`w-full max-w-2xl aspect-video rounded-3xl cursor-pointer flex flex-col items-center justify-center text-center p-8 transition-colors duration-200 select-none relative overflow-hidden
          ${gameState === 'start' ? 'bg-[#1E1E1E] hover:bg-[#252525] border border-[#2C2C2C]' : ''}
          ${gameState === 'waiting' ? 'bg-red-500 text-white' : ''}
          ${gameState === 'ready' ? 'bg-green-500 text-black' : ''}
          ${gameState === 'result' ? 'bg-[#1E1E1E] border border-[#2C2C2C]' : ''}
          ${gameState === 'early' ? 'bg-[#1E1E1E] border border-[#2C2C2C]' : ''}
        `}
        onClick={gameState === 'start' ? startGame : handleClick}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Background Pulse for Waiting */}
        {gameState === 'waiting' && (
             <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
        )}

        <AnimatePresence mode="wait">
          {gameState === 'start' && (
            <motion.div 
              key="start"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
            >
              <h2 className="text-4xl font-bold text-white mb-2">Reaction Test</h2>
              <p className="text-gray-400 text-lg mb-8">Haz clic cuando la pantalla se ponga verde.</p>
              <div className="px-6 py-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-lg inline-block transition-colors">
                Click para Empezar
              </div>
            </motion.div>
          )}

          {gameState === 'waiting' && (
            <motion.div 
              key="waiting"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
            >
               <h3 className="text-3xl font-bold text-red-500">Espera el verde...</h3>
            </motion.div>
          )}

          {gameState === 'ready' && (
            <motion.div 
              key="ready"
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
               <h3 className="text-5xl font-black text-black uppercase tracking-widest">¡AHORA!</h3>
               <p className="text-black/60 font-medium">Click rápido</p>
            </motion.div>
          )}

          {gameState === 'result' && (
            <motion.div 
              key="result"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="space-y-4"
            >
               <div className="text-6xl font-black text-neon-blue font-mono mb-2">
                 {reactionTime} <span className="text-2xl text-gray-400">ms</span>
               </div>
               <p className="text-gray-300 text-xl">
                 {reactionTime < 200 ? 'Excelente tiempo' : reactionTime < 300 ? 'Buen tiempo' : 'Puedes mejorar'}
              </p>
              <button 
                onClick={(e) => { e.stopPropagation(); startGame(); }}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center gap-2 mx-auto transition-all"
              >
                <RotateCcw className="w-4 h-4" /> Intentar de nuevo
              </button>
            </motion.div>
          )}

          {gameState === 'early' && (
            <motion.div 
              key="early"
              title="Too Soon"
              animate={{ x: [-10, 10, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
            >
                <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-yellow-500 mb-2">¡Muy rápido!</h3>
                <p className="text-gray-400 mb-6">Espera a que se ponga verde.</p>
                <button 
                onClick={(e) => { e.stopPropagation(); startGame(); }}
                className="px-8 py-3 bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 border border-yellow-500/50 rounded-full font-bold"
              >
                Reintentar
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Mini Stats */}
      {attempts.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-8 text-center opacity-60">
            <div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">Promedio</div>
                <div className="text-2xl font-mono text-white">{average} ms</div>
            </div>
            <div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">Mejor</div>
                <div className="text-2xl font-mono text-neon-blue">{Math.min(...attempts)} ms</div>
            </div>
          </div>
      )}

    </div>
  );
};

export default ReactionTest;
