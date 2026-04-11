// // 'use client';
// // import { useState } from 'react';
// // import { motion } from 'framer-motion';
// // import Link from 'next/link';
// // import { QrCode, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

// // export default function RegisterPage() {
// //   const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
// //   const [showPw, setShowPw] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');

// //   const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
// //     setForm(f => ({ ...f, [k]: e.target.value }));

// //   async function handleSubmit(e: React.FormEvent) {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError('');
// //     try {
// //       const res = await fetch('/api/auth/register', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(form),
// //       });
// //       const data = await res.json();
// //       if (!res.ok) { setError(data.error); setLoading(false); return; }
// //       // Use window.location to ensure cookie is picked up before navigation
// //       window.location.href = `/dashboard/${data.user.role}`;
// //     } catch {
// //       setError('Connection failed. Please try again.');
// //       setLoading(false);
// //     }
// //   }

// //   const inputStyle: React.CSSProperties = {
// //     width: '100%', padding: '12px 16px 12px 44px', borderRadius: 14,
// //     border: '1.5px solid rgba(255,184,224,0.5)',
// //     background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)',
// //     fontSize: 15, color: 'var(--text-primary)', outline: 'none',
// //     fontFamily: 'DM Sans, sans-serif',
// //   };

// //   const roles = [
// //     { value: 'student', label: '🎓 Student', desc: 'Mark attendance by scanning QR codes' },
// //     { value: 'faculty', label: '👨‍🏫 Faculty', desc: 'Manage sessions and view analytics' },
// //     { value: 'admin', label: '⚙️ Admin', desc: 'Full system administration access' },
// //   ];

// //   return (
// //     <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 24, position: 'relative', overflow: 'hidden' }}>
// //       <div style={{ position: 'fixed', top: -150, left: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,184,224,0.5), transparent)', filter: 'blur(60px)', pointerEvents: 'none' }} />
// //       <div style={{ position: 'fixed', bottom: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,127,169,0.3), transparent)', filter: 'blur(80px)', pointerEvents: 'none' }} />

// //       <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>
// //         <div style={{ textAlign: 'center', marginBottom: 32 }}>
// //           <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
// //             <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(236,127,169,0.4)' }}>
// //               <QrCode size={24} color="white" />
// //             </div>
// //             <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: 'var(--dark-accent)' }}>SmartAttend</span>
// //           </Link>
// //         </div>

// //         <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,184,224,0.4)', borderRadius: 28, padding: 40, boxShadow: '0 20px 60px rgba(190,89,133,0.15)' }}>
// //           <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Create account</h1>
// //           <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 32 }}>Join SmartAttend and get started in seconds</p>

// //           {error && (
// //             <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '10px 14px', fontSize: 14, color: '#dc2626', marginBottom: 20 }}>
// //               {error}
// //             </motion.div>
// //           )}

// //           <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
// //             <div style={{ position: 'relative' }}>
// //               <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
// //               <input type="text" placeholder="Full name" value={form.name} onChange={set('name')} required style={inputStyle} />
// //             </div>
// //             <div style={{ position: 'relative' }}>
// //               <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
// //               <input type="email" placeholder="Email address" value={form.email} onChange={set('email')} required style={inputStyle} />
// //             </div>
// //             <div style={{ position: 'relative' }}>
// //               <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
// //               <input type={showPw ? 'text' : 'password'} placeholder="Password (min 6 chars)" value={form.password} onChange={set('password')} required style={inputStyle} />
// //               <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
// //                 {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
// //               </button>
// //             </div>

// //             {/* Role selector */}
// //             <div>
// //               <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>Select your role</p>
// //               <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
// //                 {roles.map(r => (
// //                   <label key={r.value} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 14, border: `1.5px solid ${form.role === r.value ? 'var(--primary)' : 'rgba(255,184,224,0.4)'}`, background: form.role === r.value ? 'rgba(236,127,169,0.1)' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.2s' }}>
// //                     <input type="radio" name="role" value={r.value} checked={form.role === r.value} onChange={set('role')} style={{ display: 'none' }} />
// //                     <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${form.role === r.value ? 'var(--primary)' : 'rgba(190,89,133,0.3)'}`, background: form.role === r.value ? 'var(--primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
// //                       {form.role === r.value && <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'white' }} />}
// //                     </div>
// //                     <div>
// //                       <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{r.label}</div>
// //                       <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.desc}</div>
// //                     </div>
// //                   </label>
// //                 ))}
// //               </div>
// //             </div>

