-- Course Registration System — normalized schema (MySQL 8+)

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS course_prerequisites;
DROP TABLE IF EXISTS priority_rules;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS academics;
DROP TABLE IF EXISTS forgot_password;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- Users table (unified for students and professors)
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'professor', 'admin') NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Forgot Password table for password recovery
CREATE TABLE forgot_password (
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, token),
  CONSTRAINT fk_forgot_password_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- Academic periods/semesters table
CREATE TABLE academics (
  academic_id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('semester', 'summer', 'special') NOT NULL,
  year_start INT NOT NULL,
  year_end INT NOT NULL,
  sem_number INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Courses table
CREATE TABLE courses (
  course_id INT AUTO_INCREMENT PRIMARY KEY,
  course_code VARCHAR(32) NOT NULL UNIQUE,
  course_name VARCHAR(255) NOT NULL,
  credits INT NOT NULL,
  max_seats INT NOT NULL DEFAULT 0,
  professor_id INT NOT NULL,
  department VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_courses_professor FOREIGN KEY (professor_id) REFERENCES users(user_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idx_courses_professor ON courses(professor_id);
CREATE INDEX idx_courses_code ON courses(course_code);

-- Course prerequisites table
CREATE TABLE course_prerequisites (
  course_id INT NOT NULL,
  prerequisite_course_id INT NOT NULL,
  PRIMARY KEY (course_id, prerequisite_course_id),
  CONSTRAINT fk_prereq_course FOREIGN KEY (course_id) REFERENCES courses(course_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_prereq_prerequisite FOREIGN KEY (prerequisite_course_id) REFERENCES courses(course_id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- Priority rules table (per-course weight configuration)
CREATE TABLE priority_rules (
  priority_rule_id INT AUTO_INCREMENT PRIMARY KEY,
  course_id VARCHAR(32) NOT NULL,
  weight_cpi DECIMAL(8,4) NOT NULL DEFAULT 1.0,
  weight_year DECIMAL(8,4) NOT NULL DEFAULT 0.1,
  weight_first_come DECIMAL(8,4) NOT NULL DEFAULT 0.01,
  weight_dept_match DECIMAL(8,4) NOT NULL DEFAULT 0.5,
  weight_major_intent DECIMAL(8,4) NOT NULL DEFAULT 1.0,
  weight_minor_intent DECIMAL(8,4) NOT NULL DEFAULT 0.6,
  weight_elective_intent DECIMAL(8,4) NOT NULL DEFAULT 0.4,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Enrollments table with course request status and intent
CREATE TABLE enrollments (
  enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  sem_number INT NOT NULL,
  intent ENUM('major', 'minor', 'elective') NOT NULL DEFAULT 'major',
  status ENUM('pending', 'accepted', 'rejected', 'enrolled', 'waitlisted') NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_enrollments_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_enrollments_course FOREIGN KEY (course_id) REFERENCES courses(course_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  UNIQUE KEY uq_user_course_sem (user_id, course_id, sem_number)
) ENGINE=InnoDB;

CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);