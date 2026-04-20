import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // const users = await query(
  //   'SELECT id, name, email, role, uid, created_at FROM users ORDER BY created_at DESC'
  // );
   const users = await query(
    'SELECT id, name, email, role, uid, created_at FROM users ORDER BY created_at DESC',
    [] // ✅ ADD THIS
  );
  return NextResponse.json({ users });
}
