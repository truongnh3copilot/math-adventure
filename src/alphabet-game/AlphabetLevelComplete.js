import React, { useEffect, useState } from 'react';
import { speak } from './speech';

export default function AlphabetLevelComplete({ level, stars, onReplay, onNextLevel, onHome, hasNextLevel }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 100);
    speak(stars === 3 ? 'Xuất sắc! Ba sao rồi!' : 'Hoàn thành! Làm tốt lắm!');
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={styles.container}>
      <div style={{
        ...styles.card,
        transform: show ? 'scale(1)' : 'scale(0.5)',
        opacity: show ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <div style={styles.title}>Bài {level} xong rồi! 🎉</div>

        <div style={styles.starsRow}>
          {[1, 2, 3].map(s => (
            <span key={s} style={{
              fontSize: 56,
              transition: `transform 0.3s ${s * 0.15}s`,
              transform: show && s <= stars ? 'scale(1.2)' : 'scale(1)',
              filter: s <= stars ? 'none' : 'grayscale(1)',
            }}>
              ⭐
            </span>
          ))}
        </div>

        <div style={styles.message}>
          {stars === 3 ? '🏆 Hoàn hảo!' : stars === 2 ? '👍 Rất tốt!' : '💪 Cố lên!'}
        </div>

        <div style={styles.buttons}>
          <button style={styles.replayBtn} onClick={onReplay}>🔄 Chơi lại</button>
          {hasNextLevel && (
            <button style={styles.nextBtn} onClick={onNextLevel}>Bài tiếp ▶</button>
          )}
          <button style={styles.homeBtn} onClick={onHome}>🏠 Về nhà</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  },
  card: {
    background: '#fff',
    borderRadius: 36,
    padding: '40px 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    maxWidth: 360,
    width: '100%',
  },
  title: { fontSize: 26, fontWeight: 900, color: '#333', textAlign: 'center' },
  starsRow: { display: 'flex', gap: 8 },
  message: { fontSize: 22, fontWeight: 700, color: '#555' },
  buttons: { display: 'flex', flexDirection: 'column', gap: 10, width: '100%' },
  replayBtn: {
    background: '#f0f0f0',
    border: 'none',
    borderRadius: 24,
    padding: '14px',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
  },
  nextBtn: {
    background: '#FF6B6B',
    color: '#fff',
    border: 'none',
    borderRadius: 24,
    padding: '16px',
    fontSize: 18,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(255,107,107,0.4)',
  },
  homeBtn: {
    background: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: 24,
    padding: '14px',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
  },
};
