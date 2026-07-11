import { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { saveScore } from '../../utils/scoreStorage';
import GameStats from '../../components/GameStats';

const ParabolicShot = () => {
    const { reportScore } = useGame();
    const [isPlaying, setIsPlaying] = useState(false);
    const [angle, setAngle] = useState(45);
    const [force, setForce] = useState(50);
    const [target, setTarget] = useState({ x: 300, y: 300, w: 50, h: 50 });
    const [projectile, setProjectile] = useState({ x: 0, y: 0, vx: 0, vy: 0, active: false });
    const [score, setScore] = useState(0);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frameRef = useRef(0);

    // Game loop for active projectile
    useEffect(() => {
        if (isPlaying && projectile.active) {
            frameRef.current = requestAnimationFrame(update);
        }
        return () => cancelAnimationFrame(frameRef.current);
    }, [isPlaying, projectile]);

    // Draw frame when inactive so cannon angle updates live
    useEffect(() => {
        if (isPlaying && !projectile.active) {
            draw(projectile);
        }
    }, [angle, isPlaying, target, projectile.active]);

    const update = () => {
        const p = { ...projectile };
        p.vy += 0.5; // Gravity
        p.x += p.vx;
        p.y += p.vy;

        // Check ground
        if (p.y > 400) { // Ground level 400
            p.active = false;
            // Missed
            setScore(Math.max(0, score - 10));
        }

        // Check target (Rectangle)
        if (
            p.x > target.x && p.x < target.x + target.w &&
            p.y > target.y && p.y < target.y + target.h
        ) {
            p.active = false;
            setScore(score + 100);
            // Move target
            setTarget({ x: Math.random() * 400 + 100, y: Math.random() * 200 + 100, w: 50, h: 50 });
        }

        setProjectile(p);
        draw(p);
    };

    const draw = (p: typeof projectile) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Sky gradient
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#1e1b4b');
        grad.addColorStop(1, '#0f172a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Ground
        ctx.fillStyle = '#22c55e'; // Green grass
        ctx.fillRect(0, 400, canvas.width, 20);

        // Target (Bullseye)
        const cx = target.x + target.w/2;
        const cy = target.y + target.h/2;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(cx, cy, target.w/2, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(cx, cy, target.w/3, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(cx, cy, target.w/6, 0, Math.PI*2); ctx.fill();

        // Projectile
        if (p.active) {
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
            ctx.fill();
            // Glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#fbbf24';
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        // Cannon Base
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.arc(20, 395, 15, Math.PI, 0);
        ctx.fill();

        // Cannon Barrel
        ctx.save();
        ctx.translate(20, 390);
        ctx.rotate(-angle * Math.PI / 180);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(0, -8, 45, 16);
        ctx.fillStyle = '#334155';
        ctx.fillRect(35, -10, 10, 20); // Muzzle
        ctx.restore();
    };

    const fire = () => {
        const rad = angle * Math.PI / 180;
        const v = force / 5;
        setProjectile({
            x: 20, 
            y: 390,
            vx: Math.cos(rad) * v,
            vy: -Math.sin(rad) * v, // Up is negative Y
            active: true
        });
    };

    const startGame = () => {
        setIsPlaying(true);
        setScore(0);
        setTarget({ x: 300, y: 300, w: 50, h: 50 });
    };

    const endGame = () => {
        setIsPlaying(false);
        saveScore('parabolic-shot', score);
        reportScore(score);
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 h-full bg-slate-900 w-full relative">
             <h2 className="text-3xl font-display font-bold text-white mb-4 z-10 pointer-events-none">Tiro Parabólico</h2>

             {isPlaying && <GameStats score={score} />}

             {!isPlaying ? (
                <div className="text-center max-w-md">
                    <p className="text-gray-400 mb-8 text-lg">Ajusta el ángulo y la fuerza de tu cañón para dar en el blanco. ¡Cuidado con pasarte o quedarte corto!</p>
                    <button onClick={startGame} className="px-8 py-4 bg-neon-purple font-bold rounded-xl z-20 pointer-events-auto hover:scale-105 transition-transform"><Play className="inline mr-2"/> JUGAR</button>
                </div>
             ) : (
                <div className="flex flex-col items-center w-full">
                    <canvas ref={canvasRef} width={600} height={420} className="bg-black/20 border border-white/10 rounded-xl mb-4" />
                    
                    <div className="flex space-x-8 text-white w-full max-w-lg">
                        <div className="flex flex-col flex-1">
                            <label>Ángulo: {angle}°</label>
                            <input type="range" min="0" max="90" value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="accent-neon-blue" />
                        </div>
                        <div className="flex flex-col flex-1">
                            <label>Fuerza: {force}</label>
                            <input type="range" min="10" max="100" value={force} onChange={(e) => setForce(Number(e.target.value))} className="accent-red-500" />
                        </div>
                        <button onClick={fire} className="px-6 py-2 bg-orange-500 font-bold rounded-lg hover:bg-orange-400 disabled:opacity-50" disabled={projectile.active}>
                            DISPARAR
                        </button>
                        <button onClick={endGame} className="px-6 py-2 text-white underline hover:text-red-400 transition-colors">
                            Terminar
                        </button>
                    </div>
                </div>
             )}
        </div>
    );
};

export default ParabolicShot;
