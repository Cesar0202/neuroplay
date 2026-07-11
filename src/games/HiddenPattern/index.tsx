import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { saveScore } from '../../utils/scoreStorage';
import GameStats from '../../components/GameStats';

const HiddenPattern = () => {
  const { reportScore } = useGame();
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [currentPattern, setCurrentPattern] = useState<number[]>([]);
  const [options, setOptions] = useState<number[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState(0);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    nextRound();
  };

  const nextRound = () => {
    const types = ['arithmetic', 'geometric', 'progressive', 'alternating', 'fibonacci'];
    const type = types[Math.floor(Math.random() * types.length)];
    let sequence: number[] = [];
    const length = 5; // Mostrar 4 números y 1 oculto para dar más contexto

    if (type === 'arithmetic') {
        const start = Math.floor(Math.random() * 15) + 1;
        const diff = Math.floor(Math.random() * 8) + 2;
        sequence = Array.from({length}, (_, i) => start + (i * diff));
    } else if (type === 'geometric') {
        const start = Math.floor(Math.random() * 5) + 1;
        const multiplier = Math.floor(Math.random() * 3) + 2; 
        sequence = Array.from({length}, (_, i) => start * Math.pow(multiplier, i));
    } else if (type === 'progressive') {
        // Segundo nivel: diferencia aumenta (+1, +2, +3...)
        const start = Math.floor(Math.random() * 10) + 1;
        const baseDiff = Math.floor(Math.random() * 3) + 1;
        const diffIncrement = Math.floor(Math.random() * 2) + 1;
        sequence.push(start);
        let current = start;
        let diff = baseDiff;
        for (let i = 1; i < length; i++) {
            current += diff;
            sequence.push(current);
            diff += diffIncrement;
        }
    } else if (type === 'alternating') {
        // Alterno: suma X, resta Y (+5, -2, +5, -2...)
        const start = Math.floor(Math.random() * 20) + 10;
        const add = Math.floor(Math.random() * 8) + 3;
        const sub = Math.floor(Math.random() * (add - 1)) + 1; 
        sequence.push(start);
        let current = start;
        for (let i = 1; i < length; i++) {
            if (i % 2 !== 0) {
                current += add;
            } else {
                current -= sub;
            }
            sequence.push(current);
        }
    } else if (type === 'fibonacci') {
        // Tercer nivel: a(n) = a(n-1) + a(n-2)
        const a = Math.floor(Math.random() * 3) + 1;
        const b = Math.floor(Math.random() * 3) + 1;
        sequence.push(a, b);
        for (let i = 2; i < length; i++) {
            sequence.push(sequence[i-1] + sequence[i-2]);
        }
    }
    
    const answer = sequence[length - 1];
    setCorrectAnswer(answer);
    setCurrentPattern(sequence.slice(0, length - 1)); // Show all except last

    // Generate options and ensure they are unique
    const wrong1 = answer + Math.floor(Math.random() * 5) + 1;
    const wrong2 = answer - (Math.floor(Math.random() * 3) + 1);
    const wrong3 = type === 'geometric' ? answer * 2 : answer + 10;
    
    let optionsSet = new Set([answer, wrong1, wrong2, wrong3]);
    while(optionsSet.size < 4) {
        optionsSet.add(answer + Math.floor(Math.random() * 20) - 10);
    }
    setOptions(Array.from(optionsSet).sort(() => Math.random() - 0.5));
  };

  const handleOptionClick = (option: number) => {
    if (option === correctAnswer) {
      setScore(score + 100);
      nextRound();
    } else {
      // Game Over or Penalty? Let's do Penalty for continuous play
      setScore(Math.max(0, score - 50));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 h-full">
      <h2 className="text-3xl font-display font-bold text-white mb-8">Patrón Oculto</h2>
      
      {!isPlaying ? (
         <div className="text-center max-w-md">
            <p className="text-gray-400 mb-8 text-lg">Descifra la regla matemática (sumas, multiplicaciones o secuencias alternas) y descubre el valor oculto para continuar.</p>
            <button onClick={startGame} className="px-8 py-4 bg-neon-blue font-bold rounded-xl hover:scale-105 transition-transform">COMENZAR</button>
         </div>
      ) : (
         <div className="w-full max-w-md text-center">
            <div className="flex justify-center mb-8">
               <GameStats score={score} />
            </div>
            
            <div className="flex items-center justify-center space-x-4 mb-12">
               {currentPattern.map((num, i) => (
                  <motion.div 
                    key={i}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="w-16 h-16 flex items-center justify-center bg-white/10 rounded-xl text-2xl font-bold text-white border border-white/20"
                  >
                    {num}
                  </motion.div>
               ))}
               <div className="w-16 h-16 flex items-center justify-center bg-neon-purple/20 rounded-xl text-2xl font-bold text-neon-purple border border-neon-purple border-dashed animate-pulse">
                 ?
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               {options.map((opt, i) => (
                  <button 
                    key={i}
                    onClick={() => handleOptionClick(opt)}
                    className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-xl font-bold text-white transition-all"
                  >
                    {opt}
                  </button>
               ))}
            </div>
            
             <button onClick={() => { setIsPlaying(false); reportScore(score); saveScore('hidden-pattern', score); }} className="mt-8 text-gray-400 underline">Terminar</button>
         </div>
      )}
    </div>
  );
};

export default HiddenPattern;
