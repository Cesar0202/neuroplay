import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { saveScore } from '../../utils/scoreStorage';

const SEQUENCE_COLORS = ['red', 'green', 'blue', 'yellow'];
const BLOCK_STYLES: Record<string, string> = {
  red: 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]',
  green: 'bg-green-500 shadow-[0_0_20px_rgba(34,199,89,0.5)]',
  blue: 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]',
  yellow: 'bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)]'
};

const SimonSays = () => {
  const { reportScore } = useGame();
  const [isPlaying, setIsPlaying] = useState(false);
  const [sequence, setSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [activeBlock, setActiveBlock] = useState<string | null>(null);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [score, setScore] = useState(0);

  const startGame = () => {
    setIsPlaying(true);
    setSequence([]);
    setUserSequence([]);
    setScore(0);
    addToSequence([]);
  };

  const addToSequence = (currentSeq: string[]) => {
    const nextColor = SEQUENCE_COLORS[Math.floor(Math.random() * SEQUENCE_COLORS.length)];
    const newSeq = [...currentSeq, nextColor];
    setSequence(newSeq);
    setUserSequence([]);
    setIsShowingSequence(true);
    playSequence(newSeq);
  };

  const playSequence = async (seq: string[]) => {
    for (let i = 0; i < seq.length; i++) {
       await new Promise(resolve => setTimeout(resolve, 500));
       setActiveBlock(seq[i]);
       // Play sound ideally
       await new Promise(resolve => setTimeout(resolve, 500));
       setActiveBlock(null);
    }
    setIsShowingSequence(false);
  };

  const handleBlockClick = (color: string) => {
    if (!isPlaying || isShowingSequence) return;

    setActiveBlock(color);
    setTimeout(() => setActiveBlock(null), 200);

    const newUserSeq = [...userSequence, color];
    setUserSequence(newUserSeq);

    // Validate
    const checkIndex = newUserSeq.length - 1;
    if (newUserSeq[checkIndex] !== sequence[checkIndex]) {
       // Lost
       gameOver();
    } else {
       // Correct so far
       if (newUserSeq.length === sequence.length) {
           // Round complete
           const newScore = score + 1;
           setScore(newScore);
           setTimeout(() => addToSequence(sequence), 1000);
       }
    }
  };
  
  const gameOver = () => {
     setIsPlaying(false);
     saveScore('simon-says', score);
     reportScore(score);
     // Show feedback? handled by 'isPlaying' becoming false and showing Start button + score
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 h-full">
      <h2 className="text-3xl font-display font-bold text-white mb-8">Secuencia de Colores</h2>

      {!isPlaying ? (
        <div className="text-center">
            {score > 0 && <div className="text-2xl font-bold text-neon-purple mb-4">Puntuación Final: {score}</div>}
            <button
                onClick={startGame}
                className="px-8 py-4 bg-neon-blue text-black font-bold rounded-xl hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)]"
            >
                <Play className="w-5 h-5 inline-block mr-2" />
                {score > 0 ? 'Jugar de Nuevo' : 'Comenzar'}
            </button>
        </div>
      ) : (
        <div className="text-center">
           <div className="text-xl font-mono text-neon-blue mb-8">Ronda: {sequence.length}</div>
           
           <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              {SEQUENCE_COLORS.map((color) => (
                 <motion.button
                    key={color}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBlockClick(color)}
                    className={`w-32 h-32 rounded-2xl transition-all duration-100 ${
                       activeBlock === color 
                         ? `${BLOCK_STYLES[color]} scale-105 brightness-125` 
                         : 'bg-white/10 hover:bg-white/15 opacity-80'
                    }`} // Simplified styles slightly when inactive
                 />
              ))}
           </div>
           
           <div className="mt-8 text-sm text-gray-500 h-6">
              {isShowingSequence ? 'Memoriza la secuencia...' : 'Tu turno'}
           </div>
        </div>
      )}
    </div>
  );
};

export default SimonSays;
