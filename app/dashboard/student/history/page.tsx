'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { CheckCircle, Calendar } from 'lucide-react';

interface Record { class_name: string; session_date: string; status: string; marked_at: string; }
interface Stat { class_name: string; total_sessions: number; attended: number; percentage: number; }

export default function StudentHistory() {
  const [records, setRecords] = useState<Record[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/attendance/stats').then(r => r.json()).then(d => {
      setRecords(d.recent || []);
      setStats(d.stats || []);
    });
  }, []);

  const classes = ['all', ...Array.from(new Set(records.map(r => r.class_name)))];

  const filteredRecords = filter === 'all' ? records : records.filter(r => r.class_name === filter);

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>My Attendance History</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Detailed record of all your marked attendances</p>
        </div>

        {/* Per-class summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {stats.map((s, i) => {
            const pct = s.percentage || 0;
            const color = pct >= 75 ? '#22c55e' : pct >= 60 ? '#f97316' : '#ef4444';
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,184,224,0.35)', borderRadius: 20, padding: '20px 22px' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>{s.class_name}</div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color }}>{pct}%</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{s.attended}/{s.total_sessions} sessions</div>
                  <div style={{ height: 5, borderRadius: 3, background: 'rgba(0,0,0,0.06)', marginTop: 10, overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} style={{ height: '100%', borderRadius: 3, background: color }} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {classes.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{ padding: '7px 16px', borderRadius: 100, border: `1.5px solid ${filter === c ? 'var(--primary)' : 'rgba(255,184,224,0.4)'}`, background: filter === c ? 'rgba(236,127,169,0.15)' : 'rgba(255,255,255,0.6)', color: filter === c ? 'var(--dark-accent)' : 'var(--text-secondary)', fontWeight: filter === c ? 600 : 500, fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
              {c === 'all' ? 'All Classes' : c}
            </button>
          ))}
        </div>

        {/* Records */}
        <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,184,224,0.35)', borderRadius: 24, padding: 28 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>
            Records <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-muted)' }}>({filteredRecords.length})</span>
          </h2>
          {filteredRecords.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <Calendar size={48} color="rgba(190,89,133,0.3)" style={{ marginBottom: 16 }} />
              <p style={{ color: 'var(--text-muted)' }}>No attendance records yet. Scan a QR code to mark your first attendance!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredRecords.map((r, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,184,224,0.15)', borderRadius: 16, flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle size={18} color="#22c55e" />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{r.class_name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>
                          {new Date(r.marked_at).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                          {' at '}
                          {new Date(r.marked_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 8, background: 'rgba(34,197,94,0.1)', color: '#15803d', border: '1px solid rgba(34,197,94,0.25)', textTransform: 'uppercase' }}>
                      {r.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
