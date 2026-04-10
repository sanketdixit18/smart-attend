'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Scan, CheckCircle, AlertTriangle, Calendar, TrendingUp, BookOpen } from 'lucide-react';

interface ClassStat { class_name: string; total_sessions: number; attended: number; percentage: number; }
interface RecentRecord { class_name: string; session_date: string; status: string; marked_at: string; }

export default function StudentDashboard() {
  const [stats, setStats] = useState<ClassStat[]>([]);
  const [recent, setRecent] = useState<RecentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/attendance/stats').then(r => r.json()).then(d => {
      setStats(d.stats || []);
      setRecent(d.recent || []);
      setLoading(false);
    });
  }, []);

  const overallPct = stats.length
    ? Math.round(stats.reduce((a, s) => a + (s.percentage || 0), 0) / stats.length)
    : 0;

  const atRisk = stats.filter(s => s.percentage < 75);

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>My Attendance</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Track your attendance across all enrolled classes</p>
        </div>

        {/* Scan CTA */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'linear-gradient(135deg, rgba(236,127,169,0.2), rgba(190,89,133,0.12))', border: '1px solid rgba(236,127,169,0.35)', borderRadius: 24, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Ready to mark attendance?</h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Scan the QR code displayed by your teacher to mark present</p>
          </div>
          <Link href="/scan" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 28px', borderRadius: 16, textDecoration: 'none', background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', color: 'white', fontWeight: 700, fontSize: 16, boxShadow: '0 8px 24px rgba(236,127,169,0.4)' }}>
            <Scan size={20} /> Scan QR Code
          </Link>
        </motion.div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {[
            { label: 'Overall Attendance', value: `${overallPct}%`, icon: TrendingUp, color: overallPct >= 75 ? '#22c55e' : '#ef4444' },
            { label: 'Classes Enrolled', value: stats.length, icon: BookOpen, color: '#EC7FA9' },
            { label: 'Classes Attended', value: stats.reduce((a, s) => a + s.attended, 0), icon: CheckCircle, color: '#BE5985' },
            { label: 'At Risk Classes', value: atRisk.length, icon: AlertTriangle, color: '#f97316' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }}>
              <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,184,224,0.35)', borderRadius: 20, padding: '20px 24px' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${s.color}18`, border: `1px solid ${s.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <s.icon size={20} color={s.color} />
                </div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Per class breakdown */}
        <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,184,224,0.35)', borderRadius: 24, padding: 28 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>Class Breakdown</h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading...</div>
          ) : stats.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No classes enrolled yet. Ask your faculty to enroll you.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {stats.map((s, i) => {
                const pct = s.percentage || 0;
                const color = pct >= 75 ? '#22c55e' : pct >= 60 ? '#f97316' : '#ef4444';
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                    <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.5)', border: `1px solid ${pct < 75 ? 'rgba(239,68,68,0.2)' : 'rgba(255,184,224,0.2)'}`, borderRadius: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{s.class_name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{s.attended} / {s.total_sessions} sessions</div>
                        </div>
                        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color }}>
                          {pct}%
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div style={{ height: 6, borderRadius: 3, background: 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} style={{ height: '100%', borderRadius: 3, background: color }} />
                      </div>
                      {pct < 75 && <div style={{ fontSize: 11, color: '#dc2626', marginTop: 8, fontWeight: 500 }}>⚠ Below minimum 75% threshold</div>}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent records */}
        {recent.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,184,224,0.35)', borderRadius: 24, padding: 28 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>Recent Activity</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recent.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.5)', borderRadius: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle size={18} color="#22c55e" />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{r.class_name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(r.marked_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', padding: '4px 10px', borderRadius: 8, background: 'rgba(34,197,94,0.1)', color: '#15803d', border: '1px solid rgba(34,197,94,0.25)' }}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
