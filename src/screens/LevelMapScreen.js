import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { buildLevelMap, generateLevelQuestions, MODES } from '../data/levels';
import StarRating from '../components/StarRating';

const LEVELS_BEFORE = 3;
const LEVELS_AFTER = 7;

export default function LevelMapScreen() {
  const { state, dispatch } = useGame();
  const scrollRef = useRef(null);
  const mode = state.selectedMode;
  const levels = buildLevelMap(mode);
  const modeInfo = MODES.find((m) => m.id === mode);
  const modeProgress = state.progress[mode] || {};

  function isUnlocked(levelId) {
    if (levelId === 1) return true;
    return modeProgress[levelId]?.unlocked === true || modeProgress[levelId - 1]?.stars >= 1;
  }

  // Find current level: first unlocked with 0 stars
  const currentIndex = levels.findIndex((level) => {
    return isUnlocked(level.id) && !(modeProgress[level.id]?.stars > 0);
  });
  const centerIndex = currentIndex === -1 ? levels.length - 1 : currentIndex;

  // Slice: 3 before, current, 7 after (max 10 + 1 = 11 visible)
  const start = Math.max(0, centerIndex - LEVELS_BEFORE);
  const end = Math.min(levels.length, centerIndex + LEVELS_AFTER + 1);
  const visibleLevels = levels.slice(start, end);

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
        <div style={styles.rangeLabel}>
          Levels {start + 1}–{end}
        </div>
      </div>

      {/* Horizontal scrollable track */}
      <div ref={scrollRef} style={styles.scrollWrapper}>
        <div style={styles.track}>
          {visibleLevels.map((level, i) => {
            const unlocked = isUnlocked(level.id);
            const stars = modeProgress[level.id]?.stars || 0;
            const isCurrent = level.id === (levels[centerIndex]?.id);
            // Sinusoidal vertical offset for wave effect
            const yOffset = Math.sin(i * 1.4) * 60;

            return (
              <React.Fragment key={level.id}>
                {/* Connector line between nodes */}
                {i > 0 && (
                  <div style={styles.connector}>
                    <div style={styles.connectorLine} />
                  </div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: yOffset }}
                  transition={{ delay: i * 0.05, type: 'spring', stiffness: 200 }}
                  style={{
                    ...styles.levelWrapper,
                  }}
                >
                  <motion.div
                    whileTap={{ scale: 0.92 }}
                    whileHover={unlocked ? { scale: 1.06 } : {}}
                    style={{
                      ...styles.levelNode,
                      ...(unlocked ? styles.levelUnlocked : styles.levelLocked),
                      ...(isCurrent ? styles.levelCurrent : {}),
                    }}
                    onClick={() => handleStartLevel(level)}
                  >
                    {!unlocked ? (
                      <span style={styles.lockIcon}>🔒</span>
                    ) : (
                      <>
                        <div style={{ ...styles.levelNum, color: isCurrent ? '#fff' : '#6C63FF' }}>
                          {level.id}
                        </div>
                        <div style={{ ...styles.levelLabel, color: isCurrent ? '#ffe' : '#555' }}>
                          {level.difficulty}
                        </div>
                        {stars > 0 && <StarRating stars={stars} size={14} />}
                      </>
                    )}
                    {isCurrent && (
                      <motion.div
                        style={styles.currentPulse}
                        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ repeat: Infinity, duration: 1.6 }}
                      />
                    )}
                  </motion.div>
                  <div style={{
                    ...styles.nodeLabel,
                    color: isCurrent ? '#6C63FF' : unlocked ? '#555' : '#aaa',
                    fontWeight: isCurrent ? 900 : 700,
                  }}>
                    Lvl {level.id}
                  </div>
                </motion.div>
              </React.Fragment>
            );
          })}

          {/* Trophy at the end */}
          <div style={styles.connector}><div style={styles.connectorLine} /></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: end >= levels.length ? 1 : 0.3, scale: 1 }}
            transition={{ delay: visibleLevels.length * 0.05 }}
            style={styles.trophy}
          >
            🏆
            <div style={styles.trophyLabel}>Goal!</div>
          </motion.div>
        </div>

        <div style={styles.swipeHint}>← Swipe to navigate →</div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #f0f4ff 0%, #e9ecef 100%)',
    fontFamily: 'Nunito, sans-serif',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '16px 24px', background: 'white',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 10,
  },
  backBtn: {
    background: '#f0f0f0', border: 'none', borderRadius: 10,
    padding: '8px 16px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
  },
  headerInfo: { display: 'flex', alignItems: 'center', gap: 8, flex: 1 },
  modeIcon: { fontSize: 28 },
  modeTitle: { fontSize: 22, fontWeight: 900, margin: 0, color: '#2D2D2D' },
  rangeLabel: {
    fontSize: 12, fontWeight: 700, color: '#888',
    background: '#f0f0f0', borderRadius: 8, padding: '4px 10px',
  },
  scrollWrapper: {
    flex: 1,
    overflowX: 'auto',
    overflowY: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    WebkitOverflowScrolling: 'touch',
    padding: '60px 40px',
  },
  track: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 'max-content',
    paddingBottom: 80,
    position: 'relative',
  },
  connector: {
    display: 'flex',
    alignItems: 'center',
    width: 40,
    flexShrink: 0,
  },
  connectorLine: {
    width: '100%',
    height: 4,
    background: 'linear-gradient(90deg, #c5cae9, #9fa8da)',
    borderRadius: 2,
  },
  levelWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
    position: 'relative',
  },
  levelNode: {
    borderRadius: '50%',
    width: 80,
    height: 80,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.15s',
  },
  levelUnlocked: {
    background: 'white',
    border: '3px solid #6C63FF',
  },
  levelLocked: {
    background: '#e9ecef',
    cursor: 'not-allowed',
    opacity: 0.55,
    border: '3px solid #ccc',
  },
  levelCurrent: {
    background: 'linear-gradient(135deg, #6C63FF, #a78bfa)',
    border: '4px solid #fff',
    boxShadow: '0 8px 28px rgba(108,99,255,0.45)',
    width: 96,
    height: 96,
  },
  currentPulse: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    background: 'rgba(108,99,255,0.3)',
    pointerEvents: 'none',
  },
  lockIcon: { fontSize: 24 },
  levelNum: { fontSize: 26, fontWeight: 900, lineHeight: 1 },
  levelLabel: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', marginTop: 2 },
  nodeLabel: { fontSize: 12, fontFamily: 'Nunito, sans-serif', textAlign: 'center' },
  trophy: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    fontSize: 40, marginLeft: 8, flexShrink: 0,
  },
  trophyLabel: {
    fontSize: 11, fontWeight: 900, color: '#f59e0b',
    marginTop: 4, letterSpacing: 1,
  },
  swipeHint: {
    textAlign: 'center', fontSize: 12, color: '#aaa',
    fontWeight: 700, paddingTop: 8, letterSpacing: 1,
  },
};
