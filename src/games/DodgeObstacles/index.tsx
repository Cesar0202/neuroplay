import { useState, useRef, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { saveScore } from '../../utils/scoreStorage';
import { Play } from 'lucide-react';
import GameStats from '../../components/GameStats';

const DodgeObstacles = () => {
  const { reportScore } = useGame();
  const [isPlaying, setIsPlaying] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const isPlayingRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scoreRef = useRef(0);
  const playerXRef = useRef(0);
  const obstaclesRef = useRef<{ x: number; y: number; speed: number }[]>([]);
  const animationFrameRef = useRef(0);
  const keysRef = useRef({ left: false, right: false });

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = true;
          if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = true;
      };
      const handleKeyUp = (e: KeyboardEvent) => {
          if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = false;
          if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = false;
      };
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      return () => {
          window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('keyup', handleKeyUp);
      };
  }, []);

  const startGame = () => {
    setIsPlaying(true);
    isPlayingRef.current = true;
    scoreRef.current = 0;
    setDisplayScore(0);
    obstaclesRef.current = [];
    playerXRef.current = 150; // Center
    
    // Clear canvas and set exact logical size to match CSS size
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      playerXRef.current = canvas.width / 2 - 20; // Exact Center
    }

    loop();
  };

  const loop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update Player position via Keyboard
    if (keysRef.current.left) playerXRef.current -= 6;
    if (keysRef.current.right) playerXRef.current += 6;
    playerXRef.current = Math.max(0, Math.min(playerXRef.current, canvas.width - 40));

    // Spawn obstacles (Starts slow, gets faster)
    const spawnChance = 0.015 + (scoreRef.current * 0.00002);
    if (Math.random() < spawnChance) {
       obstaclesRef.current.push({
           x: Math.random() * (canvas.width - 40),
           y: -50,
           speed: 2 + (scoreRef.current * 0.001)
       });
    }

    // Update Obstacles
    obstaclesRef.current.forEach(obs => {
        obs.y += obs.speed;
        
        // Draw Obstacle (Red Blocks)
        ctx.fillStyle = '#ef4444'; // red-500
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 10;
        ctx.fillRect(obs.x, obs.y, 40, 40);
        ctx.shadowBlur = 0;

        // Collision Check
        // Player is 40x40 square at bottom
        const playerY = canvas.height - 60;
        const playerSize = 40;
        
        if (
            playerXRef.current < obs.x + 40 &&
            playerXRef.current + playerSize > obs.x &&
            playerY < obs.y + 40 &&
            playerY + playerSize > obs.y
        ) {
            // Collision!
            gameOver();
            return;
        }
    });

    // Remove off-screen obstacles
    obstaclesRef.current = obstaclesRef.current.filter(obs => obs.y < canvas.height);

    // Draw Player (Neon Blue Square)
    const playerY = canvas.height - 60;
    ctx.fillStyle = '#22d3ee'; // neon-blue (cyan-400)
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 20;
    ctx.fillRect(playerXRef.current, playerY, 40, 40);
    ctx.shadowBlur = 0;

    // Score
    scoreRef.current++;
    if (scoreRef.current % 5 === 0) {
        setDisplayScore(scoreRef.current);
    }

    if (isPlayingRef.current) {
        animationFrameRef.current = requestAnimationFrame(loop);
    }
  };

  const gameOver = () => {
      setIsPlaying(false);
      isPlayingRef.current = false;
      cancelAnimationFrame(animationFrameRef.current);
      saveScore('dodge-obstacles', scoreRef.current);
      reportScore(scoreRef.current);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isPlaying || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - 20; // Center the player
      // Clamp
      playerXRef.current = Math.max(0, Math.min(x, canvasRef.current.width - 40));
  };

  // Touch support
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (!isPlaying || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left - 20;
      playerXRef.current = Math.max(0, Math.min(x, canvasRef.current.width - 40));
  };


  return (
    <div className="flex flex-col items-center justify-center p-4 h-full w-full overflow-hidden">
       {/* Use absolute positioning to fill parent or fixed size? */}
       <GameStats score={displayScore} />
       
       {!isPlaying && (
           <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
               <h2 className="text-3xl font-display font-bold text-white mb-4">Esquiva Obstáculos</h2>
               <p className="text-gray-400 mb-8 max-w-xs text-center">Mueve el cuadro azul (con el mouse, tu dedo o las Flechas del teclado) para evitar los bloques rojos.</p>
               <button onClick={startGame} className="px-8 py-4 bg-neon-blue text-black font-bold rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-105 transition-transform">
                   <Play className="w-5 h-5 inline-block mr-2"/> JUGAR
               </button>
               {scoreRef.current > 0 && <div className="mt-4 text-white font-mono">Último Score: {scoreRef.current}</div>}
           </div>
       )}

       <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="w-full h-full max-w-md max-h-[600px] bg-white/5 rounded-xl border border-white/10 cursor-none touch-none"
       />
    </div>
  );
};

export default DodgeObstacles;
