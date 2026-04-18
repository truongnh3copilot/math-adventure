import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { CHARACTERS } from '../data/levels';

export default function CharacterSelectScreen() {
  const { state, dispatch } = useGame();

  function handleSelect(character) {
    dispatch({ type: 'SELECT_CHARACTER', character: character.id });
    dispatch({ type: 'SET_SCREEN', screen: 'home' });
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          style={styles.backBtn}
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'home' })}
        >
          ← Back
        </motion.button>
        <h2 style={styles.title}>Choose Your Friend</h2>
      </div>

      <div style={styles.grid}>
        {CHARACTERS.map((char, i) => {
          const selected = state.selectedCharacter === char.id;
          return (
            <motion.div
              key={char.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              style={{
                ...styles.card,
                border: selected ? `3px solid ${char.color}` : '3px solid transparent',
                boxShadow: selected ? `0 4px 20px ${char.color}55` : '0 4px 16px rgba(0,0,0,0.08)',
              }}
              onClick={() => handleSelect(char)}
            >
              <motion.span
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                style={styles.emoji}
              >
                {char.emoji}
              </motion.span>
              <div style={styles.name}>{char.name}</div>
              <div style={styles.desc}>{char.description}</div>
              {selected && <div style={{ ...styles.badge, background: char.color }}>Selected ✓</div>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #667eea 0%, #764ba2 100%)',
    fontFamily: 'Nunito, sans-serif',
  },
  header: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '20px 24px', color: 'white',
  },
  backBtn: {
    background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
    borderRadius: 10, padding: '8px 16px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
  },
  title: { fontSize: 26, fontWeight: 900, margin: 0 },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16, padding: '16px 24px', maxWidth: 500, margin: '0 auto',
  },
  card: {
    background: 'white', borderRadius: 20, padding: '24px 16px',
    textAlign: 'center', cursor: 'pointer',
  },
  emoji: { fontSize: 56, display: 'block', marginBottom: 8 },
  name: { fontSize: 20, fontWeight: 800, color: '#2D2D2D' },
  desc: { fontSize: 13, color: '#888', marginTop: 4 },
  badge: { marginTop: 10, display: 'inline-block', color: 'white', borderRadius: 10, padding: '4px 12px', fontSize: 13, fontWeight: 700 },
};