// //             <motion.button type="submit" disabled={loading} whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: loading ? 1 : 0.98 }} style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', color: 'white', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 24px rgba(236,127,169,0.4)', fontFamily: 'DM Sans, sans-serif', opacity: loading ? 0.8 : 1 }}>
// //               {loading ? (
// //                 <>
// //                   <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite' }} />
// //                   <span>Creating account...</span>
// //                 </>
// //               ) : (
// //                 <><span>Create Account</span><ArrowRight size={18} /></>
// //               )}
// //             </motion.button>
// //           </form>

// //           <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-secondary)' }}>
// //             Already have an account?{' '}
// //             <Link href="/login" style={{ color: 'var(--dark-accent)', fontWeight: 600, textDecoration: 'none' }}>Sign in →</Link>
// //           </p>
// //         </div>
// //       </motion.div>
// //       <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
// //     </div>
// //   );
// // }


// 'use client';
// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { QrCode, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

// export default function RegisterPage() {
//   const [form, setForm] = useState({ name: '', email: '', password: '', role: 'faculty' });
//   const [showPw, setShowPw] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
//     setForm(f => ({ ...f, [k]: e.target.value }));

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     try {
//       const res = await fetch('/api/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(form),
//       });
//       const data = await res.json();
//       if (!res.ok) { setError(data.error); setLoading(false); return; }
//       window.location.href = `/dashboard/${data.user.role}`;
//     } catch {
//       setError('Connection failed. Please try again.');
//       setLoading(false);
//     }
//   }

//   const inputStyle: React.CSSProperties = {
//     width: '100%', padding: '12px 16px 12px 44px', borderRadius: 14,
//     border: '1.5px solid rgba(255,184,224,0.5)',
//     background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)',
//     fontSize: 15, color: 'var(--text-primary)', outline: 'none',
//     fontFamily: 'DM Sans, sans-serif',
//   };

//   const roles = [
//     { value: 'faculty', label: '👨‍🏫 Faculty', desc: 'Manage sessions and view analytics' },
//     { value: 'admin', label: '⚙️ Admin', desc: 'Full system administration access' },
//   ];

//   return (
//     <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 24, position: 'relative', overflow: 'hidden' }}>
//       <div style={{ position: 'fixed', top: -150, left: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,184,224,0.5), transparent)', filter: 'blur(60px)', pointerEvents: 'none' }} />
//       <div style={{ position: 'fixed', bottom: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,127,169,0.3), transparent)', filter: 'blur(80px)', pointerEvents: 'none' }} />

//       <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>
//         <div style={{ textAlign: 'center', marginBottom: 32 }}>
//           <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
//             <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(236,127,169,0.4)' }}>
//               <QrCode size={24} color="white" />
//             </div>
//             <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: 'var(--dark-accent)' }}>SmartAttend</span>
//           </Link>
//         </div>

//         <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,184,224,0.4)', borderRadius: 28, padding: 40, boxShadow: '0 20px 60px rgba(190,89,133,0.15)' }}>

//           {/* Tab switcher */}
//           <div style={{ display: 'flex', gap: 0, marginBottom: 28, background: 'rgba(255,184,224,0.15)', borderRadius: 14, padding: 4 }}>
//             <Link href="/register" style={{ flex: 1, padding: '9px', borderRadius: 11, background: 'white', color: 'var(--dark-accent)', fontWeight: 700, fontSize: 14, textDecoration: 'none', textAlign: 'center', boxShadow: '0 2px 8px rgba(190,89,133,0.15)', display: 'block' }}>
//               Faculty / Admin
//             </Link>
//             <Link href="/uid-login" style={{ flex: 1, padding: '9px', borderRadius: 11, color: 'var(--text-muted)', fontWeight: 600, fontSize: 14, textDecoration: 'none', textAlign: 'center', display: 'block' }}>
//               Student (UID)
//             </Link>
//           </div>

//           <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Create account</h1>
//           <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 32 }}>Faculty & Admin only — Students use UID login</p>

//           {error && (
//             <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '10px 14px', fontSize: 14, color: '#dc2626', marginBottom: 20 }}>
//               {error}
//             </motion.div>
//           )}

//           <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
//             <div style={{ position: 'relative' }}>
//               <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
//               <input type="text" placeholder="Full name" value={form.name} onChange={set('name')} required style={inputStyle} />
//             </div>
//             <div style={{ position: 'relative' }}>
//               <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
//               <input type="email" placeholder="Email address" value={form.email} onChange={set('email')} required style={inputStyle} />
//             </div>
//             <div style={{ position: 'relative' }}>
//               <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
//               <input type={showPw ? 'text' : 'password'} placeholder="Password (min 6 chars)" value={form.password} onChange={set('password')} required style={inputStyle} />
//               <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
//                 {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
//               </button>
//             </div>

//             {/* Role selector - Faculty and Admin only */}
//             <div>
//               <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>Select your role</p>
//               <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//                 {roles.map(r => (
//                   <label key={r.value} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 14, border: `1.5px solid ${form.role === r.value ? 'var(--primary)' : 'rgba(255,184,224,0.4)'}`, background: form.role === r.value ? 'rgba(236,127,169,0.1)' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.2s' }}>
//                     <input type="radio" name="role" value={r.value} checked={form.role === r.value} onChange={set('role')} style={{ display: 'none' }} />
//                     <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${form.role === r.value ? 'var(--primary)' : 'rgba(190,89,133,0.3)'}`, background: form.role === r.value ? 'var(--primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
//                       {form.role === r.value && <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'white' }} />}
//                     </div>
//                     <div>
//                       <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{r.label}</div>
//                       <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.desc}</div>
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Student notice */}
//             <div style={{ padding: '12px 16px', background: 'rgba(236,127,169,0.08)', border: '1px solid rgba(236,127,169,0.2)', borderRadius: 12 }}>
//               <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
//                 🎓 <strong>Student?</strong> Use your college UID to login →{' '}
//                 <Link href="/uid-login" style={{ color: 'var(--dark-accent)', fontWeight: 700, textDecoration: 'none' }}>
//                   Student Login
//                 </Link>
//               </p>
//             </div>

