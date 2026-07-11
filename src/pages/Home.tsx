import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GameCard from '../components/GameCard';
import { gamesCatalog } from '../data/gamesCatalog';

const categories = ['Todos', 'Reflejos', 'Memoria', 'Precisión', 'Matemáticas', 'Lógica'];

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filteredGames = activeCategory === 'Todos' 
    ? gamesCatalog 
    : gamesCatalog.filter((g: any) => g.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#121212] text-white pt-24 flex flex-col">
      <Navbar />
      
      {/* Games Grid */}
      <section id="games" className="pb-24 relative flex-grow">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-6 flex flex-col items-start justify-start gap-4">
            <h2 className="text-2xl font-bold text-white font-display">Juegos recomendados</h2>
            
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                    activeCategory === cat 
                      ? 'bg-[#4ade80] text-black' 
                      : 'bg-[#252525] text-gray-300 hover:bg-[#333333] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <GameCard 
                key={game.id}
                {...game as any}
              />
            ))}
          </div>
        </div>
      </section>


      

      <Footer />
    </div>
  );
};

export default Home;
