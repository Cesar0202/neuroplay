import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Brain, RotateCcw, Trophy, Trash2,
    Cat, Dog, Ghost, Gamepad2, Rocket, Zap, Star, Moon, 
    Clover, Diamond, Shield, Sword, Heart, Music, Sun, Cloud, 
    Snowflake, Plane, Car, Bike, Anchor, Bell, Camera, Gift, 
    Key, Lock, Umbrella, Watch, Crown, Bug, Coffee, Flower
} from 'lucide-react';
import { saveScore } from '../../utils/scoreStorage';
import GameStats from '../../components/GameStats';

const ALL_ICONS = [
    Cat, Dog, Ghost, Gamepad2, Rocket, Zap, Star, Moon, 
    Clover, Diamond, Shield, Sword, Heart, Music, Sun, Cloud, 
    Snowflake, Plane, Car, Bike, Anchor, Bell, Camera, Gift, 
    Key, Lock, Umbrella, Watch, Crown, Bug, Coffee, Flower
];

// Difficulty settings
const DIFFICULTIES = {
    easy: { name: 'Fácil', pairs: 8, cols: 'grid-cols-4', size: 'max-w-lg' },    // 4x4 = 16 cartas (4 filas)
    medium: { name: 'Medio', pairs: 16, cols: 'grid-cols-8', size: 'max-w-4xl' }, // 8x4 = 32 cartas (4 filas)
    hard: { name: 'Difícil', pairs: 25, cols: 'grid-cols-10', size: 'max-w-6xl' } // 10x5 = 50 cartas (5 filas)
};

type Difficulty = 'easy' | 'medium' | 'hard';

interface CardData {
    id: number;
    IconComponent: any;
    matched: boolean;
    flipped: boolean;
    isTrashed: boolean;
}

