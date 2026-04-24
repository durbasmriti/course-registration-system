-- -------------------------------------------------------
-- USERS
-- -------------------------------------------------------
INSERT INTO users (user_id, username, email, password_hash, role) VALUES
(1, 'admin',        'admin@iitk.ac.in',          '$2b$10$admin_hash',  'admin'),
(2, 'Arnab',        'arnabb@iitk.ac.in',          '$2b$10$prof1_hash',  'professor'),
(3, 'ritwijb',      'ritwijb@iitk.ac.in',         '$2b$10$prof2_hash',  'professor'),
(4, 'vinaykg',      'vinaykg@iitk.ac.in',         '$2b$10$prof3_hash',  'professor'),
(5, 'durbasmriti',  'durbasmrit23@iitk.ac.in',    '$2b$10$std1_hash',   'student'),
(6, 'rpallavi',     'rpallavi23@iitk.ac.in',      '$2b$10$std2_hash',   'student'),
(7, 'jyothika',     'serujy23@iitk.ac.in',        '$2b$10$std3_hash',   'student'),
(8, 'aayushman',    'aayushmank23@iitk.ac.in',    '$2b$10$std4_hash',   'student'),
(9, 'bob',    'bob23@iitk.ac.in',    '$2b$10$std4_hash',   'student');
-- NOTE: removed user_id 9 — was referenced in enrollments but never defined.

-- -------------------------------------------------------
-- STUDENT PROFILES
-- -------------------------------------------------------
INSERT INTO student_profiles (user_id, name, roll_no, department, year, cpi) VALUES
(5, 'Durba',     '200101', 'CSE', 3, 8.5),
(6, 'Pallavi',   '200102', 'CSE', 3, 8.0),
(7, 'Jyothika',  '200103', 'CSE', 3, 8.8),
(8, 'Aayushman', '200104', 'CE',  3, 8.2),
(9, 'bob', '000000', 'XYZ', 3, 7.0);

-- -------------------------------------------------------
-- PROFESSOR PROFILES
-- -------------------------------------------------------
INSERT INTO professor_profiles (user_id, name, department) VALUES
(2, 'Prof. Arnab', 'CSE'),
(3, 'Prof. Ritwij', 'HSS'),
(4, 'Prof. Vinay',  'CE');

-- -------------------------------------------------------
-- ACADEMICS
-- current active semester + one past semester for transcript data
-- -------------------------------------------------------
INSERT INTO academics (academic_id, year, semester, is_active) VALUES
(1, 2025, 'sem1', FALSE),   -- past semester (used in transcript)
(2, 2026, 'sem2', TRUE);    -- current active semester

-- -------------------------------------------------------
-- REGISTRATION TYPES
-- -------------------------------------------------------
INSERT INTO registration_types (reg_type_id, name) VALUES
(1, 'HSS'),
(2, 'ADD_DROP'),
(3, 'PRE_REG'),
(4, 'SUMMER');

-- -------------------------------------------------------
-- COURSES
-- -------------------------------------------------------
INSERT INTO courses (course_id, course_code, title, credits, department) VALUES
(1, 'CS371', 'Design of Reinforced Concrete Structures',      9, 'CSE'),
(2, 'CS610', 'Programming for Performance',                   9, 'CSE'),
(3, 'CE683', 'Humans, Environment and Sustainable Development', 9, 'CE');

INSERT INTO courses (course_id, course_code, title, credits, department) VALUES
(4, 'CS315', 'DataBase Systems', 9, 'CSE');

-- -------------------------------------------------------
-- PREREQUISITES
-- CS610 requires CS371 to be completed first
-- -------------------------------------------------------
INSERT INTO prerequisites (course_id, prerequisite_id) VALUES
(2, 1);

-- -------------------------------------------------------
-- COURSE OFFERINGS
-- offering_id 1-3: current semester (academic_id 2)
-- offering_id 4:   past semester offering of CS371 (academic_id 1)
--                  needed so transcript rows can reference it
-- -------------------------------------------------------
INSERT INTO course_offerings (offering_id, course_id, professor_id, academic_id, max_seats) VALUES
(1, 1, 2, 2, 45),   -- CS371 | Prof. Arnab | sem2 2026
(2, 2, 2, 2, 40),   -- CS610 | Prof. Arnab | sem2 2026
(3, 3, 3, 2, 50),   -- CE683 | Prof. Ritwij | sem2 2026
(4, 1, 2, 1, 45);   -- CS371 | Prof. Arnab | sem1 2025 (past — for transcripts)

-- -------------------------------------------------------
-- PRIORITY RULES
-- -------------------------------------------------------
INSERT INTO priority_rules (course_id, weight_cpi, weight_dept_match) VALUES
(1, 1.0, 0.5),
(2, 1.0, 0.5),
(3, 1.0, 0.5);

-- -------------------------------------------------------
-- STUDENT TRANSCRIPT
-- Records courses completed in past semesters.
-- Durba (5) and Pallavi (6) completed CS371 in sem1 2025 → cleared for CS610.
-- -------------------------------------------------------
INSERT INTO student_transcript (student_id, offering_id, grade, is_passed, completed_at) VALUES
(5, 4, 8.5, TRUE,  '2025-11-30'),   -- Durba     passed CS371 in sem1 2025
(6, 4, 7.8, TRUE,  '2025-11-30'),   -- Pallavi   passed CS371 in sem1 2025
(7, 4, 9.8, TRUE,  '2025-11-30'),   -- Jyothika   passed CS371 in sem1 2025
(8, 4, 8.8, TRUE,  '2025-11-30'),   -- Aayushman   passed CS371 in sem1 2025
(9, 4, 4.0, FALSE, '2025-11-30');   -- bob  attempted CS371 but failed

-- -------------------------------------------------------
-- ENROLLMENTS (current semester requests)
-- Only students who have passed CS371 are enrolled in CS610 (offering 2).
-- Jyothika (7) and Aayushman (8) are correctly NOT enrolled in CS610.
-- -------------------------------------------------------
-- INSERT INTO enrollments (student_id, offering_id, reg_type_id, intent, status) VALUES
-- (5, 1, 3, 'major',    'pending'),   -- Durba     → CS371
-- (5, 2, 3, 'major',    'pending'),   -- Durba     → CS610 (cleared: passed CS371)
-- (6, 1, 3, 'major',    'pending'),   -- Pallavi   → CS371
-- (6, 2, 3, 'minor',    'pending'),   -- Pallavi   → CS610 (cleared: passed CS371)
-- (9, 3, 3, 'major',    'pending'),   -- Jyothika  → CE683 (no CS610 — failed CS371)


