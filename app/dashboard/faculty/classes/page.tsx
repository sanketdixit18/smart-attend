'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { BookOpen, Plus, MapPin, Trash2, Edit2, X, Check, Locate } from 'lucide-react';

interface Class {
  id: number; name: string; subject: string;
  latitude: number | null; longitude: number | null; radius_meters: number;
}

const emptyForm = { name: '', subject: '', latitude: '', longitude: '', radius_meters: '100' };

export default function FacultyClasses() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [locating, setLocating] = useState(false);

  async function loadClasses() {
    const res = await fetch('/api/classes');
    const data = await res.json();
    setClasses(data.classes || []);
  }

  useEffect(() => { loadClasses(); }, []);

  function getMyLocation() {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setForm(f => ({ ...f, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6) }));
        setLocating(false);
      },
      () => { setError('Could not get location. Enter manually.'); setLocating(false); }
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      const body = {
        name: form.name, subject: form.subject,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        radius_meters: parseInt(form.radius_meters) || 100,
        ...(editId ? { id: editId } : {}),
      };

      const res = await fetch('/api/classes/manage', {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }

      setSuccess(editId ? 'Class updated!' : 'Class created!');
      setForm(emptyForm); setShowForm(false); setEditId(null);
      await loadClasses();
      setTimeout(() => setSuccess(''), 3000);
    } catch { setError('Failed. Please try again.'); }
    finally { setLoading(false); }
  }

  async function deleteClass(id: number, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await fetch('/api/classes/manage', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    await loadClasses();
  }

  function startEdit(cls: Class) {
    setForm({
      name: cls.name, subject: cls.subject,
      latitude: cls.latitude?.toString() || '',
      longitude: cls.longitude?.toString() || '',
      radius_meters: cls.radius_meters?.toString() || '100',
    });
    setEditId(cls.id);
    setShowForm(true);
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: 12,
    border: '1.5px solid rgba(255,184,224,0.4)', background: 'rgba(255,255,255,0.8)',
    fontSize: 14, color: 'var(--text-primary)', outline: 'none', fontFamily: 'DM Sans, sans-serif',
  };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>My Classes</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Create and manage your classes with GPS location</p>
          </div>
          <motion.button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 6px 20px rgba(236,127,169,0.4)', fontFamily: 'DM Sans, sans-serif' }}>
            {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Class</>}
          </motion.button>
        </div>

        {/* Success message */}
        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 14, padding: '12px 16px', fontSize: 14, color: '#15803d', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Check size={16} /> {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add/Edit Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
              <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,184,224,0.4)', borderRadius: 24, padding: 28 }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>
                  {editId ? '✏️ Edit Class' : '➕ New Class'}
                </h2>

                {error && (
                  <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: '#dc2626', marginBottom: 16 }}>{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Class Name *</label>
                      <input type="text" placeholder="e.g. CS301 - Algorithms" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Subject *</label>
                      <input type="text" placeholder="e.g. Computer Science" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required style={inputStyle} />
                    </div>
                  </div>

                  {/* GPS Section */}
                  <div style={{ background: 'rgba(236,127,169,0.06)', border: '1px solid rgba(236,127,169,0.2)', borderRadius: 16, padding: 18, marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <MapPin size={16} color="var(--primary)" />
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>Classroom GPS Location</span>
                      </div>
                      <button type="button" onClick={getMyLocation} disabled={locating}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: '1.5px solid rgba(236,127,169,0.4)', background: 'rgba(255,255,255,0.8)', color: 'var(--dark-accent)', fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                        <Locate size={13} /> {locating ? 'Getting...' : 'Use My Location'}
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Latitude</label>
                        <input type="number" step="any" placeholder="28.6139" value={form.latitude} onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))} style={{ ...inputStyle, fontSize: 13 }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Longitude</label>
                        <input type="number" step="any" placeholder="77.2090" value={form.longitude} onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))} style={{ ...inputStyle, fontSize: 13 }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Radius (meters)</label>
                        <input type="number" min="10" max="500" placeholder="100" value={form.radius_meters} onChange={e => setForm(f => ({ ...f, radius_meters: e.target.value }))} style={{ ...inputStyle, fontSize: 13 }} />
                      </div>
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>Students must be within this radius to mark attendance. Click "Use My Location" while in the classroom.</p>
                  </div>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                      style={{ flex: 1, padding: '13px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'DM Sans, sans-serif' }}>
                      {loading ? <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite' }} /> : <><Check size={16} /> {editId ? 'Save Changes' : 'Create Class'}</>}
                    </motion.button>
                    <button type="button" onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); }}
                      style={{ padding: '13px 20px', borderRadius: 14, border: '1.5px solid rgba(255,184,224,0.5)', background: 'rgba(255,255,255,0.7)', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Classes Grid */}
        {classes.length === 0 ? (
          <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '2px dashed rgba(255,184,224,0.4)', borderRadius: 24, padding: 60, textAlign: 'center' }}>
            <BookOpen size={48} color="rgba(190,89,133,0.3)" style={{ marginBottom: 16 }} />
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>No classes yet</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>Create your first class to start taking attendance</p>
            <button onClick={() => setShowForm(true)} style={{ padding: '11px 24px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', color: 'white', fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
              + Add Your First Class
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {classes.map((cls, i) => (
              <motion.div key={cls.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -4 }}>
                <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,184,224,0.35)', borderRadius: 22, padding: 24, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, rgba(236,127,169,0.2), rgba(190,89,133,0.1))', border: '1.5px solid rgba(236,127,169,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BookOpen size={20} color="var(--primary)" />
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{cls.name}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{cls.subject}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => startEdit(cls)} style={{ width: 34, height: 34, borderRadius: 10, border: '1px solid rgba(255,184,224,0.4)', background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Edit2 size={14} color="var(--dark-accent)" />
                      </button>
                      <button onClick={() => deleteClass(cls.id, cls.name)} style={{ width: 34, height: 34, borderRadius: 10, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Trash2 size={14} color="#ef4444" />
                      </button>
                    </div>
                  </div>

                  {/* GPS info */}
                  <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid rgba(255,184,224,0.2)' }}>
                    {cls.latitude && cls.longitude ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#15803d' }}>
                        <MapPin size={13} />
                        <span>{parseFloat(String(cls.latitude)).toFixed(4)}, {parseFloat(String(cls.longitude)).toFixed(4)}</span>
                        <span style={{ marginLeft: 4, padding: '2px 8px', borderRadius: 6, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', fontSize: 11, fontWeight: 600 }}>
                          {cls.radius_meters}m radius
                        </span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#f97316' }}>
                        <MapPin size={13} />
                        <span>No GPS set — location check disabled</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  );
}
