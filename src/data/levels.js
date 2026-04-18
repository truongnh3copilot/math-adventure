export const MODES = [
  { id: 'addition', label: 'Addition', icon: '➕', color: '#FF6B6B', description: 'Add numbers together!' },
  { id: 'subtraction', label: 'Subtraction', icon: '➖', color: '#4ECDC4', description: 'Take numbers away!' },
  { id: 'multiplication', label: 'Multiplication', icon: '✖️', color: '#FFE66D', description: 'Multiply and grow!' },
  { id: 'mixed', label: 'Mixed Mode', icon: '🌟', color: '#A8E6CF', description: 'All operations!' },
];

export const CHARACTERS = [
  { id: 'dino', name: 'Dino', emoji: '🦕', color: '#4ECDC4', description: 'Friendly dinosaur' },
  { id: 'unicorn', name: 'Unicorn', emoji: '🦄', color: '#FF9ECD', description: 'Magical unicorn' },
  { id: 'robot', name: 'Robo', emoji: '🤖', color: '#6C63FF', description: 'Smart robot' },
  { id: 'fox', name: 'Foxy', emoji: '🦊', color: '#FF6B35', description: 'Clever fox' },
];

const FRUIT_HINTS = {
  1: '🍎', 2: '🍊', 3: '🍋', 4: '🍇', 5: '🍓',
  6: '🍒', 7: '🍑', 8: '🥝', 9: '🍌', 10: '🍍',
};

export function getFruitHint(num) {
  if (num <= 10) return Array(num).fill(FRUIT_HINTS[num] || '🍎').join(' ');
  return null;
}

function getDifficultyForLevel(levelIndex) {
  if (levelIndex < 30) return 'easy';
  if (levelIndex < 60) return 'medium';
  if (levelIndex < 85) return 'hard';
  return 'expert';
}

// Tuned for ages 4-5: very small numbers, gradual growth across 100 levels
function getAddSubMax(levelId) {
  if (levelId < 10) return 5;
  if (levelId < 20) return 10;
  if (levelId < 40) return 15;
  if (levelId < 60) return 20;
  if (levelId < 80) return 25;
  return 30;
}

function getMultMax(levelId) {
  if (levelId < 20) return 2;   // only ×2 table
  if (levelId < 40) return 3;   // ×2–×3
  if (levelId < 60) return 5;   // up to ×5
  if (levelId < 80) return 7;
  return 9;
}

function generateQuestion(mode, levelId) {
  const ops = mode === 'mixed' ? ['+', '-', '×'] : [mode === 'addition' ? '+' : mode === 'subtraction' ? '-' : '×'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  const maxVal = getAddSubMax(levelId);
  const multMax = getMultMax(levelId);

  let a, b, answer;
  if (op === '+') {
    a = Math.floor(Math.random() * (maxVal - 1)) + 1;
    b = Math.floor(Math.random() * (maxVal - a)) + 1;
    answer = a + b;
  } else if (op === '-') {
    b = Math.floor(Math.random() * (maxVal - 1)) + 1;
    a = b + Math.floor(Math.random() * (maxVal - b)) + 1;
    answer = a - b;
  } else {
    a = Math.floor(Math.random() * multMax) + 1;
    b = Math.floor(Math.random() * multMax) + 1;
    answer = a * b;
  }

  // Keep wrong answers very close to the correct answer for young children
  const wrongAnswers = new Set();
  const deltaRange = answer <= 5 ? 2 : answer <= 10 ? 3 : Math.max(3, Math.floor(answer * 0.15));
  let attempts = 0;
  while (wrongAnswers.size < 3 && attempts < 30) {
    attempts++;
    const delta = Math.floor(Math.random() * deltaRange) + 1;
    const wrong = Math.random() > 0.5 ? answer + delta : Math.max(1, answer - delta);
    if (wrong !== answer) wrongAnswers.add(wrong);
  }

  const choices = [...wrongAnswers, answer].sort(() => Math.random() - 0.5);

  return {
    text: `${a} ${op} ${b} = ?`,
    a, b, op, answer,
    choices,
    hint: (op === '+' || op === '-') && a <= 10 ? getFruitHint(a) : null,
  };
}

export function generateLevelQuestions(mode, levelId, count = 6) {
  return Array.from({ length: count }, () => generateQuestion(mode, levelId));
}

export function buildLevelMap(mode) {
  return Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    label: `Level ${i + 1}`,
    difficulty: getDifficultyForLevel(i),
    mode,
    questionsCount: 6,
    starsRequired: i === 0 ? 0 : 1,
  }));
}
