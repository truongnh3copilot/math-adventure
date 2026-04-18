import React from 'react';
import { motion } from 'framer-motion';

export default function CharacterMascot({ character, mood = 'idle', size = 80 }) {
  const emoji = character?.emoji || '🦕';

  const animations = {
    idle: { y: [0, -8, 0], transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' } },
    happy: { rotate: [-10, 10, -10, 0], scale: [1, 1.2, 1], transition: { duration: 0.5 } },
    sad: { x: [-5, 5, -5, 0], transition: { duration: 0.4 } },
    thinking: { rotate: [0, 5, 0], transition: { duration: 1, repeat: Infinity } },
  };

  return (
    <motion.div
      animate={animations[mood]}
      style={{ fontSize: size, display: 'inline-block', cursor: 'default', userSelect: 'none' }}
    >
      {emoji}
    </motion.div>
  );
}
