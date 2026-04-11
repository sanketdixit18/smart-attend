// import { NextRequest, NextResponse } from 'next/server';
// import { query } from '@/lib/db';
// import { signToken } from '@/lib/auth';

// // Generate 6-digit OTP
// function generateOTP(): string {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// // Send OTP email using nodemailer (or just log it in dev)
// async function sendOTPEmail(email: string, name: string, otp: string): Promise<boolean> {
//   // In production, use nodemailer with SMTP
//   // For development, we just log it to console
//   console.log('\n========================================');
//   console.log(`📧 OTP EMAIL for ${name} (${email})`);
//   console.log(`🔑 OTP CODE: ${otp}`);
//   console.log('========================================\n');

//   // If SMTP is configured, send real email
//   if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
//     try {
//       const nodemailer = await import('nodemailer');
//       const transporter = nodemailer.default.createTransport({
//         host: process.env.SMTP_HOST,
//         port: Number(process.env.SMTP_PORT) || 587,
//         secure: false,
//         auth: {
//           user: process.env.SMTP_USER,
//           pass: process.env.SMTP_PASS,
//         },
//       });

//       await transporter.sendMail({
//         from: `"SmartAttend" <${process.env.SMTP_USER}>`,
//         to: email,
//         subject: 'Your SmartAttend Login OTP',
//         html: `
//           <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #FFEDFA; border-radius: 16px;">
//             <h2 style="color: #BE5985; margin-bottom: 8px;">SmartAttend Login</h2>
//             <p style="color: #6B3F5A;">Hello <strong>${name}</strong>,</p>
//             <p style="color: #6B3F5A;">Your one-time login code is:</p>
//             <div style="background: white; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; border: 2px solid #FFB8E0;">
//               <span style="font-size: 40px; font-weight: 900; letter-spacing: 12px; color: #BE5985;">${otp}</span>
//             </div>
//             <p style="color: #9B6B85; font-size: 13px;">This code expires in <strong>5 minutes</strong>. Do not share it with anyone.</p>
//             <p style="color: #9B6B85; font-size: 12px; margin-top: 24px;">SmartAttend — Secure Attendance System</p>
//           </div>
//         `,
//       });
//     } catch (err) {
//       console.error('Email send failed:', err);
//       // Still return true so dev can use console OTP
//     }
//   }

//   return true;
// }

// // POST /api/auth/otp
// // Body: { uid } → validates UID, sends OTP
// // Body: { uid, otp } → verifies OTP, returns JWT
// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { uid, otp } = body;

//     if (!uid) {
//       return NextResponse.json({ error: 'UID is required' }, { status: 400 });
//     }

//     // === STEP 1: UID lookup — send OTP ===
//     if (!otp) {
//       const users = await query<Array<{ id: number; name: string; email: string; role: string; uid: string }>>(
//         'SELECT id, name, email, role, uid FROM users WHERE uid = ? AND role = "student"',
//         [uid.trim().toUpperCase()]
//       );

//       if (!users || users.length === 0) {
//         return NextResponse.json({ error: 'UID not found. Contact your administrator.' }, { status: 404 });
//       }

//       const user = users[0];

//       // Invalidate any existing OTPs for this UID
//       await query('UPDATE otp_codes SET used = TRUE WHERE uid = ? AND used = FALSE', [user.uid]);

//       // Generate and store new OTP
//       const code = generateOTP();
//       const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

//       await query(
//         'INSERT INTO otp_codes (uid, email, code, expires_at) VALUES (?, ?, ?, ?)',
//         [user.uid, user.email, code, expiresAt]
//       );

//       await sendOTPEmail(user.email, user.name, code);

//       // Return masked email so student knows where OTP went
//       const maskedEmail = user.email.replace(/(.{2}).+(@.+)/, '$1***$2');

//       return NextResponse.json({
//         success: true,
//         step: 'otp_sent',
//         message: `OTP sent to ${maskedEmail}`,
//         maskedEmail,
//         name: user.name,
//         // In dev mode, return OTP directly so you can test without email
//         ...(process.env.NODE_ENV === 'development' ? { devOtp: code } : {}),
//       });
//     }

//     // === STEP 2: OTP verification ===
//     const otpRows = await query<Array<{ id: number; uid: string; email: string; code: string; expires_at: string; used: boolean }>>(
//       'SELECT * FROM otp_codes WHERE uid = ? AND used = FALSE AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
//       [uid.trim().toUpperCase()]
//     );

//     if (!otpRows || otpRows.length === 0) {
//       return NextResponse.json({ error: 'OTP expired or not found. Request a new one.' }, { status: 400 });
//     }

//     const otpRow = otpRows[0];

//     if (otpRow.code !== otp.trim()) {
//       return NextResponse.json({ error: 'Incorrect OTP. Please try again.' }, { status: 400 });
//     }

//     // Mark OTP as used
//     await query('UPDATE otp_codes SET used = TRUE WHERE id = ?', [otpRow.id]);

