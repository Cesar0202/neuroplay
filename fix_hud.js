const fs = require('fs');
const path = require('path');

const games = [
    'BeatHunter', 'DoubleStimulus', 'FindLargestNumber', 
    'OrbitalControl', 'OrderNumbers', 'SafePath', 
    'SlidingPuzzle', 'SteadyPulse', 'VisualExplosion'
];

games.forEach(game => {
    const file = path.join('src', 'games', game, 'index.tsx');
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        // Add import if not exists
        if (!content.includes('import GameStats')) {
            content = content.replace(/(import .*;\n)(?!import)/, $1import GameStats from '../../components/GameStats';\n);
        }
        
        // Remove old tags and insert <GameStats ... />
        if (game === 'FindLargestNumber') {
            content = content.replace(/<div className="flex justify-between w-full max-w-md mb-8">[\s\S]*?<\/div>\s*<\/div>/, '<GameStats score={score} time={timeLeft} />');
        } else if (game === 'OrderNumbers') {
             content = content.replace(/<div className="flex justify-between w-full max-w-md mb-8 text-xl font-mono">[\s\S]*?<\/div>\s*<\/div>/, '<GameStats score={score} time={timeLeft} />');
        }
        // ... (I need to see their exact structures to do this correctly, maybe I should just view them first)
    }
});
