SET FOREIGN_KEY_CHECKS = 0;

--------------------------------------------------
-- USERS
--------------------------------------------------
INSERT INTO users (user_id, username, password_hash, role, is_active) VALUES
(1, 'admin', '$2b$10$admin_hash_placeholder', 'admin', TRUE),

-- Professors
(2, 'mehta', '$2b$10$prof1_hash_placeholder', 'professor', TRUE),
(3, 'iyer', '$2b$10$prof2_hash_placeholder', 'professor', TRUE),
(4, 'gupta', '$2b$10$prof3_hash_placeholder', 'professor', TRUE),

-- Students
(5, 'amit_sharma', '$2b$10$student1_hash_placeholder', 'student', TRUE),
(6, 'neha_verma', '$2b$10$student2_hash_placeholder', 'student', TRUE),
(7, 'ravi_kumar', '$2b$10$student3_hash_placeholder', 'student', TRUE),
(8, 'priya_singh', '$2b$10$student4_hash_placeholder', 'student', TRUE),
(9, 'arjun_das', '$2b$10$student5_hash_placeholder', 'student', TRUE);

--------------------------------------------------
-- STUDENT PROFILES
--------------------------------------------------
INSERT INTO student_profiles (user_id, name, roll_no, email, department, cpi) VALUES
(5, 'Amit Sharma', '200101', 'amit.sharma@iitk.ac.in', 'CSE', 8.5),
(6, 'Neha Verma', '200102', 'neha.verma@iitk.ac.in', 'CSE', 9.0),
(7, 'Ravi Kumar', '200103', 'ravi.kumar@iitk.ac.in', 'CE', 7.8),
(8, 'Priya Singh', '200104', 'priya.singh@iitk.ac.in', 'CE', 8.2),
(9, 'Arjun Das', '200105', 'arjun.das@iitk.ac.in', 'CSE', 8.9);

--------------------------------------------------
-- PROFESSOR PROFILES
--------------------------------------------------
INSERT INTO professor_profiles (user_id, faculty_id, name, email, department) VALUES
(2, 'FAC101', 'Prof. Mehta', 'mehta@iitk.ac.in', 'CSE'),
(3, 'FAC102', 'Prof. Iyer', 'iyer@iitk.ac.in', 'CSE'),
(4, 'FAC103', 'Prof. Gupta', 'gupta@iitk.ac.in', 'CE');

--------------------------------------------------
-- ACADEMICS (Current Semester)
--------------------------------------------------
INSERT INTO academics (academic_id, year, semester, is_active) VALUES
(1, 2026, 'sem2', TRUE);

--------------------------------------------------
-- COURSES
--------------------------------------------------
INSERT INTO courses (course_id, course_code, title, credits, department) VALUES
(1, 'CS371', 'Design of Reinforced Concrete Structures', 9, 'CSE'),
(2, 'CS610', 'Programming for Performance', 9, 'CSE'),
(3, 'CE683', 'Humans, Environment and Sustainable Development', 9, 'CE');

--------------------------------------------------
-- COURSE OFFERINGS (link professor + semester + seats)
--------------------------------------------------
INSERT INTO course_offerings (offering_id, course_id, professor_id, academic_id, max_seats) VALUES
(1, 1, 2, 1, 45),  -- CS371 by Mehta
(2, 2, 2, 1, 40),  -- CS610 by Mehta
(3, 3, 3, 1, 50);  -- CE683 by Iyer

--------------------------------------------------
-- REGISTRATION TYPES
--------------------------------------------------
--------------------------------------------------
-- PREREQUISITES
--------------------------------------------------
INSERT INTO prerequisites (course_id, prerequisite_id) VALUES
(2, 1);  -- CS610 requires CS371

--------------------------------------------------
-- PRIORITY RULES
--------------------------------------------------
INSERT INTO priority_rules (
  course_id,
  weight_cpi,
  weight_year,
  weight_first_come,
  weight_dept_match,
  weight_major,
  weight_minor,
  weight_elective
) VALUES
(1, 1.0, 0.1, 0.01, 0.5, 1.0, 0.6, 0.4),
(2, 1.0, 0.1, 0.01, 0.5, 1.0, 0.6, 0.4),
(3, 1.0, 0.1, 0.01, 0.5, 1.0, 0.6, 0.4);

--------------------------------------------------
-- ENROLLMENTS (Requests now use offering_id + reg_type_id)
--------------------------------------------------
INSERT INTO enrollments (
  student_id,
  offering_id,
  reg_type_id,
  intent,
  status,
  requested_at
) VALUES

-- Amit Sharma
(5, 1, 3, 'major', 'pending', NOW()),
(5, 2, 3, 'major', 'pending', NOW()),

-- Neha Verma
(6, 1, 3, 'major', 'pending', NOW()),
(6, 2, 3, 'minor', 'pending', NOW()),

-- Ravi Kumar
(7, 3, 3, 'major', 'pending', NOW()),

-- Priya Singh
(8, 3, 3, 'elective', 'pending', NOW()),

-- Arjun Das
(9, 1, 3, 'major', 'pending', NOW()),
(9, 2, 3, 'major', 'pending', NOW());

SET FOREIGN_KEY_CHECKS = 1;