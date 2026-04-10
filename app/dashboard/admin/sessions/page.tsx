'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { CalendarCheck, Users } from 'lucide-react';

interface Session {
  id: number;
  class_name: string;
  faculty_name: string;
  is_active: boolean;
  started_at: string;
  ended_at: string | null;
  attendance_count: number;
}

export default function AdminSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/attendance/stats')
      .then(r => r.json())
      .then(d => {
        setSessions(d.recentSessions || []);
        setLoading(false);
      });
  }, []);

  function formatDuration(start: string, end: string | null) {
    const s = new Date(start);
    const e = end ? new Date(end) : new Date();
    const diff = Math.round((e.getTime() - s.getTime()) / 60000);
    return diff < 60 ? `${diff}m` : `${Math.floor(diff / 60)}h ${diff % 60}m`;
  }

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>All Sessions</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>System-wide attendance sessions</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,184,224,0.35)', borderRadius: 24, padding: 28 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Loading...</div>
          ) : sessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>No sessions found.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sessions.map((s, i) => (
                <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,184,224,0.15)', borderRadius: 16, flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(236,127,169,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CalendarCheck size={18} color="var(--primary)" />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{s.class_name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                          {s.faculty_name} · {new Date(s.started_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {formatDuration(s.started_at, s.ended_at)}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Users size={14} color="var(--text-muted)" />
                        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--dark-accent)', fontFamily: 'Playfair Display, serif' }}>{s.attendance_count}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>attended</span>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 8, ...(s.is_active ? { background: 'rgba(34,197,94,0.1)', color: '#15803d', border: '1px solid rgba(34,197,94,0.25)' } : { background: 'rgba(107,114,128,0.1)', color: '#6b7280', border: '1px solid rgba(107,114,128,0.2)' }) }}>
                        {s.is_active ? 'LIVE' : 'ENDED'}
                      </span>
                    </div>
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