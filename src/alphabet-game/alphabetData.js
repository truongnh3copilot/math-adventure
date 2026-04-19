export const ALPHABET_DATA = [
  // Level 1
  { letter: 'A', word: 'Áo', emoji: '👕', pronunciation: 'a', level: 1 },
  { letter: 'Ă', word: 'Ăn', emoji: '🍚', pronunciation: 'ă', level: 1 },
  { letter: 'Â', word: 'Âm nhạc', emoji: '🎵', pronunciation: 'â', level: 1 },
  // Level 2
  { letter: 'B', word: 'Bóng', emoji: '⚽', pronunciation: 'bờ', level: 2 },
  { letter: 'C', word: 'Cá', emoji: '🐟', pronunciation: 'cờ', level: 2 },
  { letter: 'D', word: 'Dưa', emoji: '🍉', pronunciation: 'dờ', level: 2 },
  { letter: 'Đ', word: 'Đèn', emoji: '💡', pronunciation: 'đờ', level: 2 },
  // Level 3
  { letter: 'E', word: 'Em bé', emoji: '👶', pronunciation: 'e', level: 3 },
  { letter: 'Ê', word: 'Ếch', emoji: '🐸', pronunciation: 'ê', level: 3 },
  { letter: 'G', word: 'Gà', emoji: '🐔', pronunciation: 'gờ', level: 3 },
  { letter: 'H', word: 'Hoa', emoji: '🌸', pronunciation: 'hờ', level: 3 },
  // Level 4
  { letter: 'I', word: 'Ít', emoji: '🤏', pronunciation: 'i', level: 4 },
  { letter: 'K', word: 'Kẹo', emoji: '🍬', pronunciation: 'ca', level: 4 },
  { letter: 'L', word: 'Lá', emoji: '🍃', pronunciation: 'lờ', level: 4 },
  { letter: 'M', word: 'Mèo', emoji: '🐱', pronunciation: 'mờ', level: 4 },
  // Level 5
  { letter: 'N', word: 'Nước', emoji: '💧', pronunciation: 'nờ', level: 5 },
  { letter: 'O', word: 'Ổi', emoji: '🍈', pronunciation: 'o', level: 5 },
  { letter: 'Ô', word: 'Ôtô', emoji: '🚗', pronunciation: 'ô', level: 5 },
  { letter: 'Ơ', word: 'Ớt', emoji: '🌶️', pronunciation: 'ơ', level: 5 },
  // Level 6
  { letter: 'P', word: 'Pin', emoji: '🔋', pronunciation: 'pờ', level: 6 },
  { letter: 'Q', word: 'Quả', emoji: '🍊', pronunciation: 'quờ', level: 6 },
  { letter: 'R', word: 'Rùa', emoji: '🐢', pronunciation: 'rờ', level: 6 },
  { letter: 'S', word: 'Sao', emoji: '⭐', pronunciation: 'sờ', level: 6 },
  // Level 7
  { letter: 'T', word: 'Táo', emoji: '🍎', pronunciation: 'tờ', level: 7 },
  { letter: 'U', word: 'Úc', emoji: '🦘', pronunciation: 'u', level: 7 },
  { letter: 'Ư', word: 'Ướt', emoji: '🌧️', pronunciation: 'ư', level: 7 },
  { letter: 'V', word: 'Voi', emoji: '🐘', pronunciation: 'vờ', level: 7 },
  { letter: 'X', word: 'Xe', emoji: '🚲', pronunciation: 'xờ', level: 7 },
  { letter: 'Y', word: 'Yêu', emoji: '❤️', pronunciation: 'y', level: 7 },
];

export const LEVELS = Array.from(new Set(ALPHABET_DATA.map(l => l.level))).sort();

export const getLettersByLevel = (level) => ALPHABET_DATA.filter(l => l.level === level);

export const TOTAL_LEVELS = LEVELS.length;
