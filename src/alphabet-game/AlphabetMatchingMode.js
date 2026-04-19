import React, { useState, useMemo } from 'react';
import { getLettersByLevel } from './alphabetData';
import { speak } from './speech';

export default function AlphabetMatchingMode({ level, onComplete, onBack }) {
  const letters = getLettersByLevel(level);
  const [matched, setMatched] = useState(new Set());
  const [dragging, setDragging] = useState(null);
  const [shaking, setShaking] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);

  const shuffledEmojis = useMemo(() => [...letters].sort(() => Math.random() - 0.5), [level]);

  const handleDrop = (target) => {
    if (!dragging) return;
    if (dragging.letter === target.letter) {
      speak(`Chữ ${dragging.pronunciation} - ${dragging.word}`);
      const newMatched = new Set(matched);
      newMatched.add(dragging.letter);
      setMatched(newMatched);
      const newCount = correctCount + 1;
      setCorrectCount(newCount);
      if (newMatched.size === letters.length) {
        setTimeout(() => onComplete(3), 800);
      }
    } else {
      speak('Thử lại nhé!');
      setShaking(target.letter);
      setTimeout(() => setShaking(null), 500);
    }
    setDragging(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={onBack}>←</button>
        <div style={styles.title}>Kéo chữ vào hình đúng</div>
        <div style={styles.score}>{matched.size}/{letters.length}</div>
      </div>

      <div style={styles.columns}>
        <div style={styles.col}>
          {letters.map(l => (
            <div
              key={l.letter}
              draggable={!matched.has(l.letter)}
              onDragStart={() => setDragging(l)}
              onDragEnd={() => setDragging(null)}
              style={{
                ...styles.letterCard,
                opacity: matched.has(l.letter) ? 0.3 : 1,
                cursor: matched.has(l.letter) ? 'default' : 'grab',
              }}
              onClick={() => {
                if (!matched.has(l.letter)) {
                  setDragging(l);
                  speak(`Chữ ${l.pronunciation}`);
                }
              }}
            >
              {l.letter}
            </div>
          ))}
        </div>

        <div style={styles.col}>
          {shuffledEmojis.map(l => (
            <div
              key={l.letter}
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(l)}
              onClick={() => dragging && handleDrop(l)}
              style={{
                ...styles.emojiCard,
                background: matched.has(l.letter) ? '#A8E6CF' : '#fff',
                animation: shaking === l.letter ? 'shake 0.5s' : 'none',
                border: dragging ? '3px dashed #667eea' : '3px solid #eee',
              }}
            >
              <div style={{ fontSize: 40 }}>{l.emoji}</div>
              <div style={{ fontSize: 14, color: '#666' }}>{l.word}</div>
              {matched.has(l.letter) && <div style={{ fontSize: 20 }}>✅</div>}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 420,
    marginBottom: 20,
  },
  backBtn: {
    background: 'rgba(255,255,255,0.5)',
    border: 'none',
    fontSize: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    cursor: 'pointer',
  },
  title: { fontSize: 16, fontWeight: 700, color: '#fff' },
  score: { fontSize: 18, fontWeight: 700, color: '#fff' },
  columns: { display: 'flex', gap: 16, width: '100%', maxWidth: 420 },
  col: { flex: 1, display: 'flex', flexDirection: 'column', gap: 10 },
  letterCard: {
    background: '#fff',
    borderRadius: 16,
    padding: '16px',
    textAlign: 'center',
    fontSize: 36,
    fontWeight: 900,
    color: '#FF6B6B',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    userSelect: 'none',
  },
  emojiCard: {
    borderRadius: 16,
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'border 0.2s',
    cursor: 'pointer',
    minHeight: 80,
  },
};
