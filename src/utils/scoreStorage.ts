export interface GameScore {
  date: string;
  score: number;
}

const STORAGE_KEY = 'neuroplay_scores';

export const saveScore = (gameId: string, score: number, sortOrder: 'asc' | 'desc' = 'desc') => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const data: Record<string, GameScore[]> = stored ? JSON.parse(stored) : {};

  if (!data[gameId]) {
    data[gameId] = [];
  }

  data[gameId].push({
    date: new Date().toISOString(),
    score: score,
  });

  // Keep top 10 scores per game
  data[gameId].sort((a, b) => sortOrder === 'desc' ? b.score - a.score : a.score - b.score);
  data[gameId] = data[gameId].slice(0, 10);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  // Dispatch event so UI can update reactively
  window.dispatchEvent(new Event('scoresUpdated'));
};

export const getHighScores = (gameId: string): GameScore[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  const data: Record<string, GameScore[]> = JSON.parse(stored);
  return data[gameId] || [];
};

export const getBestScore = (gameId: string): number => {
  const scores = getHighScores(gameId);
  return scores.length > 0 ? scores[0].score : 0;
};
