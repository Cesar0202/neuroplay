
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Ranking from './pages/Ranking';
import GameLayout from './layouts/GameLayout';

// Mock Games for now (will implement later)
import ReactionTest from './games/ReactionTest';
import MemoryCards from './games/MemoryCards';
import TypingSpeed from './games/TypingSpeed';
import CatchTheCircle from './games/CatchTheCircle';
import FastMath from './games/FastMath';
import FindTheDifferent from './games/FindTheDifferent';
import SimonSays from './games/SimonSays';
import DodgeObstacles from './games/DodgeObstacles';
import ExactTime from './games/ExactTime';
import LeftOrRight from './games/LeftOrRight';
import FindLargestNumber from './games/FindLargestNumber';
import OrderNumbers from './games/OrderNumbers';
import HumanTimer from './games/HumanTimer';
import SafePath from './games/SafePath';
// New Batch imports
import HiddenPattern from './games/HiddenPattern';
import FindIntruder from './games/FindIntruder';
import NumberSequence from './games/NumberSequence';
import DynamicMaze from './games/DynamicMaze';
import HumanSemaphore from './games/HumanSemaphore';
import VisualExplosion from './games/VisualExplosion';
import SafeZone from './games/SafeZone';
import DoubleStimulus from './games/DoubleStimulus';
import DrawLine from './games/DrawLine';
import SteadyPulse from './games/SteadyPulse';
import ParabolicShot from './games/ParabolicShot';
import OrbitalControl from './games/OrbitalControl';
import FlashMemory from './games/FlashMemory';
import BuildTower from './games/BuildTower';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/ranking" element={<Ranking />} />

        {/* Game Routes wrapped in GameLayout */}
        <Route path="/play/:gameId" element={<GameLayout />}>
           {/* We might use params to render specific game or specific routes */}
        </Route>
        
        {/* Specific game routes if prefered over dynamic :gameId */}
        <Route path="/play/reaction-test" element={<GameLayout><ReactionTest /></GameLayout>} />
        <Route path="/play/memory-cards" element={<GameLayout><MemoryCards /></GameLayout>} />
        <Route path="/play/typing-speed" element={<GameLayout><TypingSpeed /></GameLayout>} />
        <Route path="/play/catch-the-circle" element={<GameLayout><CatchTheCircle /></GameLayout>} />
        <Route path="/play/fast-math" element={<GameLayout><FastMath /></GameLayout>} />
        <Route path="/play/find-the-different" element={<GameLayout><FindTheDifferent /></GameLayout>} />
        
        {/* New Games Batch 1 */}
        <Route path="/play/simon-says" element={<GameLayout><SimonSays /></GameLayout>} />
        <Route path="/play/dodge-obstacles" element={<GameLayout><DodgeObstacles /></GameLayout>} />
        <Route path="/play/exact-time" element={<GameLayout><ExactTime /></GameLayout>} />
        <Route path="/play/left-or-right" element={<GameLayout><LeftOrRight /></GameLayout>} />
        <Route path="/play/find-largest-number" element={<GameLayout><FindLargestNumber /></GameLayout>} />
        <Route path="/play/order-numbers" element={<GameLayout><OrderNumbers /></GameLayout>} />
        <Route path="/play/human-timer" element={<GameLayout><HumanTimer /></GameLayout>} />
        <Route path="/play/safe-path" element={<GameLayout><SafePath /></GameLayout>} />

        {/* New Games Batch 2 (20 items) */}
        <Route path="/play/hidden-pattern" element={<GameLayout><HiddenPattern /></GameLayout>} />
        <Route path="/play/find-intruder" element={<GameLayout><FindIntruder /></GameLayout>} />
        <Route path="/play/number-sequence" element={<GameLayout><NumberSequence /></GameLayout>} />
        <Route path="/play/dynamic-maze" element={<GameLayout><DynamicMaze /></GameLayout>} />
        <Route path="/play/human-semaphore" element={<GameLayout><HumanSemaphore /></GameLayout>} />
        <Route path="/play/visual-explosion" element={<GameLayout><VisualExplosion /></GameLayout>} />
        <Route path="/play/safe-zone" element={<GameLayout><SafeZone /></GameLayout>} />
        <Route path="/play/double-stimulus" element={<GameLayout><DoubleStimulus /></GameLayout>} />
        <Route path="/play/draw-line" element={<GameLayout><DrawLine /></GameLayout>} />
        <Route path="/play/steady-pulse" element={<GameLayout><SteadyPulse /></GameLayout>} />
        <Route path="/play/parabolic-shot" element={<GameLayout><ParabolicShot /></GameLayout>} />
        <Route path="/play/orbital-control" element={<GameLayout><OrbitalControl /></GameLayout>} />
        <Route path="/play/flash-memory" element={<GameLayout><FlashMemory /></GameLayout>} />
        <Route path="/play/build-tower" element={<GameLayout><BuildTower /></GameLayout>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-canvas text-white selection:bg-neon-blue/30 overflow-x-hidden">
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
