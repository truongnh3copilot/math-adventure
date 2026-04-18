import React, { useMemo, useRef, useEffect } from 'react';
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

// Decorative tree SVG
function Tree({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} style={{ pointerEvents: 'none' }}>
      <rect x="-5" y="28" width="10" height="16" rx="2" fill="#8B5E3C" />
      <polygon points="0,-20 22,28 -22,28" fill="#2d8a4e" />
      <polygon points="0,-36 18,10 -18,10" fill="#34a85a" />
      <polygon points="0,-50 14,-8 -14,-8" fill="#45c46a" />
    </g>
  );
}

// Bush SVG
function Bush({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`} style={{ pointerEvents: 'none' }}>
      <circle cx="0" cy="0" r="14" fill="#34a85a" />
      <circle cx="14" cy="4" r="12" fill="#2d8a4e" />
      <circle cx="-12" cy="4" r="11" fill="#45c46a" />
    </g>
  );
}

export default function LevelMapScreen() {
  const { state, dispatch } = useGame();
  const scrollRef    = useRef(null);
  const currentRef   = useRef(null);
  const mode         = state.selectedMode;
  const modeInfo     = MODES.find((m) => m.id === mode);
  const modeProgress = state.progress[mode] || {};

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

  useEffect(() => {
    if (!scrollRef.current || !currentRef.current) return;
    const container = scrollRef.current;
    const node      = currentRef.current;
    const nodeCenter = node.offsetLeft + node.offsetWidth / 2;
    const target     = nodeCenter - container.clientWidth / 2;
    container.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, []);

  function handleStartLevel(level) {
    if (!isUnlocked(level.id)) return;
    const questions = generateLevelQuestions(level.mode, level.id, level.questionsCount);
    dispatch({ type: 'START_LEVEL', level, questions });
  }

  return (
    <div
      ref={scrollRef}
      className="min-h-screen font-sans text-slate-900 overflow-x-auto overflow-y-hidden relative select-none"
      style={{ background: 'linear-gradient(to bottom, #60b8e8 0%, #a8d8f0 35%, #c5eea0 65%, #6dbf4a 100%)' }}
    >

      {/* ── Fixed scenic background ── */}

      {/* Sun */}
      <div className="fixed top-16 right-16 pointer-events-none z-0" style={{ opacity: 0.9 }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="24" fill="#FFD700" />
          {[0,45,90,135,180,225,270,315].map((deg, i) => (
            <line
              key={i}
              x1="40" y1="40"
              x2={40 + 36 * Math.cos(deg * Math.PI / 180)}
              y2={40 + 36 * Math.sin(deg * Math.PI / 180)}
              stroke="#FFD700" strokeWidth="4" strokeLinecap="round"
            />
          ))}
          <circle cx="40" cy="40" r="20" fill="#FBBF24" />
        </svg>
      </div>

      {/* Clouds (fixed, animated with CSS) */}
      <div className="fixed top-14 left-[8%] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '4s' }}>
        <svg width="110" height="50" viewBox="0 0 110 50">
          <circle cx="30" cy="32" r="22" fill="white" opacity="0.92" />
          <circle cx="55" cy="22" r="26" fill="white" opacity="0.92" />
          <circle cx="82" cy="32" r="20" fill="white" opacity="0.92" />
          <rect x="10" y="32" width="90" height="18" fill="white" opacity="0.92" />
        </svg>
      </div>
      <div className="fixed top-8 left-[38%] pointer-events-none z-0 animate-bounce" style={{ animationDuration: '6s' }}>
        <svg width="80" height="38" viewBox="0 0 80 38">
          <circle cx="22" cy="24" r="16" fill="white" opacity="0.85" />
          <circle cx="42" cy="16" r="20" fill="white" opacity="0.85" />
          <circle cx="62" cy="24" r="15" fill="white" opacity="0.85" />
          <rect x="6" y="24" width="68" height="14" fill="white" opacity="0.85" />
        </svg>
      </div>
      <div className="fixed top-20 right-[28%] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '5s' }}>
        <svg width="90" height="42" viewBox="0 0 90 42">
          <circle cx="26" cy="28" r="18" fill="white" opacity="0.8" />
          <circle cx="48" cy="18" r="22" fill="white" opacity="0.8" />
          <circle cx="70" cy="28" r="16" fill="white" opacity="0.8" />
          <rect x="8" y="28" width="74" height="14" fill="white" opacity="0.8" />
        </svg>
      </div>

      {/* Rolling hills (fixed bottom) */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0" style={{ height: 120 }}>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" width="100%" height="120">
          <path d="M0,80 C180,20 360,100 540,60 C720,20 900,90 1080,50 C1260,10 1350,70 1440,60 L1440,120 L0,120 Z"
            fill="#4a9e2f" opacity="0.9" />
          <path d="M0,95 C200,50 400,110 600,75 C800,40 1000,100 1200,70 C1350,50 1400,85 1440,80 L1440,120 L0,120 Z"
            fill="#3d8a25" />
          {/* Ground strip */}
          <rect x="0" y="108" width="1440" height="12" fill="#2d6e1a" />
        </svg>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="max-w-xl mx-auto flex items-center justify-between bg-white/90 rounded-2xl shadow-[0_8px_0_0_#e2e8f0] px-4 py-3 border-2 border-slate-200 backdrop-blur-sm">
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

      {/* Level track */}
      <main className="h-screen flex items-center px-20 min-w-max pt-24 pb-28 relative z-10">
        <div className="relative flex items-center gap-24 py-20">

          {/* Dirt path line */}
          <div
            className="absolute left-10 right-10 top-1/2 -translate-y-1/2 -z-10 rounded-full"
            style={{
              height: 12,
              background: 'repeating-linear-gradient(90deg, #c8a96e 0px, #c8a96e 24px, #b8975a 24px, #b8975a 32px)',
              boxShadow: '0 3px 0 #9a7a45',
              borderRadius: 8,
            }}
          />

          {/* Scattered trees between nodes */}
          <svg
            className="absolute top-0 left-0 w-full h-full -z-10 overflow-visible"
            style={{ pointerEvents: 'none' }}
          >
            {visibleLevels.map((_, i) => {
              const x = i * (112 + 96) + 56;
              const yOffset = Math.sin(i * 1.5) * 80;
              const baseY = 160;
              return (
                <g key={i}>
                  {i % 3 === 0 && <Tree x={x - 70} y={baseY + yOffset - 60} scale={0.7} />}
                  {i % 2 === 0 && <Bush x={x + 60} y={baseY + yOffset + 30} />}
                  {i % 4 === 1 && <Tree x={x + 80} y={baseY + yOffset - 40} scale={0.6} />}
                </g>
              );
            })}
          </svg>

          {visibleLevels.map((level, i) => {
            const unlocked    = isUnlocked(level.id);
            const stars       = modeProgress[level.id]?.stars || 0;
            const isCompleted = stars > 0;
            const isCurrent   = level.id === levels[centerIndex]?.id;
            const icon        = LEVEL_ICONS[(level.id - 1) % LEVEL_ICONS.length];
            const colorClass  = DIFFICULTY_COLORS[level.difficulty] || DIFFICULTY_COLORS.easy;
            const yOffset     = Math.sin(i * 1.5) * 80;

            return (
              <div
                key={level.id}
                ref={isCurrent ? currentRef : null}
                className="level-node-enter relative flex flex-col items-center"
                style={{ transform: `translateY(${yOffset}px)`, animationDelay: `${i * 30}ms` }}
              >
                {isCompleted && (
                  <div className="absolute -top-8 flex gap-0.5">
                    {[1, 2, 3].map((s) => (
                      <Star key={s} size={16}
                        className={s <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-300 fill-slate-300'}
                      />
                    ))}
                  </div>
                )}

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
                      ? 'w-32 h-32 text-6xl animate-bounce ring-8 ring-white/60'
                      : 'w-28 h-28',
                  ].join(' ')}
                >
                  {!unlocked
                    ? <Lock size={36} className="text-slate-500" />
                    : <span className="drop-shadow-md">{icon}</span>
                  }
                </button>

                <div className={[
                  'mt-4 px-5 py-1 rounded-full font-black text-sm border-2 whitespace-nowrap shadow-sm',
                  !unlocked
                    ? 'bg-white/60 border-slate-300 text-slate-400'
                    : 'bg-white border-slate-200 text-slate-700',
                ].join(' ')}>
                  LVL {level.id}
                </div>
              </div>
            );
          })}

          {/* Trophy */}
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
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/70 px-4 py-2 rounded-full text-indigo-600 font-bold text-xs animate-pulse pointer-events-none z-20 backdrop-blur-sm border border-white/60">
        Swipe right to see more ➔
      </div>
    </div>
  );
}
