import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, generateSessionToken } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'faculty') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;

  const sessions = await query<unknown[]>(
    'SELECT * FROM sessions WHERE id = ? AND faculty_id = ? AND is_active = TRUE',
    [id, user.id]
  );
  if (!sessions || (sessions as unknown[]).length === 0) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + 10000);

  await query('INSERT INTO tokens (session_id, token, expires_at) VALUES (?, ?, ?)', [
    id, token, expiresAt,
  ]);

  return NextResponse.json({ token, expiresAt: expiresAt.toISOString() });
}