//             <motion.button type="submit" disabled={loading} whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: loading ? 1 : 0.98 }}
//               style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', color: 'white', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 24px rgba(236,127,169,0.4)', fontFamily: 'DM Sans, sans-serif', opacity: loading ? 0.8 : 1 }}>
//               {loading ? (
//                 <><div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite' }} /><span>Creating account...</span></>
//               ) : (
//                 <><span>Create Account</span><ArrowRight size={18} /></>
//               )}
//             </motion.button>
//           </form>

//           <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-secondary)' }}>
//             Already have an account?{' '}
//             <Link href="/login" style={{ color: 'var(--dark-accent)', fontWeight: 600, textDecoration: 'none' }}>Sign in →</Link>
//           </p>
//         </div>
//       </motion.div>
//       <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//     </div>
//   );
// }


'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { QrCode, Mail, Lock, User, Hash, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', uid: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate UID for students
    if (form.role === 'student' && !form.uid.trim()) {
      setError('UID is required for student registration.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          uid: form.role === 'student' ? form.uid.trim().toUpperCase() : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      window.location.href = `/dashboard/${data.user.role}`;
    } catch {
      setError('Connection failed. Please try again.');
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px 12px 44px', borderRadius: 14,
    border: '1.5px solid rgba(255,184,224,0.5)',
    background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)',
    fontSize: 15, color: 'var(--text-primary)', outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
  };

  const roles = [
    { value: 'student', label: '🎓 Student', desc: 'Mark attendance by scanning QR codes' },
    { value: 'faculty', label: '👨‍🏫 Faculty', desc: 'Manage sessions and view analytics' },
    { value: 'admin', label: '⚙️ Admin', desc: 'Full system administration access' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 24, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', top: -150, left: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,184,224,0.5), transparent)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,127,169,0.3), transparent)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(236,127,169,0.4)' }}>
              <QrCode size={24} color="white" />
            </div>
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: 'var(--dark-accent)' }}>SmartAttend</span>
          </Link>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,184,224,0.4)', borderRadius: 28, padding: 40, boxShadow: '0 20px 60px rgba(190,89,133,0.15)' }}>

          {/* Tab switcher */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 28, background: 'rgba(255,184,224,0.15)', borderRadius: 14, padding: 4 }}>
            <Link href="/login" style={{ flex: 1, padding: '9px', borderRadius: 11, color: 'var(--text-muted)', fontWeight: 600, fontSize: 14, textDecoration: 'none', textAlign: 'center', display: 'block' }}>
              Sign In
            </Link>
            <Link href="/register" style={{ flex: 1, padding: '9px', borderRadius: 11, background: 'white', color: 'var(--dark-accent)', fontWeight: 700, fontSize: 14, textDecoration: 'none', textAlign: 'center', display: 'block', boxShadow: '0 2px 8px rgba(190,89,133,0.15)' }}>
              Register
            </Link>
          </div>

          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Create account</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28 }}>Fill in your details to get started</p>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '10px 14px', fontSize: 14, color: '#dc2626', marginBottom: 20 }}>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Name */}
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" placeholder="Full name" value={form.name} onChange={set('name')} required style={inputStyle} />
            </div>

            {/* Email */}
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="email" placeholder="Email address" value={form.email} onChange={set('email')} required style={inputStyle} />
            </div>

            {/* Password */}
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type={showPw ? 'text' : 'password'} placeholder="Password (min 6 chars)" value={form.password} onChange={set('password')} required style={inputStyle} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Role selector */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>Select your role</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {roles.map(r => (
                  <label key={r.value} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '11px 16px', borderRadius: 14, border: `1.5px solid ${form.role === r.value ? 'var(--primary)' : 'rgba(255,184,224,0.4)'}`, background: form.role === r.value ? 'rgba(236,127,169,0.1)' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <input type="radio" name="role" value={r.value} checked={form.role === r.value} onChange={set('role')} style={{ display: 'none' }} />
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${form.role === r.value ? 'var(--primary)' : 'rgba(190,89,133,0.3)'}`, background: form.role === r.value ? 'var(--primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {form.role === r.value && <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'white' }} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{r.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* UID field — only shown for students */}
            {form.role === 'student' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ position: 'relative' }}>
                <Hash size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                <input
                  type="text"
                  placeholder="College UID (e.g. SA2024001)"
                  value={form.uid}
                  onChange={e => setForm(f => ({ ...f, uid: e.target.value.toUpperCase() }))}
                  required={form.role === 'student'}
                  style={{ ...inputStyle, border: '1.5px solid rgba(236,127,169,0.6)', background: 'rgba(236,127,169,0.05)', letterSpacing: '0.05em', fontWeight: 600 }}
                />
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, paddingLeft: 4 }}>
                  🔐 This UID is provided by your college. It will be used to verify your identity during attendance.
                </p>
              </motion.div>
            )}

            <motion.button type="submit" disabled={loading} whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: loading ? 1 : 0.98 }}
              style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', color: 'white', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 24px rgba(236,127,169,0.4)', fontFamily: 'DM Sans, sans-serif', opacity: loading ? 0.8 : 1, marginTop: 4 }}>
              {loading ? (
                <><div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite' }} /><span>Creating account...</span></>
              ) : (
                <><span>Create Account</span><ArrowRight size={18} /></>
              )}
            </motion.button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--dark-accent)', fontWeight: 600, textDecoration: 'none' }}>Sign in →</Link>
          </p>
        </div>
      </motion.div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
