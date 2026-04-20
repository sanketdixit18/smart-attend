// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import Link from 'next/link';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   QrCode, LayoutDashboard, Users, BookOpen, BarChart3,
//   Bell, LogOut, Menu, X, ChevronRight, Settings,
//   Scan, CalendarCheck, AlertTriangle
// } from 'lucide-react';

// interface User {
//   id: number; name: string; email: string; role: string; uid: string;
// }

// interface NavItem {
//   href: string; icon: React.ElementType; label: string;
// }

// const navByRole: Record<string, NavItem[]> = {
//   faculty: [
//     { href: '/dashboard/faculty', icon: LayoutDashboard, label: 'Dashboard' },
//     { href: '/dashboard/faculty/sessions', icon: CalendarCheck, label: 'Sessions' },
//     { href: '/dashboard/faculty/attendance', icon: BookOpen, label: 'Attendance' },
//     { href: '/dashboard/faculty/analytics', icon: BarChart3, label: 'Analytics' },
//     { href: '/dashboard/faculty/students', icon: Users, label: 'Students' },
//     { href: '/dashboard/faculty/classes', icon: BookOpen, label: 'My Classes' },
//   ],
//   student: [
//     { href: '/dashboard/student', icon: LayoutDashboard, label: 'Dashboard' },
//     { href: '/scan', icon: Scan, label: 'Scan QR' },
//     { href: '/dashboard/student/history', icon: CalendarCheck, label: 'My Attendance' },
//     { href: '/dashboard/student/alerts', icon: AlertTriangle, label: 'Alerts' },
//   ],
//   admin: [
//     { href: '/dashboard/admin', icon: LayoutDashboard, label: 'Dashboard' },
//     { href: '/dashboard/admin/users', icon: Users, label: 'Users' },
//     { href: '/dashboard/admin/classes', icon: BookOpen, label: 'Classes' },
//     { href: '/dashboard/admin/sessions', icon: CalendarCheck, label: 'Sessions' },
//     { href: '/dashboard/admin/analytics', icon: BarChart3, label: 'Analytics' },
//   ],
// };

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [user, setUser] = useState<User | null>(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   useEffect(() => {
//     fetch('/api/auth/me').then(r => r.json()).then(d => {
//       if (d.user) setUser(d.user);
//       else router.push('/login');
//     }).catch(() => router.push('/login'));
//   }, []);

//   async function logout() {
//     await fetch('/api/auth/logout', { method: 'POST' });
//     router.push('/login');
//   }

//   const navItems = user ? (navByRole[user.role] || []) : [];

//   const roleColors: Record<string, string> = {
//     admin: '#8B3A5E',
//     faculty: '#BE5985',
//     student: '#EC7FA9',
//   };

//   const SidebarContent = () => (
//     <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px 16px' }}>
//       {/* Logo */}
//       <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 36 }}>
//         <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//           <QrCode size={20} color="white" />
//         </div>
//         <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: 'var(--dark-accent)' }}>SmartAttend</span>
//       </Link>

//       {/* User Card */}
//       {user && (
//         <div style={{ background: 'rgba(236,127,169,0.1)', border: '1px solid rgba(236,127,169,0.25)', borderRadius: 16, padding: '14px 16px', marginBottom: 28 }}>
//           <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, fontSize: 16, fontWeight: 700, color: 'white', fontFamily: 'Playfair Display, serif' }}>
//             {user.name.charAt(0)}
//           </div>
//           <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{user.name}</div>
//           <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{user.email}</div>
//           <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '3px 10px', borderRadius: 6, background: `${roleColors[user.role]}20`, color: roleColors[user.role], border: `1px solid ${roleColors[user.role]}40` }}>
//             {user.role}
//           </span>
//         </div>
//       )}

//       {/* Nav */}
//       <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
//         {navItems.map(item => {
//           const active = pathname === item.href || (item.href !== `/dashboard/${user?.role}` && pathname.startsWith(item.href));
//           return (
//             <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 14, color: active ? 'var(--dark-accent)' : 'var(--text-secondary)', fontWeight: active ? 600 : 500, textDecoration: 'none', fontSize: 14, background: active ? 'linear-gradient(135deg, rgba(236,127,169,0.18), rgba(190,89,133,0.08))' : 'transparent', border: active ? '1px solid rgba(236,127,169,0.25)' : '1px solid transparent', transition: 'all 0.2s' }}>
//               <item.icon size={18} color={active ? 'var(--dark-accent)' : 'var(--text-muted)'} />
//               {item.label}
//               {active && <ChevronRight size={14} style={{ marginLeft: 'auto', color: 'var(--dark-accent)' }} />}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Logout */}
//       <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 14, color: 'var(--text-secondary)', fontWeight: 500, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer', width: '100%', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s' }}
//         onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
//         onMouseLeave={e => (e.currentTarget.style.background = 'none')}
//       >
//         <LogOut size={18} /> Sign Out
//       </button>
//     </div>
//   );

//   return (
//     <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
//       {/* Desktop Sidebar */}
//       <aside style={{ width: 260, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(24px)', borderRight: '1px solid rgba(255,184,224,0.3)', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50, display: 'none' }} className="sidebar-desktop">
//         <SidebarContent />
//       </aside>

//       {/* Mobile Sidebar */}
//       <AnimatePresence>
//         {sidebarOpen && (
//           <>
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 49 }} />
//             <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={{ type: 'spring', damping: 25 }} style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 260, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(24px)', borderRight: '1px solid rgba(255,184,224,0.3)', zIndex: 50 }}>
//               <SidebarContent />
//             </motion.aside>
//           </>
//         )}
//       </AnimatePresence>

//       {/* Main content */}
//       {/* changes */}
//       <div style={{ flex: 1, marginLeft: 0, display: 'flex', flexDirection: 'column' }}>  
//         {/* Top navbar */}
//         <header style={{ height: 64, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,184,224,0.25)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, position: 'sticky', top: 0, zIndex: 40 }}>
//           <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 8, borderRadius: 10 }}>
//             <Menu size={20} />
//           </button>
//           <div style={{ flex: 1 }} />
//           {user && (
//             <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//               <span style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'none' }}>UID: {user.uid}</span>
//               <div style={{ width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'white', fontFamily: 'Playfair Display, serif' }}>
//                 {user.name.charAt(0)}
//               </div>
//             </div>
//           )}
//         </header>

//         {/* Page content */}
//         <main style={{ flex: 1, padding: '32px 24px', maxWidth: 1200, width: '100%', margin: '0 auto' }}>
//           {children}
//         </main>
//       </div>

//       <style>{`
//         @media (min-width: 768px) {
//           .sidebar-desktop { display: block !important; }
//           main { margin-left: 260px; }
//         }
//       `}</style>
//     </div>
//   );
// }




'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode, LayoutDashboard, Users, BookOpen, BarChart3,
  Bell, LogOut, Menu, X, ChevronRight, Settings,
  Scan, CalendarCheck, AlertTriangle
} from 'lucide-react';

