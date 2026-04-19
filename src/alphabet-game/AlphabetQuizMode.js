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
    const options = [...wrong, target].sort(() => Math.random() - 0.5);
    return { target, options };
  });
}

export default function AlphabetQuizMode({ level, onComplete, onBack }) {
  const [questions] = useState(() => buildQuestions(level));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);

  const current = questions[index];

  useEffect(() => {
    speak(`Chọn chữ: ${current.target.word}`);
  }, [index]);

  const handleSelect = (letter) => {
    if (selected !== null) return;
    setSelected(letter);
    const isCorrect = letter === current.target.letter;
    if (isCorrect) {
      speak('Đúng rồi! Giỏi quá!');
      setCorrectCount(c => c + 1);
    } else {
      speak(`Đáp án đúng là chữ ${current.target.pronunciation}`);
    }
    setTimeout(() => {
      if (index < questions.length - 1) {
        setIndex(index + 1);
        setSelected(null);
      } else {
        const total = isCorrect ? correctCount + 1 : correctCount;
        const stars = Math.max(1, Math.min(3, Math.ceil((total / questions.length) * 3)));
        onComplete(stars);
      }
    }, 1200);
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={onBack}>←</button>
        <div style={styles.progress}>{index + 1} / {questions.length}</div>
        <div style={styles.score}>⭐ {correctCount}</div>
      </div>

      <div style={styles.question}>
        <div style={styles.questionEmoji}>{current.target.emoji}</div>
        <div style={styles.questionWord}>{current.target.word}</div>
        <div style={styles.hint}>Đây là chữ nào?</div>
        <button style={styles.audioBtn} onClick={() => speak(current.target.word)}>🔊</button>
      </div>

      <div style={styles.options}>
        {current.options.map(opt => {
          let bg = '#fff';
          if (selected !== null) {
            if (opt.letter === current.target.letter) bg = '#A8E6CF';
            else if (opt.letter === selected) bg = '#FFB3B3';
          }
          return (
            <button
              key={opt.letter}
              style={{ ...styles.optBtn, background: bg }}
              onClick={() => handleSelect(opt.letter)}
            >
              {opt.letter}
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
    background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
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
  question: {
    background: '#fff',
    borderRadius: 32,
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    width: '100%',
    maxWidth: 380,
    marginBottom: 24,
  },
  questionEmoji: { fontSize: 80 },
  questionWord: { fontSize: 28, fontWeight: 700, color: '#333' },
  hint: { fontSize: 16, color: '#888' },
  audioBtn: {
    background: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: 20,
    padding: '8px 20px',
    fontSize: 20,
    cursor: 'pointer',
  },
  options: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    width: '100%',
    maxWidth: 380,
  },
  optBtn: {
    border: '3px solid #ddd',
    borderRadius: 20,
    padding: '20px',
    fontSize: 40,
    fontWeight: 900,
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
};
