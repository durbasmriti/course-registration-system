-- Course Registration System — normalized schema (MySQL 8+)

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS waitlist;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS priority_rules;
DROP TABLE IF EXISTS course_prerequisites;
DROP TABLE IF EXISTS course_offerings;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS academics;
DROP TABLE IF EXISTS forgot_password;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------
-- USERS (authentication)
-- ----------------------
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student','professor','admin') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ----------------------
-- STUDENTS (academic info)
-- ----------------------
CREATE TABLE students (
  user_id INT PRIMARY KEY,
  dept VARCHAR(50),
  year INT,
  cpi DECIMAL(4,2),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------
-- PASSWORD RESET
-- ----------------------
CREATE TABLE forgot_password (
  token VARCHAR(255) PRIMARY KEY,
  user_id INT,
  expires_at TIMESTAMP,
  is_used BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------
-- ACADEMIC TERMS
-- ----------------------
CREATE TABLE academics (
  academic_id INT AUTO_INCREMENT PRIMARY KEY,
  year INT NOT NULL,
  semester INT NOT NULL,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB;

-- ----------------------
-- COURSES (master)
-- ----------------------
CREATE TABLE courses (
  course_id INT AUTO_INCREMENT PRIMARY KEY,
  course_code VARCHAR(20) UNIQUE NOT NULL,
  course_name VARCHAR(255) NOT NULL,
  credits INT NOT NULL
) ENGINE=InnoDB;

-- ----------------------
-- COURSE OFFERINGS (per semester)
-- ----------------------
CREATE TABLE course_offerings (
  offering_id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  academic_id INT NOT NULL,
  professor_id INT NOT NULL,
  max_seats INT NOT NULL,
  department VARCHAR(100),

  FOREIGN KEY (course_id) REFERENCES courses(course_id)
    ON DELETE CASCADE,
  FOREIGN KEY (academic_id) REFERENCES academics(academic_id)
    ON DELETE CASCADE,
  FOREIGN KEY (professor_id) REFERENCES users(user_id)
    ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ----------------------
-- PREREQUISITES
-- ----------------------
CREATE TABLE course_prerequisites (
  course_id INT,
  prerequisite_course_id INT,
  PRIMARY KEY (course_id, prerequisite_course_id),

  FOREIGN KEY (course_id) REFERENCES courses(course_id)
    ON DELETE CASCADE,
  FOREIGN KEY (prerequisite_course_id) REFERENCES courses(course_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------
-- REQUESTS (student actions)
-- ----------------------
CREATE TABLE requests (
  request_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  offering_id INT NOT NULL,

  intent ENUM('major','minor','elective') DEFAULT 'major',
  status ENUM('requested','accepted','rejected','waitlisted') DEFAULT 'requested',

  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES students(user_id)
    ON DELETE CASCADE,
  FOREIGN KEY (offering_id) REFERENCES course_offerings(offering_id)
    ON DELETE CASCADE,

  UNIQUE KEY uq_user_offering (user_id, offering_id)
) ENGINE=InnoDB;

-- ----------------------
-- PRIORITY RULES
-- ----------------------
CREATE TABLE priority_rules (
  offering_id INT PRIMARY KEY,

  weight_cpi DECIMAL(8,4) DEFAULT 1.0,
  weight_year DECIMAL(8,4) DEFAULT 0.1,
  weight_first_come DECIMAL(8,4) DEFAULT 0.01,
  weight_dept DECIMAL(8,4) DEFAULT 0.5,

  FOREIGN KEY (offering_id) REFERENCES course_offerings(offering_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------
-- ENROLLMENTS (final allocation)
-- ----------------------
CREATE TABLE enrollments (
  user_id INT,
  offering_id INT,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (user_id, offering_id),

  FOREIGN KEY (user_id) REFERENCES students(user_id)
    ON DELETE CASCADE,
  FOREIGN KEY (offering_id) REFERENCES course_offerings(offering_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------
-- WAITLIST (ordered)
-- ----------------------
CREATE TABLE waitlist (
  user_id INT,
  offering_id INT,
  position INT,

  PRIMARY KEY (user_id, offering_id),
  UNIQUE KEY uq_position (offering_id, position),

  FOREIGN KEY (user_id) REFERENCES students(user_id)
    ON DELETE CASCADE,
  FOREIGN KEY (offering_id) REFERENCES course_offerings(offering_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;