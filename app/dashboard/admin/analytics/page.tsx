'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Users, BookOpen, TrendingUp, Activity } from 'lucide-react';

const COLORS = ['#EC7FA9', '#BE5985', '#FFB8E0', '#8B3A5E'];

export default function AdminAnalytics() {
  const [overview, setOverview] = useState<Record<string, number> | null>(null);
  const [recentSessions, setRecentSessions] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/attendance/stats').then(r => r.json()).then(d => {
      setOverview(d.overview || null);
      setRecentSessions(d.recentSessions || []);
      setLoading(false);
    });
  }, []);

  const userPieData = overview ? [
    { name: 'Students', value: overview.total_students },
    { name: 'Faculty', value: overview.total_faculty },
  ] : [];

  const sessionBarData = recentSessions.slice(0, 8).map((s: Record<string, unknown>) => ({
    name: String(s.class_name || '').split('-')[0].trim().slice(0, 10),
    attendance: Number(s.attendance_count) || 0,
  }));

  const customTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
    if (active && payload?.length) {
      return (
        <div style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(255,184,224,0.4)', borderRadius: 14, padding: '10px 14px', boxShadow: '0 8px 24px rgba(190,89,133,0.15)' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{label}</p>
          {payload.map(p => <p key={p.name} style={{ fontSize: 12, color: p.color }}>{p.name}: <strong>{p.value}</strong></p>)}
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>System Analytics</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Platform-wide attendance insights and statistics</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>Loading analytics...</div>
        ) : (
          <>
            {/* Overview cards */}
            {overview && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16 }}>
                {[
                  { label: 'Total Students', value: overview.total_students, icon: Users, color: '#EC7FA9' },
                  { label: 'Total Faculty', value: overview.total_faculty, icon: TrendingUp, color: '#BE5985' },
                  { label: 'Total Classes', value: overview.total_classes, icon: BookOpen, color: '#EC7FA9' },
                  { label: "Today's Sessions", value: overview.sessions_today, icon: Activity, color: '#BE5985' },
                  { label: "Today's Marks", value: overview.attendance_today, icon: Activity, color: '#EC7FA9' },
                ].map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                    <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,184,224,0.35)', borderRadius: 20, padding: '20px 22px' }}>
                      <s.icon size={22} color={s.color} style={{ marginBottom: 10 }} />
                      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 30, fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
              {/* Bar chart */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,184,224,0.35)', borderRadius: 24, padding: 28 }}>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>Attendance by Session</h2>
                  {sessionBarData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={sessionBarData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,184,224,0.3)" />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                        <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                        <Tooltip content={customTooltip as never} />
                        <Bar dataKey="attendance" name="Attendance" fill="#EC7FA9" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No session data</div>}
                </div>
              </motion.div>

              {/* Pie chart */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,184,224,0.35)', borderRadius: 24, padding: 28 }}>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>User Distribution</h2>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie data={userPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={6} dataKey="value">
                        {userPieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip content={customTooltip as never} />
                      <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 13 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
