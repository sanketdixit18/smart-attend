import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (user.role === 'student') {
    const stats = await query(
      `SELECT c.name as class_name, c.id as class_id,
       COUNT(DISTINCT s.id) as total_sessions,
       COUNT(DISTINCT a.session_id) as attended,
       ROUND(COUNT(DISTINCT a.session_id) * 100.0 / NULLIF(COUNT(DISTINCT s.id), 0), 1) as percentage
       FROM classes c
       JOIN enrollments e ON e.class_id = c.id AND e.student_id = ?
       JOIN sessions s ON s.class_id = c.id AND s.is_active = FALSE
       LEFT JOIN attendance a ON a.class_id = c.id AND a.student_id = ?
       GROUP BY c.id, c.name`,
      [user.id, user.id]
    );

    const recent = await query(
      `SELECT a.*, c.name as class_name, s.started_at as session_date
       FROM attendance a
       JOIN classes c ON a.class_id = c.id
       JOIN sessions s ON a.session_id = s.id
       WHERE a.student_id = ?
       ORDER BY a.marked_at DESC LIMIT 10`,
      [user.id]
    );

    return NextResponse.json({ stats, recent });
  }

  if (user.role === 'faculty') {
    const classStats = await query(
      `SELECT c.id, c.name, c.subject,
       COUNT(DISTINCT s.id) as total_sessions,
       COUNT(DISTINCT a.student_id) as unique_students,
       COUNT(a.id) as total_attendance
       FROM classes c
       LEFT JOIN sessions s ON s.class_id = c.id
       LEFT JOIN attendance a ON a.class_id = c.id
       WHERE c.faculty_id = ?
       GROUP BY c.id, c.name, c.subject`,
      [user.id]
    );

    const lowAttendance = await query(
      `SELECT u.name, u.email, u.uid, c.name as class_name,
       ROUND(COUNT(DISTINCT a.session_id) * 100.0 / NULLIF(COUNT(DISTINCT s.id), 0), 1) as percentage
       FROM users u
       JOIN enrollments e ON e.student_id = u.id
       JOIN classes c ON e.class_id = c.id AND c.faculty_id = ?
       JOIN sessions s ON s.class_id = c.id AND s.is_active = FALSE
       LEFT JOIN attendance a ON a.student_id = u.id AND a.class_id = c.id
       GROUP BY u.id, u.name, u.email, u.uid, c.name
       HAVING percentage < 75 OR percentage IS NULL
       ORDER BY percentage ASC LIMIT 10`,
      [user.id]
    );

    const weeklyData = await query(
      `SELECT DATE(a.marked_at) as date, COUNT(*) as count
       FROM attendance a
       JOIN classes c ON a.class_id = c.id
       WHERE c.faculty_id = ? AND a.marked_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       GROUP BY DATE(a.marked_at)
       ORDER BY date`,
      [user.id]
    );

    return NextResponse.json({ classStats, lowAttendance, weeklyData });
  }

  if (user.role === 'admin') {
    const overview = await query(
      `SELECT 
       (SELECT COUNT(*) FROM users WHERE role = 'student') as total_students,
       (SELECT COUNT(*) FROM users WHERE role = 'faculty') as total_faculty,
       (SELECT COUNT(*) FROM classes) as total_classes,
       (SELECT COUNT(*) FROM sessions WHERE DATE(started_at) = CURDATE()) as sessions_today,
       (SELECT COUNT(*) FROM attendance WHERE DATE(marked_at) = CURDATE()) as attendance_today`
    );

    const recentSessions = await query(
      `SELECT s.*, c.name as class_name, u.name as faculty_name,
       COUNT(a.id) as attendance_count
       FROM sessions s
       JOIN classes c ON s.class_id = c.id
       JOIN users u ON s.faculty_id = u.id
       LEFT JOIN attendance a ON a.session_id = s.id
       GROUP BY s.id
       ORDER BY s.started_at DESC LIMIT 10`
    );

    return NextResponse.json({ overview: (overview as unknown[])[0], recentSessions });
  }

  return NextResponse.json({ error: 'Unknown role' }, { status: 400 });
}
