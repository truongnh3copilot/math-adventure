import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FeedbackOverlay({ show, correct }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`fixed inset-0 flex items-center justify-center z-50 pointer-events-none ${
            correct ? 'bg-emerald-400/80' : 'bg-rose-400/80'
          }`}
        >
          <motion.div
            initial={{ scale: 0.5, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 30 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="flex flex-col items-center gap-3"
          >
            <span className="text-8xl drop-shadow-xl">{correct ? '🎉' : '💙'}</span>
            <div className="bg-white rounded-2xl border-b-[6px] border-2 px-10 py-3 shadow-lg border-slate-200">
              <span className={`text-3xl font-black ${correct ? 'text-emerald-500' : 'text-rose-500'}`}>
                {correct ? 'Correct!' : 'Try again!'}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
