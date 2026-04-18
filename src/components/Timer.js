import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function Timer({ duration = 30, running, onExpire }) {
  const [remaining, setRemaining] = useState(duration);
  const intervalRef = useRef(null);

  useEffect(() => {
    setRemaining(duration);
  }, [duration]);

  useEffect(() => {
    if (!running) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, onExpire]);

  const pct = remaining / duration;
  const color = pct > 0.5 ? '#51CF66' : pct > 0.25 ? '#FFE66D' : '#FF6B6B';

  return (
    <div style={styles.wrapper}>
      <svg width={56} height={56} viewBox="0 0 56 56">
        <circle cx={28} cy={28} r={24} fill="none" stroke="#eee" strokeWidth={5} />
        <motion.circle
          cx={28} cy={28} r={24}
          fill="none"
          stroke={color}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 24}`}
          strokeDashoffset={`${2 * Math.PI * 24 * (1 - pct)}`}
          transform="rotate(-90 28 28)"
          animate={{ stroke: color }}
          transition={{ duration: 0.5 }}
        />
      </svg>
      <span style={{ ...styles.label, color }}>{remaining}</span>
    </div>
  );
}

const styles = {
  wrapper: { position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
  label: { position: 'absolute', fontSize: 18, fontWeight: 900, fontFamily: 'Nunito, sans-serif' },
};
