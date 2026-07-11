
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, Zap, Brain, Target, Star } from 'lucide-react';

const Dashboard = () => {
  const stats = {
    level: 12,
    xp: 8450,
    nextLevelXp: 10000,
    completion: 84.5,
    reactionTime: 245, // ms
    wpm: 68,
    accuracy: 94.2, // %
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white">
      <Navbar />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Card */}
          <section className="glass-panel p-8 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-neon-blue/20 to-transparent pointer-events-none" />
            
            <div className="relative z-10 w-32 h-32 rounded-full border-4 border-neon-blue p-1 mb-6 shadow-[0_0_30px_rgba(0,229,255,0.4)]">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                alt="Avatar" 
                className="w-full h-full rounded-full bg-gray-800"
              />
              <div className="absolute bottom-2 right-2 w-8 h-8 bg-neon-purple rounded-full flex items-center justify-center border-2 border-[#0B0F1A] text-xs font-bold shadow-lg">
                12
              </div>
            </div>

            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">
              Alex Neuro
            </h2>
            <p className="text-neon-blue font-mono mb-8">@alex_neuro_01</p>

            {/* XP Bar */}
            <div className="w-full mb-8">
              <div className="flex justify-between text-xs text-gray-400 mb-2 uppercase tracking-wide">
                <span>XP Actual</span>
                <span>Siguiente Nivel</span>
              </div>
              <div className="h-4 bg-gray-800 rounded-full overflow-hidden relative border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.completion}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-neon-blue to-purple-600 relative"
                >
                    <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white/50 shadow-[0_0_10px_white]"></div>
                </motion.div>
              </div>
              <div className="mt-2 text-right text-xs font-mono text-gray-500">
                {stats.xp} / {stats.nextLevelXp} XP
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full">
              {[
                  { label: "Partidas", value: "142", icon: Activity },
                  { label: "Victorias", value: "89", icon: Star },
                  { label: "H. Juego", value: "24h", icon: Target },
              ].map((item, i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-3 border border-white/5 flex flex-col items-center">
                      <item.icon className="w-5 h-5 text-gray-400 mb-2" />
                      <span className="text-lg font-bold text-white">{item.value}</span>
                      <span className="text-[10px] uppercase text-gray-500">{item.label}</span>
                  </div>
              ))}
            </div>
          </section>

          {/* Stats & Charts */}
          <section className="lg:col-span-2 space-y-8">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {[
                 { label: "Tiempo Reacción", value: `${stats.reactionTime}ms`, change: "-12ms", color: "text-neon-blue", icon: Zap },
                 { label: "Velocidad (WPM)", value: stats.wpm, change: "+3", color: "text-neon-purple", icon: Activity },
                 { label: "Precisión Media", value: `${stats.accuracy}%`, change: "+1.2%", color: "text-green-400", icon: Target },
               ].map((stat, i) => (
                 <motion.div 
                   key={i}
                   whileHover={{ y: -5 }}
                   className="glass-panel p-6 border-l-4 border-l-neon-blue bg-[#0F1424]" // Custom border color based on index
                 >
                   <div className="flex justify-between items-start mb-4">
                      <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded bg-white/5 ${stat.change.startsWith('+') ? 'text-green-400' : 'text-neon-blue'}`}>
                        {stat.change}
                      </span>
                   </div>
                   <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                   <p className="text-gray-400 text-sm">{stat.label}</p>
                 </motion.div>
               ))}
            </div>

            {/* Main Chart Area (Simulated) */}
            <div className="glass-panel p-8 relative min-h-[300px]">
               <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                 <TrendingUp className="w-5 h-5 mr-2 text-neon-blue" />
                 Evolución de Rendimiento
               </h3>
               
               {/* Simple CSS Chart */}
               <div className="flex items-end justify-between h-48 space-x-2 px-4">
                 {[40, 65, 55, 80, 72, 90, 85].map((h, i) => (
                   <div key={i} className="flex-1 flex flex-col justify-end group cursor-pointer">
                     <div className="relative w-full bg-white/5 rounded-t-lg overflow-hidden border-t border-x border-white/10 group-hover:bg-white/10 transition-all custom-chart-bar" style={{ height: `${h}%` }}>
                       <motion.div 
                         initial={{ height: 0 }}
                         animate={{ height: '100%' }}
                         transition={{ delay: i * 0.1, duration: 1 }}
                         className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-neon-blue/20 to-neon-purple/50 opacity-50 group-hover:opacity-80 transition-opacity"
                       />
                       <div className="absolute top-0 left-0 w-full h-1 bg-neon-blue shadow-[0_0_10px_#00E5FF]"></div>
                     </div>
                     <span className="text-xs text-center text-gray-500 mt-2 font-mono">
                       {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][i]}
                     </span>
                   </div>
                 ))}
               </div>
            </div>

            {/* Achievements Snippet */}
            <div className="glass-panel p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                 <StartIcon className="w-5 h-5 mr-2 text-yellow-500" />
                 Logros Recientes
               </h3>
               <div className="space-y-4">
                 {[
                   { title: "Mente Maestra", desc: "Completa 5 juegos seguidos sin fallar", icon: Brain, color: "text-purple-400" },
                   { title: "Velocista", desc: "Alcanza 80 WPM en Typing Speed", icon: Zap, color: "text-yellow-400" },
                 ].map((ach, i) => (
                   <div key={i} className="flex items-center p-4 bg-white/5 rounded-xl border border-white/5">
                     <div className={`p-3 rounded-full bg-white/5 mr-4 ${ach.color}`}>
                       <ach.icon className="w-6 h-6" />
                     </div>
                     <div>
                       <h4 className="font-bold text-white">{ach.title}</h4>
                       <p className="text-sm text-gray-400">{ach.desc}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// StartIcon alias
const StartIcon = Star; 

export default Dashboard;