const MemoryCards = () => {
    const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
    const [cards, setCards] = useState<CardData[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [gameWon, setGameWon] = useState(false);

    useEffect(() => {
        if (difficulty) {
            initializeGame(difficulty);
        }
    }, [difficulty]);

    const initializeGame = (diff: Difficulty) => {
        const numPairs = DIFFICULTIES[diff].pairs;
        const selectedIcons = [...ALL_ICONS].sort(() => Math.random() - 0.5).slice(0, numPairs);
        
        const shuffled = [...selectedIcons, ...selectedIcons]
            .sort(() => Math.random() - 0.5)
            .map((IconComponent, index) => ({ 
                id: index, 
                IconComponent, 
                matched: false, 
                flipped: false,
                isTrashed: false
            }));
            
        setCards(shuffled);
        setFlippedCards([]);
        setMoves(0);
        setGameWon(false);
    };

    const handleCardClick = (index: number) => {
        if (flippedCards.length === 2 || cards[index].flipped || cards[index].matched || cards[index].isTrashed) return;

        const newCards = [...cards];
        newCards[index].flipped = true;
        setCards(newCards);
        
        const newFlipped = [...flippedCards, index];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            const nextMoves = moves + 1;
            setMoves(nextMoves);
            checkForMatch(newFlipped, newCards, nextMoves);
        }
    };

    const checkForMatch = (currentFlipped: number[], currentCards: CardData[], finalMoves: number) => {
        const [first, second] = currentFlipped;
        if (currentCards[first].IconComponent === currentCards[second].IconComponent) {
            // Match found!
            setTimeout(() => {
                const newCards = [...currentCards];
                newCards[first].matched = true;
                newCards[second].matched = true;
                setCards(newCards);
                setFlippedCards([]);
                
                // Trigger trash animation after a tiny delay
                setTimeout(() => {
                    setCards(prev => {
                        const trashed = [...prev];
                        trashed[first].isTrashed = true;
                        trashed[second].isTrashed = true;
                        
                        if (trashed.every(c => c.isTrashed)) {
                            setTimeout(() => {
                                setGameWon(true);
                                saveScore('memory-cards', finalMoves, 'asc');
                            }, 600);
                        }
                        return trashed;
                    });
                }, 400);

            }, 200); // Wait slightly to show both cards before glowing green
        } else {
            // No match
            setTimeout(() => {
                const newCards = [...currentCards];
                newCards[first].flipped = false;
                newCards[second].flipped = false;
                setCards(newCards);
                setFlippedCards([]);
            }, 500); // Reduced from 1000ms to 500ms
        }
    };

    if (!difficulty) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-4">
                <div className="bg-[#1E1E1E] p-8 rounded-2xl border border-[#2C2C2C] max-w-md w-full text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">Memory Cards</h2>
                    <p className="text-gray-400 mb-8">Encuentra todos los pares antes de que se acabe la paciencia.</p>
                    
                    <div className="space-y-4">
                        {(Object.keys(DIFFICULTIES) as Difficulty[]).map(diff => (
                            <button
                                key={diff}
                                onClick={() => setDifficulty(diff)}
                                className="w-full py-4 px-6 bg-[#252525] hover:bg-[#2C2C2C] border border-[#3C3C3C] rounded-xl text-white font-bold transition-colors flex items-center justify-between"
                            >
                                <span className="text-lg">{DIFFICULTIES[diff].name}</span>
                                <span className="text-sm text-gray-500 bg-[#1E1E1E] px-3 py-1 rounded-full">{DIFFICULTIES[diff].pairs * 2} cartas</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className={`flex justify-between items-center w-full ${DIFFICULTIES[difficulty].size} mb-6 text-white`}>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setDifficulty(null)}
                        className="p-2 bg-[#252525] hover:bg-[#2C2C2C] border border-[#3C3C3C] rounded-lg text-gray-400 hover:text-white transition-colors"
                        title="Cambiar Dificultad"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                    <div className="font-bold text-lg">{DIFFICULTIES[difficulty].name}</div>
                </div>
            </div>
            
            <GameStats moves={moves} />

            {gameWon ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center bg-[#1E1E1E] border border-[#2C2C2C] p-8 rounded-2xl z-10 relative">
                    <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-white mb-2">¡Completado!</h2>
                    <p className="text-gray-300 mb-6 text-lg">Lo lograste en {moves} intentos.</p>
                    <div className="flex gap-4 justify-center">
                        <button onClick={() => setDifficulty(null)} className="px-6 py-3 bg-[#252525] hover:bg-[#2C2C2C] border border-[#3C3C3C] text-white font-bold rounded-lg transition-colors">
                            Cambiar Dificultad
                        </button>
                        <button onClick={() => initializeGame(difficulty)} className="px-6 py-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-lg inline-flex items-center gap-2 transition-colors">
                            <RotateCcw className="w-5 h-5" /> Jugar de nuevo
                        </button>
                    </div>
                </motion.div>
            ) : (
                <div className="flex flex-col lg:flex-row items-center justify-center w-full flex-1 gap-8">
                    <div className={`grid ${DIFFICULTIES[difficulty].cols} gap-2 sm:gap-3 lg:gap-4 w-full ${DIFFICULTIES[difficulty].size}`}>
                        {cards.map((card, index) => (
                            <div key={card.id} className="aspect-square relative">
                                <AnimatePresence>
                                    {!card.isTrashed && (
                                        <motion.div
                                            key={`card-anim-${card.id}`}
                                            exit={{ scale: 0, opacity: 0, rotate: 180 }}
                                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                                            className="absolute inset-0 cursor-pointer preserve-3d"
                                            onClick={() => handleCardClick(index)}
                                            animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
                                            style={{ transformStyle: 'preserve-3d' }}
                                        >
                                            {/* Front of card */}
                                            <div className="absolute inset-0 bg-[#252525] hover:bg-[#2C2C2C] border border-[#3C3C3C] rounded-xl flex items-center justify-center backface-hidden transition-colors">
                                                <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-[#3C3C3C]" />
                                            </div>
                                            
                                            {/* Back of card */}
                                            <div 
                                                className={`absolute inset-0 bg-[#3C3C3C] border border-[#4C4C4C] rounded-xl flex items-center justify-center backface-hidden transition-colors duration-300
                                                    ${card.matched ? 'bg-green-500/20 border-green-500/50' : ''}
                                                `} 
                                                style={{ transform: 'rotateY(180deg)' }}
                                            >
                                                <card.IconComponent className={`w-8 h-8 sm:w-10 sm:h-10 ${card.matched ? 'text-green-400' : 'text-white'}`} />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                
                                {/* Placeholder for trashed card */}
                                {card.isTrashed && (
                                    <div className="absolute inset-0 bg-[#121212] rounded-xl border border-[#1A1A1A]"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemoryCards;
