import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FeedbackOverlay({ show, correct, timedOut, onTryAgain }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`fixed inset-0 flex items-center justify-center z-50 ${
            correct ? 'pointer-events-none bg-emerald-400/80' : 'bg-rose-400/80'
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
            {correct ? (
              <div className="bg-white rounded-2xl border-b-[6px] border-2 px-10 py-3 shadow-lg border-slate-200">
                <span className="text-3xl font-black text-emerald-500">Correct!</span>
              </div>
            ) : (
              <button
                onClick={onTryAgain}
                className="bg-white rounded-2xl border-b-[6px] border-2 px-10 py-3 shadow-lg border-slate-200 active:border-b-2 active:translate-y-1 transition-all"
              >
                <span className="text-3xl font-black text-rose-500">{timedOut ? 'Try Again! +15s' : 'Try Again!'}</span>
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