interface User {
  id: number; name: string; email: string; role: string; uid: string;
}

interface NavItem {
  href: string; icon: React.ElementType; label: string;
}

const navByRole: Record<string, NavItem[]> = {
  faculty: [
    { href: '/dashboard/faculty', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/faculty/sessions', icon: CalendarCheck, label: 'Sessions' },
    { href: '/dashboard/faculty/attendance', icon: BookOpen, label: 'Attendance' },
    { href: '/dashboard/faculty/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/dashboard/faculty/students', icon: Users, label: 'Students' },
    { href: '/dashboard/faculty/classes', icon: BookOpen, label: 'My Classes' },
  ],
  student: [
    { href: '/dashboard/student', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/scan', icon: Scan, label: 'Scan QR' },
    { href: '/dashboard/student/history', icon: CalendarCheck, label: 'My Attendance' },
    { href: '/dashboard/student/alerts', icon: AlertTriangle, label: 'Alerts' },
  ],
  admin: [
    { href: '/dashboard/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/admin/users', icon: Users, label: 'Users' },
    { href: '/dashboard/admin/classes', icon: BookOpen, label: 'Classes' },
    { href: '/dashboard/admin/sessions', icon: CalendarCheck, label: 'Sessions' },
    { href: '/dashboard/admin/analytics', icon: BarChart3, label: 'Analytics' },
  ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.user) setUser(d.user);
      else router.push('/login');
    }).catch(() => router.push('/login'));
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  const navItems = user ? (navByRole[user.role] || []) : [];

  const roleColors: Record<string, string> = {
    admin: '#8B3A5E',
    faculty: '#BE5985',
    student: '#EC7FA9',
  };

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px 16px' }}>
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 36 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <QrCode size={20} color="white" />
        </div>
        <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: 'var(--dark-accent)' }}>SmartAttend</span>
      </Link>

      {/* User Card */}
      {user && (
        <div style={{ background: 'rgba(236,127,169,0.1)', border: '1px solid rgba(236,127,169,0.25)', borderRadius: 16, padding: '14px 16px', marginBottom: 28 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, fontSize: 16, fontWeight: 700, color: 'white', fontFamily: 'Playfair Display, serif' }}>
            {user.name.charAt(0)}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{user.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{user.email}</div>
          <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '3px 10px', borderRadius: 6, background: `${roleColors[user.role]}20`, color: roleColors[user.role], border: `1px solid ${roleColors[user.role]}40` }}>
            {user.role}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map(item => {
          const active = pathname === item.href || (item.href !== `/dashboard/${user?.role}` && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 14, color: active ? 'var(--dark-accent)' : 'var(--text-secondary)', fontWeight: active ? 600 : 500, textDecoration: 'none', fontSize: 14, background: active ? 'linear-gradient(135deg, rgba(236,127,169,0.18), rgba(190,89,133,0.08))' : 'transparent', border: active ? '1px solid rgba(236,127,169,0.25)' : '1px solid transparent', transition: 'all 0.2s' }}>
              <item.icon size={18} color={active ? 'var(--dark-accent)' : 'var(--text-muted)'} />
              {item.label}
              {active && <ChevronRight size={14} style={{ marginLeft: 'auto', color: 'var(--dark-accent)' }} />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 14, color: 'var(--text-secondary)', fontWeight: 500, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer', width: '100%', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
      >
        <LogOut size={18} /> Sign Out
      </button>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Desktop Sidebar */}
      <aside style={{ width: 260, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(24px)', borderRight: '1px solid rgba(255,184,224,0.3)', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50, display: 'none' }} className="sidebar-desktop">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 49 }} />
            <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={{ type: 'spring', damping: 25 }} style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 260, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(24px)', borderRight: '1px solid rgba(255,184,224,0.3)', zIndex: 50 }}>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div style={{ flex: 1, marginLeft: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Top navbar */}
        <header style={{ height: 64, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,184,224,0.25)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, position: 'sticky', top: 0, zIndex: 40 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 8, borderRadius: 10 }}>
            <Menu size={20} />
          </button>
          <div style={{ flex: 1 }} />
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'none' }}>UID: {user.uid}</span>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg, #EC7FA9, #BE5985)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'white', fontFamily: 'Playfair Display, serif' }}>
                {user.name.charAt(0)}
              </div>
            </div>
          )}
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '32px 24px', maxWidth: 1200, width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .sidebar-desktop { display: block !important; }
          main { margin-left: 260px; }
        }
      `}</style>
    </div>
  );
}

