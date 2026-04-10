'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { QrCode, Hash, ArrowRight, RefreshCw, CheckCircle, Mail } from 'lucide-react';

type Step = 'uid' | 'otp' | 'success';

export default function UIDLoginPage() {
  const [step, setStep] = useState<Step>('uid');
  const [uid, setUid] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [studentName, setStudentName] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  async function handleUIDSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!uid.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: uid.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setMaskedEmail(data.maskedEmail);
      setStudentName(data.name);
      setDevOtp(data.devOtp || '');
      setStep('otp');
      setCountdown(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleOTPSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) { setError('Please enter all 6 digits'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ uid: uid.trim().toUpperCase(), otp: code }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setStep('success');
      await new Promise(r => setTimeout(r, 1000));
      window.location.href = `/dashboard/${data.user.role}`;
    } catch {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleOTPChange(i: number, val: string) {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val.slice(-1);
    setOtp(newOtp);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  }

  function handleOTPKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  }

  function handleOTPPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
  }

  async function resendOTP() {
    if (countdown > 0) return;
    setLoading(true);
    setError('');
    setOtp(['', '', '', '', '', '']);
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: uid.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setDevOtp(data.devOtp || '');
      setCountdown(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch {
      setError('Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  }

  const card: React.CSSProperties = {
    background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,184,224,0.4)', borderRadius: 28,
    padding: 40, boxShadow: '0 20px 60px rgba(190,89,133,0.15)',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 24, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', top: -200, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,184,224,0.5), transparent)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: -150, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,127,169,0.3), transparent)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(236,127,169,0.4)' }}>
              <QrCode size={24} color="white" />
            </div>
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: 'var(--dark-accent)' }}>SmartAttend</span>
          </Link>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Enter UID */}
          {step === 'uid' && (
            <motion.div key="uid" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: 'linear-gradient(135deg, rgba(236,127,169,0.2), rgba(190,89,133,0.1))', border: '1.5px solid rgba(236,127,169,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Hash size={22} color="var(--dark-accent)" />
                </div>
                <div>
                  <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>Student Login</h1>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Enter your college-issued UID</p>
                </div>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '10px 14px', fontSize: 14, color: '#dc2626', marginBottom: 20 }}>
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleUIDSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>University ID (UID)</label>
                  <input
                    type="text"
                    placeholder="e.g. SA2024001"
                    value={uid}
                    onChange={e => setUid(e.target.value.toUpperCase())}
                    required
                    autoFocus
                    style={{ width: '100%', padding: '14px 18px', borderRadius: 14, border: '1.5px solid rgba(255,184,224,0.5)', background: 'rgba(255,255,255,0.8)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', outline: 'none', letterSpacing: '0.08em', fontFamily: 'DM Sans, sans-serif', textAlign: 'center' }}
                  />
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>Your UID is provided by your institution. An OTP will be sent to your registered email.</p>
                </div>

                <motion.button type="submit" disabled={loading || !uid.trim()} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', color: 'white', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 24px rgba(236,127,169,0.4)', fontFamily: 'DM Sans, sans-serif', opacity: loading ? 0.8 : 1 }}>
                  {loading ? (
                    <><div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite' }} /><span>Verifying UID...</span></>
                  ) : (
                    <><span>Send OTP</span><ArrowRight size={18} /></>
                  )}
                </motion.button>
              </form>

              <div style={{ marginTop: 24, padding: 16, background: 'rgba(236,127,169,0.07)', borderRadius: 12, border: '1px solid rgba(236,127,169,0.15)' }}>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>Sample UIDs for testing:</p>
                {['SA2024001', 'SA2024002', 'SA2024003', 'SA-STU-001'].map(u => (
                  <button key={u} onClick={() => setUid(u)} style={{ display: 'block', fontSize: 12, color: 'var(--dark-accent)', background: 'none', border: 'none', cursor: 'pointer', padding: '1px 0', fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>
                    → {u}
                  </button>
                ))}
              </div>

              <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
                Faculty / Admin?{' '}
                <Link href="/login" style={{ color: 'var(--dark-accent)', fontWeight: 600, textDecoration: 'none' }}>Login here →</Link>
              </p>
            </motion.div>
          )}

          {/* Step 2: Enter OTP */}
          {step === 'otp' && (
            <motion.div key="otp" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: 'linear-gradient(135deg, rgba(236,127,169,0.2), rgba(190,89,133,0.1))', border: '1.5px solid rgba(236,127,169,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={22} color="var(--dark-accent)" />
                </div>
                <div>
                  <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>Enter OTP</h1>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Sent to {maskedEmail}</p>
                </div>
              </div>

              <div style={{ background: 'rgba(236,127,169,0.08)', border: '1px solid rgba(236,127,169,0.2)', borderRadius: 12, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: 'var(--text-secondary)' }}>
                Welcome, <strong>{studentName}</strong>! Check your registered email for the 6-digit code.
              </div>

              {/* Dev OTP hint */}
              {devOtp && (
                <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: '#15803d' }}>
                  🛠 Dev mode — OTP: <strong style={{ letterSpacing: '0.1em', fontSize: 16 }}>{devOtp}</strong>
                  <button onClick={() => setOtp(devOtp.split(''))} style={{ marginLeft: 10, fontSize: 11, color: '#15803d', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 6, padding: '2px 8px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                    Auto-fill
                  </button>
                </div>
              )}

              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '10px 14px', fontSize: 14, color: '#dc2626', marginBottom: 20 }}>
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleOTPSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* OTP Input boxes */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 14, textAlign: 'center' }}>Enter 6-digit OTP</label>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }} onPaste={handleOTPPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOTPChange(i, e.target.value)}
                        onKeyDown={e => handleOTPKeyDown(i, e)}
                        style={{
                          width: 52, height: 60, textAlign: 'center', fontSize: 24, fontWeight: 800,
                          borderRadius: 14, border: `2px solid ${digit ? 'var(--primary)' : 'rgba(255,184,224,0.5)'}`,
                          background: digit ? 'rgba(236,127,169,0.1)' : 'rgba(255,255,255,0.8)',
                          color: 'var(--dark-accent)', outline: 'none', fontFamily: 'DM Sans, sans-serif',
                          transition: 'all 0.2s',
                        }}
                      />
                    ))}
                  </div>
                </div>

                <motion.button type="submit" disabled={loading || otp.join('').length !== 6} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', color: 'white', fontSize: 16, fontWeight: 700, cursor: (loading || otp.join('').length !== 6) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 24px rgba(236,127,169,0.4)', fontFamily: 'DM Sans, sans-serif', opacity: (loading || otp.join('').length !== 6) ? 0.7 : 1 }}>
                  {loading ? (
                    <><div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite' }} /><span>Verifying...</span></>
                  ) : (
                    <><span>Verify & Login</span><CheckCircle size={18} /></>
                  )}
                </motion.button>
              </form>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                <button onClick={() => { setStep('uid'); setOtp(['','','','','','']); setError(''); }} style={{ fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                  ← Change UID
                </button>
                <button onClick={resendOTP} disabled={countdown > 0 || loading} style={{ fontSize: 13, color: countdown > 0 ? 'var(--text-muted)' : 'var(--dark-accent)', background: 'none', border: 'none', cursor: countdown > 0 ? 'default' : 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <RefreshCw size={13} />
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ ...card, textAlign: 'center' }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(34,197,94,0.12)', border: '2px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <CheckCircle size={44} color="#22c55e" />
                </div>
              </motion.div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: '#15803d', marginBottom: 8 }}>Verified!</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Redirecting to your dashboard...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
