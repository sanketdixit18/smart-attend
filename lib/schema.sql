-- SmartAttend Database Schema
CREATE DATABASE IF NOT EXISTS smart_attend;
USE smart_attend;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'faculty', 'student') NOT NULL DEFAULT 'student',
  uid VARCHAR(50) UNIQUE NOT NULL,
  avatar VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS classes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  faculty_id INT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  radius_meters INT DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (faculty_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  class_id INT NOT NULL,
  faculty_id INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP NULL,
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (faculty_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_uid VARCHAR(50) NOT NULL,
  student_id INT NOT NULL,
  class_id INT NOT NULL,
  session_id INT NOT NULL,
  date DATE NOT NULL,
  status ENUM('present', 'absent', 'late') DEFAULT 'present',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (session_id) REFERENCES sessions(id),
  UNIQUE KEY unique_attendance (student_id, session_id)
);

CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  class_id INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_enrollment (student_id, class_id),
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (class_id) REFERENCES classes(id)
);

-- Sample data
INSERT IGNORE INTO users (name, email, password, role, uid) VALUES
('Admin User', 'admin@smartattend.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewvBiJYS3HNwCPVa', 'admin', 'SA-ADMIN-001'),
('Dr. Sarah Johnson', 'faculty@smartattend.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewvBiJYS3HNwCPVa', 'faculty', 'SA-FAC-001'),
('Alex Kumar', 'student@smartattend.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewvBiJYS3HNwCPVa', 'student', 'SA-STU-001');
-- Default password for all: password123

INSERT IGNORE INTO classes (name, subject, faculty_id, latitude, longitude, radius_meters) VALUES
('CS301 - Advanced Algorithms', 'Computer Science', 2, 28.6139, 77.2090, 100),
('CS401 - Machine Learning', 'Computer Science', 2, 28.6145, 77.2095, 100),
('CS201 - Data Structures', 'Computer Science', 2, 28.6135, 77.2085, 100);

-- OTP table for UID-based student login
CREATE TABLE IF NOT EXISTS otp_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uid VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add more sample students (pre-added by admin, no self-registration)
INSERT IGNORE INTO users (name, email, password, role, uid) VALUES
('Rahul Sharma', 'rahul@college.edu', '$2a$10$dummy', 'student', 'SA2024001'),
('Priya Patel', 'priya@college.edu', '$2a$10$dummy', 'student', 'SA2024002'),
('Amit Singh', 'amit@college.edu', '$2a$10$dummy', 'student', 'SA2024003'),
('Sneha Gupta', 'sneha@college.edu', '$2a$10$dummy', 'student', 'SA2024004');

-- Add index for OTP lookups
CREATE INDEX IF NOT EXISTS idx_otp_uid ON otp_codes(uid);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON otp_codes(expires_at);
