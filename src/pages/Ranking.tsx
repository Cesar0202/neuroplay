import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import { motion } from 'framer-motion';
import { Trophy, Medal, Crown } from 'lucide-react';

const mockRanking = [
  { rank: 1, name: "NeonMaster", score: 15420, avatar: "N", change: "+2" },
  { rank: 2, name: "Cipher99", score: 14850, avatar: "C", change: "-1" },
  { rank: 3, name: "PixelQueen", score: 14200, avatar: "P", change: "+5" },
  { rank: 4, name: "GlitchUser", score: 13500, avatar: "G", change: "0" },
  { rank: 5, name: "SynthWave", score: 12800, avatar: "S", change: "+1" },
  { rank: 6, name: "ByteWarrior", score: 11200, avatar: "B", change: "-3" },
];

const Ranking = () => {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white">
      <Navbar />
      
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
            Ranking Global
          </h1>
          <p className="text-gray-400">Los mejores jugadores de NeuroPlay esta semana.</p>
        </div>

        {/* Podium */}
        <div className="flex items-end justify-center mb-20 gap-4">
          {/* 2nd Place */}
          <div className="flex flex-col items-center">
             <div className="mb-4 text-center">
               <div className="w-16 h-16 rounded-full bg-gray-300 border-4 border-gray-400 flex items-center justify-center font-bold text-2xl text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                 #{2}
               </div>
               <div className="mt-2 font-bold text-gray-300">Cipher99</div>
               <div className="text-xs text-gray-500">14,850 XP</div>
             </div>
             <motion.div 
               initial={{ height: 0 }} 
               animate={{ height: 150 }} 
               className="w-24 bg-gradient-to-t from-gray-800 to-gray-600 rounded-t-lg border-t border-gray-500 relative"
             >
               <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                 <Medal className="w-8 h-8 text-gray-300" />
               </div>
             </motion.div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center z-10">
             <div className="mb-4 text-center">
               <div className="w-20 h-20 rounded-full bg-yellow-400 border-4 border-yellow-200 flex items-center justify-center font-bold text-3xl text-black shadow-[0_0_30px_rgba(250,204,21,0.6)]">
                 <Crown className="w-10 h-10 text-black fill-current" />
               </div>
               <div className="mt-2 font-bold text-yellow-400 text-lg">NeonMaster</div>
               <div className="text-xs text-yellow-500/80 font-mono">15,420 XP</div>
             </div>
             <motion.div 
               initial={{ height: 0 }} 
               animate={{ height: 220 }} 
               className="w-28 bg-gradient-to-t from-yellow-900 to-yellow-600 rounded-t-lg border-t border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.2)] relative"
             >
               <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                 <Trophy className="w-12 h-12 text-yellow-200 fill-current animate-pulse-slow" />
               </div>
             </motion.div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center">
             <div className="mb-4 text-center">
               <div className="w-16 h-16 rounded-full bg-orange-700 border-4 border-orange-600 flex items-center justify-center font-bold text-2xl text-white shadow-[0_0_20px_rgba(194,65,12,0.3)]">
                 #{3}
               </div>
               <div className="mt-2 font-bold text-orange-400">PixelQueen</div>
               <div className="text-xs text-orange-500">14,200 XP</div>
             </div>
             <motion.div 
               initial={{ height: 0 }} 
               animate={{ height: 100 }} 
               className="w-24 bg-gradient-to-t from-orange-900 to-orange-700 rounded-t-lg border-t border-orange-600 relative"
             >
               <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                 <Medal className="w-8 h-8 text-orange-300" />
               </div>
             </motion.div>
          </div>
        </div>

        {/* List */}
        <div className="bg-[#05080F]/80 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden">
          <div className="grid grid-cols-4 p-4 border-b border-white/10 text-gray-400 font-medium text-sm uppercase tracking-wider">
            <div className="col-span-2">Jugador</div>
            <div className="text-center">Puntuación</div>
            <div className="text-right">Rango</div>
          </div>
          
          {mockRanking.slice(3).map((player, idx) => (
            <motion.div 
              key={player.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="grid grid-cols-4 p-4 items-center hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
            >
              <div className="col-span-2 flex items-center space-x-4">
                 <span className="font-mono text-gray-500">#{player.rank}</span>
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold">
                    {player.avatar}
                 </div>
                 <span className="font-bold text-white">{player.name}</span>
              </div>
              <div className="text-center font-mono text-neon-blue">
                {player.score.toLocaleString()}
              </div>
              <div className="text-right text-gray-400 text-sm">
                Top {(player.rank / 100).toFixed(1)}%
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Ranking;
