import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FeedbackOverlay({ show, correct }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.25 }}
          style={{
            ...styles.overlay,
            background: correct ? 'rgba(81,207,102,0.92)' : 'rgba(255,107,107,0.92)',
          }}
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            style={styles.content}
          >
            <div style={styles.icon}>{correct ? '🎉' : '💙'}</div>
            <div style={styles.text}>{correct ? 'Correct!' : 'Try again!'}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 500, pointerEvents: 'none',
    borderRadius: 0,
  },
  content: { textAlign: 'center' },
  icon: { fontSize: 80 },
  text: { fontSize: 40, fontWeight: 900, color: 'white', fontFamily: 'Nunito, sans-serif', textShadow: '0 2px 8px rgba(0,0,0,0.2)' },
};
