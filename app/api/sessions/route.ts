import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, generateSessionToken } from '@/lib/auth';
import { query } from '@/lib/db';

// GET - list sessions for faculty
export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'faculty') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sessions = await query(
    `SELECT s.*, c.name as class_name, c.subject 
     FROM sessions s 
     JOIN classes c ON s.class_id = c.id 
     WHERE s.faculty_id = ? 
     ORDER BY s.started_at DESC LIMIT 20`,
    [user.id]
  );

  return NextResponse.json({ sessions });
}

// POST - start a new session
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'faculty') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { class_id } = await req.json();

  // End any active sessions for this class
  await query(
    'UPDATE sessions SET is_active = FALSE, ended_at = NOW() WHERE class_id = ? AND is_active = TRUE',
    [class_id]
  );

  // Create new session
  const result = await query<{ insertId: number }>(
    'INSERT INTO sessions (class_id, faculty_id, is_active) VALUES (?, ?, TRUE)',
    [class_id, user.id]
  );

  const sessionId = (result as { insertId: number }).insertId;

  // Generate initial token (10 sec expiry)
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + 10000);

  await query(
    'INSERT INTO tokens (session_id, token, expires_at) VALUES (?, ?, ?)',
    [sessionId, token, expiresAt]
  );

  return NextResponse.json({ 
    sessionId, 
    token, 
    expiresAt: expiresAt.toISOString(),
    message: 'Session started' 
  });
}
