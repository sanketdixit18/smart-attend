import { NextRequest, NextResponse } from 'next/server';
import { comparePassword, signToken } from '@/lib/auth';
import { query } from '@/lib/db';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'faculty' | 'student';
  uid: string;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const users = await query<User[]>('SELECT * FROM users WHERE email = ?', [email]);
    const user = (users as User[])[0];

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      uid: user.uid,
    });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, uid: user.uid },
    });

    // Set cookie with explicit options to ensure it's available immediately
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: false, // false for localhost dev
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
