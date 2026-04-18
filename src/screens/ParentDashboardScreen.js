import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { MODES } from '../data/levels';
import StarRating from '../components/StarRating';

export default function ParentDashboardScreen() {
  const { state, dispatch } = useGame();
  const { progress, totalCoins, totalStickers } = state;

  function getTotalStars(modeId) {
    const p = progress[modeId] || {};
    return Object.values(p).reduce((sum, l) => sum + (l.stars || 0), 0);
  }

  function getLevelsCompleted(modeId) {
    const p = progress[modeId] || {};
    return Object.values(p).filter((l) => l.stars > 0).length;
  }

  function handleReset() {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      localStorage.removeItem('math_adventure_progress');
      window.location.reload();
    }
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
        <h2 style={styles.title}>Parent Dashboard</h2>
      </div>

      <div style={styles.content}>
        <div style={styles.summaryRow}>
          <div style={styles.summaryCard}>
            <span style={styles.summaryIcon}>🪙</span>
            <div style={styles.summaryVal}>{totalCoins}</div>
            <div style={styles.summaryLabel}>Total Coins</div>
          </div>
          <div style={styles.summaryCard}>
            <span style={styles.summaryIcon}>🏅</span>
            <div style={styles.summaryVal}>{totalStickers}</div>
            <div style={styles.summaryLabel}>Stickers Earned</div>
          </div>
          <div style={styles.summaryCard}>
            <span style={styles.summaryIcon}>⭐</span>
            <div style={styles.summaryVal}>{MODES.reduce((s, m) => s + getTotalStars(m.id), 0)}</div>
            <div style={styles.summaryLabel}>Total Stars</div>
          </div>
        </div>

        <h3 style={styles.sectionTitle}>Progress by Mode</h3>
        {MODES.map((mode) => {
          const totalStars = getTotalStars(mode.id);
          const completed = getLevelsCompleted(mode.id);
          const modeProgress = progress[mode.id] || {};

          return (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              style={styles.modeBlock}
            >
              <div style={styles.modeHeader}>
                <span style={{ fontSize: 24 }}>{mode.icon}</span>
                <div>
                  <div style={styles.modeName}>{mode.label}</div>
                  <div style={styles.modeSub}>{completed}/10 levels complete</div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <StarRating stars={Math.min(3, Math.round(totalStars / Math.max(1, completed)))} size={20} />
                </div>
              </div>

              {completed > 0 && (
                <div style={styles.levelGrid}>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((lvl) => {
                    const s = modeProgress[lvl]?.stars || 0;
                    return (
                      <div key={lvl} style={{ ...styles.levelDot, background: s > 0 ? '#6C63FF' : '#e9ecef' }}>
                        <span style={styles.levelDotNum}>{lvl}</span>
                        {s > 0 && <span style={styles.levelDotStar}>{'⭐'.repeat(s)}</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          );
        })}

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={styles.resetBtn}
          onClick={handleReset}
        >
          🔄 Reset Progress
        </motion.button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8f9fa',
    fontFamily: 'Nunito, sans-serif',
  },
  header: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '20px 24px', background: 'white',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  backBtn: {
    background: '#f0f0f0', border: 'none', borderRadius: 10,
    padding: '8px 16px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
  },
  title: { fontSize: 22, fontWeight: 900, margin: 0, color: '#2D2D2D' },
  content: { padding: '24px', maxWidth: 600, margin: '0 auto' },
  summaryRow: { display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' },
  summaryCard: {
    flex: 1, minWidth: 100, background: 'white', borderRadius: 16, padding: '16px',
    textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  summaryIcon: { fontSize: 28 },
  summaryVal: { fontSize: 28, fontWeight: 900, color: '#2D2D2D', margin: '4px 0' },
  summaryLabel: { fontSize: 12, color: '#aaa', fontWeight: 700 },
  sectionTitle: { fontSize: 18, fontWeight: 900, color: '#2D2D2D', marginBottom: 12 },
  modeBlock: {
    background: 'white', borderRadius: 16, padding: '16px 20px',
    marginBottom: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  modeHeader: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 },
  modeName: { fontSize: 16, fontWeight: 800, color: '#2D2D2D' },
  modeSub: { fontSize: 12, color: '#aaa' },
  levelGrid: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  levelDot: {
    borderRadius: 8, padding: '4px 8px', minWidth: 32,
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  levelDotNum: { fontSize: 11, fontWeight: 700, color: 'white' },
  levelDotStar: { fontSize: 8 },
  resetBtn: {
    marginTop: 24, display: 'block', width: '100%',
    background: '#fff0f0', border: '2px solid #FF6B6B', color: '#FF6B6B',
    borderRadius: 14, padding: '12px', fontSize: 16, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
  },
};
