'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, AlertTriangle, Users, BookOpen } from 'lucide-react';

interface ClassStat { id: number; name: string; total_sessions: number; unique_students: number; total_attendance: number; }
interface LowStudent { name: string; email: string; class_name: string; percentage: number; }
interface WeeklyData { date: string; count: number; }

const COLORS = ['#EC7FA9', '#BE5985', '#FFB8E0', '#8B3A5E', '#F4A0C2'];

export default function FacultyAnalytics() {
  const [classStats, setClassStats] = useState<ClassStat[]>([]);
  const [lowAttendance, setLowAttendance] = useState<LowStudent[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/attendance/stats').then(r => r.json()).then(d => {
      setClassStats(d.classStats || []);
      setLowAttendance(d.lowAttendance || []);
      setWeeklyData(d.weeklyData || []);
      setLoading(false);
    });
  }, []);

  const barData = classStats.map(c => ({
    name: c.name.split('-')[0].trim(),
    sessions: c.total_sessions,
    students: c.unique_students,
    attendance: c.total_attendance,
  }));

  const pieData = classStats.map(c => ({
    name: c.name.split('-')[0].trim(),
    value: c.total_attendance,
  }));

  const formattedWeekly = weeklyData.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    count: d.count,
  }));

  const customTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string; }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,184,224,0.4)', borderRadius: 14, padding: '12px 16px', boxShadow: '0 8px 24px rgba(190,89,133,0.15)' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{label}</p>
          {payload.map(p => (
            <p key={p.name} style={{ fontSize: 13, color: p.color }}>
              {p.name}: <strong>{p.value}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) return (
    <DashboardLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid rgba(236,127,169,0.2)', borderTopColor: 'var(--primary)', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading analytics...</p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Analytics</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Attendance insights across all your classes</p>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {[
            { label: 'Total Classes', value: classStats.length, icon: BookOpen, color: '#EC7FA9' },
            { label: 'Total Sessions', value: classStats.reduce((a, c) => a + c.total_sessions, 0), icon: TrendingUp, color: '#BE5985' },
            { label: 'Students', value: Math.max(...(classStats.map(c => c.unique_students).concat([0]))), icon: Users, color: '#EC7FA9' },
            { label: 'At Risk', value: lowAttendance.length, icon: AlertTriangle, color: '#ef4444' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,184,224,0.35)', borderRadius: 20, padding: '20px 24px' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${s.color}18`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <s.icon size={20} color={s.color} />
                </div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 30, fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
          {/* Bar Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,184,224,0.35)', borderRadius: 24, padding: 28 }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>Attendance by Class</h2>
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,184,224,0.3)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                    <Tooltip content={customTooltip as never} />
                    <Bar dataKey="attendance" name="Attendance" fill="#EC7FA9" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="sessions" name="Sessions" fill="#FFB8E0" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No data yet</div>
              )}
            </div>
          </motion.div>

          {/* Pie Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,184,224,0.35)', borderRadius: 24, padding: 28 }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>Attendance Distribution</h2>
              {pieData.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={customTooltip as never} />
                    <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 13 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No attendance data yet</div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Weekly Line Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,184,224,0.35)', borderRadius: 24, padding: 28 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>Weekly Attendance Trend (Last 7 Days)</h2>
            {formattedWeekly.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={formattedWeekly} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,184,224,0.3)" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                  <Tooltip content={customTooltip as never} />
                  <Line type="monotone" dataKey="count" name="Attendance" stroke="#EC7FA9" strokeWidth={3} dot={{ fill: '#BE5985', r: 5 }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No weekly data available yet</div>
            )}
          </div>
        </motion.div>

        {/* Low Attendance Table */}
        {lowAttendance.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 24, padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <AlertTriangle size={20} color="#dc2626" />
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>Students Below 75% Threshold</h2>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
                  <thead>
                    <tr>
                      {['Student', 'Email', 'Class', 'Attendance %'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '6px 14px', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {lowAttendance.map((s, i) => (
                      <tr key={i}>
                        <td style={{ padding: '12px 14px', background: 'rgba(239,68,68,0.04)', borderRadius: '12px 0 0 12px', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</td>
                        <td style={{ padding: '12px 14px', background: 'rgba(239,68,68,0.04)', fontSize: 13, color: 'var(--text-secondary)' }}>{s.email}</td>
                        <td style={{ padding: '12px 14px', background: 'rgba(239,68,68,0.04)', fontSize: 13, color: 'var(--text-secondary)' }}>{s.class_name}</td>
                        <td style={{ padding: '12px 14px', background: 'rgba(239,68,68,0.04)', borderRadius: '0 12px 12px 0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(0,0,0,0.06)', overflow: 'hidden', maxWidth: 100 }}>
                              <div style={{ height: '100%', borderRadius: 3, background: '#ef4444', width: `${s.percentage ?? 0}%` }} />
                            </div>
                            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 700, color: '#dc2626' }}>{s.percentage ?? 0}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
