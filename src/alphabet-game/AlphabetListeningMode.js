import React, { useState, useEffect } from 'react';
import { getLettersByLevel, ALPHABET_DATA } from './alphabetData';
import { speak } from './speech';

function buildQuestions(level) {
  const letters = getLettersByLevel(level);
  return letters.map(target => {
    const wrong = ALPHABET_DATA
      .filter(l => l.letter !== target.letter)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    return { target, options: [...wrong, target].sort(() => Math.random() - 0.5) };
  });
}

export default function AlphabetListeningMode({ level, onComplete, onBack }) {
  const [questions] = useState(() => buildQuestions(level));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [playing, setPlaying] = useState(false);

  const current = questions[index];

  const playAudio = () => {
    setPlaying(true);
    speak(`Chữ ${current.target.pronunciation}`);
    setTimeout(() => setPlaying(false), 1500);
  };

  useEffect(() => {
    const timer = setTimeout(playAudio, 400);
    return () => clearTimeout(timer);
  }, [index]);

  const handleSelect = (letter) => {
    if (selected !== null) return;
    setSelected(letter);
    const isCorrect = letter === current.target.letter;
    if (isCorrect) {
      speak(`Đúng! Chữ ${current.target.pronunciation} - ${current.target.word}`);
      setCorrectCount(c => c + 1);
    } else {
      speak(`Không phải! Đây là chữ ${current.target.pronunciation}`);
    }
    setTimeout(() => {
      if (index < questions.length - 1) {
        setIndex(index + 1);
        setSelected(null);
      } else {
        const total = isCorrect ? correctCount + 1 : correctCount;
        const stars = Math.max(1, Math.ceil((total / questions.length) * 3));
        onComplete(stars);
      }
    }, 1500);
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={onBack}>←</button>
        <div style={styles.progress}>{index + 1} / {questions.length}</div>
        <div style={styles.score}>⭐ {correctCount}</div>
      </div>

      <div style={styles.card}>
        <div style={styles.instruction}>Hãy chọn chữ vừa nghe</div>
        <button
          style={{ ...styles.playBtn, transform: playing ? 'scale(0.9)' : 'scale(1)' }}
          onClick={playAudio}
        >
          {playing ? '🎵' : '🔊'}
        </button>
        <div style={styles.subHint}>Bấm để nghe lại</div>
      </div>

      <div style={styles.options}>
        {current.options.map(opt => {
          let bg = '#fff';
          let border = '3px solid #ddd';
          if (selected !== null) {
            if (opt.letter === current.target.letter) { bg = '#A8E6CF'; border = '3px solid #4CAF50'; }
            else if (opt.letter === selected) { bg = '#FFB3B3'; border = '3px solid #f44336'; }
          }
          return (
            <button
              key={opt.letter}
              style={{ ...styles.optBtn, background: bg, border }}
              onClick={() => handleSelect(opt.letter)}
            >
              <div style={styles.optLetter}>{opt.letter}</div>
              <div style={styles.optEmoji}>{opt.emoji}</div>
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
    background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
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
  score: { fontSize: 18, fontWeight: 700, color: '#fff' },
  card: {
    background: '#fff',
    borderRadius: 32,
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    width: '100%',
    maxWidth: 380,
    marginBottom: 24,
  },
  instruction: { fontSize: 18, color: '#555', fontWeight: 600 },
  playBtn: {
    fontSize: 80,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  subHint: { fontSize: 14, color: '#aaa' },
  options: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    width: '100%',
    maxWidth: 380,
  },
  optBtn: {
    borderRadius: 20,
    padding: '16px 8px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    transition: 'background 0.3s',
  },
  optLetter: { fontSize: 36, fontWeight: 900, color: '#333' },
  optEmoji: { fontSize: 28 },
};
