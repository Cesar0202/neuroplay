import { ArrowRight, Zap, Brain, Rocket, Clock, Target, Search, Hash } from 'lucide-react';

import reactionTestImg from '../assets/game_cards/reaction_test.png';
import memoryCardsImg from '../assets/game_cards/memory_card.png';
import typingSpeedImg from '../assets/game_cards/typing_speed.png';
import catchTheCircleImg from '../assets/game_cards/catch_the_circle.png';
import fastMathImg from '../assets/game_cards/fast_math.png';
import findTheDifferentImg from '../assets/game_cards/find_the_different.png';
import simonSaysImg from '../assets/game_cards/simon_says.png';
import dodgeObstaclesImg from '../assets/game_cards/dodge_obstacles.png';
import exactTimeImg from '../assets/game_cards/exact_time.png';
import leftOrRightImg from '../assets/game_cards/left_or_right.png';
import findLargestNumberImg from '../assets/game_cards/find_largest_number.png';
import orderNumbersImg from '../assets/game_cards/order_numbers.png';
import humanTimerImg from '../assets/game_cards/human_timer.png';
import safePathImg from '../assets/game_cards/safe_path.png';
import hiddenPatternImg from '../assets/game_cards/hidden_pattern.png';
import findIntruderImg from '../assets/game_cards/find_intruder.png';
import numberSequenceImg from '../assets/game_cards/number_sequence.png';
import dynamicMazeImg from '../assets/game_cards/dynamic_maze.png';
import humanSemaphoreImg from '../assets/game_cards/human_semaphore.png';
import visualExplosionImg from '../assets/game_cards/visual_explosion.png';
import safeZoneImg from '../assets/game_cards/safe_zone.png';
import doubleStimulusImg from '../assets/game_cards/double_stimulus.png';
import drawLineImg from '../assets/game_cards/draw_line.png';
import steadyPulseImg from '../assets/game_cards/steady_pulse.png';
import parabolicShotImg from '../assets/game_cards/parabolic_shot.png';
import orbitalControlImg from '../assets/game_cards/orbital_control.png';
import flashMemoryImg from '../assets/game_cards/flash_memory.png';
import buildTowerImg from '../assets/game_cards/build_tower.png';

