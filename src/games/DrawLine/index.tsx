import { useState, useRef, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { saveScore } from '../../utils/scoreStorage';
import { Play } from 'lucide-react';

const DrawLine = () => {
  const { reportScore } = useGame();
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [path, setPath] = useState<{x:number, y:number}[]>([]);
  const [score, setScore] = useState(0);

  // Generate random safe path on mount or start
  // For simplicity, horizontal wavy line in middle
  
  const drawSafeZone = (ctx: CanvasRenderingContext2D) => {
      const width = ctx.canvas.width;
      const height = ctx.canvas.height;
      const midY = height / 2;
      
      ctx.beginPath();
      ctx.moveTo(0, midY);
      for(let x=0; x<width; x+=10) {
          ctx.lineTo(x, midY + Math.sin(x/50) * 50);
      }
      ctx.lineWidth = 40; // Safe zone width
      ctx.strokeStyle = '#334155'; // Dark Slate (background track)
      ctx.lineCap = 'round';
      ctx.stroke();
  };

  const getDistanceToPath = (x: number, y: number, height: number) => {
      const midY = height / 2;
      const targetY = midY + Math.sin(x/50) * 50;
      return Math.abs(y - targetY);
  };

  const initCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = canvas.parentElement?.clientWidth || 600;
      canvas.height = canvas.parentElement?.clientHeight || 400;
      
      drawSafeZone(ctx);
  };

  useEffect(() => {
      initCanvas();
  }, [isPlaying]);

  const handleStart = () => {
      setIsDrawing(true);
      setPath([]);
      setScore(0);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing || !isPlaying) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
      
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Check if safe
      const dist = getDistanceToPath(x, y, canvas.height);
      if (dist > 20) { // Half of lineWidth 40
          setIsDrawing(false);
          setIsPlaying(false); // Game Over
          saveScore('draw-line', score);
          reportScore(score);
          return;
      }

      // Draw user line
      const ctx = canvas.getContext('2d');
      if (ctx) {
          ctx.beginPath();
          if (path.length > 0) {
              const last = path[path.length -1];
              ctx.moveTo(last.x, last.y);
          } else {
              ctx.moveTo(x, y);
          }
          ctx.lineTo(x, y);
          ctx.strokeStyle = '#22d3ee'; // Neon Blue
          ctx.lineWidth = 4;
          ctx.stroke();
      }

      setPath([...path, {x, y}]);
      setScore(prev => prev + 1);

      // Win condition: reached end
      if (x > canvas.width - 20) {
          setIsPlaying(false);
          setIsDrawing(false);
          setScore(prev => prev + 500); // Bonus
          saveScore('draw-line', score + 500);
          reportScore(score + 500);
      }
  };

  const handleEnd = () => {
      setIsDrawing(false);
      // If released early, fail? Or just pause? Let's say fail if not at end.
      if (isPlaying) {
          setIsPlaying(false);
      }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 h-full w-full">
      <h2 className="text-3xl font-display font-bold text-white mb-4">Dibuja la Línea</h2>
      <p className="text-gray-400 mb-4">Mantén el trazo dentro del camino oscuro.</p>
      
      {!isPlaying ? (
         <button onClick={() => { setIsPlaying(true); initCanvas(); }} className="px-8 py-4 bg-neon-blue font-bold rounded-xl"><Play className="inline mr-2"/> JUGAR</button>
      ) : (
         <canvas 
            ref={canvasRef}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
            className="bg-black border border-white/20 rounded-xl cursor-crosshair touch-none shadow-lg"
         />
      )}
      {score > 0 && <div className="mt-4 text-white font-mono">Puntuación: {score}</div>}
    </div>
  );
};

export default DrawLine;
