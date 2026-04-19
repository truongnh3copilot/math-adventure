import React, { useState } from 'react';
import { useAlphabetGameState } from './useAlphabetGameState';
import AlphabetHomeScreen from './AlphabetHomeScreen';
import AlphabetLevelSelect from './AlphabetLevelSelect';
import AlphabetLearningMode from './AlphabetLearningMode';
import AlphabetQuizMode from './AlphabetQuizMode';
import AlphabetMatchingMode from './AlphabetMatchingMode';
import AlphabetListeningMode from './AlphabetListeningMode';
import AlphabetLevelComplete from './AlphabetLevelComplete';

export default function AlphabetGame({ onBack }) {
  const { state, completeLevel, resetProgress } = useAlphabetGameState();
  const [screen, setScreen] = useState('home');
  const [selectedMode, setSelectedMode] = useState('learning');
  const [activeGame, setActiveGame] = useState(null);
  const [lastResult, setLastResult] = useState({ level: 1, stars: 3 });

  const startGame = (mode, level) => {
    setActiveGame({ mode, level });
    setScreen('playing');
  };

  const onGameComplete = (level, stars) => {
    completeLevel(level, stars);
    setLastResult({ level, stars });
    setScreen('levelComplete');
  };

  const goHome = () => {
    setActiveGame(null);
    setScreen('home');
  };

  if (screen === 'home') {
    return (
      <AlphabetHomeScreen
        totalStars={state.totalStars}
        onSelectMode={(mode) => {
          setSelectedMode(mode);
          setScreen('levelSelect');
        }}
        onReset={resetProgress}
        onBack={onBack}
      />
    );
  }

  if (screen === 'levelSelect') {
    return (
      <AlphabetLevelSelect
        mode={selectedMode}
        levelProgress={state.levelProgress}
        onSelectLevel={(level) => startGame(selectedMode, level)}
        onBack={() => setScreen('home')}
      />
    );
  }

  if (screen === 'levelComplete') {
    return (
      <AlphabetLevelComplete
        level={lastResult.level}
        stars={lastResult.stars}
        onReplay={() => activeGame && startGame(activeGame.mode, lastResult.level)}
        onNextLevel={() => {
          const next = lastResult.level + 1;
          if (next <= 7 && activeGame) startGame(activeGame.mode, next);
          else goHome();
        }}
        onHome={goHome}
        hasNextLevel={lastResult.level < 7}
      />
    );
  }

  if (screen === 'playing' && activeGame) {
    const props = {
      level: activeGame.level,
      onComplete: (stars) => onGameComplete(activeGame.level, stars),
      onBack: () => setScreen('levelSelect'),
    };

    switch (activeGame.mode) {
      case 'learning': return <AlphabetLearningMode {...props} />;
      case 'quiz': return <AlphabetQuizMode {...props} />;
      case 'matching': return <AlphabetMatchingMode {...props} />;
      case 'listening': return <AlphabetListeningMode {...props} />;
      default: return null;
    }
  }

  return null;
}
