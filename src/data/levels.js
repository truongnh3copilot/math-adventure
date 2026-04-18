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

function getMaxNum(difficulty) {
  switch (difficulty) {
    case 'easy':   return 10;
    case 'medium': return 50;
    case 'hard':   return 100;
    case 'expert': return 500;
    default:       return 10;
  }
}

function getMultMax(difficulty) {
  switch (difficulty) {
    case 'easy':   return 5;
    case 'medium': return 10;
    case 'hard':   return 20;
    case 'expert': return 30;
    default:       return 5;
  }
}

function generateQuestion(mode, difficulty) {
  const maxNum = getMaxNum(difficulty);
  const multMax = getMultMax(difficulty);
  const ops = mode === 'mixed' ? ['+', '-', '×'] : [mode === 'addition' ? '+' : mode === 'subtraction' ? '-' : '×'];
  const op = ops[Math.floor(Math.random() * ops.length)];

  let a, b, answer;
  if (op === '+') {
    a = Math.floor(Math.random() * maxNum) + 1;
    b = Math.floor(Math.random() * maxNum) + 1;
    answer = a + b;
  } else if (op === '-') {
    b = Math.floor(Math.random() * maxNum) + 1;
    a = b + Math.floor(Math.random() * maxNum) + 1;
    answer = a - b;
  } else {
    a = Math.floor(Math.random() * multMax) + 1;
    b = Math.floor(Math.random() * multMax) + 1;
    answer = a * b;
  }

  const wrongAnswers = new Set();
  const deltaRange = Math.max(5, Math.floor(answer * 0.2));
  while (wrongAnswers.size < 3) {
    const delta = Math.floor(Math.random() * deltaRange) + 1;
    const wrong = Math.random() > 0.5 ? answer + delta : Math.max(0, answer - delta);
    if (wrong !== answer) wrongAnswers.add(wrong);
  }

  const choices = [...wrongAnswers, answer].sort(() => Math.random() - 0.5);

  return {
    text: `${a} ${op} ${b} = ?`,
    a, b, op, answer,
    choices,
    hint: (op === '+' || op === '-') && a <= 10 && b <= 10 ? getFruitHint(a) : null,
  };
}

export function generateLevelQuestions(mode, difficulty, count = 10) {
  return Array.from({ length: count }, () => generateQuestion(mode, difficulty));
}

export function buildLevelMap(mode) {
  return Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    label: `Level ${i + 1}`,
    difficulty: getDifficultyForLevel(i),
    mode,
    questionsCount: 10,
    starsRequired: i === 0 ? 0 : 1,
  }));
}
