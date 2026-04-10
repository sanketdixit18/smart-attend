'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Users, Search, Shield, GraduationCap, BookOpen } from 'lucide-react';

interface User { id: number; name: string; email: string; role: string; uid: string; created_at: string; }

const roleIcon: Record<string, React.ElementType> = { admin: Shield, faculty: BookOpen, student: GraduationCap };
const roleColor: Record<string, string> = { admin: '#8B3A5E', faculty: '#BE5985', student: '#EC7FA9' };

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/users').then(r => r.json()).then(d => {
      setUsers(d.users || []);
      setLoading(false);
    });
  }, []);

  const filtered = users.filter(u => {
    const matchRole = filter === 'all' || u.role === filter;
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.uid.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const counts = { all: users.length, admin: users.filter(u => u.role === 'admin').length, faculty: users.filter(u => u.role === 'faculty').length, student: users.filter(u => u.role === 'student').length };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>User Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>All registered users in the system</p>
        </div>

        {/* Role filter tabs */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(['all', 'admin', 'faculty', 'student'] as const).map(r => (
            <button key={r} onClick={() => setFilter(r)} style={{ padding: '8px 18px', borderRadius: 100, border: `1.5px solid ${filter === r ? 'var(--primary)' : 'rgba(255,184,224,0.35)'}`, background: filter === r ? 'rgba(236,127,169,0.15)' : 'rgba(255,255,255,0.6)', color: filter === r ? 'var(--dark-accent)' : 'var(--text-secondary)', fontWeight: filter === r ? 700 : 500, fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
              {r.charAt(0).toUpperCase() + r.slice(1)} ({counts[r]})
            </button>
          ))}
        </div>

        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Search by name, email, or UID..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '12px 16px 12px 44px', borderRadius: 14, border: '1.5px solid rgba(255,184,224,0.4)', background: 'rgba(255,255,255,0.7)', fontSize: 14, outline: 'none', fontFamily: 'DM Sans, sans-serif', color: 'var(--text-primary)' }} />
        </div>

        <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,184,224,0.35)', borderRadius: 24, padding: 28 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Loading users...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map((u, i) => {
                const Icon = roleIcon[u.role] || Users;
                const color = roleColor[u.role] || '#EC7FA9';
                return (
                  <motion.div key={u.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,184,224,0.15)', borderRadius: 16, flexWrap: 'wrap', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 42, height: 42, borderRadius: 14, background: `${color}18`, border: `1px solid ${color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon size={18} color={color} />
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{u.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.email}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{u.uid}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', padding: '4px 12px', borderRadius: 8, background: `${color}18`, color, border: `1px solid ${color}35` }}>{u.role}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No users found</div>}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
