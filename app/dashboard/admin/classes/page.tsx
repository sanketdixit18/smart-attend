'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { BookOpen, MapPin, Users } from 'lucide-react';

interface ClassRow { id: number; name: string; subject: string; faculty_name: string; latitude: number; longitude: number; radius_meters: number; }

export default function AdminClasses() {
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/classes').then(r => r.json()).then(d => {
      setClasses(d.classes || []);
      setLoading(false);
    });
  }, []);

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Classes</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>All configured classes and their settings</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {loading ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Loading...</div>
          ) : classes.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ y: -4 }}>
              <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,184,224,0.35)', borderRadius: 22, padding: '22px 24px', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(236,127,169,0.15)', border: '1px solid rgba(236,127,169,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <BookOpen size={22} color="var(--primary)" />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{c.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{c.subject}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <Users size={14} color="var(--text-muted)" />
                    Faculty: {c.faculty_name || 'Unassigned'}
                  </div>
                  {c.latitude && c.longitude && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                      <MapPin size={14} color="var(--text-muted)" />
                      {/* {c.latitude.toFixed(4)}, {c.longitude.toFixed(4)} · {c.radius_meters}m radius */}
                      {parseFloat(String(c.latitude)).toFixed(4)}, {parseFloat(String(c.longitude)).toFixed(4)} · {c.radius_meters}m radius

                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {!loading && classes.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>No classes configured yet.</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
