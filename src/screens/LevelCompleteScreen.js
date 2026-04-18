import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { playFanfare } from '../utils/audio';
import { buildLevelMap, generateLevelQuestions } from '../data/levels';
import { CHARACTERS } from '../data/levels';
import StarRating from '../components/StarRating';
import RewardPopup from '../components/RewardPopup';
import CharacterMascot from '../components/CharacterMascot';

export default function LevelCompleteScreen() {
  const { state, dispatch } = useGame();
  const [showReward, setShowReward] = useState(true);
  useEffect(() => { playFanfare(); }, []);
  const character = CHARACTERS.find((c) => c.id === state.selectedCharacter) || CHARACTERS[0];
  const stars = state.starsEarned;
  const coins = stars * 5;
  const sticker = stars === 3 ? 1 : 0;
  const levelId = state.currentLevel?.id;
  const mode    = state.selectedMode;
  const levels  = buildLevelMap(mode);
  const nextLevel = levels.find((l) => l.id === levelId + 1);

  function handleRewardContinue() {
    setShowReward(false);
  }

  function handleNextLevel() {
    if (!nextLevel) return;
    const questions = generateLevelQuestions(nextLevel.mode, nextLevel.id, nextLevel.questionsCount);
    dispatch({ type: 'START_LEVEL', level: nextLevel, questions });
  }

  return (
    <div style={styles.container}>
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        style={styles.card}
      >
        <CharacterMascot character={character} mood="happy" size={80} />
        <h1 style={styles.title}>Level Complete!</h1>
        <p style={styles.subtitle}>Level {levelId} — Awesome job!</p>
        <StarRating stars={stars} size={48} animated />

        <div style={styles.statsRow}>
          <div style={styles.stat}>
            <span style={styles.statIcon}>🪙</span>
            <span style={styles.statVal}>{coins}</span>
            <span style={styles.statLabel}>Coins</span>
          </div>
          {sticker > 0 && (
            <div style={styles.stat}>
              <span style={styles.statIcon}>🏅</span>
              <span style={styles.statVal}>{sticker}</span>
              <span style={styles.statLabel}>Sticker</span>
            </div>
          )}
        </div>

        <div style={styles.btnRow}>
          {nextLevel && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={styles.primaryBtn}
              onClick={handleNextLevel}
            >
              Next Level →
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={styles.secondaryBtn}
            onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'home' })}
          >
            🏠 Home
          </motion.button>
        </div>
      </motion.div>

      <RewardPopup show={showReward} coins={coins} sticker={sticker} onContinue={handleRewardContinue} />
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #f8f9fa 0%, #e9ecef 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 24, fontFamily: 'Nunito, sans-serif',
  },
  card: {
    background: 'white', borderRadius: 28, padding: '40px 32px',
    textAlign: 'center', boxShadow: '0 12px 48px rgba(0,0,0,0.12)',
    maxWidth: 400, width: '100%',
  },
  title: { fontSize: 36, fontWeight: 900, color: '#2D2D2D', margin: '12px 0 4px' },
  subtitle: { fontSize: 16, color: '#888', margin: '0 0 20px' },
  statsRow: { display: 'flex', gap: 24, justifyContent: 'center', margin: '24px 0' },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 },
  statIcon: { fontSize: 28 },
  statVal: { fontSize: 24, fontWeight: 900, color: '#2D2D2D' },
  statLabel: { fontSize: 12, color: '#aaa', fontWeight: 700 },
  btnRow: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' },
  primaryBtn: {
    background: 'linear-gradient(135deg, #6C63FF, #a78bfa)',
    color: 'white', border: 'none', borderRadius: 16,
    padding: '14px 28px', fontSize: 18, fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
  },
  secondaryBtn: {
    background: '#f0f0f0', border: 'none', borderRadius: 16,
    padding: '14px 28px', fontSize: 18, fontWeight: 800, cursor: 'pointer', color: '#555', fontFamily: 'Nunito, sans-serif',
  },
};
