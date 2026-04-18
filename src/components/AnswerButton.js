import React from 'react';
import { motion } from 'framer-motion';

const VARIANTS = [
  'bg-rose-400 border-rose-600',
  'bg-sky-400 border-sky-600',
  'bg-amber-400 border-amber-600',
  'bg-emerald-400 border-emerald-600',
];

const LABELS = ['A', 'B', 'C', 'D'];

export default function AnswerButton({ value, index, onClick, disabled, revealed, isCorrect }) {
  const baseColor = VARIANTS[index % VARIANTS.length];
  const revealedColor = isCorrect ? 'bg-emerald-400 border-emerald-600' : 'bg-rose-400 border-rose-600';
  const colorClass = revealed ? revealedColor : baseColor;

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.04 } : {}}
      animate={revealed && isCorrect ? { scale: [1, 1.12, 1] } : {}}
      transition={{ duration: 0.25 }}
      disabled={disabled}
      onClick={() => { if (!disabled) onClick(value); }}
      className={`
        relative flex items-center gap-3 w-full rounded-2xl px-5 py-4
        border-b-[6px] border-2 text-white font-black text-2xl
        transition-all active:translate-y-1 active:border-b-0
        ${colorClass}
        ${disabled && !revealed ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
        shadow-sm
      `}
    >
      <span className="text-sm font-black bg-white/30 rounded-lg w-7 h-7 flex items-center justify-center shrink-0">
        {LABELS[index]}
      </span>
      <span className="flex-1 text-center">{value}</span>
    </motion.button>
  );
}
