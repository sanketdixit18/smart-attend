import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function POST(req: NextRequest) {
  try {
    // Layer 1: JWT Auth
    const user = await getCurrentUser();
    if (!user || user.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized. Students only.', layer: 1 }, { status: 401 });
    }

    const { token, latitude, longitude } = await req.json();
    if (!token) {
      return NextResponse.json({ error: 'QR token is required', layer: 2 }, { status: 400 });
    }

    // Layer 2: Token valid + not expired
    const tokens = await query<unknown[]>(
      'SELECT t.*, s.class_id, s.is_active, c.latitude as class_lat, c.longitude as class_lon, c.radius_meters FROM tokens t JOIN sessions s ON t.session_id = s.id JOIN classes c ON s.class_id = c.id WHERE t.token = ? AND t.expires_at > NOW()',
      [token]
    );

    if (!tokens || (tokens as unknown[]).length === 0) {
      return NextResponse.json({ error: 'QR code expired or invalid. Please scan again.', layer: 2 }, { status: 400 });
    }

    const tokenData = (tokens as Record<string, unknown>[])[0];

    // Layer 3: Session active
    if (!tokenData.is_active) {
      return NextResponse.json({ error: 'Attendance session has ended.', layer: 3 }, { status: 400 });
    }

    // Layer 4: Duplicate check
    const existing = await query<unknown[]>(
      'SELECT id FROM attendance WHERE student_id = ? AND session_id = ?',
      [user.id, tokenData.session_id]
    );
    if (existing && (existing as unknown[]).length > 0) {
      return NextResponse.json({ error: 'Attendance already marked for this session.', layer: 4 }, { status: 409 });
    }

    // Layer 5: Location verification
    if (latitude && longitude && tokenData.class_lat && tokenData.class_lon) {
      const distance = haversineDistance(
        latitude,
        longitude,
        tokenData.class_lat as number,
        tokenData.class_lon as number
      );
      if (distance > (tokenData.radius_meters as number)) {
        return NextResponse.json({
          error: `You are ${Math.round(distance)}m away. Must be within ${tokenData.radius_meters}m of classroom.`,
          layer: 5,
          distance: Math.round(distance),
        }, { status: 400 });
      }
    }

    // All layers passed — mark attendance
    await query(
      'INSERT INTO attendance (student_uid, student_id, class_id, session_id, date, status, latitude, longitude) VALUES (?, ?, ?, ?, CURDATE(), "present", ?, ?)',
      [user.uid, user.id, tokenData.class_id, tokenData.session_id, latitude || null, longitude || null]
    );

    return NextResponse.json({
      success: true,
      message: 'Attendance marked successfully! ✓',
      uid: user.uid,
    });
  } catch (error) {
    console.error('Attendance error:', error);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
