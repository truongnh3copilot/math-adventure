import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { MODES, CHARACTERS } from '../data/levels';
import CharacterMascot from '../components/CharacterMascot';

export default function HomeScreen() {
  const { state, dispatch } = useGame();
  const character = CHARACTERS.find((c) => c.id === state.selectedCharacter) || CHARACTERS[0];

  return (
    <div style={styles.container}>
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={styles.header}
      >
        <div style={styles.mascotRow}>
          <CharacterMascot character={character} mood="idle" size={72} />
        </div>
        <h1 style={styles.title}>Math Adventure</h1>
        <p style={styles.subtitle}>Let's learn math today! 🌟</p>
        <div style={styles.statsRow}>
          <span style={styles.stat}>🪙 {state.totalCoins}</span>
          <span style={styles.stat}>🏅 {state.totalStickers}</span>
        </div>
      </motion.div>

      <div style={styles.modesGrid}>
        {MODES.map((mode, i) => (
          <motion.button
            key={mode.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.97 }}
            style={{ ...styles.modeCard, background: mode.color }}
            onClick={() => dispatch({ type: 'SELECT_MODE', mode: mode.id })}
          >
            <span style={styles.modeIcon}>{mode.icon}</span>
            <span style={styles.modeLabel}>{mode.label}</span>
            <span style={styles.modeDesc}>{mode.description}</span>
          </motion.button>
        ))}
      </div>

      <div style={styles.bottomRow}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={styles.secondaryBtn}
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'characterSelect' })}
        >
          🎭 Change Character
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={styles.secondaryBtn}
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'parentDashboard' })}
        >
          👨‍👩‍👧 Parent Dashboard
        </motion.button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #667eea 0%, #764ba2 100%)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '24px 16px 40px',
    fontFamily: 'Nunito, sans-serif',
  },
  header: { textAlign: 'center', marginBottom: 24 },
  mascotRow: { marginBottom: 8 },
  title: { fontSize: 40, fontWeight: 900, color: 'white', margin: '8px 0 4px', textShadow: '0 3px 10px rgba(0,0,0,0.2)' },
  subtitle: { fontSize: 18, color: 'rgba(255,255,255,0.85)', margin: '0 0 12px' },
  statsRow: { display: 'flex', gap: 20, justifyContent: 'center' },
  stat: { fontSize: 18, fontWeight: 700, color: 'white', background: 'rgba(255,255,255,0.2)', padding: '4px 16px', borderRadius: 20 },
  modesGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16, width: '100%', maxWidth: 480, marginBottom: 24,
  },
  modeCard: {
    border: 'none', borderRadius: 20, padding: '24px 16px',
    cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    color: 'white',
  },
  modeIcon: { fontSize: 36 },
  modeLabel: { fontSize: 18, fontWeight: 800, color: 'white', textShadow: '0 1px 4px rgba(0,0,0,0.15)' },
  modeDesc: { fontSize: 12, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },
  bottomRow: { display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' },
  secondaryBtn: {
    background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)',
    color: 'white', borderRadius: 14, padding: '10px 20px',
    fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
  },
};
