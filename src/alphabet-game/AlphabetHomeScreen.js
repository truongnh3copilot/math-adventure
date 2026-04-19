import React from 'react';

const MODES = [
  { mode: 'learning', label: 'Học Chữ', emoji: '📖', color: '#FF6B6B' },
  { mode: 'quiz', label: 'Đố Vui', emoji: '🎯', color: '#4ECDC4' },
  { mode: 'matching', label: 'Ghép Chữ', emoji: '🧩', color: '#FFE66D' },
  { mode: 'listening', label: 'Nghe Chọn', emoji: '👂', color: '#A8E6CF' },
];

export default function AlphabetHomeScreen({ totalStars, onSelectMode, onReset, onBack }) {
  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={onBack}>← Quay lại</button>
      </div>
      <div style={styles.header}>
        <div style={styles.title}>Học Chữ Cái</div>
        <div style={styles.subtitle}>Tiếng Việt 🇻🇳</div>
        <div style={styles.stars}>⭐ {totalStars} sao</div>
      </div>

      <div style={styles.grid}>
        {MODES.map(({ mode, label, emoji, color }) => (
          <button
            key={mode}
            style={{ ...styles.card, background: color }}
            onClick={() => onSelectMode(mode)}
          >
            <div style={styles.cardEmoji}>{emoji}</div>
            <div style={styles.cardLabel}>{label}</div>
          </button>
        ))}
      </div>

      <button style={styles.resetBtn} onClick={() => {
        if (window.confirm('Xóa tiến độ học? ⚠️')) onReset();
      }}>
        🔄 Làm lại từ đầu
      </button>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px',
  },
  topBar: {
    width: '100%',
    maxWidth: 420,
    marginBottom: 8,
  },
  backBtn: {
    background: 'rgba(255,255,255,0.25)',
    border: '2px solid rgba(255,255,255,0.5)',
    color: '#fff',
    padding: '8px 18px',
    borderRadius: 20,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
  },
  header: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#fff',
  },
  title: {
    fontSize: 48,
    fontWeight: 900,
    textShadow: '2px 4px 8px rgba(0,0,0,0.3)',
  },
  subtitle: {
    fontSize: 24,
    marginTop: 4,
  },
  stars: {
    fontSize: 20,
    marginTop: 8,
    background: 'rgba(255,255,255,0.2)',
    padding: '6px 18px',
    borderRadius: 20,
    display: 'inline-block',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    width: '100%',
    maxWidth: 400,
  },
  card: {
    border: 'none',
    borderRadius: 24,
    padding: '28px 16px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
    transition: 'transform 0.15s',
    minHeight: 140,
  },
  cardEmoji: { fontSize: 52 },
  cardLabel: { fontSize: 18, fontWeight: 700, color: '#333' },
  resetBtn: {
    marginTop: 32,
    background: 'rgba(255,255,255,0.2)',
    border: '2px solid rgba(255,255,255,0.5)',
    color: '#fff',
    padding: '10px 24px',
    borderRadius: 20,
    fontSize: 14,
    cursor: 'pointer',
  },
};
