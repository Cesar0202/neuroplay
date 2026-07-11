import { useState, useEffect } from 'react';
import { Reorder } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { saveScore } from '../../utils/scoreStorage';
import { RefreshCw } from 'lucide-react';
import GameStats from '../../components/GameStats';

// Removed ununsed Shuffle
const OrderNumbers = () => {
  const { reportScore } = useGame();
  const [isPlaying, setIsPlaying] = useState(false);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  const setGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(60);
    generateNewSet();
  };

  const generateNewSet = () => {
    // Generate 5 random unique numbers
    const newSet = new Set<number>();
    while(newSet.size < 5) {
      newSet.add(Math.floor(Math.random() * 100));
    }
    setNumbers(Array.from(newSet));
  };

  const checkOrder = () => {
    // Check if sorted ascending
    const sorted = [...numbers].sort((a,b) => a - b);
    const isCorrect = numbers.every((val, index) => val === sorted[index]);
    
    if (isCorrect) {
       // Correct!
       setScore(prev => prev + 20);
       generateNewSet();
    } else {
       // Wrong
       setScore(prev => Math.max(0, prev - 10));
       // Shake animation or error feedback could go here
    }
  };

  // Drag and drop handler provided by Reorder component
  const handleReorder = (newOrder: number[]) => {
      setNumbers(newOrder);
  };

  useEffect(() => {
     if (isPlaying) {
         const interval = setInterval(() => {
             setTimeLeft(prev => {
                 if (prev <= 1) {
                     clearInterval(interval);
                     setIsPlaying(false);
                     saveScore('order-numbers', score);
                     reportScore(score);
                     return 0;
                 }
                 return prev - 1;
             });
         }, 1000);
         return () => clearInterval(interval);
     }
  }, [isPlaying]);

  return (
    <div className="flex flex-col items-center justify-center p-8 h-full space-y-8">
      <h2 className="text-3xl font-display font-bold text-white mb-4">Ordena Números</h2>
      
      {!isPlaying ? (
         <div className="text-center">
             <p className="text-gray-400 mb-8">Arrastra los números para ordenarlos de MENOR a MAYOR.</p>
             <button onClick={setGame} className="px-8 py-4 bg-neon-purple text-white font-bold rounded-xl shadow-lg hover:shadow-neon-purple/50 transition-all">
                 JUGAR
             </button>
         </div>
      ) : (
         <div className="w-full max-w-md flex flex-col items-center">
             <GameStats score={score} time={timeLeft} />

             <div className="bg-white/5 border border-white/10 rounded-3xl p-8 w-full mt-8">
                 <Reorder.Group axis="y" values={numbers} onReorder={handleReorder} className="space-y-4">
                     {numbers.map((num) => (
                         <Reorder.Item key={num} value={num} className="cursor-grab active:cursor-grabbing">
                             <div className="bg-white/10 hover:bg-white/20 border border-white/5 rounded-xl p-4 text-center text-2xl font-bold text-white shadow-sm select-none">
                                 {num}
                             </div>
                         </Reorder.Item>
                     ))}
                 </Reorder.Group>
             </div>

             <button 
                onClick={checkOrder}
                className="mt-8 px-12 py-4 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl shadow-lg transition-all w-full md:w-auto"
             >
                 VERIFICAR ORDEN
             </button>
         </div>
      )}
    </div>
  );
};

export default OrderNumbers;
