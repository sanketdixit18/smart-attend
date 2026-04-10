import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let classes;
  if (user.role === 'faculty') {
    classes = await query(
      'SELECT * FROM classes WHERE faculty_id = ? ORDER BY name',
      [user.id]
    );
  } else if (user.role === 'student') {
    classes = await query(
      `SELECT c.* FROM classes c
       JOIN enrollments e ON e.class_id = c.id
       WHERE e.student_id = ?`,
      [user.id]
    );
  } else {
    classes = await query('SELECT c.*, u.name as faculty_name FROM classes c LEFT JOIN users u ON c.faculty_id = u.id ORDER BY c.name');
  }

  return NextResponse.json({ classes });
}
