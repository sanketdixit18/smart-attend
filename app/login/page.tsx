// 'use client';
// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { QrCode, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPw, setShowPw] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     try {
//       const res = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include', // ensure cookies are included
//         body: JSON.stringify({ email, password }),
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         setError(data.error);
//         setLoading(false);
//         return;
//       }
//       // Small delay to ensure cookie is set before redirect
//       await new Promise(r => setTimeout(r, 100));
//       window.location.replace(`/dashboard/${data.user.role}`);
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
//     transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif',
//   };

//   return (
//     <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 24, position: 'relative', overflow: 'hidden' }}>
//       <div style={{ position: 'fixed', top: -200, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,184,224,0.5), transparent)', filter: 'blur(60px)', pointerEvents: 'none' }} />
//       <div style={{ position: 'fixed', bottom: -150, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,127,169,0.3), transparent)', filter: 'blur(80px)', pointerEvents: 'none' }} />

//       <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
//         <div style={{ textAlign: 'center', marginBottom: 32 }}>
//           <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
//             <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(236,127,169,0.4)' }}>
//               <QrCode size={24} color="white" />
//             </div>
//             <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: 'var(--dark-accent)' }}>SmartAttend</span>
//           </Link>
//         </div>

//         <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,184,224,0.4)', borderRadius: 28, padding: 40, boxShadow: '0 20px 60px rgba(190,89,133,0.15)' }}>
//           <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Welcome back</h1>
//           <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 32 }}>Sign in to your SmartAttend account</p>

//           {error && (
//             <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '10px 14px', fontSize: 14, color: '#dc2626', marginBottom: 20 }}>
//               {error}
//             </motion.div>
//           )}

//           <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
//             <div style={{ position: 'relative' }}>
//               <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
//               <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
//             </div>
//             <div style={{ position: 'relative' }}>
//               <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
//               <input type={showPw ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
//               <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
//                 {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
//               </button>
//             </div>

//             <motion.button type="submit" disabled={loading} whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: loading ? 1 : 0.98 }}
//               style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', color: 'white', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 24px rgba(236,127,169,0.4)', fontFamily: 'DM Sans, sans-serif', opacity: loading ? 0.8 : 1 }}>
//               {loading ? (
//                 <>
//                   <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite' }} />
//                   <span>Signing in...</span>
//                 </>
//               ) : (
//                 <><span>Sign In</span><ArrowRight size={18} /></>
//               )}
//             </motion.button>
//           </form>

//           <div style={{ marginTop: 28, padding: '16px', background: 'rgba(236,127,169,0.08)', borderRadius: 12, border: '1px solid rgba(236,127,169,0.2)' }}>
//             <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>Demo Accounts (password: password123)</p>
//             {[
//               ['admin@smartattend.com', 'Admin'],
//               ['faculty@smartattend.com', 'Faculty'],
//               ['student@smartattend.com', 'Student'],
//             ].map(([e, r]) => (
//               <button key={r} onClick={() => { setEmail(e); setPassword('password123'); }} style={{ display: 'block', fontSize: 12, color: 'var(--dark-accent)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0', fontFamily: 'DM Sans, sans-serif' }}>
//                 → {r}: {e}
//               </button>
//             ))}
//           </div>

//           <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-secondary)' }}>
//             No account?{' '}
//             <Link href="/register" style={{ color: 'var(--dark-accent)', fontWeight: 600, textDecoration: 'none' }}>Create one →</Link>
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
import { QrCode, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      await new Promise(r => setTimeout(r, 100));
      window.location.replace(`/dashboard/${data.user.role}`);
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
    transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 24, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', top: -200, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,184,224,0.5), transparent)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: -150, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,127,169,0.3), transparent)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
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
            <Link href="/login" style={{ flex: 1, padding: '9px', borderRadius: 11, background: 'white', color: 'var(--dark-accent)', fontWeight: 700, fontSize: 14, textDecoration: 'none', textAlign: 'center', display: 'block', boxShadow: '0 2px 8px rgba(190,89,133,0.15)' }}>
              Sign In
            </Link>
            <Link href="/register" style={{ flex: 1, padding: '9px', borderRadius: 11, color: 'var(--text-muted)', fontWeight: 600, fontSize: 14, textDecoration: 'none', textAlign: 'center', display: 'block' }}>
              Register
            </Link>
          </div>

          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 32 }}>Sign in with your email and password</p>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '10px 14px', fontSize: 14, color: '#dc2626', marginBottom: 20 }}>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type={showPw ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <motion.button type="submit" disabled={loading} whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: loading ? 1 : 0.98 }}
              style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', color: 'white', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 24px rgba(236,127,169,0.4)', fontFamily: 'DM Sans, sans-serif', opacity: loading ? 0.8 : 1 }}>
              {loading ? (
                <><div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite' }} /><span>Signing in...</span></>
              ) : (
                <><span>Sign In</span><ArrowRight size={18} /></>
              )}
            </motion.button>
          </form>

          {/* Demo accounts */}
          <div style={{ marginTop: 24, padding: '14px 16px', background: 'rgba(236,127,169,0.08)', borderRadius: 12, border: '1px solid rgba(236,127,169,0.2)' }}>
            {/* <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>Demo Accounts (password: password123)</p> */}
            {/* {[
              ['admin@smartattend.com', 'Admin'],
              ['faculty@smartattend.com', 'Faculty'],
              ['student@smartattend.com', 'Student'],
            ].map(([e, r]) => (
              <button key={r} onClick={() => { setEmail(e); setPassword('password123'); }} style={{ display: 'block', fontSize: 12, color: 'var(--dark-accent)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0', fontFamily: 'DM Sans, sans-serif' }}>
                → {r}: {e}
              </button>
            ))} */}
          </div>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-secondary)' }}>
            No account?{' '}
            <Link href="/register" style={{ color: 'var(--dark-accent)', fontWeight: 600, textDecoration: 'none' }}>Create one →</Link>
          </p>
        </div>
      </motion.div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
