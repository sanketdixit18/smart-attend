import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'faculty') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  await query(
    'UPDATE sessions SET is_active = FALSE, ended_at = NOW() WHERE id = ? AND faculty_id = ?',
    [id, user.id]
  );
  return NextResponse.json({ success: true, message: 'Session ended' });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessions = await query<unknown[]>(
    `SELECT s.*, c.name as class_name, c.latitude, c.longitude, c.radius_meters,
     t.token, t.expires_at
     FROM sessions s
     JOIN classes c ON s.class_id = c.id
     LEFT JOIN tokens t ON t.session_id = s.id AND t.expires_at > NOW()
     WHERE s.id = ? AND s.is_active = TRUE
     ORDER BY t.created_at DESC LIMIT 1`,
    [id]
  );
  if (!sessions || (sessions as unknown[]).length === 0) {
    return NextResponse.json({ error: 'Session not found or inactive' }, { status: 404 });
  }
  return NextResponse.json({ session: (sessions as unknown[])[0] });
}
