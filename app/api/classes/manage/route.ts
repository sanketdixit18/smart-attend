import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'faculty' && user.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, subject, latitude, longitude, radius_meters = 100 } = await req.json();

  if (!name || !subject) {
    return NextResponse.json({ error: 'Name and subject are required' }, { status: 400 });
  }

  const result = await query<{ insertId: number }>(
    'INSERT INTO classes (name, subject, faculty_id, latitude, longitude, radius_meters) VALUES (?, ?, ?, ?, ?, ?)',
    [name, subject, user.id, latitude || null, longitude || null, radius_meters]
  );

  return NextResponse.json({ success: true, classId: (result as { insertId: number }).insertId, message: 'Class created successfully' });
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'faculty' && user.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await req.json();
  await query('DELETE FROM classes WHERE id = ? AND faculty_id = ?', [id, user.id]);
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'faculty' && user.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, name, subject, latitude, longitude, radius_meters } = await req.json();
  await query(
    'UPDATE classes SET name=?, subject=?, latitude=?, longitude=?, radius_meters=? WHERE id=? AND faculty_id=?',
    [name, subject, latitude, longitude, radius_meters, id, user.id]
  );
  return NextResponse.json({ success: true });
}
