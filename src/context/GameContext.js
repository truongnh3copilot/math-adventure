import React, { createContext, useContext, useReducer, useEffect } from 'react';

const STORAGE_KEY = 'math_adventure_progress';
const HISTORY_API = 'http://localhost:3001/api/history';

function recordHistory(mode, levelId, stars, coins) {
  fetch(HISTORY_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode, levelId, stars, coins }),
  }).catch(() => {});
}

const initialState = {
  screen: 'home',
  selectedMode: null,
  selectedCharacter: null,
  currentLevel: null,
  currentQuestions: [],
  currentQuestionIndex: 0,
  wrongAnswersThisQuestion: 0,
  wrongAnswersStreak: 0,
  correctStreak: 0,
  starsEarned: 3,
  progress: {},   // { [mode]: { [level]: { stars, coins, unlocked } } }
  totalCoins: 0,
  totalStickers: 0,
  difficulty: 'easy',
};

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveProgress(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    progress: state.progress,
    totalCoins: state.totalCoins,
    totalStickers: state.totalStickers,
    selectedCharacter: state.selectedCharacter,
    difficulty: state.difficulty,
  }));
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_SAVED': {
      const saved = loadProgress();
      return { ...state, ...saved };
    }
    case 'SET_SCREEN':
      return { ...state, screen: action.screen };
    case 'SELECT_MODE':
      return { ...state, selectedMode: action.mode, screen: 'levelMap' };
    case 'SELECT_CHARACTER':
      return { ...state, selectedCharacter: action.character };
    case 'START_LEVEL': {
      return {
        ...state,
        screen: 'gameplay',
        currentLevel: action.level,
        currentQuestions: action.questions,
        currentQuestionIndex: 0,
        wrongAnswersThisQuestion: 0,
        wrongAnswersStreak: 0,
        correctStreak: 0,
        starsEarned: 3,
      };
    }
    case 'ANSWER_CORRECT': {
      const newStreak = state.correctStreak + 1;
      const newDifficulty = newStreak >= 5 ? 'hard' : state.difficulty;
      return {
        ...state,
        correctStreak: newStreak,
        wrongAnswersStreak: 0,
        wrongAnswersThisQuestion: 0,
        difficulty: newDifficulty,
      };
    }
    case 'ANSWER_WRONG': {
      const wrongQuestion = state.wrongAnswersThisQuestion + 1;
      const wrongStreak = state.wrongAnswersStreak + 1;
      const newStars = wrongQuestion === 1 ? Math.min(state.starsEarned, 2)
        : wrongQuestion >= 2 ? Math.min(state.starsEarned, 1)
        : state.starsEarned;
      const newDifficulty = wrongStreak >= 3 ? 'easy' : state.difficulty;
      return {
        ...state,
        wrongAnswersThisQuestion: wrongQuestion,
        wrongAnswersStreak: wrongStreak,
        correctStreak: 0,
        starsEarned: newStars,
        difficulty: newDifficulty,
      };
    }
    case 'NEXT_QUESTION':
      return { ...state, currentQuestionIndex: state.currentQuestionIndex + 1, wrongAnswersThisQuestion: 0 };
    case 'COMPLETE_LEVEL': {
      const mode = state.selectedMode;
      const levelId = state.currentLevel.id;
      const stars = state.starsEarned;
      const prevProgress = state.progress[mode] || {};
      const prevStars = prevProgress[levelId]?.stars || 0;
      const coinsEarned = stars * 5;
      const stickerEarned = stars === 3 ? 1 : 0;

      const nextLevelId = levelId + 1;
      const updatedProgress = {
        ...prevProgress,
        [levelId]: { stars: Math.max(prevStars, stars), coins: coinsEarned, unlocked: true },
        [nextLevelId]: { ...(prevProgress[nextLevelId] || {}), unlocked: stars >= 1 },
      };

      recordHistory(mode, levelId, stars, coinsEarned);
      return {
        ...state,
        screen: 'levelComplete',
        progress: { ...state.progress, [mode]: updatedProgress },
        totalCoins: state.totalCoins + (prevStars < stars ? coinsEarned : 0),
        totalStickers: state.totalStickers + stickerEarned,
      };
    }
    default:
      return state;
  }
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: 'LOAD_SAVED' });
  }, []);

  useEffect(() => {
    if (state.progress && Object.keys(state.progress).length > 0) {
      saveProgress(state);
    }
  }, [state.progress, state.totalCoins, state.totalStickers]);

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame() {
  return useContext(GameContext);
}
