import { useState, useEffect } from 'react';

const STORAGE_KEY = 'vn_alphabet_game';

const defaultState = () => ({
  totalStars: 0,
  levelProgress: {
    1: { unlocked: true, completed: false, stars: 0 },
    2: { unlocked: false, completed: false, stars: 0 },
    3: { unlocked: false, completed: false, stars: 0 },
    4: { unlocked: false, completed: false, stars: 0 },
    5: { unlocked: false, completed: false, stars: 0 },
    6: { unlocked: false, completed: false, stars: 0 },
    7: { unlocked: false, completed: false, stars: 0 },
  },
});

export function useAlphabetGameState() {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultState();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const completeLevel = (level, stars) => {
    setState(prev => {
      const current = prev.levelProgress[level] || { unlocked: true, completed: false, stars: 0 };
      const newStars = Math.max(current.stars, stars);
      const nextLevel = level + 1;
      return {
        totalStars: prev.totalStars + Math.max(0, newStars - current.stars),
        levelProgress: {
          ...prev.levelProgress,
          [level]: { ...current, completed: true, stars: newStars },
          ...(nextLevel <= 7 ? {
            [nextLevel]: {
              ...(prev.levelProgress[nextLevel] || { completed: false, stars: 0 }),
              unlocked: true,
            },
          } : {}),
        },
      };
    });
  };

  const resetProgress = () => setState(defaultState());

  return { state, completeLevel, resetProgress };
}
