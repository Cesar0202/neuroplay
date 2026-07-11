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

      {/* Bottom Left Tag (Difficulty) */}
      <div className={`absolute bottom-0 left-0 px-2 py-0.5 text-[11px] font-bold rounded-tr-lg z-20 ${difficultyColor}`}>
        {difficultyLabel}
      </div>

      {/* Hover Overlay with Title */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col items-center justify-center p-4 text-center">
        <h3 className="text-xl font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          {title}
        </h3>
        <p className="text-sm text-gray-300 line-clamp-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
          {description}
        </p>
      </div>
    </Link>
  );
};

export default GameCard;
