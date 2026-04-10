'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Scan, CheckCircle, XCircle, MapPin, RefreshCw } from 'lucide-react';

type ScanState = 'idle' | 'scanning' | 'success' | 'error';

export default function ScanPage() {
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState('');
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef<unknown>(null);
  const isRunning = useRef(false);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocationError('Location access denied. GPS check will be skipped.')
    );
  }, []);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current && isRunning.current) {
      try {
        const s = scannerRef.current as { stop: () => Promise<void>; clear: () => void };
        await s.stop();
        s.clear();
      } catch { /* ignore */ }
    }
    scannerRef.current = null;
    isRunning.current = false;
  }, []);

  const submitAttendance = useCallback(async (decodedText: string) => {
    await stopScanner();
    setLoading(true);
    setScanState('idle');
    try {
      const payload = JSON.parse(decodedText);
      const res = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token: payload.token, latitude: location?.lat, longitude: location?.lng }),
      });
      const data = await res.json();
      setScanState(res.ok ? 'success' : 'error');
      setMessage(res.ok ? (data.message || 'Attendance marked!') : (data.error || 'Failed to mark attendance.'));
    } catch {
      setScanState('error');
      setMessage('Invalid QR code. Scan the one shown by your teacher.');
    } finally {
      setLoading(false);
    }
  }, [location, stopScanner]);

  useEffect(() => {
    if (scanState !== 'scanning') return;
    let cancelled = false;

    const init = async () => {
      // Wait for React to render the #qr-reader div
      await new Promise(r => setTimeout(r, 500));
      if (cancelled) return;

      const el = document.getElementById('qr-reader');
      if (!el) {
        setScanState('error');
        setMessage('Scanner failed to initialize. Please try again.');
        return;
      }

      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        const scanner = new Html5Qrcode('qr-reader');
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (text: string) => {
            if (!isRunning.current) return;
            isRunning.current = false;
            submitAttendance(text);
          },
          () => {}
        );
        isRunning.current = true;
      } catch {
        setScanState('error');
        setMessage('Camera access denied. Please allow camera access in your browser settings and try again.');
      }
    };

    init();
    return () => { cancelled = true; stopScanner(); };
  }, [scanState, submitAttendance, stopScanner]);

  // Cleanup on unmount
  useEffect(() => () => { stopScanner(); }, [stopScanner]);

  function reset() { stopScanner(); setScanState('idle'); setMessage(''); }

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Scan QR Code</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Point your camera at the QR code shown by your teacher</p>
        </div>

        {locationError && (
          <div style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 14, padding: '10px 14px', fontSize: 13, color: '#b45309', marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
            <MapPin size={14} /> {locationError}
          </div>
        )}
        {location && (
          <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 14, padding: '10px 14px', fontSize: 13, color: '#15803d', marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
            <MapPin size={14} /> GPS: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </div>
        )}

        <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,184,224,0.35)', borderRadius: 28, padding: 32, minHeight: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>

          {/* SCANNING STATE — always rendered in DOM to keep #qr-reader mounted */}
          <div style={{ display: scanState === 'scanning' ? 'block' : 'none', width: '100%' }}>
            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
              Hold the QR code steady inside the frame
            </p>
            <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', border: '2px solid rgba(236,127,169,0.5)', background: '#111' }}>
              <div id="qr-reader" style={{ width: '100%' }} />
              {/* scanning line animation */}
              <motion.div
                animate={{ top: ['8%', '88%', '8%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', left: '5%', right: '5%', height: 2, background: 'linear-gradient(90deg, transparent, #EC7FA9, transparent)', zIndex: 10, pointerEvents: 'none' }}
              />
              {/* corner markers */}
              {[['0%','0%','border-top','border-left'],['0%','auto','border-top','border-right'],['auto','0%','border-bottom','border-left'],['auto','auto','border-bottom','border-right']].map(([t,r,b1,b2], idx) => (
                <div key={idx} style={{ position: 'absolute', top: t === 'auto' ? 'auto' : t, right: r === 'auto' ? undefined : r, bottom: t === 'auto' ? '8%' : undefined, left: r === 'auto' ? '5%' : undefined, width: 24, height: 24, borderColor: '#EC7FA9', borderStyle: 'solid', borderWidth: 0, [b1.replace('border-', 'border') + 'Width']: 3, [b2.replace('border-', 'border') + 'Width']: 3, zIndex: 11 }} />
              ))}
            </div>
            <button onClick={reset} style={{ marginTop: 16, width: '100%', padding: '12px', borderRadius: 14, border: '1.5px solid rgba(255,184,224,0.5)', background: 'rgba(255,255,255,0.7)', color: 'var(--dark-accent)', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 14 }}>
              Cancel
            </button>
          </div>

          <AnimatePresence mode="wait">
            {/* Idle */}
            {scanState === 'idle' && !loading && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%', textAlign: 'center' }}>
                <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  <div style={{ width: 110, height: 110, borderRadius: 32, background: 'linear-gradient(135deg, rgba(236,127,169,0.15), rgba(190,89,133,0.08))', border: '2px dashed rgba(236,127,169,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Scan size={52} color="var(--primary)" strokeWidth={1.5} />
                  </div>
                </motion.div>
                <div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Ready to Scan</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 300, margin: '0 auto' }}>Tap the button below to open your camera and scan your teacher's QR code</p>
                </div>
                <motion.button onClick={() => setScanState('scanning')} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  style={{ padding: '14px 36px', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 24px rgba(236,127,169,0.45)', fontFamily: 'DM Sans, sans-serif' }}>
                  <Scan size={20} /> Open Camera
                </motion.button>
              </motion.div>
            )}

            {/* Loading */}
            {loading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', border: '3px solid rgba(236,127,169,0.2)', borderTopColor: 'var(--primary)', animation: 'spin 0.8s linear infinite' }} />
                <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Verifying attendance...</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>JWT → Session → Token → Duplicate → GPS</p>
              </motion.div>
            )}

            {/* Success */}
            {scanState === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }}>
                  <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={52} color="#22c55e" />
                  </div>
                </motion.div>
                <div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: '#15803d', marginBottom: 8 }}>Attendance Marked! ✓</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{message}</p>
                </div>
                <button onClick={reset} style={{ padding: '12px 28px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                  <RefreshCw size={16} /> Scan Again
                </button>
              </motion.div>
            )}

            {/* Error */}
            {scanState === 'error' && (
              <motion.div key="error" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }}>
                  <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', border: '2px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <XCircle size={52} color="#ef4444" />
                  </div>
                </motion.div>
                <div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: '#dc2626', marginBottom: 8 }}>Failed</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 300 }}>{message}</p>
                </div>
                <button onClick={reset} style={{ padding: '12px 28px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', color: 'white', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                  <RefreshCw size={16} /> Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Security layers */}
        <div style={{ marginTop: 20, background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,184,224,0.2)', borderRadius: 20, padding: 18 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>🔐 5-layer security on every scan</p>
          {['JWT identity check', 'Session active', '10-second token window', 'Duplicate prevention', 'GPS proximity'].map((l, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white', flexShrink: 0 }}>{i + 1}</div>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  );
}
