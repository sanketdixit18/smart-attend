'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { BookOpen, Download, Search } from 'lucide-react';

interface AttendanceRecord {
  id: number; student_name: string; student_uid: string; class_name: string;
  date: string; status: string; marked_at: string;
}

export default function FacultyAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [filtered, setFiltered] = useState<AttendanceRecord[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/attendance/records').then(r => r.json()).then(d => {
      setRecords(d.records || []);
      setFiltered(d.records || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(records.filter(r =>
      r.student_name?.toLowerCase().includes(q) ||
      r.class_name?.toLowerCase().includes(q) ||
      r.student_uid?.toLowerCase().includes(q)
    ));
  }, [search, records]);

  function exportCSV() {
    const header = 'Student,UID,Class,Date,Status,Marked At';
    const rows = filtered.map(r =>
      `${r.student_name},${r.student_uid},${r.class_name},${r.date},${r.status},${r.marked_at}`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'attendance.csv'; a.click();
  }

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Attendance Records</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>All attendance marks across your classes</p>
          </div>
          <button onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 14, border: '1.5px solid rgba(255,184,224,0.5)', background: 'rgba(255,255,255,0.7)', color: 'var(--dark-accent)', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            <Download size={16} /> Export CSV
          </button>
        </div>

        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text" placeholder="Search by student name, UID, or class..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '12px 16px 12px 44px', borderRadius: 14, border: '1.5px solid rgba(255,184,224,0.4)', background: 'rgba(255,255,255,0.7)', fontSize: 14, outline: 'none', fontFamily: 'DM Sans, sans-serif', color: 'var(--text-primary)' }}
          />
        </div>

        <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,184,224,0.35)', borderRadius: 24, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>
              Records <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-muted)' }}>({filtered.length})</span>
            </h2>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Loading records...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <BookOpen size={48} color="rgba(190,89,133,0.3)" style={{ marginBottom: 16 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>No attendance records found</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
                <thead>
                  <tr>
                    {['Student', 'UID', 'Class', 'Date', 'Status', 'Time'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '6px 14px', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                      <td style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.6)', borderRadius: '12px 0 0 12px', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{r.student_name}</td>
                      <td style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.6)', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{r.student_uid}</td>
                      <td style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.6)', fontSize: 13, color: 'var(--text-secondary)' }}>{r.class_name}</td>
                      <td style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.6)', fontSize: 13, color: 'var(--text-secondary)' }}>
                        {new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.6)' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 8, background: 'rgba(34,197,94,0.1)', color: '#15803d', border: '1px solid rgba(34,197,94,0.25)', textTransform: 'uppercase' }}>
                          {r.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.6)', borderRadius: '0 12px 12px 0', fontSize: 13, color: 'var(--text-muted)' }}>
                        {new Date(r.marked_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
