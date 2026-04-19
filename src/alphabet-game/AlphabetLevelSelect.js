import React from 'react';
import { LEVELS, getLettersByLevel } from './alphabetData';

const MODE_LABELS = {
  learning: 'Học Chữ 📖',
  quiz: 'Đố Vui 🎯',
  matching: 'Ghép Chữ 🧩',
  listening: 'Nghe Chọn 👂',
};

export default function AlphabetLevelSelect({ mode, levelProgress, onSelectLevel, onBack }) {
  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={onBack}>←</button>
        <div style={styles.modeTitle}>{MODE_LABELS[mode]}</div>
      </div>
      <div style={styles.grid}>
        {LEVELS.map(level => {
          const progress = levelProgress[level] || { unlocked: false, completed: false, stars: 0 };
          const letters = getLettersByLevel(level);
          return (
            <button
              key={level}
              style={{
                ...styles.levelCard,
                background: progress.unlocked
                  ? (progress.completed ? '#A8E6CF' : '#fff')
                  : '#e0e0e0',
                opacity: progress.unlocked ? 1 : 0.6,
                cursor: progress.unlocked ? 'pointer' : 'not-allowed',
              }}
              onClick={() => progress.unlocked && onSelectLevel(level)}
              disabled={!progress.unlocked}
            >
              <div style={styles.levelNum}>Bài {level}</div>
              <div style={styles.letters}>
                {letters.map(l => l.letter).join(' · ')}
              </div>
              <div style={styles.starsRow}>
                {[1, 2, 3].map(s => (
                  <span key={s} style={{ fontSize: 18 }}>
                    {s <= progress.stars ? '⭐' : '☆'}
                  </span>
                ))}
              </div>
              {!progress.unlocked && <div style={styles.lock}>🔒</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    padding: '16px',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  backBtn: {
    background: 'rgba(255,255,255,0.3)',
    border: 'none',
    color: '#fff',
    fontSize: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    cursor: 'pointer',
  },
  modeTitle: { fontSize: 22, fontWeight: 700, color: '#fff' },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 14,
    maxWidth: 420,
    margin: '0 auto',
  },
  levelCard: {
    border: 'none',
    borderRadius: 20,
    padding: '18px 12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    position: 'relative',
  },
  levelNum: { fontSize: 18, fontWeight: 700, color: '#333' },
  letters: { fontSize: 13, color: '#666', textAlign: 'center' },
  starsRow: { display: 'flex', gap: 2 },
  lock: { position: 'absolute', top: 8, right: 10, fontSize: 18 },
};
