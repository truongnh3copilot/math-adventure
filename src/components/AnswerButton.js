import React, { useState } from 'react';
import { motion } from 'framer-motion';

const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF'];

export default function AnswerButton({ value, index, onClick, disabled, revealed, isCorrect }) {
  const [pressed, setPressed] = useState(false);
  const base = COLORS[index % COLORS.length];

  let bg = base;
  if (revealed) {
    bg = isCorrect ? '#51CF66' : '#FF6B6B';
  }

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      animate={revealed && isCorrect ? { scale: [1, 1.15, 1] } : {}}
      transition={{ duration: 0.3 }}
      disabled={disabled}
      onClick={() => { if (!disabled) { setPressed(true); onClick(value); } }}
      style={{ ...styles.button, background: bg, opacity: disabled && !revealed ? 0.7 : 1 }}
    >
      <span style={styles.label}>{value}</span>
    </motion.button>
  );
}

const styles = {
  button: {
    border: 'none',
    borderRadius: 18,
    padding: '20px 0',
    cursor: 'pointer',
    fontSize: 32,
    fontWeight: 800,
    color: '#fff',
    fontFamily: 'Nunito, sans-serif',
    boxShadow: '0 6px 0 rgba(0,0,0,0.15)',
    transition: 'background 0.2s',
    width: '100%',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  label: {
    pointerEvents: 'none',
  },
};
