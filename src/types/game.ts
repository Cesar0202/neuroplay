export interface Game {
  id: string;
  title: string;
  description: string;
  icon: string; // URL or Lucide icon name
  path: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  color?: string;
  category: 'Reflex' | 'Memory' | 'Speed' | 'Logic';
}

export interface UserStats {
  reactionTime: number; // ms
  memoryLevel: number;
  typingSpeed: number; // wpm
  mathScore: number;
  totalXP: number;
  level: number;
}
