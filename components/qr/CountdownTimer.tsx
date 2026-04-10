'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownTimerProps {
  expiresAt: string;
  onExpire: () => void;
}

export default function CountdownTimer({ expiresAt, onExpire }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(10);

  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000));
      setRemaining(diff);
      if (diff === 0) onExpire();
    };
    update();
    const interval = setInterval(update, 200);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const pct = remaining / 10;
  const color = remaining <= 3 ? '#ef4444' : remaining <= 6 ? '#f97316' : '#EC7FA9';
  const circumference = 2 * Math.PI * 18;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: 56, height: 56 }}>
        <svg width="56" height="56" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="28" cy="28" r="18" fill="none" stroke="rgba(236,127,169,0.2)" strokeWidth="4" />
          <circle
            cx="28" cy="28" r="18" fill="none"
            stroke={color} strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - pct)}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.2s linear, stroke 0.3s' }}
          />
        </svg>
        <AnimatePresence mode="wait">
          <motion.div
            key={remaining}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color }}
          >
            {remaining}
          </motion.div>
        </AnimatePresence>
      </div>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>seconds left</span>
    </div>
  );
}
