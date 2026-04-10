'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Users, BookOpen, CalendarCheck, TrendingUp, Activity, Clock } from 'lucide-react';

interface Overview {
  total_students: number;
  total_faculty: number;
  total_classes: number;
  sessions_today: number;
  attendance_today: number;
}
interface RecentSession {
  id: number; class_name: string; faculty_name: string;
  started_at: string; ended_at: string; is_active: boolean; attendance_count: number;
}

export default function AdminDashboard() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/attendance/stats').then(r => r.json()).then(d => {
      setOverview(d.overview || null);
      setRecentSessions(d.recentSessions || []);
      setLoading(false);
    });
  }, []);

  const cards = overview ? [
    { label: 'Total Students', value: overview.total_students, icon: Users, color: '#EC7FA9', sub: 'registered' },
    { label: 'Faculty Members', value: overview.total_faculty, icon: TrendingUp, color: '#BE5985', sub: 'active' },
    { label: 'Classes', value: overview.total_classes, icon: BookOpen, color: '#EC7FA9', sub: 'configured' },
    { label: "Today's Sessions", value: overview.sessions_today, icon: CalendarCheck, color: '#BE5985', sub: 'held' },
    { label: "Today's Attendance", value: overview.attendance_today, icon: Activity, color: '#EC7FA9', sub: 'marks' },
  ] : [];

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>System-wide overview and management</p>
        </div>

        {/* Overview cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Loading system data...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {cards.map((c, i) => (
              <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -4 }}>
                <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,184,224,0.35)', borderRadius: 20, padding: '22px 24px', boxShadow: '0 4px 20px rgba(190,89,133,0.07)' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: `${c.color}18`, border: `1px solid ${c.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <c.icon size={20} color={c.color} />
                  </div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--text-primary)' }}>{c.value}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 2 }}>{c.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{c.sub}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Recent Sessions */}
        <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,184,224,0.35)', borderRadius: 24, padding: 28 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>Recent Sessions</h2>
          {recentSessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No sessions recorded yet.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
                <thead>
                  <tr>
                    {['Class', 'Faculty', 'Status', 'Attendance', 'Date'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '6px 14px', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentSessions.map((s, i) => (
                    <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                      <td style={{ padding: '13px 14px', background: 'rgba(255,255,255,0.6)', borderRadius: '14px 0 0 14px', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{s.class_name}</td>
                      <td style={{ padding: '13px 14px', background: 'rgba(255,255,255,0.6)', fontSize: 14, color: 'var(--text-secondary)' }}>{s.faculty_name}</td>
                      <td style={{ padding: '13px 14px', background: 'rgba(255,255,255,0.6)' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 8, ...(s.is_active ? { background: 'rgba(34,197,94,0.1)', color: '#15803d', border: '1px solid rgba(34,197,94,0.25)' } : { background: 'rgba(107,114,128,0.1)', color: '#6b7280', border: '1px solid rgba(107,114,128,0.2)' }) }}>
                          {s.is_active ? 'LIVE' : 'ENDED'}
                        </span>
                      </td>
                      <td style={{ padding: '13px 14px', background: 'rgba(255,255,255,0.6)', fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: 'var(--dark-accent)' }}>{s.attendance_count}</td>
                      <td style={{ padding: '13px 14px', background: 'rgba(255,255,255,0.6)', borderRadius: '0 14px 14px 0', fontSize: 13, color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Clock size={12} />
                          {new Date(s.started_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { label: 'Manage Users', desc: 'Add, edit, or deactivate system users', href: '/dashboard/admin/users', icon: Users, color: '#EC7FA9' },
            { label: 'Manage Classes', desc: 'Configure classes and enrollment', href: '/dashboard/admin/classes', icon: BookOpen, color: '#BE5985' },
            { label: 'View Analytics', desc: 'System-wide attendance reports', href: '/dashboard/admin/analytics', icon: TrendingUp, color: '#EC7FA9' },
          ].map(item => (
            <motion.a key={item.label} href={item.href} whileHover={{ y: -4 }} style={{ display: 'block', background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,184,224,0.35)', borderRadius: 20, padding: 24, textDecoration: 'none', cursor: 'pointer' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${item.color}18`, border: `1px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <item.icon size={20} color={item.color} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.desc}</div>
            </motion.a>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
