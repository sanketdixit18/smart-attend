'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import QRCodeDisplay from '@/components/qr/QRCodeDisplay';
import { Play, Square, BookOpen, Users, TrendingUp, Clock, Plus, ChevronRight, AlertCircle } from 'lucide-react';

interface Class { id: number; name: string; subject: string; }
interface Session { id: number; class_id: number; class_name: string; token?: string; expiresAt?: string; }
interface Stats { classStats: Array<{ id: number; name: string; total_sessions: number; unique_students: number; total_attendance: number; }>; lowAttendance: Array<{ name: string; email: string; class_name: string; percentage: number; }>; weeklyData: Array<{ date: string; count: number; }>; }

export default function FacultyDashboard() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [starting, setStarting] = useState(false);
  const [ending, setEnding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/classes').then(r => r.json()).then(d => {
      setClasses(d.classes || []);
      if (d.classes?.length) setSelectedClass(d.classes[0].id);
    });
    fetch('/api/attendance/stats').then(r => r.json()).then(d => setStats(d));
  }, []);

  async function startSession() {
    if (!selectedClass) return;
    setStarting(true); setError('');
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ class_id: selectedClass }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      const cls = classes.find(c => c.id === selectedClass);
      setActiveSession({ id: data.sessionId, class_id: selectedClass, class_name: cls?.name || '', token: data.token, expiresAt: data.expiresAt });
    } catch { setError('Failed to start session'); }
    finally { setStarting(false); }
  }

  async function endSession() {
    if (!activeSession) return;
    setEnding(true);
    try {
      await fetch(`/api/sessions/${activeSession.id}`, { method: 'PATCH' });
      setActiveSession(null);
      fetch('/api/attendance/stats').then(r => r.json()).then(d => setStats(d));
    } catch { setError('Failed to end session'); }
    finally { setEnding(false); }
  }

  const statCards = [
    { label: 'My Classes', value: stats?.classStats?.length || 0, icon: BookOpen, color: '#EC7FA9' },
    { label: 'Total Sessions', value: stats?.classStats?.reduce((a, c) => a + c.total_sessions, 0) || 0, icon: Clock, color: '#BE5985' },
    { label: 'Total Students', value: stats?.classStats?.reduce((a, c) => a + c.unique_students, 0) || 0, icon: Users, color: '#EC7FA9' },
    { label: 'Low Attendance', value: stats?.lowAttendance?.length || 0, icon: AlertCircle, color: '#ef4444' },
  ];

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Header */}
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Faculty Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Manage attendance sessions and monitor your students</p>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {statCards.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }}>
              <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,184,224,0.35)', borderRadius: 20, padding: '20px 24px', boxShadow: '0 4px 20px rgba(190,89,133,0.07)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: `${s.color}18`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <s.icon size={20} color={s.color} />
                  </div>
                </div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 30, fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: activeSession ? '1fr 1fr' : '1fr', gap: 24 }}>
          {/* Session Control */}
          <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,184,224,0.35)', borderRadius: 24, padding: 28 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>
              {activeSession ? '🟢 Session Running' : 'Start Attendance Session'}
            </h2>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: '#dc2626', marginBottom: 16 }}>{error}</div>
            )}

            {!activeSession ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Select Class</label>
                  <select
                    value={selectedClass || ''}
                    onChange={e => setSelectedClass(Number(e.target.value))}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 14, border: '1.5px solid rgba(255,184,224,0.5)', background: 'rgba(255,255,255,0.7)', fontSize: 15, color: 'var(--text-primary)', outline: 'none', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <motion.button onClick={startSession} disabled={starting || !selectedClass} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 6px 20px rgba(34,197,94,0.35)', fontFamily: 'DM Sans, sans-serif' }}>
                  {starting ? <div className="spinner" /> : <><Play size={18} fill="white" /> Start Attendance</>}
                </motion.button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ padding: '14px 16px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 14 }}>
                  <div style={{ fontSize: 13, color: '#15803d', fontWeight: 600 }}>Active class</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>{activeSession.class_name}</div>
                </div>
                <motion.button onClick={endSession} disabled={ending} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 6px 20px rgba(239,68,68,0.35)', fontFamily: 'DM Sans, sans-serif' }}>
                  {ending ? <div className="spinner" /> : <><Square size={16} fill="white" /> End Session</>}
                </motion.button>
              </div>
            )}
          </div>

          {/* QR Code Panel */}
          <AnimatePresence>
            {activeSession && activeSession.token && activeSession.expiresAt && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,184,224,0.35)', borderRadius: 24, padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>Live QR Code</h2>
                <QRCodeDisplay sessionId={activeSession.id} initialToken={activeSession.token} initialExpiresAt={activeSession.expiresAt} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Classes Overview */}
        {stats?.classStats && stats.classStats.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,184,224,0.35)', borderRadius: 24, padding: 28 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>Class Overview</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stats.classStats.map(cls => (
                <div key={cls.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'rgba(255,255,255,0.6)', borderRadius: 16, border: '1px solid rgba(255,184,224,0.2)' }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{cls.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{cls.total_sessions} sessions · {cls.unique_students} students</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--dark-accent)', fontFamily: 'Playfair Display, serif' }}>{cls.total_attendance}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>attendances</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Low attendance alerts */}
        {stats?.lowAttendance && stats.lowAttendance.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 24, padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <AlertCircle size={20} color="#dc2626" />
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 600, color: 'var(--text-primary)' }}>Low Attendance Alerts</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stats.lowAttendance.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(239,68,68,0.05)', borderRadius: 14, border: '1px solid rgba(239,68,68,0.15)' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.class_name}</div>
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#dc2626', fontFamily: 'Playfair Display, serif' }}>
                    {s.percentage ?? 0}%
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
