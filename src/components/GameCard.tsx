import { Link } from 'react-router-dom';

interface GameCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  icon: string | React.ElementType; 
  color: string;
  backgroundImage?: string;
}

const GameCard: React.FC<GameCardProps> = ({ id, title, description, difficulty, icon: Icon, backgroundImage }) => {
  const difficultyLabel = {
    Easy: 'Fácil',
    Medium: 'Medio',
    Hard: 'Difícil',
  }[difficulty];

  const difficultyColor = {
    Easy: 'bg-[#4ade80] text-black',
    Medium: 'bg-[#facc15] text-black',
    Hard: 'bg-[#f87171] text-black',
  }[difficulty];

  return (
    <Link 
      to={`/play/${id}`}
      className="group relative flex flex-col rounded-xl overflow-hidden bg-[#1E1E1E] transition-all h-[200px] hover:ring-2 hover:ring-white/20"
    >
      {/* Background Image Layer */}
      {backgroundImage ? (
        <div className="absolute inset-0 z-0">
          <img 
            src={backgroundImage} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[#252525] z-0" />
      )}

      {/* Top Left Tag (Lightning Icon equivalent) */}
      <div className="absolute top-0 left-0 bg-[#4ade80] text-black p-1 rounded-br-lg z-20">
        {typeof Icon === 'string' ? (
          <img src={Icon} alt={title} className="w-4 h-4" />
        ) : (
          <Icon className="w-4 h-4" />
        )}
      </div>

      {/* Bottom Gradient for extra readability */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none" />

      {/* Bottom Left Tag (Difficulty) */}
      <div className={`absolute bottom-3 left-3 px-2 py-1 text-[11px] font-bold rounded z-20 shadow-lg ${difficultyColor}`}>
        {difficultyLabel}
      </div>

      {/* Persistent Title (Bottom Right) */}
      <div className="absolute bottom-3 right-3 z-20 max-w-[70%]">
        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 shadow-xl">
          <h3 className="text-[15px] font-bold text-white text-right leading-tight tracking-wide">
            {title}
          </h3>
        </div>
      </div>

      {/* Hover Overlay with Description */}
      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 flex flex-col items-center justify-center p-4 text-center">
        <h3 className="text-lg font-bold text-white mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          {title}
        </h3>
        <p className="text-sm text-gray-300 line-clamp-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
          {description}
        </p>
      </div>
    </Link>
  );
};

export default GameCard;
