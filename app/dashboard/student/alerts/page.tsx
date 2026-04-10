'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { AlertTriangle, CheckCircle, TrendingUp, Bell } from 'lucide-react';
import Link from 'next/link';

interface Stat { class_name: string; total_sessions: number; attended: number; percentage: number; }

export default function StudentAlerts() {
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    fetch('/api/attendance/stats').then(r => r.json()).then(d => setStats(d.stats || []));
  }, []);

  const atRisk = stats.filter(s => (s.percentage || 0) < 75);
  const safe = stats.filter(s => (s.percentage || 0) >= 75);

  function sessionsNeeded(s: Stat) {
    const needed = Math.ceil((0.75 * s.total_sessions - s.attended) / 0.25);
    return Math.max(0, needed);
  }

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Attendance Alerts</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Monitor your attendance health and stay above the 75% threshold</p>
        </div>

        {/* Status Banner */}
        {atRisk.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 20, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={26} color="#22c55e" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#15803d', marginBottom: 2 }}>All good! ✓</div>
              <div style={{ fontSize: 14, color: '#166534' }}>You are above 75% in all enrolled classes. Keep it up!</div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 20, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={26} color="#dc2626" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#dc2626', marginBottom: 2 }}>
                {atRisk.length} class{atRisk.length > 1 ? 'es' : ''} below threshold
              </div>
              <div style={{ fontSize: 14, color: '#b91c1c' }}>You must attend more sessions to reach 75% in the following classes.</div>
            </div>
          </motion.div>
        )}

        {/* At-risk classes */}
        {atRisk.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>⚠️ At Risk</h2>
            {atRisk.map((s, i) => {
              const pct = s.percentage || 0;
              const needed = sessionsNeeded(s);
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 20, padding: '22px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{s.class_name}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.attended} attended out of {s.total_sessions} sessions</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: '#dc2626' }}>{pct}%</div>
                        <div style={{ fontSize: 12, color: '#dc2626' }}>Need 75%</div>
                      </div>
                    </div>
                    {/* Progress */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
                        <span>Current: {pct}%</span><span>Target: 75%</span>
                      </div>
                      <div style={{ height: 8, borderRadius: 4, background: 'rgba(0,0,0,0.07)', overflow: 'hidden', position: 'relative' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} style={{ height: '100%', borderRadius: 4, background: '#ef4444' }} />
                        {/* Target line */}
                        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '75%', width: 2, background: '#22c55e', borderRadius: 1 }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(239,68,68,0.06)', borderRadius: 12, border: '1px solid rgba(239,68,68,0.15)' }}>
                      <Bell size={14} color="#dc2626" />
                      <span style={{ fontSize: 13, color: '#b91c1c', fontWeight: 500 }}>
                        You need to attend <strong>{needed}</strong> more consecutive session{needed !== 1 ? 's' : ''} to reach 75%
                      </span>
                    </div>
                    <Link href="/scan" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 14, padding: '10px 20px', borderRadius: 12, textDecoration: 'none', background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', color: 'white', fontWeight: 600, fontSize: 14 }}>
                      <TrendingUp size={15} /> Mark Attendance Now
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Safe classes */}
        {safe.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>✅ On Track</h2>
            {safe.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 16 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{s.class_name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.attended}/{s.total_sessions} sessions</div>
                </div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: '#15803d' }}>{s.percentage || 0}%</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
