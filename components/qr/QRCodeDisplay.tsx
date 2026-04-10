'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import CountdownTimer from './CountdownTimer';
import { RefreshCw, Wifi } from 'lucide-react';

interface QRCodeDisplayProps {
  sessionId: number;
  initialToken: string;
  initialExpiresAt: string;
}

export default function QRCodeDisplay({ sessionId, initialToken, initialExpiresAt }: QRCodeDisplayProps) {
  const [token, setToken] = useState(initialToken);
  const [expiresAt, setExpiresAt] = useState(initialExpiresAt);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  const refreshToken = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}/token`, { method: 'POST' });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        setExpiresAt(data.expiresAt);
        setRefreshCount(c => c + 1);
      }
    } catch {
      console.error('Failed to refresh token');
    } finally {
      setRefreshing(false);
    }
  }, [sessionId]);

  const handleExpire = useCallback(() => {
    refreshToken();
  }, [refreshToken]);

  // Encode token + session into QR payload
  const qrPayload = JSON.stringify({ token, sessionId, t: Date.now() });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      {/* Live indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', animation: 'pulse-green 2s infinite' }} />
        <Wifi size={13} color="#15803d" />
        <span style={{ fontSize: 12, fontWeight: 600, color: '#15803d' }}>LIVE — Session Active</span>
      </div>

      {/* QR Card */}
      <motion.div
        className="qr-pulse"
        style={{ background: 'white', borderRadius: 24, padding: 28, boxShadow: '0 12px 48px rgba(236,127,169,0.25)', border: '2px solid rgba(236,127,169,0.2)' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={refreshCount}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <QRCode
              value={qrPayload}
              size={220}
              bgColor="white"
              fgColor="#BE5985"
              style={{ borderRadius: 12 }}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Timer + refresh */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <CountdownTimer expiresAt={expiresAt} onExpire={handleExpire} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <button
            onClick={refreshToken}
            disabled={refreshing}
            style={{ width: 44, height: 44, borderRadius: 14, border: '1.5px solid rgba(236,127,169,0.4)', background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <motion.div animate={{ rotate: refreshing ? 360 : 0 }} transition={{ duration: 0.6, ease: 'linear', repeat: refreshing ? Infinity : 0 }}>
              <RefreshCw size={18} color="var(--primary)" />
            </motion.div>
          </button>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>refresh</span>
        </div>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', maxWidth: 260 }}>
        QR code rotates automatically every 10 seconds. Screenshots cannot be reused.
      </p>

      <style>{`
        @keyframes pulse-green {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }
        @keyframes qr-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(236,127,169,0.4); }
          50% { box-shadow: 0 0 0 16px rgba(236,127,169,0); }
        }
        .qr-pulse { animation: qr-pulse 2.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
