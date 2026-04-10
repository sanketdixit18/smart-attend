'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Users, Search, UserPlus } from 'lucide-react';

interface Student {
  id: number; name: string; email: string; uid: string;
  class_name: string; percentage: number; attended: number; total: number;
}

export default function FacultyStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/faculty/students').then(r => r.json()).then(d => {
      setStudents(d.students || []);
      setLoading(false);
    });
  }, []);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.uid.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Students</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>All students enrolled in your classes</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,184,224,0.4)' }}>
            <Users size={16} color="var(--primary)" />
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>{students.length} students</span>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text" placeholder="Search students..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '12px 16px 12px 44px', borderRadius: 14, border: '1.5px solid rgba(255,184,224,0.4)', background: 'rgba(255,255,255,0.7)', fontSize: 14, outline: 'none', fontFamily: 'DM Sans, sans-serif', color: 'var(--text-primary)' }}
          />
        </div>

        <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,184,224,0.35)', borderRadius: 24, padding: 28 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Loading students...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <UserPlus size={48} color="rgba(190,89,133,0.3)" style={{ marginBottom: 16 }} />
              <p style={{ color: 'var(--text-muted)' }}>{search ? 'No students match your search' : 'No students enrolled yet'}</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {filtered.map((s, i) => {
                const pct = s.percentage || 0;
                const color = pct >= 75 ? '#22c55e' : pct >= 60 ? '#f97316' : '#ef4444';
                return (
                  <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <div style={{ background: 'rgba(255,255,255,0.6)', border: `1px solid ${pct < 75 ? 'rgba(239,68,68,0.2)' : 'rgba(255,184,224,0.2)'}`, borderRadius: 18, padding: '18px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                        <div style={{ width: 42, height: 42, borderRadius: 14, background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                          {s.name.charAt(0)}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{s.uid}</div>
                        </div>
                        <div style={{ marginLeft: 'auto', fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color, flexShrink: 0 }}>
                          {pct}%
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>{s.class_name}</div>
                      <div style={{ height: 5, borderRadius: 3, background: 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7, delay: i * 0.05 }} style={{ height: '100%', borderRadius: 3, background: color }} />
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{s.attended ?? 0}/{s.total ?? 0} sessions</div>
                      {pct < 75 && (
                        <div style={{ marginTop: 10, fontSize: 11, color: '#dc2626', fontWeight: 500, padding: '5px 10px', background: 'rgba(239,68,68,0.06)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.15)' }}>
                          ⚠ Below 75% threshold
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
