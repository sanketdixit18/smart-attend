import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = pathname.startsWith('/dashboard') || pathname.startsWith('/scan');
  const isApiProtected = pathname.startsWith('/api/') &&
    !pathname.startsWith('/api/auth/login') &&
    !pathname.startsWith('/api/auth/register');

  if (!isProtected && !isApiProtected) {
    return NextResponse.next();
  }

  const token = req.cookies.get('auth_token')?.value;

  if (!token) {
    if (isApiProtected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const user = verifyToken(token);
  if (!user) {
    if (isApiProtected) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    const res = NextResponse.redirect(new URL('/login', req.url));
    res.cookies.delete('auth_token');
    return res;
  }

  // Role guards
  if (pathname.startsWith('/dashboard/faculty') && user.role !== 'faculty' && user.role !== 'admin') {
    return NextResponse.redirect(new URL(`/dashboard/${user.role}`, req.url));
  }
  if (pathname.startsWith('/dashboard/student') && user.role !== 'student' && user.role !== 'admin') {
    return NextResponse.redirect(new URL(`/dashboard/${user.role}`, req.url));
  }
  if (pathname.startsWith('/dashboard/admin') && user.role !== 'admin') {
    return NextResponse.redirect(new URL(`/dashboard/${user.role}`, req.url));
  }

  return NextResponse.next();
}

// export const config = {
//   matcher: ['/dashboard/:path*', '/scan/:path*', '/api/:path*'],
// };
