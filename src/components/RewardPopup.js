import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RewardPopup({ show, coins, sticker, onContinue }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={styles.overlay}
        >
          <motion.div
            initial={{ scale: 0.5, y: 60 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 60 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={styles.popup}
          >
            <div style={styles.emoji}>🎉</div>
            <h2 style={styles.title}>You earned!</h2>
            <div style={styles.rewardRow}>
              <span style={styles.rewardItem}>🪙 {coins} coins</span>
              {sticker > 0 && <span style={styles.rewardItem}>🏅 {sticker} sticker</span>}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={styles.btn}
              onClick={onContinue}
            >
              Continue!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 999,
  },
  popup: {
    background: 'white',
    borderRadius: 28,
    padding: '40px 48px',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    minWidth: 280,
  },
  emoji: { fontSize: 64, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: 900, color: '#2D2D2D', margin: '0 0 16px', fontFamily: 'Nunito, sans-serif' },
  rewardRow: { display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap' },
  rewardItem: { fontSize: 20, fontWeight: 700, color: '#555' },
  btn: {
    background: 'linear-gradient(135deg, #6C63FF, #a78bfa)',
    color: 'white', border: 'none', borderRadius: 16, padding: '14px 40px',
    fontSize: 20, fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
  },
};
