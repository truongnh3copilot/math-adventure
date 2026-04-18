import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Lock, Star, Trophy, Home } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { buildLevelMap, generateLevelQuestions, MODES } from '../data/levels';

const LEVELS_BEFORE = 3;
const LEVELS_AFTER = 7;

const LEVEL_ICONS = ['🍎', '🚀', '🎈', '🐱', '💎', '🌈', '⭐', '🎯', '🔥', '🎪'];
const DIFFICULTY_COLORS = {
  easy:   'bg-emerald-400 border-emerald-600',
  medium: 'bg-sky-400 border-sky-600',
  hard:   'bg-orange-400 border-orange-600',
  expert: 'bg-purple-400 border-purple-600',
};

export default function LevelMapScreen() {
  const { state, dispatch } = useGame();
  const scrollRef = useRef(null);
  const mode = state.selectedMode;
  const levels = buildLevelMap(mode);
  const modeInfo = MODES.find((m) => m.id === mode);
  const modeProgress = state.progress[mode] || {};
  const totalStars = Object.values(modeProgress).reduce((sum, p) => sum + (p?.stars || 0), 0);

  function isUnlocked(levelId) {
    if (levelId === 1) return true;
    return modeProgress[levelId]?.unlocked === true || modeProgress[levelId - 1]?.stars >= 1;
  }

  const currentIndex = levels.findIndex(
    (level) => isUnlocked(level.id) && !(modeProgress[level.id]?.stars > 0)
  );
  const centerIndex = currentIndex === -1 ? levels.length - 1 : currentIndex;

  const start = Math.max(0, centerIndex - LEVELS_BEFORE);
  const end = Math.min(levels.length, centerIndex + LEVELS_AFTER + 1);
  const visibleLevels = levels.slice(start, end);

  function handleStartLevel(level) {
    if (!isUnlocked(level.id)) return;
    const questions = generateLevelQuestions(level.mode, level.id, level.questionsCount);
    dispatch({ type: 'START_LEVEL', level, questions });
  }

  return (
    <div className="min-h-screen bg-[#eef2ff] font-sans text-slate-900 overflow-x-auto overflow-y-hidden relative select-none">
      {/* Background clouds */}
      <div className="absolute top-40 left-1/4 text-6xl opacity-20 animate-bounce">☁️</div>
      <div className="absolute top-20 left-2/4 text-6xl opacity-20 animate-pulse">☁️</div>
      <div className="absolute top-60 right-1/4 text-6xl opacity-20 animate-bounce">☁️</div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="max-w-xl mx-auto flex items-center justify-between bg-white rounded-2xl shadow-[0_8px_0_0_#e2e8f0] px-4 py-3 border-2 border-slate-200">
          <button
            className="p-2 hover:bg-slate-100 rounded-xl transition-all active:translate-y-1"
            onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'home' })}
          >
            <Home size={28} className="text-indigo-500" />
          </button>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mode</span>
            <h1 className="text-xl font-black text-indigo-600 uppercase">
              {modeInfo?.icon} {modeInfo?.label}
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-amber-400 px-3 py-1.5 rounded-xl shadow-[0_4px_0_0_#d97706] border-2 border-amber-500">
            <Star className="text-white fill-white" size={20} />
            <span className="font-black text-white text-lg">{totalStars}</span>
          </div>
        </div>
      </header>

      {/* Level track */}
      <main className="h-screen flex items-center px-20 min-w-max pt-24">
        <div className="relative flex items-center gap-24 py-20">
          {/* Background path line */}
          <div className="absolute left-10 right-10 h-4 bg-slate-300/30 rounded-full top-1/2 -translate-y-1/2 -z-10" />

          {visibleLevels.map((level, i) => {
            const unlocked = isUnlocked(level.id);
            const stars = modeProgress[level.id]?.stars || 0;
            const isCompleted = stars > 0;
            const isCurrent = level.id === levels[centerIndex]?.id;
            const icon = LEVEL_ICONS[(level.id - 1) % LEVEL_ICONS.length];
            const colorClass = DIFFICULTY_COLORS[level.difficulty] || DIFFICULTY_COLORS.easy;
            const yOffset = Math.sin(i * 1.5) * 80;

            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: yOffset }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 200 }}
                className="relative flex flex-col items-center transition-all duration-300"
              >
                {/* Stars above completed levels */}
                {isCompleted && (
                  <div className="absolute -top-8 flex gap-1">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        size={18}
                        className={s <= stars ? 'text-amber-400 fill-amber-400 drop-shadow-sm' : 'text-slate-300 fill-slate-300'}
                      />
                    ))}
                  </div>
                )}

                {/* Level circle */}
                <button
                  onClick={() => handleStartLevel(level)}
                  disabled={!unlocked}
                  className={`
                    relative flex items-center justify-center rounded-full text-5xl
                    transition-all active:scale-95 border-b-[10px]
                    ${unlocked
                      ? `${colorClass} shadow-2xl`
                      : 'bg-slate-300 border-slate-400 cursor-not-allowed shadow-none'
                    }
                    ${isCurrent
                      ? 'w-32 h-32 text-6xl animate-bounce ring-8 ring-white/50'
                      : 'w-28 h-28'
                    }
                  `}
                >
                  {!unlocked ? (
                    <Lock size={40} className="text-slate-500" />
                  ) : (
                    <span className="drop-shadow-lg">{icon}</span>
                  )}

                  {/* Glow for current level */}
                  {isCurrent && (
                    <div className="absolute -z-10 w-48 h-48 bg-orange-400/20 blur-3xl rounded-full" />
                  )}
                </button>

                {/* Level label */}
                <div className={`
                  mt-5 px-6 py-1.5 rounded-full font-black text-sm border-2 whitespace-nowrap
                  ${!unlocked
                    ? 'bg-slate-200 border-slate-300 text-slate-400'
                    : 'bg-white border-slate-200 text-slate-700 shadow-md'
                  }
                `}>
                  LVL {level.id}
                </div>
              </motion.div>
            );
          })}

          {/* Trophy at end */}
          <motion.div
            className="relative ml-10"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: end >= levels.length ? 1 : 0.35, scale: 1 }}
            transition={{ delay: visibleLevels.length * 0.05 }}
          >
            <div className="w-40 h-40 bg-yellow-400 rounded-[40px] border-b-[12px] border-yellow-600 flex items-center justify-center shadow-2xl -rotate-6">
              <Trophy size={80} className="text-white drop-shadow-xl" />
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-8 py-2 rounded-full border-4 border-yellow-500 font-black text-yellow-600 whitespace-nowrap text-lg shadow-lg">
              GOAL! 🏆
            </div>
          </motion.div>
        </div>
      </main>

      {/* Swipe hint */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-indigo-600/10 backdrop-blur-sm px-4 py-2 rounded-full text-indigo-600 font-bold text-xs animate-pulse">
        Swipe right to see more ➔
      </div>
    </div>
  );
}