//     // Get user details
//     const users = await query<Array<{ id: number; name: string; email: string; role: string; uid: string }>>(
//       'SELECT id, name, email, role, uid FROM users WHERE uid = ?',
//       [uid.trim().toUpperCase()]
//     );

//     const user = users[0];

//     const token = signToken({
//       id: user.id,
//       email: user.email,
//       name: user.name,
//       role: user.role as 'admin' | 'faculty' | 'student',
//       uid: user.uid,
//     });

//     const response = NextResponse.json({
//       success: true,
//       step: 'authenticated',
//       user: { id: user.id, name: user.name, email: user.email, role: user.role, uid: user.uid },
//     });

//     response.cookies.set({
//       name: 'auth_token',
//       value: token,
//       httpOnly: true,
//       secure: false,
//       sameSite: 'lax',
//       maxAge: 7 * 24 * 60 * 60,
//       path: '/',
//     });

//     return response;
//   } catch (error) {
//     console.error('OTP error:', error);
//     return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { signToken } from '@/lib/auth';

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPEmail(email: string, name: string, otp: string): Promise<void> {
  console.log('\n========================================');
  console.log(`📧 OTP EMAIL for ${name} (${email})`);
  console.log(`🔑 OTP CODE: ${otp}`);
  console.log('========================================\n');

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.default.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await transporter.sendMail({
        from: `"SmartAttend" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Your SmartAttend Login OTP',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#FFEDFA;border-radius:16px;">
            <h2 style="color:#BE5985;">SmartAttend Login</h2>
            <p>Hello <strong>${name}</strong>,</p>
            <p>Your one-time login code is:</p>
            <div style="background:white;border-radius:12px;padding:24px;text-align:center;margin:24px 0;border:2px solid #FFB8E0;">
              <span style="font-size:40px;font-weight:900;letter-spacing:12px;color:#BE5985;">${otp}</span>
            </div>
            <p style="color:#9B6B85;font-size:13px;">Expires in <strong>5 minutes</strong>. Do not share.</p>
          </div>
        `,
      });
    } catch (err) {
      console.error('Email send failed:', err);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, otp } = body;

    if (!uid) {
      return NextResponse.json({ error: 'UID is required' }, { status: 400 });
    }

    const cleanUID = uid.trim().toUpperCase();

    // === STEP 1: UID lookup — send OTP ===
    if (!otp) {
      // Check if UID exists in database
      const users = await query<Array<{ id: number; name: string; email: string; role: string; uid: string }>>(
        'SELECT id, name, email, role, uid FROM users WHERE uid = ? AND role = "student"',
        [cleanUID]
      );

      // UID not found — reject, do not auto-register
      if (!users || users.length === 0) {
        return NextResponse.json({
          error: 'UID not found in the system. Your UID must be registered by your institution. Please contact your administrator.',
          notFound: true,
        }, { status: 404 });
      }

      const user = users[0];

      // Invalidate existing OTPs
      await query('UPDATE otp_codes SET used = TRUE WHERE uid = ? AND used = FALSE', [user.uid]);

      // Generate new OTP
      const code = generateOTP();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      await query(
        'INSERT INTO otp_codes (uid, email, code, expires_at) VALUES (?, ?, ?, ?)',
        [user.uid, user.email, code, expiresAt]
      );

      await sendOTPEmail(user.email, user.name, code);

      const maskedEmail = user.email.replace(/(.{2}).+(@.+)/, '$1***$2');

      return NextResponse.json({
        success: true,
        step: 'otp_sent',
        message: `OTP sent to ${maskedEmail}`,
        maskedEmail,
        name: user.name,
        ...(process.env.NODE_ENV === 'development' ? { devOtp: code } : {}),
      });
    }

    // === STEP 2: OTP verification ===
    const otpRows = await query<Array<{ id: number; uid: string; code: string; expires_at: string; used: boolean }>>(
      'SELECT * FROM otp_codes WHERE uid = ? AND used = FALSE AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
      [cleanUID]
    );

    if (!otpRows || otpRows.length === 0) {
      return NextResponse.json({ error: 'OTP expired or not found. Request a new one.' }, { status: 400 });
    }

    const otpRow = otpRows[0];

    if (otpRow.code !== otp.trim()) {
      return NextResponse.json({ error: 'Incorrect OTP. Please try again.' }, { status: 400 });
    }

    // Mark OTP used
    await query('UPDATE otp_codes SET used = TRUE WHERE id = ?', [otpRow.id]);

    // Get user
    const users = await query<Array<{ id: number; name: string; email: string; role: string; uid: string }>>(
      'SELECT id, name, email, role, uid FROM users WHERE uid = ?',
      [cleanUID]
    );

    const user = users[0];

    const token = signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'admin' | 'faculty' | 'student',
      uid: user.uid,
    });

    const response = NextResponse.json({
      success: true,
      step: 'authenticated',
      user: { id: user.id, name: user.name, email: user.email, role: user.role, uid: user.uid },
    });

    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('OTP error:', error);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
