import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (user.role === 'faculty') {
    const records = await query(
      `SELECT a.id, u.name as student_name, a.student_uid, c.name as class_name,
       a.date, a.status, a.marked_at
       FROM attendance a
       JOIN users u ON a.student_id = u.id
       JOIN classes c ON a.class_id = c.id
       WHERE c.faculty_id = ?
       ORDER BY a.marked_at DESC
       LIMIT 200`,
      [user.id]
    );
    return NextResponse.json({ records });
  }

  if (user.role === 'admin') {
    const records = await query(
      `SELECT a.id, u.name as student_name, a.student_uid, c.name as class_name,
       f.name as faculty_name, a.date, a.status, a.marked_at
       FROM attendance a
       JOIN users u ON a.student_id = u.id
       JOIN classes c ON a.class_id = c.id
       JOIN users f ON c.faculty_id = f.id
       ORDER BY a.marked_at DESC
       LIMIT 500`
    );
    return NextResponse.json({ records });
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
