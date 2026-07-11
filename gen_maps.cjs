const fs = require('fs');

function generatePath() {
    let x = 10;
    let y = 90;
    let path = `M ${x} ${y}`;
    let direction = Math.random() > 0.5 ? 'up' : 'right';
    
    const segments = Math.floor(Math.random() * 4) + 4; // 4 to 7 segments
    for (let i = 0; i < segments; i++) {
        let dist = (Math.floor(Math.random() * 4) + 2) * 10; 
        
        if (direction === 'up') {
            y = Math.max(10, y - dist);
            direction = Math.random() > 0.5 ? 'left' : 'right';
            if (y === 10) direction = 'right';
        } else if (direction === 'down') {
            y = Math.min(90, y + dist);
            direction = Math.random() > 0.5 ? 'left' : 'right';
            if (y === 90) direction = 'right';
        } else if (direction === 'left') {
            x = Math.max(10, x - dist);
            direction = Math.random() > 0.5 ? 'up' : 'down';
            if (x === 10) direction = 'up';
        } else if (direction === 'right') {
            x = Math.min(90, x + dist);
            direction = Math.random() > 0.5 ? 'up' : 'down';
            if (x === 90) direction = 'up';
        }
        
        path += ` L ${x} ${y}`;
    }
    
    return {
        path: path,
        start: { cx: 10, cy: 90 },
        end: { cx: x, cy: y }
    };
}

let maps = [];
for (let i = 0; i < 30; i++) {
    maps.push({ id: i + 1, ...generatePath() });
}

let fileContent = `export type MazeMap = {
    id: number;
    path: string;
    start: { cx: number, cy: number };
    end: { cx: number, cy: number };
};

export const safePathMaps: MazeMap[] = ${JSON.stringify(maps, null, 4)};
`;

fs.writeFileSync('src/games/SafePath/maps.ts', fileContent);
