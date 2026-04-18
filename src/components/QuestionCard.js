import React from 'react';
import { motion } from 'framer-motion';

export default function QuestionCard({ question, questionNumber, total }) {
  return (
    <motion.div
      key={questionNumber}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={styles.card}
    >
      <div style={styles.counter}>{questionNumber} / {total}</div>
      <div style={styles.questionText}>{question.text}</div>
      {question.hint && (
        <div style={styles.hintRow}>
          <span style={styles.hintLabel}>Hint:</span>
          <span style={styles.hintFruits}>{question.hint}</span>
        </div>
      )}
    </motion.div>
  );
}

const styles = {
  card: {
    background: 'white',
    borderRadius: 24,
    padding: '32px 40px',
    boxShadow: '0 8px 32px rgba(108,99,255,0.15)',
    textAlign: 'center',
    minWidth: 300,
    maxWidth: 480,
    width: '100%',
  },
  counter: {
    fontSize: 14,
    color: '#aaa',
    fontWeight: 600,
    marginBottom: 16,
    letterSpacing: 1,
  },
  questionText: {
    fontSize: 52,
    fontWeight: 900,
    color: '#2D2D2D',
    fontFamily: 'Nunito, sans-serif',
    letterSpacing: -1,
  },
  hintRow: {
    marginTop: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  hintLabel: {
    fontSize: 13,
    color: '#888',
    fontWeight: 700,
  },
  hintFruits: {
    fontSize: 20,
    letterSpacing: 2,
  },
};
