import React from 'react';

interface GameStatsProps {
    score?: number;
    time?: number;
    moves?: number;
    level?: number;
}

const GameStats: React.FC<GameStatsProps> = ({ score, time, moves, level }) => {
    const parts = [];
    if (time !== undefined) parts.push(`${time}s`);
    if (level !== undefined) parts.push(`Nivel: ${level}`);
    if (moves !== undefined) parts.push(`Intentos: ${moves}`);
    if (score !== undefined) parts.push(`Puntos: ${score}`);

    if (parts.length === 0) return null;

    return (
        <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-40">
            <div className="bg-[#121212] border border-white/50 rounded-lg px-4 py-2 font-mono text-xl text-white font-bold flex items-center gap-3 shadow-lg">
                {parts.map((part, index) => (
                    <React.Fragment key={index}>
                        <span>{part}</span>
                        {index < parts.length - 1 && <span className="text-gray-500">|</span>}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default GameStats;
