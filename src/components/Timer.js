import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function Timer({ duration = 30, running, onExpire, onTick, boost = 0 }) {
  const [remaining, setRemaining] = useState(duration);
  const intervalRef = useRef(null);

  useEffect(() => {
    setRemaining(duration);
  }, [duration]);

  useEffect(() => {
    if (boost > 0) setRemaining((prev) => prev + 15);
  }, [boost]);

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
        onTick?.(prev - 1);
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, onExpire]);

  const pct = remaining / duration;
  const stroke = pct > 0.5 ? '#34d399' : pct > 0.25 ? '#fbbf24' : '#fb7185';
  const circumference = 2 * Math.PI * 22;

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</span>
      <div className="relative w-16 h-16 bg-white rounded-2xl border-2 border-slate-200 shadow-[0_4px_0_0_#e2e8f0] flex items-center justify-center">
        <svg width={52} height={52} viewBox="0 0 52 52" className="-rotate-90">
          <circle cx={26} cy={26} r={22} fill="none" stroke="#e2e8f0" strokeWidth={4} />
          <motion.circle
            cx={26} cy={26} r={22}
            fill="none"
            stroke={stroke}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - pct)}
            animate={{ stroke }}
            transition={{ duration: 0.4 }}
          />
        </svg>
        <span
          className="absolute font-black text-lg leading-none"
          style={{ color: stroke }}
        >
          {remaining}
        </span>
      </div>
    </div>
  );
}
