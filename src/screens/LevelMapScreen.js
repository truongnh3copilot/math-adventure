import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Lock, Star, Trophy, Home } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { buildLevelMap, generateLevelQuestions, MODES } from '../data/levels';

const LEVELS_BEFORE = 3;
const LEVELS_AFTER  = 7;

const LEVEL_ICONS = ['🍎', '🚀', '🎈', '🐱', '💎', '🌈', '⭐', '🎯', '🔥', '🎪'];

const DIFFICULTY_COLORS = {
  easy:   'bg-emerald-400 border-emerald-600',
  medium: 'bg-sky-400 border-sky-600',
  hard:   'bg-orange-400 border-orange-600',
  expert: 'bg-purple-400 border-purple-600',
};

export default function LevelMapScreen() {
  const { state, dispatch } = useGame();
  const mode       = state.selectedMode;
  const modeInfo   = MODES.find((m) => m.id === mode);
  const modeProgress = state.progress[mode] || {};

  // Build level map once per mode
  const levels = useMemo(() => buildLevelMap(mode), [mode]);

  const totalStars = useMemo(
    () => Object.values(modeProgress).reduce((sum, p) => sum + (p?.stars || 0), 0),
    [modeProgress]
  );

  function isUnlocked(levelId) {
    if (levelId === 1) return true;
    return modeProgress[levelId]?.unlocked === true || modeProgress[levelId - 1]?.stars >= 1;
  }

  const centerIndex = useMemo(() => {
    const idx = levels.findIndex(
      (level) =>
        (level.id === 1 || modeProgress[level.id]?.unlocked || modeProgress[level.id - 1]?.stars >= 1) &&
        !(modeProgress[level.id]?.stars > 0)
    );
    return idx === -1 ? levels.length - 1 : idx;
  }, [levels, modeProgress]);

  const start = Math.max(0, centerIndex - LEVELS_BEFORE);
  const end   = Math.min(levels.length, centerIndex + LEVELS_AFTER + 1);
  const visibleLevels = levels.slice(start, end);

  function handleStartLevel(level) {
    if (!isUnlocked(level.id)) return;
    const questions = generateLevelQuestions(level.mode, level.id, level.questionsCount);
    dispatch({ type: 'START_LEVEL', level, questions });
  }

  return (
    <div className="min-h-screen bg-[#eef2ff] font-sans text-slate-900 overflow-x-auto overflow-y-hidden relative select-none">

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="max-w-xl mx-auto flex items-center justify-between bg-white rounded-2xl shadow-[0_8px_0_0_#e2e8f0] px-4 py-3 border-2 border-slate-200">
          <button
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors active:translate-y-0.5"
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

      {/* Level track — static layout, no spring animations per node */}
      <main className="h-screen flex items-center px-20 min-w-max pt-24">
        <div className="relative flex items-center gap-24 py-20">

          {/* Background path */}
          <div className="absolute left-10 right-10 h-4 bg-slate-300/30 rounded-full top-1/2 -translate-y-1/2 -z-10" />

          {visibleLevels.map((level, i) => {
            const unlocked    = isUnlocked(level.id);
            const stars       = modeProgress[level.id]?.stars || 0;
            const isCompleted = stars > 0;
            const isCurrent   = level.id === levels[centerIndex]?.id;
            const icon        = LEVEL_ICONS[(level.id - 1) % LEVEL_ICONS.length];
            const colorClass  = DIFFICULTY_COLORS[level.difficulty] || DIFFICULTY_COLORS.easy;
            // Static sinusoidal offset — no animation, just CSS transform
            const yOffset     = Math.sin(i * 1.5) * 80;

            return (
              <div
                key={level.id}
                className="level-node-enter relative flex flex-col items-center"
                style={{ transform: `translateY(${yOffset}px)`, animationDelay: `${i * 30}ms` }}
              >
                {/* Stars above completed */}
                {isCompleted && (
                  <div className="absolute -top-8 flex gap-0.5">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        size={16}
                        className={s <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-300 fill-slate-300'}
                      />
                    ))}
                  </div>
                )}

                {/* Level circle */}
                <button
                  onClick={() => handleStartLevel(level)}
                  disabled={!unlocked}
                  className={[
                    'relative flex items-center justify-center rounded-full text-5xl',
                    'border-b-[10px] transition-transform duration-100 active:scale-95',
                    unlocked
                      ? `${colorClass} shadow-xl`
                      : 'bg-slate-300 border-slate-400 cursor-not-allowed',
                    isCurrent
                      ? 'w-32 h-32 text-6xl animate-bounce ring-8 ring-white/50'
                      : 'w-28 h-28',
                  ].join(' ')}
                >
                  {!unlocked
                    ? <Lock size={36} className="text-slate-500" />
                    : <span className="drop-shadow-md">{icon}</span>
                  }
                </button>

                {/* Level label */}
                <div className={[
                  'mt-5 px-5 py-1 rounded-full font-black text-sm border-2 whitespace-nowrap',
                  !unlocked
                    ? 'bg-slate-200 border-slate-300 text-slate-400'
                    : 'bg-white border-slate-200 text-slate-700 shadow-sm',
                ].join(' ')}>
                  LVL {level.id}
                </div>
              </div>
            );
          })}

          {/* Trophy — one motion element is fine */}
          <motion.div
            className="relative ml-10"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: end >= levels.length ? 1 : 0.3, scale: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <div className="w-36 h-36 bg-yellow-400 rounded-[36px] border-b-[10px] border-yellow-600 flex items-center justify-center shadow-xl -rotate-6">
              <Trophy size={72} className="text-white drop-shadow-md" />
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-6 py-1.5 rounded-full border-4 border-yellow-500 font-black text-yellow-600 whitespace-nowrap text-base shadow-md">
              GOAL! 🏆
            </div>
          </motion.div>
        </div>
      </main>

      {/* Swipe hint */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-indigo-600/10 px-4 py-2 rounded-full text-indigo-600 font-bold text-xs animate-pulse pointer-events-none">
        Swipe right to see more ➔
      </div>
    </div>
  );
}
