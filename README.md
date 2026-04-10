# 🎓 SmartAttend — Smart Attendance System

A full-stack attendance management system built with **Next.js App Router**, featuring multi-layer fraud prevention via rotating QR codes, GPS verification, JWT authentication, and real-time updates.

## ✨ Features
- 🔄 Rotating QR Codes (new token every 10 seconds)
- 🔐 JWT + bcrypt Auth with role-based access
- 📍 GPS Verification (must be within 100m of classroom)
- 🆔 Unique UID per student, verified server-side only
- 🚫 Duplicate prevention enforced at database level
- 📊 Analytics dashboards with Recharts
- 📱 PWA ready
- 📤 CSV export for attendance records

## 🛠 Tech Stack
Next.js 14 App Router · Tailwind CSS · Framer Motion · MySQL · JWT · bcrypt · react-qr-code · html5-qrcode · Recharts · Lucide React

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.local.example .env.local
# Edit .env.local with your MySQL credentials and a JWT_SECRET
```

### 3. Set up MySQL
```bash
mysql -u root -p < lib/schema.sql
```

### 4. Run
```bash
npm run dev
# Open http://localhost:3000
```

## 🔑 Demo Accounts (password: password123)
| Role | Email |
|---|---|
| Admin | admin@smartattend.com |
| Faculty | faculty@smartattend.com |
| Student | student@smartattend.com |

## 🔐 5-Layer Attendance Security
1. JWT identity authentication
2. Session active check
3. Token freshness (10-second window)
4. Duplicate attendance prevention
5. GPS classroom proximity check

## 📂 Key Routes
- `/` — Landing page
- `/login` & `/register` — Auth
- `/dashboard/faculty` — Faculty dashboard with QR generation
- `/dashboard/student` — Student overview
- `/scan` — QR scanner
- `/dashboard/faculty/analytics` — Charts
- `/dashboard/admin` — System admin

## 🗄 Database Schema
```sql
users, classes, sessions, tokens, attendance, enrollments
```
See `lib/schema.sql` for full schema and sample data.