export const gamesCatalog = [
    {
      id: 'reaction-test',
      category: 'Reflejos',
      title: 'Reaction Test',
      description: 'Mide tus reflejos con cambios de color aleatorios.',
      difficulty: 'Medium' as const,
      icon: Zap,
      color: 'from-orange-400 to-red-600',
      backgroundImage: reactionTestImg
    },
    {
      id: 'memory-cards',
      category: 'Memoria',
      title: 'Memory Cards',
      description: 'Entrena tu memoria visual con cartas 3D.',
      difficulty: 'Easy' as const,
      icon: Brain,
      color: 'from-blue-400 to-indigo-600',
      backgroundImage: memoryCardsImg
    },
    {
      id: 'typing-speed',
      category: 'Precisión',
      title: 'Typing Speed',
      description: 'Mejora tu velocidad de escritura bajo presión.',
      difficulty: 'Hard' as const,
      icon: Rocket,
      color: 'from-purple-400 to-pink-600',
      backgroundImage: typingSpeedImg
    },
    {
      id: 'catch-the-circle',
      category: 'Reflejos',
      title: 'Catch the Circle',
      description: 'Agilidad y precisión en movimiento.',
      difficulty: 'Medium' as const,
      icon: Target,
      color: 'from-green-400 to-emerald-600',
      backgroundImage: catchTheCircleImg
    },
    {
      id: 'fast-math',
      category: 'Matemáticas',
      title: 'Fast Math',
      description: 'Cálculo mental rápido contra el reloj.',
      difficulty: 'Hard' as const,
      icon: Hash,
      color: 'from-yellow-400 to-amber-600',
      backgroundImage: fastMathImg
    },
    {
      id: 'find-the-different',
      category: 'Lógica',
      title: 'Find the Different',
      description: 'Agudeza visual para encontrar el intruso.',
      difficulty: 'Easy' as const,
      icon: Search,
      color: 'from-cyan-400 to-blue-600',
      backgroundImage: findTheDifferentImg
    },
    {
      id: 'simon-says',
      category: 'Memoria',
      title: 'Simon Says',
      description: 'Repite la secuencia de colores que crece progresivamente.',
      difficulty: 'Medium' as const,
      icon: Zap,
      color: 'from-orange-400 to-yellow-600',
      backgroundImage: simonSaysImg
    },
    {
      id: 'dodge-obstacles',
      category: 'Reflejos',
      title: 'Dodge Blocks',
      description: 'Mueve el cuadrado y evita chocar con los bloques rojos.',
      difficulty: 'Hard' as const,
      icon: Rocket,
      color: 'from-red-500 to-pink-600',
      backgroundImage: dodgeObstaclesImg
    },
    {
      id: 'exact-time',
      category: 'Precisión',
      title: 'Exact Time',
      description: 'Detén el cronómetro exactamente en 10.00 segundos.',
      difficulty: 'Medium' as const,
      icon: Clock,
      color: 'from-cyan-400 to-blue-500',
      backgroundImage: exactTimeImg
    },
    {
      id: 'left-or-right',
      category: 'Reflejos',
      title: 'Left or Right',
      description: 'Reacciona rápido: pulsa la dirección correcta.',
      difficulty: 'Easy' as const,
      icon: ArrowRight,
      color: 'from-indigo-400 to-purple-600',
      backgroundImage: leftOrRightImg
    },
    {
      id: 'find-largest-number',
      category: 'Matemáticas',
      title: 'Find Max',
      description: 'Encuentra el número más grande entre todos.',
      difficulty: 'Easy' as const,
      icon: Hash,
      color: 'from-green-400 to-teal-600',
      backgroundImage: findLargestNumberImg
    },
    {
      id: 'order-numbers',
      category: 'Matemáticas',
      title: 'Order Numbers',
      description: 'Ordena los números de menor a mayor correctamente.',
      difficulty: 'Medium' as const,
      icon: Hash,
      color: 'from-blue-400 to-indigo-600',
      backgroundImage: orderNumbersImg
    },
    {
      id: 'human-timer',
      category: 'Precisión',
      title: 'Human Timer',
      description: 'Calcula mentalmente cuándo pasa 1 minuto exacto.',
      difficulty: 'Hard' as const,
      icon: Clock,
      color: 'from-amber-400 to-orange-600',
      backgroundImage: humanTimerImg
    },
    {
      id: 'safe-path',
      category: 'Precisión',
      title: 'Safe Path',
      description: 'Lleva el cursor a la meta sin tocar las paredes.',
      difficulty: 'Hard' as const,
      icon: Target,
      color: 'from-red-500 to-rose-700',
      backgroundImage: safePathImg
    },
    {
      id: 'hidden-pattern',
      category: 'Lógica',
      title: 'Hidden Pattern',
      description: 'Descubre la regla y completa la secuencia.',
      difficulty: 'Hard' as const,
      icon: Search,
      color: 'from-blue-500 to-indigo-600',
      backgroundImage: hiddenPatternImg
    },
    {
      id: 'find-intruder',
      category: 'Lógica',
      title: 'Find Intruder',
      description: 'Elige el elemento que no pertenece al grupo.',
      difficulty: 'Easy' as const,
      icon: Search,
      color: 'from-red-400 to-orange-500',
      backgroundImage: findIntruderImg
    },
    {
      id: 'number-sequence',
      category: 'Matemáticas',
      title: 'Number Seq',
      description: 'Predice el siguiente número de la serie.',
      difficulty: 'Hard' as const,
      icon: Hash,
      color: 'from-purple-500 to-pink-500',
      backgroundImage: numberSequenceImg
    },
    {
      id: 'dynamic-maze',
      category: 'Lógica',
      title: 'Dynamic Maze',
      description: 'Escapa de un laberinto que cambia constantemente.',
      difficulty: 'Hard' as const,
      icon: Brain,
      color: 'from-cyan-400 to-blue-600',
      backgroundImage: dynamicMazeImg
    },
    {
      id: 'human-semaphore',
      category: 'Reflejos',
      title: 'Semaphore',
      description: 'Reacciona instantáneamente cuando veas el verde.',
      difficulty: 'Medium' as const,
      icon: Zap,
      color: 'from-green-500 to-lime-500',
      backgroundImage: humanSemaphoreImg
    },
    {
      id: 'visual-explosion',
      category: 'Reflejos',
      title: 'Visual Explosion',
      description: 'Haz clic antes de que los objetos desaparezcan.',
      difficulty: 'Medium' as const,
      icon: Target,
      color: 'from-orange-500 to-red-600',
      backgroundImage: visualExplosionImg
    },
    {
      id: 'safe-zone',
      category: 'Precisión',
      title: 'Safe Zone',
      description: 'Muévete solo cuando la zona esté verde.',
      difficulty: 'Hard' as const,
      icon: Brain,
      color: 'from-emerald-400 to-teal-600',
      backgroundImage: safeZoneImg
    },
    {
      id: 'double-stimulus',
      category: 'Reflejos',
      title: 'Double Stimulus',
      description: 'Reacciona solo si coinciden color y forma.',
      difficulty: 'Hard' as const,
      icon: Zap,
      color: 'from-indigo-500 to-purple-600',
      backgroundImage: doubleStimulusImg
    },
    {
      id: 'draw-line',
      category: 'Precisión',
      title: 'Draw Line',
      description: 'Traza un camino sin salirte de los bordes.',
      difficulty: 'Hard' as const,
      icon: Target,
      color: 'from-blue-400 to-cyan-500',
      backgroundImage: drawLineImg
    },
    {
      id: 'steady-pulse',
      category: 'Precisión',
      title: 'Steady Pulse',
      description: 'Mantén el cursor dentro de la zona móvil.',
      difficulty: 'Hard' as const,
      icon: Target,
      color: 'from-pink-500 to-rose-600',
      backgroundImage: steadyPulseImg
    },
    {
      id: 'parabolic-shot',
      category: 'Precisión',
      title: 'Parabolic Shot',
      description: 'Ajusta ángulo y fuerza para acertar al blanco.',
      difficulty: 'Medium' as const,
      icon: Rocket,
      color: 'from-amber-500 to-orange-600',
      backgroundImage: parabolicShotImg
    },
    {
      id: 'orbital-control',
      category: 'Precisión',
      title: 'Orbital Control',
      description: 'Mantén un objeto girando en órbita estable.',
      difficulty: 'Hard' as const,
      icon: Brain,
      color: 'from-violet-500 to-fuchsia-600',
      backgroundImage: orbitalControlImg
    },
    {
      id: 'flash-memory',
      category: 'Memoria',
      title: 'Flash Memory',
      description: 'Recuerda la posición exacta del patrón.',
      difficulty: 'Hard' as const,
      icon: Brain,
      color: 'from-sky-400 to-blue-500',
      backgroundImage: flashMemoryImg
    },
    {
      id: 'build-tower',
      category: 'Precisión',
      title: 'Build Tower',
      description: 'Apila bloques sin que se caigan.',
      difficulty: 'Hard' as const,
      icon: Hash,
      color: 'from-yellow-400 to-amber-500',
      backgroundImage: buildTowerImg
    }
  ];
