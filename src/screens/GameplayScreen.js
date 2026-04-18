import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Star, Volume2, VolumeX } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { CHARACTERS } from '../data/levels';
import QuestionCard from '../components/QuestionCard';
import AnswerButton from '../components/AnswerButton';
import FeedbackOverlay from '../components/FeedbackOverlay';
import CharacterMascot from '../components/CharacterMascot';
import Timer from '../components/Timer';
import {
  playCorrect, playWrong, playTick, playFanfare,
  startBgMusic, stopBgMusic, toggleMute, isMuted,
} from '../utils/audio';

export default function GameplayScreen() {
  const { state, dispatch } = useGame();
  const [feedback, setFeedback] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timerRunning, setTimerRunning] = useState(true);
  const [muted, setMuted] = useState(isMuted());

  const { currentQuestions, currentQuestionIndex, starsEarned, currentLevel } = state;
  const question = currentQuestions[currentQuestionIndex];
  const character = CHARACTERS.find((c) => c.id === state.selectedCharacter) || CHARACTERS[0];
  const total = currentQuestions.length;
  const isLastQuestion = currentQuestionIndex >= total - 1;

  // Start bg music on mount, stop on unmount
  useEffect(() => {
    startBgMusic();
    return () => stopBgMusic();
  }, []);

  const handleAnswer = useCallback((value) => {
    if (feedback !== null) return;
    setSelectedAnswer(value);
    setTimerRunning(false);
    const correct = value === question.answer;
    if (correct) {
      playCorrect();
      dispatch({ type: 'ANSWER_CORRECT' });
      setFeedback('correct');
      setTimeout(() => {
        setFeedback(null);
        setSelectedAnswer(null);
        setTimerRunning(true);
        if (isLastQuestion) {
          playFanfare();
          dispatch({ type: 'COMPLETE_LEVEL' });
        } else {
          dispatch({ type: 'NEXT_QUESTION' });
        }
      }, 1000);
    } else {
      playWrong();
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
    playWrong();
    dispatch({ type: 'ANSWER_WRONG' });
    setFeedback('wrong');
    setTimeout(() => {
      setFeedback(null);
      setTimerRunning(true);
    }, 900);
  }, [feedback, dispatch]);

  const handleTick = useCallback((remaining) => {
    if (remaining <= 5) playTick();
  }, []);

  const handleMute = () => {
    const nowMuted = toggleMute();
    setMuted(nowMuted);
  };

  const mascotMood = feedback === 'correct' ? 'happy' : feedback === 'wrong' ? 'sad' : 'idle';

  return (
    <div className="min-h-screen bg-[#eef2ff] font-sans flex flex-col select-none">

      {/* Header */}
      <header className="p-4 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between bg-white rounded-2xl shadow-[0_8px_0_0_#e2e8f0] px-4 py-3 border-2 border-slate-200">
          <button
            className="p-2 hover:bg-slate-100 rounded-xl transition-all active:translate-y-1"
            onClick={() => { stopBgMusic(); dispatch({ type: 'SET_SCREEN', screen: 'levelMap' }); }}
          >
            <X size={24} className="text-slate-500" />
          </button>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Level</span>
            <span className="text-xl font-black text-indigo-600">{currentLevel?.id}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Stars */}
            <div className="flex gap-1">
              {[1, 2, 3].map((s) => (
                <Star
                  key={s}
                  size={20}
                  className={s <= starsEarned ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}
                />
              ))}
            </div>
            {/* Mute button */}
            <button
              className="p-2 hover:bg-slate-100 rounded-xl transition-all active:translate-y-1"
              onClick={handleMute}
            >
              {muted
                ? <VolumeX size={20} className="text-slate-400" />
                : <Volume2 size={20} className="text-indigo-400" />
              }
            </button>
          </div>
        </div>
      </header>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 px-4 mt-1">
        {currentQuestions.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i < currentQuestionIndex
                ? 'bg-emerald-400 w-6'
                : i === currentQuestionIndex
                ? 'bg-indigo-500 w-8'
                : 'bg-slate-300 w-6'
            }`}
          />
        ))}
      </div>

      {/* Mascot + Timer */}
      <div className="flex items-center justify-between max-w-lg mx-auto w-full px-6 mt-4">
        <CharacterMascot character={character} mood={mascotMood} size={64} />
        <Timer
          key={currentQuestionIndex}
          duration={15}
          running={timerRunning}
          onExpire={handleTimerExpire}
          onTick={handleTick}
        />
      </div>

      {/* Question + Answers */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-6 pb-4">
        <div className="w-full max-w-lg">
          <QuestionCard
            question={question}
            questionNumber={currentQuestionIndex + 1}
            total={total}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
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
      </div>

      <FeedbackOverlay show={feedback !== null} correct={feedback === 'correct'} />
    </div>
  );
}
