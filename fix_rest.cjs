const fs = require('fs');
const path = require('path');

const files = {
  'BeatHunter': [
      [/<div className="absolute top-2 left-2 text-white font-mono">Score: \{Math\.floor\(score\)\}<\/div>/g, '<GameStats score={Math.floor(score)} />']
  ],
  'DoubleStimulus': [
      [/<div className="text-xl text-white font-mono mt-4 text-center">Score: \{score\}<\/div>/g, '<GameStats score={score} />']
  ],
  'OrbitalControl': [
      [/Score: \{score\}/g, '<GameStats score={score} />']
  ],
  'SafePath': [
      [/<div className="text-xl text-yellow-400 font-mono mb-4">Puntos: \{score\}<\/div>/g, '<GameStats score={score} />']
  ],
  'SlidingPuzzle': [
      [/<span>Tiempo: \{time\}s<\/span>/g, '<GameStats time={time} />']
  ],
  'SteadyPulse': [
      [/<div className="absolute top-8 right-8 text-2xl font-mono text-white pointer-events-none">Score: \{score\}<\/div>/g, '<GameStats score={score} />']
  ],
  'VisualExplosion': [
      [/<div className="absolute top-8 right-8 text-2xl font-mono text-white pointer-events-none">Score: \{score\}<\/div>/g, '<GameStats score={score} />']
  ]
};

for (const [game, replaces] of Object.entries(files)) {
    const file = path.join('src', 'games', game, 'index.tsx');
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        if (!content.includes('import GameStats')) {
            content = content.replace(/(import .*;\n)(?!import)/, `$1import GameStats from '../../components/GameStats';\n`);
        }
        
        for (const [regex, replacement] of replaces) {
            content = content.replace(regex, replacement);
        }
        
        fs.writeFileSync(file, content);
        console.log('Fixed', game);
    }
}
