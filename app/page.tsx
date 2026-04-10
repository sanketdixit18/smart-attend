'use client';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import { QrCode, Shield, MapPin, BarChart3, Zap, Scan, ArrowRight, Star } from 'lucide-react';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };

const features = [
  { icon: QrCode, title: 'Rotating QR Codes', desc: 'Dynamic QR codes refresh every 10 seconds. Screenshots and sharing are useless.', color: '#EC7FA9' },
  { icon: Shield, title: 'UID Authentication', desc: 'Unique immutable student IDs verified server-side on every single scan attempt.', color: '#BE5985' },
  { icon: MapPin, title: 'GPS Verification', desc: 'Students must be physically within 100m of the classroom to mark attendance.', color: '#EC7FA9' },
  { icon: Scan, title: 'Face Recognition', desc: 'Optional AI face matching adds an additional powerful anti-proxy layer.', color: '#BE5985' },
  { icon: BarChart3, title: 'Analytics & Alerts', desc: 'Real-time dashboards, low-attendance warnings, and exportable reports.', color: '#EC7FA9' },
  { icon: Zap, title: 'Real-Time WebSocket', desc: 'Socket.io powered live QR delivery — no polling, instant synchronized updates.', color: '#BE5985' },
];

const steps = [
  { n: '01', title: 'Teacher Starts Session', desc: 'Faculty opens the dashboard and launches an attendance session for their class with one click.' },
  { n: '02', title: 'Dynamic QR Appears', desc: 'A rotating QR code is generated live and displayed on screen, changing every 10 seconds.' },
  { n: '03', title: 'Student Scans', desc: 'Students open the app and scan the QR code. GPS location is captured automatically.' },
  { n: '04', title: 'Attendance Marked', desc: 'Five validation layers confirm identity, active session, token validity, no duplicates, and location.' },
];

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>
      {/* Ambient orbs */}
      <div style={{ position: 'fixed', top: -200, right: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,184,224,0.45) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0, animation: 'floatOrb 10s ease-in-out infinite' }} />
      <div style={{ position: 'fixed', bottom: -150, left: -150, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,127,169,0.3) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0, animation: 'floatOrb 13s ease-in-out infinite reverse' }} />

      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '16px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,237,250,0.75)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,184,224,0.25)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <QrCode size={20} color="white" />
          </div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: 'var(--dark-accent)' }}>SmartAttend</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/uid-login" style={{ padding: '8px 22px', borderRadius: 12, border: '2px solid var(--primary)', color: 'var(--dark-accent)', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>Student Login</Link>
          <Link href="/login" style={{ padding: '8px 22px', borderRadius: 12, border: '1px solid rgba(255,184,224,0.4)', color: 'var(--text-secondary)', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>Faculty Login</Link>
          <Link href="/register" style={{ padding: '8px 22px', borderRadius: 12, background: 'linear-gradient(135deg, var(--primary), var(--dark-accent))', color: 'white', fontWeight: 600, textDecoration: 'none', fontSize: 14, boxShadow: '0 4px 16px rgba(236,127,169,0.4)' }}>Get Started</Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px', position: 'relative', zIndex: 1 }}>
        <motion.div variants={stagger} initial="hidden" animate="show" style={{ textAlign: 'center', maxWidth: 780 }}>
          <motion.div variants={fadeUp}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 100, background: 'rgba(236,127,169,0.15)', border: '1px solid rgba(236,127,169,0.35)', fontSize: 13, fontWeight: 600, color: 'var(--dark-accent)', marginBottom: 28 }}>
              <Star size={13} fill="var(--primary)" stroke="none" /> Next-gen attendance management
            </span>
          </motion.div>
          <motion.h1 variants={fadeUp} style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(44px, 8vw, 84px)', fontWeight: 700, lineHeight: 1.08, color: 'var(--text-primary)', marginBottom: 24 }}>
            Smart{' '}
            <span style={{ background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Attendance</span>
            {' '}System
          </motion.h1>
          <motion.p variants={fadeUp} style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 44px' }}>
            Eliminate proxy attendance with rotating QR codes, GPS verification, UID authentication, and real-time tracking — all in one elegant platform.
          </motion.p>
          <motion.div variants={fadeUp} style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 72 }}>
            <Link href="/register" style={{ padding: '15px 36px', borderRadius: 16, textDecoration: 'none', background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', color: 'white', fontWeight: 700, fontSize: 16, boxShadow: '0 8px 30px rgba(236,127,169,0.45)', display: 'flex', alignItems: 'center', gap: 8 }}>
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link href="/login" style={{ padding: '15px 36px', borderRadius: 16, textDecoration: 'none', background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(255,184,224,0.5)', color: 'var(--dark-accent)', fontWeight: 600, fontSize: 16 }}>
              Sign In
            </Link>
          </motion.div>
          <motion.div variants={fadeUp} style={{ display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[['99.9%', 'Accuracy'], ['< 3s', 'Scan Time'], ['5 Layers', 'Security'], ['Real-time', 'Updates']].map(([val, lbl]) => (
              <div key={lbl} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 30, fontWeight: 700, color: 'var(--dark-accent)' }}>{val}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{lbl}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section style={{ padding: '100px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>
              Everything to{' '}
              <span style={{ background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>eliminate proxies</span>
            </h2>
            <p style={{ fontSize: 17, color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto' }}>Six layers of protection working together, completely invisible to honest students.</p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeUp} whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
                <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,184,224,0.4)', borderRadius: 24, padding: 32, height: '100%', boxShadow: '0 4px 24px rgba(190,89,133,0.07)' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, marginBottom: 20, background: `linear-gradient(135deg, ${f.color}22, ${f.color}0a)`, border: `1.5px solid ${f.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <f.icon size={24} color={f.color} />
                  </div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 19, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--text-secondary)' }}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ padding: '100px 24px', position: 'relative', zIndex: 1, background: 'rgba(255,184,224,0.06)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>How it works</h2>
            <p style={{ fontSize: 17, color: 'var(--text-secondary)' }}>Four steps to fraud-proof attendance in under 30 seconds</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
            {steps.map((step, i) => (
              <motion.div key={step.n} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} style={{ textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px', background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 28px rgba(236,127,169,0.4)', fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: 'white' }}>
                  {step.n}
                </div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--text-secondary)' }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 24px', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', background: 'linear-gradient(135deg, rgba(236,127,169,0.14), rgba(190,89,133,0.08))', border: '1px solid rgba(236,127,169,0.3)', borderRadius: 32, padding: '64px 40px', backdropFilter: 'blur(20px)' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Ready to transform attendance?</h2>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 36 }}>Join institutions already using SmartAttend to eliminate proxy attendance permanently.</p>
          <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '15px 40px', borderRadius: 16, textDecoration: 'none', background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', color: 'white', fontWeight: 700, fontSize: 16, boxShadow: '0 8px 30px rgba(236,127,169,0.45)' }}>
            Start for Free <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '36px 48px', borderTop: '1px solid rgba(255,184,224,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <QrCode size={15} color="white" />
          </div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 700, color: 'var(--dark-accent)' }}>SmartAttend</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>© 2024 SmartAttend — Built with Next.js, MySQL & ❤️</p>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link href="/login" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>Login</Link>
          <Link href="/register" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>Register</Link>
        </div>
      </footer>

      <style>{`@keyframes floatOrb{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-30px) scale(1.04)}}`}</style>
    </div>
  );
}
