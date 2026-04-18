import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { buildLevelMap, generateLevelQuestions, MODES } from '../data/levels';
import StarRating from '../components/StarRating';

export default function LevelMapScreen() {
  const { state, dispatch } = useGame();
  const mode = state.selectedMode;
  const levels = buildLevelMap(mode);
  const modeInfo = MODES.find((m) => m.id === mode);
  const modeProgress = state.progress[mode] || {};

  function isUnlocked(levelId) {
    if (levelId === 1) return true;
    return modeProgress[levelId]?.unlocked === true || modeProgress[levelId - 1]?.stars >= 1;
  }

  function handleStartLevel(level) {
    if (!isUnlocked(level.id)) return;
    const questions = generateLevelQuestions(level.mode, level.difficulty, level.questionsCount);
    dispatch({ type: 'START_LEVEL', level, questions });
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
        <div style={styles.headerInfo}>
          <span style={styles.modeIcon}>{modeInfo?.icon}</span>
          <h2 style={styles.modeTitle}>{modeInfo?.label}</h2>
        </div>
      </div>

      <div style={styles.levelList}>
        {levels.map((level, i) => {
          const unlocked = isUnlocked(level.id);
          const stars = modeProgress[level.id]?.stars || 0;
          const isPath = i < levels.length - 1;

          return (
            <React.Fragment key={level.id}>
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                style={{
                  ...styles.levelNode,
                  ...(unlocked ? styles.levelUnlocked : styles.levelLocked),
                  alignSelf: i % 2 === 0 ? 'flex-start' : 'flex-end',
                }}
                onClick={() => handleStartLevel(level)}
              >
                {!unlocked ? (
                  <span style={styles.lockIcon}>🔒</span>
                ) : (
                  <>
                    <div style={styles.levelNum}>{level.id}</div>
                    <div style={styles.levelLabel}>{level.label}</div>
                    <div style={styles.diffBadge}>{level.difficulty}</div>
                    {stars > 0 && <StarRating stars={stars} size={18} />}
                  </>
                )}
              </motion.div>
              {isPath && <div style={{ ...styles.connector, alignSelf: i % 2 === 0 ? 'flex-end' : 'flex-start' }}>↕</div>}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #f8f9fa 0%, #e9ecef 100%)',
    fontFamily: 'Nunito, sans-serif',
    overflowY: 'auto',
  },
  header: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '20px 24px', background: 'white',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 10,
  },
  backBtn: {
    background: '#f0f0f0', border: 'none', borderRadius: 10,
    padding: '8px 16px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
  },
  headerInfo: { display: 'flex', alignItems: 'center', gap: 8 },
  modeIcon: { fontSize: 28 },
  modeTitle: { fontSize: 22, fontWeight: 900, margin: 0, color: '#2D2D2D' },
  levelList: {
    display: 'flex', flexDirection: 'column', gap: 8,
    padding: '24px 32px', maxWidth: 400, margin: '0 auto',
  },
  levelNode: {
    borderRadius: 20, padding: '16px 20px', cursor: 'pointer',
    width: 140, textAlign: 'center',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    transition: 'transform 0.15s',
  },
  levelUnlocked: { background: 'white', border: '3px solid #6C63FF' },
  levelLocked: { background: '#e9ecef', cursor: 'not-allowed', opacity: 0.6 },
  lockIcon: { fontSize: 24 },
  levelNum: { fontSize: 28, fontWeight: 900, color: '#6C63FF' },
  levelLabel: { fontSize: 13, fontWeight: 700, color: '#555' },
  diffBadge: {
    display: 'inline-block', marginTop: 4,
    fontSize: 11, fontWeight: 700, padding: '2px 8px',
    borderRadius: 8, background: '#f0f0f0', color: '#888', textTransform: 'uppercase',
  },
  connector: { fontSize: 20, color: '#ccc', padding: '0 8px', width: 140, textAlign: 'center' },
};
