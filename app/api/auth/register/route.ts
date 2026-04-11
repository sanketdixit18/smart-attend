// import { NextRequest, NextResponse } from 'next/server';
// import { hashPassword, signToken, generateUID } from '@/lib/auth';
// import { query } from '@/lib/db';

// export async function POST(req: NextRequest) {
//   try {
//     const { name, email, password, role = 'student' } = await req.json();

//     if (!name || !email || !password) {
//       return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
//     }

//     if (password.length < 6) {
//       return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
//     }

//     const existing = await query<unknown[]>('SELECT id FROM users WHERE email = ?', [email]);
//     if ((existing as unknown[]).length > 0) {
//       return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
//     }

//     const hashedPassword = await hashPassword(password);
//     const uid = generateUID();

//     const result = await query<{ insertId: number }>(
//       'INSERT INTO users (name, email, password, role, uid) VALUES (?, ?, ?, ?, ?)',
//       [name, email, hashedPassword, role, uid]
//     );

//     const insertId = (result as { insertId: number }).insertId;

//     const token = signToken({
//       id: insertId,
//       email,
//       name,
//       role: role as 'admin' | 'faculty' | 'student',
//       uid,
//     });

//     const response = NextResponse.json({
//       success: true,
//       user: { id: insertId, name, email, role, uid },
//     });

//     response.cookies.set({
//       name: 'auth_token',
//       value: token,
//       httpOnly: true,
//       secure: false, // false for localhost dev
//       sameSite: 'lax',
//       maxAge: 7 * 24 * 60 * 60,
//       path: '/',
//     });

//     return response;
//   } catch (error) {
//     console.error('Register error:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, signToken, generateUID } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role = 'student', uid } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Students must provide a UID
    if (role === 'student') {
      if (!uid || !uid.trim()) {
        return NextResponse.json({ error: 'UID is required for student registration' }, { status: 400 });
      }

      // Check UID is not already taken
      const existingUID = await query<unknown[]>(
        'SELECT id FROM users WHERE uid = ?',
        [uid.trim().toUpperCase()]
      );
      if (existingUID.length > 0) {
        return NextResponse.json({ error: 'This UID is already registered. Contact your administrator.' }, { status: 409 });
      }
    }

    // Check email not already taken
    const existing = await query<unknown[]>('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    // Use provided UID for students, generate one for faculty/admin
    const finalUID = role === 'student'
      ? uid.trim().toUpperCase()
      : generateUID();

    const result = await query<{ insertId: number }>(
      'INSERT INTO users (name, email, password, role, uid) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, finalUID]
    );

    const insertId = (result as { insertId: number }).insertId;

    const token = signToken({
      id: insertId,
      email,
      name,
      role: role as 'admin' | 'faculty' | 'student',
      uid: finalUID,
    });

    const response = NextResponse.json({
      success: true,
      user: { id: insertId, name, email, role, uid: finalUID },
    });

    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
