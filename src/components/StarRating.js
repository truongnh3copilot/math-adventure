import React from 'react';
import { motion } from 'framer-motion';

export default function StarRating({ stars, size = 40, animated = false }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
      {[1, 2, 3].map((n) => {
        const filled = n <= stars;
        return (
          <motion.span
            key={n}
            initial={animated ? { scale: 0, rotate: -30 } : false}
            animate={animated ? { scale: 1, rotate: 0 } : false}
            transition={{ delay: n * 0.15, type: 'spring', stiffness: 300 }}
            style={{ fontSize: size, filter: filled ? 'none' : 'grayscale(1) opacity(0.3)' }}
          >
            ⭐
          </motion.span>
        );
      })}
    </div>
  );
}
