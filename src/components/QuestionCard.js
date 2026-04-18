import React from 'react';
import { motion } from 'framer-motion';

export default function QuestionCard({ question, questionNumber, total }) {
  return (
    <motion.div
      key={questionNumber}
      initial={{ scale: 0.85, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="bg-white rounded-2xl border-2 border-slate-200 shadow-[0_8px_0_0_#e2e8f0] px-8 py-8 text-center w-full"
    >
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
        Question {questionNumber} / {total}
      </p>

      <p className="text-6xl font-black text-slate-800 leading-none tracking-tight">
        {question.text}
      </p>

      {question.hint && (
        <div className="mt-5 flex items-center justify-center gap-2 flex-wrap">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Hint</span>
          <span className="text-2xl tracking-widest">{question.hint}</span>
        </div>
      )}
    </motion.div>
  );
}
