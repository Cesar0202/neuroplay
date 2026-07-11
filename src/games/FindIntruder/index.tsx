import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { saveScore } from '../../utils/scoreStorage';
import { Play } from 'lucide-react';
import GameStats from '../../components/GameStats';

const FindIntruder = () => {
  const { reportScore } = useGame();
  const [isPlaying, setIsPlaying] = useState(false);
  const [items, setItems] = useState<string[]>([]);
  const [intruderIndex, setIntruderIndex] = useState(-1);
  const [score, setScore] = useState(0);

  const startRound = () => {
    const pairs = [
      ['O', 'Q'], ['C', 'G'], ['P', 'R'], ['m', 'n'], 
      ['V', 'W'], ['E', 'F'], ['B', '8'], ['Z', '2'],
      ['b', 'd'], ['p', 'q'], ['u', 'v'], ['x', 'y']
    ];
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    const actualBase = Math.random() > 0.5 ? pair[0] : pair[1];
    const actualDiff = actualBase === pair[0] ? pair[1] : pair[0];
    
    const count = 50; // 10 columns * 5 rows
    const list = new Array(count).fill(actualBase);
    const pos = Math.floor(Math.random() * count);
    list[pos] = actualDiff;
    
    setItems(list);
    setIntruderIndex(pos);
  };

  const handleItemClick = (index: number) => {
    if (index === intruderIndex) {
      setScore(score + 10);
      startRound();
    } else {
      setScore(Math.max(0, score - 5));
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    startRound();
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 h-full">
      <h2 className="text-3xl font-display font-bold text-white mb-8">Encuentra el Intruso</h2>
      
      {!isPlaying ? (
         <div className="text-center max-w-md">
            <p className="text-gray-400 mb-8 text-lg">Encuentra el carácter distinto escondido entre un mar de letras y números similares lo más rápido que puedas.</p>
            <button onClick={startGame} className="px-8 py-4 bg-neon-blue font-bold rounded-xl hover:scale-105 transition-transform"><Play className="inline mr-2"/> JUGAR</button>
         </div>
      ) : (
         <>
         <div className="flex justify-center mb-4">
             <GameStats score={score} />
         </div>
         <div className="grid grid-cols-10 gap-2 mt-4 max-w-4xl mx-auto">
            {items.map((item, i) => (
                <button 
                   key={i} 
                   onClick={() => handleItemClick(i)}
                   className="w-10 h-10 md:w-12 md:h-12 bg-white/5 hover:bg-white/10 rounded-lg text-xl md:text-2xl font-bold flex items-center justify-center text-white transition-all shadow-md active:scale-95"
                >
                   {item}
                </button>
            ))}
         </div>
         <button onClick={() => { setIsPlaying(false); reportScore(score); saveScore('find-intruder', score); }} className="mt-8 text-red-400 underline hover:text-red-300">Terminar</button>
         </>
      )}
    </div>
  );
};

export default FindIntruder;
