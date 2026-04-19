import React, { useState } from 'react';
import { getLettersByLevel } from './alphabetData';
import { speak } from './speech';

export default function AlphabetLearningMode({ level, onComplete, onBack }) {
  const letters = getLettersByLevel(level);
  const [index, setIndex] = useState(0);
  const [bouncing, setBouncing] = useState(false);

  const current = letters[index];

  const playSound = () => {
    speak(`Chữ ${current.pronunciation} - ${current.word}`);
    setBouncing(true);
    setTimeout(() => setBouncing(false), 600);
  };

  const next = () => {
    if (index < letters.length - 1) {
      setIndex(index + 1);
    } else {
      onComplete(3);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={onBack}>←</button>
        <div style={styles.progress}>{index + 1} / {letters.length}</div>
      </div>

      <div style={styles.card}>
        <div style={{
          ...styles.letter,
          transform: bouncing ? 'scale(1.2)' : 'scale(1)',
          transition: 'transform 0.3s',
        }}>
          {current.letter}
        </div>
        <div style={styles.emoji}>{current.emoji}</div>
        <div style={styles.word}>{current.word}</div>
        <button style={styles.soundBtn} onClick={playSound}>🔊 Nghe phát âm</button>
      </div>

      <div style={styles.dots}>
        {letters.map((_, i) => (
          <div key={i} style={{
            ...styles.dot,
            background: i === index ? '#FF6B6B' : i < index ? '#4ECDC4' : '#ddd',
          }} />
        ))}
      </div>

      <button style={styles.nextBtn} onClick={next}>
        {index < letters.length - 1 ? 'Tiếp theo →' : '✅ Hoàn thành!'}
      </button>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
  },
  backBtn: {
    background: 'rgba(255,255,255,0.4)',
    border: 'none',
    fontSize: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    cursor: 'pointer',
  },
  progress: { fontSize: 18, fontWeight: 700, color: '#fff' },
  card: {
    background: '#fff',
    borderRadius: 32,
    padding: '36px 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
    width: '100%',
    maxWidth: 380,
  },
  letter: {
    fontSize: 120,
    fontWeight: 900,
    color: '#FF6B6B',
    lineHeight: 1,
  },
  emoji: { fontSize: 72 },
  word: { fontSize: 28, fontWeight: 700, color: '#333' },
  soundBtn: {
    marginTop: 8,
    background: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: 24,
    padding: '14px 28px',
    fontSize: 18,
    cursor: 'pointer',
  },
  dots: { display: 'flex', gap: 8, margin: '20px 0' },
  dot: { width: 12, height: 12, borderRadius: 6, transition: 'background 0.3s' },
  nextBtn: {
    background: '#FF6B6B',
    color: '#fff',
    border: 'none',
    borderRadius: 28,
    padding: '18px 40px',
    fontSize: 20,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(255,107,107,0.4)',
  },
};
