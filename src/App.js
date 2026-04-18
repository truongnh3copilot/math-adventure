import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GameProvider, useGame } from './context/GameContext';
import HomeScreen from './screens/HomeScreen';
import LevelMapScreen from './screens/LevelMapScreen';
import GameplayScreen from './screens/GameplayScreen';
import LevelCompleteScreen from './screens/LevelCompleteScreen';
import CharacterSelectScreen from './screens/CharacterSelectScreen';
import ParentDashboardScreen from './screens/ParentDashboardScreen';

const SCREEN_MAP = {
  home: HomeScreen,
  levelMap: LevelMapScreen,
  gameplay: GameplayScreen,
  levelComplete: LevelCompleteScreen,
  characterSelect: CharacterSelectScreen,
  parentDashboard: ParentDashboardScreen,
};

function AppInner() {
  const { state } = useGame();
  const Screen = SCREEN_MAP[state.screen] || HomeScreen;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state.screen}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
        style={{ minHeight: '100vh' }}
      >
        <Screen />
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppInner />
    </GameProvider>
  );
}
