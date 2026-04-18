import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { CHARACTERS } from '../data/levels';
import QuestionCard from '../components/QuestionCard';
import AnswerButton from '../components/AnswerButton';
import FeedbackOverlay from '../components/FeedbackOverlay';
import CharacterMascot from '../components/CharacterMascot';
import Timer from '../components/Timer';
import StarRating from '../components/StarRating';

export default function GameplayScreen() {
  const { state, dispatch } = useGame();
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'wrong'
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timerRunning, setTimerRunning] = useState(true);

  const { currentQuestions, currentQuestionIndex, starsEarned, currentLevel } = state;
  const question = currentQuestions[currentQuestionIndex];
  const character = CHARACTERS.find((c) => c.id === state.selectedCharacter) || CHARACTERS[0];
  const total = currentQuestions.length;
  const isLastQuestion = currentQuestionIndex >= total - 1;

  const handleAnswer = useCallback((value) => {
    if (feedback !== null) return;
    setSelectedAnswer(value);
    setTimerRunning(false);
    const correct = value === question.answer;

    if (correct) {
      dispatch({ type: 'ANSWER_CORRECT' });
      setFeedback('correct');
      setTimeout(() => {
        setFeedback(null);
        setSelectedAnswer(null);
        setTimerRunning(true);
        if (isLastQuestion) {
          dispatch({ type: 'COMPLETE_LEVEL' });
        } else {
          dispatch({ type: 'NEXT_QUESTION' });
        }
      }, 1000);
    } else {
      dispatch({ type: 'ANSWER_WRONG' });
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback(null);
        setSelectedAnswer(null);
        setTimerRunning(true);
      }, 900);
    }
  }, [feedback, question, isLastQuestion, dispatch]);

  const handleTimerExpire = useCallback(() => {
    if (feedback !== null) return;
    dispatch({ type: 'ANSWER_WRONG' });
    setFeedback('wrong');
    setTimeout(() => {
      setFeedback(null);
      setTimerRunning(true);
    }, 900);
  }, [feedback, dispatch]);

  const mascotMood = feedback === 'correct' ? 'happy' : feedback === 'wrong' ? 'sad' : 'idle';

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          style={styles.backBtn}
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'levelMap' })}
        >
          ✕
        </motion.button>
        <StarRating stars={starsEarned} size={28} />
        <Timer duration={30} running={timerRunning} onExpire={handleTimerExpire} />
      </div>

      <div style={styles.mascotArea}>
        <CharacterMascot character={character} mood={mascotMood} size={64} />
        <div style={styles.levelBadge}>Level {currentLevel?.id}</div>
      </div>

      <div style={styles.cardArea}>
        <QuestionCard
          question={question}
          questionNumber={currentQuestionIndex + 1}
          total={total}
        />
      </div>

      <div style={styles.answersGrid}>
        {question.choices.map((choice, i) => (
          <AnswerButton
            key={`${currentQuestionIndex}-${i}`}
            value={choice}
            index={i}
            onClick={handleAnswer}
            disabled={feedback !== null}
            revealed={selectedAnswer === choice}
            isCorrect={choice === question.answer}
          />
        ))}
      </div>

      <FeedbackOverlay show={feedback !== null} correct={feedback === 'correct'} />
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #667eea 0%, #764ba2 100%)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '16px', fontFamily: 'Nunito, sans-serif', gap: 16,
  },
  topBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    width: '100%', maxWidth: 480,
  },
  backBtn: {
    background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
    borderRadius: 10, padding: '8px 12px', fontSize: 16, fontWeight: 700, cursor: 'pointer',
  },
  mascotArea: { display: 'flex', alignItems: 'center', gap: 12 },
  levelBadge: {
    background: 'rgba(255,255,255,0.2)', color: 'white',
    borderRadius: 12, padding: '4px 14px', fontSize: 15, fontWeight: 700,
  },
  cardArea: { width: '100%', maxWidth: 480 },
  answersGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: 12, width: '100%', maxWidth: 480,
  },
};
