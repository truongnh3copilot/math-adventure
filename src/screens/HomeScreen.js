import React from 'react';
import { motion } from 'framer-motion';
import { Star, Trophy, User } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { MODES } from '../data/levels';

const MODE_STYLES = {
  addition:       { bg: 'bg-emerald-400', border: 'border-emerald-600', shadow: 'shadow-[0_8px_0_0_#059669]' },
  subtraction:    { bg: 'bg-sky-400',     border: 'border-sky-600',     shadow: 'shadow-[0_8px_0_0_#0284c7]' },
  multiplication: { bg: 'bg-orange-400',  border: 'border-orange-600',  shadow: 'shadow-[0_8px_0_0_#ea580c]' },
  mixed:          { bg: 'bg-violet-400',  border: 'border-violet-600',  shadow: 'shadow-[0_8px_0_0_#7c3aed]' },
};

const MODE_DESC = {
  addition:       'Add numbers & score big!',
  subtraction:    'Take away & level up!',
  multiplication: 'Multiply your power!',
  mixed:          'All-in challenge mode!',
};

export default function HomeScreen() {
  const { state, dispatch } = useGame();

  return (
    <div className="min-h-screen bg-[#eef2ff] font-sans text-slate-900 relative overflow-hidden select-none flex flex-col">

      {/* Floating background clouds */}
      <div className="absolute top-10 left-1/4 text-6xl opacity-20 animate-bounce pointer-events-none">☁️</div>
      <div className="absolute top-32 right-1/4 text-5xl opacity-20 animate-pulse pointer-events-none">☁️</div>
      <div className="absolute bottom-40 left-1/3 text-4xl opacity-15 animate-bounce pointer-events-none">☁️</div>

      {/* Top bar */}
      <header className="p-4">
        <div className="max-w-lg mx-auto flex items-center justify-between bg-white rounded-2xl shadow-[0_8px_0_0_#e2e8f0] px-4 py-3 border-2 border-slate-200">
          {/* Coins */}
          <div className="flex items-center gap-2 bg-amber-400 px-3 py-1.5 rounded-xl shadow-[0_4px_0_0_#d97706] border-2 border-amber-500">
            <span className="text-lg">🪙</span>
            <span className="font-black text-white text-base">{state.totalCoins}</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Math Quest</span>
            <div className="flex gap-0.5">
              {[1, 2, 3].map((s) => (
                <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
              ))}
            </div>
          </div>

          {/* Stickers */}
          <div className="flex items-center gap-2 bg-indigo-400 px-3 py-1.5 rounded-xl shadow-[0_4px_0_0_#4338ca] border-2 border-indigo-500">
            <span className="text-lg">🏅</span>
            <span className="font-black text-white text-base">{state.totalStickers}</span>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="flex flex-col items-center px-4 pt-2 pb-6"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
          className="text-8xl mb-3 drop-shadow-xl"
        >
          🧮
        </motion.div>

        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-[0_8px_0_0_#e2e8f0] px-8 py-4 text-center max-w-xs">
          <h1 className="text-4xl font-black text-indigo-600 uppercase tracking-tight leading-none">
            Math Quest!
          </h1>
          <p className="text-slate-500 font-bold text-sm mt-1">
            Pick a mode & start your adventure 🚀
          </p>
        </div>
      </motion.div>

      {/* Mode cards grid */}
      <div className="grid grid-cols-2 gap-4 px-4 max-w-lg mx-auto w-full">
        {MODES.map((mode, i) => {
          const ms = MODE_STYLES[mode.id] || MODE_STYLES.mixed;
          return (
            <motion.button
              key={mode.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 220 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95, y: 6 }}
              onClick={() => dispatch({ type: 'SELECT_MODE', mode: mode.id })}
              className={`
                flex flex-col items-center gap-2 rounded-2xl px-4 py-6
                border-2 border-b-[10px] cursor-pointer text-white
                transition-all active:border-b-2
                ${ms.bg} ${ms.border} ${ms.shadow}
              `}
            >
              <span className="text-5xl drop-shadow-lg">{mode.icon}</span>
              <span className="font-black text-lg uppercase tracking-wide leading-none">
                {mode.label}
              </span>
              <span className="text-xs font-bold opacity-90 text-center">
                {MODE_DESC[mode.id]}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Bottom actions */}
      <div className="flex gap-3 justify-center px-4 mt-6 max-w-lg mx-auto w-full flex-wrap">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'characterSelect' })}
          className="flex items-center gap-2 bg-white border-2 border-b-[6px] border-slate-300 shadow-[0_6px_0_0_#cbd5e1] rounded-2xl px-5 py-3 font-black text-slate-600 text-sm transition-all active:translate-y-1 active:border-b-2"
        >
          <User size={18} className="text-indigo-400" />
          Change Character
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'parentDashboard' })}
          className="flex items-center gap-2 bg-white border-2 border-b-[6px] border-slate-300 shadow-[0_6px_0_0_#cbd5e1] rounded-2xl px-5 py-3 font-black text-slate-600 text-sm transition-all active:translate-y-1 active:border-b-2"
        >
          <Trophy size={18} className="text-amber-400" />
          Parent Dashboard
        </motion.button>
      </div>

      {/* Footer hint */}
      <div className="text-center py-6 mt-auto">
        <span className="text-xs font-black text-slate-300 uppercase tracking-widest">
          100 levels · 4 modes · Let's go! 🎯
        </span>
      </div>
    </div>
  );
}
