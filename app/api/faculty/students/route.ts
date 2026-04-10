import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'faculty') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const students = await query(
    `SELECT u.id, u.name, u.email, u.uid, c.name as class_name,
     COUNT(DISTINCT s.id) as total,
     COUNT(DISTINCT a.session_id) as attended,
     ROUND(COUNT(DISTINCT a.session_id) * 100.0 / NULLIF(COUNT(DISTINCT s.id), 0), 1) as percentage
     FROM users u
     JOIN enrollments e ON e.student_id = u.id
     JOIN classes c ON e.class_id = c.id AND c.faculty_id = ?
     LEFT JOIN sessions s ON s.class_id = c.id AND s.is_active = FALSE
     LEFT JOIN attendance a ON a.student_id = u.id AND a.class_id = c.id
     WHERE u.role = 'student'
     GROUP BY u.id, u.name, u.email, u.uid, c.name
     ORDER BY percentage ASC`,
    [user.id]
  );

  return NextResponse.json({ students });
}
