CREATE DATABASE new_2;
USE new_2;

-- Course Registration System (Final Clean Schema)

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS priority_rules;
DROP TABLE IF EXISTS prerequisites;
DROP TABLE IF EXISTS course_offerings;
DROP TABLE IF EXISTS registration_types;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS academics;
DROP TABLE IF EXISTS professor_profiles;
DROP TABLE IF EXISTS student_profiles;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

--------------------------------------------------
-- 1. USERS (Login for all roles)
--------------------------------------------------
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student','professor','admin') NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

--------------------------------------------------
-- 2. STUDENT PROFILE
--------------------------------------------------
CREATE TABLE student_profiles (
  user_id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  roll_no VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255),
  department VARCHAR(100),
  cpi DECIMAL(4,2),

  FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

--------------------------------------------------
-- 3. PROFESSOR PROFILE
--------------------------------------------------
CREATE TABLE professor_profiles (
  user_id INT PRIMARY KEY,
  faculty_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255),
  email VARCHAR(255),
  department VARCHAR(100),

  FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

--------------------------------------------------
-- 4. ACADEMICS (Year + Semester)
--------------------------------------------------
CREATE TABLE academics (
  academic_id INT AUTO_INCREMENT PRIMARY KEY,
  year INT NOT NULL,
  semester ENUM('sem1','sem2','summer') NOT NULL,
  is_active BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB;

--------------------------------------------------
-- 5. COURSES (Base course info)
--------------------------------------------------
CREATE TABLE courses (
  course_id INT AUTO_INCREMENT PRIMARY KEY,
  course_code VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  credits INT NOT NULL,
  department VARCHAR(100)
) ENGINE=InnoDB;

--------------------------------------------------
-- 6. COURSE OFFERINGS (Professor teaches course)
--------------------------------------------------
CREATE TABLE course_offerings (
  offering_id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  professor_id INT NOT NULL,
  academic_id INT NOT NULL,
  max_seats INT NOT NULL,

  FOREIGN KEY (course_id) REFERENCES courses(course_id)
    ON DELETE CASCADE,
  FOREIGN KEY (professor_id) REFERENCES users(user_id)
    ON DELETE CASCADE,
  FOREIGN KEY (academic_id) REFERENCES academics(academic_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

--------------------------------------------------
-- 7. REGISTRATION TYPES
--------------------------------------------------
CREATE TABLE registration_types (
  reg_type_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
) ENGINE=InnoDB;

-- Example inserts
INSERT INTO registration_types (name) VALUES
('HSS'),
('ADD_DROP'),
('PRE_REG'),
('SUMMER');

--------------------------------------------------
-- 8. ENROLLMENTS (Student Requests)
--------------------------------------------------
CREATE TABLE enrollments (
  enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  offering_id INT NOT NULL,
  reg_type_id INT NOT NULL,

  intent ENUM('major','minor','elective') NOT NULL,

  status ENUM(
    'pending',
    'accepted',
    'rejected'
  ) DEFAULT 'pending',

  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (student_id) REFERENCES users(user_id)
    ON DELETE CASCADE,
  FOREIGN KEY (offering_id) REFERENCES course_offerings(offering_id)
    ON DELETE CASCADE,
  FOREIGN KEY (reg_type_id) REFERENCES registration_types(reg_type_id)
    ON DELETE CASCADE,

  UNIQUE KEY uq_student_course (
    student_id, offering_id, reg_type_id
  )
) ENGINE=InnoDB;

--------------------------------------------------
-- 9. PREREQUISITES
--------------------------------------------------
CREATE TABLE prerequisites (
  course_id INT NOT NULL,
  prerequisite_id INT NOT NULL,

  PRIMARY KEY (course_id, prerequisite_id),

  FOREIGN KEY (course_id) REFERENCES courses(course_id)
    ON DELETE CASCADE,
  FOREIGN KEY (prerequisite_id) REFERENCES courses(course_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

--------------------------------------------------
-- 10. PRIORITY RULES
--------------------------------------------------
CREATE TABLE priority_rules (
  course_id INT PRIMARY KEY,

  weight_cpi DECIMAL(5,2) DEFAULT 1.0,
  weight_year DECIMAL(5,2) DEFAULT 0.1,
  weight_first_come DECIMAL(5,2) DEFAULT 0.01,
  weight_dept_match DECIMAL(5,2) DEFAULT 0.5,

  weight_major DECIMAL(5,2) DEFAULT 1.0,
  weight_minor DECIMAL(5,2) DEFAULT 0.6,
  weight_elective DECIMAL(5,2) DEFAULT 0.4,

  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (course_id) REFERENCES courses(course_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

--------------------------------------------------
-- INDEXES (Performance)
--------------------------------------------------
CREATE INDEX idx_enroll_student ON enrollments(student_id);
CREATE INDEX idx_enroll_offering ON enrollments(offering_id);
CREATE INDEX idx_offering_course ON course_offerings(course_id);
CREATE INDEX idx_offering_prof ON course_offerings(professor_id);