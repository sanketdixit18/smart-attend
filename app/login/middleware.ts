import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const PUBLIC_PATHS = ['/', '/login', '/register'];
const API_PUBLIC = ['/api/auth/login', '/api/auth/register'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow public paths and static files
  if (
    PUBLIC_PATHS.includes(pathname) ||
    API_PUBLIC.some(r => pathname.startsWith(r)) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check auth for dashboard and API routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/scan') || pathname.startsWith('/api')) {
    const token = req.cookies.get('auth_token')?.value;

    if (!token) {
      if (pathname.startsWith('/api')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const user = verifyToken(token);
    if (!user) {
      if (pathname.startsWith('/api')) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      const res = NextResponse.redirect(new URL('/login', req.url));
      res.cookies.delete('auth_token');
      return res;
    }

    // Role-based route protection
    if (pathname.startsWith('/dashboard/faculty') && user.role !== 'faculty' && user.role !== 'admin') {
      return NextResponse.redirect(new URL(`/dashboard/${user.role}`, req.url));
    }
    if (pathname.startsWith('/dashboard/student') && user.role !== 'student' && user.role !== 'admin') {
      return NextResponse.redirect(new URL(`/dashboard/${user.role}`, req.url));
    }
    if (pathname.startsWith('/dashboard/admin') && user.role !== 'admin') {
      return NextResponse.redirect(new URL(`/dashboard/${user.role}`, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};
